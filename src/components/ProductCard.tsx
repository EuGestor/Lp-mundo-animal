import React from 'react';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { useCart, type Product } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onViewDetails }) => {
  const { addToCart, items } = useCart();
  const inCart = items.find((i) => i.id === product.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div
      className="product-card bg-white rounded-2xl overflow-hidden border border-gray-100 animate-fade-in-up flex flex-col"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image - clickable */}
      <div
        className="relative bg-gray-50 aspect-square overflow-hidden cursor-pointer group"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 promo-badge text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
          {product.category}
        </span>
        <h3 className="font-inter font-semibold text-sm text-gray-800 mt-1 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        {product.weight && (
          <span className="text-xs text-gray-400 mt-1 block">{product.weight}</span>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 flex items-end gap-2">
          <span className="font-bold text-lg text-brand-green">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through mb-0.5">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-gray-200 text-gray-600 font-medium text-xs hover:bg-gray-50 transition-colors"
          >
            <Eye size={14} /> Ver detalhes
          </button>
          <button
            onClick={() => addToCart(product)}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full font-medium text-xs transition-all ${
              inCart
                ? 'bg-brand-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-brand-green hover:text-white'
            }`}
          >
            {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
