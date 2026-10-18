import React from 'react';
import { PawPrint, Scissors, Quote } from 'lucide-react';
import { FACTS } from '@/data/facts';

const QuemCuida: React.FC = () => {
  return (
    <section id="sobre" className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Cartão de marca. Quando houver foto da equipe, troque o conteúdo por <img className="w-full h-full object-cover" /> */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] max-w-md mx-auto rounded-t-[999px] rounded-b-3xl overflow-hidden shadow-2xl shadow-brand-green-dark/25 bg-gradient-to-b from-brand-green-dark via-brand-green-dark to-forest-night border border-brand-orange/40 flex flex-col items-center justify-center text-center px-8">
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-brand-orange/15 blur-3xl" />
              <img
                src="/assets/marca/ma-monograma.svg"
                alt=""
                width={64}
                height={64}
                className="relative w-14 h-14 mb-6 rounded-full ring-1 ring-brand-orange/50"
              />
              <span className="relative text-brand-orange text-[11px] font-semibold uppercase tracking-[0.28em]">
                Desde
              </span>
              <span className="relative font-display font-semibold text-7xl sm:text-8xl text-cream leading-none mt-2 tabular-nums">
                {FACTS.since}
              </span>
              <span className="relative h-px w-16 bg-brand-orange/60 my-6" />
              <p className="relative font-display italic text-cream/90 text-lg sm:text-xl leading-snug max-w-[16rem]">
                Vinícius e Carol, e a mesma família cuidando de Itabira
              </p>
            </div>

            {/* Mini-badge sobreposto */}
            <div className="absolute -bottom-4 left-4 sm:left-1/2 sm:-translate-x-1/2 bg-paper rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center">
                <Scissors size={18} className="text-brand-green" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-800">Atendimento de família</div>
                <div className="text-xs text-gray-500">Desde 1998 em Itabira</div>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <span className="text-gold-ink font-semibold text-xs sm:text-[13px] uppercase tracking-[0.18em]">
              Família que cuida de família
            </span>
            <h2 className="font-display font-semibold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
              Quem cuida do <span className="italic font-medium text-brand-green">seu pet</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg mt-5 leading-relaxed">
              A <strong className="text-gray-800">Mundo Animal</strong> cuida dos pets de Itabira{' '}
              <strong className="text-brand-green">desde {FACTS.since}</strong>. São quase 30 anos
              conhecendo cliente pelo nome e tratando cada cachorro e gato como se fosse da casa.
            </p>
            <p className="text-gray-600 text-base sm:text-lg mt-4 leading-relaxed">
              O <strong className="text-gray-800">Vinícius</strong> e a{' '}
              <strong className="text-gray-800">Carol</strong> estão aqui pra te entregar mais do
              que um simples pet shop. A gente também é{' '}
              <strong className="text-brand-green">clínica veterinária</strong>. Ração, petisco,
              banho, tosa, vacina e consulta no mesmo lugar, com quem ama bicho de verdade.
            </p>

            <blockquote className="mt-6 p-5 bg-brand-green/5 border-l-4 border-brand-green rounded-r-xl">
              <Quote size={20} className="text-brand-green/40 mb-2" />
              <p className="text-gray-700 italic text-sm sm:text-base leading-relaxed">
                "Experiência incrível. O Vinícius cuida dos meus cachorros desde filhotes. Não troco
                por nada."
              </p>
              <cite className="text-xs text-gray-500 not-italic mt-2 block font-semibold">
                Alexandre, cliente da Mundo Animal
              </cite>
            </blockquote>

            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="https://wa.me/553138311702?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20o%20Vin%C3%ADcius."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-green text-white font-bold px-6 py-3 rounded-full hover:bg-brand-green-dark transition-colors text-sm"
              >
                <PawPrint size={18} /> Falar com o Vinícius
              </a>
              <a
                href="https://wa.me/553138311702?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20Banho%20%26%20Tosa%20para%20meu%20pet."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-paper border-2 border-brand-green text-brand-green font-bold px-6 py-3 rounded-full hover:bg-brand-green hover:text-white transition-colors text-sm"
              >
                <Scissors size={18} /> Agendar Banho
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(QuemCuida);
