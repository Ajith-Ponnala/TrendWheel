import fs from 'fs';
import path from 'path';

const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

// The keys match the index of the base products.
const keys = [
  'tshirt', 'pants', 'dress', 'jeans', 'sneakers', 'bag', 'kids', 'skincare', 'bedsheet', 'hoodie'
];

let currentIndex = 0;

// Replace any ["data:image/..."] with [svgMap['key']]
content = content.replace(/\["data:image\/svg\+xml;base64,[^"\]]+"\]/g, (match) => {
  const key = keys[currentIndex];
  currentIndex++;
  if (!key) return match; // just in case
  return `[svgMap['${key}']]`;
});

fs.writeFileSync(mockDataPath, content);
console.log('mockData.js updated to use svgMap for base products.');
