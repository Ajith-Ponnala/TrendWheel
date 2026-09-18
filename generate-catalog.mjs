import fs from 'fs';
import path from 'path';

const svgMap = {
  "tshirt": "/images/tshirt.jpg",
  "pants": "/images/pants.jpg",
  "dress": "/images/dress.jpg",
  "jeans": "/images/jeans.jpg",
  "sneakers": "/images/sneakers.jpg",
  "bag": "/images/bag.jpg",
  "kids": "/images/kids.jpg",
  "skincare": "/images/skincare.jpg",
  "bedsheet": "/images/bedsheet.jpg",
  "hoodie": "/images/hoodie.jpg",
  "bomber": "/images/bomber.jpg",
  "cat_men": "/images/hoodie.jpg",
  "cat_women": "/images/dress.jpg",
  "cat_kids": "/images/kids.jpg",
  "cat_shoes": "/images/sneakers.jpg",
  "cat_acc": "/images/bag.jpg",
  "cat_beauty": "/images/skincare.jpg",
  "cat_home": "/images/bedsheet.jpg",
  "cat_genz": "/images/hoodie.jpg",
  "hero": "/images/hero.jpg",
  "sale": "/images/sale.jpg"
};

// Base definitions mapped to specific images and categories
const catalogDefinitions = [
  // Men - Topwear
  { base: 'tshirt', category: 'Men', subcategory: 'Topwear', gender: 'Men', variants: [
    { name: "Classic White Cotton T-Shirt", color: "White", filter: "", price: 799 },
    { name: "Vintage Grey Tee", color: "Grey", filter: "grayscale(100%) brightness(80%)", price: 899 },
    { name: "Graphic Print Red T-Shirt", color: "Red", filter: "sepia(1) hue-rotate(320deg) saturate(3) brightness(90%)", price: 1299 },
    { name: "Navy Crewneck Essential", color: "Navy", filter: "sepia(1) hue-rotate(180deg) saturate(3) brightness(70%)", price: 1099 },
    { name: "Olive Green Summer Tee", color: "Olive", filter: "sepia(1) hue-rotate(50deg) saturate(2) brightness(80%)", price: 999 },
  ]},
  { base: 'bomber', category: 'Men', subcategory: 'Winterwear', gender: 'Men', variants: [
    { name: "Olive Green Bomber Jacket", color: "Olive", filter: "", price: 3990 },
    { name: "Classic Black Flight Jacket", color: "Black", filter: "grayscale(100%) brightness(60%)", price: 4500 },
    { name: "Navy Blue Zip-Up Jacket", color: "Navy", filter: "hue-rotate(220deg)", price: 4200 },
    { name: "Maroon Winter Bomber", color: "Maroon", filter: "hue-rotate(120deg) saturate(2)", price: 3890 },
  ]},
  { base: 'hoodie', category: 'Men', subcategory: 'Winterwear', gender: 'Men', variants: [
    { name: "Essential Black Hoodie", color: "Black", filter: "", price: 1499 },
    { name: "Oversized Grey Hoodie", color: "Grey", filter: "brightness(130%) contrast(80%)", price: 1899 },
    { name: "Vintage Navy Pullover", color: "Navy", filter: "hue-rotate(200deg) brightness(120%)", price: 1699 },
    { name: "Rust Orange Streetwear Hoodie", color: "Rust", filter: "sepia(1) hue-rotate(340deg) saturate(2)", price: 2199 },
  ]},
  { base: 'pants', category: 'Men', subcategory: 'Bottomwear', gender: 'Men', variants: [
    { name: "Slim Fit Navy Chinos", color: "Navy", filter: "", price: 1990 },
    { name: "Classic Khaki Trousers", color: "Khaki", filter: "hue-rotate(150deg) saturate(1.5)", price: 2190 },
    { name: "Charcoal Grey Office Pants", color: "Grey", filter: "grayscale(100%)", price: 1890 },
    { name: "Olive Cargo Pants", color: "Olive", filter: "hue-rotate(30deg) brightness(80%)", price: 2490 },
  ]},

  // Women
  { base: 'dress', category: 'Women', subcategory: 'Dresses', gender: 'Women', variants: [
    { name: "Floral Summer Wrap Dress", color: "Blue Floral", filter: "", price: 2499 },
    { name: "Ruby Red Party Dress", color: "Red", filter: "hue-rotate(150deg) saturate(1.2)", price: 2999 },
    { name: "Emerald Green Maxi", color: "Green", filter: "hue-rotate(240deg) saturate(1.5)", price: 3499 },
    { name: "Midnight Black Evening Dress", color: "Black", filter: "grayscale(100%) brightness(50%)", price: 3999 },
    { name: "Sunset Orange Wrap Dress", color: "Orange", filter: "hue-rotate(180deg)", price: 2799 },
  ]},
  { base: 'jeans', category: 'Women', subcategory: 'Bottomwear', gender: 'Women', variants: [
    { name: "High-Waist Mom Jeans", color: "Light Blue", filter: "", price: 2999 },
    { name: "Dark Wash Skinny Jeans", color: "Dark Blue", filter: "brightness(60%) contrast(120%)", price: 3299 },
    { name: "Black Denim Vintage Jeans", color: "Black", filter: "grayscale(100%) brightness(40%)", price: 3499 },
    { name: "Distressed Ice Blue Jeans", color: "Ice Blue", filter: "brightness(130%)", price: 3199 },
  ]},
  { base: 'bag', category: 'Accessories', subcategory: 'Bags', gender: 'Women', variants: [
    { name: "Minimalist Leather Tote", color: "Brown", filter: "", price: 4995 },
    { name: "Black Office Handbag", color: "Black", filter: "grayscale(100%) brightness(40%)", price: 5495 },
    { name: "Tan Vintage Satchel", color: "Tan", filter: "saturate(1.5) brightness(110%)", price: 4295 },
    { name: "Cherry Red Leather Bag", color: "Red", filter: "hue-rotate(150deg) saturate(1.2)", price: 5995 },
  ]},

  // Footwear
  { base: 'sneakers', category: 'Footwear', subcategory: 'Sports Shoes', gender: 'Unisex', variants: [
    { name: "Air Max Running Sneakers", color: "Red/Black", filter: "", price: 8495 },
    { name: "Neon Green Trainers", color: "Neon", filter: "hue-rotate(90deg) saturate(2)", price: 7995 },
    { name: "Midnight Blue Sports Shoes", color: "Navy", filter: "hue-rotate(220deg)", price: 8995 },
    { name: "Stealth Black Running Shoes", color: "Black", filter: "grayscale(100%) brightness(50%)", price: 9495 },
    { name: "Purple Pro Performance Trainers", color: "Purple", filter: "hue-rotate(270deg)", price: 7495 },
  ]},

  // Kids
  { base: 'kids', category: 'Kids', subcategory: 'Topwear', gender: 'Boys', variants: [
    { name: "Dinosaur Print Green Tee", color: "Green", filter: "", price: 499 },
    { name: "Blue Explorer Kids Shirt", color: "Blue", filter: "hue-rotate(180deg)", price: 549 },
    { name: "Red Adventure T-Shirt", color: "Red", filter: "hue-rotate(300deg) saturate(1.5)", price: 599 },
    { name: "Yellow Sunshine Kids Tee", color: "Yellow", filter: "hue-rotate(240deg) brightness(120%)", price: 499 },
  ]},

  // Beauty
  { base: 'skincare', category: 'Beauty', subcategory: 'Skincare', gender: 'Unisex', variants: [
    { name: "Hydrating Vitamin C Serum", color: "Clear", filter: "", price: 695 },
    { name: "Rose Water Toner Drops", color: "Pink", filter: "hue-rotate(300deg) saturate(2)", price: 495 },
    { name: "Hyaluronic Acid Glow Serum", color: "Blue", filter: "hue-rotate(180deg)", price: 795 },
    { name: "Aloe Vera soothing drops", color: "Green", filter: "hue-rotate(80deg)", price: 595 },
    { name: "Night Repair Lavender Oil", color: "Purple", filter: "hue-rotate(240deg)", price: 895 },
  ]},

  // Home
  { base: 'bedsheet', category: 'Home', subcategory: 'Bedding', gender: 'Unisex', variants: [
    { name: "Luxury White Egyptian Cotton Sheets", color: "White", filter: "", price: 2499 },
    { name: "Navy Blue Hotel Collection", color: "Navy", filter: "sepia(1) hue-rotate(180deg) saturate(2) brightness(60%)", price: 2999 },
    { name: "Blush Pink Silk Bedsheet", color: "Pink", filter: "sepia(1) hue-rotate(300deg) saturate(1.5) brightness(90%)", price: 3499 },
    { name: "Sage Green Cotton Sheets", color: "Green", filter: "sepia(1) hue-rotate(80deg) saturate(1) brightness(80%)", price: 2299 },
    { name: "Charcoal Grey Modern Bedding", color: "Grey", filter: "grayscale(100%) brightness(70%)", price: 2799 },
  ]},
  
  // GenZ
  { base: 'hoodie', category: 'GenZ', subcategory: 'Streetwear', gender: 'Unisex', variants: [
    { name: "Oversized Streetwear Black Hoodie", color: "Black", filter: "", price: 2990 },
    { name: "Neon Cyberpunk Hoodie", color: "Neon Green", filter: "sepia(1) hue-rotate(90deg) saturate(3) brightness(120%)", price: 3490 },
    { name: "Lilac Aesthetic Pullover", color: "Lilac", filter: "sepia(1) hue-rotate(250deg) saturate(1.5) brightness(110%)", price: 3190 },
    { name: "Bleached Denim Style Hoodie", color: "Blue", filter: "sepia(1) hue-rotate(190deg) brightness(120%)", price: 3290 },
    { name: "Crimson Red Hypebeast Hoodie", color: "Red", filter: "sepia(1) hue-rotate(340deg) saturate(2)", price: 3590 },
  ]}
];

let products = [];
let idCounter = 1;

catalogDefinitions.forEach(def => {
  def.variants.forEach(variant => {
    products.push({
      id: "P" + idCounter.toString().padStart(4, '0'),
      name: variant.name,
      brand: ['Zara', 'H&M', 'Nike', 'Adidas', 'Mango', "Levi's", 'Urban Outfitters'][Math.floor(Math.random() * 7)],
      category: def.category,
      subcategory: def.subcategory,
      gender: def.gender,
      price: variant.price,
      originalPrice: Math.floor(variant.price * (1.2 + Math.random() * 0.5)),
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 900) + 10,
      images: [svgMap[def.base]],
      imgFilter: variant.filter, 
      sizes: def.category === 'Footwear' ? ["UK 7", "UK 8", "UK 9", "UK 10"] : (def.category === 'Beauty' || def.category === 'Home' || def.category === 'Accessories') ? ["One Size"] : ["S", "M", "L", "XL"],
      colors: [variant.color],
      description: "Premium " + variant.color.toLowerCase() + " " + def.subcategory.toLowerCase() + " item crafted with high quality materials. Experience perfect fit and trendsetting style with this exclusive addition to your wardrobe.",
      stock: Math.floor(Math.random() * 200) + 10,
      tags: [def.category.toLowerCase(), def.subcategory.toLowerCase(), "trending"],
      isNew: Math.random() > 0.7,
      isTrending: Math.random() > 0.5
    });
    idCounter++;
  });
});

let fileContent = 'export const svgMap = ' + JSON.stringify(svgMap, null, 2) + ';\n\n';
fileContent += 'export const products = ' + JSON.stringify(products, null, 2) + ';\n\n';

fileContent += `export const categories = [
  { id: 'men', name: 'Men', image: svgMap['cat_men'] },
  { id: 'women', name: 'Women', image: svgMap['cat_women'] },
  { id: 'kids', name: 'Kids', image: svgMap['cat_kids'] },
  { id: 'footwear', name: 'Footwear', image: svgMap['cat_shoes'] },
  { id: 'accessories', name: 'Accessories', image: svgMap['cat_acc'] },
  { id: 'beauty', name: 'Beauty', image: svgMap['cat_beauty'] },
  { id: 'home', name: 'Home', image: svgMap['cat_home'] },
  { id: 'genz', name: 'GenZ', image: svgMap['cat_genz'] }
];

export const coupons = [
  { code: 'TREND20', discount: 20, minOrder: 1500, type: 'percentage' },
  { code: 'NEWUSER', discount: 500, minOrder: 2000, type: 'fixed' },
  { code: 'FASHION10', discount: 10, minOrder: 0, type: 'percentage' }
];

export const mockOrders = [
  {
    id: 'ORD-12345-67890',
    date: '2026-09-15T10:30:00Z',
    status: 'Delivered',
    total: 3298,
    items: [
      { productId: 'P0001', name: 'Classic White Cotton T-Shirt', price: 799, quantity: 1, size: 'M' }
    ]
  }
];
`;

const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.js');
fs.writeFileSync(mockDataPath, fileContent);
console.log('mockData.js completely rebuilt with ' + products.length + ' dynamic products!');
