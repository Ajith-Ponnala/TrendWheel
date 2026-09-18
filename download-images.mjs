import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  { name: 'tshirt', url: 'https://loremflickr.com/800/1067/tshirt?lock=101' },
  { name: 'pants', url: 'https://loremflickr.com/800/1067/pants?lock=102' },
  { name: 'dress', url: 'https://loremflickr.com/800/1067/dress?lock=103' },
  { name: 'jeans', url: 'https://loremflickr.com/800/1067/jeans?lock=104' },
  { name: 'sneakers', url: 'https://loremflickr.com/800/1067/sneakers?lock=105' },
  { name: 'bag', url: 'https://loremflickr.com/800/1067/bag,leather?lock=106' },
  { name: 'kids', url: 'https://loremflickr.com/800/1067/kids,clothing?lock=107' },
  { name: 'skincare', url: 'https://loremflickr.com/800/1067/skincare,serum?lock=108' },
  { name: 'bedsheet', url: 'https://loremflickr.com/800/1067/bedsheet,bedroom?lock=109' },
  { name: 'hoodie', url: 'https://loremflickr.com/800/1067/hoodie,streetwear?lock=110' },
  { name: 'cat_men', url: 'https://loremflickr.com/600/800/mens,fashion?lock=10' },
  { name: 'cat_women', url: 'https://loremflickr.com/600/800/womens,fashion?lock=11' },
  { name: 'cat_kids', url: 'https://loremflickr.com/600/800/kids,clothing?lock=12' },
  { name: 'cat_shoes', url: 'https://loremflickr.com/600/800/shoes?lock=13' },
  { name: 'cat_acc', url: 'https://loremflickr.com/600/800/accessories?lock=14' },
  { name: 'cat_beauty', url: 'https://loremflickr.com/600/800/makeup?lock=15' },
  { name: 'cat_home', url: 'https://loremflickr.com/600/800/interior?lock=16' },
  { name: 'cat_genz', url: 'https://loremflickr.com/600/800/streetwear?lock=17' },
  { name: 'hero', url: 'https://loremflickr.com/2000/1200/fashion,model?lock=50' },
  { name: 'sale', url: 'https://loremflickr.com/800/800/sale,shopping?lock=51' }
];

const dir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      
      const file = fs.createWriteStream(filename);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(filename, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const img of images) {
    const filename = path.join(dir, `${img.name}.jpg`);
    try {
      await downloadImage(img.url, filename);
    } catch (e) {
      console.error(`Error downloading ${img.name}:`, e.message);
    }
  }
  console.log('All downloads completed.');
}

main();
