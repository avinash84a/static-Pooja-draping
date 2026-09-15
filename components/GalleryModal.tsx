'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, MessageCircle, ZoomIn, Calendar, Sparkles } from 'lucide-react';
import { GalleryPhoto } from '../types/wordpress';

interface GalleryModalProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
}

export default function GalleryModal({ photo, onClose }: GalleryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!photo) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `नमस्कार पूजा ताई, मला वेबसाइटवरील या साडी ड्रॅपिंग फोटोबद्दल चौकशी करायची आहे: "${photo.title}"`
    );
    window.open(`https://wa.me/918446917187?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 max-w-3xl w-full bg-[#200A10] rounded-3xl overflow-hidden shadow-2xl border border-amber-300/30 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Image Container */}
        <div className="relative w-full md:w-3/5 bg-black flex items-center justify-center min-h-[350px] md:min-h-[500px]">
          <Image
            src={photo.imageUrl || 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg'}
            alt={photo.altText?.trim() || photo.title?.trim() || 'पूजा साडी ड्रॅपिंग फोटो'}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain p-2"
            referrerPolicy="no-referrer"
          />

          {/* Close button on mobile image */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold shadow-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-[#2D0F16] text-[#FAF5EF]">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{photo.category}</span>
              </span>

              {/* Desktop close button */}
              <button
                onClick={onClose}
                className="hidden md:flex w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-white leading-snug">
                {photo.title}
              </h3>
              {photo.subtitle && (
                <p className="text-xs text-amber-200/90 leading-relaxed font-serif italic">
                  {photo.subtitle}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#E8D7D9] space-y-2">
              <p>
                <strong>प्रशिक्षक:</strong> पूजा पाटील (पुणे)
              </p>
              <p>
                <strong>स्थान:</strong> आनंद नगर, सिंहगड रोड, पुणे
              </p>
              <p className="text-[11px] text-amber-300">
                ✓ प्रत्यक्ष १ डे वर्कशॉपमधील विद्यार्थ्यांचे साडी ड्रॅपिंग
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>या साडी प्रकारासाठी चौकशी करा</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 font-medium text-xs transition-colors text-center"
            >
              गॅलरीवर परत जा
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
