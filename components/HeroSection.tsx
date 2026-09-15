'use client';

import React from 'react';
import { Star, MessageCircle, Calendar, Sparkles, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { WorkshopConfig } from '../lib/galleryStorage';

interface HeroSectionProps {
  onBookClick: () => void;
  workshopConfig?: WorkshopConfig;
}

export default function HeroSection({ onBookClick, workshopConfig }: HeroSectionProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#F7F2EB] via-[#FAF7F2] to-[#FAF7F2] pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative Traditional Subtle Flourish */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#8B1E3F]/5 to-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#8B1E3F]/5 to-rose-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Text and CTAs */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start">
            
            {/* Trust Pill with Google Rating */}
            <a
              href="#reviews"
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-300/60 shadow-xs mb-5 hover:bg-white transition-all group"
            >
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#3B1F25]">
                5.0 Google Rating
              </span>
              <span className="text-xs text-[#7A585F] font-medium border-l border-amber-200 pl-2">
                33+ Student Reviews
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#8B1E3F] group-hover:translate-x-0.5 transition-transform">
                पहा →
              </span>
            </a>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#36111B] leading-[1.18] tracking-tight mb-4">
              साडी ड्रॅपिंग शिकायचं आहे?
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-[#5E3F45] leading-relaxed max-w-2xl mb-5 font-normal">
              पारंपरिक आणि आकर्षक साडी ड्रॅपिंगचे विविध प्रकार प्रात्यक्षिकासह शिका — <span className="font-semibold text-[#8B1E3F]">पूजा साडी ड्रॅपिंग, पुणे</span>
            </p>

            {/* Marathi Supporting Mantra */}
            <div className="w-full max-w-xl py-3 px-4 rounded-xl bg-gradient-to-r from-[#F4EBE3] via-[#FAF4EE] to-[#F4EBE3] border-l-4 border-[#8B1E3F] mb-7 shadow-xs text-left">
              <p className="text-xs sm:text-sm font-semibold text-[#4A1521] italic leading-snug">
                “सुंदर साडी ड्रॅपिंग शिकूया, आत्मविश्वासाने साडी नेसूया!”
              </p>
              <p className="text-[11px] sm:text-xs text-[#7A585F] mt-0.5">
                गौरी महालक्ष्मी, नऊवारी, ब्राह्मणी व डिझायनर साडी ड्रॅपिंगचे परिपूर्ण प्रॅक्टिकल प्रशिक्षण
              </p>
            </div>

            {/* Quick Benefits Ticks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-xl mb-8 text-left">
              <div className="flex items-center gap-1.5 text-xs text-[#4A3E3D] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8B1E3F] shrink-0" />
                <span>100% प्रत्यक्ष सराव</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4A3E3D] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8B1E3F] shrink-0" />
                <span>14+ सुंदर साडी प्रकार</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4A3E3D] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8B1E3F] shrink-0" />
                <span>वैयक्तिक मार्गदर्शन</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#8B1E3F] text-white font-semibold text-sm sm:text-base shadow-md hover:bg-[#721531] hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>वर्कशॉपसाठी नोंदणी करा</span>
              </button>

              <a
                href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%A1%E0%A4%AE%2C%0A%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%A1%E0%A5%80%20%E0%A4%A1%E0%A5%8D%E0%A4%B0%E0%A5%85%E0%A4%AA%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%8Params%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87.%0A%E0%A4%95%E0%A5%83%E0%A4%AA%E0%A4%AF%E0%A4%BE%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%AA%E0%A5%81%E0%A4%A2%E0%A5%80%E0%A4%B2%20workshop%20%E0%A4%9A%E0%A5%80%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%AA%E0%A4%BE%E0%A4%A0%E0%A4%B5%E0%A4%BE."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 text-white font-semibold text-sm sm:text-base shadow-sm hover:bg-emerald-700 hover:shadow transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>WhatsApp वर संपर्क करा</span>
              </a>
            </div>

            {/* Location highlight badge */}
            <div className="mt-6 flex items-center gap-2 text-xs text-[#6B5358]">
              <MapPin className="w-3.5 h-3.5 text-[#8B1E3F]" />
              <span>{workshopConfig?.venue ? `स्टुडिओ: ${workshopConfig.venue}` : 'स्टुडिओ: सिंहगड रोड, आनंद नगर, पुणे (Opp. जगताप हॉस्पिटल)'}</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-[#581825]">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                  alt="गौरी महालक्ष्मी साडी ड्रॅपिंग - पूजा साडी ड्रॅपिंग पुणे"
                  className="w-full h-[380px] sm:h-[460px] object-cover object-top"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E0B14]/90 via-transparent to-black/10" />

                {/* Bottom banner on image */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400/90 text-[#36111B] text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    गौरी महालक्ष्मी स्पेशल
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif leading-snug text-white drop-shadow">
                    {workshopConfig?.title || '1 डे सखोल साडी ड्रॅपिंग वर्कशॉप'}
                  </h3>
                  <p className="text-xs text-amber-100/90 mt-1 line-clamp-2">
                    {workshopConfig?.training || 'उभारलेल्या व बसलेल्या गौरीचे 14+ पारंपारिक प्रकार'}
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Instructor Trust */}
              <div className="absolute -top-4 -left-3 sm:-left-6 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-[#EADBCE] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#8B1E3F] text-amber-200 flex items-center justify-center font-serif font-bold text-sm">
                  पू
                </div>
                <div>
                  <div className="text-xs font-bold text-[#3B1F25]">पूजा पाटील</div>
                  <div className="text-[11px] text-[#7A585F]">सर्टिफाइड साडी ड्रॅपिंग ट्रेनर</div>
                </div>
              </div>

              {/* Floating Badge 2: Practical Training */}
              <div className="absolute -bottom-4 -right-3 sm:-right-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-[#EADBCE] flex items-center gap-3 max-w-[210px]">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E3A2F]">हँड्स-ऑन प्रॅक्टिस</div>
                  <div className="text-[10px] text-[#557065] leading-tight">प्रत्यक्ष साडी नेसण्याचा आत्मविश्वास</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
