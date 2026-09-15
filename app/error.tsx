'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-[#36111B]">
            काहीतरी अडचण आली
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            माहिती लोड करताना तात्पुरती तांत्रिक अडचण निर्माण झाली आहे. कृपया खालील बटण दाबून पुन्हा प्रयत्न करा.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl bg-[#581825] hover:bg-[#722031] text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
          >
            <RefreshCw className="w-4 h-4" />
            <span>पुन्हा प्रयत्न करा</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>मुख्यपृष्ठावर जा</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
