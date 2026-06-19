import React, { useState, useCallback } from 'react';
import { ShoppingCart, Menu, X, Instagram, Phone, PawPrint } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const navLinks = [
    { label: 'Produtos', href: '#produtos' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-green text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Phone size={12} /> (31) 3831-1702
          </span>
          <a
            href="https://www.instagram.com/mundoanimalitabira/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            <Instagram size={12} /> @mundoanimalitabira
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2">
            <img
              src="/assets/logo-mundo-animal.png"
              alt="Mundo Animal Pet Shop"
              className="h-12 w-auto"
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="font-inter font-medium text-sm text-gray-700 hover:text-brand-green transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/message/DVEYNOWZKFLAK1"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-brand-green text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green-dark transition-colors"
            >
              <PawPrint size={16} /> WhatsApp
            </a>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart size={22} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-[73px] left-0 right-0 bg-white shadow-lg animate-fade-in-up">
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left py-3 px-4 text-gray-700 font-medium hover:text-brand-green hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://wa.me/message/DVEYNOWZKFLAK1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-green text-white font-medium py-3 rounded-full mt-3"
              >
                <PawPrint size={16} /> Falar no WhatsApp
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Header);
