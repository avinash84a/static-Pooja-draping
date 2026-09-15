'use client';

import React from 'react';
import {
  Compass,
  Scissors,
  Sparkles,
  HeartHandshake,
  Award,
  CheckCircle2,
} from 'lucide-react';

export default function WhyChooseSection() {
  const cards = [
    {
      icon: Compass,
      symbol: '🌸',
      title: 'Step-by-Step Guidance',
      marathiTitle: 'पायरी-पायरीने मार्गदर्शन',
      desc: 'प्रत्येक पॅटर्न सोप्या पद्धतीने समजावून सांगितला जातो, ज्यामुळे साडी ड्रॅपिंगचा कोणताही पूर्व अनुभव नसला तरी सहज शिकता येते.',
      bgGradient: 'from-amber-50 to-orange-50',
    },
    {
      icon: Scissors,
      symbol: '👗',
      title: 'Practical Training',
      marathiTitle: 'प्रत्यक्ष प्रॅक्टिकल सराव',
      desc: 'फक्त पाहण्याऐवजी प्रत्यक्ष साडी ड्रॅपिंगचा सराव करून घेतला जातो, जेणेकरून हाताला सफाई आणि फिनिशिंग येते.',
      bgGradient: 'from-rose-50 to-pink-50',
    },
    {
      icon: Sparkles,
      symbol: '✨',
      title: 'Multiple Draping Styles',
      marathiTitle: 'विविध साडी ड्रॅपिंग पॅटर्न',
      desc: 'पारंपरिक, सणांचे, गौरी महालक्ष्मीचे आणि आकर्षक डिझायनर असे 14 हून अधिक प्रकार एकाच ठिकाणी शिकण्याची संधी.',
      bgGradient: 'from-purple-50 to-indigo-50',
    },
    {
      icon: HeartHandshake,
      symbol: '💐',
      title: 'Personal Attention',
      marathiTitle: 'प्रत्येकीकडे वैयक्तिक लक्ष',
      desc: 'शिकताना आवश्यक ते मार्गदर्शन आणि बारीक चुका दुरुस्त करून घेतल्या जातात. मर्यादित बॅचमुळे प्रत्येकीला वेळ मिळतो.',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      icon: Award,
      symbol: '🎓',
      title: 'Confidence Building',
      marathiTitle: 'आत्मविश्वास निर्मिती',
      desc: 'स्वतः साडी नेसण्याचा आणि कोणत्याही शुभकार्यात इतरांना साडी नेसवण्याचा संपूर्ण आत्मविश्वास मिळतो.',
      bgGradient: 'from-amber-50 to-yellow-50',
    },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3">
            ✨ का निवडाल पूजा साडी ड्रॅपिंग?
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            पूजा साडी ड्रॅपिंग का निवडाल?
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2">
            पुण्यातील सर्वात विश्वासार्ह आणि प्रात्यक्षिकावर भर देणारे साडी ड्रॅपिंग प्रशिक्षण केंद्र.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isLast = index === cards.length - 1;

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE2D7] hover:border-[#8B1E3F]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isLast ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1E3F]/10 to-[#581825]/15 text-[#8B1E3F] flex items-center justify-center font-bold text-xl shadow-xs">
                      {card.symbol}
                    </div>
                    <span className="text-xs font-bold text-gray-400 font-mono">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#3B1F25] mb-1 font-serif">
                    {card.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#8B1E3F] mb-3">
                    {card.marathiTitle}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5B454A] leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>100% प्रात्यक्षिक हमी</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
