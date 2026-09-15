'use client';

import React from 'react';
import { Sparkles, Layers, Award, UserCheck, Heart, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onExploreStylesClick: () => void;
}

export default function AboutSection({ onExploreStylesClick }: AboutSectionProps) {
  const features = [
    {
      icon: Layers,
      title: 'Step-by-Step Training',
      marathiTitle: 'पायरी-पायरीने प्रशिक्षण',
      desc: 'कोणताही पॅटर्न क्लिष्ट न वाटता अगदी सोप्या आणि तंत्रशुद्ध पायऱ्यांनी समजावून सांगितला जातो.',
      tag: 'सोपी पद्धत'
    },
    {
      icon: Sparkles,
      title: 'Practical Demonstration',
      marathiTitle: 'थेट प्रात्यक्षिक व सराव',
      desc: 'फक्त ऐकणे किंवा पाहणे नाही, तर स्वतःच्या हाताने प्रॅक्टिस करून अचूक फिनिशिंग शिकवले जाते.',
      tag: '100% प्रॅक्टिकल'
    },
    {
      icon: Award,
      title: 'Traditional & Modern Styles',
      marathiTitle: 'पारंपरिक व आधुनिक प्रकार',
      desc: 'गौरी महालक्ष्मी, नऊवारी काष्टापासून ते आधुनिक डिझायनर अप्सरा व देवसेना स्टाईल्सचा समावेश.',
      tag: '14+ पॅटर्न'
    },
    {
      icon: UserCheck,
      title: 'Personal Guidance',
      marathiTitle: 'वैयक्तिक मार्गदर्शन व करेक्शन्स',
      desc: 'प्रत्येक विद्यार्थिनीच्या शंका, प्लीट्सचे पडणे आणि बॉडी फिटिंगवर पूजा मॅडमचे प्रत्यक्ष लक्ष असते.',
      tag: 'पर्सनल अटेन्शन'
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-y border-[#EFE8DE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading Tag */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#8B1E3F]/20 text-[#8B1E3F]" />
            About Pooja Saree Draping
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3B1F25] font-serif">
            पूजा साडी ड्रॅपिंगबद्दल थोडक्यात
          </h2>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-3 rounded-full" />
        </div>

        {/* Two Column Layout: Instructor Note & Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Personal message & Photo Showcase */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#FBF7F2] border border-[#EADBCE] p-6 sm:p-8 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 fill-[#8B1E3F]" />
              </div>

              <blockquote className="text-[#3B1F25] text-base sm:text-lg leading-relaxed font-medium mb-5">
                “मी पूजा पाटील. सुंदर, नीटनेटके आणि पारंपरिक पद्धतीने साडी ड्रॅपिंग शिकवण्याचा माझा प्रयत्न आहे.
                <br /><br />
                वर्कशॉपमध्ये प्रत्येक पॅटर्न step-by-step समजावून सांगितला जातो आणि प्रत्यक्ष प्रात्यक्षिकाद्वारे शिकवले जाते.
                <br /><br />
                साडी नेसताना फक्त पॅटर्नच नाही, तर योग्य प्लीट्स, पदर, फिटिंग आणि संपूर्ण लूक याकडेही लक्ष दिले जाते.”
              </blockquote>

              <div className="pt-4 border-t border-[#EADBCE] flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#3B1F25]">पूजा पाटील</h3>
                  <p className="text-xs text-[#7A585F] font-medium">संस्थापक व मुख्य प्रशिक्षक, पूजा साडी ड्रॅपिंग पुणे</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    5.0 ★ Google Rated
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Explore Button */}
            <button
              onClick={onExploreStylesClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#8B1E3F] text-[#8B1E3F] font-semibold text-sm hover:bg-[#8B1E3F] hover:text-white transition-all group"
            >
              <span>14+ साडी ड्रॅपिंगचे प्रकार पहा</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: 4 Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-[#FAF7F2] rounded-xl p-5 sm:p-6 border border-[#EAE2D7] hover:border-[#8B1E3F]/40 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-lg bg-white shadow-xs border border-[#EADBCE] flex items-center justify-center text-[#8B1E3F] group-hover:bg-[#8B1E3F] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#8B1E3F] bg-white px-2 py-0.5 rounded-full border border-[#EADBCE]">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#3B1F25] mb-1">
                      {feat.marathiTitle}
                    </h3>
                    <p className="text-xs font-medium text-[#7A585F] uppercase tracking-wider mb-2.5">
                      ✓ {feat.title}
                    </p>
                    <p className="text-xs sm:text-sm text-[#5B454A] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
