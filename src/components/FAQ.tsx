import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'O frete grátis tem mínimo de pedido?',
    a: 'Não. A gente entrega de graça em Itabira pra qualquer pedido. Da lata de ração avulsa ao pedido grande do mês.',
  },
  {
    q: 'Em quanto tempo vocês entregam?',
    a: 'Pedido confirmado de manhã sai no mesmo dia. Se for à tarde, a gente combina o horário pelo WhatsApp, geralmente até 24h.',
  },
  {
    q: 'Quais formas de pagamento aceitam?',
    a: 'PIX, dinheiro na entrega e cartão (débito ou crédito na maquininha).',
  },
  {
    q: 'Como funciona o Banho & Tosa com busca em casa?',
    a: 'Você agenda pelo WhatsApp, a gente combina o horário, busca seu pet na sua porta, dá banho e faz a tosa aqui na clínica e devolve. Tudo no mesmo turno.',
  },
  {
    q: 'Atendem fora de Itabira?',
    a: 'O frete grátis vale só pra Itabira. Pra cidades vizinhas, manda mensagem no WhatsApp que a gente combina a taxa de entrega.',
  },
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-12 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-brand-green font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Ficou com alguma dúvida?
          </span>
          <h2 className="font-inter font-bold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
            A gente <span className="text-brand-green">responde</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group bg-gray-50 hover:bg-gray-100/80 transition-colors rounded-2xl border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-gray-800 text-sm sm:text-base">
                <span>{item.q}</span>
                <ChevronDown
                  size={20}
                  className="text-brand-green shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FAQ);
