'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Instagram,
  Facebook,
  ExternalLink,
  Heart,
  ArrowUp,
  Globe,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#2D0F16] text-[#F3E8E9] pt-14 pb-24 sm:pb-16 border-t border-[#4A1521]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info & Motto */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#36111B] flex items-center justify-center font-serif text-xl font-bold shadow-md">
                पूं
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white tracking-tight">
                  Pooja Saree Draping Pune
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  पूजा साडी ड्रॅपिंग व ट्रेनिंग सेंटर, पुणे
                </p>
              </div>
            </div>

            <p className="text-sm text-amber-100/90 italic leading-relaxed font-serif">
              “सुंदर साडी ड्रॅपिंग शिका आणि प्रत्येक सण-समारंभात आत्मविश्वासाने साडी नेसा.”
            </p>

            <p className="text-xs text-[#E0CDD0] leading-relaxed max-w-md">
              पुण्यातील सिंहगड रोड परिसरातील अग्रगण्य व ५.०-स्टार मानांकित साडी ड्रॅपिंग प्रशिक्षण केंद्र. गौरी महालक्ष्मी, नऊवारी, ब्राह्मणी, रुक्मिणी व डिझायनर साडी ड्रॅपिंगचे प्रत्यक्ष हँड्स-ऑन प्रॅक्टिकल.
            </p>

            {/* Google Rating Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-amber-300">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold">5.0 (33+ Google Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              महत्त्वाचे दुवे (Pages)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#E0CDD0]">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  मुखपृष्ठ (Home)
                </Link>
              </li>
              <li>
                <Link href="/workshop" className="hover:text-amber-300 transition-colors">
                  १ डे वर्कशॉप (1-Day Workshop)
                </Link>
              </li>
              <li>
                <Link href="/ai-course" className="text-amber-300 hover:text-amber-200 font-semibold transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>१ डे AI कार्यशाळा (AI Course)</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-300 transition-colors">
                  फोटो गॅलरी (Gallery)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">
                  आमच्याबद्दल (About Pooja Patil)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition-colors">
                  संपर्क व पत्ता (Contact & Studio)
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10">
                <a
                  href="https://avipatil.live/cmspooja/wp-admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>WordPress CMS Admin</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              संपर्क व ठिकाण (Contact)
            </h4>

            <div className="space-y-3 text-xs sm:text-sm text-[#E0CDD0]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  साईप्रभा हाऊस, जगताप हॉस्पिटल समोर,<br />
                  सिंहगड रोड, आनंद नगर, पुणे - ४११०५१, महाराष्ट्र.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:8446917187" className="hover:text-white font-semibold">
                  84469 17187
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A4%8F%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%A4%E0%A4%BE%E0%A4%88"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-semibold text-emerald-400"
                >
                  WhatsApp वर थेट चॅट करा
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs text-gray-400 block mb-2 font-medium">फॉलो व शेअर करा:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://wa.me/918446917187"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pooja+Saree+Draping+Anand+Nagar+Sinhgad+Road+Pune"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google Business Location"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  title="Google Maps"
                >
                  <MapPin className="w-4 h-4" />
                </a>
                <a
                  href="https://avipatil.live/cmspooja/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WordPress CMS"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  title="WordPress CMS Site"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BA9FA4]">
          <div className="flex flex-wrap items-center gap-3">
            <p>
              © {new Date().getFullYear()} Pooja Saree Draping Pune. All rights reserved.
            </p>
            <span className="text-white/30">|</span>
            <span className="text-amber-200/80">
              Powered by Next.js & WordPress Headless CMS (avipatil.live/cmspooja)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Maharashtra Women
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="वर जा"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
