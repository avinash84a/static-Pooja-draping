import {
  WPPage,
  WPPost,
  WPGalleryPost,
  WPMedia,
  WorkshopData,
  GalleryPhoto,
  DrapingStyleItem,
} from '../types/wordpress';

const DEFAULT_WP_API = 'https://avipatil.live/cmspooja/wp-json/wp/v2';
export const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://avipatil.live/cmspooja';
export const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || DEFAULT_WP_API;

/**
 * Generic WordPress REST API fetcher with Next.js ISR (Incremental Static Regeneration)
 */
export async function wpFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${WP_API}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    next: {
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API Error: ${response.status} ${response.statusText} at ${url}`);
  }

  return response.json();
}

/**
 * Fetch all published pages from WordPress
 */
export async function getPages(): Promise<WPPage[]> {
  try {
    return await wpFetch<WPPage[]>('/pages?status=publish&per_page=100');
  } catch (error) {
    console.warn('Error fetching WordPress pages:', error);
    return [];
  }
}

/**
 * Fetch a specific WordPress page by its slug
 */
export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const pages = await wpFetch<WPPage[]>(`/pages?slug=${encodeURIComponent(slug)}`);
    return pages && pages.length > 0 ? pages[0] : null;
  } catch (error) {
    console.warn(`Error fetching page with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Default fallback workshop data matching Pooja Saree Draping workshop specification
 */
export const DEFAULT_WORKSHOP_DATA: WorkshopData = {
  title: '1 डे साडी ड्रॅपिंग वर्कशॉप',
  subtitle: 'गौरी महालक्ष्मीच्या सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण',
  instructor: 'पूजा पाटील',
  description:
    'पुण्यातील सुप्रसिद्ध साडी ड्रॅपिंग आर्टिस्ट पूजा पाटील यांच्या मार्गदर्शनाखाली संपूर्ण प्रात्यक्षिकासह (Hands-on Practical) 14+ पारंपारिक व गौरी महालक्ष्मी साडी प्रकार शिका.',
  date: 'दर रविवारी नवीन बॅच (Upcoming Sunday)',
  time: 'सकाळी ११:०० ते सायंकाळी ५:००',
  location: 'सिंहगड रोड, आनंद नगर, पुणे',
  locationDetails: 'आनंद नगर बस स्टॉप जवळ, सिंहगड रोड, पुणे - ४११०५१',
  fees: 1500,
  advanceFee: 500,
  whatsappNumber: '8446917187',
  whatsappMessage: 'नमस्कार पूजा ताई, मला १ डे साडी ड्रॅपिंग वर्कशॉपसाठी नाव नोंदवायचे आहे. कृपया पुढील बॅचचे डिटेल्स द्या.',
  highlights: [
    '१४+ पारंपारिक व मॉडर्न साडी ड्रॅपिंग प्रकार',
    'उभी व बसलेली गौरी महालक्ष्मी साडी ड्रॅपिंग स्पेशल',
    'स्टेप-बाय-स्टेप वैयक्तिक प्रात्यक्षिक (Hands-on training)',
    'साडी पिन अप, फिक्सिंग व प्लेट्सच्या सोप्या ट्रिक्स',
    'वर्कशॉपनंतर घरबसल्या साडी नेसवण्याचा आत्मविश्वास',
    'प्रमाणपत्र व मोफत व्हिडिओ गाईड',
  ],
  patternsCount: '14-15 प्रकार',
  seatsLeft: 6,
  heroImage: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
  isFromWordPress: false,
};

/**
 * Fetch workshop details from WordPress page with slug 'workshop',
 * with automatic fallback if the page is not yet created.
 */
export async function getWorkshopDetails(): Promise<WorkshopData> {
  try {
    // 1. Try dedicated custom endpoint if plugin is active
    try {
      const customRes = await fetch(`${WP_URL}/wp-json/pooja/v1/workshop`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
      });
      if (customRes.ok) {
        const json = await customRes.json();
        const d = json?.data || json?.settings;
        if (d && (d.title || d.workshop_title)) {
          // Robust normalization of whatsappNumber and whatsappMessage
          let whatsappNumber = DEFAULT_WORKSHOP_DATA.whatsappNumber;
          let whatsappMessage = DEFAULT_WORKSHOP_DATA.whatsappMessage;
          if (typeof d.whatsapp === 'object' && d.whatsapp !== null) {
            if (d.whatsapp.number) whatsappNumber = String(d.whatsapp.number);
            if (d.whatsapp.message) whatsappMessage = String(d.whatsapp.message);
          } else if (typeof d.whatsapp === 'string' && d.whatsapp.trim()) {
            whatsappNumber = d.whatsapp.trim();
          } else if (d.whatsapp_number) {
            whatsappNumber = String(d.whatsapp_number);
          }
          if (d.whatsapp_message && typeof d.whatsapp_message === 'string') {
            whatsappMessage = d.whatsapp_message;
          }

          const rawHeroImg = d.heroImage || d.hero_image;
          const heroImage =
            typeof rawHeroImg === 'string' && rawHeroImg.trim() !== ''
              ? rawHeroImg.trim()
              : DEFAULT_WORKSHOP_DATA.heroImage;

          return {
            title: d.workshop_title || d.title || DEFAULT_WORKSHOP_DATA.title,
            subtitle: d.subtitle || DEFAULT_WORKSHOP_DATA.subtitle,
            instructor: d.instructor || 'पूजा पाटील',
            description: d.description || DEFAULT_WORKSHOP_DATA.description,
            date: d.default_date || d.date || DEFAULT_WORKSHOP_DATA.date,
            time: d.default_time || d.time || DEFAULT_WORKSHOP_DATA.time,
            location: d.address_short || d.location || DEFAULT_WORKSHOP_DATA.location,
            locationDetails: d.fullAddress || d.address_full || d.location_details || DEFAULT_WORKSHOP_DATA.locationDetails,
            fees: Number(d.fee || d.fees || DEFAULT_WORKSHOP_DATA.fees),
            advanceFee: Number(d.advanceFee || d.advance_fee || DEFAULT_WORKSHOP_DATA.advanceFee),
            whatsappNumber,
            whatsappMessage,
            highlights: Array.isArray(d.highlights) && d.highlights.length > 0 ? d.highlights : DEFAULT_WORKSHOP_DATA.highlights,
            patternsCount: d.patternCount || d.patterns_count || DEFAULT_WORKSHOP_DATA.patternsCount,
            seatsLeft: d.seatsAvailable !== undefined ? Number(d.seatsAvailable) : d.seats_left !== undefined ? Number(d.seats_left) : DEFAULT_WORKSHOP_DATA.seatsLeft,
            heroImage,
            isFromWordPress: true,
          };
        }
      }
    } catch {
      // Continue to fallback
    }

    // 2. Try standard WordPress page with slug 'workshop'
    const page = await getPageBySlug('workshop');
    if (!page) {
      return DEFAULT_WORKSHOP_DATA;
    }

    const acf = page.acf || {};
    const meta = page.meta || {};

    // Strip HTML tags for clean text snippets if needed
    const cleanContent = page.content?.rendered?.replace(/<[^>]+>/g, '').trim() || '';

    let acfWhatsappNumber = DEFAULT_WORKSHOP_DATA.whatsappNumber;
    let acfWhatsappMessage = DEFAULT_WORKSHOP_DATA.whatsappMessage;
    if (typeof acf.whatsapp === 'object' && acf.whatsapp !== null) {
      if (acf.whatsapp.number) acfWhatsappNumber = String(acf.whatsapp.number);
      if (acf.whatsapp.message) acfWhatsappMessage = String(acf.whatsapp.message);
    } else if (typeof acf.whatsapp_number === 'string' && acf.whatsapp_number.trim()) {
      acfWhatsappNumber = acf.whatsapp_number.trim();
    } else if (typeof acf.whatsapp === 'string' && acf.whatsapp.trim()) {
      acfWhatsappNumber = acf.whatsapp.trim();
    }
    if (typeof acf.whatsapp_message === 'string' && acf.whatsapp_message.trim()) {
      acfWhatsappMessage = acf.whatsapp_message.trim();
    }

    const rawAcfHero = acf.hero_image || acf.heroImage;
    const acfHeroImage =
      typeof rawAcfHero === 'string' && rawAcfHero.trim() !== ''
        ? rawAcfHero.trim()
        : DEFAULT_WORKSHOP_DATA.heroImage;

    return {
      title: page.title?.rendered || DEFAULT_WORKSHOP_DATA.title,
      subtitle: acf.subtitle || DEFAULT_WORKSHOP_DATA.subtitle,
      instructor: acf.instructor || 'पूजा पाटील',
      description: cleanContent || DEFAULT_WORKSHOP_DATA.description,
      date: acf.date || acf.workshop_date || DEFAULT_WORKSHOP_DATA.date,
      time: acf.time || acf.workshop_time || DEFAULT_WORKSHOP_DATA.time,
      location: acf.location || DEFAULT_WORKSHOP_DATA.location,
      locationDetails: acf.location_details || DEFAULT_WORKSHOP_DATA.locationDetails,
      fees: Number(acf.fees || acf.fee || DEFAULT_WORKSHOP_DATA.fees),
      advanceFee: Number(acf.advance_fee || DEFAULT_WORKSHOP_DATA.advanceFee),
      whatsappNumber: acfWhatsappNumber,
      whatsappMessage: acfWhatsappMessage,
      highlights: Array.isArray(acf.highlights) && acf.highlights.length > 0
        ? acf.highlights
        : DEFAULT_WORKSHOP_DATA.highlights,
      patternsCount: acf.patterns_count || DEFAULT_WORKSHOP_DATA.patternsCount,
      seatsLeft: acf.seats_left !== undefined ? Number(acf.seats_left) : DEFAULT_WORKSHOP_DATA.seatsLeft,
      heroImage: acfHeroImage,
      isFromWordPress: true,
    };
  } catch (error) {
    console.warn('Error fetching workshop details from WordPress:', error);
    return DEFAULT_WORKSHOP_DATA;
  }
}

/**
 * Fetch media from WordPress Media Library
 */
export async function getMedia(perPage: number = 50): Promise<WPMedia[]> {
  try {
    return await wpFetch<WPMedia[]>(`/media?per_page=${perPage}`);
  } catch (error) {
    console.warn('Error fetching WordPress media:', error);
    return [];
  }
}

/**
 * Fetch Custom Post Type 'gallery_posts' from WordPress
 */
export async function getGalleryPosts(): Promise<WPGalleryPost[]> {
  try {
    return await wpFetch<WPGalleryPost[]>('/gallery_posts?per_page=50');
  } catch (error) {
    console.warn('Error fetching gallery_posts:', error);
    return [];
  }
}

/**
 * High-quality fallback curated photos ensuring a rich experience
 */
const CURATED_FALLBACK_PHOTOS: GalleryPhoto[] = [
  {
    id: 'curated-1',
    title: 'उभी गौरी महालक्ष्मी साडी ड्रॅपिंग',
    subtitle: 'पारंपारिक सोन्याचे काठ व उठावदार पदर',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
    category: 'गौरी महालक्ष्मी',
    altText: 'उभी गौरी महालक्ष्मी साडी ड्रॅपिंग',
  },
  {
    id: 'curated-2',
    title: 'शाही पेशवाई नऊवारी काष्टा',
    subtitle: 'राजेशाही थाट व परफेक्ट ओच्या',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM-1.jpeg',
    category: 'नऊवारी',
    altText: 'शाही पेशवाई नऊवारी काष्टा',
  },
  {
    id: 'curated-3',
    title: 'बसलेली गौरी महालक्ष्मी बैठक ड्रेप',
    subtitle: 'चौरंग बैठक व सुबक आभूषण सेटिंग',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM-2.jpeg',
    category: 'गौरी महालक्ष्मी',
    altText: 'बसलेली गौरी महालक्ष्मी साडी ड्रॅपिंग',
  },
  {
    id: 'curated-4',
    title: 'रुक्मिणी पॅटर्न साडी ड्रेप',
    subtitle: 'उत्सवी सोहळ्यासाठी अत्यंत शोभिवंत प्रकार',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM.jpeg',
    category: 'डिझायनर',
    altText: 'रुक्मिणी पॅटर्न साडी ड्रेप',
  },
  {
    id: 'curated-5',
    title: 'ब्राह्मणी नऊवारी साडी ड्रॅपिंग',
    subtitle: 'सभ्य, आखीव-रेखीव व पारंपरिक पद्धत',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM-1.jpeg',
    category: 'नऊवारी',
    altText: 'ब्राह्मणी नऊवारी साडी ड्रॅपिंग',
  },
  {
    id: 'curated-6',
    title: 'कमल व कंबर पंखा प्लेट्स ड्रेप',
    subtitle: 'आधुनिक लग्नसोहळे व डोहाळे जेवण स्पेशल',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM-2.jpeg',
    category: 'डिझायनर',
    altText: 'कमल व कंबर पंखा प्लेट्स ड्रेप',
  },
  {
    id: 'curated-7',
    title: 'अप्सरा पॅटर्न ड्रेपिंग',
    subtitle: 'फ्लोई पदर व आकर्षक फ्रंट प्लीट्स',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.21-AM-1.jpeg',
    category: 'डिझायनर',
    altText: 'अप्सरा पॅटर्न साडी ड्रेपिंग',
  },
  {
    id: 'curated-8',
    title: 'कोल्हापुरी काष्टा नऊवारी',
    subtitle: 'पारंपारिक लढवय्या व डौलदार नऊवारी',
    imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.21-AM-2.jpeg',
    category: 'नऊवारी',
    altText: 'कोल्हापुरी काष्टा नऊवारी',
  },
];

/**
 * Fetch and process photos from WordPress Media Library & Gallery Posts
 */
export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const [mediaItems, galleryPosts] = await Promise.allSettled([
      getMedia(50),
      getGalleryPosts(),
    ]);

    const mediaList = mediaItems.status === 'fulfilled' ? mediaItems.value : [];
    const postsList = galleryPosts.status === 'fulfilled' ? galleryPosts.value : [];

    // Create a mapping from post ID to gallery post title
    const postMap = new Map<number, string>();
    for (const post of postsList) {
      postMap.set(post.id, post.title?.rendered || '');
    }

    if (mediaList.length === 0) {
      return CURATED_FALLBACK_PHOTOS;
    }

    const photos: GalleryPhoto[] = mediaList.map((item, index) => {
      // Decode unicode Marathi characters safely
      let rawTitle = item.title?.rendered || '';
      const sourceUrl = item.source_url || '';

      // Determine category based on attached post, folder path, or title
      let category = 'गौरी महालक्ष्मी';
      const attachedPostTitle = item.post ? postMap.get(item.post) : '';

      if (attachedPostTitle) {
        if (attachedPostTitle.includes('नऊवारी')) {
          category = 'नऊवारी';
        } else if (attachedPostTitle.includes('गौरी') || attachedPostTitle.includes('महालक्ष्मी')) {
          category = 'गौरी महालक्ष्मी';
        } else {
          category = attachedPostTitle;
        }
      } else if (sourceUrl.includes('नऊवारी') || sourceUrl.includes('%e0%a4%a8%e0%a4%8a%e0%a4%b5%e0%a4%be%e0%a4%b0%e0%a5%80')) {
        category = 'नऊवारी';
      } else if (sourceUrl.includes('गौरी') || sourceUrl.includes('%e0%a4%97%e0%a5%8c%e0%a4%b0%e0%a5%80')) {
        category = 'गौरी महालक्ष्मी';
      } else if (index % 3 === 0) {
        category = 'नऊवारी';
      } else if (index % 3 === 1) {
        category = 'गौरी महालक्ष्मी';
      } else {
        category = 'डिझायनर';
      }

      // Friendly Marathi titles if the file has a WhatsApp default name
      let displayTitle = rawTitle;
      let displaySubtitle = item.caption?.rendered?.replace(/<[^>]+>/g, '').trim() || '';

      if (!displayTitle || displayTitle.startsWith('WhatsApp Image') || displayTitle.startsWith('whatsapp-image')) {
        const titlePresets = [
          'गौरी महालक्ष्मी विशेष साडी ड्रॅपिंग',
          'पारंपारिक पेशवाई नऊवारी काष्टा',
          'बसलेली महालक्ष्मी चौरंग ड्रेप',
          'शाही रुक्मिणी पॅटर्न',
          'आकर्षक अप्सरा व कमल ड्रेप',
          'ब्राह्मणी नऊवारी सोहळा स्पेशल',
          'डबल पदर राजस्थानी ड्रेप',
          'कोल्हापुरी काष्टा नऊवारी ड्रेप',
        ];
        displayTitle = titlePresets[index % titlePresets.length];
        if (!displaySubtitle) {
          displaySubtitle = 'पूजा साडी ड्रॅपिंग, पुणे - प्रात्यक्षिक कार्यशाळा';
        }
      }

      const validImageUrl =
        typeof sourceUrl === 'string' && sourceUrl.trim() !== ''
          ? sourceUrl.trim()
          : CURATED_FALLBACK_PHOTOS[index % CURATED_FALLBACK_PHOTOS.length].imageUrl;

      const safeTitle = (typeof displayTitle === 'string' && displayTitle.trim() !== '') ? displayTitle.trim() : 'गौरी महालक्ष्मी साडी ड्रॅपिंग फोटो';
      const safeAltText = (typeof item.alt_text === 'string' && item.alt_text.trim() !== '') ? item.alt_text.trim() : safeTitle;

      return {
        id: item.id,
        title: safeTitle,
        subtitle: displaySubtitle || 'पूजा साडी ड्रॅपिंग पुणे',
        imageUrl: validImageUrl,
        category,
        altText: safeAltText,
        postId: item.post || undefined,
        date: item.date,
      };
    });

    return photos;
  } catch (error) {
    console.warn('Error fetching gallery photos:', error);
    return CURATED_FALLBACK_PHOTOS;
  }
}

/**
 * Fetch all standard blog posts from WordPress
 */
export async function getPosts(): Promise<WPPost[]> {
  try {
    return await wpFetch<WPPost[]>('/posts?status=publish&per_page=20');
  } catch (error) {
    console.warn('Error fetching WordPress posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by its slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const posts = await wpFetch<WPPost[]>(`/posts?slug=${encodeURIComponent(slug)}`);
    return posts && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.warn(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Check live connection health to the WordPress Headless CMS
 */
export async function getWordPressStatus(): Promise<{
  isOnline: boolean;
  totalMedia: number;
  totalPages: number;
  totalGalleryPosts: number;
  endpoint: string;
  error?: string;
}> {
  try {
    const [mediaRes, pagesRes, galleryPostsRes] = await Promise.allSettled([
      getMedia(100),
      getPages(),
      getGalleryPosts(),
    ]);

    const totalMedia = mediaRes.status === 'fulfilled' ? mediaRes.value.length : 0;
    const totalPages = pagesRes.status === 'fulfilled' ? pagesRes.value.length : 0;
    const totalGalleryPosts = galleryPostsRes.status === 'fulfilled' ? galleryPostsRes.value.length : 0;

    return {
      isOnline: true,
      totalMedia,
      totalPages,
      totalGalleryPosts,
      endpoint: WP_API,
    };
  } catch (error: any) {
    return {
      isOnline: false,
      totalMedia: 0,
      totalPages: 0,
      totalGalleryPosts: 0,
      endpoint: WP_API,
      error: error?.message || 'Connection failed',
    };
  }
}

/**
 * 14-15 Saree Draping Styles curated syllabus
 */
export function getDrapingStyles(): DrapingStyleItem[] {
  return [
    {
      id: 1,
      nameMarathi: 'उभी गौरी साडी ड्रॅपिंग',
      nameEnglish: 'Standing Gauri Pattern',
      category: 'Gauri',
      categoryLabel: 'गौरी महालक्ष्मी',
      description: 'गौरीच्या उभ्या मूर्तीवर किंवा स्टँडवर नेसवली जाणारी अत्यंत डौलदार व व्यवस्थित पिन-अप केलेली पारंपरिक पद्धत.',
      difficulty: 'Intermediate',
      duration: '३० मिनिटे',
      idealFor: 'गौरी गणपती उत्सव, घटस्थापना',
      palluType: 'लांब व दुहेरी पदर',
      pleatsCount: '७-८ रेखीव निऱ्या',
      keySteps: ['कमरपट्टी बेस तयार करणे', 'निऱ्यांची अचूक मांडणी', 'खांद्यावरील पदर लॉक करणे', 'आभूषणे फिक्सिंग'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
    },
    {
      id: 2,
      nameMarathi: 'बसलेली गौरी साडी ड्रॅपिंग',
      nameEnglish: 'Sitting Gauri Pattern',
      category: 'Gauri',
      categoryLabel: 'गौरी महालक्ष्मी',
      description: 'चौरंगावर किंवा पाटावर बसलेल्या गौरीच्या मूर्तीवर निऱ्यांचा पसरट व आकर्षक थाट बसवण्याची खास पद्धत.',
      difficulty: 'Intermediate',
      duration: '३५ मिनिटे',
      idealFor: 'चौरंग बैठक गौरी स्थापना',
      palluType: 'पंखा स्टाईल पदर',
      pleatsCount: 'पसरट गोल निऱ्या',
      keySteps: ['बैठक समतोल करणे', 'पुढील निऱ्या पंख्यासारख्या पसरवणे', 'कंबरबंद सेटिंग', 'दागिने व शेला सजवणे'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM-2.jpeg',
    },
    {
      id: 3,
      nameMarathi: 'शाही पेशवाई नऊवारी',
      nameEnglish: 'Peshwai Nauvari Pattern',
      category: 'Nauvari',
      categoryLabel: 'नऊवारी प्रकार',
      description: 'महाराष्ट्राच्या ऐतिहासिक संस्कृतीचे प्रतीक असलेली भव्य, उठावदार ओचा आणि डौलदार काष्टा असलेली नऊवारी.',
      difficulty: 'Advanced',
      duration: '२५ मिनिटे',
      idealFor: 'लग्न सोहळा, मुंज, मंगळागौर',
      palluType: 'शाही डावा पदर',
      pleatsCount: 'मोठ्या पेशवाई निऱ्या',
      keySteps: ['काष्टा काढणे', 'मध्यभागी ओचा खोचणे', 'मागील काष्टा खोचून पिन करणे', 'पायघोळ फिनिशिंग'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM-1.jpeg',
    },
    {
      id: 4,
      nameMarathi: 'ब्राह्मणी नऊवारी साडी',
      nameEnglish: 'Brahmani Nauvari Pattern',
      category: 'Nauvari',
      categoryLabel: 'नऊवारी प्रकार',
      description: 'अतिशय सुबक, चापूनचोपून बसणारी व धार्मिक विधीसाठी हवीच असणारी पारंपारिक ब्राह्मणी पद्धत.',
      difficulty: 'Intermediate',
      duration: '२० मिनिटे',
      idealFor: 'सत्यनारायण पूजा, धार्मिक विधी',
      palluType: 'पारंपारिक छातीवर घडी पदर',
      pleatsCount: 'बारीक ५-६ निऱ्या',
      keySteps: ['डावा पाय काष्टा', 'उजवा पाय वळसा', 'निऱ्यांची घडी व्यवस्थित खोचणे', 'पदर पिन करणे'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM-1.jpeg',
    },
    {
      id: 5,
      nameMarathi: 'रुक्मिणी पॅटर्न',
      nameEnglish: 'Rukmini Pattern',
      category: 'Traditional',
      categoryLabel: 'पारंपारिक',
      description: 'पंढरपूरच्या रुक्मिणी मातेच्या मूर्तीसारखी दोन्ही बाजूंनी समान निऱ्या व समतोल पदराची मनमोहक रचना.',
      difficulty: 'Intermediate',
      duration: '२५ मिनिटे',
      idealFor: 'देवी उत्सव, सांस्कृतिक कार्यक्रम',
      palluType: 'केंद्रीत डबल फॉल',
      pleatsCount: 'दोन बाजूंच्या निऱ्या',
      keySteps: ['मध्यभागातून विभाजन', 'उभय बाजूंच्या समतोल निऱ्या', 'सुरेख पदर घडी', 'कमरपट्टा संयोजन'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM.jpeg',
    },
    {
      id: 6,
      nameMarathi: 'कोल्हापुरी काष्टा',
      nameEnglish: 'Kolhapuri Kashta',
      category: 'Nauvari',
      categoryLabel: 'नऊवारी प्रकार',
      description: 'अंबाबाईच्या चरणी समर्पित आणि कोल्हापूरच्या वैशिष्ट्यपूर्ण रुबाबदार काष्टा शैलीची खास मांडणी.',
      difficulty: 'Advanced',
      duration: '२५ मिनिटे',
      idealFor: 'सण, पारंपरिक फोटोशूट',
      palluType: 'रुबाबदार टोकदार पदर',
      pleatsCount: 'कडक इस्त्री निऱ्या',
      keySteps: ['रुंद काष्टा तयार करणे', 'सुरेख गुडघ्याभोवती वळसा', 'कमरेवर घट्ट गाठ व खोच', 'पदर व्यवस्था'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.21-AM-2.jpeg',
    },
    {
      id: 7,
      nameMarathi: 'अप्सरा पॅटर्न',
      nameEnglish: 'Apsara Pattern',
      category: 'Designer',
      categoryLabel: 'डिझायनर प्रकार',
      description: 'कमरेभोवती नाजूक लहरी व समोरून सुंदर ड्रेप असलेला नृत्य व संगीत कार्यक्रमांसाठीचा प्रसिद्ध प्रकार.',
      difficulty: 'Intermediate',
      duration: '२० मिनिटे',
      idealFor: 'नृत्य, डोहाळे जेवण, संगीत संध्या',
      palluType: 'फ्लोटिंग डायगोनल पदर',
      pleatsCount: 'कर्वी लेअर्ड निऱ्या',
      keySteps: ['बॉडी हगिंग बेस', 'साइड कर्वेचर प्लेट्स', 'हाय-फ्लोट पदर सेटिंग', 'अॅक्सेंट पिनिंग'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.21-AM-1.jpeg',
    },
    {
      id: 8,
      nameMarathi: 'गोल साडी (राजस्थानी ड्रेप)',
      nameEnglish: 'Gol Saree / Seedha Palla',
      category: 'Traditional',
      categoryLabel: 'पारंपारिक',
      description: '६ वारी साडीवर गोल फेर मारून उजव्या खांद्यावरून समोर पदर काढण्याची अतिशय शालीन व सुटसुटीत पद्धत.',
      difficulty: 'Beginner',
      duration: '१५ मिनिटे',
      idealFor: 'गृहप्रवेश, कौटुंबिक समारंभ',
      palluType: 'समोरून पसरट सिधा पल्ला',
      pleatsCount: '८-१० गोल निऱ्या',
      keySteps: ['उजवीकडून गोल वळसा', 'मध्यभागी निऱ्यांची घडी', 'पाठीमागून पदर पुढे आणणे', 'उजव्या खांद्यावर पिन'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM-2.jpeg',
    },
    {
      id: 9,
      nameMarathi: 'डबल पदर साडी',
      nameEnglish: 'Double Padar Pattern',
      category: 'Designer',
      categoryLabel: 'डिझायनर प्रकार',
      description: 'दोन वेगवेगळ्या साड्यांचा किंवा एकाच साडीचा दुहेरी पदर काढून अप्रतिम रॉयल लूक देणारी अनोखी शैली.',
      difficulty: 'Advanced',
      duration: '३० मिनिटे',
      idealFor: 'वधू व नववधू सोहळा, रिसेप्शन',
      palluType: 'डबल लेयर पदर',
      pleatsCount: 'दोन थरांच्या निऱ्या',
      keySteps: ['प्राथमिक साडी नेसवणे', 'दुसरा पदर संयोजित करणे', 'दोन्ही खांद्यांवर बॅलन्स', 'ब्रोच पिनिंग'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
    },
    {
      id: 10,
      nameMarathi: 'मस्तानी नऊवारी काष्टा',
      nameEnglish: 'Mastani Nauvari Kashta',
      category: 'Nauvari',
      categoryLabel: 'नऊवारी प्रकार',
      description: 'बाजीराव मस्तानी चित्रपटातील मस्तानीच्या ड्रेपसारखी आकर्षक, चालताना पायाभोवती रुळणारी लांब नऊवारी.',
      difficulty: 'Advanced',
      duration: '३० मिनिटे',
      idealFor: 'रिसेप्शन, फॅशन शो, लग्नसोहळा',
      palluType: 'लांब फ्लोअर-टच पदर',
      pleatsCount: 'सैल व डौलदार ओचा',
      keySteps: ['लांब काष्टा मोजणे', 'घट्ट नॉट व ओचा तयार करणे', 'पदर फ्लोअर लेंथ ठेवणे', 'साईड ब्रोच लावणे'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM-1.jpeg',
    },
    {
      id: 11,
      nameMarathi: 'देवसेना पॅटर्न',
      nameEnglish: 'Devsena Pattern',
      category: 'Designer',
      categoryLabel: 'डिझायनर प्रकार',
      description: 'रॉयल बाहुबली लूक, ज्यामध्ये साडीचा पदर व निऱ्या दोन्ही खांद्यांवरून खाली सोडल्यासारखे भव्य दिसतात.',
      difficulty: 'Intermediate',
      duration: '२५ मिनिटे',
      idealFor: 'थीम पार्टी, शाही लग्न',
      palluType: 'केप स्टाईल पदर',
      pleatsCount: 'मध्यभागी मोठी बॉक्स प्लीट',
      keySteps: ['मध्यभागी बॉक्स प्लीट', 'पदराचे दोन भाग करणे', 'दोन्ही खांद्यांवर प्लेट्स बांधणे', 'कंबरपट्टीने फिक्स करणे'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM.jpeg',
    },
    {
      id: 12,
      nameMarathi: 'कमल पॅटर्न (Lotus Pleats)',
      nameEnglish: 'Kamal Pattern',
      category: 'Designer',
      categoryLabel: 'डिझायनर प्रकार',
      description: 'कमळाच्या पाकळ्यांप्रमाणे निऱ्यांची गोलाकार मांडणी करून तयार होणारा अत्यंत मोहक साडी प्रकार.',
      difficulty: 'Advanced',
      duration: '३० मिनिटे',
      idealFor: 'डोहळे जेवण, बेबी शॉवर, साखरपुडा',
      palluType: 'शॉर्ट स्लीव्ह पदर',
      pleatsCount: 'पाकळीसारख्या लेअर्स',
      keySteps: ['निऱ्यांचे पाकळी आकारात फोल्डिंग', 'सुरक्षित सूक्ष्म पिनिंग', 'कमरेवर पाकळ्यांची गोलाकार मांडणी', 'स्प्रे फिक्सिंग'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.20-AM-2.jpeg',
    },
    {
      id: 13,
      nameMarathi: 'कंबर पंखा पॅटर्न',
      nameEnglish: 'Kamar Pankha Pleats',
      category: 'Designer',
      categoryLabel: 'डिझायनर प्रकार',
      description: 'कमरेच्या डाव्या किंवा उजव्या बाजूला सुंदर हँड फॅन (पंखा) सारख्या निऱ्या तयार करून कमरपट्टा लावणे.',
      difficulty: 'Intermediate',
      duration: '२० मिनिटे',
      idealFor: 'एंगेजमेंट, कॉकटेल, रिसेप्शन',
      palluType: 'स्लीक प्लीटेड पदर',
      pleatsCount: 'फॅन शेप प्लीट्स',
      keySteps: ['उरलेल्या साडीतून पंखा बनवणे', 'कमरेच्या बाजूला फॅन खोचणे', 'कमरपट्ट्याने लॉक करणे', 'अंतिम फिनिशिंग'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.21-AM-1.jpeg',
    },
    {
      id: 14,
      nameMarathi: 'काठाची डिझायनर साडी',
      nameEnglish: 'Border Silhouette Draping',
      category: 'Designer',
      categoryLabel: 'डिझायनर प्रकार',
      description: 'जरी काठ आणि हेवी बॉर्डर उठावदार दिसण्यासाठी खास आधुनिक पद्धतीने केलेली प्लीटिंग व पिनिंग.',
      difficulty: 'Beginner',
      duration: '१५ मिनिटे',
      idealFor: 'सणवार, पार्टी, कौटुंबिक समारंभ',
      palluType: 'हायलाइट बॉर्डर पदर',
      pleatsCount: '६-८ सुटसुटीत निऱ्या',
      keySteps: ['बॉर्डर अलाइन करणे', 'निऱ्यांची उंची मोजणे', 'पदर हायलाइट करणे', 'कम्फर्ट पिनिंग'],
      imageUrl: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.21-AM-2.jpeg',
    },
  ];
}

/**
 * Fetch Draping Styles dynamically from WordPress REST API
 * (Falls back to default curated 14 styles if WordPress hasn't seeded them yet)
 */
export async function getDrapingStylesAsync(): Promise<DrapingStyleItem[]> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/pooja/v1/styles`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch styles from WordPress API, using defaults:', err);
  }
  return getDrapingStyles();
}

/**
 * Fetch Workshop Batches dynamically from WordPress REST API
 */
export async function getBatchesAsync(): Promise<any[]> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/pooja/v1/batches`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch batches from WordPress API:', err);
  }
  return [];
}

/**
 * Fetch Student Reviews dynamically from WordPress REST API
 */
export async function getReviewsAsync(): Promise<any[]> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/pooja/v1/reviews`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch reviews from WordPress API:', err);
  }
  return [];
}

/**
 * Send inquiry / booking lead directly to WordPress Backend Admin Panel
 */
export async function submitInquiryToWordPress(lead: {
  name: string;
  phone: string;
  workshopType?: string;
  participants?: string;
  message?: string;
}): Promise<{ success: boolean; lead_id?: number; message?: string }> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/pooja/v1/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(lead),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not submit inquiry to WordPress:', err);
  }
  return { success: false };
}

