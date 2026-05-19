import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Alexandre A.',
    badge: 'Local Guide',
    rating: 5,
    time: '6 meses',
    text: 'Experiência incrível toda vez que levo meus Dogs lá. São muito bem tratados, e o melhor, a qualidade no serviço do Vinícius, é de emocionar o coração da gente. Ele cuida dos meus cachorros desde filhotes e trata eles como se fossem dele.',
    avatar: 'A',
    color: 'bg-amber-500',
  },
  {
    name: 'Débora D.',
    badge: '',
    rating: 5,
    time: '3 anos',
    text: 'Perfeito. Muito atenciosos, tiraram minhas dúvidas e estão à disposição. Gostei muito',
    avatar: 'D',
    color: 'bg-purple-500',
  },
  {
    name: 'Ramiro R.',
    badge: 'Local Guide',
    rating: 5,
    time: '3 anos',
    text: 'Excelente atendimento! Veterinária, muito atenciosa e dedicada!! Recomendo 100%',
    avatar: 'R',
    color: 'bg-red-500',
  },
  {
    name: 'Bruno P.',
    badge: 'Local Guide',
    rating: 5,
    time: '3 anos',
    text: 'Excelente atendimento estão de parabéns',
    avatar: 'B',
    color: 'bg-blue-500',
  },
  {
    name: 'Rodrigo F.',
    badge: 'Local Guide',
    rating: 5,
    time: '4 anos',
    text: 'Ótimo lugar pessoas honestas e de bom coração',
    avatar: 'R',
    color: 'bg-green-600',
  },
  {
    name: 'Davi S.',
    badge: 'Local Guide',
    rating: 4,
    time: '6 anos',
    text: 'Banho e tosa é um dos melhores da cidade. Mas dificilmente estão disponíveis',
    avatar: 'D',
    color: 'bg-indigo-500',
  },
  {
    name: 'Guilherme A.',
    badge: 'Local Guide',
    rating: 5,
    time: '6 anos',
    text: 'Ótimo atendimento e cuidado com o pet',
    avatar: 'G',
    color: 'bg-teal-500',
  },
  {
    name: 'Luciana C.',
    badge: 'Local Guide',
    rating: 5,
    time: '6 anos',
    text: 'Amei estar aqui!',
    avatar: 'L',
    color: 'bg-pink-500',
  },
  {
    name: 'Márcio S.',
    badge: 'Local Guide',
    rating: 5,
    time: '7 anos',
    text: 'Muito bom',
    avatar: 'M',
    color: 'bg-orange-500',
  },
  {
    name: 'Dario O.',
    badge: 'Local Guide',
    rating: 5,
    time: '6 anos',
    text: 'ÓTIMO ATENDIMENTO',
    avatar: 'D',
    color: 'bg-cyan-600',
  },
  {
    name: 'Nilson E.',
    badge: '',
    rating: 5,
    time: '5 anos',
    text: 'Muito boa a comida. Tudo limpinho. Atendimento ótimo',
    avatar: 'N',
    color: 'bg-rose-500',
  },
  {
    name: 'Dalylla M.',
    badge: '',
    rating: 5,
    time: '4 anos',
    text: 'Escelente atendimento super indico',
    avatar: 'D',
    color: 'bg-violet-500',
  },
];

const ReviewCard: React.FC<{ review: typeof reviews[0] }> = ({ review }) => (
  <div className="flex-shrink-0 w-[340px] sm:w-[400px] bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 mx-3 select-none">
    {/* Header */}
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-10 h-10 ${review.color} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
      >
        {review.avatar}
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 truncate">{review.name}</h4>
        {review.badge && (
          <span className="text-[10px] text-gray-400">{review.badge}</span>
        )}
      </div>
    </div>

    {/* Stars */}
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
        />
      ))}
      <span className="text-xs text-gray-400 ml-2">{review.time}</span>
    </div>

    {/* Quote icon */}
    <Quote size={16} className="text-brand-green/30 mb-1" />

    {/* Text */}
    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{review.text}</p>
  </div>
);

const GoogleReviews: React.FC = () => {
  // Duplicar reviews para o efeito infinito
  const allReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="text-center">
          <span className="text-brand-green font-semibold text-xs sm:text-sm uppercase tracking-wider">
            O que a vizinhança fala da gente
          </span>
          <h2 className="font-inter font-bold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
            Avaliações no <span className="text-brand-green">Google</span>
          </h2>

          {/* Google Rating Badge */}
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-100 mt-6">
            <img
              src="/assets/google-rating.png"
              alt="Google Reviews 4.5 estrelas"
              className="h-14 sm:h-16 w-auto object-contain"
            />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-2xl sm:text-3xl text-gray-900">4,5</span>
                <div className="flex">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                  <Star size={18} className="fill-amber-400/50 text-amber-400/50" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">48 avaliações no Google</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Row 1 - Right to Left */}
      <div className="relative mb-4 marquee-fade">
        <div className="flex animate-marquee-rtl hover:[animation-play-state:paused]">
          {allReviews.map((review, i) => (
            <ReviewCard key={`r1-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Left to Right (reverse) */}
      <div className="relative marquee-fade">
        <div className="flex animate-marquee-ltr hover:[animation-play-state:paused]">
          {[...allReviews].reverse().map((review, i) => (
            <ReviewCard key={`r2-${i}`} review={review} />
          ))}
        </div>
      </div>

    </section>
  );
};

export default React.memo(GoogleReviews);
