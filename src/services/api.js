import { products, categories, coupons, mockOrders } from '../data/mockData';

// Simulated delay to mimic network request
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductService = {
  async getAllProducts() {
    await delay();
    return products;
  },

  async getProductById(id) {
    await delay();
    return products.find(p => p.id === id);
  },

  async getProductsByCategory(category) {
    await delay();
    if (!category) return products;
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase() || p.subcategory.toLowerCase() === category.toLowerCase());
  },

  async searchProducts(query) {
    await delay();
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }
};

export const CategoryService = {
  async getCategories() {
    await delay();
    return categories;
  }
};

export const OrderService = {
  async getOrders() {
    await delay();
    // Simulate fetching from LocalStorage first, fallback to mockOrders
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : mockOrders;
  },

  async placeOrder(orderData) {
    await delay(1000);
    const saved = localStorage.getItem('orders');
    const existingOrders = saved ? JSON.parse(saved) : mockOrders;
    
    const now = new Date().toISOString();
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 100000)}-${Math.floor(Math.random() * 100000)}`,
      date: now,
      status: 'Pending',
      tracking: {
        Pending: { completed: true, timestamp: now },
        Confirmed: { completed: false, timestamp: null },
        Packed: { completed: false, timestamp: null },
        Shipped: { completed: false, timestamp: null },
        OutForDelivery: { completed: false, timestamp: null },
        Delivered: { completed: false, timestamp: null },
        Cancelled: { completed: false, timestamp: null }
      },
      ...orderData
    };
    
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return newOrder;
  }
};

export const CouponService = {
  async validateCoupon(code) {
    await delay();
    const coupon = coupons.find(c => c.code === code.toUpperCase());
    if (!coupon) return { valid: false, message: 'Invalid or expired coupon' };
    return { valid: true, coupon };
  }
};
