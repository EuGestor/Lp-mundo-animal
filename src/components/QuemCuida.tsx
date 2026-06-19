import React from 'react';
import { PawPrint, Scissors, Quote, ImageIcon } from 'lucide-react';

const QuemCuida: React.FC = () => {
  return (
    <section id="sobre" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Placeholder de foto — cliente vai enviar */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-brand-green/10 bg-gradient-to-br from-brand-green/15 via-brand-green/5 to-brand-orange/10 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <ImageIcon size={28} className="text-brand-green" />
                </div>
                <p className="text-sm text-brand-green font-semibold">Fotos da equipe</p>
                <p className="text-xs text-gray-500 mt-1">(em breve)</p>
              </div>
            </div>

            {/* Mini-badge sobreposto */}
            <div className="absolute -bottom-4 left-4 sm:left-1/2 sm:-translate-x-1/2 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
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
            <span className="text-brand-green font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Família que cuida de família
            </span>
            <h2 className="font-inter font-bold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
              Quem cuida do <span className="text-brand-green">seu pet</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg mt-5 leading-relaxed">
              A <strong className="text-gray-800">Mundo Animal</strong> cuida dos pets de Itabira{' '}
              <strong className="text-brand-green">desde 1998</strong>. São quase 30 anos
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
                className="inline-flex items-center gap-2 bg-white border-2 border-brand-green text-brand-green font-bold px-6 py-3 rounded-full hover:bg-brand-green hover:text-white transition-colors text-sm"
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
