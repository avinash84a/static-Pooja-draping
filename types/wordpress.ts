export interface WPRenderedString {
  rendered: string;
}

export interface WPMediaDetails {
  width?: number;
  height?: number;
  file?: string;
  filesize?: number;
  sizes?: Record<string, {
    file: string;
    width: number;
    height: number;
    mime_type: string;
    source_url: string;
  }>;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRenderedString;
  author: number;
  caption: WPRenderedString;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details?: WPMediaDetails;
  post?: number | null;
  source_url: string;
  description?: WPRenderedString;
}

export interface WPPage {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRenderedString;
  content: WPRenderedString;
  excerpt: WPRenderedString;
  featured_media?: number;
  acf?: Record<string, any>;
  meta?: Record<string, any>;
}

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRenderedString;
  content: WPRenderedString;
  excerpt: WPRenderedString;
  featured_media?: number;
  categories?: number[];
  tags?: number[];
  acf?: Record<string, any>;
}

export interface WPGalleryPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRenderedString;
  content: WPRenderedString;
  featured_media?: number;
  acf?: Record<string, any>;
}

export interface WorkshopData {
  title: string;
  subtitle: string;
  instructor: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationDetails: string;
  fees: number;
  advanceFee: number;
  whatsappNumber: string;
  whatsappMessage: string;
  highlights: string[];
  patternsCount: string;
  seatsLeft?: number;
  heroImage?: string;
  isFromWordPress: boolean;
}

export interface GalleryPhoto {
  id: string | number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  category: string;
  altText: string;
  postId?: number;
  date?: string;
}

export interface DrapingStyleItem {
  id: number | string;
  nameMarathi: string;
  nameEnglish: string;
  category: 'Gauri' | 'Nauvari' | 'Traditional' | 'Designer';
  categoryLabel: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  idealFor: string;
  palluType: string;
  pleatsCount: string;
  keySteps: string[];
  imageUrl: string;
}
