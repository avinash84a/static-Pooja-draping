'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, ZoomIn, MessageCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { GalleryPhoto } from '../types/wordpress';
import GalleryModal from './GalleryModal';

interface GalleryProps {
  photos: GalleryPhoto[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showFilters?: boolean;
}

export default function Gallery({
  photos = [],
  title = 'साडी ड्रॅपिंग फोटो गॅलरी',
  subtitle = 'गौरी महालक्ष्मी व नऊवारी साडी ड्रॅपिंगचे प्रत्यक्ष काम व विद्यार्थिनींचे प्रात्यक्षिक',
  limit,
  showFilters = true,
}: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('सर्व');

  const categories = useMemo(() => {
    const list = new Set<string>();
    photos.forEach((p) => {
      if (p.category) list.add(p.category);
    });
    return ['सर्व', ...Array.from(list)];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    let result = photos;
    if (activeCategory !== 'सर्व') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    return result;
  }, [photos, activeCategory, limit]);

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-[#581825] text-xs font-bold border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>WordPress Media CMS द्वारे लाइव्ह फोटो</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#36111B]">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Category Filters */}
        {showFilters && categories.length > 1 && (
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
        )}

        {/* Empty State */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <ImageIcon className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-stone-700">या श्रेणीत सध्या फोटो नाहीत</h3>
            <p className="text-xs text-stone-500">कृपया इतर श्रेणी निवडा किंवा काही वेळानंतर पुन्हा पाहा.</p>
          </div>
        ) : (
          /* Masonry / Responsive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={photo.imageUrl || 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg'}
                    alt={photo.altText?.trim() || photo.title?.trim() || 'पूजा साडी ड्रॅपिंग फोटो'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#581825]/90 text-amber-200 text-[10px] font-bold shadow backdrop-blur-sm">
                      {photo.category}
                    </span>
                  </div>

                  {/* Zoom Icon on Hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center shadow">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-sm font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {photo.title}
                    </h3>
                    {photo.subtitle && (
                      <p className="text-[11px] text-amber-200/85 line-clamp-1">
                        {photo.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-3 bg-white flex items-center justify-between text-xs text-[#581825] font-semibold border-t border-amber-50">
                  <span>फोटो मोठा करून पाहा</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    चौकशी
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <GalleryModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </section>
  );
}
