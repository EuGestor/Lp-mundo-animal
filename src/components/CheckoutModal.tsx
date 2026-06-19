import React, { useState } from 'react';
import { X, MapPin, User, FileText, Send, ChevronLeft, Package, Check, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, totalPrice, clearCart } = useCart();
  const [nome, setNome] = useState('');
  const [endereco, setEndereço] = useState('');
  const [observacoes, setObservações] = useState('');
  const [retirarLoja, setRetirarLoja] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const buildWhatsAppLink = () => {
    let msg = `*NOVO PEDIDO - MUNDO ANIMAL PET SHOP*\n\n`;
    msg += `*Cliente:* ${nome || 'Naõ informado'}\n\n`;
    msg += `*ITENS DO PEDIDO:*\n`;
    msg += `━━━━━━━━━━━━━━━━━━\n`;
    items.forEach((item) => {
      const unitPrice = item.price ?? 0;
      const subtotal = formatPrice(unitPrice * item.quantity);
      msg += `\n${item.quantity}x ${item.name}\n`;
      msg += `   ${item.weight || ''} - ${formatPrice(unitPrice)} = *${subtotal}*\n`;
    });
    msg += `\n━━━━━━━━━━━━━━━━━━\n`;
    msg += `*TOTAL: ${formatPrice(totalPrice)}*\n\n`;
    if (retirarLoja) {
      msg += `*RETIRADA NA LOJA*\nCliente ira retirar o pedido pessoalmente na loja.\n\n`;
    } else if (endereco) {
      msg += `*ENDERECO DE ENTREGA:*\n${endereco}\n\n`;
    }
    if (observacoes) {
      msg += `*OBSERVACOES:*\n${observacoes}\n\n`;
    }
    msg += `_Pedido enviado pelo site_`;

    return `https://wa.me/message/DVEYNOWZKFLAK1?text=${encodeURIComponent(msg)}`;
  };

  const handleEnviar = () => {
    setEnviado(true);
    clearCart();
  };

  if (!isOpen) return null;

  // Tela de sucesso
  if (enviado) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="font-bold text-2xl text-gray-900 mb-2">Pedido Enviado!</h2>
          <p className="text-gray-500 mb-6">
            Voce sera redirecionado para o WhatsApp. Nossa equipe vai confirmar seu pedido em
            breve!
          </p>
          <button
            onClick={onClose}
            className="bg-brand-green text-white font-bold px-8 py-3 rounded-full hover:bg-brand-green-dark transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-3xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={18} className="sm:hidden" />
            <ChevronLeft size={20} className="hidden sm:block" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h2 className="font-bold text-base sm:text-lg">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Resumo do pedido */}
          <div className="p-5 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Package size={18} className="text-brand-green" />
              <h3 className="font-semibold text-sm">Resumo do Pedido</h3>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.quantity}x {item.weight || ''}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-brand-green">
                    {formatPrice((item.price ?? 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Total ({items.reduce((s, i) => s + i.quantity, 0)} itens)</span>
              <span className="text-xl font-bold text-brand-green">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            {/* Nome */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="text-brand-green" />
                Seu Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
              />
            </div>

            {/* Retirar na loja */}
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-brand-green/20 bg-brand-green/5 cursor-pointer hover:border-brand-green/40 transition-colors select-none">
              <input
                type="checkbox"
                checked={retirarLoja}
                onChange={(e) => setRetirarLoja(e.target.checked)}
                className="w-5 h-5 accent-brand-green rounded"
              />
              <div className="flex items-center gap-2">
                <Store size={18} className="text-brand-green" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Vou retirar na loja</p>
                  <p className="text-xs text-gray-500">Retiro o pedido pessoalmente no Mundo Animal</p>
                </div>
              </div>
            </label>

            {/* Endereço */}
            <div className={retirarLoja ? 'opacity-40 pointer-events-none' : ''}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="text-brand-green" />
                {retirarLoja ? 'Endereço de Entrega (nao obrigatório)' : 'Endereço de Entrega'}
              </label>
              <textarea
                value={endereco}
                onChange={(e) => setEndereço(e.target.value)}
                placeholder={retirarLoja ? 'Retirando na loja...' : 'Rua, numero, bairro, ponto de referencia...'}
                rows={3}
                disabled={retirarLoja}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all resize-none disabled:bg-gray-100"
              />
              {!retirarLoja && (
                <p className="text-xs text-gray-400 mt-1">Entrega gratuita em Itabira</p>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="text-brand-green" />
                Observações (opcional)
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservações(e.target.value)}
                placeholder="Alguma preferencia? Horario de entrega?"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t bg-white space-y-3">
            <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer leading-snug">
              <input
                type="checkbox"
                checked={aceitouPrivacidade}
                onChange={(e) => setAceitouPrivacidade(e.target.checked)}
                className="mt-0.5 accent-brand-green w-4 h-4 shrink-0"
              />
              <span>
                Li e concordo com a{' '}
                <a
                  href="/privacidade.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-green underline hover:text-brand-green-dark"
                  onClick={(e) => e.stopPropagation()}
                >
                  Política de Privacidade
                </a>
                . Meus dados serão usados pra processar este pedido pelo
                WhatsApp da loja.
              </span>
            </label>
            {aceitouPrivacidade ? (
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleEnviar}
                className="flex items-center justify-center gap-2 w-full bg-brand-green text-white font-bold py-4 rounded-full hover:bg-brand-green-dark transition-all hover:shadow-lg hover:shadow-brand-green/20"
              >
                <Send size={18} />
                Enviar Pedido pelo WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-400 font-bold py-4 rounded-full cursor-not-allowed"
              >
                <Send size={18} />
                Enviar Pedido pelo WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CheckoutModal);
