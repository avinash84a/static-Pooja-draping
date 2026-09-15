'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Star, MapPin, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
  onAdminClick?: () => void;
}

export default function Navbar({ onBookClick, onAdminClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'मुख्यपृष्ठ', href: '#home' },
    { name: 'माझ्याबद्दल', href: '#about' },
    { name: 'वर्कशॉप', href: '#workshop' },
    { name: 'साडी प्रकार', href: '#styles' },
    { name: 'वैशिष्ट्ये', href: '#why-us' },
    { name: 'रिव्ह्यूज', href: '#reviews' },
    { name: 'गॅलरी', href: '#gallery' },
    { name: 'ठिकाण', href: '#location' },
    { name: 'प्रश्नोत्तरे', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Notification & Trust Bar */}
      <div className="bg-[#581825] text-[#FDF8F3] text-xs md:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              पूजा साडी ड्रॅपिंगमध्ये आपले मनःपूर्वक स्वागत!
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-amber-300 font-semibold">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span>5.0 (33 Google Reviews)</span>
            </div>
            <a
              href="tel:8446917187"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#F5D59A] hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>84469 17187</span>
            </a>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/25 text-amber-200 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer border border-amber-300/30"
                title="पूजा ताई Admin CMS Portal"
              >
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>ॲडमिन पॅनेल</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#E8DFD8] py-2.5'
            : 'bg-[#FAF7F2] border-b border-[#F0EAE1] py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#8B1E3F] to-[#581825] flex items-center justify-center text-amber-200 shadow-sm border border-amber-300/40">
              <span className="font-serif text-lg font-bold">पूं</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#4A1521] group-hover:text-[#8B1E3F] transition-colors leading-tight">
                Pooja Saree Draping
              </span>
              <span className="text-xs text-[#7A585F] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#B8405E]" />
                Sinhgad Road, Anand Nagar, Pune
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#4A3E3D] hover:text-[#8B1E3F] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#8B1E3F] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-amber-400/60 bg-amber-50/70 hover:bg-amber-100 text-[#4A1521] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                title="पूजा ताई Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B1E3F]" />
                <span>ॲडमिन</span>
              </button>
            )}

            <a
              href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%A1%E0%A4%AE%2C%0A%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%A1%E0%A5%80%20%E0%A4%A1%E0%A5%8D%E0%A4%B0%E0%A5%85%E0%A4%AA%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%8Params%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87.%0A%E0%A4%95%E0%A5%83%E0%A4%AA%E0%A4%AF%E0%A4%BE%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%AA%E0%A5%81%E0%A4%A2%E0%A5%80%E0%A4%B2%20workshop%20%E0%A4%9A%E0%A5%80%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%AA%E0%A4%BE%E0%A4%A0%E0%A4%B5%E0%A4%BE."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-emerald-600/30 text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/80 text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onBookClick}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#8B1E3F] text-white hover:bg-[#721531] text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              वर्कशॉप नोंदणी
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="px-2.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-[#4A1521] text-[11px] font-bold shadow-xs flex items-center gap-1"
                title="Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B1E3F]" />
                <span>ॲडमिन</span>
              </button>
            )}
            <button
              onClick={onBookClick}
              className="px-3 py-1.5 rounded-full bg-[#8B1E3F] text-white text-xs font-semibold shadow-sm sm:hidden"
            >
              नोंदणी
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-lg text-[#4A1521] hover:bg-[#F2EAE1] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE2D8] bg-[#FAF7F2] px-4 pt-3 pb-6 shadow-lg animate-fadeIn">
            <div className="flex flex-col space-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-[#4A3E3D] hover:bg-[#F0EAE1] rounded-md transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-[#E8DFD8] flex flex-col gap-2.5">
                <a
                  href="tel:8446917187"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#8B1E3F] text-[#8B1E3F] text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  कॉल करा: 84469 17187
                </a>
                <a
                  href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%A1%E0%A4%AE%2C%0A%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%A1%E0%A5%80%20%E0%A4%A1%E0%A5%8D%E0%A4%B0%E0%A5%85%E0%A4%AA%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%8Params%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87.%0A%E0%A4%95%E0%A5%83%E0%A4%AA%E0%A4%AF%E0%A4%BE%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%AA%E0%A5%81%E0%A4%A2%E0%A5%80%E0%A4%B2%20workshop%20%E0%A4%9A%E0%A5%80%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%AA%E0%A4%BE%E0%A4%A0%E0%A4%B5%E0%A4%BE."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp वर संपर्क करा
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookClick();
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#8B1E3F] text-white text-sm font-semibold shadow-sm"
                >
                  वर्कशॉप नोंदणी फॉर्म उघडा
                </button>
                {onAdminClick && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onAdminClick();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#4A1521] text-xs font-bold"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#8B1E3F]" />
                    <span>🔐 ॲडमिन पॅनेल (Admin CMS)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
