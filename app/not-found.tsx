import React from 'react';
import Link from 'next/link';
import { Home, Compass, Phone, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-amber-100 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#581825] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-serif font-extrabold text-[#581825]">404</span>
          <h2 className="text-2xl font-serif font-bold text-[#36111B]">
            पृष्ठ सापडले नाही
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            तुम्ही शोधत असलेले पेज उपलब्ध नाही किंवा त्याचा पत्ता बदलला असावा.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-[#581825] hover:bg-[#722031] text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-4 h-4" />
            <span>मुख्यपृष्ठ</span>
          </Link>

          <Link
            href="/workshop"
            className="flex-1 py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#581825] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>वर्कशॉप पाहा</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
