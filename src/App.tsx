import { useState, useCallback, useEffect, useRef } from 'react';
import { CartProvider, type Product } from '@/context/CartContext';
import productsData from '@/data/products.json';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ImageModal from '@/components/ImageModal';
import ProductModal from '@/components/ProductModal';
import GoogleReviews from '@/components/GoogleReviews';
import HeroSlideshow from '@/components/HeroSlideshow';
import HeroReviews from '@/components/HeroReviews';
import ProductCard from '@/components/ProductCard';
import FAQ from '@/components/FAQ';
import LocationMap from '@/components/LocationMap';
import QuemCuida from '@/components/QuemCuida';
import Logo from '@/components/Logo';
import { FACTS, formatInt } from '@/data/facts';
import {
  Truck,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Star,
  Scissors,
  Droplets,
  Syringe,
  ChevronRight,
  Package,
  Heart,
  PawPrint,
  Egg,
  ZoomIn,
} from 'lucide-react';
import './App.css';

// ==================== PRODUCTS DATA ====================
// Dados vivem em src/data/products.json. A automacao Sheets -> GitHub escreve
// apenas esse arquivo, nunca este componente. Ver docs/specs/2026-09-19-sync-precos-google-sheets-design.md
const products: Product[] = (productsData as unknown as Product[]).filter((p) => p.active !== false);

// Ordem de exibicao das pastilhas.
const CATEGORY_ORDER = ['Cães', 'Gatos', 'Equinos', 'Petiscos', 'Acessórios'];

// Pastilhas derivadas dos produtos ativos: categoria sem produto ativo nao aparece.
const categories = [
  'Todos',
  ...CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c)),
];

// ==================== MAIN APP ====================
function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [imageModal, setImageModal] = useState<{ open: boolean; src: string; alt: string }>({
    open: false,
    src: '',
    alt: '',
  });
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const catalogRef = useRef<HTMLElement>(null);

  const filteredProducts =
    activeCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const scrollToCatalog = useCallback(() => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Counter animation
  const [counts, setCounts] = useState({ clients: 0, products: 0, rating: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animateValue('clients', 0, FACTS.instagramFollowers, 2000);
          animateValue('products', 0, FACTS.storeItems, 2000);
          animateValue('rating', 0, FACTS.googleRating * 10, 2000);
        }
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const animateValue = (
    key: keyof typeof counts,
    start: number,
    end: number,
    duration: number
  ) => {
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts((prev) => ({ ...prev, [key]: Math.floor(start + (end - start) * eased) }));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="min-h-[100dvh] bg-cream">
      <Header onCartClick={() => setCartOpen(true)} />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <ProductModal
        product={selectedProduct}
        isOpen={productModalOpen}
        siblings={filteredProducts}
        onNavigate={setSelectedProduct}
        onClose={() => {
          setProductModalOpen(false);
          setSelectedProduct(null);
        }}
      />
      <ImageModal
        isOpen={imageModal.open}
        imageSrc={imageModal.src}
        alt={imageModal.alt}
        onClose={() => setImageModal({ open: false, src: '', alt: '' })}
      />

      {/* ============ HERO ============ */}
      <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden bg-forest-night">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/assets/produtos-loja.webp"
            alt="Produtos Mundo Animal Pet Shop em Itabira"
            fetchPriority="high"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              heroLoaded ? 'scale-100 opacity-25' : 'scale-110 opacity-0'
            }`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-night via-brand-green-dark/95 to-brand-green/80" />
          <div className="absolute -top-40 right-[6%] w-[36rem] h-[36rem] rounded-full bg-brand-orange/15 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-night/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-20 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 lg:gap-16 items-center w-full">
          <div className="text-cream">
            <div
              className="flex items-center gap-3 mb-5 sm:mb-7"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transition: 'opacity 0.8s ease-out 0.1s',
              }}
            >
              <span className="h-px w-8 sm:w-10 bg-brand-orange" />
              <span className="text-brand-orange text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
                Pet shop e veterinária · desde 1998
              </span>
            </div>

            <h1
              className="font-display font-semibold text-[2.6rem] sm:text-6xl lg:text-7xl leading-[1.04] tracking-tight"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              Tudo para o
              <br />
              <span className="italic font-medium text-brand-orange">seu melhor</span>
              <br />
              amigo
            </h1>

            <p
              className="text-cream/80 text-base sm:text-lg mt-5 sm:mt-7 max-w-md leading-relaxed"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.4s',
              }}
            >
              Ração que o seu pet adora, petisco pra recompensar, banho com busca em casa e vacina sem
              complicação. Aqui, cada bicho é chamado pelo nome.
            </p>

            <div
              className="flex flex-wrap gap-3 sm:gap-4 mt-8"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.6s',
              }}
            >
              <button
                onClick={scrollToCatalog}
                className="bg-brand-orange text-brand-green-dark font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:brightness-105 transition-all hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
              >
                Ver produtos <ChevronRight size={16} className="sm:hidden" /><ChevronRight size={18} className="hidden sm:block" />
              </button>
              <a
                href="https://wa.me/message/DVEYNOWZKFLAK1"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-cream/40 text-cream font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-cream/10 hover:border-cream/70 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <PawPrint size={16} className="sm:hidden" /><PawPrint size={18} className="hidden sm:block" /> Chamar no WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-cream/15 max-w-lg"
            >
              <div>
                <div className="font-display font-semibold text-2xl sm:text-4xl">{formatInt(counts.clients)}+</div>
                <div className="text-cream/60 text-[10px] sm:text-sm mt-1">Famílias no Instagram</div>
              </div>
              <div>
                <div className="font-display font-semibold text-2xl sm:text-4xl">{counts.products}+</div>
                <div className="text-cream/60 text-[10px] sm:text-sm mt-1">Itens na loja</div>
              </div>
              <div>
                <div className="font-display font-semibold text-2xl sm:text-4xl flex items-center gap-0.5 sm:gap-1">
                  {(counts.rating / 10).toFixed(1)} <Star size={14} className="fill-brand-orange text-brand-orange sm:hidden" /><Star size={20} className="fill-brand-orange text-brand-orange hidden sm:block" />
                </div>
                <div className="text-cream/60 text-[10px] sm:text-sm mt-1">Nota no Google</div>
              </div>
            </div>

            {/* Comentários do Google — só no mobile (no desktop ficam no slideshow ao lado) */}
            <div
              className="lg:hidden"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.7s',
              }}
            >
              <div className="flex items-center gap-2 mt-8">
                <span className="h-px flex-1 bg-cream/20" />
                <span className="text-cream/70 text-[11px] font-semibold uppercase tracking-wider">
                  Quem é cliente recomenda
                </span>
                <span className="h-px flex-1 bg-cream/20" />
              </div>
              <HeroReviews />
            </div>
          </div>

          {/* Right side - foto + reviews sincronizados a cada 5s */}
          <HeroSlideshow heroLoaded={heroLoaded} />
        </div>
      </section>

      {/* ============ FAIXA DE VANTAGENS ============ */}
      <section className="bg-cream-deep border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
          {[
            { icon: Truck, title: 'Frete grátis em Itabira', sub: 'Nas compras acima de R$ 100' },
            { icon: Scissors, title: 'Banho e tosa em casa', sub: 'A gente busca e devolve' },
            { icon: Syringe, title: 'Vacinas na loja', sub: 'Veterinária aplicando aqui' },
            { icon: Heart, title: 'Atendimento de família', sub: 'Em Itabira desde 1998' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 sm:gap-4">
              <span className="grid place-items-center shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-paper border border-brand-green/20 text-brand-green">
                <Icon size={20} />
              </span>
              <span className="leading-tight">
                <span className="block font-semibold text-[13px] sm:text-sm text-gray-900">{title}</span>
                <span className="block text-[11px] sm:text-xs text-gray-500 mt-0.5">{sub}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="servicos" className="py-16 sm:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-gold-ink font-semibold text-xs sm:text-[13px] uppercase tracking-[0.18em]">
              Nossos Serviços
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-5xl text-gray-900 mt-3 leading-[1.1]">
              A gente cuida do seu <span className="italic font-medium text-brand-green">pet</span> como se fosse nosso
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                icon: Droplets,
                title: 'Banho & Tosa',
                desc: 'Você fala o horário, a gente busca seu pet em casa, dá banho, faz a tosa e devolve cheiroso na sua porta.',
                image: '/assets/servico-banho.webp',
                position: 'object-[50%_40%]',
              },
              {
                icon: Syringe,
                title: 'Vacinas',
                desc: 'Veterinária aplicando vacina aqui na nossa clínica. Pode trazer seu pet, a gente atende com calma.',
                image: '/assets/servico-vacinas.webp',
                position: 'object-[50%_45%]',
              },
              {
                icon: Egg,
                title: 'Criação de Galinhas',
                desc: 'A gente cria Brahma com cuidado e tem ovos fresquinhos pra você. Passa na loja pra conhecer o plantel.',
                image: '/assets/galinhas-brahma.webp',
                position: 'object-[50%_88%]',
              },
              {
                icon: Truck,
                title: 'Entrega',
                desc: 'Pediu pelo WhatsApp acima de R$ 100? A gente leva até a sua porta sem cobrar frete. Em qualquer bairro de Itabira.',
                panel: { big: 'R$ 100', small: 'e o frete é por nossa conta' },
              },
            ].map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-paper rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-[0_24px_48px_-16px_rgba(18,61,38,0.22)] transition-all duration-300 hover:-translate-y-1"
                >
                  {service.image ? (
                    <div
                      className="aspect-[4/3] overflow-hidden cursor-pointer relative bg-cream-deep"
                      onClick={() =>
                        setImageModal({ open: true, src: service.image!, alt: service.title })
                      }
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className={`w-full h-full object-cover ${service.position} saturate-[0.9] transition-transform duration-500 group-hover:scale-105`}
                        loading="lazy"
                      />
                      {/* Mesmo véu verde em todas as fotos: unifica a luz de imagens de origens diferentes */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/35 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <ZoomIn
                          size={24}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green-dark to-brand-green flex flex-col items-center justify-center text-center px-4">
                      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-orange/15 blur-2xl" />
                      <Truck size={22} className="text-brand-orange mb-2 relative" />
                      <span className="relative text-cream/70 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
                        Frete grátis acima de
                      </span>
                      <span className="relative font-display font-semibold text-4xl sm:text-5xl text-brand-orange leading-none mt-1.5">
                        {service.panel!.big}
                      </span>
                      <span className="relative text-cream/80 text-xs sm:text-sm mt-2">{service.panel!.small}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center mb-3">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{service.desc}</p>
                    <a
                      href="https://wa.me/message/DVEYNOWZKFLAK1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-green font-medium text-sm mt-4 hover:underline"
                    >
                      Agendar <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ PRODUCT CATALOG ============ */}
      <section id="produtos" ref={catalogRef} className="py-16 sm:py-24 bg-cream-deep">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-gold-ink font-semibold text-xs sm:text-[13px] uppercase tracking-[0.18em]">
              Aqui na loja
            </span>
            <h2 className="font-display font-semibold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
              Escolha o que vai <span className="italic font-medium text-brand-green">pra casa</span> do seu pet
            </h2>
          </div>

          {/* Categorias em selos */}
          <div
            className="flex overflow-x-auto pb-3 pt-1 gap-4 sm:gap-8 sm:justify-center mb-8 sm:mb-12 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const img = cat === 'Todos' ? null : products.find((p) => p.category === cat)?.image;
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={active}
                  className="group flex flex-col items-center gap-2.5 shrink-0 w-[4.75rem] sm:w-28"
                >
                  <span
                    className={`grid place-items-center w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 rounded-full overflow-hidden bg-paper transition-all duration-300 ring-1 ${
                      active
                        ? 'ring-2 ring-brand-orange ring-offset-2 ring-offset-cream-deep shadow-[0_12px_28px_-10px_rgba(18,61,38,0.5)]'
                        : 'ring-gray-300 group-hover:ring-brand-orange/80 group-hover:-translate-y-0.5'
                    }`}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className={`w-full h-full ${cat === 'Equinos' ? 'object-cover' : 'object-contain p-2'}`}
                      />
                    ) : (
                      <PawPrint size={30} className="text-brand-green" />
                    )}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      active ? 'text-brand-green-dark' : 'text-gray-600 group-hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onViewDetails={(p) => {
                  setSelectedProduct(p);
                  setProductModalOpen(true);
                }}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package size={48} className="mx-auto mb-4" />
              <p className="text-lg">Nenhum produto nesta categoria ainda.</p>
            </div>
          )}
        </div>
      </section>

      {/* ============ TRUST / WHY US ============ */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-20">
          <div className="lg:sticky lg:top-28 self-start">
            <span className="text-gold-ink font-semibold text-xs sm:text-[13px] uppercase tracking-[0.18em]">
              Por que tantos vizinhos voltam aqui
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-5xl text-gray-900 mt-3 leading-[1.08]">
              A loja da <span className="italic font-medium text-brand-green">vizinhança</span> em Itabira
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed max-w-md">
              Desde 1998 a gente cuida dos pets da cidade pelo nome, com marca boa, entrega sem
              cobrança de frete e resposta rápida no WhatsApp.
            </p>
            <a
              href="https://wa.me/message/DVEYNOWZKFLAK1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-7 bg-brand-green text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-green-dark transition-colors text-sm sm:text-base"
            >
              <PawPrint size={18} /> Falar com a gente
            </a>
          </div>

          <ol className="divide-y divide-gray-200 border-y border-gray-200">
            {[
              {
                title: 'Marca que a gente confia',
                desc: 'Só colocamos na prateleira o que daríamos pro nosso próprio pet. Purina, Colosso, Guabi, PowerDog e outras.',
              },
              {
                title: 'Frete grátis em qualquer bairro',
                desc: 'Nas compras acima de R$ 100, você não paga nada pela entrega aqui em Itabira. Combina pelo WhatsApp e a gente vai.',
              },
              {
                title: 'A gente conhece seu pet pelo nome',
                desc: 'Quando você volta, o Vinícius e a equipe já sabem o nome do bicho e a ração de sempre.',
              },
              {
                title: `${formatInt(FACTS.instagramFollowers)} famílias nos acompanham`,
                desc: `${String(FACTS.googleRating).replace('.', ',')} estrelas em ${FACTS.googleReviews} avaliações no Google e mais de ${formatInt(Math.floor(FACTS.instagramFollowers / 100) * 100)} famílias de olho na gente no Instagram.`,
              },
              {
                title: 'Resposta rápida no WhatsApp',
                desc: 'Você manda mensagem e a gente responde na hora. Sem fila, sem espera, sem robô.',
              },
              {
                title: 'Banho e tosa que seu pet vai gostar',
                desc: 'Banho com produto suave, tosa higiênica ou de raça. E a gente busca e devolve seu pet em casa.',
              },
            ].map((item, i) => (
              <li key={item.title} className="grid grid-cols-[3.25rem_minmax(0,1fr)] sm:grid-cols-[4.5rem_minmax(0,1fr)] gap-3 sm:gap-5 py-6 sm:py-7">
                <span className="font-display text-3xl sm:text-4xl text-gold-ink tabular-nums leading-none pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-xl text-gray-900">{item.title}</h3>
                  <p className="text-sm sm:text-[15px] text-gray-600 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ QUEM CUIDA DO SEU PET ============ */}
      <QuemCuida />

      {/* ============ GOOGLE REVIEWS ============ */}
      <GoogleReviews />

      {/* ============ LOCATION MAP ============ */}
      <LocationMap />

      {/* ============ FAQ ============ */}
      <FAQ />

      {/* ============ BANHO & TOSA CTA ============ */}
      <section className="relative overflow-hidden bg-forest-night">
        <div className="absolute -top-32 -left-24 w-[32rem] h-[32rem] rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 md:gap-16 items-center">
          <div className="text-cream text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
              <span className="h-px w-8 bg-brand-orange" />
              <span className="text-brand-orange text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
                Banho e tosa
              </span>
            </div>
            <h2 className="font-display font-semibold text-3xl sm:text-5xl leading-[1.08]">
              A gente busca, <span className="italic font-medium text-brand-orange">cuida</span> e devolve cheiroso
            </h2>
            <p className="text-cream/75 text-base sm:text-lg mt-5 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Marca um horário pelo WhatsApp. A gente busca seu pet, dá banho, faz a tosa e devolve na sua porta.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-8">
              <a
                href="https://wa.me/553138311702?text=Ola! Gostaria de agendar Banho e Tosa para meu pet."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange text-brand-green-dark font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:brightness-105 transition-all hover:shadow-xl hover:shadow-brand-orange/30 text-sm sm:text-base"
              >
                <PawPrint size={18} /> Agendar pelo WhatsApp
              </a>
              <a
                href="tel:+553138311702"
                className="inline-flex items-center gap-2 border border-cream/40 text-cream font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-cream/10 transition-colors text-sm sm:text-base"
              >
                <Phone size={16} /> {FACTS.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="relative max-w-sm md:max-w-none mx-auto w-full">
            <div className="rounded-t-[999px] rounded-b-[2rem] border border-brand-orange/45 p-2">
              <div className="aspect-[4/5] rounded-t-[999px] rounded-b-[1.5rem] overflow-hidden bg-brand-green-dark">
                <img
                  src="/assets/servico-tosa.webp"
                  alt="Tosa em um pet no salão do Mundo Animal"
                  className="w-full h-full object-cover object-[42%_50%] saturate-[0.9]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer id="contato" className="bg-forest-night text-white border-t border-brand-orange/25">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 sm:gap-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Logo variant="dark" className="mb-5" />
              <p className="text-cream/70 text-sm leading-relaxed max-w-xs">
                Onde felicidade e amor têm 4 patas. A gente atende em Itabira{' '}
                <strong className="text-cream">desde {FACTS.since}</strong>, com a mesma família, os mesmos
                produtos bons e o mesmo carinho de sempre.
              </p>
              <div className="flex gap-3 mt-6">
                <a
                  href="https://www.instagram.com/mundoanimalitabira/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram do Mundo Animal"
                  className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-brand-orange hover:text-brand-green-dark transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4 text-cream">Links rápidos</h4>
              <ul className="space-y-3">
                {['Produtos', 'Serviços', 'Banho & Tosa', 'Contato'].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        const id = link === 'Produtos' ? '#produtos' : link === 'Serviços' ? '#servicos' : link === 'Banho & Tosa' ? '#servicos' : '#contato';
                        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-cream/70 hover:text-brand-orange transition-colors text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4 text-cream">Serviços</h4>
              <ul className="space-y-3 text-cream/70 text-sm">
                <li className="flex items-center gap-2">
                  <Droplets size={14} className="text-brand-orange" /> Banho
                </li>
                <li className="flex items-center gap-2">
                  <Scissors size={14} className="text-brand-orange" /> Tosa
                </li>
                <li className="flex items-center gap-2">
                  <Syringe size={14} className="text-brand-orange" /> Vacinas
                </li>
                <li className="flex items-center gap-2">
                  <Truck size={14} className="text-brand-orange" /> Entrega domiciliar
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-display font-semibold text-lg mb-4 text-cream">Contato</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-brand-orange mt-0.5 shrink-0" />
                  <p className="text-cream/70 text-sm">
                    Avenida João Pinheiro, nº 194, Centro
                    <br />
                    Itabira - MG
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-orange shrink-0" />
                  <a href="tel:+553138311702" className="text-cream/70 hover:text-brand-orange transition-colors text-sm">
                    {FACTS.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-brand-orange mt-0.5 shrink-0" />
                  <p className="text-cream/70 text-sm">
                    Segunda a sexta, 8h às 18h
                    <br />
                    Sábado, 8h às 13h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-cream/50 text-xs">
              &copy; {new Date().getFullYear()} Mundo Animal Pet Shop. Todos os direitos reservados.
            </p>
            <p className="text-cream/50 text-xs flex items-center gap-1.5">
              Criado por{' '}
              <a
                href="https://www.instagram.com/salesroute_ia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/90 font-semibold hover:text-brand-orange transition-colors inline-flex items-center gap-1"
              >
                <Instagram size={12} /> SalesRoute
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/message/DVEYNOWZKFLAK1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-brand-green text-brand-orange ring-2 ring-brand-orange/70 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg shadow-brand-green-dark/40 flex items-center justify-center hover:scale-110 transition-transform animate-pulse-glow"
        aria-label="WhatsApp"
      >
        <PawPrint size={22} className="sm:hidden" />
        <PawPrint size={28} className="hidden sm:block" />
      </a>
    </div>
  );
}

// ==================== WRAPPER ====================
export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
