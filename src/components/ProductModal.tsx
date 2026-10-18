import React, { useEffect, useRef, useState } from 'react';
import { X, ShoppingCart, Check, Package, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart, type Product } from '@/context/CartContext';

const WHATSAPP_QUOTE_URL = (name: string) =>
  `https://wa.me/553138311702?text=${encodeURIComponent(
    `Olá! Gostaria de saber valores e tamanhos disponíveis de: ${name}.`
  )}`;

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  /** Produtos na ordem em que aparecem na vitrine, para os botões Anterior/Próximo. */
  siblings?: Product[];
  onNavigate?: (product: Product) => void;
}

/** Ícone do tópico; se o arquivo não carregar, cai no ✓ em vez de mostrar imagem quebrada. */
const BulletIcon: React.FC<{ name?: string }> = ({ name }) => {
  const [failed, setFailed] = useState(false);
  if (!name || failed) {
    return (
      <span className="grid place-items-center w-[52px] h-[52px] shrink-0">
        <span className="grid place-items-center w-7 h-7 rounded-full bg-brand-green/10 text-brand-green">
          <Check size={16} strokeWidth={3} />
        </span>
      </span>
    );
  }
  return (
    <img
      src={`/assets/icones/${name}.webp`}
      alt=""
      width={52}
      height={52}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-[52px] h-[52px] shrink-0 object-contain"
    />
  );
};

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  siblings = [],
  onNavigate,
}) => {
  const { addToCart, items } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const index = product ? siblings.findIndex((p) => p.id === product.id) : -1;
  const canNavigate = !!onNavigate && siblings.length > 1 && index >= 0;
  const go = (delta: number) => {
    if (!canNavigate) return;
    onNavigate!(siblings[(index + delta + siblings.length) % siblings.length]);
  };

  // volta ao topo e à foto de capa quando troca de produto
  useEffect(() => {
    setPhotoIndex(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [product?.id]);

  // Esc fecha; setas navegam; fundo não rola
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?.id, siblings.length]);

  if (!isOpen || !product) return null;

  const inCart = items.find((i) => i.id === product.id);
  const photos = product.images && product.images.length > 1 ? product.images : null;
  const mainImage = photos ? photos[photoIndex] : product.image;
  const hasBullets = !!product.bullets && product.bullets.length > 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-forest-night/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        ref={scrollRef}
        className="relative bg-paper rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto animate-fade-in-up shadow-2xl shadow-black/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-paper/90 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-sm border border-gray-200"
        >
          <X size={20} />
        </button>

        {/* Foto */}
        <div className="relative bg-cream border-b border-gray-200 rounded-t-2xl sm:rounded-t-3xl">
          <img
            src={mainImage}
            alt={product.name}
            className={`w-full object-contain p-6 ${photos ? 'h-64 sm:h-80 pb-20' : 'h-60 sm:h-72'}`}
          />
          {product.badge && (
            <span className="absolute top-4 left-4 promo-badge text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          {photos && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2" role="group" aria-label="Fotos do produto">
              {photos.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Foto ${i + 1} de ${photos.length}`}
                  aria-current={i === photoIndex}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-paper overflow-hidden border-2 transition-all hover:-translate-y-0.5 ${
                    i === photoIndex ? 'border-brand-green' : 'border-gray-200 hover:border-brand-orange'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="px-5 sm:px-7 pt-5 sm:pt-7">
          {canNavigate && (
            <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-200" role="group" aria-label="Navegar entre produtos">
              <button
                onClick={() => go(-1)}
                className="inline-flex items-center gap-1.5 min-h-[40px] pl-3 pr-4 rounded-full bg-brand-green text-cream text-sm font-semibold hover:bg-brand-orange hover:text-brand-green-dark transition-colors"
                aria-label="Produto anterior"
              >
                <ChevronLeft size={18} /> Anterior
              </button>
              <span className="text-xs font-semibold text-gray-500 tabular-nums" aria-live="polite">
                {index + 1} de {siblings.length}
              </span>
              <button
                onClick={() => go(1)}
                className="inline-flex items-center gap-1.5 min-h-[40px] pl-4 pr-3 rounded-full bg-brand-green text-cream text-sm font-semibold hover:bg-brand-orange hover:text-brand-green-dark transition-colors"
                aria-label="Próximo produto"
              >
                Próximo <ChevronRight size={18} />
              </button>
            </div>
          )}

          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-ink">
            {product.category}
          </span>

          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-gray-900 mt-1.5 leading-tight">
            {product.name}
          </h2>

          {product.weight && <p className="text-sm text-gray-500 mt-1.5">{product.weight}</p>}

          {/* Preço */}
          <div className="flex items-end gap-3 mt-4">
            {product.price != null ? (
              <>
                <span className="font-display font-semibold text-3xl sm:text-4xl text-brand-green">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through mb-1.5">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="font-semibold text-base sm:text-lg text-brand-green leading-tight">
                Todos os tamanhos disponíveis. Consulte os valores no WhatsApp.
              </span>
            )}
          </div>

          {/* Tópicos com ícone; sem tópicos, cai na descrição corrida */}
          {hasBullets ? (
            <ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
              {product.bullets!.map((bullet, i) => (
                <li key={i} className="flex items-center gap-3.5 py-2.5 min-h-[64px] text-[15px] leading-snug text-gray-800">
                  <BulletIcon name={bullet.icon} />
                  <span>{bullet.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            product.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                  <Package size={16} className="text-brand-green" /> Descrição
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{product.description}</p>
              </div>
            )
          )}

          {/* Carrinho ou consulta: fica colado no rodapé da ficha enquanto os tópicos rolam */}
          <div className="sticky bottom-0 -mx-5 sm:-mx-7 px-5 sm:px-7 pt-5 pb-5 sm:pb-7 bg-gradient-to-t from-paper via-paper to-paper/0">
          {product.quoteOnWhatsapp || product.price == null ? (
            <a
              href={WHATSAPP_QUOTE_URL(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm bg-brand-green text-white hover:bg-brand-green-dark transition-colors"
            >
              <MessageCircle size={18} /> Consultar valores no WhatsApp
            </a>
          ) : (
            <button
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm bg-brand-green text-white hover:bg-brand-green-dark transition-colors"
            >
              {inCart ? (
                <>
                  <Check size={18} />
                  {inCart.quantity}x no carrinho: Adicionar mais
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Adicionar ao carrinho
                </>
              )}
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductModal);
