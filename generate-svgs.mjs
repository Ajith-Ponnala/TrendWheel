import fs from 'fs';
import path from 'path';

const images = [
  { name: 'tshirt', text: 'Classic T-Shirt', color1: '#4F46E5', color2: '#3B82F6' },
  { name: 'pants', text: 'Navy Chinos', color1: '#0F172A', color2: '#1E293B' },
  { name: 'dress', text: 'Floral Dress', color1: '#BE185D', color2: '#E11D48' },
  { name: 'jeans', text: 'Mom Jeans', color1: '#1D4ED8', color2: '#2563EB' },
  { name: 'sneakers', text: 'Running Sneakers', color1: '#B91C1C', color2: '#DC2626' },
  { name: 'bag', text: 'Leather Tote', color1: '#78350F', color2: '#92400E' },
  { name: 'kids', text: 'Kids Tee', color1: '#047857', color2: '#059669' },
  { name: 'skincare', text: 'Vitamin C Serum', color1: '#D97706', color2: '#F59E0B' },
  { name: 'bedsheet', text: 'Luxury Bedsheet', color1: '#0369A1', color2: '#0284C7' },
  { name: 'hoodie', text: 'Oversized Hoodie', color1: '#374151', color2: '#4B5563' },
  { name: 'cat_men', text: 'Men Fashion', color1: '#1F2937', color2: '#111827' },
  { name: 'cat_women', text: 'Women Fashion', color1: '#831843', color2: '#9D174D' },
  { name: 'cat_kids', text: 'Kids Collection', color1: '#166534', color2: '#15803D' },
  { name: 'cat_shoes', text: 'Footwear', color1: '#7F1D1D', color2: '#991B1B' },
  { name: 'cat_acc', text: 'Accessories', color1: '#713F12', color2: '#854D0E' },
  { name: 'cat_beauty', text: 'Beauty & Skincare', color1: '#064E3B', color2: '#065F46' },
  { name: 'cat_home', text: 'Home & Living', color1: '#1E3A8A', color2: '#1E40AF' },
  { name: 'cat_genz', text: 'GenZ Streetwear', color1: '#4C1D95', color2: '#5B21B6' },
  { name: 'hero', text: 'Discover Trends', color1: '#111827', color2: '#030712' },
  { name: 'sale', text: 'End of Season Sale', color1: '#991B1B', color2: '#7F1D1D' }
];

const dir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function generateSVG(name, text, color1, color2) {
  const isHero = name === 'hero';
  const width = isHero ? 2000 : 800;
  const height = isHero ? 1200 : (name === 'sale' ? 800 : (name.startsWith('cat') ? 800 : 1067));
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)" />
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width/15}" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
      ${text}
    </text>
    <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.3" rx="16" />
  </svg>`;
}

for (const img of images) {
  const filename = path.join(dir, `${img.name}.svg`);
  fs.writeFileSync(filename, generateSVG(img.name, img.text, img.color1, img.color2));
  console.log(`Generated ${filename}`);
}

console.log('All SVGs generated successfully.');
