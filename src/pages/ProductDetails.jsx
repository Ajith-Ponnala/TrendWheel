import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Heart, Truck, RefreshCw, ShieldCheck, ChevronRight, Minus, Plus } from 'lucide-react';
import { LoadingSkeleton, ProductCardSkeleton } from '../components/ui/LoadingSkeleton';
import { ProductCard } from '../components/ui/ProductCard';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { RecentlyViewed } from '../components/ui/RecentlyViewed';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addViewedProduct } = useRecentlyViewed();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getProductById(id);
        if (data) {
          setProduct(data);
          setActiveImage(data.images[0]);
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
          if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
          
          const related = await ProductService.getProductsByCategory(data.category);
          setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
          addViewedProduct(data.id);
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    // Reset state when id changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, { size: selectedSize, color: selectedColor });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <LoadingSkeleton className="aspect-[3/4] w-full rounded-2xl" />
          <div className="space-y-6 pt-4">
            <LoadingSkeleton type="text" className="w-24 h-6" />
            <LoadingSkeleton type="text" className="w-3/4 h-10" />
            <LoadingSkeleton type="text" className="w-1/3 h-8" />
            <LoadingSkeleton type="text" className="w-full h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li><Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-primary-600">{product.category}</Link></li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li className="text-gray-900 dark:text-gray-100 font-medium truncate w-32 sm:w-auto" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
        
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative group cursor-zoom-in">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
              style={product.imgFilter ? { filter: product.imgFilter } : {}}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border-2 ${activeImage === img ? 'border-primary-600' : 'border-transparent'} transition-all`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm font-bold text-primary-600 tracking-widest uppercase">{product.brand}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 px-2.5 py-0.5 rounded-full text-sm font-semibold">
              <span>★</span> {product.rating}
            </div>
            <span className="text-gray-500 text-sm hover:underline cursor-pointer">{product.reviewCount} Reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-gray-500 line-through mb-1">₹{product.originalPrice}</span>
                <span className="text-lg font-bold text-green-600 mb-1">({product.discount}% OFF)</span>
              </>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
            Tax included. Free shipping on all orders above ₹1000.
          </p>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Select Size: <span className="font-bold text-primary-600">{selectedSize}</span></span>
                <button className="text-sm text-primary-600 underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size 
                        ? 'border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:border-primary-500 dark:text-primary-400' 
                        : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 font-medium">Select Color: <span className="font-bold text-primary-600">{selectedColor}</span></div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedColor === color 
                        ? 'border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:border-primary-500 dark:text-primary-400' 
                        : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <div className="mb-3 font-medium">Quantity</div>
            <div className="flex items-center w-32 border border-gray-300 dark:border-gray-700 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center font-medium">{quantity}</div>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button size="lg" className="flex-1 text-base h-14" onClick={handleAddToCart}>
              Add to Bag
            </Button>
            <Button size="lg" variant="outline" className="flex-1 text-base h-14" onClick={handleBuyNow}>
              Buy Now
            </Button>
            <Button size="icon" variant="outline" className="h-14 w-14 flex-shrink-0" onClick={() => toggleWishlist(product)}>
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary-600" />
              <div>
                <div className="font-semibold text-sm">Free Delivery</div>
                <div className="text-xs text-gray-500">Above ₹1000</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-primary-600" />
              <div>
                <div className="font-semibold text-sm">30 Days Return</div>
                <div className="text-xs text-gray-500">Easy returns</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary-600" />
              <div>
                <div className="font-semibold text-sm">Secure Payment</div>
                <div className="text-xs text-gray-500">100% secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Details tabs */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 rounded-2xl">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {product.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-500">Brand</span>
              <span className="font-medium">{product.brand}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{product.category} &gt; {product.subcategory}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-500">Gender</span>
              <span className="font-medium">{product.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-500">Stock Status</span>
              <span className="font-medium text-green-600">In Stock ({product.stock})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed />
    </div>
  );
}
