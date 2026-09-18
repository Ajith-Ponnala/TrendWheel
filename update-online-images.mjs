import fs from 'fs';
import path from 'path';

// Define the exact online URLs for each image
const onlineUrls = {
  tshirt: 'https://m.media-amazon.com/images/I/51wXQZ9Q8vL._AC_UY1000_.jpg',
  pants: 'https://m.media-amazon.com/images/I/61k1jY-bIfL._AC_UY1000_.jpg',
  dress: 'https://m.media-amazon.com/images/I/71Yv3P0vM-L._AC_UY1000_.jpg',
  jeans: 'https://m.media-amazon.com/images/I/61eM-rYj+4L._AC_UY1000_.jpg',
  sneakers: 'https://m.media-amazon.com/images/I/71D9ImsvEtL._AC_UY1000_.jpg',
  bag: 'https://m.media-amazon.com/images/I/71ZpTfB7q+L._AC_UY1000_.jpg',
  kids: 'https://m.media-amazon.com/images/I/71jC9Xz7gTL._AC_UY1000_.jpg',
  skincare: 'https://m.media-amazon.com/images/I/61dC-0bY3GL._AC_UY1000_.jpg',
  bedsheet: 'https://m.media-amazon.com/images/I/71wE5r3Oq3L._AC_UL1500_.jpg',
  hoodie: 'https://m.media-amazon.com/images/I/51X2rWcZ2jL._AC_UY1000_.jpg',
  
  cat_men: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
  cat_women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  cat_kids: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  cat_shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
  cat_acc: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
  cat_beauty: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80',
  cat_home: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
  cat_genz: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  
  hero: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80',
  sale: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'
};

const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.js');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Replace the base64 svgMap with the onlineUrls object
// First, find the block `const svgMap = { ... };`
const svgMapRegex = /const svgMap = {[\s\S]*?};\n\n\/\/ Base product dataset/;
mockDataContent = mockDataContent.replace(svgMapRegex, `const svgMap = ${JSON.stringify(onlineUrls, null, 2)};\n\n// Base product dataset`);

fs.writeFileSync(mockDataPath, mockDataContent);
console.log('mockData.js updated with real online URLs.');

// Update Home.jsx
const homePath = path.join(process.cwd(), 'src', 'pages', 'Home.jsx');
let homeContent = fs.readFileSync(homePath, 'utf8');

// The Base64 strings in Home.jsx are massive. We need to regex replace the `src="..."` entirely
homeContent = homeContent.replace(/<img\s+src="data:image\/svg\+xml;base64,[^"]+"\s+alt="Hero Fashion"/, `<img \n          src="${onlineUrls.hero}" \n          alt="Hero Fashion"`);
homeContent = homeContent.replace(/<img\s+src="data:image\/svg\+xml;base64,[^"]+"\s+alt="Sale"/, `<img \n                src="${onlineUrls.sale}" \n                alt="Sale"`);

fs.writeFileSync(homePath, homeContent);
console.log('Home.jsx updated with real online URLs.');
