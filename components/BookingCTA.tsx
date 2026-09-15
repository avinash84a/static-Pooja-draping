'use client';

import React from 'react';
import { MessageCircle, CheckCircle2, ShieldCheck, Sparkles, Clock, Calendar, Users, Phone } from 'lucide-react';
import { WorkshopData } from '../types/wordpress';

interface BookingCTAProps {
  workshopData?: Partial<WorkshopData>;
  onBookClick?: () => void;
}

export default function BookingCTA({ workshopData, onBookClick }: BookingCTAProps) {
  const fees = workshopData?.fees || 1500;
  const advanceFee = workshopData?.advanceFee || 500;

  // Defensively guarantee primitive string to prevent invalid React child objects
  const rawNum = workshopData?.whatsappNumber;
  const whatsappNumber: string =
    typeof rawNum === 'string' && rawNum.trim() !== ''
      ? rawNum.trim()
      : typeof rawNum === 'object' && rawNum !== null && 'number' in (rawNum as any)
      ? String((rawNum as any).number)
      : '8446917187';

  const rawMsg = workshopData?.whatsappMessage;
  const whatsappMessage: string =
    typeof rawMsg === 'string' && rawMsg.trim() !== ''
      ? rawMsg.trim()
      : typeof rawMsg === 'object' && rawMsg !== null && 'message' in (rawMsg as any)
      ? String((rawMsg as any).message)
      : 'नमस्कार पूजा ताई, मला १ डे साडी ड्रॅपिंग वर्कशॉपसाठी नाव नोंदवायचे आहे. कृपया पुढील बॅचचे डिटेल्स व Google Pay/UPI नंबर पाठवा.';

  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-br from-[#581825] via-[#45121C] to-[#36111B] text-white">
      {/* Decorative Golden Ambient Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
          <Sparkles className="w-4 h-4" />
          <span>मर्यादित जागा • आगामी रविवार स्पेशल बॅच</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight">
            १ डे साडी ड्रॅपिंग वर्कशॉपसाठी नाव नोंदवा
          </h2>
          <p className="text-base sm:text-lg text-[#E8D7D9] max-w-2xl mx-auto leading-relaxed">
            केवळ एका दिवसात शिका १४+ प्रकारच्या साड्या नेसवण्याची सोपी कला. हँड्स-ऑन प्रॅक्टिकल आणि वैयक्तिक मार्गदर्शन!
          </p>
        </div>

        {/* Pricing Box */}
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pb-6 border-b border-white/15">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                एकूण वर्कशॉप फी
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
                ₹{fees}/-
              </div>
              <span className="text-[11px] text-stone-300">सर्व साहित्य व मार्गदर्शन समाविष्ट</span>
            </div>

            <div className="hidden sm:block h-12 w-px bg-white/20"></div>

            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                अॅडव्हान्स बुकिंग रक्कम
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-extrabold text-emerald-300">
                ₹{advanceFee}/-
              </div>
              <span className="text-[11px] text-stone-300">उर्वरित फी वर्कशॉपच्या दिवशी द्या</span>
            </div>
          </div>

          {/* Quick Assurance Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs sm:text-sm text-amber-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>१००% प्रत्यक्ष हँड्स-ऑन प्रॅक्टिकल</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>उभी व बसलेली गौरी महालक्ष्मी विशेष</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>फक्त १० ते १२ महिलांची लहान बॅच</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>सहभाग प्रमाणपत्र व मोफत टिप्स</span>
            </div>
          </div>

          {/* Main Action Button */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-6 h-6 fill-white/20" />
              <span>WhatsApp वर Booking करा</span>
            </a>
          </div>

          {/* Direct Phone Assistance */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/90 pt-1">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>थेट कॉल करा: <strong>{whatsappNumber}</strong></span>
            </span>
            <span>•</span>
            <span>सिंहगड रोड, आनंद नगर, पुणे</span>
          </div>

        </div>

      </div>
    </section>
  );
}
