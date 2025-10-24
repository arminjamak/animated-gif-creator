const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use('/src/assets', express.static(path.join(__dirname, 'src', 'assets')));

const APP_TSX_PATH = path.join(__dirname, 'src', 'App.tsx');

// Read current device mockups from App.tsx
app.get('/api/devices', (req, res) => {
  try {
    const appContent = fs.readFileSync(APP_TSX_PATH, 'utf8');
    
    // Extract DEVICE_MOCKUPS array
    const mockupsMatch = appContent.match(/export const DEVICE_MOCKUPS: DeviceMockup\[\] = \[([\s\S]*?)\];/);
    
    if (!mockupsMatch) {
      return res.status(500).json({ error: 'Could not find DEVICE_MOCKUPS in App.tsx' });
    }
    
    // Parse the array content
    const arrayContent = mockupsMatch[1];
    const devices = [];
    
    // Extract each device object - handle both string URLs and imported variables
    const deviceRegex = /\{\s*id:\s*"([^"]+)",\s*image:\s*([^,]+),\s*name:\s*"([^"]+)",\s*screenArea:\s*\{([^}]+)\}\s*\}/g;
    let match;
    
    // Extract import statements to map variable names to file paths
    const importRegex = /import\s+(\w+)\s+from\s+"\.\/assets\/([^"]+)"/g;
    const importMap = {};
    let importMatch;
    while ((importMatch = importRegex.exec(appContent)) !== null) {
      const [, varName, filePath] = importMatch;
      importMap[varName] = `/src/assets/${filePath}`;
    }
    
    while ((match = deviceRegex.exec(arrayContent)) !== null) {
      const [, id, imageValue, name, screenAreaStr] = match;
      
      // Extract image - could be a string or variable name
      let image = imageValue.trim();
      if (image.startsWith('"') && image.endsWith('"')) {
        image = image.slice(1, -1); // Remove quotes
      } else if (importMap[image]) {
        // Resolve imported variable to file path
        image = importMap[image];
      }
      
      // Parse screenArea
      const xMatch = screenAreaStr.match(/x:\s*([\d.]+)/);
      const yMatch = screenAreaStr.match(/y:\s*([\d.]+)/);
      const widthMatch = screenAreaStr.match(/width:\s*([\d.]+)/);
      const heightMatch = screenAreaStr.match(/height:\s*([\d.]+)/);
      const rotationMatch = screenAreaStr.match(/rotation:\s*([-\d.]+)/);
      
      devices.push({
        id,
        image,
        name,
        screenArea: {
          x: parseFloat(xMatch ? xMatch[1] : 0),
          y: parseFloat(yMatch ? yMatch[1] : 0),
          width: parseFloat(widthMatch ? widthMatch[1] : 0),
          height: parseFloat(heightMatch ? heightMatch[1] : 0),
          rotation: parseFloat(rotationMatch ? rotationMatch[1] : 0)
        }
      });
    }
    
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
    const { screenArea } = req.body;
    
    let appContent = fs.readFileSync(APP_TSX_PATH, 'utf8');
    
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
  console.log(`📝 Editing: ${APP_TSX_PATH}`);
  console.log(`\nOpen http://localhost:${PORT}/coordinate-picker-integrated.html to start\n`);
});
