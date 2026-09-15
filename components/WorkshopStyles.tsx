'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, Clock, CheckCircle2, ChevronRight, Filter, MessageCircle } from 'lucide-react';
import { DrapingStyleItem } from '../types/wordpress';

interface WorkshopStylesProps {
  styles: DrapingStyleItem[];
}

export default function WorkshopStyles({ styles }: WorkshopStylesProps) {
  const [activeCategory, setActiveCategory] = useState<string>('सर्व');
  const [selectedStyle, setSelectedStyle] = useState<DrapingStyleItem | null>(null);

  const categories = ['सर्व', 'गौरी महालक्ष्मी', 'नऊवारी प्रकार', 'पारंपारिक', 'डिझायनर प्रकार'];

  const filteredStyles = useMemo(() => {
    if (activeCategory === 'सर्व') return styles;
    return styles.filter((item) => item.categoryLabel === activeCategory);
  }, [styles, activeCategory]);

  const handleInquiry = (styleName: string) => {
    const msg = encodeURIComponent(
      `नमस्कार पूजा ताई, मला १ डे वर्कशॉपमधील "${styleName}" साडी प्रकाराबद्दल अधिक माहिती हवी आहे.`
    );
    window.open(`https://wa.me/918446917187?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#581825] text-amber-200 shadow-md transform scale-105'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStyles.map((item, idx) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden">
              <Image
                src={item.imageUrl || 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg'}
                alt={item.nameMarathi?.trim() || item.nameEnglish?.trim() || 'साडी ड्रॅपिंग प्रकार'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-[#581825]/90 text-amber-200 text-[10px] font-bold backdrop-blur-sm shadow">
                  #{idx + 1} {item.categoryLabel}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
                  {item.duration}
                </span>
              </div>

              {/* Bottom Title on Image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.nameMarathi}
                </h3>
                <p className="text-[11px] text-amber-200/90 font-medium">
                  {item.nameEnglish}
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-[11px]">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="text-stone-500">पदर प्रकार:</span>
                  <span className="font-semibold text-[#8C1D40]">{item.palluType}</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span className="text-stone-500">उपयुक्तता:</span>
                  <span className="font-medium text-stone-800">{item.idealFor}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setSelectedStyle(item)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#581825] text-xs font-bold text-center transition-colors border border-amber-200"
                >
                  पायऱ्या पाहा
                </button>
                <button
                  onClick={() => handleInquiry(item.nameMarathi)}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                  title="या प्रकाराबद्दल WhatsApp करा"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-100 max-h-[90vh] flex flex-col">
            
            <div className="relative aspect-video w-full bg-stone-100">
              <Image
                src={selectedStyle.imageUrl || 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg'}
                alt={selectedStyle.nameMarathi?.trim() || selectedStyle.nameEnglish?.trim() || 'साडी ड्रॅपिंग प्रकार'}
                fill
                className="object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <button
                onClick={() => setSelectedStyle(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors text-sm font-bold"
              >
                ✕
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-xs font-bold text-amber-300">
                  {selectedStyle.categoryLabel}
                </span>
                <h3 className="text-xl font-serif font-bold text-white">
                  {selectedStyle.nameMarathi} ({selectedStyle.nameEnglish})
                </h3>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <p className="text-sm text-stone-700 leading-relaxed">
                {selectedStyle.description}
              </p>

              <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/60 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500">कालावधी:</span>{' '}
                    <strong className="text-stone-900">{selectedStyle.duration}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">काठिन्य:</span>{' '}
                    <strong className="text-stone-900">{selectedStyle.difficulty}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">निऱ्या:</span>{' '}
                    <strong className="text-stone-900">{selectedStyle.pleatsCount}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">पदर:</span>{' '}
                    <strong className="text-stone-900">{selectedStyle.palluType}</strong>
                  </div>
                </div>
              </div>

              {/* Key Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#581825] mb-2">
                  वर्कशॉपमधील मुख्य शिकण्याच्या पायऱ्या:
                </h4>
                <div className="space-y-1.5">
                  {selectedStyle.keySteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    handleInquiry(selectedStyle.nameMarathi);
                    setSelectedStyle(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>या साडी प्रकारासाठी नाव नोंदवा</span>
                </button>
                <button
                  onClick={() => setSelectedStyle(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  बंद करा
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
