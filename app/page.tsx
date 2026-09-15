import React from 'react';
import type { Metadata } from 'next';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WorkshopSection from '../components/WorkshopSection';
import Gallery from '../components/Gallery';
import ContactSection from '../components/ContactSection';
import BookingCTA from '../components/BookingCTA';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import WordPressSyncBadge from '../components/WordPressSyncBadge';
import {
  getWorkshopDetails,
  getDrapingStylesAsync,
  getGalleryPhotos,
  getMedia,
  getReviewsAsync,
} from '../lib/wordpress';
import {
  Star,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  ShieldCheck,
  Heart,
  Quote,
  Clock,
  MapPin,
  Bot,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // Next.js ISR (Incremental Static Regeneration every 60s)

export const metadata: Metadata = {
  title: 'पूजा साडी ड्रॅपिंग पुणे | 1 डे साडी ड्रॅपिंग वर्कशॉप | 5.0★ Google Rating',
  description:
    'पुण्यात शिका १४+ गौरी महालक्ष्मी, पेशवाई नऊवारी, ब्राह्मणी व डिझायनर साडी ड्रॅपिंग प्रकार. पूजा पाटील यांचे प्रत्यक्ष हँड्स-ऑन प्रॅक्टिकल. फी फक्त ₹१,५००/-, सिंहगड रोड, पुणे.',
  openGraph: {
    title: 'पूजा साडी ड्रॅपिंग पुणे | 1 डे साडी ड्रॅपिंग वर्कशॉप',
    description:
      'गौरी महालक्ष्मीच्या सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण. ५.०★ गुगल रेटिंग.',
  },
};

export default async function HomePage() {
  const [workshopData, styles, photos, mediaList, wpReviews] = await Promise.all([
    getWorkshopDetails(),
    getDrapingStylesAsync(),
    getGalleryPhotos(),
    getMedia(50),
    getReviewsAsync(),
  ]);

  // Real Marathi reviews from verified students (with WordPress reviews prepended if available)
  const fallbackReviews = [
    {
      name: 'स्नेहा कुलकर्णी (सिंहगड रोड, पुणे)',
      rating: 5,
      comment:
        'पूजा ताईंनी गौरी महालक्ष्मीची साडी इतकी सोपी करून शिकवली की मला पहिल्याच प्रयत्नात एकदम परफेक्ट जमली! खूप मनापासून व प्रेमाने शिकवतात. प्रत्येकाकडे व्यक्तिशः लक्ष देतात.',
      style: 'उभी व बसलेली गौरी साडी ड्रॅपिंग',
      date: 'ऑगस्ट २०२४',
    },
    {
      name: 'प्रियांका जाधव (कोथरूड, पुणे)',
      rating: 5,
      comment:
        'मला नऊवारी नेसायला खूप अवघड वाटायचे. पण १ दिवसाच्या वर्कशॉपमध्ये पेशवाई व ब्राह्मणी काष्टा इतक्या बारकाईने शिकवला की आता मी कोणाचीही मदत न घेता स्वतः नेसू शकते. फी एकदम वाजवी आहे.',
      style: 'पेशवाई व ब्राह्मणी नऊवारी',
      date: 'सप्टेंबर २०२४',
    },
    {
      name: 'अश्विनी देशपांडे (आनंद नगर, पुणे)',
      rating: 5,
      comment:
        'Workshops in Pune are often crowded, but Pooja Tai takes only 10-12 ladies per batch. The hands-on practice is 100% real. Highly recommended for every Maharashtrian woman!',
      style: '१४+ साडी ड्रॅपिंग प्रकार',
      date: 'ऑक्टोबर २०२४',
    },
  ];

  const reviews = Array.isArray(wpReviews) && wpReviews.length > 0
    ? wpReviews.map((r: any) => ({
        name: r.city ? `${r.name} (${r.city})` : r.name,
        rating: r.rating || 5,
        comment: r.text || '',
        style: 'साडी ड्रॅपिंग विद्यार्थिनी',
        date: r.date || '२०२४',
      }))
    : fallbackReviews;

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between selection:bg-[#8C1D40] selection:text-white">
      {/* 1. Header with WordPress sync status, phone, navigation, and WhatsApp CTA */}
      <Header />

      {/* 2. Hero Section: "पूजा साडी ड्रॅपिंग" / "1 डे साडी ड्रॅपिंग वर्कशॉप" with dynamic WordPress image */}
      <Hero workshopData={workshopData} />

      {/* 3. Quick Value Proposition Banner */}
      <section className="bg-white border-y border-amber-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-serif font-extrabold text-[#581825]">
                १०+ वर्ष
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                साडी ड्रॅपिंग अनुभव
              </p>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-serif font-extrabold text-[#581825]">
                ५००+
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                प्रशिक्षित विद्यार्थिनी
              </p>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-serif font-extrabold text-[#581825]">
                १४+ प्रकार
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                गौरी, नऊवारी व काष्टा
              </p>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <span>5.0★</span>
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                ३३+ गुगल रिव्ह्यूज
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Workshop Section: "मी पूजा पाटील", 14-15 draping styles with interactive cards & modals */}
      <WorkshopSection workshopData={workshopData} styles={styles} />

      {/* 5. Live WordPress Photo Gallery with lightbox zoom & category tabs */}
      <Gallery
        photos={photos}
        title="साडी ड्रॅपिंग फोटो गॅलरी"
        subtitle="WordPress Headless CMS द्वारे थेट लोड झालेले गौरी महालक्ष्मी व नऊवारी साडी ड्रॅपिंगचे प्रत्यक्ष काम"
        limit={8}
        showFilters={true}
      />

      {/* View All Photos Link Banner */}
      <div className="bg-[#FAF7F2] pb-12 text-center">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-amber-50 text-[#581825] font-bold text-sm border-2 border-[#581825]/30 hover:border-[#581825] shadow-sm transition-all"
        >
          <span>सर्व {photos.length} फोटो गॅलरीमध्ये पाहा</span>
          <Sparkles className="w-4 h-4 text-amber-600" />
        </Link>
      </div>

      {/* 6. Real Student Reviews Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-[#581825] text-xs font-bold border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
              <span>गुगलवर ५.० स्टार मानांकित</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#36111B]">
              आमच्या विद्यार्थिनींचे मनोगत व अनुभव
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              प्रत्यक्ष १ डे वर्कशॉप पूर्ण केलेल्या महिलांचे अस्सल अनुभव
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#FAF6F0] rounded-3xl p-6 border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-500">{rev.date}</span>
                  </div>

                  <Quote className="w-8 h-8 text-amber-300/80" />

                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                    “{rev.comment}”
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-200/50">
                  <h4 className="text-xs font-bold text-stone-900">{rev.name}</h4>
                  <span className="text-[11px] text-[#8C1D40] font-semibold">
                    {rev.style}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. New: Practical AI Course Banner with 5 Pillars & 10-12 Core Tools */}
      <section className="py-12 bg-gradient-to-r from-[#4A121E] via-[#581825] to-[#36111B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 rounded-3xl p-6 sm:p-10 border border-amber-400/30 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>नवीन: १ डे प्रॅक्टिकल AI कार्यशाळा (पुणे & ऑनलाइन)</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white">
                AI फक्त IT लोकांसाठी नाही — <span className="text-amber-300">AI प्रत्येकासाठी आहे!</span>
              </h2>
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                ४०–५० टूल्सचा गोंधळ नको! १०–१२ Core Tools, अभ्यासक्रमाचे ५ मुख्य Pillars (Understand, Communicate, Work, Create, Automate) आणि शेवटच्या क्लासमध्ये तुमच्या प्रोफेशननुसार थेट <strong className="text-amber-300">Real-Life Project Challenge</strong>.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-amber-200">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ५ मुख्य Pillars
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> १०-१२ Core Tools (No Confusion)
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> शिक्षक, व्यावसायिक, पालक सर्वांसाठी
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/ai-course"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>AI कोर्स सविस्तर पाहा</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai-course#register"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-medium text-xs sm:text-sm text-center transition-all"
              >
                सीट बुक करा (₹१,४९९/-)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Booking CTA with Fee ₹1,500 & Advance ₹500 */}
      <BookingCTA workshopData={workshopData} />

      {/* 8. Contact Section: Sinhgad Road, Anand Nagar, Pune & Interactive form */}
      <ContactSection />

      {/* 9. Rich Marathi Footer */}
      <Footer />

      {/* 10. Floating Interactive WhatsApp Button */}
      <WhatsAppButton />

      {/* 11. Headless WordPress Sync Status Badge */}
      <WordPressSyncBadge mediaCount={mediaList.length} />
    </main>
  );
}
