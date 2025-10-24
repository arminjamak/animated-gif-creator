import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import GIF from 'gif.js';
import { parseGIF, decompressFrames } from 'gifuct-js';
import { DeviceMockup } from '../App';

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
  
  // Check if we have 4-point coordinates
  let screenPoints: Array<{ x: number; y: number }> | null = null;
  
  if (device.screenArea.points && device.screenArea.points.length === 4) {
    // Convert normalized points to pixel coordinates
    screenPoints = device.screenArea.points.map(p => ({
      x: deviceImg.width * p.x,
      y: deviceImg.height * p.y
    }));
  }
  
  // Calculate screen area dimensions (fallback for bounding box)
  const screenX = deviceImg.width * device.screenArea.x;
  const screenY = deviceImg.height * device.screenArea.y;
  const screenWidth = deviceImg.width * device.screenArea.width;
  const screenHeight = deviceImg.height * device.screenArea.height;

  if (uploadedFile.type === 'image') {
    return processStaticImage(deviceImg, uploadedFile, screenX, screenY, screenWidth, screenHeight, device.screenArea.rotation, onProgress, screenPoints);
  } else if (uploadedFile.type === 'gif') {
    return processGIF(deviceImg, uploadedFile, screenX, screenY, screenWidth, screenHeight, device.screenArea.rotation, onProgress, screenPoints);
  } else {
    return processVideo(deviceImg, uploadedFile, screenX, screenY, screenWidth, screenHeight, device.screenArea.rotation, onProgress, screenPoints);
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
  
  // Set background color if specified
  if (gif.lsd.gct && gif.lsd.backgroundColorIndex !== undefined) {
    const bgColor = gif.lsd.gct[gif.lsd.backgroundColorIndex];
    if (bgColor) {
      gifCtx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
      gifCtx.fillRect(0, 0, gifCanvas.width, gifCanvas.height);
    }
  }
  
  // Create canvases for each frame
  const processedFrames: { canvas: HTMLCanvasElement; delay: number }[] = [];
  
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    
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
    
    // Create composite canvas with device mockup
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = deviceImg.width;
    compositeCanvas.height = deviceImg.height;
    const compositeCtx = compositeCanvas.getContext('2d')!;
    
    // Draw composite using the accumulated GIF canvas
    drawComposite(compositeCtx, deviceImg, gifCanvas, uploadedFile.croppedArea, screenX, screenY, screenWidth, screenHeight, rotation, screenPoints);
    
    processedFrames.push({
      canvas: compositeCanvas,
      delay: frame.delay || 100
    });
    
    onProgress?.(20 + (i / frames.length) * 30, `Processing frame ${i + 1}/${frames.length}...`);
  }
  
  onProgress?.(50, 'Generating output GIF...');
  
  // Generate GIF from processed frames
  const gifBlob = await framesToGif(processedFrames);
  
  onProgress?.(70, 'Generating MOV...');
  
  // Generate MOV from processed frames
  const movBlob = await framesToMov(processedFrames);
  
  const previewUrl = processedFrames[0].canvas.toDataURL('image/png');
  
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
  
  onProgress?.(70, 'Generating GIF...');
  
  // Generate GIF from processed frames
  const gifBlob = await framesToGif(processedFrames);
  
  onProgress?.(85, 'Generating MOV...');
  
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
  // Draw device image first
  ctx.drawImage(deviceImg, 0, 0);
  
  // Calculate content dimensions
  let sx = 0, sy = 0, sWidth = contentImg.width, sHeight = contentImg.height;
  
  if (croppedArea) {
    sx = contentImg.width * croppedArea.x;
    sy = contentImg.height * croppedArea.y;
    sWidth = contentImg.width * croppedArea.width;
    sHeight = contentImg.height * croppedArea.height;
  }
  
  // Create a temporary canvas for the cropped content
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sWidth;
  tempCanvas.height = sHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  
  // Draw cropped content to temp canvas
  tempCtx.drawImage(
    contentImg,
    sx, sy, sWidth, sHeight,
    0, 0, sWidth, sHeight
  );
  
  // Use actual 4 corner points if available, otherwise create rectangle
  const destPoints = screenPoints || [
    { x: screenX, y: screenY }, // top-left
    { x: screenX + screenWidth, y: screenY }, // top-right
    { x: screenX + screenWidth, y: screenY + screenHeight }, // bottom-right
    { x: screenX, y: screenY + screenHeight } // bottom-left
  ];
  
  console.log('Drawing with perspective transform:', {
    hasCustomPoints: !!screenPoints,
    destPoints
  });
  
  // Apply 4-point perspective transformation
  perspectiveTransform(ctx, tempCanvas, destPoints);
}

// Perform perspective transformation to map content to 4 arbitrary corner points
function perspectiveTransform(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  destPoints: Array<{ x: number; y: number }>
) {
  const srcWidth = sourceCanvas.width;
  const srcHeight = sourceCanvas.height;
  
  // Get source image data
  const srcCtx = sourceCanvas.getContext('2d')!;
  const srcImageData = srcCtx.getImageData(0, 0, srcWidth, srcHeight);
  
  // Calculate bounding box of destination
  const minX = Math.min(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x);
  const maxX = Math.max(destPoints[0].x, destPoints[1].x, destPoints[2].x, destPoints[3].x);
  const minY = Math.min(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y);
  const maxY = Math.max(destPoints[0].y, destPoints[1].y, destPoints[2].y, destPoints[3].y);
  
  const destWidth = Math.ceil(maxX - minX);
  const destHeight = Math.ceil(maxY - minY);
  
  // Create temporary canvas for transformed image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = destWidth;
  tempCanvas.height = destHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  const destImageData = tempCtx.createImageData(destWidth, destHeight);
  
  // Adjust destination points relative to bounding box
  const adjustedPoints = destPoints.map(p => ({
    x: p.x - minX,
    y: p.y - minY
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
  
  // Draw to main canvas at correct position
  ctx.drawImage(tempCanvas, minX, minY);
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
      workers: 2,
      quality: 1, // Lower quality number = better quality (1-30, lower is better)
      width: canvas.width,
      height: canvas.height,
      workerScript: '/gif.worker.js',
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

async function framesToGif(frames: { canvas: HTMLCanvasElement; delay: number }[]): Promise<Blob> {
  return new Promise((resolve) => {
    const gif = new GIF({
      workers: 2,
      quality: 1, // Lower quality number = better quality (1-30, lower is better)
      width: frames[0].canvas.width,
      height: frames[0].canvas.height,
      workerScript: '/gif.worker.js',
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
    
    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });
    
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
