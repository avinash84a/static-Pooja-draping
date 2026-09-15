'use client';

import React from 'react';
import { Phone, MessageCircle, Navigation, Ticket } from 'lucide-react';

interface FloatingMobileCTAProps {
  onBookClick: () => void;
}

export default function FloatingMobileCTA({ onBookClick }: FloatingMobileCTAProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Saiprabha House Sinhgad Road Anand Nagar Pune 411051'
  )}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#EADBCE] shadow-2xl py-2 px-3">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5 items-center">
        
        {/* Call CTA */}
        <a
          href="tel:8446917187"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#4A1521] hover:bg-[#FAF0F3] active:bg-[#F2DFE4] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#8B1E3F]/10 flex items-center justify-center text-[#8B1E3F] mb-0.5">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Call</span>
        </a>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%A1%E0%A4%AE%2C%0A%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%A1%E0%A5%80%20%E0%A4%A1%E0%A5%8D%E0%A4%B0%E0%A5%85%E0%A4%AA%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%8Params%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87.%0A%E0%A4%95%E0%A5%83%E0%A4%AA%E0%A4%AF%E0%A4%BE%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%AA%E0%A5%81%E0%A4%A2%E0%A5%80%E0%A4%B2%20workshop%20%E0%A4%9A%E0%A5%80%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%AA%E0%A4%BE%E0%A4%A0%E0%A4%B5%E0%A4%BE."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-0.5">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* Directions CTA */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#3B1F25] hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-0.5">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Directions</span>
        </a>

        {/* Book Seat CTA */}
        <button
          onClick={onBookClick}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-[#8B1E3F] text-white shadow-md active:bg-[#721531] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-300 mb-0.5">
            <Ticket className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Book Seat</span>
        </button>

      </div>
    </div>
  );
}
