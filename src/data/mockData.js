const svgMap = {
  "bag": "/images/bag.jpg",
  "bedsheet": "/images/bedsheet.jpg",
  "dress": "/images/dress.jpg",
  "hero": "/images/hero.jpg",
  "hoodie": "/images/hoodie.jpg",
  "jeans": "/images/jeans.jpg",
  "kids": "/images/kids.jpg",
  "pants": "/images/pants.jpg",
  "sale": "/images/sale.jpg",
  "skincare": "/images/skincare.jpg",
  "sneakers": "/images/sneakers.jpg",
  "tshirt": "/images/tshirt.jpg",
  "cat_men": "/images/hoodie.jpg",
  "cat_women": "/images/dress.jpg",
  "cat_kids": "/images/kids.jpg",
  "cat_shoes": "/images/sneakers.jpg",
  "cat_acc": "/images/bag.jpg",
  "cat_beauty": "/images/skincare.jpg",
  "cat_home": "/images/bedsheet.jpg",
  "cat_genz": "/images/hoodie.jpg"
};

// Base product dataset
const baseProducts = [
  {
    name: "Classic White Cotton T-Shirt",
    brand: "H&M",
    category: "Men",
    subcategory: "Topwear",
    gender: "Men",
    price: 799,
    originalPrice: 1299,
    rating: 4.5,
    reviewCount: 342,
    images: [svgMap['tshirt']],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Grey"],
    description: "Essential crewneck t-shirt made from soft, breathable cotton. Perfect for everyday wear.",
    stock: 150,
    tags: ["casual", "basics", "summer"]
  },
  {
    name: "Slim Fit Navy Chinos",
    brand: "Zara",
    category: "Men",
    subcategory: "Bottomwear",
    gender: "Men",
    price: 1990,
    originalPrice: 2990,
    rating: 4.2,
    reviewCount: 128,
    images: [svgMap['pants']],
    sizes: ["30", "32", "34", "36"],
    colors: ["Navy", "Beige", "Olive"],
    description: "Versatile slim-fit chinos crafted from stretch cotton twill for all-day comfort.",
    stock: 85,
    tags: ["formal", "casual", "office"]
  },
  {
    name: "Floral Summer Wrap Dress",
    brand: "Mango",
    category: "Women",
    subcategory: "Dresses",
    gender: "Women",
    price: 2490,
    originalPrice: 3490,
    rating: 4.8,
    reviewCount: 512,
    images: [svgMap['dress']],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red/White", "Blue/White"],
    description: "Lightweight woven wrap dress featuring a vibrant floral print and flattering v-neckline.",
    stock: 40,
    tags: ["summer", "floral", "party"]
  },
  {
    name: "High-Waist Mom Jeans",
    brand: "Levi's",
    category: "Women",
    subcategory: "Jeans",
    gender: "Women",
    price: 3299,
    originalPrice: 4599,
    rating: 4.6,
    reviewCount: 890,
    images: [svgMap['jeans']],
    sizes: ["26", "28", "30", "32"],
    colors: ["Light Blue", "Mid Blue", "Black"],
    description: "Classic high-waisted mom jeans in non-stretch denim for an authentic vintage feel.",
    stock: 120,
    tags: ["denim", "vintage", "casual"]
  },
  {
    name: "Air Max Running Sneakers",
    brand: "Nike",
    category: "Men",
    subcategory: "Footwear",
    gender: "Men",
    price: 8495,
    originalPrice: 10495,
    rating: 4.9,
    reviewCount: 1240,
    images: [svgMap['sneakers']],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    colors: ["Red/Black", "White", "Grey"],
    description: "Premium running shoes featuring responsive cushioning and breathable mesh upper.",
    stock: 65,
    tags: ["sports", "running", "activewear"]
  },
  {
    name: "Minimalist Leather Tote",
    brand: "Fossil",
    category: "Women",
    subcategory: "Accessories",
    gender: "Women",
    price: 6590,
    originalPrice: 8990,
    rating: 4.7,
    reviewCount: 230,
    images: [svgMap['bag']],
    sizes: ["One Size"],
    colors: ["Brown", "Black"],
    description: "Spacious genuine leather tote bag with internal zip pockets and durable hardware.",
    stock: 30,
    tags: ["leather", "office", "premium"]
  },
  {
    name: "Kids Dinosaur Print Tee",
    brand: "Gap Kids",
    category: "Kids",
    subcategory: "Clothing",
    gender: "Boys",
    price: 499,
    originalPrice: 799,
    rating: 4.4,
    reviewCount: 85,
    images: [svgMap['kids']],
    sizes: ["3-4Y", "5-6Y", "7-8Y"],
    colors: ["Green", "Blue"],
    description: "Fun dinosaur graphic t-shirt made from 100% organic cotton for sensitive skin.",
    stock: 200,
    tags: ["kids", "casual", "fun"]
  },
  {
    name: "Hydrating Vitamin C Serum",
    brand: "The Ordinary",
    category: "Beauty",
    subcategory: "Skincare",
    gender: "Unisex",
    price: 850,
    originalPrice: 950,
    rating: 4.8,
    reviewCount: 3500,
    images: [svgMap['skincare']],
    sizes: ["30ml"],
    colors: [],
    description: "Brightening serum that evens skin tone and reduces the appearance of fine lines.",
    stock: 500,
    tags: ["skincare", "beauty", "glow"]
  },
  {
    name: "Luxury Egyptian Cotton Bedsheet",
    brand: "Bombay Dyeing",
    category: "Home",
    subcategory: "Bedsheets",
    gender: "Unisex",
    price: 2199,
    originalPrice: 4500,
    rating: 4.6,
    reviewCount: 420,
    images: [svgMap['bedsheet']],
    sizes: ["King", "Queen"],
    colors: ["White", "Beige", "Light Blue"],
    description: "400 thread count Egyptian cotton bedsheet set including 2 pillowcases. Ultra soft and durable.",
    stock: 90,
    tags: ["home", "bedroom", "luxury"]
  },
  {
    name: "Oversized Streetwear Hoodie",
    brand: "Urban Outfitters",
    category: "GenZ",
    subcategory: "Streetwear",
    gender: "Unisex",
    price: 2990,
    originalPrice: 4200,
    rating: 4.7,
    reviewCount: 650,
    images: [svgMap['hoodie']],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Neon Green"],
    description: "Heavyweight drop-shoulder hoodie with a relaxed oversized fit and minimalist chest graphic.",
    stock: 110,
    tags: ["streetwear", "trending", "winter"]
  }
];

// Generate 40+ products by duplicating and slightly modifying the base ones
export const products = [];
let idCounter = 1;

for (let i = 0; i < 5; i++) { // 5 iterations * 10 base = 50 products
  baseProducts.forEach((prod) => {
    // Add slight variations to prices and ratings for uniqueness
    const priceVariance = Math.floor(Math.random() * 200) - 100; 
    const isSale = Math.random() > 0.5;
    const finalPrice = isSale ? prod.price - (prod.price * 0.1) : prod.price + priceVariance;
    
    products.push({
      id: `P${idCounter.toString().padStart(4, '0')}`,
      ...prod,
      name: i === 0 ? prod.name : `${prod.name} ${['Pro', 'Max', 'Edition', 'V2', 'Essential'][i-1]}`,
      images: [...prod.images],
      price: Math.floor(finalPrice),
      originalPrice: prod.originalPrice + (i * 100),
      discount: Math.floor(((prod.originalPrice - finalPrice) / prod.originalPrice) * 100),
      rating: Math.max(3.5, Math.min(5, prod.rating + (Math.random() * 0.4 - 0.2))).toFixed(1),
      reviewCount: prod.reviewCount + Math.floor(Math.random() * 100),
      isNew: i === 1,
      isTrending: i === 2
    });
    idCounter++;
  });
}

export const categories = [
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
      { productId: 'P0001', name: 'Classic White Cotton T-Shirt', price: 799, quantity: 1, size: 'M' },
      { productId: 'P0003', name: 'Floral Summer Wrap Dress', price: 2499, quantity: 1, size: 'S' }
    ]
  },
  {
    id: 'ORD-98765-43210',
    date: '2026-09-17T14:20:00Z',
    status: 'Shipped',
    total: 8495,
    items: [
      { productId: 'P0005', name: 'Air Max Running Sneakers', price: 8495, quantity: 1, size: 'UK 9' }
    ]
  }
];
