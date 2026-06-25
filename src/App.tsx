import { useState, useCallback, useEffect, useRef } from 'react';
import { CartProvider, type Product } from '@/context/CartContext';
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
  Shield,
  Package,
  Sparkles,
  Heart,
  PawPrint,
  Egg,
  ZoomIn,
} from 'lucide-react';
import './App.css';

// ==================== PRODUCTS DATA ====================
const products: Product[] = [
  {
    id: 1,
    originalPrice: 145.0,
    name: 'PowerDog Premium Carne',
    price: 130.0,
    image: '/assets/powerdog.jpg',
    category: 'Cães',
    weight: '15kg',
    description: 'Ração Super Premium para cães adultos de todas as raças. Alimento de alta performance com sabor irresistivel de carne, formulado pela ProLine com niveis nutricionais que superam padroes AAFCO, FEDIAF e ABINPet.',
    benefits: [
      'Condroitina (260 mg/kg) e Glicosamina (350 mg/kg): protecao real para articulacoes e cartilagens',
      'Omega 3 e 6: pelagem brilhante e reducao de queda de pelos',
      'Extrato de Yucca Schidigera: reduz visivelmente o odor das fezes',
      'Sem corantes artificiais: previne alergias e desconfortos intestinais',
      'Levedura de cerveja e polpa de beterraba: apoio a saúde intestinal',
    ],
  },
  {
    id: 2,
    originalPrice: 237.5,
    name: 'PowerDog Premium Carne',
    price: 190.0,
    image: '/assets/powerdog-25kg.jpg',
    category: 'Cães',
    weight: '25kg',
    badge: 'Economico',
    description: 'Ração Super Premium para cães adultos de todas as raças. Alimento de alta performance com sabor irresistivel de carne, formulado pela ProLine com niveis nutricionais que superam padroes AAFCO, FEDIAF e ABINPet.',
    benefits: [
      'Condroitina (260 mg/kg) e Glicosamina (350 mg/kg): protecao real para articulacoes e cartilagens',
      'Omega 3 e 6: pelagem brilhante e reducao de queda de pelos',
      'Extrato de Yucca Schidigera: reduz visivelmente o odor das fezes',
      'Sem corantes artificiais: previne alergias e desconfortos intestinais',
      'Levedura de cerveja e polpa de beterraba: apoio a saúde intestinal',
    ],
  },
  {
    id: 3,
    originalPrice: 145.0,
    name: 'Colosso Premium Filhotes Frango & Arroz',
    price: 130.0,
    image: '/assets/colosso-filhotes-frango.webp',
    category: 'Cães',
    weight: '10,1kg',
    description: 'Alimento completo premium para cães filhotes de todas as raças, com sabor frango e arroz. Sem corantes e aromatizantes artificiais. Selo Satisfação 100% Garantida.',
    benefits: [
      'Alta digestibilidade, com Ômega 3 e 6 para pele e pelos saudáveis',
      'Redução de sódio para maior longevidade; cálcio e fósforo para ossos e dentes fortes',
      'Extrato de Yucca Schidigera: redução do odor das fezes',
      'Maximiza absorção de nutrientes, reduzindo risco de problemas gastrointestinais',
    ],
  },
  {
    id: 4,
    originalPrice: 145.0,
    name: 'Colosso Premium Filhotes Carne & Arroz',
    price: 130.0,
    image: '/assets/colosso-filhotes-carne.webp',
    category: 'Cães',
    weight: '10,1kg',
    description: 'Alimento completo premium para cães filhotes de todas as raças, com sabor carne e arroz. Sem corantes e aromatizantes artificiais.',
    benefits: [
      'Alta digestibilidade: facilita a absorção de nutrientes',
      'Ômega 3 e 6 para pele e pelos saudáveis',
      'Cálcio e fósforo para ossos e dentes fortes',
      'Maior longevidade e redução do odor das fezes (extrato de Yucca)',
    ],
  },
  {
    id: 23,
    originalPrice: 44.0,
    name: 'Colosso Premium Filhotes Carne & Arroz',
    price: 40.0,
    image: '/assets/colosso-filhotes-carne-2kg.webp',
    category: 'Cães',
    weight: '2kg',
    badge: 'Versão pequena',
    description: 'Versão de 2kg do alimento completo premium para cães filhotes de todas as raças, com sabor carne e arroz. Ideal pra quem quer testar o produto ou pra filhotes de raças menores.',
    benefits: [
      'Alta digestibilidade',
      'Ômega 3 e 6 para pele e pelos saudáveis',
      'Cálcio e fósforo para ossos e dentes fortes',
      'Maior longevidade e redução do odor das fezes',
    ],
  },
  {
    id: 5,
    originalPrice: 99.0,
    name: 'CANISMAX Ração Premium Frango & Arroz',
    price: 90.0,
    image: '/assets/canismax.jpg',
    category: 'Cães',
    weight: '15kg',
    description: 'Alimento completo para cães adultos de todas as raças. A escolha equilibrada para o dia a dia do seu melhor amigo. Formulada com proteínas e carboidratos de qualidade, sem corantes nem aromatizantes artificiais.',
    benefits: [
      'Prebiótico MOS (mananoligossacarideos): equilibrio da flora intestinal',
      'Extrato de Yucca Schidigera: controle do odor das fezes',
      'Vitaminas A, D3, E, K3 e complexo B completo: energia e imunidade',
      'Minerais essenciais (ferro, cobre, manganes, zinco, iodo, selenio)',
      'Alta digestibilidade e otima aceitacao',
    ],
  },
  {
    id: 6,
    originalPrice: 220.0,
    name: 'Purina Dog Chow ExtraLife',
    price: 200.0,
    image: '/assets/purina-dog-chow.jpg',
    category: 'Cães',
    weight: '15kg',
    description: 'Para cães adultos de raças mini e pequenas (Poodle, Shih Tzu, Yorkshire, Maltes, Pinscher, Lhasa). A linha que pode adicionar ate 1,8 anos a mais de vida saudável ao seu cao. 100% completa e balanceada, sem corantes artificiais.',
    benefits: [
      'Formula ExtraLife: mix de antioxidantes, vitaminas e minerais',
      'Omega 6 e 3: pelagem brilhante',
      'Prebiótico natural (inulina): equilibrio da flora intestinal',
      'Taurina e metionina: coraçao saudável',
      'Graos no tamanho ideal: facil mastigação e reducao de tartaro',
    ],
  },
  {
    id: 7,
    originalPrice: 135.0,
    name: 'Guabi Natural Frango & Arroz Integral',
    price: 120.0,
    image: '/assets/guabi-natural.jpg',
    category: 'Cães',
    weight: '2,5kg',
    description: 'Super Premium Natural para cães adultos de raças mini e pequenas. Nutrição funcional com ingredientes naturais selecionados. Composicao: 60% origem animal + 35% cereais integrais + 5% vegetais e frutas.',
    benefits: [
      'Glucosamina sulfato e Condroitina: saúde articular comprovada',
      'Oleo de peixe com Omega 3 (EPA e DHA): apoio cognitivo, visão e sistema nervoso',
      'Betaglucanos: fortalecimento imunologico',
      'Polpa de beterraba, psyllium + MOS e inulina: função intestinal regulada',
      'Sem transgenicos, sem sal, sem corantes ou aromas artificiais',
      'Conservado com antioxidantes naturais (sem BHA, BHT ou Etoxiquina)',
    ],
  },
  {
    id: 8,
    originalPrice: 145.0,
    name: 'Colosso Premium Adultos & Filhotes Frango & Arroz',
    price: 130.0,
    image: '/assets/colosso-gatos-frango.webp',
    category: 'Gatos',
    weight: '10,1kg',
    description: 'Alimento completo para gatos adultos e filhotes de todas as raças, incluindo gatas no terço final de gestação e lactação. Sabor frango e arroz, sem corantes e aromatizantes artificiais.',
    benefits: [
      'Alta digestibilidade e pele saudável com Ômega 3 e 6',
      'Pelos brilhantes; integridade da visão e coração',
      'Trato urinário saudável',
      'Redução do odor das fezes (extrato de Yucca)',
    ],
  },
  {
    id: 9,
    originalPrice: 145.0,
    name: 'Colosso Premium Adultos & Filhotes Salmão & Arroz',
    price: 130.0,
    image: '/assets/colosso-gatos-salmao.webp',
    category: 'Gatos',
    weight: '10,1kg',
    description: 'Alimento completo para gatos adultos e filhotes de todas as raças, incluindo gatas no terço final de gestação e lactação, com sabor salmão e arroz.',
    benefits: [
      'Alta digestibilidade',
      'Pele saudável e pelos brilhantes com Ômega 3 do óleo de salmão',
      'Trato urinário saudável',
      'Integridade da visão e coração; redução do odor das fezes',
    ],
  },
  {
    id: 10,
    originalPrice: 145.0,
    name: 'Colosso Premium Castrados Carne & Arroz',
    price: 130.0,
    image: '/assets/colosso-castrados-carne.webp',
    category: 'Gatos',
    weight: '10,1kg',
    description: 'Alimento completo premium para gatos adultos castrados, com sabor carne e arroz. Selo Satisfação 100% Garantida.',
    benefits: [
      'Alta digestibilidade: fácil absorção de nutrientes',
      'Controle de bola de pelos',
      'Trato urinário saudável com macrominerais equilibrados',
      'Integridade da visão e coração; redução do odor das fezes',
    ],
  },
  {
    id: 11,
    originalPrice: 145.0,
    name: 'Colosso Premium Castrados Salmão & Arroz',
    price: 130.0,
    image: '/assets/colosso-castrados-salmao.webp',
    category: 'Gatos',
    weight: '10,1kg',
    description: 'Alimento completo premium para gatos adultos castrados. Após a castração, o metabolismo do felino muda e ele precisa de nutrição balanceada para manter o peso ideal e o trato urinário saudável.',
    benefits: [
      'Alta digestibilidade, controle de bola de pelos e trato urinário saudável',
      'Ômega 3 do óleo de salmão: pelagem brilhante',
      'Aditivo prebiótico (Mannan-oligossacarídeos) para equilíbrio intestinal',
      'Integridade da visão e coração; redução do odor das fezes',
      'Sem corantes e aromatizantes artificiais',
    ],
  },
  {
    id: 12,
    originalPrice: 145.0,
    name: 'Colosso Premium Castrados Frango & Arroz',
    price: 130.0,
    image: '/assets/colosso-castrados-frango.webp',
    category: 'Gatos',
    weight: '10,1kg',
    description: 'Alimento completo premium para gatos adultos castrados, com sabor frango e arroz. Formulado especialmente para as necessidades nutricionais após a castração.',
    benefits: [
      'Alta digestibilidade e controle de bola de pelos',
      'Trato urinário saudável (acidificante na fórmula)',
      'Integridade da visão e coração com taurina',
      'Redução do odor das fezes com extrato de Yucca',
    ],
  },
  {
    id: 13,
    originalPrice: 195.0,
    name: 'Purina Cat Chow Adultos Defense Plus Carne',
    price: 180.0,
    image: '/assets/purina-cat-chow-adultos.jpg',
    category: 'Gatos',
    weight: '10,1kg',
    description: 'Alimento Premium Especial para gatos adultos a partir de 1 ano. 100% completo e balanceado, sem corantes e sabores artificiais. Formulado pela Nestle Purina com tecnologia exclusiva Defense Plus.',
    benefits: [
      'Defense Plus: prebiótico natural, antioxidantes, vitaminas e minerais que fortalecem a imunidade',
      'Taurina + biomassa de microalgas (Schizochytrium sp.): visão e coraçao saudáveis',
      'Vitaminas A, D3, E, C, K3 e complexo B completo (B1, B2, B3, B5, B6, B7, B9, B12)',
      'Pele e pelagem saudáveis: zinco e ácidos graxos essenciais',
      'Trato urinário saudável',
      'Reduz acumulo de tartaro',
    ],
  },
  {
    id: 14,
    originalPrice: 195.0,
    name: 'Purina Cat Chow Castrados Defense Plus Frango',
    price: 180.0,
    image: '/assets/purina-cat-chow-castrados.jpg',
    category: 'Gatos',
    weight: '10,1kg',
    description: 'Alimento Premium Especial formulado para as necessidades de gatos castrados. Linha pensada pra quem quer o melhor da Nestle Purina pro gato apos a castraçao.',
    benefits: [
      '36% de proteína: manutencao da massa magra e controle de peso',
      'Defense Plus: prebióticos, antioxidantes, vitaminas e minerais para imunidade',
      'Macrominerais balanceados: pH urinário adequado, especialmente importante para castrados',
      'Pele e pelagem saudáveis: sem corantes nem sabores artificiais',
      'Ajuda a reduzir o acumulo de tartaro',
    ],
  },
  {
    id: 15,
    name: 'Purina Friskies Sache',
    price: 5.0,
    image: '/assets/purina-friskies.jpg',
    category: 'Gatos',
    weight: '85g',
    badge: '3 por R$10',
    description: 'Alimento Umido Premium Especial: 100% completo e balanceado. Pedaços macios e suculentos ao molho. Sabores: Carne, Frango, Atum, Salmao, Peixe Branco, Cordeiro e Peru. Promocao: 3 por R$ 10,00.',
    benefits: [
      '+25% de proteína: musculos fortes',
      'Sem conservantes artificiais',
      'Vitamina A + taurina: visão saudável',
      'Zinco e ácidos graxos essenciais: pele e pelos saudáveis',
      'Hidratacao extra: ideal para gatos que bebem pouca agua',
      'Pode ser refeição principal ou complemento',
    ],
  },
  {
    id: 16,
    originalPrice: 52.0,
    name: 'AbsorCat Colosso Granulado Higiênico',
    price: 45.0,
    image: '/assets/absorcat.jpg',
    category: 'Gatos',
    weight: '2kg',
    description: 'Granulado ecológico para gatos: Linha Colosso. 100% madeira de pinus de reflorestamento: biodegradavel. Alta absorcao, nao toxico e nao inflamavel.',
    benefits: [
      '100% madeira de pinus de reflorestamento: biodegradavel',
      'Alta absorcao: transforma a urina em pequenas bolas firmes e secas',
      'Naõ toxico e nao inflamavel',
      'Naõ gruda nas patas: sem rastros pela casa',
      'Retencao eficaz de odor',
      'Descarte sustentavel: lixo comum ou compostagem',
    ],
  },
  {
    id: 17,
    originalPrice: 22.0,
    name: 'Biscoitos Crockitos Colosso Original',
    price: 18.0,
    image: '/assets/crockitos.jpg',
    category: 'Petiscos',
    weight: '400g',
    description: 'Petisco crocante em formato de osso para cães. Embalagem com ziper para conservacao. Ideal pra recompensar, treinar ou simplesmente mimar.',
    benefits: [
      'Hexametafosfato de Sodio: auxilia na prevencao do tartaro',
      'Rico em vitaminas A, C, D, E, K3, B1, B6, B12 + niacina, ácido folico e biotina',
      'Minerais essenciais: ferro, cobre, manganes, zinco, iodo, selenio',
      'Textura crocante: limpeza dental e fortalecimento da mandibula',
      'Naõ substitui o alimento completo: uso como complemento',
    ],
  },
  {
    id: 18,
    originalPrice: 19.0,
    name: 'Snacks Naturais Desidratados Colosso',
    price: 16.0,
    image: '/assets/colosso-snacks.jpg',
    category: 'Petiscos',
    weight: 'Var.',
    badge: '100% Natural',
    description: 'Petiscos 100% naturais: orelha, casco, chifre, traqueia, pe de galinha, rotula bovina, focinho suino e mix. Processo de desidratacao que preserva os nutrientes e concentra o sabor.',
    benefits: [
      '100% natural: sem corantes, sem conservantes',
      'Traqueia bovina: rica em colageno (articulacoes e pele), calcio e fosforo',
      'Orelha bovina: alta proteína, textura para mastigação prolongada',
      'Chifre e casco: mastigação longa, prevencao de tartaro e fortalecimento dental',
      'Acao antiestresse: reduz ansiedade e comportamentos destrutivos por tedio',
      'Satisfaz o instinto natural de mastigar',
    ],
  },
  {
    id: 19,
    originalPrice: 15.0,
    name: 'Colosso Biscoitos Natural',
    price: 12.0,
    image: '/assets/colosso-biscoitos-natural.jpg',
    category: 'Petiscos',
    weight: '150g',
    badge: '100% Natural',
    description: 'Biscoitos integrais super premium 100% naturais. Sabores: Frutas Vermelhas (integral), Mel Aveia e Banana (integral), Cenoura e Ervilha (vegano).',
    benefits: [
      '100% natural: sem transgenicos, sem corantes nem antioxidantes artificiais',
      'Frutas Vermelhas: antioxidantes e vitaminas',
      'Mel, Aveia e Banana: fonte de energia, fibras e vitaminas do complexo B',
      'Cenoura e Ervilha (Vegano): beta-caroteno, fibras e proteína vegetal',
      'Petisco ou recompensa em adestramento',
      'Naõ substitui a refeição principal',
    ],
  },
  {
    id: 20,
    originalPrice: 35.0,
    name: 'PipiPet Kit Adestrador Sanitario',
    price: 28.0,
    image: '/assets/pipipet.jpg',
    category: 'Acessorios',
    weight: 'Kit',
    description: 'Kit completo para educar seu cao no local certo. A combinacao que funciona: um atrai para o lugar certo, o outro repele do lugar errado.',
    benefits: [
      'Xixi Pode (30 mL): atrai o cao para o local correto. Aplique 5 gotas no tapete higienico',
      'Xixi Naõ Pode (500 mL): repele de sofas, tapetes, canteiros e estofados',
      'Naõ toxico: seguro para animais e humanos',
      'Composicao "Pode": ureia 4g + carbonato de amonio 3,5g por 100 mL',
      'Indicado para filhotes recem-adotados e cães adultos em readestramento',
    ],
  },
  {
    id: 21,
    name: 'Colosso Roupinha de Lã',
    quoteOnWhatsapp: true,
    image: '/assets/colosso-roupinha.jpg',
    category: 'Acessorios',
    weight: 'Todos os tamanhos disponíveis',
    description: 'Conforto e proteção contra o frio para o seu pet. Roupinha em malha de lã com gola canelada e acabamento em tricô. Estampas listradas sortidas (verde, marrom/azul, lilás).',
    benefits: [
      'Aquece nos dias frios: especialmente útil para cães de pelo curto',
      'Tecido resistente e durável',
      'Modelagem que prioriza o movimento: sem botões nem zíperes',
      'Estampas sortidas: variedade de cores',
      'Indicada para cães de pequeno e médio porte',
    ],
  },
  {
    id: 22,
    originalPrice: 115.0,
    name: 'Cocheira Mel: Ração para Equinos',
    price: 99.9,
    image: '/assets/cocheira.png',
    category: 'Equinos',
    weight: '30kg',
    description: 'Ração premium para equinos, formulada com mel e ingredientes selecionados para nutrição completa e energia duradoura.',
    benefits: [
      'Nutrição completa para cavalos de todas as idades',
      'Energia duradoura para atividades fisicas intensas',
      'Fortalecimento muscular e osseo',
      'Palatabilidade excepcional com mel',
    ],
  },
];

const categories = ['Todos', 'Cães', 'Gatos', 'Equinos', 'Petiscos', 'Acessorios'];

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
          animateValue('clients', 0, 1620, 2000);
          animateValue('products', 0, 500, 2000);
          animateValue('rating', 0, 45, 2000);
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
    <div className="min-h-[100dvh] bg-[#F8F9FA]">
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
      <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/assets/produtos-loja.png"
            alt="Produtos Mundo Animal"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green/95 via-brand-green/85 to-brand-green/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Floating elements */}
        <div
          className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="absolute bottom-32 right-1/4 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '1s' }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <Sparkles size={14} className="text-brand-orange sm:hidden" />
              <Sparkles size={16} className="text-brand-orange hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium">Onde felicidade e amor têm 4 patas!</span>
            </div>

            <h1
              className="font-inter font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              Tudo para o
              <br />
              <span className="text-brand-orange">seu melhor</span>
              <br />
              amigo
            </h1>

            {/* Faixa Frete Grátis — destaque próximo da headline */}
            <div
              className="flex items-center gap-3 bg-white/95 text-brand-green-dark rounded-xl sm:rounded-2xl pl-2 pr-4 py-2 mt-5 sm:mt-6 max-w-md shadow-lg shadow-black/15 ring-1 ring-brand-orange/40"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.3s',
              }}
            >
              <span className="flex-shrink-0 grid place-items-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-brand-orange text-white shadow-sm">
                <Truck size={18} className="sm:hidden" />
                <Truck size={22} className="hidden sm:block" />
              </span>
              <span className="text-xs sm:text-sm font-semibold leading-snug">
                <span className="font-extrabold text-brand-orange">Frete grátis</span> em toda Itabira nas compras acima de{' '}
                <span className="whitespace-nowrap font-extrabold">R$ 100,00</span>
              </span>
            </div>

            <p
              className="text-white/80 text-base sm:text-lg mt-4 sm:mt-6 max-w-md leading-relaxed"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.4s',
              }}
            >
              Ração que o seu pet adora, petisco pra recompensar, banho com busca em casa e vacina
              sem complicação. A gente entrega de graça em qualquer canto de Itabira nas compras acima de R$ 100.
            </p>

            <div
              className="flex flex-wrap gap-4 mt-8"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.6s',
              }}
            >
              <button
                onClick={scrollToCatalog}
                className="bg-brand-orange text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:brightness-110 transition-all hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
              >
                Ver Produtos <ChevronRight size={16} className="sm:hidden" /><ChevronRight size={18} className="hidden sm:block" />
              </button>
              <a
                href="https://wa.me/message/DVEYNOWZKFLAK1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/25 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <PawPrint size={16} className="sm:hidden" /><PawPrint size={18} className="hidden sm:block" /> WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20"
            >
              <div>
                <div className="font-bold text-xl sm:text-3xl">{counts.clients}+</div>
                <div className="text-white/60 text-[10px] sm:text-sm mt-1">Famílias atendidas</div>
              </div>
              <div>
                <div className="font-bold text-xl sm:text-3xl">{counts.products}+</div>
                <div className="text-white/60 text-[10px] sm:text-sm mt-1">Itens na loja</div>
              </div>
              <div>
                <div className="font-bold text-xl sm:text-3xl flex items-center gap-0.5 sm:gap-1">
                  {(counts.rating / 10).toFixed(1)} <Star size={14} className="fill-brand-orange text-brand-orange sm:hidden" /><Star size={20} className="fill-brand-orange text-brand-orange hidden sm:block" />
                </div>
                <div className="text-white/60 text-[10px] sm:text-sm mt-1">Nota no Google</div>
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
                <span className="h-px flex-1 bg-white/20" />
                <span className="text-white/70 text-[11px] font-semibold uppercase tracking-wider">
                  Quem é cliente recomenda
                </span>
                <span className="h-px flex-1 bg-white/20" />
              </div>
              <HeroReviews />
            </div>
          </div>

          {/* Right side - foto + reviews sincronizados a cada 5s */}
          <HeroSlideshow heroLoaded={heroLoaded} />
        </div>
      </section>

      {/* ============ PROMO BANNER ============ */}
      <section className="bg-brand-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <span className="bg-white text-brand-orange font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">
            Promoção
          </span>
          <p className="text-white font-medium text-xs sm:text-base text-center leading-snug">
            Frete grátis em toda Itabira nas compras acima de R$ 100. Faz o pedido pelo WhatsApp que a gente leva.
          </p>
          <button
            onClick={scrollToCatalog}
            className="bg-white text-brand-orange font-bold text-sm px-5 py-2 rounded-full hover:shadow-lg transition-all whitespace-nowrap"
          >
            Aproveitar
          </button>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="servicos" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-brand-green font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Nossos Serviços
            </span>
            <h2 className="font-inter font-bold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
              A gente cuida do seu <span className="text-brand-green">pet</span> como se fosse nosso
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                icon: Droplets,
                title: 'Banho & Tosa',
                desc: 'Você fala o horário, a gente busca seu pet em casa, dá banho, faz a tosa e devolve cheiroso na sua porta.',
                color: 'bg-sky-50 text-sky-600',
                image: '/assets/servico-banho.png',
              },
              {
                icon: Syringe,
                title: 'Vacinas',
                desc: 'Veterinária aplicando vacina aqui na nossa clínica. Pode trazer seu pet, a gente atende com calma.',
                color: 'bg-amber-50 text-amber-600',
                image: '/assets/servico-vacinas.png',
              },
              {
                icon: Egg,
                title: 'Criação de Galinhas',
                desc: 'A gente cria Brahma com cuidado e tem ovos fresquinhos pra você. Passa na loja pra conhecer o plantel.',
                color: 'bg-orange-50 text-orange-600',
                image: '/assets/galinhas-brahma.jpg',
              },
              {
                icon: Truck,
                title: 'Entrega',
                desc: 'Pediu pelo WhatsApp acima de R$ 100? A gente leva até a sua porta sem cobrar frete. Em qualquer bairro de Itabira.',
                color: 'bg-rose-50 text-rose-600',
                image: '/assets/localidade.webp',
              },
            ].map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                  className="aspect-[3/2] overflow-hidden cursor-pointer relative bg-gray-100"
                  onClick={() =>
                    setImageModal({ open: true, src: service.image, alt: service.title })
                  }
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn
                      size={24}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                    />
                  </div>
                </div>
                  <div className="p-5">
                    <div
                      className={`w-10 h-10 ${service.color} rounded-xl flex items-center justify-center mb-3`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">{service.title}</h3>
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
      <section id="produtos" ref={catalogRef} className="py-12 sm:py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-brand-green font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Aqui na loja
            </span>
            <h2 className="font-inter font-bold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
              Escolha o que vai <span className="text-brand-green">pra casa</span> do seu pet
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-2 gap-2 mb-8 sm:mb-10 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat
                    ? 'active'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
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
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-brand-green font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Por que tantos vizinhos voltam aqui
            </span>
            <h2 className="font-inter font-bold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
              A loja da <span className="text-brand-green">vizinhança</span> em Itabira
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: Shield,
                title: 'Marca que a gente confia',
                desc: 'Só colocamos na prateleira o que daríamos pro nosso próprio pet. Purina, Colosso, Guabi, PowerDog e outras.',
              },
              {
                icon: Truck,
                title: 'Frete grátis em qualquer bairro',
                desc: 'Nas compras acima de R$ 100, você não paga nada pela entrega aqui em Itabira. Combina pelo WhatsApp e a gente vai.',
              },
              {
                icon: Heart,
                title: 'A gente conhece seu pet pelo nome',
                desc: 'Quando você volta, o Vinícius e a equipe já sabem o nome do bicho e a ração de sempre.',
              },
              {
                icon: Star,
                title: '1.620 famílias atendem aqui',
                desc: '4,5 estrelas no Google e mais de 1.600 famílias acompanhando a gente no Instagram.',
              },
              {
                icon: Clock,
                title: 'Resposta rápida no WhatsApp',
                desc: 'Você manda mensagem e a gente responde na hora. Sem fila, sem espera, sem robô.',
              },
              {
                icon: Scissors,
                title: 'Banho e tosa que seu pet vai gostar',
                desc: 'Banho com produto suave, tosa higiênica ou de raça. E a gente busca e devolve seu pet em casa.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-green/20 transition-colors">
                    <Icon size={22} className="text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/banho-tosa.png"
            alt="Banho e Tosa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-green/90" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-20 text-center text-white">
          <Scissors size={36} className="mx-auto mb-4 sm:mb-6 text-brand-orange sm:hidden" />
          <Scissors size={48} className="mx-auto mb-6 text-brand-orange hidden sm:block" />
          <h2 className="font-inter font-bold text-2xl sm:text-4xl">
            Banho e tosa com busca em casa
          </h2>
          <p className="text-white/80 text-base sm:text-lg mt-4 max-w-xl mx-auto px-2 sm:px-0">
            Marca um horário pelo WhatsApp. A gente busca seu pet, dá banho, faz a tosa e devolve cheiroso na sua porta.
          </p>
          <a
            href="https://wa.me/553138311702?text=Ola! Gostaria de agendar Banho e Tosa para meu pet."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full mt-6 sm:mt-8 hover:brightness-110 transition-all hover:shadow-xl hover:shadow-brand-orange/30 text-sm sm:text-base"
          >
            <PawPrint size={18} className="sm:hidden" /><PawPrint size={20} className="hidden sm:block" /> Agendar pelo WhatsApp
          </a>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer id="contato" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
            {/* Brand */}
            <div>
              <img
                src="/assets/logo-mundo-animal.png"
                alt="Mundo Animal"
                className="h-20 w-auto mb-4 rounded-xl"
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                Onde felicidade e amor têm 4 patas. A gente atende em Itabira{' '}
                <strong className="text-white">desde 1998</strong>, com a mesma família, os mesmos
                produtos bons e o mesmo carinho de sempre.
              </p>
              <div className="flex gap-3 mt-6">
                <a
                  href="https://www.instagram.com/mundoanimalitabira/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-green transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Links Rapidos</h4>
              <ul className="space-y-3">
                {['Produtos', 'Serviços', 'Banho & Tosa', 'Contato'].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        const id = link === 'Produtos' ? '#produtos' : link === 'Serviços' ? '#servicos' : link === 'Banho & Tosa' ? '#servicos' : '#contato';
                        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-gray-400 hover:text-brand-green transition-colors text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-4">Serviços</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Droplets size={14} className="text-brand-green" /> Banho
                </li>
                <li className="flex items-center gap-2">
                  <Scissors size={14} className="text-brand-green" /> Tosa
                </li>
                <li className="flex items-center gap-2">
                  <Syringe size={14} className="text-brand-green" /> Vacinas
                </li>
                <li className="flex items-center gap-2">
                  <Truck size={14} className="text-brand-green" /> Entrega Domiciliar
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contato</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-brand-green mt-0.5 shrink-0" />
                  <p className="text-gray-400 text-sm">
                    Avenida Joao Pinheiro, nº 194, Centro
                    <br />
                    Itabira - MG
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-green shrink-0" />
                  <p className="text-gray-400 text-sm">(31) 3831-1702</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              &copy; 2025 Mundo Animal Pet Shop. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs flex items-center gap-1.5">
              Criado por{' '}
              <a
                href="https://www.instagram.com/salesroute_ia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 font-semibold hover:text-brand-green transition-colors inline-flex items-center gap-1"
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
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-green-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 transition-transform animate-pulse-glow"
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
