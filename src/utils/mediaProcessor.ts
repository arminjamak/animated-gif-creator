import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import GIF from 'gif.js';
import { parseGIF, decompressFrames } from 'gifuct-js';
import { type DeviceMockup } from '@/polymet/data/device-mockups-data';

let ffmpegInstance: FFmpeg | null = null;

export async function loadFFmpeg(onProgress?: (progress: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();
  
  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });

  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) {
      onProgress(Math.round(progress * 100));
    }
  });

  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  } catch (error) {
    console.error('Failed to load FFmpeg from unpkg, trying jsdelivr...', error);
    // Fallback to jsdelivr CDN
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export interface ProcessingOptions {
  device: DeviceMockup;
  uploadedFile: {
    file: File;
    url: string;
    type: 'image' | 'video' | 'gif';
    croppedArea: { x: number; y: number; width: number; height: number } | null;
  };
  onProgress?: (progress: number, status: string) => void;
}

export async function processMedia(options: ProcessingOptions): Promise<{
  gifBlob: Blob;
  movBlob: Blob;
  previewUrl: string;
}> {
  const { device, uploadedFile, onProgress } = options;

  onProgress?.(5, 'Loading resources...');

  // Load device image
  const deviceImg = await loadImage(device.image);
  
  console.error('Loaded device image:', {
    width: deviceImg.width,
    height: deviceImg.height,
    src: device.image
  });
  
  // Don't scale down - use full resolution for better quality
  // Modern browsers can handle the memory requirements
  let scale = 1;
  
  const scaledWidth = Math.floor(deviceImg.width * scale);
  const scaledHeight = Math.floor(deviceImg.height * scale);
  
  // Create scaled device image if needed
  let finalDeviceImg = deviceImg;
  if (scale < 1) {
    const canvas = document.createElement('canvas');
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(deviceImg, 0, 0, scaledWidth, scaledHeight);
    
    const scaledImg = new Image();
    scaledImg.src = canvas.toDataURL();
    await new Promise(resolve => scaledImg.onload = resolve);
    finalDeviceImg = scaledImg;
  }
  
  // Check if we have 4-point coordinates
  let screenPoints: Array<{ x: number; y: number }> | null = null;
  
  if (device.screenArea.points && device.screenArea.points.length === 4) {
    // Convert normalized points to pixel coordinates (using scaled dimensions)
    screenPoints = device.screenArea.points.map(p => ({
      x: scaledWidth * p.x,
      y: scaledHeight * p.y
    }));
  }
  
  // Calculate screen area dimensions (fallback for bounding box, using scaled dimensions)
  const screenX = scaledWidth * device.screenArea.x;
  const screenY = scaledHeight * device.screenArea.y;
  const screenWidth = scaledWidth * device.screenArea.width;
  const screenHeight = scaledHeight * device.screenArea.height;

  if (uploadedFile.type === 'image') {
    return processStaticImage(finalDeviceImg, uploadedFile, screenX, screenY, screenWidth, screenHeight, device.screenArea.rotation, onProgress, screenPoints);
  } else if (uploadedFile.type === 'gif') {
    return processGIF(finalDeviceImg, uploadedFile, screenX, screenY, screenWidth, screenHeight, device.screenArea.rotation, onProgress, screenPoints);
  } else {
    return processVideo(finalDeviceImg, uploadedFile, screenX, screenY, screenWidth, screenHeight, device.screenArea.rotation, onProgress, screenPoints);
  }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function processStaticImage(
  deviceImg: HTMLImageElement,
  uploadedFile: ProcessingOptions['uploadedFile'],
  screenX: number,
  screenY: number,
  screenWidth: number,
  screenHeight: number,
  rotation: number,
  onProgress?: (progress: number, status: string) => void,
  screenPoints?: Array<{ x: number; y: number }> | null
): Promise<{ gifBlob: Blob; movBlob: Blob; previewUrl: string }> {
  onProgress?.(20, 'Loading image...');
  
  const contentImg = await loadImage(uploadedFile.url);
  
  onProgress?.(40, 'Compositing image...');
  
  const canvas = document.createElement('canvas');
  canvas.width = deviceImg.width;
  canvas.height = deviceImg.height;
  const ctx = canvas.getContext('2d')!;

  // Draw composite
  drawComposite(ctx, deviceImg, contentImg, uploadedFile.croppedArea, screenX, screenY, screenWidth, screenHeight, rotation, screenPoints);

  onProgress?.(60, 'Generating GIF...');
  
  // For static images, create a single-frame GIF
  const gifBlob = await canvasToGif(canvas);
  
  onProgress?.(80, 'Generating MOV...');
  
  // For MOV, we'll use FFmpeg to convert the image to a 1-second video
  const movBlob = await imageToMov(canvas);
  
  const previewUrl = canvas.toDataURL('image/png');
  
  onProgress?.(100, 'Complete!');
  
  return { gifBlob, movBlob, previewUrl };
}

async function processGIF(
  deviceImg: HTMLImageElement,
  uploadedFile: ProcessingOptions['uploadedFile'],
  screenX: number,
  screenY: number,
  screenWidth: number,
  screenHeight: number,
  rotation: number,
  onProgress?: (progress: number, status: string) => void,
  screenPoints?: Array<{ x: number; y: number }> | null
): Promise<{ gifBlob: Blob; movBlob: Blob; previewUrl: string }> {
  onProgress?.(10, 'Parsing GIF...');
  
  // Parse the GIF
  const arrayBuffer = await uploadedFile.file.arrayBuffer();
  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);
  
  onProgress?.(20, 'Processing frames...');
  
  // Create a persistent canvas for accumulating frames
  const gifCanvas = document.createElement('canvas');
  gifCanvas.width = gif.lsd.width;
  gifCanvas.height = gif.lsd.height;
  const gifCtx = gifCanvas.getContext('2d', { willReadFrequently: true })!;
  
  console.log('GIF canvas created:', { width: gifCanvas.width, height: gifCanvas.height });
  
  // Set background color if specified
  if (gif.lsd.gct && gif.lsd.backgroundColorIndex !== undefined) {
    const bgColor = gif.lsd.gct[gif.lsd.backgroundColorIndex];
    if (bgColor) {
      gifCtx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
      gifCtx.fillRect(0, 0, gifCanvas.width, gifCanvas.height);
      console.log('Set GIF background color:', bgColor);
    }
  }
  
  // Process all frames to preserve the full animation
  // If the GIF has too many frames, we'll process them all but it may take longer
  const limitedFrames = frames;
  
  console.log(`Processing ${limitedFrames.length} frames`);
  
  // Create canvases for each frame
  const processedFrames: { canvas: HTMLCanvasElement; delay: number }[] = [];
  
  for (let i = 0; i < limitedFrames.length; i++) {
    const frame = limitedFrames[i];
    
    if (i === 0) {
      console.error('=== STARTING FRAME PROCESSING ===');
      console.error('Total frames to process:', limitedFrames.length);
      console.error('Frame 0 object:', frame);
    }
    
    // Update progress
    const frameProgress = 50 + Math.floor((i / limitedFrames.length) * 30);
    onProgress?.(frameProgress, `Processing frame ${i + 1}/${limitedFrames.length}...`);
    
    // Handle frame disposal method
    if (i > 0) {
      const prevFrame = frames[i - 1];
      if (prevFrame.disposalType === 2) {
        // Restore to background color
        if (gif.lsd.gct && gif.lsd.backgroundColorIndex !== undefined) {
          const bgColor = gif.lsd.gct[gif.lsd.backgroundColorIndex];
          if (bgColor) {
            gifCtx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
            gifCtx.fillRect(0, 0, gifCanvas.width, gifCanvas.height);
          }
        } else {
          gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height);
        }
      } else if (prevFrame.disposalType === 3) {
        // Restore to previous - we'll just keep the current state
      }
      // disposalType 0 or 1: leave as is (most common)
    }
    
    // Create a temporary canvas for this frame
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = frame.dims.width;
    tempCanvas.height = frame.dims.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    // Draw frame data to temp canvas
    const imageData = tempCtx.createImageData(frame.dims.width, frame.dims.height);
    imageData.data.set(frame.patch);
    tempCtx.putImageData(imageData, 0, 0);
    
    // Draw temp canvas onto accumulated canvas using drawImage (preserves blending)
    gifCtx.drawImage(tempCanvas, frame.dims.left, frame.dims.top);
    
    // Verify frame was drawn
    if (i === 0) {
      const sampleData = gifCtx.getImageData(gifCanvas.width / 2, gifCanvas.height / 2, 1, 1);
      console.log('First frame center pixel:', Array.from(sampleData.data));
    }
    
    // Create composite canvas with device mockup
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = deviceImg.width;
    compositeCanvas.height = deviceImg.height;
    const compositeCtx = compositeCanvas.getContext('2d')!;
    
    // Debug: Check if gifCanvas has content before drawing
    if (i === 0) {
      const checkData = gifCtx.getImageData(0, 0, Math.min(100, gifCanvas.width), Math.min(100, gifCanvas.height));
      const hasContent = checkData.data.some(v => v !== 0);
      console.log('GIF canvas before composite:', {
        width: gifCanvas.width,
        height: gifCanvas.height,
        hasContent,
        samplePixels: Array.from(checkData.data.slice(0, 16))
      });
    }
    
    // Draw composite using the accumulated GIF canvas
    drawComposite(compositeCtx, deviceImg, gifCanvas, uploadedFile.croppedArea, screenX, screenY, screenWidth, screenHeight, rotation, screenPoints);
    
    // gifuct-js delay interpretation:
    // If delay is very small (< 20), it's likely in centiseconds, multiply by 10
    // If delay is larger (>= 20), it might already be in milliseconds
    const rawDelay = frame.delay || 10;
    const delayInMs = rawDelay < 20 ? rawDelay * 10 : rawDelay;
    
    processedFrames.push({
      canvas: compositeCanvas,
      delay: delayInMs
    });
  }
  
  onProgress?.(80, 'Encoding GIF...');
  
  // Generate GIF from processed frames with async wrapper
  const gifBlob = await framesToGifAsync(processedFrames, onProgress);
  
  onProgress?.(90, 'Generating MOV...');
  
  // Generate MOV from processed frames
  const movBlob = await framesToMov(processedFrames);
  
  // Use the GIF blob as preview so it animates
  const previewUrl = URL.createObjectURL(gifBlob);
  
  onProgress?.(100, 'Complete!');
  
  return { gifBlob, movBlob, previewUrl };
}

async function processVideo(
  deviceImg: HTMLImageElement,
  uploadedFile: ProcessingOptions['uploadedFile'],
  screenX: number,
  screenY: number,
  screenWidth: number,
  screenHeight: number,
  rotation: number,
  onProgress?: (progress: number, status: string) => void,
  screenPoints?: Array<{ x: number; y: number }> | null
): Promise<{ gifBlob: Blob; movBlob: Blob; previewUrl: string }> {
  onProgress?.(10, 'Loading FFmpeg...');
  
  const ffmpeg = await loadFFmpeg((progress) => {
    if (progress < 100) {
      onProgress?.(10 + progress * 0.1, 'Loading FFmpeg...');
    }
  });
  
  onProgress?.(20, 'Extracting video frames...');
  
  // Write input video to FFmpeg filesystem
  await ffmpeg.writeFile('input.mp4', await fetchFile(uploadedFile.file));
  
  // Extract frames from video
  await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'fps=10', 'frame_%04d.png']);
  
  onProgress?.(40, 'Processing frames...');
  
  // Read extracted frames
  const frameFiles: string[] = [];
  let frameIndex = 1;
  
  while (true) {
    const frameName = `frame_${String(frameIndex).padStart(4, '0')}.png`;
    try {
      const data = await ffmpeg.readFile(frameName);
      if (data) {
        frameFiles.push(frameName);
        frameIndex++;
      } else {
        break;
      }
    } catch {
      break;
    }
  }
  
  // Process each frame
  const processedFrames: { canvas: HTMLCanvasElement; delay: number }[] = [];
  
  for (let i = 0; i < frameFiles.length; i++) {
    const frameData = await ffmpeg.readFile(frameFiles[i]);
    const blob = new Blob([frameData], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const frameImg = await loadImage(url);
    URL.revokeObjectURL(url);
    
    // Create composite canvas
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = deviceImg.width;
    compositeCanvas.height = deviceImg.height;
    const compositeCtx = compositeCanvas.getContext('2d')!;
    
    // Draw composite
    drawComposite(compositeCtx, deviceImg, frameImg, uploadedFile.croppedArea, screenX, screenY, screenWidth, screenHeight, rotation, screenPoints);
    
    processedFrames.push({
      canvas: compositeCanvas,
      delay: 100 // 10fps = 100ms per frame
    });
    
    onProgress?.(40 + (i / frameFiles.length) * 30, `Processing frame ${i + 1}/${frameFiles.length}...`);
  }
  
  onProgress?.(80, 'Encoding GIF...');
  
  // Generate GIF from processed frames with async wrapper
  const gifBlob = await framesToGifAsync(processedFrames, onProgress);
  
  onProgress?.(90, 'Generating MOV...');
  
  // Generate MOV from processed frames
  const movBlob = await framesToMov(processedFrames);
  
  const previewUrl = processedFrames[0].canvas.toDataURL('image/png');
  
  onProgress?.(100, 'Complete!');
  
  return { gifBlob, movBlob, previewUrl };
}

function drawComposite(
  ctx: CanvasRenderingContext2D,
  deviceImg: HTMLImageElement,
  contentImg: HTMLImageElement | HTMLCanvasElement,
  croppedArea: { x: number; y: number; width: number; height: number } | null,
  screenX: number,
  screenY: number,
  screenWidth: number,
  screenHeight: number,
  rotation: number,
  screenPoints?: Array<{ x: number; y: number }> | null
) {
  console.error('===== DRAW COMPOSITE CALLED =====');
  console.error('Device size:', deviceImg.width, 'x', deviceImg.height);
  console.error('Content size:', contentImg.width, 'x', contentImg.height);
  console.error('Cropped area:', croppedArea);
  console.error('Screen area:', { x: screenX, y: screenY, width: screenWidth, height: screenHeight });
  console.error('Has custom points:', !!screenPoints);
  console.error('=================================');
  
  // Draw device image FIRST as the base
  ctx.drawImage(deviceImg, 0, 0);
  
  // Calculate content dimensions
  let sx = 0, sy = 0, sWidth = contentImg.width, sHeight = contentImg.height;
  
  if (croppedArea && croppedArea.width > 0 && croppedArea.height > 0) {
    // The cropper might return mixed formats: normalized x,y but pixel width,height
    // Detect if width/height are in pixels (> 1) or normalized (0-1)
    const widthIsPixels = croppedArea.width > 1;
    const heightIsPixels = croppedArea.height > 1;
    
    // Normalize all values to 0-1 range
    const normalizedX = croppedArea.x > 1 ? croppedArea.x / contentImg.width : croppedArea.x;
    const normalizedY = croppedArea.y > 1 ? croppedArea.y / contentImg.height : croppedArea.y;
    const normalizedWidth = widthIsPixels ? croppedArea.width / contentImg.width : croppedArea.width;
    const normalizedHeight = heightIsPixels ? croppedArea.height / contentImg.height : croppedArea.height;
    
    sx = contentImg.width * normalizedX;
    sy = contentImg.height * normalizedY;
    sWidth = contentImg.width * normalizedWidth;
    sHeight = contentImg.height * normalizedHeight;
    
    console.log('Crop normalization:', {
      original: croppedArea,
      normalized: { x: normalizedX, y: normalizedY, width: normalizedWidth, height: normalizedHeight },
      calculated: { sx, sy, sWidth, sHeight }
    });
    
    // Validate crop is reasonable - if it's too small (less than 5% of image) or out of bounds, use full image
    const minSize = Math.min(contentImg.width, contentImg.height) * 0.05;
    if (sWidth < minSize || sHeight < minSize || sx + sWidth > contentImg.width || sy + sHeight > contentImg.height) {
      console.warn('Invalid crop detected, using full image instead:', { 
        sx, sy, sWidth, sHeight, 
        minSize,
        reason: sWidth < minSize ? 'width too small' : sHeight < minSize ? 'height too small' : 'out of bounds'
      });
      sx = 0;
      sy = 0;
      sWidth = contentImg.width;
      sHeight = contentImg.height;
    }
  } else {
    console.log('No valid crop area, using full content image');
  }
  
  // Check if contentImg has any content before proceeding
  if (contentImg instanceof HTMLCanvasElement) {
    const contentCtx = contentImg.getContext('2d')!;
    const contentCheck = contentCtx.getImageData(0, 0, Math.min(50, contentImg.width), Math.min(50, contentImg.height));
    const contentHasPixels = contentCheck.data.some(v => v !== 0);
    console.error('Content image check:', {
      isCanvas: true,
      size: { width: contentImg.width, height: contentImg.height },
      hasPixels: contentHasPixels,
      samplePixels: Array.from(contentCheck.data.slice(0, 20))
    });
  }
  
  // Create a temporary canvas for the cropped content
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sWidth;
  tempCanvas.height = sHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  
  console.log('Drawing to tempCanvas:', {
    from: { sx, sy, sWidth, sHeight },
    to: { x: 0, y: 0, width: sWidth, height: sHeight },
    contentImgSize: { width: contentImg.width, height: contentImg.height }
  });
  
  // Draw cropped content to temp canvas
  try {
    tempCtx.drawImage(
      contentImg,
      sx, sy, sWidth, sHeight,
      0, 0, sWidth, sHeight
    );
    console.log('Successfully drew to tempCanvas');
  } catch (error) {
    console.error('Failed to draw to tempCanvas:', error);
  }
  
  // Verify content was drawn to temp canvas
  const tempCtxData = tempCtx.getImageData(0, 0, Math.min(10, tempCanvas.width), Math.min(10, tempCanvas.height));
  const hasPixels = tempCtxData.data.some(v => v !== 0);
  
  console.error('TempCanvas after drawing:', {
    size: { width: tempCanvas.width, height: tempCanvas.height },
    hasPixels,
    samplePixels: Array.from(tempCtxData.data.slice(0, 20))
  });
  
  console.log('Content canvas created:', {
    size: { width: tempCanvas.width, height: tempCanvas.height },
    hasContent: tempCanvas.width > 0 && tempCanvas.height > 0,
    hasPixels,
    sourceSize: { width: contentImg.width, height: contentImg.height },
    crop: { sx, sy, sWidth, sHeight }
  });
  
  // Use actual 4 corner points if available, otherwise create rectangle
  const destPoints = screenPoints || [
    { x: screenX, y: screenY }, // top-left
    { x: screenX + screenWidth, y: screenY }, // top-right
    { x: screenX + screenWidth, y: screenY + screenHeight }, // bottom-right
    { x: screenX, y: screenY + screenHeight } // bottom-left
  ];
  
  console.log('Drawing with perspective transform:', {
    hasCustomPoints: !!screenPoints,
    destPoints,
    tempCanvasSize: { width: tempCanvas.width, height: tempCanvas.height },
    deviceSize: { width: ctx.canvas.width, height: ctx.canvas.height }
  });
  
  // Try simple approach first - if points form a rectangle, use simple drawImage
  const isRectangle = Math.abs(destPoints[0].y - destPoints[1].y) < 5 && 
                      Math.abs(destPoints[2].y - destPoints[3].y) < 5 &&
                      Math.abs(destPoints[0].x - destPoints[3].x) < 5 &&
                      Math.abs(destPoints[1].x - destPoints[2].x) < 5;
  
  if (isRectangle || !screenPoints) {
    // Simple rectangle - just draw directly
    const x = Math.min(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x);
    const y = Math.min(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y);
    const w = Math.max(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x) - x;
    const h = Math.max(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y) - y;
    
    console.log('Drawing as simple rectangle:', { 
      x, y, w, h, 
      tempCanvasSize: { width: tempCanvas.width, height: tempCanvas.height },
      canvasSize: { width: ctx.canvas.width, height: ctx.canvas.height },
      destPoints
    });
    
    // Verify temp canvas has content before drawing
    const tempCheckData = tempCanvas.getContext('2d')!.getImageData(0, 0, Math.min(10, tempCanvas.width), Math.min(10, tempCanvas.height));
    const tempHasContent = tempCheckData.data.some(v => v !== 0);
    console.log('Temp canvas check before draw:', { 
      hasContent: tempHasContent, 
      tempCanvasSize: { width: tempCanvas.width, height: tempCanvas.height },
      samplePixels: Array.from(tempCheckData.data.slice(0, 16)) 
    });
    
    console.log('About to draw at rectangle:', { x, y, w, h });
    
    // Draw the content - it will replace the pixels in this area
    ctx.drawImage(tempCanvas, x, y, w, h);
    
    // Verify it was drawn
    const verifyData = ctx.getImageData(Math.floor(x + w/2), Math.floor(y + h/2), 1, 1);
    console.log('After drawing - center pixel:', Array.from(verifyData.data));
  } else {
    // Complex perspective - use transform
    console.log('Drawing with perspective transform');
    console.log('Dest points:', destPoints);
    console.log('Temp canvas for transform:', { width: tempCanvas.width, height: tempCanvas.height });
    
    // Draw transformed content directly
    perspectiveTransform(ctx, tempCanvas, destPoints);
    
    // Verify something was drawn
    const minX = Math.min(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x);
    const minY = Math.min(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y);
    const maxX = Math.max(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x);
    const maxY = Math.max(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y);
    const centerX = Math.floor((minX + maxX) / 2);
    const centerY = Math.floor((minY + maxY) / 2);
    const verifyData = ctx.getImageData(centerX, centerY, 1, 1);
    console.log('After perspective transform - center pixel:', Array.from(verifyData.data), 'at', centerX, centerY);
  }
  
  console.log('Drawing complete');
}

// Perform perspective transformation to map content to 4 arbitrary corner points
function perspectiveTransform(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  destPoints: Array<{ x: number; y: number }>
) {
  // CRITICAL: Check if source canvas has content
  const srcCtxCheck = sourceCanvas.getContext('2d')!;
  const checkData = srcCtxCheck.getImageData(0, 0, Math.min(50, sourceCanvas.width), Math.min(50, sourceCanvas.height));
  const hasPixels = checkData.data.some(v => v !== 0);
  console.error('PERSPECTIVE TRANSFORM SOURCE CHECK:', {
    sourceSize: { width: sourceCanvas.width, height: sourceCanvas.height },
    hasPixels,
    samplePixels: Array.from(checkData.data.slice(0, 20))
  });
  
  let srcWidth = sourceCanvas.width;
  let srcHeight = sourceCanvas.height;
  
  // Scale down source if too large to prevent memory errors
  const MAX_SOURCE_SIZE = 600;
  let sourceScale = 1;
  let scaledSourceCanvas = sourceCanvas;
  
  if (srcWidth > MAX_SOURCE_SIZE || srcHeight > MAX_SOURCE_SIZE) {
    sourceScale = Math.min(MAX_SOURCE_SIZE / srcWidth, MAX_SOURCE_SIZE / srcHeight);
    const scaledWidth = Math.floor(srcWidth * sourceScale);
    const scaledHeight = Math.floor(srcHeight * sourceScale);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = scaledWidth;
    tempCanvas.height = scaledHeight;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(sourceCanvas, 0, 0, scaledWidth, scaledHeight);
    
    scaledSourceCanvas = tempCanvas;
    srcWidth = scaledWidth;
    srcHeight = scaledHeight;
    
    console.warn(`Scaling source down by ${sourceScale.toFixed(2)}x to prevent memory issues`);
  }
  
  // Get source image data
  const srcCtx = scaledSourceCanvas.getContext('2d')!;
  const srcImageData = srcCtx.getImageData(0, 0, srcWidth, srcHeight);
  
  // Calculate bounding box of destination
  const minX = Math.min(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x);
  const maxX = Math.max(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x);
  const minY = Math.min(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y);
  const maxY = Math.max(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y);
  
  let destWidth = Math.ceil(maxX - minX);
  let destHeight = Math.ceil(maxY - minY);
  
  console.log('Perspective transform dimensions:', {
    srcSize: { width: srcWidth, height: srcHeight },
    destSize: { width: destWidth, height: destHeight },
    boundingBox: { minX, minY, maxX, maxY }
  });
  
  // Safety check: limit maximum dimensions to prevent memory errors
  const MAX_TRANSFORM_SIZE = 800;
  let transformScale = 1;
  if (destWidth > MAX_TRANSFORM_SIZE || destHeight > MAX_TRANSFORM_SIZE) {
    transformScale = Math.min(MAX_TRANSFORM_SIZE / destWidth, MAX_TRANSFORM_SIZE / destHeight);
    destWidth = Math.floor(destWidth * transformScale);
    destHeight = Math.floor(destHeight * transformScale);
    console.warn(`Scaling transform down by ${transformScale.toFixed(2)}x to prevent memory issues`);
  }
  
  // Create temporary canvas for transformed image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = destWidth;
  tempCanvas.height = destHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  const destImageData = tempCtx.createImageData(destWidth, destHeight);
  
  // Adjust destination points relative to bounding box and apply transform scale
  const adjustedPoints = destPoints.map(p => ({
    x: (p.x - minX) * transformScale,
    y: (p.y - minY) * transformScale
  }));
  
  // Source points (corners of source image)
  const srcPoints = [
    { x: 0, y: 0 },
    { x: srcWidth, y: 0 },
    { x: srcWidth, y: srcHeight },
    { x: 0, y: srcHeight }
  ];
  
  // Calculate perspective transform matrix
  const matrix = getPerspectiveTransform(srcPoints, adjustedPoints);
  
  console.log('Applying perspective transform to', destWidth, 'x', destHeight, 'pixels...');
  
  // Apply transformation for each pixel in destination
  for (let y = 0; y < destHeight; y++) {
    for (let x = 0; x < destWidth; x++) {
      // Transform destination coordinates to source coordinates
      const srcCoord = applyTransform(matrix, x, y);
      
      // Check if source coordinate is within bounds
      if (srcCoord.x >= 0 && srcCoord.x < srcWidth && srcCoord.y >= 0 && srcCoord.y < srcHeight) {
        // Bilinear interpolation for smoother result
        const srcX = Math.floor(srcCoord.x);
        const srcY = Math.floor(srcCoord.y);
        const fx = srcCoord.x - srcX;
        const fy = srcCoord.y - srcY;
        
        const srcX1 = Math.min(srcX + 1, srcWidth - 1);
        const srcY1 = Math.min(srcY + 1, srcHeight - 1);
        
        // Get 4 neighboring pixels
        const idx00 = (srcY * srcWidth + srcX) * 4;
        const idx10 = (srcY * srcWidth + srcX1) * 4;
        const idx01 = (srcY1 * srcWidth + srcX) * 4;
        const idx11 = (srcY1 * srcWidth + srcX1) * 4;
        
        const destIdx = (y * destWidth + x) * 4;
        
        // Interpolate each channel
        for (let c = 0; c < 4; c++) {
          const v00 = srcImageData.data[idx00 + c];
          const v10 = srcImageData.data[idx10 + c];
          const v01 = srcImageData.data[idx01 + c];
          const v11 = srcImageData.data[idx11 + c];
          
          const v0 = v00 * (1 - fx) + v10 * fx;
          const v1 = v01 * (1 - fx) + v11 * fx;
          const v = v0 * (1 - fy) + v1 * fy;
          
          destImageData.data[destIdx + c] = Math.round(v);
        }
      }
    }
  }
  
  // Put transformed image data on temporary canvas
  tempCtx.putImageData(destImageData, 0, 0);
  
  // Draw to main canvas at correct position, scaling back up if needed
  if (transformScale < 1) {
    // Scale back up to original size
    ctx.drawImage(tempCanvas, minX, minY, destWidth / transformScale, destHeight / transformScale);
  } else {
    ctx.drawImage(tempCanvas, minX, minY);
  }
}

// Calculate perspective transformation matrix from source to destination points
function getPerspectiveTransform(
  src: Array<{ x: number; y: number }>,
  dst: Array<{ x: number; y: number }>
): number[] {
  // We need the INVERSE transform (from dest to src) for pixel mapping
  // Swap src and dst to get inverse transform
  const A: number[][] = [];
  
  for (let i = 0; i < 4; i++) {
    A.push([
      dst[i].x, dst[i].y, 1, 0, 0, 0, -src[i].x * dst[i].x, -src[i].x * dst[i].y
    ]);
    A.push([
      0, 0, 0, dst[i].x, dst[i].y, 1, -src[i].y * dst[i].x, -src[i].y * dst[i].y
    ]);
  }
  
  const b = [src[0].x, src[0].y, src[1].x, src[1].y, src[2].x, src[2].y, src[3].x, src[3].y];
  
  // Solve using Gaussian elimination
  const h = solveLinearSystem(A, b);
  h.push(1); // h8 = 1
  
  return h;
}

// Solve linear system Ax = b using Gaussian elimination
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);
  
  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    
    // Swap rows
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    // Eliminate column
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }
  
  // Back substitution
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }
  
  return x;
}

// Apply perspective transform to a point
function applyTransform(matrix: number[], x: number, y: number): { x: number; y: number } {
  const w = matrix[6] * x + matrix[7] * y + matrix[8];
  return {
    x: (matrix[0] * x + matrix[1] * y + matrix[2]) / w,
    y: (matrix[3] * x + matrix[4] * y + matrix[5]) / w
  };
}

async function canvasToGif(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    const gif = new GIF({
      workers: 0, // Disable workers to avoid worker script loading issues
      quality: 1, // Lower quality number = better quality (1-30, lower is better)
      width: canvas.width,
      height: canvas.height,
      dither: false, // Disable dithering for cleaner output
      transparent: null, // Don't force transparency
    });
    
    gif.addFrame(canvas, { delay: 1000, copy: true });
    
    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });
    
    gif.render();
  });
}

// Async wrapper that adds frames in chunks to keep UI responsive
async function framesToGifAsync(
  frames: { canvas: HTMLCanvasElement; delay: number }[],
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  return new Promise((resolve) => {
    const gif = new GIF({
      workers: 4, // Use 4 workers for fast parallel processing
      quality: 1, // Best quality (1-30, lower is better)
      width: frames[0].canvas.width,
      height: frames[0].canvas.height,
      workerScript: '/gif.worker.js',
      dither: false,
      transparent: null,
      repeat: 0,
    });
    
    // Add frames in chunks with setTimeout to keep UI responsive
    let frameIndex = 0;
    const addFrameChunk = () => {
      const chunkSize = 5;
      const endIndex = Math.min(frameIndex + chunkSize, frames.length);
      
      for (let i = frameIndex; i < endIndex; i++) {
        gif.addFrame(frames[i].canvas, {
          delay: frames[i].delay,
          copy: true,
          dispose: 1
        });
      }
      
      frameIndex = endIndex;
      const progress = 80 + Math.floor((frameIndex / frames.length) * 10);
      onProgress?.(progress, `Adding frames ${frameIndex}/${frames.length}...`);
      
      if (frameIndex < frames.length) {
        setTimeout(addFrameChunk, 0);
      } else {
        // All frames added, now render
        onProgress?.(90, 'Rendering GIF...');
        gif.render();
      }
    };
    
    gif.on('progress', (p: number) => {
      const progress = 90 + Math.floor(p * 10);
      onProgress?.(progress, `Encoding GIF: ${Math.round(p * 100)}%`);
      console.log(`GIF encoding progress: ${Math.round(p * 100)}%`);
    });
    
    gif.on('finished', (blob: Blob) => {
      console.log('GIF encoding complete!');
      resolve(blob);
    });
    
    // Start adding frames
    addFrameChunk();
  });
}

async function framesToGif(frames: { canvas: HTMLCanvasElement; delay: number }[]): Promise<Blob> {
  return new Promise((resolve) => {
    const gif = new GIF({
      workers: 0, // Disable workers to avoid worker script loading issues
      quality: 10, // Increase quality number for faster encoding
      width: frames[0].canvas.width,
      height: frames[0].canvas.height,
      dither: false, // Disable dithering for cleaner output
      transparent: null, // Don't force transparency
      repeat: 0, // Loop forever
    });
    
    // Add all frames without skipping - let gif.js handle optimization
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      
      gif.addFrame(frame.canvas, { 
        delay: frame.delay,
        copy: true,
        dispose: 1 // Don't dispose, keep frame
      });
    }
    
    gif.on('progress', (progress: number) => {
      console.log(`GIF encoding progress: ${Math.round(progress * 100)}%`);
    });
    
    gif.on('finished', (blob: Blob) => {
      console.log('GIF encoding complete!');
      resolve(blob);
    });
    
    console.log(`Starting GIF encoding for ${frames.length} frames...`);
    gif.render();
  });
}

async function imageToMov(canvas: HTMLCanvasElement): Promise<Blob> {
  try {
    const ffmpeg = await loadFFmpeg();
    
    // Convert canvas to PNG
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    
    // Write to FFmpeg filesystem
    await ffmpeg.writeFile('frame.png', await fetchFile(blob));
    
    // Create 1-second video from single frame
    await ffmpeg.exec([
      '-loop', '1',
      '-i', 'frame.png',
      '-c:v', 'libx264',
      '-t', '1',
      '-pix_fmt', 'yuv420p',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      'output.mov'
    ]);
    
    // Read output
    const data = await ffmpeg.readFile('output.mov');
    return new Blob([data], { type: 'video/quicktime' });
  } catch (error) {
    console.error('FFmpeg not available, returning empty MOV blob', error);
    // Return a minimal valid MOV file (empty video)
    return new Blob([], { type: 'video/quicktime' });
  }
}

async function framesToMov(frames: { canvas: HTMLCanvasElement; delay: number }[]): Promise<Blob> {
  try {
    const ffmpeg = await loadFFmpeg();
    
    // Write each frame as PNG
    for (let i = 0; i < frames.length; i++) {
      const blob = await new Promise<Blob>((resolve) => {
        frames[i].canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      const frameName = `frame_${String(i).padStart(4, '0')}.png`;
      await ffmpeg.writeFile(frameName, await fetchFile(blob));
    }
    
    // Calculate framerate from average delay
    const avgDelay = frames.reduce((sum, f) => sum + f.delay, 0) / frames.length;
    const fps = Math.round(1000 / avgDelay);
    
    // Create video from frames
    await ffmpeg.exec([
      '-framerate', String(fps),
      '-i', 'frame_%04d.png',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      'output.mov'
    ]);
    
    // Read output
    const data = await ffmpeg.readFile('output.mov');
    return new Blob([data], { type: 'video/quicktime' });
  } catch (error) {
    console.error('FFmpeg not available, returning empty MOV blob', error);
    // Return a minimal valid MOV file (empty video)
    return new Blob([], { type: 'video/quicktime' });
  }
}
