import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#8C1D40]/20 border-t-[#8C1D40] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <h2 className="text-xl font-serif font-bold text-[#36111B]">
          पूजा साडी ड्रॅपिंग पुणे
        </h2>
        <p className="text-xs text-stone-500 tracking-wide">
          WordPress CMS वरून लाइव्ह माहिती लोड होत आहे...
        </p>
      </div>
    </div>
  );
}
