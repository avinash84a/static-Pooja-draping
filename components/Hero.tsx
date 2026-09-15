'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Star, Sparkles, CheckCircle, Calendar, MapPin, Award } from 'lucide-react';
import { WorkshopData } from '../types/wordpress';

interface HeroProps {
  workshopData: WorkshopData;
  onBookClick?: () => void;
}

export default function Hero({ workshopData, onBookClick }: HeroProps) {
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

  const heroImageSrc =
    typeof workshopData?.heroImage === 'string' && workshopData.heroImage.trim() !== ''
      ? workshopData.heroImage.trim()
      : 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF5EE] to-[#F5EFE6] pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle traditional paisley/gold background ornament */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8C1D40]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Trust Pill & CMS Status */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#581825] text-amber-200 text-xs font-semibold shadow-sm tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>पूजा साडी ड्रॅपिंग • पुणे</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-medium border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>5.0 रेटिंग (33+ Google Reviews)</span>
              </span>
            </div>

            {/* Main Headlines */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-extrabold text-[#36111B] leading-[1.15] tracking-tight">
                {workshopData.title || '1 डे साडी ड्रॅपिंग वर्कशॉप'}
              </h1>
              <p className="text-xl sm:text-2xl font-serif font-semibold text-[#8C1D40] leading-snug">
                {workshopData.subtitle || 'गौरी महालक्ष्मीच्या सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण'}
              </p>
            </div>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              पुण्यातील अग्रगण्य साडी ड्रॅपिंग प्रशिक्षिका{' '}
              <strong className="text-[#581825] font-semibold">पूजा पाटील</strong> यांच्याकडून शिका उभी व बसलेली गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी, रुक्मिणी आणि १४+ प्रकारच्या साडी ड्रॅपिंगचे थेट हँड्स-ऑन प्रात्यक्षिक.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 border border-amber-100 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">१४+ साडी ड्रॅपिंग प्रकार</h4>
                  <p className="text-[11px] text-stone-600">उभी-बसलेली गौरी, नऊवारी, डिझायनर</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 border border-amber-100 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">१००% हँड्स-ऑन प्रॅक्टिकल</h4>
                  <p className="text-[11px] text-stone-600">प्रत्येक विद्यार्थिनीकडून प्रत्यक्ष करून घेणे</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 border border-amber-100 shadow-sm">
                <Calendar className="w-5 h-5 text-[#8C1D40] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">फी: फक्त ₹१,५००/-</h4>
                  <p className="text-[11px] text-stone-600">अॅडव्हान्स ₹५००/- देऊन जागा निश्चित करा</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 border border-amber-100 shadow-sm">
                <MapPin className="w-5 h-5 text-[#8C1D40] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">सिंहगड रोड, आनंद नगर, पुणे</h4>
                  <p className="text-[11px] text-stone-600">मध्यवर्ती व सहज पोहोचता येणारे ठिकाण</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>WhatsApp वर नाव नोंदवा</span>
              </a>

              <Link
                href="/workshop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-amber-50 text-[#581825] font-bold text-base border-2 border-[#581825]/30 hover:border-[#581825] shadow-sm transition-all duration-200"
              >
                <span>वर्कशॉप तपशील व साडी प्रकार</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Limited Seats Notice */}
            <div className="inline-flex items-center gap-2 text-xs text-stone-600 pt-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>
                प्रत्येक बॅचमध्ये फक्त <strong>१० ते १२ जागा</strong> (व्यक्तिगत लक्ष देण्यासाठी मर्यादित प्रवेश)
              </span>
            </div>

          </div>

          {/* Right Column: Hero Visual from WordPress Media */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Decorative Frame */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-amber-400 via-[#8C1D40] to-amber-600 opacity-20 blur-lg"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <div className="relative aspect-[3/4] w-full bg-stone-100">
                  <Image
                    src={heroImageSrc}
                    alt="गौरी महालक्ष्मी साडी ड्रॅपिंग पूजा पाटील पुणे"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Floating Caption on Hero Card */}
                  <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          प्रत्यक्ष वर्कशॉप रिजल्ट
                        </span>
                        <h3 className="text-sm sm:text-base font-serif font-bold text-white">
                          गौरी महालक्ष्मी विशेष साडी ड्रॅपिंग
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-400 text-stone-900 text-[11px] font-extrabold shadow">
                        पूजा पाटील
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Badge 1: 14+ Styles */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-amber-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-[#581825] flex items-center justify-center font-bold text-lg">
                  १४+
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">साडी ड्रॅपिंग प्रकार</p>
                  <p className="text-[11px] text-stone-500">उभी-बसलेली गौरी व नऊवारी</p>
                </div>
              </div>

              {/* Floating Badge 2: Certificate */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl py-2 px-3.5 shadow-xl border border-amber-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold text-stone-800">सहभाग प्रमाणपत्र</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
