import React from 'react';
import { X, ShoppingCart, Check, Star, Package, Leaf, MessageCircle } from 'lucide-react';
import { useCart, type Product } from '@/context/CartContext';

const WHATSAPP_QUOTE_URL = (name: string) =>
  `https://wa.me/553138311702?text=${encodeURIComponent(
    `Olá! Gostaria de saber valores e tamanhos disponíveis de: ${name}.`
  )}`;

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, items } = useCart();

  if (!isOpen || !product) return null;

  const inCart = items.find((i) => i.id === product.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white transition-colors shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="relative bg-gray-50 rounded-t-2xl sm:rounded-t-3xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 sm:h-64 object-contain p-4"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 promo-badge text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
            {product.category}
          </span>

          <h2 className="font-inter font-bold text-lg sm:text-xl text-gray-900 mt-2">
            {product.name}
          </h2>

          {product.weight && (
            <p className="text-sm text-gray-400 mt-1">{product.weight}</p>
          )}

          {/* Price */}
          <div className="flex items-end gap-3 mt-3">
            {product.price != null ? (
              <>
                <span className="font-bold text-2xl sm:text-3xl text-brand-green">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through mb-1">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="font-bold text-base sm:text-lg text-brand-green leading-tight">
                Todos os tamanhos disponíveis. Consulte os valores no WhatsApp.
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-5">
              <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                <Package size={16} className="text-brand-green" /> Descrição
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                {product.description}
              </p>
            </div>
          )}

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                <Leaf size={16} className="text-brand-green" /> Benefícios
              </h3>
              <ul className="mt-2 space-y-2">
                {product.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Star size={14} className="text-brand-orange mt-0.5 shrink-0 fill-brand-orange" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to cart or quote button */}
          {product.quoteOnWhatsapp || product.price == null ? (
            <a
              href={WHATSAPP_QUOTE_URL(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm bg-brand-green text-white hover:bg-brand-green-dark transition-colors"
            >
              <MessageCircle size={18} /> Consultar valores no WhatsApp
            </a>
          ) : (
            <button
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className={`w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-all ${
                inCart
                  ? 'bg-brand-green text-white hover:bg-brand-green-dark'
                  : 'bg-gray-100 text-gray-700 hover:bg-brand-green hover:text-white'
              }`}
            >
              {inCart ? (
                <>
                  <Check size={18} />
                  {inCart.quantity}x no carrinho: Adicionar mais
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Adicionar ao Carrinho
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductModal);
