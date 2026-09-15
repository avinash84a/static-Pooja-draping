'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Menu, X, Star, Sparkles, Globe, Download } from 'lucide-react';

interface HeaderProps {
  onBookClick?: () => void;
  onAdminClick?: () => void;
}

export default function Header({ onBookClick, onAdminClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'मुखपृष्ठ', href: '/' },
    { label: '१ डे वर्कशॉप', href: '/workshop' },
    { label: 'AI कोर्स (नवीन)', href: '/ai-course', isSpecial: true },
    { label: 'फोटो गॅलरी', href: '/gallery' },
    { label: 'आमच्याबद्दल', href: '/about' },
    { label: 'संपर्क', href: '/contact' },
  ];

  const handleBooking = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      const msg = encodeURIComponent('नमस्कार पूजा ताई, मला १ डे साडी ड्रॅपिंग वर्कशॉपसाठी नाव नोंदवायचे आहे. कृपया बॅच डिटेल्स द्या.');
      window.open(`https://wa.me/918446917187?text=${msg}`, '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Banner with WordPress Status & Helpline */}
      <div className="bg-[#4A121E] text-[#FAF5EF] text-xs py-1.5 px-4 border-b border-[#601927]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-amber-200">
              WordPress Headless CMS Live
            </span>
            <span className="hidden sm:inline text-white/50">|</span>
            <span className="hidden sm:inline text-[#E8D7D9]">
              गौरी महालक्ष्मी व नऊवारी साडी ड्रॅपिंग वर्कशॉप • सिंहगड रोड, पुणे
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs ml-auto">
            <div className="flex items-center gap-1 text-amber-300 font-semibold">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span>5.0 Ratings (33+ Reviews)</span>
            </div>

            <a
              href="/pooja-saree-html-website.zip"
              download="pooja-saree-html-website.zip"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 transition-colors text-[11px] shadow-xs"
              title="Download HTML Website as ZIP"
            >
              <Download className="w-3 h-3" />
              <span>Download ZIP</span>
            </a>

            <a
              href="/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 transition-colors text-[11px] font-medium border border-amber-400/30"
              title="Pure HTML & Tailwind CSS Static Pages"
            >
              <Globe className="w-3 h-3" />
              <span>HTML Site</span>
            </a>

            <a
              href="https://avipatil.live/cmspooja/wp-admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-amber-200 transition-colors text-[11px]"
              title="WordPress Admin Dashboard"
            >
              <Globe className="w-3 h-3" />
              <span>WP Admin</span>
            </a>

            <a
              href="tel:8446917187"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-medium transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>84469 17187</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#581825]/95 backdrop-blur-md shadow-lg py-2.5'
            : 'bg-[#581825] py-3.5'
        } border-b border-[#722031]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#36111B] flex items-center justify-center font-serif text-xl font-bold shadow-md ring-2 ring-amber-300/40 group-hover:scale-105 transition-transform">
              पूं
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide">
                  पूजा साडी ड्रॅपिंग
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium">
                Pooja Saree Draping & Workshop, Pune
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 font-semibold shadow-inner'
                      : item.isSpecial
                      ? 'text-amber-300 hover:text-amber-200 bg-amber-400/10 border border-amber-300/30 hover:bg-amber-400/20 font-semibold'
                      : 'text-[#F3E5E7] hover:text-amber-200 hover:bg-white/5'
                  }`}
                >
                  {item.isSpecial && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleBooking}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>WhatsApp नाव नोंदणी</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleBooking}
              className="p-2 rounded-full bg-emerald-600 text-white shadow-sm"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-amber-200 hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#4A121E] border-b border-[#722031] shadow-2xl px-4 pt-3 pb-6 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-amber-400/25 text-amber-300 font-bold'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBooking();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp वर थेट नाव नोंदवा</span>
              </button>

              <div className="flex items-center justify-between text-xs text-amber-200/80 px-1 pt-1">
                <a href="tel:8446917187" className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>84469 17187</span>
                </a>
                <a
                  href="https://avipatil.live/cmspooja/wp-admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white/70 hover:text-white"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>WordPress CMS</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
