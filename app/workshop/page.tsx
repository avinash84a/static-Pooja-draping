import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WorkshopSection from '../../components/WorkshopSection';
import BookingCTA from '../../components/BookingCTA';
import WhatsAppButton from '../../components/WhatsAppButton';
import WordPressSyncBadge from '../../components/WordPressSyncBadge';
import { getWorkshopDetails, getDrapingStyles, getMedia } from '../../lib/wordpress';
import { Sparkles, Calendar, Clock, MapPin, Award, Users, CheckCircle, ShieldCheck } from 'lucide-react';

export const revalidate = 60; // Next.js ISR (Incremental Static Regeneration)

export const metadata: Metadata = {
  title: '१ डे साडी ड्रॅपिंग वर्कशॉप | पूजा साडी ड्रॅपिंग पुणे',
  description:
    'पुण्यात शिका १४+ गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी व डिझायनर साडी ड्रॅपिंग प्रकार. प्रत्यक्ष हँड्स-ऑन प्रॅक्टिकल, फी फक्त ₹१,५००/-, मर्यादित जागा.',
  openGraph: {
    title: '१ डे साडी ड्रॅपिंग वर्कशॉप | पूजा साडी ड्रॅपिंग पुणे',
    description:
      'पुण्यात शिका १४+ गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी व डिझायनर साडी ड्रॅपिंग प्रकार. प्रत्यक्ष हँड्स-ऑन प्रॅक्टिकल.',
  },
};

export default async function WorkshopPage() {
  const [workshopData, styles, mediaList] = await Promise.all([
    getWorkshopDetails(),
    getDrapingStyles(),
    getMedia(50),
  ]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
      <Header />

      {/* Page Header Hero */}
      <section className="bg-gradient-to-b from-[#581825] via-[#4A121E] to-[#36111B] text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>पुण्यातील अग्रगण्य साडी ड्रॅपिंग कार्यशाळा</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            {workshopData.title}
          </h1>

          <p className="text-lg sm:text-xl text-amber-200/90 font-serif font-semibold">
            {workshopData.subtitle}
          </p>

          <p className="text-sm sm:text-base text-[#E0CDD0] max-w-2xl mx-auto leading-relaxed">
            {workshopData.description}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20">
              📅 आगामी रविवार स्पेशल बॅच
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20">
              📍 सिंहगड रोड, आनंद नगर, पुणे
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-stone-900 font-bold">
              💰 फी: ₹{workshopData.fees}/- (Advance ₹{workshopData.advanceFee})
            </span>
          </div>
        </div>
      </section>

      {/* Main Workshop Content */}
      <WorkshopSection workshopData={workshopData} styles={styles} />

      {/* Booking CTA Section */}
      <BookingCTA workshopData={workshopData} />

      {/* Footer & Floating CTAs */}
      <Footer />
      <WhatsAppButton />
      <WordPressSyncBadge mediaCount={mediaList.length} />
    </main>
  );
}
