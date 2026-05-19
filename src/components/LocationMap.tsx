import React from 'react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';

const LocationMap: React.FC = () => {
  return (
    <section id="onde-estamos" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-brand-green font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Onde a gente está
          </span>
          <h2 className="font-inter font-bold text-2xl sm:text-4xl text-gray-900 mt-2 sm:mt-3">
            Passa <span className="text-brand-green">pra dar um oi</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-md bg-white aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
            <iframe
              title="Localização Mundo Animal Pet Shop"
              src="https://www.google.com/maps?q=Av.+João+Pinheiro,+194,+Itabira,+MG&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-center">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-brand-green" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">Endereço</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Av. João Pinheiro, 194, Centro<br />
                    Itabira/MG
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-brand-green" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">Horário</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Segunda a Sexta: 8h às 18h<br />
                    Sábado: 8h às 13h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-brand-green" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">Telefone</h3>
                  <a
                    href="tel:+553138311702"
                    className="text-gray-600 text-sm mt-1 hover:text-brand-green transition-colors block"
                  >
                    (31) 3831-1702
                  </a>
                </div>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/?q=Av.+João+Pinheiro,+194,+Itabira"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-green-dark transition-colors mt-6 text-sm"
            >
              Abrir no Google Maps <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LocationMap);
