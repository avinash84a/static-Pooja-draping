'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = '8446917187',
  message = 'नमस्कार पूजा ताई, मला १ डे साडी ड्रॅपिंग वर्कशॉपबद्दल माहिती हवी आहे.',
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-full bg-[#36111B] text-amber-200 text-xs font-semibold shadow-xl border border-amber-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        WhatsApp वर त्वरित संपर्क साधा 💬
      </span>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl transition-all duration-300 transform group-hover:scale-110 active:scale-95"
        aria-label="WhatsApp Contact"
      >
        {/* Radar Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-60 animate-ping"></span>

        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white relative z-10" />
      </a>
    </aside>
  );
}
