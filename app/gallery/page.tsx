import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Gallery from '../../components/Gallery';
import BookingCTA from '../../components/BookingCTA';
import WhatsAppButton from '../../components/WhatsAppButton';
import WordPressSyncBadge from '../../components/WordPressSyncBadge';
import { getGalleryPhotos, getWorkshopDetails, getMedia } from '../../lib/wordpress';
import { Sparkles, Camera, Image as ImageIcon } from 'lucide-react';

export const revalidate = 60; // Next.js ISR (Incremental Static Regeneration)

export const metadata: Metadata = {
  title: 'साडी ड्रॅपिंग फोटो गॅलरी | पूजा साडी ड्रॅपिंग पुणे',
  description:
    'गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी काष्टा व डिझायनर साडी ड्रॅपिंगचे सुंदर फोटो आणि विद्यार्थिनींचे प्रात्यक्षिक पाहा.',
  openGraph: {
    title: 'साडी ड्रॅपिंग फोटो गॅलरी | पूजा साडी ड्रॅपिंग पुणे',
    description:
      'गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी काष्टा व डिझायनर साडी ड्रॅपिंगचे सुंदर फोटो.',
  },
};

export default async function GalleryPage() {
  const [photos, workshopData, mediaList] = await Promise.all([
    getGalleryPhotos(),
    getWorkshopDetails(),
    getMedia(50),
  ]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
      <Header />

      {/* Gallery Page Banner */}
      <section className="bg-gradient-to-b from-[#581825] via-[#4A121E] to-[#36111B] text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
            <Camera className="w-3.5 h-3.5" />
            <span>WordPress CMS Live Photo Gallery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            साडी ड्रॅपिंग फोटो गॅलरी
          </h1>

          <p className="text-base sm:text-lg text-amber-200/90 max-w-2xl mx-auto leading-relaxed">
            पूजा साडी ड्रॅपिंग वर्कशॉपमधील गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी काष्टा आणि विद्यार्थिनींनी स्वतः नेसवलेल्या साड्यांचे फोटो.
          </p>

          <p className="text-xs text-[#E0CDD0]">
            (एकूण {photos.length} फोटो WordPress Media द्वारे थेट लोड केले आहेत)
          </p>
        </div>
      </section>

      {/* Main Interactive Gallery */}
      <div className="py-6">
        <Gallery
          photos={photos}
          title="आमचे साडी ड्रॅपिंग काम व विद्यार्थिनींचे रिझल्ट"
          subtitle="कोणत्याही फोटोवर क्लिक करून तो मोठा करून पाहा अथवा त्या प्रकाराबद्दल थेट WhatsApp वर विचारा."
          showFilters={true}
        />
      </div>

      {/* Booking CTA Section */}
      <BookingCTA workshopData={workshopData} />

      {/* Footer & Floating CTAs */}
      <Footer />
      <WhatsAppButton />
      <WordPressSyncBadge mediaCount={mediaList.length} />
    </main>
  );
}
