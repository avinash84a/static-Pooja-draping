import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BookingCTA from '../../components/BookingCTA';
import WhatsAppButton from '../../components/WhatsAppButton';
import WordPressSyncBadge from '../../components/WordPressSyncBadge';
import { getWorkshopDetails, getMedia } from '../../lib/wordpress';
import {
  Sparkles,
  Award,
  Heart,
  Users,
  CheckCircle,
  Clock,
  Star,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'आमच्याबद्दल | पूजा साडी ड्रॅपिंग पुणे - पूजा पाटील',
  description:
    'पुण्यातील सुप्रसिद्ध साडी ड्रॅपिंग आर्टिस्ट पूजा पाटील यांच्याबद्दल माहिती. १०+ वर्षांचा अनुभव, ५००+ समाधानी विद्यार्थिनी व हँड्स-ऑन प्रॅक्टिकल साडी ड्रॅपिंग प्रशिक्षण.',
  openGraph: {
    title: 'आमच्याबद्दल | पूजा साडी ड्रॅपिंग पुणे',
    description:
      'पुण्यातील सुप्रसिद्ध साडी ड्रॅपिंग आर्टिस्ट पूजा पाटील यांच्याबद्दल माहिती. १०+ वर्षांचा अनुभव.',
  },
};

export default async function AboutPage() {
  const [workshopData, mediaList] = await Promise.all([
    getWorkshopDetails(),
    getMedia(50),
  ]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#581825] via-[#4A121E] to-[#36111B] text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
            <Heart className="w-3.5 h-3.5" />
            <span>महाराष्ट्राची परंपरा • आधुनिक तंत्र</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            आमच्याबद्दल — पूजा साडी ड्रॅपिंग पुणे
          </h1>

          <p className="text-base sm:text-lg text-amber-200/90 leading-relaxed font-serif">
            “प्रत्येक स्त्रीने सण-समारंभात आत्मविश्वासाने आणि सुबकपणे साडी नेसावी, हेच आमचे ध्येय.”
          </p>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM.jpeg"
                    alt="पूजा पाटील साडी ड्रॅपिंग पुणे"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-serif font-bold">सौ. पूजा पाटील</h3>
                    <p className="text-xs text-amber-300">संस्थापिका व मुख्य साडी ड्रॅपिंग प्रशिक्षिका</p>
                    <p className="text-[11px] text-stone-300">आनंद नगर, सिंहगड रोड, पुणे</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C1D40]">
                  प्रशिक्षिकेचा प्रवास व अनुभव
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#36111B]">
                  नमस्कार, मी पूजा पाटील!
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
                <p>
                  गेल्या १० वर्षांहून अधिक काळ मी साडी ड्रॅपिंगच्या पारंपारिक आणि आधुनिक कलाप्रकारांमध्ये कार्यरत आहे. महाराष्ट्राची गौरवशाली संस्कृती असलेले नऊवारी काष्टा, पेशवाई नऊवारी, ब्राह्मणी साडी आणि विशेषतः गणेशोत्सवात घरोघरी पूजल्या जाणाऱ्या <strong>गौरी महालक्ष्मी साडी ड्रॅपिंग</strong> यामध्ये मला विशेष प्रावीण्य आहे.
                </p>
                <p>
                  अनेकांना साडी नेसण्याची किंवा गौरीला साडी नेसवण्याची आवड असते, परंतु निऱ्या व्यवस्थित न बसणे, पदर सैल होणे किंवा काष्टा नीट न जमणे या अडचणी येतात. म्हणूनच मी पुण्यात <strong>‘१ डे साडी ड्रॅपिंग वर्कशॉप’</strong> सुरू केला, जिथे प्रत्येक विद्यार्थिनीला स्वतःच्या हाताने प्रात्यक्षिक (Hands-on training) देऊन प्रत्येक प्रकार बारकाव्यांसह शिकवला जातो.
                </p>
                <p>
                  आजवर पुण्यातील तसेच पिंपरी-चिंचवड, सातारा, नगर व मुंबई येथून आलेल्या ५०० हून अधिक महिलांनी आमच्या कार्यशाळेत भाग घेऊन साडी नेसण्याचा परिपूर्ण आत्मविश्वास मिळवला आहे.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-amber-200/80 text-center">
                  <div className="text-2xl font-serif font-extrabold text-[#581825]">१०+</div>
                  <span className="text-[11px] text-stone-600">वर्षांचा अनुभव</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-amber-200/80 text-center">
                  <div className="text-2xl font-serif font-extrabold text-[#581825]">५००+</div>
                  <span className="text-[11px] text-stone-600">प्रशिक्षित विद्यार्थिनी</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-amber-200/80 text-center">
                  <div className="text-2xl font-serif font-extrabold text-[#581825]">१४+</div>
                  <span className="text-[11px] text-stone-600">साडी ड्रॅपिंग प्रकार</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-amber-200/80 text-center">
                  <div className="text-2xl font-serif font-extrabold text-[#581825]">5.0★</div>
                  <span className="text-[11px] text-stone-600">गुगल रिव्ह्यूज</span>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2">
                <a
                  href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A4%8F%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%A4%E0%A4%BE%E0%A4%88%2C%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%89%E0%A4%AA%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#581825] hover:bg-[#722031] text-amber-200 font-bold text-sm shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>पूजा ताईंशी थेट WhatsApp वर बोला</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <BookingCTA workshopData={workshopData} />

      {/* Footer & Floating CTAs */}
      <Footer />
      <WhatsAppButton />
      <WordPressSyncBadge mediaCount={mediaList.length} />
    </main>
  );
}
