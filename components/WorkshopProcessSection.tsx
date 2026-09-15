'use client';

import React from 'react';
import {
  ClipboardList,
  BookOpen,
  Sparkles,
  Scissors,
  CheckCheck,
  Award,
} from 'lucide-react';
import businessData from '../data/business-data.json';

export default function WorkshopProcessSection() {
  const steps = [
    {
      num: '01',
      icon: ClipboardList,
      title: 'Registration',
      marathiTitle: 'नोंदणी व पूर्वतयारी',
      desc: 'आपली जागा आरक्षित करणे, बॅचची वेळ व वर्कशॉप साहित्याची संपूर्ण माहिती मिळवणे.',
    },
    {
      num: '02',
      icon: BookOpen,
      title: 'Introduction',
      marathiTitle: 'फॅब्रिक व प्लीट्सची ओळख',
      desc: 'सिल्क, कॉटन, पैठणी इत्यादी साड्यांच्या फॅब्रिक्सनुसार प्लीट्स आणि पदराची बेसिक माहिती.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'Demonstration',
      marathiTitle: 'थेट समोर प्रात्यक्षिक',
      desc: 'पूजा मॅडम स्वतः प्रत्येक पॅटर्नचे बारकावे आणि अचूक स्टेप्स थेट समोर करून दाखवतात.',
    },
    {
      num: '04',
      icon: Scissors,
      title: 'Step-by-Step Practice',
      marathiTitle: 'प्रत्यक्ष हाताने सराव',
      desc: 'प्रत्येक विद्यार्थिनी स्वतः साडी घेऊन प्रत्येक प्रकारची प्रॅक्टिस करते (Hands-on Training).',
    },
    {
      num: '05',
      icon: CheckCheck,
      title: 'Corrections & Guidance',
      marathiTitle: 'वैयक्तिक मार्गदर्शन व दुरुस्ती',
      desc: 'प्लेट्स सुटणे, पदर सैल होणे अशा बारीक चुकांवर जागेवरच अचूक उपाय व मार्गदर्शन.',
    },
    {
      num: '06',
      icon: Award,
      title: 'Final Look & Certificate',
      marathiTitle: 'फायनल लूक व प्रमाणपत्र',
      desc: 'परिपूर्ण साडी लूक, फोटो मोमेंट्स आणि अधिकृत वर्कशॉप पूर्ण केल्याचे प्रमाणपत्र वितरण.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative border-b border-[#EFE8DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3">
            ✨ Learning Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            वर्कशॉपमध्ये तुम्हाला काय शिकायला मिळेल?
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2">
            नोंदणीपासून ते प्रमाणपत्र मिळेपर्यंतचा सुव्यवस्थित आणि आनंददायी 6-टप्प्यांचा प्रवास.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#EAE2D7] hover:border-[#8B1E3F]/40 hover:shadow-md transition-all relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-[#EADBCE] text-[#8B1E3F] flex items-center justify-center group-hover:bg-[#8B1E3F] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-serif text-[#8B1E3F]/30 group-hover:text-[#8B1E3F]/60 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#3B1F25] font-serif mb-1">
                    {step.marathiTitle}
                  </h3>
                  <div className="text-xs font-semibold text-[#8B1E3F] tracking-wide uppercase mb-2.5">
                    {step.title}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5B454A] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE2D7]/70 flex items-center gap-1.5 text-[11px] font-medium text-[#7A585F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B1E3F]" />
                  <span>Step {step.num} of 06</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
