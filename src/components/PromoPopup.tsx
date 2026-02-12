import { useEffect, useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface SaleProduct {
  _id: string;
  name: string;
  description: string;
  discount_percentage: number;
  image_url: string;
  prices: {
    KES: { amount: number };
  };
}

export default function PromoPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        const saleProducts = data.products?.filter((p: any) => p.on_sale && p.discount_percentage > 0) || [];
        setProducts(saleProducts);
      } catch (err) {
        console.error('Failed to fetch sale products:', err);
      }
    };

    fetchSaleProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    // Show first popup after 5 seconds
    const initialTimer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    // Rotate through products every 30 seconds
    const interval = setInterval(() => {
      setShowPopup(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setShowPopup(true);
      }, 500);
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [products]);

  const handleShopNow = () => {
    setShowPopup(false);
    navigate('/shop');
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  if (products.length === 0) return null;

  const product = products[currentIndex];
  const originalPrice = product.prices?.KES?.amount || 0;
  const discountedPrice = originalPrice * (1 - product.discount_percentage / 100);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-md w-full relative shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 text-gray-600 hover:text-gray-900 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative">
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse">
                {product.discount_percentage}% OFF
              </div>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              )}
            </div>

            <div className="p-8 text-center">
              <div className="inline-block bg-gradient-to-r from-[#8B6F47] to-[#6d5638] text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
                LIMITED TIME OFFER
              </div>

              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                {product.name}
              </h3>

              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-xl line-through text-gray-400">
                  KSh {originalPrice.toLocaleString()}
                </span>
                <span className="text-3xl font-bold text-red-600">
                  KSh {Math.round(discountedPrice).toLocaleString()}
                </span>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-red-700">
                  🔥 Save KSh {Math.round(originalPrice - discountedPrice).toLocaleString()} Today!
                </p>
              </div>

              <button
                onClick={handleShopNow}
                className="w-full bg-gradient-to-r from-[#8B6F47] to-[#6d5638] text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </button>

              <button
                onClick={handleClose}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
              >
                Maybe later
              </button>

              {products.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {products.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'w-8 bg-[#8B6F47]' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
