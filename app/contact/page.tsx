import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactSection from '../../components/ContactSection';
import WhatsAppButton from '../../components/WhatsAppButton';
import WordPressSyncBadge from '../../components/WordPressSyncBadge';
import { getWorkshopDetails, getMedia } from '../../lib/wordpress';
import { MapPin, Phone, MessageCircle, Clock, Sparkles, Navigation } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'संपर्क व पत्ता | पूजा साडी ड्रॅपिंग पुणे',
  description:
    'पूजा साडी ड्रॅपिंग स्टुडिओ: आनंद नगर, सिंहगड रोड, पुणे - ४११०५१. फोन / WhatsApp: 8446917187. १ डे साडी ड्रॅपिंग वर्कशॉप नाव नोंदणी व चौकशी.',
  openGraph: {
    title: 'संपर्क व पत्ता | पूजा साडी ड्रॅपिंग पुणे',
    description:
      'पूजा साडी ड्रॅपिंग स्टुडिओ: आनंद नगर, सिंहगड रोड, पुणे. फोन / WhatsApp: 8446917187.',
  },
};

export default async function ContactPage() {
  const [workshopData, mediaList] = await Promise.all([
    getWorkshopDetails(),
    getMedia(50),
  ]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
      <Header />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#581825] via-[#4A121E] to-[#36111B] text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>आनंद नगर, सिंहगड रोड, पुणे</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            संपर्क व स्टुडिओ पत्ता
          </h1>

          <p className="text-base sm:text-lg text-amber-200/90 leading-relaxed max-w-2xl mx-auto">
            वर्कशॉप नाव नोंदणी, बॅच तारखा, फी किंवा इतर कोणत्याही माहितीसाठी कधीही संपर्क करा.
          </p>
        </div>
      </section>

      {/* Contact Section Form & Details */}
      <ContactSection />

      {/* Footer & Floating CTAs */}
      <Footer />
      <WhatsAppButton />
      <WordPressSyncBadge mediaCount={mediaList.length} />
    </main>
  );
}
