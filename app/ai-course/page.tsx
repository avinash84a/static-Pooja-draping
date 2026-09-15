import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AICourseSection from '../../components/AICourseSection';
import WhatsAppButton from '../../components/WhatsAppButton';
import WordPressSyncBadge from '../../components/WordPressSyncBadge';
import { getMedia } from '../../lib/wordpress';

export const metadata: Metadata = {
  title: '१ डे AI कार्यशाळा (Basic to Advanced) | मराठी & हिंदी AI Course',
  description:
    'AI फक्त IT लोकांसाठी नाही — AI प्रत्येकासाठी आहे! लहान व्यावसायिक, विद्यार्थी, पालक, गायक-संगीतकार, सोसायटी चेअरमन व मॅनेजर्ससाठी १ दिवसाची प्रत्यक्ष AI कार्यशाळा.',
  openGraph: {
    title: '१ डे AI कार्यशाळा (Basic to Advanced) | मराठी & हिंदी AI Course',
    description:
      'AI प्रत्येकासाठी आहे! लहान व्यावसायिक, विद्यार्थी, पालक, गायक-संगीतकार, सोसायटी चेअरमन व मॅनेजर्ससाठी १ दिवसाची प्रत्यक्ष AI कार्यशाळा.',
  },
};

export default async function AICoursePage() {
  const mediaList = await getMedia(20).catch(() => []);

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
      <Header />
      <AICourseSection />
      <Footer />
      <WhatsAppButton />
      <WordPressSyncBadge mediaCount={mediaList.length} />
    </main>
  );
}
