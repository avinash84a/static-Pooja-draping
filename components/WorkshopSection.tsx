'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  MessageCircle,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { WorkshopData, DrapingStyleItem } from '../types/wordpress';
import WorkshopStyles from './WorkshopStyles';

interface WorkshopSectionProps {
  workshopData: WorkshopData;
  styles: DrapingStyleItem[];
  onBookClick?: () => void;
}

export default function WorkshopSection({
  workshopData,
  styles,
  onBookClick,
}: WorkshopSectionProps) {
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
      : 'नमस्कार पूजा ताई, मला १ डे साडी ड्रॅपिंग वर्कशॉपसाठी नाव नोंदवायचे आहे.';

  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  return (
    <section id="workshop" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-[#581825] text-xs font-bold border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>पुण्यातील नंबर १ साडी ड्रॅपिंग कार्यशाळा</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#36111B]">
            मी पूजा पाटील — १ डे साडी ड्रॅपिंग वर्कशॉप
          </h2>

          <p className="text-base text-stone-600 leading-relaxed">
            {workshopData.description ||
              'गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी व डिझायनर साड्या स्वतःच्या हाताने नेसवण्याचा परिपूर्ण आत्मविश्वास देणारे खास प्रॅक्टिकल प्रशिक्षण.'}
          </p>
        </div>

        {/* Workshop Key Highlights Card */}
        <div className="bg-gradient-to-br from-[#FAF5EE] to-[#F3ECE0] rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-200/80 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Schedule, Fees & Venue */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C1D40]">
                  कार्यशाळा तपशील व वेळापत्रक
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#36111B]">
                  {workshopData.title}
                </h3>
              </div>

              {/* Detail Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 border border-amber-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#581825] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 font-medium">तारीख व बॅच:</span>
                    <p className="font-bold text-stone-900">{workshopData.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 border border-amber-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#581825] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 font-medium">वेळ:</span>
                    <p className="font-bold text-stone-900">{workshopData.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 border border-amber-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 font-medium">वर्कशॉप फी:</span>
                    <p className="font-bold text-emerald-800 text-base">
                      फक्त ₹{workshopData.fees}/-
                    </p>
                    <span className="text-[11px] text-stone-500">
                      (अॅडव्हान्स ₹{workshopData.advanceFee}/-)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 border border-amber-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#581825] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 font-medium">पत्ता / ठिकाण:</span>
                    <p className="font-bold text-stone-900">{workshopData.location}</p>
                    <span className="text-[11px] text-stone-500">{workshopData.locationDetails}</span>
                  </div>
                </div>

              </div>

              {/* Highlights List */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  या वर्कशॉपमध्ये तुम्हाला काय मिळेल:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {workshopData.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-stone-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking CTA Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp वर जागा बुक करा (Advance ₹{workshopData.advanceFee})</span>
                </a>

                <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold">
                  <Users className="w-4 h-4" />
                  <span>फक्त {workshopData.seatsLeft || 6} जागा शिल्लक!</span>
                </div>
              </div>

            </div>

            {/* Right: Instructor Profile / Gauri Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM.jpeg"
                    alt="पूजा पाटील साडी ड्रॅपिंग वर्कशॉप"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-bold text-amber-300">प्रशिक्षिका</span>
                    <h4 className="text-lg font-serif font-bold">पूजा पाटील (पुणे)</h4>
                    <p className="text-xs text-stone-200">
                      १०+ वर्षांचा अनुभव • ५००+ समाधानी विद्यार्थिनी
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 14-15 Saree Draping Styles Showcase */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#36111B]">
              वर्कशॉपमध्ये शिकवले जाणारे १४+ साडी ड्रॅपिंग प्रकार
            </h3>
            <p className="text-sm text-stone-600">
              प्रत्येक प्रकार सुरुवातीपासून (Step-by-Step) प्रत्यक्ष कृतीसह शिकवला जातो
            </p>
          </div>

          <WorkshopStyles styles={styles} />
        </div>

      </div>
    </section>
  );
}
