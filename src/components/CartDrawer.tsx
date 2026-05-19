import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-inter font-semibold text-lg flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-green" />
            Seu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-140px)] overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="mt-4 text-center font-medium">Seu carrinho esta vazio</p>
              <p className="text-sm mt-1">Adicione produtos para comecar</p>
              <button
                onClick={onClose}
                className="mt-6 bg-brand-green text-white font-medium px-6 py-2.5 rounded-full hover:bg-brand-green-dark transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 rounded-xl p-3 animate-fade-in-up"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-brand-green font-semibold text-sm mt-1">
                        {formatPrice(item.price ?? 0)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white rounded-full border px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart */}
              <div className="px-4 pb-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-600 underline transition-colors"
                >
                  Limpar carrinho
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-xl text-brand-green">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="flex items-center justify-center gap-2 w-full bg-brand-green text-white font-semibold py-3.5 rounded-full hover:bg-brand-green-dark transition-all hover:shadow-lg hover:shadow-brand-green/20"
            >
              Finalizar pelo WhatsApp
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(CartDrawer);
