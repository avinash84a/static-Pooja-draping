import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pooja Saree Draping Pune | 5.0★ Saree Draping Workshop & Training',
  description: 'Professional saree draping classes and workshops in Sinhgad Road, Anand Nagar, Pune by Pooja Patil. Learn 14+ Gauri Mahalakshmi, Nauvari & festive draping styles with practical training. 5.0★ Google Rated with 33 Reviews.',
  keywords: [
    'Pooja Saree Draping Pune',
    'Saree Draping Classes Pune',
    'Saree Draping Workshop Pune',
    'Saree Draping Course Pune',
    'Gauri Saree Draping Pune',
    'Maharashtrian Saree Draping Pune',
    'Nauvari Saree Draping Pune',
    'Saree Draping Training Pune',
    'Saree Draping Classes Sinhgad Road',
    'Saree Draping Classes Anand Nagar Pune'
  ],
  authors: [{name: 'Pooja Patil', url: 'https://poojasareedrapingpune.com'}],
  creator: 'Pooja Saree Draping Pune',
  publisher: 'Pooja Saree Draping Pune',
  formatDetection: {
    telephone: true,
    address: true,
    email: false,
  },
  openGraph: {
    title: 'Pooja Saree Draping Pune | 5.0★ Saree Draping Workshop & Training',
    description: 'Learn 14+ Gauri Mahalakshmi, Nauvari & Designer Saree Draping Styles with Hands-On Practical Training in Pune. 5.0 Google Rating with 33 Student Reviews.',
    type: 'website',
    locale: 'mr_IN',
    siteName: 'Pooja Saree Draping Pune',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pooja Saree Draping Pune | 5.0★ Saree Draping Workshop',
    description: 'Professional saree draping classes and workshops in Sinhgad Road, Anand Nagar, Pune by Pooja Patil.',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Pooja Saree Draping Pune',
  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  '@id': 'https://poojasareedrapingpune.com',
  url: 'https://poojasareedrapingpune.com',
  telephone: '+918446917187',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Saiprabha House, Opposite Jagtap Hospital, Sinhgad Road, Nandadeep Society, Anand Nagar',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    postalCode: '411051',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 18.4735,
    longitude: 73.8185,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '33',
    bestRating: '5',
    worstRating: '1',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="mr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#FAF7F2] text-[#2C2220] antialiased selection:bg-[#B8405E] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
