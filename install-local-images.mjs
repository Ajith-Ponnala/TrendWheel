import fs from 'fs';
import path from 'path';

// Artifacts directory
const artifactsDir = 'C:\\Users\\ajithreddy\\.gemini\\antigravity-ide\\brain\\1ca2cb72-55de-4bc5-bc97-b5d358723212';
const publicImagesDir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Find all generated images
const files = fs.readdirSync(artifactsDir);
const imageFiles = files.filter(f => f.endsWith('.jpg') && !f.includes('scratch') && !f.includes('system_generated'));

const newUrlMap = {};

imageFiles.forEach(file => {
  // Extract the base name (e.g., tshirt from tshirt_12345.jpg)
  const baseNameMatch = file.match(/^([a-zA-Z_]+)_\d+\.jpg$/);
  if (baseNameMatch) {
    const baseName = baseNameMatch[1];
    const targetName = `${baseName}.jpg`;
    
    // Copy the file
    fs.copyFileSync(path.join(artifactsDir, file), path.join(publicImagesDir, targetName));
    
    // Create the new path
    newUrlMap[baseName] = `/images/${targetName}`;
  }
});

console.log('Images copied successfully to public/images');
console.log('Mapped paths:', newUrlMap);

// Ensure we have the base categories that weren't generated in this batch
// Let's just point them to hero or sale or something if they don't exist, or keep them.
// Wait, the categories were: cat_men, cat_women, etc. We didn't generate those. 
// For this quick fix, let's map the base clothing items to the categories!
const fullUrlMap = {
  ...newUrlMap,
  cat_men: newUrlMap.hoodie || newUrlMap.tshirt,
  cat_women: newUrlMap.dress || newUrlMap.jeans,
  cat_kids: newUrlMap.kids,
  cat_shoes: newUrlMap.sneakers,
  cat_acc: newUrlMap.bag,
  cat_beauty: newUrlMap.skincare,
  cat_home: newUrlMap.bedsheet,
  cat_genz: newUrlMap.hoodie || newUrlMap.sneakers
};

const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.js');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Replace the svgMap entirely
const svgMapRegex = /const svgMap = {[\s\S]*?};\n\n\/\/ Base product dataset/;
mockDataContent = mockDataContent.replace(svgMapRegex, `const svgMap = ${JSON.stringify(fullUrlMap, null, 2)};\n\n// Base product dataset`);

fs.writeFileSync(mockDataPath, mockDataContent);
console.log('mockData.js updated to use the new local Myntra-style photography.');

// Update Home.jsx for hero and sale images
const homePath = path.join(process.cwd(), 'src', 'pages', 'Home.jsx');
let homeContent = fs.readFileSync(homePath, 'utf8');

homeContent = homeContent.replace(/src="https:\/\/images\.unsplash\.com[^"]+"/g, (match) => {
  if (match.includes('hero')) return `src="${fullUrlMap.hero}"`;
  if (match.includes('sale')) return `src="${fullUrlMap.sale}"`;
  // If it's something else, just leave it or replace with hero
  return match.includes('sale') ? `src="${fullUrlMap.sale}"` : `src="${fullUrlMap.hero}"`;
});

// Just a more robust replace for Home:
homeContent = homeContent.replace(/src="https:\/\/images\.unsplash\.com\/photo-1490481651871-ab68de25d43d[^"]+"/, `src="${fullUrlMap.hero}"`);
homeContent = homeContent.replace(/src="https:\/\/images\.unsplash\.com\/photo-1607082348824-0a96f2a4b9da[^"]+"/, `src="${fullUrlMap.sale}"`);

fs.writeFileSync(homePath, homeContent);
console.log('Home.jsx updated to use local hero/sale images.');
