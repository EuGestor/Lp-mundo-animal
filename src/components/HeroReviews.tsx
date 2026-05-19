import React, { useState, useEffect, useCallback } from 'react';
import { Star, Quote } from 'lucide-react';

const heroReviews = [
  {
    name: 'Alexandre A.',
    text: 'Experiência incrível toda vez que levo meus Dogs lá. São muito bem tratados, e o melhor, a qualidade no serviço do Vinícius, é de emocionar o coração da gente.',
    rating: 5,
  },
  {
    name: 'Débora D.',
    text: 'Perfeito. Muito atenciosos, tiraram minhas dúvidas e estão à disposição. Gostei muito.',
    rating: 5,
  },
  {
    name: 'Ramiro R.',
    text: 'Excelente atendimento! Veterinária, muito atenciosa e dedicada!! Recomendo 100%',
    rating: 5,
  },
  {
    name: 'Bruno P.',
    text: 'Excelente atendimento estão de parabéns',
    rating: 5,
  },
  {
    name: 'Rodrigo F.',
    text: 'Ótimo lugar pessoas honestas e de bom coração',
    rating: 5,
  },
  {
    name: 'Davi S.',
    text: 'Banho e tosa é um dos melhores da cidade.',
    rating: 5,
  },
  {
    name: 'Guilherme A.',
    text: 'Ótimo atendimento e cuidado com o pet',
    rating: 5,
  },
  {
    name: 'Luciana C.',
    text: 'Amei estar aqui!',
    rating: 5,
  },
  {
    name: 'Dario O.',
    text: 'ÓTIMO ATENDIMENTO',
    rating: 5,
  },
  {
    name: 'Nilson E.',
    text: 'Muito boa a comida. Tudo limpinho. Atendimento ótimo',
    rating: 5,
  },
];

const HeroReviews: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const nextReview = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroReviews.length);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, [nextReview]);

  const review = heroReviews[current];

  return (
    <div className="mt-6 max-w-sm">
      <div
        className={`bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 transition-all duration-400 ${
          fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="flex items-center gap-1 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-400 text-gray-400'}
            />
          ))}
          <span className="text-white/50 text-[10px] ml-1">Google</span>
        </div>
        <div className="flex gap-2">
          <Quote size={14} className="text-brand-orange/70 shrink-0 mt-0.5" />
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed italic">
            {review.text}
          </p>
        </div>
        <p className="text-white/60 text-[10px] mt-1.5 ml-5">— {review.name}</p>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-2">
        {heroReviews.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFading(true);
              setTimeout(() => {
                setCurrent(i);
                setFading(false);
              }, 400);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-brand-orange w-4' : 'bg-white/30'
            }`}
            aria-label={`Review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(HeroReviews);
