import React, { useState, useEffect, useCallback } from 'react';
import { Star, Quote, Truck } from 'lucide-react';

const slides = [
  {
    photo: '/assets/pets/pet-01.webp',
    review: {
      name: 'Alexandre Ackel',
      text: 'Experiência incrível toda vez que levo meus Dogs lá. São muito bem tratados, e o melhor, a qualidade no serviço do Vinícius, é de emocionar o coração da gente.',
    },
  },
  {
    photo: '/assets/pets/pet-02.webp',
    review: {
      name: 'Débora dos Santos',
      text: 'Perfeito. Muito atenciosos, tiraram minhas dúvidas e estão à disposição. Gostei muito.',
    },
  },
  {
    photo: '/assets/pets/pet-04.webp',
    review: {
      name: 'Ramiro Ricarbene',
      text: 'Excelente atendimento! Veterinária, muito atenciosa e dedicada!! Recomendo 100%',
    },
  },
  {
    photo: '/assets/pets/pet-05.webp',
    review: {
      name: 'Bruno Pimenta',
      text: 'Excelente atendimento estão de parabéns',
    },
  },
  {
    photo: '/assets/pets/pet-06.webp',
    review: {
      name: 'Rodrigo Fernando',
      text: 'Ótimo lugar pessoas honestas e de bom coração',
    },
  },
  {
    photo: '/assets/pets/pet-07.webp',
    review: {
      name: 'Davi M Silva',
      text: 'Banho e tosa é um dos melhores da cidade.',
    },
  },
  {
    photo: '/assets/pets/pet-08.webp',
    review: {
      name: 'Guilherme Augusto',
      text: 'Ótimo atendimento e cuidado com o pet',
    },
  },
  {
    photo: '/assets/pets/pet-09.webp',
    review: {
      name: 'Luciana Citty',
      text: 'Amei estar aqui!',
    },
  },
  {
    photo: '/assets/pets/pet-10.webp',
    review: {
      name: 'Nilson Edvs',
      text: 'Muito boa a comida. Tudo limpinho. Atendimento ótimo.',
    },
  },
];

interface HeroSlideshowProps {
  heroLoaded: boolean;
}

const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ heroLoaded }) => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const next = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="hidden lg:flex flex-col items-center w-full">
      {/* Foto rotativa em moldura de arco */}
      <div
        className="relative w-full max-w-[25rem]"
        style={{
          opacity: heroLoaded ? 1 : 0,
          transform: heroLoaded ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 1s ease-out 0.5s',
        }}
      >
        <div className="rounded-t-[999px] rounded-b-[2rem] border border-brand-orange/45 p-2">
          <div className="relative w-full aspect-[4/5] rounded-t-[999px] rounded-b-[1.5rem] overflow-hidden bg-forest-night shadow-2xl shadow-black/30">
            {slides.map((s, i) => (
              <img
                key={s.photo}
                src={s.photo}
                alt="Pet feliz no Mundo Animal, atendido pela equipe do Vinícius"
                className={`absolute inset-0 w-full h-full object-cover object-[50%_30%] transition-all duration-500 ${
                  i === current
                    ? fading
                      ? 'opacity-0 scale-105'
                      : 'opacity-100 scale-100'
                    : 'opacity-0'
                }`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        </div>

        {/* Mini card "Buscamos seu amigo em casa" */}
        <div className="absolute -bottom-4 -left-6 bg-paper rounded-2xl px-4 py-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center">
              <Truck size={19} className="text-brand-orange" />
            </div>
            <div>
              <div className="font-display font-semibold text-sm text-gray-900">Buscamos seu amigo em casa</div>
              <div className="text-xs text-gray-500">Banho e Tosa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review rotativo */}
      <div
        className="mt-9 w-full max-w-sm"
        style={{
          opacity: heroLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease-out 1s',
        }}
      >
        <div
          className={`bg-cream/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-cream/20 transition-all duration-400 ${
            fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center gap-1 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-white/50 text-[10px] ml-1">Google</span>
          </div>
          <div className="flex gap-2">
            <Quote size={14} className="text-brand-orange/70 shrink-0 mt-0.5" />
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed italic">
              {slide.review.text}
            </p>
          </div>
          <p className="text-white/60 text-[10px] mt-1.5 ml-5 font-semibold">{slide.review.name}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFading(true);
                setTimeout(() => {
                  setCurrent(i);
                  setFading(false);
                }, 400);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-brand-orange w-4' : 'bg-white/30 w-1.5'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeroSlideshow);
