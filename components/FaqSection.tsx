'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import businessData from '../data/business-data.json';

export default function FaqSection() {
  const faqs = businessData.faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white relative border-b border-[#EFE8DE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#8B1E3F]" />
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            नेहमी विचारले जाणारे प्रश्न (FAQs)
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2">
            वर्कशॉप, प्रवेश, साडी प्रकार आणि मार्गदर्शनाबद्दलच्या सर्व शंकांची उत्तरे येथे मिळतील.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-[#EAE2D7] bg-[#FAF7F2] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#F5EFE6] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#3B1F25] font-serif leading-snug">
                    {index + 1}. {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-[#8B1E3F] text-white rotate-180' : 'bg-white text-gray-500 border border-[#EADBCE]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 sm:px-6 text-xs sm:text-sm text-[#5B454A] leading-relaxed border-t border-[#EAE2D7]/60 animate-fadeIn">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Box */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE]">
          <p className="text-sm font-semibold text-[#3B1F25]">
            आपला प्रश्न येथे मिळाला नाही? थेट पूजा मॅडमशी बोला:
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:8446917187"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#8B1E3F] text-[#8B1E3F] text-xs font-semibold hover:bg-white"
            >
              फोन करा: 84469 17187
            </a>
            <a
              href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%A1%E0%A4%AE%2C%0A%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%8Params%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%8F%E0%A4%95%20%E0%A4%B6%E0%A4%82%E0%A4%95%E0%A4%BE%20%E0%A4%B5%E0%A4%BF%E0%A4%9A%E0%A4%BE%E0%A4%B0%E0%A4%BE%E0%A4%AF%E0%A4%9A%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp वर विचारा
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
