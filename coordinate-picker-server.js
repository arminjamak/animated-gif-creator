import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use('/src/assets', express.static(path.join(__dirname, 'src', 'assets')));

const DATA_FILE_PATH = path.join(__dirname, 'src', 'polymet', 'data', 'device-mockups-data.ts');

// Read current device mockups from device-mockups-data.ts
app.get('/api/devices', (req, res) => {
  try {
    const appContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    
    // Extract import statements to map variable names to file paths
    const importRegex = /import\s+(\w+)\s+from\s+"@\/assets\/([^"]+)"/g;
    const importMap = {};
    let importMatch;
    while ((importMatch = importRegex.exec(appContent)) !== null) {
      const [, varName, filePath] = importMatch;
      importMap[varName] = `/src/assets/${filePath}`;
    }
    
    // Extract deviceMockups array - more flexible regex
    const mockupsMatch = appContent.match(/export const deviceMockups: DeviceMockup\[\] = \[([\s\S]*?)\n\];/);
    
    if (!mockupsMatch) {
      return res.status(500).json({ error: 'Could not find deviceMockups in device-mockups-data.ts' });
    }
    
    const arrayContent = mockupsMatch[1];
    const devices = [];
    
    // Split by device objects (look for opening braces at start of line)
    const deviceObjects = arrayContent.split(/\n  \{/).filter(s => s.trim());
    
    for (const deviceStr of deviceObjects) {
      // Extract fields
      const idMatch = deviceStr.match(/id:\s*"([^"]+)"/);
      const nameMatch = deviceStr.match(/name:\s*"([^"]+)"/);
      const categoryMatch = deviceStr.match(/category:\s*"([^"]+)"/);
      const imageMatch = deviceStr.match(/image:\s*(\w+)/);
      
      // Extract screenArea
      const screenAreaMatch = deviceStr.match(/screenArea:\s*\{([\s\S]*?)\n\s*\}/);
      
      if (!idMatch || !nameMatch || !imageMatch || !screenAreaMatch) continue;
      
      const id = idMatch[1];
      const name = nameMatch[1];
      const category = categoryMatch ? categoryMatch[1] : 'scene';
      const imageVar = imageMatch[1];
      const image = importMap[imageVar] || imageVar;
      
      // Parse screenArea
      const screenAreaStr = screenAreaMatch[1];
      const xMatch = screenAreaStr.match(/x:\s*([\d.]+)/);
      const yMatch = screenAreaStr.match(/y:\s*([\d.]+)/);
      const widthMatch = screenAreaStr.match(/width:\s*([\d.]+)/);
      const heightMatch = screenAreaStr.match(/height:\s*([\d.]+)/);
      const rotationMatch = screenAreaStr.match(/rotation:\s*([-\d.]+)/);
      
      // Extract points if they exist
      const pointsMatch = screenAreaStr.match(/points:\s*\[([\s\S]*?)\]/);
      let points = null;
      if (pointsMatch) {
        const pointsStr = pointsMatch[1];
        const pointRegex = /\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)\s*\}/g;
        points = [];
        let pointMatch;
        while ((pointMatch = pointRegex.exec(pointsStr)) !== null) {
          points.push({ x: parseFloat(pointMatch[1]), y: parseFloat(pointMatch[2]) });
        }
      }
      
      devices.push({
        id,
        name,
        category,
        image,
        screenArea: {
          points,
          x: parseFloat(xMatch ? xMatch[1] : 0),
          y: parseFloat(yMatch ? yMatch[1] : 0),
          width: parseFloat(widthMatch ? widthMatch[1] : 0),
          height: parseFloat(heightMatch ? heightMatch[1] : 0),
          rotation: parseFloat(rotationMatch ? rotationMatch[1] : 0)
        }
      });
    }
    
    console.log(`✅ Loaded ${devices.length} devices`);
    res.json({ devices });
  } catch (error) {
    console.error('Error reading devices:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save updated coordinates for a specific device
app.post('/api/devices/:id/coordinates', (req, res) => {
  try {
    const { id } = req.params;
    const { screenArea, category } = req.body;
    
    let appContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    
    // Find and replace the specific device's screenArea - handle both string URLs and imported variables
    const deviceRegex = new RegExp(
      `(\\{\\s*id:\\s*"${id}",\\s*image:\\s*[^,]+,\\s*name:\\s*"[^"]+",\\s*screenArea:\\s*\\{)[^}]+(\\}\\s*\\})`,
      'g'
    );
    
    // Format the points array if it exists
    let pointsStr = '';
    if (screenArea.points && screenArea.points.length === 4) {
      const pointsArray = screenArea.points.map(p => 
        `{x: ${p.x}, y: ${p.y}}`
      ).join(', ');
      pointsStr = `points: [${pointsArray}], `;
    }
    
    const newScreenArea = `${pointsStr}x: ${screenArea.x}, y: ${screenArea.y}, width: ${screenArea.width}, height: ${screenArea.height}, rotation: ${screenArea.rotation}`;
    
    appContent = appContent.replace(deviceRegex, `$1${newScreenArea}$2`);
    
    // Write back to file
    fs.writeFileSync(APP_TSX_PATH, appContent, 'utf8');
    
    console.log(`✅ Updated coordinates for ${id}`);
    res.json({ success: true, message: `Coordinates saved for ${id}` });
  } catch (error) {
    console.error('Error saving coordinates:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🎯 Coordinate Picker Server running on http://localhost:${PORT}`);
  console.log(`📝 Editing: ${DATA_FILE_PATH}`);
  console.log(`\nOpen http://localhost:${PORT}/coordinate-picker-integrated.html to start\n`);
});
