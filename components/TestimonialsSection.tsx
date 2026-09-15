'use client';

import React, { useState } from 'react';
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight, CheckCircle, ShieldCheck } from 'lucide-react';
import businessData from '../data/business-data.json';

export default function TestimonialsSection() {
  const [activeTab, setActiveTab] = useState<'grid' | 'featured'>('grid');
  const reviews = businessData.reviews;

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white relative border-y border-[#EFE8DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Official Google Profile Badge */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          
          {/* Google Official Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] shadow-xs mb-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-bold text-xs sm:text-sm text-gray-800">Google Reviews</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-[#3B1F25]">5.0</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-semibold">(33 Reviews)</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            आमच्या विद्यार्थिनींचे मनोगत
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2 max-w-xl mx-auto">
            पूजा साडी ड्रॅपिंग वर्कशॉप पूर्ण केलेल्या विद्यार्थिनींचे Google वरील प्रामाणिक अनुभव व अभिप्राय.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((rev, index) => {
            const isTopReview = index === 0 || index === 1;

            return (
              <div
                key={index}
                className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  isTopReview
                    ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9F2] border-amber-300/70 shadow-sm relative overflow-hidden'
                    : 'bg-[#FAF7F2] border-[#EAE2D7] hover:border-[#8B1E3F]/30'
                }`}
              >
                {isTopReview && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-amber-400 text-[#36111B] text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">
                    Verified Google Review
                  </div>
                )}

                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-[#3B1F25] ml-1">5.0</span>
                    </div>
                    <Quote className="w-6 h-6 text-[#8B1E3F]/20 shrink-0" />
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-[#3B282C] leading-relaxed mb-6 italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#EAE2D7] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#8B1E3F] text-white flex items-center justify-center font-bold text-xs">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#3B1F25] flex items-center gap-1">
                        {rev.author}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {rev.meta}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium text-[#8B1E3F] bg-white px-2 py-0.5 rounded border border-[#EADBCE]">
                    {rev.photoHighlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Google Reviews CTA & Trust Summary */}
        <div className="max-w-xl mx-auto text-center bg-[#FAF7F2] p-6 rounded-2xl border border-[#EADBCE] shadow-xs">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm font-bold text-[#3B1F25]">
            5.0 स्टार रेटिंग सह 33 हून अधिक विद्यार्थिनींचा १००% विश्वास
          </p>
          <p className="text-xs text-[#7A585F] mt-1 mb-4">
            प्रत्येक विद्यार्थिनीला मिळते वैयक्तिक लक्ष, सराव आणि परिपूर्ण समाधान.
          </p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Pooja+Saree+Draping+Pune+Sinhgad+Road"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#8B1E3F] text-[#8B1E3F] hover:bg-[#8B1E3F] hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <span>Google वर आमचे Reviews पहा</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
