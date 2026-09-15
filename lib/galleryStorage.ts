/**
 * Reliable Multi-Tier Storage, Server-Sync & Image Compression
 * for Pooja Saree Draping Pune.
 *
 * Tier 1: Server-Side API (/api/site-data) - Shared across all devices, browsers & visitors
 * Tier 2: Browser IndexedDB - High-capacity client-side offline storage
 * Tier 3: Browser LocalStorage - Instant synchronous hydration
 * Tier 4: In-Memory Cache - Instant cross-component rendering
 * + HTML5 Canvas Image Compression (~80-120KB optimized Web images)
 */

import businessData from '../data/business-data.json';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryMarathi?: string;
  image: string;
  isCustom?: boolean;
}

export interface WorkshopConfig {
  title: string;
  instructor: string;
  training: string;
  suitableFor: string;
  nextDate: string;
  time: string;
  fee: string;
  seatsLeft: string;
  venue: string;
}

export interface BookingLead {
  id: string;
  name: string;
  phone: string;
  workshopType: string;
  participants: string;
  message?: string;
  date: string;
  status: 'new' | 'contacted' | 'confirmed';
}

export const DEFAULT_WORKSHOP_CONFIG: WorkshopConfig = {
  title: '1 डे साडी ड्रॅपिंग वर्कशॉप',
  instructor: 'पूजा पाटील',
  training: 'गौरी महालक्ष्मीच्या 14 ते 15 सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण',
  suitableFor: 'उभारलेल्या तसेच बसलेल्या गौरीसाठी आणि सणांसारख्या विशेष प्रसंगांसाठी',
  nextDate: 'आगामी शनिवार / रविवार (Upcoming Weekend)',
  time: 'सकाळी 10:30 ते संध्याकाळी 5:30 (पूर्ण 1 दिवस)',
  fee: '₹1,999/- फक्त',
  seatsLeft: 'फक्त 8 ते 10 जागा (वैयक्तिक लक्ष देण्यासाठी मर्यादित बॅच)',
  venue: 'साईप्रभा हाऊस, जगताप हॉस्पिटल समोर, सिंहगड रोड, आनंद नगर, पुणे - 411051',
};

const DB_NAME = 'PoojaSareeDrapingDB';
const DB_VERSION = 2;
const STORE_NAME = 'siteData';
const GALLERY_KEY = 'pooja_saree_gallery_items_v2';
const STYLES_KEY = 'pooja_custom_style_images';
const WORKSHOP_KEY = 'pooja_workshop_config';
const LEADS_KEY = 'pooja_workshop_bookings';

// In-memory cache for fast reactivity within the current session
let memoryGalleryCache: GalleryItem[] | null = null;
let memoryStylesCache: Record<number | string, string> | null = null;
let memoryWorkshopCache: WorkshopConfig | null = null;
let memoryLeadsCache: BookingLead[] | null = null;

/**
 * Open IndexedDB safely
 */
function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Get item from IndexedDB
 */
export async function getFromIDB<T>(key: string): Promise<T | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Save item to IndexedDB
 */
export async function saveToIDB<T>(key: string, value: T): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Compress an uploaded image file or base64 string using Canvas.
 * Drops heavy 4-10MB mobile camera photos down to crisp ~80-120KB images.
 */
export async function compressImageFile(
  fileOrDataUrl: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  if (typeof window === 'undefined') return '';

  return new Promise((resolve) => {
    const processImg = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within maxWidth/maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };

    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('data:image/')) {
        processImg(fileOrDataUrl);
      } else {
        resolve(fileOrDataUrl);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        processImg(result);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/* =========================================================================
   SERVER SYNC HELPERS
   ========================================================================= */

async function fetchServerSiteData(): Promise<any | null> {
  try {
    const res = await fetch('/api/site-data', {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // offline or error
  }
  return null;
}

async function postServerSiteData(payload: Record<string, any>): Promise<any | null> {
  try {
    const res = await fetch('/api/site-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Server sync offline, cached locally:', err);
  }
  return null;
}

/* =========================================================================
   1. FULL SITE DATA
   ========================================================================= */

export async function loadFullSiteDataAsync(): Promise<{
  workshopConfig: WorkshopConfig;
  galleryItems: GalleryItem[];
  styleImages: Record<string | number, string>;
  leads: BookingLead[];
}> {
  // 1. Try server
  const serverData = await fetchServerSiteData();
  if (serverData) {
    if (serverData.workshopConfig) {
      memoryWorkshopCache = serverData.workshopConfig;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(WORKSHOP_KEY, JSON.stringify(serverData.workshopConfig)); } catch {}
        saveToIDB(WORKSHOP_KEY, serverData.workshopConfig);
      }
    }
    if (Array.isArray(serverData.galleryItems) && serverData.galleryItems.length > 0) {
      memoryGalleryCache = serverData.galleryItems;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(GALLERY_KEY, JSON.stringify(serverData.galleryItems)); } catch {}
        saveToIDB(GALLERY_KEY, serverData.galleryItems);
      }
    }
    if (serverData.styleImages) {
      memoryStylesCache = serverData.styleImages;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(STYLES_KEY, JSON.stringify(serverData.styleImages)); } catch {}
        saveToIDB(STYLES_KEY, serverData.styleImages);
      }
    }
    if (Array.isArray(serverData.leads)) {
      memoryLeadsCache = serverData.leads;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(LEADS_KEY, JSON.stringify(serverData.leads)); } catch {}
        saveToIDB(LEADS_KEY, serverData.leads);
      }
    }

    return {
      workshopConfig: serverData.workshopConfig || DEFAULT_WORKSHOP_CONFIG,
      galleryItems: serverData.galleryItems || (businessData.galleryItems as GalleryItem[]),
      styleImages: serverData.styleImages || {},
      leads: serverData.leads || [],
    };
  }

  // 2. Fallback to local
  const [gallery, styles, workshop, leads] = await Promise.all([
    loadGalleryAsync(),
    loadStylesAsync(),
    loadWorkshopConfigAsync(),
    loadLeadsAsync(),
  ]);

  return {
    workshopConfig: workshop,
    galleryItems: gallery,
    styleImages: styles,
    leads,
  };
}

/* =========================================================================
   2. GALLERY ITEMS
   ========================================================================= */

export function getInitialGallery(): GalleryItem[] {
  if (memoryGalleryCache && memoryGalleryCache.length > 0) {
    return memoryGalleryCache;
  }
  if (typeof window === 'undefined') {
    return businessData.galleryItems as GalleryItem[];
  }
  try {
    const saved = localStorage.getItem(GALLERY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryGalleryCache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return businessData.galleryItems as GalleryItem[];
}

export async function loadGalleryAsync(): Promise<GalleryItem[]> {
  // 1. Try Server API first for cross-device consistency
  const serverData = await fetchServerSiteData();
  if (serverData && Array.isArray(serverData.galleryItems) && serverData.galleryItems.length > 0) {
    memoryGalleryCache = serverData.galleryItems;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(GALLERY_KEY, JSON.stringify(serverData.galleryItems)); } catch {}
      saveToIDB(GALLERY_KEY, serverData.galleryItems);
    }
    return serverData.galleryItems;
  }

  // 2. Try IndexedDB
  try {
    const idbData = await getFromIDB<GalleryItem[]>(GALLERY_KEY);
    if (idbData && Array.isArray(idbData) && idbData.length > 0) {
      memoryGalleryCache = idbData;
      return idbData;
    }
  } catch {
    // ignore
  }

  // 3. Try LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(GALLERY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryGalleryCache = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  const defaults = businessData.galleryItems as GalleryItem[];
  memoryGalleryCache = defaults;
  return defaults;
}

export async function saveGalleryAsync(items: GalleryItem[]): Promise<boolean> {
  memoryGalleryCache = items;

  // 1. Save to Server
  postServerSiteData({ galleryItems: items });

  // 2. Save to IndexedDB
  await saveToIDB(GALLERY_KEY, items);

  // 3. Save to LocalStorage & broadcast
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    } catch {
      console.warn('LocalStorage full, saved in Server & IndexedDB');
    }

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_gallery_updated', {
          detail: items,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}

/* =========================================================================
   3. SAREE STYLES PHOTOS
   ========================================================================= */

export function getInitialStyles(): Record<number | string, string> {
  if (memoryStylesCache) return memoryStylesCache;
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STYLES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      memoryStylesCache = parsed;
      return parsed;
    }
  } catch {
    // ignore
  }
  return {};
}

export async function loadStylesAsync(): Promise<Record<number | string, string>> {
  // 1. Try server
  const serverData = await fetchServerSiteData();
  if (serverData && serverData.styleImages) {
    memoryStylesCache = serverData.styleImages;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STYLES_KEY, JSON.stringify(serverData.styleImages)); } catch {}
      saveToIDB(STYLES_KEY, serverData.styleImages);
    }
    return serverData.styleImages;
  }

  // 2. Try IndexedDB
  try {
    const idbData = await getFromIDB<Record<number | string, string>>(STYLES_KEY);
    if (idbData && typeof idbData === 'object') {
      memoryStylesCache = idbData;
      return idbData;
    }
  } catch {
    // ignore
  }

  // 3. Try LocalStorage
  const local = getInitialStyles();
  return local;
}

export async function saveStylesAsync(styles: Record<number | string, string>): Promise<boolean> {
  memoryStylesCache = styles;

  // 1. Save to Server
  postServerSiteData({ styleImages: styles });

  // 2. Save to IndexedDB
  await saveToIDB(STYLES_KEY, styles);

  // 3. Save to LocalStorage & broadcast
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STYLES_KEY, JSON.stringify(styles));
    } catch {
      console.warn('LocalStorage full, saved in Server & IndexedDB');
    }

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_styles_updated', {
          detail: styles,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}

/* =========================================================================
   4. WORKSHOP CONFIG
   ========================================================================= */

export function getInitialWorkshopConfig(): WorkshopConfig {
  if (memoryWorkshopCache) return memoryWorkshopCache;
  if (typeof window === 'undefined') return DEFAULT_WORKSHOP_CONFIG;
  try {
    const saved = localStorage.getItem(WORKSHOP_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged: WorkshopConfig = { ...DEFAULT_WORKSHOP_CONFIG, ...parsed };
      memoryWorkshopCache = merged;
      return merged;
    }
  } catch {
    // ignore
  }
  return DEFAULT_WORKSHOP_CONFIG;
}

export async function loadWorkshopConfigAsync(): Promise<WorkshopConfig> {
  // 1. Try server
  const serverData = await fetchServerSiteData();
  if (serverData && serverData.workshopConfig) {
    const merged = { ...DEFAULT_WORKSHOP_CONFIG, ...serverData.workshopConfig };
    memoryWorkshopCache = merged;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(WORKSHOP_KEY, JSON.stringify(merged)); } catch {}
      saveToIDB(WORKSHOP_KEY, merged);
    }
    return merged;
  }

  // 2. Try IndexedDB
  try {
    const idbData = await getFromIDB<WorkshopConfig>(WORKSHOP_KEY);
    if (idbData && typeof idbData === 'object') {
      const merged = { ...DEFAULT_WORKSHOP_CONFIG, ...idbData };
      memoryWorkshopCache = merged;
      return merged;
    }
  } catch {
    // ignore
  }

  // 3. Try LocalStorage
  return getInitialWorkshopConfig();
}

export async function saveWorkshopConfigAsync(config: WorkshopConfig): Promise<boolean> {
  memoryWorkshopCache = config;

  // 1. Save to Server
  postServerSiteData({ workshopConfig: config });

  // 2. Save to IndexedDB
  await saveToIDB(WORKSHOP_KEY, config);

  // 3. Save to LocalStorage & broadcast
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(WORKSHOP_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_workshop_updated', {
          detail: config,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}

/* =========================================================================
   5. BOOKINGS / LEADS
   ========================================================================= */

export function getInitialLeads(): BookingLead[] {
  if (memoryLeadsCache) return memoryLeadsCache;
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LEADS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        memoryLeadsCache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export async function loadLeadsAsync(): Promise<BookingLead[]> {
  const serverData = await fetchServerSiteData();
  if (serverData && Array.isArray(serverData.leads)) {
    memoryLeadsCache = serverData.leads;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(LEADS_KEY, JSON.stringify(serverData.leads)); } catch {}
      saveToIDB(LEADS_KEY, serverData.leads);
    }
    return serverData.leads;
  }

  return getInitialLeads();
}

export async function saveLeadsAsync(leads: BookingLead[]): Promise<boolean> {
  memoryLeadsCache = leads;

  postServerSiteData({ leads });

  await saveToIDB(LEADS_KEY, leads);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch {
      // ignore
    }

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_leads_updated', {
          detail: leads,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}

export async function addLeadAsync(newLead: BookingLead): Promise<boolean> {
  const current = await loadLeadsAsync();
  const updated = [newLead, ...current.filter((l) => l.id !== newLead.id)];
  return saveLeadsAsync(updated);
}

// ==========================================
// 🎓 AI COURSE CMS DATA MODELS & STORAGE
// ==========================================

export interface AICourseConfig {
  courseTitle: string;
  courseSubtitle: string;
  trainer: string;
  description: string;
  fees: number;
  originalFees?: number;
  advanceFee: number;
  seatsPerBatch?: number;
  defaultDate: string;
  defaultTime: string;
  whatsapp: string;
  phone: string;
  venueFull: string;
  zoomLink?: string;
  mode: string;
  certificateIncluded: string;
}

export interface AICourseToolItem {
  id: string;
  name: string;
  category: 'all' | 'pro' | 'research' | 'creative' | 'automation';
  badgeText: string;
  badgeColor?: string;
  primaryUseMr: string;
  primaryUseHi: string;
  audienceMr: string;
  audienceHi: string;
  websiteUrl?: string;
  order: number;
}

export interface AICoursePillarItem {
  id: string;
  number: string;
  nameEn: string;
  titleMr: string;
  titleHi: string;
  headlineMr: string;
  headlineHi: string;
  descMr: string;
  descHi: string;
  steps: { labelMr: string; labelHi: string }[];
  color: string;
  badgeBg: string;
  order: number;
}

export interface AICourseChallengeItem {
  id: string;
  roleMr: string;
  roleHi: string;
  icon: string;
  pipeline: string[];
  pipelineTextMr: string;
  pipelineTextHi: string;
  toolsUsed: string[];
  outcomeMr: string;
  outcomeHi: string;
  sampleInput: string;
  samplePrompt: string;
  order: number;
}

export interface AICourseBatchItem {
  id: string;
  title: string;
  date: string;
  time: string;
  mode: string;
  seatsTotal: number;
  seatsBooked: number;
  status: 'Open' | 'Filling Fast' | 'Sold Out';
}

export interface AICourseData {
  config: AICourseConfig;
  pillars: AICoursePillarItem[];
  tools: AICourseToolItem[];
  challenges: AICourseChallengeItem[];
  batches: AICourseBatchItem[];
}

export const DEFAULT_AI_COURSE_DATA: AICourseData = {
  config: {
    courseTitle: '१ डे प्रॅक्टिकल AI कार्यशाळा (Basic to Advanced)',
    courseSubtitle: 'AI फक्त IT लोकांसाठी नाही — AI प्रत्येकासाठी आहे!',
    trainer: 'Pooja Patil & Technical Team',
    description: '४०-५० टूल्सचा गोंधळ नको! १०-१२ Core Tools, ५ मुख्य Pillars आणि शेवटी तुमच्या क्षेत्राचा थेट Real-Life प्रोजेक्ट चॅलेंज — मराठीत अगदी सोप्या भाषेत.',
    fees: 1499,
    originalFees: 4999,
    advanceFee: 499,
    seatsPerBatch: 25,
    defaultDate: 'आगामी रविवार (Upcoming Sunday Batch)',
    defaultTime: 'सकाळी १०:०० ते संध्याकाळी ५:०० (१ पूर्ण दिवस)',
    whatsapp: '8446917187',
    phone: '8446917187',
    venueFull: 'आनंद नगर, सिंहगड रोड, पुणे - ४११०५१ (तसेच घरबसल्या ऑनलाइन Zoom द्वारे उपलब्ध)',
    zoomLink: '',
    mode: 'Pune Offline + Zoom Live Online',
    certificateIncluded: 'होय (अधिकृत ई-प्रमाणपत्र)',
  },
  pillars: [
    {
      id: 'understand',
      number: '१',
      nameEn: 'AI Understand',
      titleMr: '१. 🧠 AI Understand (पाया व योग्य निवड)',
      titleHi: '१. 🧠 AI Understand (बुनियादी समझ)',
      headlineMr: 'AI म्हणजे काय → Tools → योग्य tool निवडणे',
      headlineHi: 'AI क्या है → Tools → सही tool का चुनाव',
      descMr: 'AI चे मूलभूत स्वरूप समजून घेणे, बाजारातील शेकडो टूल्समधून गोंधळून न जाता आपल्या कामासाठी अचूक टूल निवडण्याची हातोटी.',
      descHi: 'AI की बुनियादी कार्यप्रणाली को समझना और बिना भटके अपने काम के लिए सबसे सटीक AI टूल चुनना।',
      steps: [
        { labelMr: 'AI म्हणजे काय?', labelHi: 'AI क्या है?' },
        { labelMr: 'Core Tools ची ओळख', labelHi: 'Core Tools पहचान' },
        { labelMr: 'योग्य Tool निवडणे', labelHi: 'सही Tool चुनाव' },
      ],
      color: 'border-amber-400 bg-amber-50/70 text-amber-900',
      badgeBg: 'bg-amber-500 text-white',
      order: 1,
    },
    {
      id: 'communicate',
      number: '२',
      nameEn: 'AI Communicate',
      titleMr: '२. 💬 AI Communicate (प्रॉम्प्ट संवाद)',
      titleHi: '२. 💬 AI Communicate (प्रॉम्प्ट संवाद)',
      headlineMr: 'Prompt Engineering → Marathi/English → Follow-up prompts',
      headlineHi: 'Prompt Engineering → Marathi/English → Follow-up prompts',
      descMr: 'AI ला अचूक आज्ञा (Prompts) देण्याची कला. मराठी किंवा इंग्रजीत थेट मानवाप्रमाणे बोलणे आणि फॉलो-अप प्रॉम्प्ट्सने १००% अचूक काम करून घेणे.',
      descHi: 'AI को सटीक निर्देश देने की कला। हिंदी-मराठी में संवाद और फॉलो-अप प्रॉम्प्ट्स से मनचाहा परिणाम पाना।',
      steps: [
        { labelMr: 'Prompt Engineering', labelHi: 'Prompt Engineering' },
        { labelMr: 'Marathi / English संवाद', labelHi: 'मराठी / हिंदी संवाद' },
        { labelMr: 'Follow-up Prompts', labelHi: 'Follow-up Prompts' },
      ],
      color: 'border-sky-400 bg-sky-50/70 text-sky-900',
      badgeBg: 'bg-sky-600 text-white',
      order: 2,
    },
    {
      id: 'work',
      number: '३',
      nameEn: 'AI Work',
      titleMr: '३. 📄 AI Work (दैनंदिन कामकाज)',
      titleHi: '३. 📄 AI Work (दैनिक कामकाज)',
      headlineMr: 'Email → PDF → Word → Excel → PPT → Research → Reports',
      headlineHi: 'Email → PDF → Word → Excel → PPT → Research → Reports',
      descMr: 'ऑफिस व व्यवसायाचे तासन्‌तासांचे काम मिनिटांत: अचूक ईमेल, अवघड PDF चा सारांश, Word ड्राफ्टिंग, Excel फॉर्म्युला, PPT आणि सखोल अहवाल.',
      descHi: 'दफ्तर और बिजनेस के घंटों का काम मिनटों में: ईमेल, PDF समरी, Word डॉक्यूमेंट्स, Excel फॉर्मूला और प्रेजेंटेशन।',
      steps: [
        { labelMr: 'Email & Letters', labelHi: 'ईमेल व पत्र' },
        { labelMr: 'PDF & Excel डेटा', labelHi: 'PDF व Excel' },
        { labelMr: 'PPT & Reports', labelHi: 'PPT व रिपोर्ट्स' },
      ],
      color: 'border-emerald-400 bg-emerald-50/70 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      order: 3,
    },
    {
      id: 'create',
      number: '४',
      nameEn: 'AI Create',
      titleMr: '४. 🎨 AI Create (सर्जनशीलता & डिझाईन)',
      titleHi: '४. 🎨 AI Create (क्रिएटिविटी & डिजाइन)',
      headlineMr: 'Images → Posters → Social Media → Video → Voice',
      headlineHi: 'Images → Posters → Social Media → Video → Voice',
      descMr: 'क्रिएटिव्ह डिझाईनची जादू: आकर्षक सणांचे/ऑफर्सचे पोस्टर्स, सोशल मीडिया पोस्ट्स, रील्स व्हिडिओ आणि अस्सल आवाजातील व्हॉईस-ओव्हर.',
      descHi: 'रचनात्मक डिजाइन की दुनिया: पोस्टर्स, सोशल मीडिया पोस्ट्स, रील्स वीडियो और नेचुरल वॉइस-ओवर।',
      steps: [
        { labelMr: 'Images & Posters', labelHi: 'इमेज व पोस्टर्स' },
        { labelMr: 'Social Media', labelHi: 'सोशल मीडिया' },
        { labelMr: 'Video & Voice', labelHi: 'व्हिडिओ व व्हॉईस' },
      ],
      color: 'border-purple-400 bg-purple-50/70 text-purple-900',
      badgeBg: 'bg-purple-600 text-white',
      order: 4,
    },
    {
      id: 'automate',
      number: '५',
      nameEn: 'AI Automate',
      titleMr: '५. 🤖 AI Automate (ऑटोमेशन & फ्युचर)',
      titleHi: '५. 🤖 AI Automate (ऑटोमेशन & भविष्य)',
      headlineMr: 'Automation → AI Agents → Basic workflows → Future of AI',
      headlineHi: 'Automation → AI Agents → Basic workflows → Future of AI',
      descMr: 'वारंवार कराव्या लागणाऱ्या कामांचे ऑटोमेशन: नो-कोड वर्कफ्लो, AI बॉट्सची ओळख आणि भविष्यातील AI तंत्रज्ञानासाठी स्वतःला सज्ज करणे.',
      descHi: 'वर्कफ्लो ऑटोमेशन: बेसिक AI वर्कफ्लो सेट करना, AI एजेंट्स की पहचान और AI के भविष्य के लिए पूरी तैयारी।',
      steps: [
        { labelMr: 'Basic Workflows', labelHi: 'बेसिक वर्कफ्लो' },
        { labelMr: 'AI Agents ची ओळख', labelHi: 'AI Agents पहचान' },
        { labelMr: 'Future of AI', labelHi: 'AI का भविष्य' },
      ],
      color: 'border-rose-400 bg-rose-50/70 text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
      order: 5,
    },
  ],
  tools: [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      category: 'all',
      badgeText: 'All-Rounder',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      primaryUseMr: 'All-round AI assistant (मजकूर लेखन, माहिती, आयडियाज, शंका निवारण)',
      primaryUseHi: 'All-round AI assistant (राइटिंग, आइडियाज, सवालों के जवाब)',
      audienceMr: '👥 सर्वसामान्य, विद्यार्थी, व्यावसायिक',
      audienceHi: '👥 सभी वर्ग',
      websiteUrl: 'https://chatgpt.com',
      order: 1,
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      category: 'all',
      badgeText: 'Google Ecosystem',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      primaryUseMr: 'Research, writing, Google ecosystem (Docs, Drive, Gmail शी जोडलेले)',
      primaryUseHi: 'Research, writing, Google ecosystem (Docs, Drive, Gmail)',
      audienceMr: '👥 सर्व (मराठी/हिंदीत सहज संवाद)',
      audienceHi: '👥 सभी',
      websiteUrl: 'https://gemini.google.com',
      order: 2,
    },
    {
      id: 'claude',
      name: 'Claude',
      category: 'pro',
      badgeText: 'Deep Analysis',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      primaryUseMr: 'Documents, writing, deep analysis (लांबलचक मजकूर व कोड विश्लेषण)',
      primaryUseHi: 'Documents, writing, deep analysis (गहराई से विश्लेषण)',
      audienceMr: '💼 Professionals / Freelancers',
      audienceHi: '💼 Professionals / Freelancers',
      websiteUrl: 'https://claude.ai',
      order: 3,
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      category: 'research',
      badgeText: 'Live Web Research',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      primaryUseMr: 'Research + sources (थेट संदर्भ आणि वेब लिंक्ससह अचूक शोध)',
      primaryUseHi: 'Research + sources (लाइव वेब सोर्स और रेफरेंस)',
      audienceMr: '👨‍🏫 Teachers / Professionals / Business',
      audienceHi: '👨‍🏫 Teachers / Professionals / Business',
      websiteUrl: 'https://www.perplexity.ai',
      order: 4,
    },
    {
      id: 'notebooklm',
      name: 'NotebookLM',
      category: 'research',
      badgeText: 'PDF & Study Master',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      primaryUseMr: 'PDF, documents, study/research (मोठ्या पुस्तकांचे व नोट्सचे पॉडकास्ट)',
      primaryUseHi: 'PDF, documents, study/research (किताबों और नोट्स का अध्ययन)',
      audienceMr: '👨‍🏫 Teachers / Students / Professionals',
      audienceHi: '👨‍🏫 Teachers / Students / Professionals',
      websiteUrl: 'https://notebooklm.google.com',
      order: 5,
    },
    {
      id: 'copilot',
      name: 'Microsoft Copilot',
      category: 'pro',
      badgeText: 'Office Suite',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      primaryUseMr: 'Word, Excel, PowerPoint, Office (ऑफिस फाइल्स झटपट बनवणे)',
      primaryUseHi: 'Word, Excel, PowerPoint, Office डॉक्यूमेंट्स',
      audienceMr: '🧑‍💼 Working / Govt (ऑफिस कर्मचारी)',
      audienceHi: '🧑‍💼 Working / Govt (दफ्तर कर्मचारी)',
      websiteUrl: 'https://copilot.microsoft.com',
      order: 6,
    },
    {
      id: 'canva',
      name: 'Canva AI',
      category: 'creative',
      badgeText: 'Instant Design',
      badgeColor: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
      primaryUseMr: 'Poster, presentation, social media (१ मिनिटात बॅनर व पोस्टर्स)',
      primaryUseHi: 'Poster, presentation, social media डिजाइन',
      audienceMr: '🎨 सर्व (दुकानदार, महिला, शिक्षक)',
      audienceHi: '🎨 सभी (ग्राफिक्स व पोस्टर्स)',
      websiteUrl: 'https://www.canva.com',
      order: 7,
    },
    {
      id: 'gamma',
      name: 'Gamma',
      category: 'creative',
      badgeText: 'AI PPTs & Decks',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      primaryUseMr: 'AI presentations (फक्त एका प्रॉम्प्टवर संपूर्ण PPT डेक तयार)',
      primaryUseHi: 'AI presentations (एक प्रॉम्प्ट से पूरी PPT डेक तैयार)',
      audienceMr: '🧑‍💼 Professionals / Teachers',
      audienceHi: '🧑‍💼 Professionals / Teachers',
      websiteUrl: 'https://gamma.app',
      order: 8,
    },
    {
      id: 'capcut',
      name: 'CapCut',
      category: 'creative',
      badgeText: 'Reels & Video',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      primaryUseMr: 'Video/Reels editing (व्हिडिओ व इन्स्टाग्राम रील्स, ऑटो सबटायटल्स)',
      primaryUseHi: 'Video/Reels editing (वीडियो व इंस्टाग्राम रील्स)',
      audienceMr: '📱 Business / Creators',
      audienceHi: '📱 Business / Creators',
      websiteUrl: 'https://www.capcut.com',
      order: 9,
    },
    {
      id: 'googlelens',
      name: 'Google Lens',
      category: 'all',
      badgeText: 'Mobile Vision',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      primaryUseMr: 'Image/document info (कागदावरील मजकूर भाषांतर व त्वरित कॉपी)',
      primaryUseHi: 'Image/document info (फोटो से टेक्स्ट कॉपी व अनुवाद)',
      audienceMr: '👥 General Public (४०+ नागरिक, पालक)',
      audienceHi: '👥 General Public (आम नागरिक)',
      websiteUrl: 'https://lens.google',
      order: 10,
    },
    {
      id: 'zapier',
      name: 'Zapier / Make',
      category: 'automation',
      badgeText: 'Workflow Automation',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      primaryUseMr: 'Automation (Email, WhatsApp, Forms चे ऑटोमॅटिक कनेक्शन)',
      primaryUseHi: 'Automation (ईमेल, फॉर्म्स और WhatsApp का ऑटोमेशन)',
      audienceMr: '💼 Business / Professionals',
      audienceHi: '💼 Business / Professionals',
      websiteUrl: 'https://zapier.com',
      order: 11,
    },
    {
      id: 'n8n',
      name: 'n8n',
      category: 'automation',
      badgeText: 'AI Agents & Auto',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      primaryUseMr: 'Advanced automation (स्वतःचे सानुकूल AI एजंट्स आणि प्रगत वर्कफ्लो)',
      primaryUseHi: 'Advanced automation (कस्टम AI एजेंट्स और एडवांस वर्कफ्लो)',
      audienceMr: '🚀 Business / Technical users',
      audienceHi: '🚀 Business / Technical users',
      websiteUrl: 'https://n8n.io',
      order: 12,
    },
  ],
  challenges: [
    {
      id: 'teacher',
      roleMr: 'शिक्षक (Teacher)',
      roleHi: 'शिक्षक (Teacher)',
      icon: 'GraduationCap',
      pipeline: ['Chapter', 'Lesson Plan', 'PPT', 'MCQ', 'Worksheet'],
      pipelineTextMr: 'धडा निवडा → पाठाचे नियोजन → आकर्षक PPT → बहुपर्यायी प्रश्न (MCQ) → वर्कशीट',
      pipelineTextHi: 'अध्याय → लेसन प्लान → आकर्षक PPT → वस्तुनिष्ठ प्रश्न (MCQ) → वर्कशीट',
      toolsUsed: ['ChatGPT', 'NotebookLM', 'Gamma', 'Canva AI'],
      outcomeMr: 'शिक्षकांचे ५ तासांचे तयारीचे काम फक्त १५ मिनिटांत! संपूर्ण धड्यावर आधारित परिपूर्ण मराठी शैक्षणिक साहित्य तयार होते.',
      outcomeHi: 'अध्यापकों के 5 घंटे की तैयारी सिर्फ 15 मिनट में! पूरे पाठ पर आधारित तैयार शिक्षण सामग्री।',
      sampleInput: 'इयत्ता ७ वी विज्ञान: वनस्पतींमधील पोषण (Nutrition in Plants)',
      samplePrompt: 'मी इयत्ता ७ वी चा विज्ञान शिक्षक आहे. "वनस्पतींमधील पोषण" या धड्यावर आधारित ४५ मिनिटांचा मराठी लेसन प्लान तयार कर. सोबत विद्यार्थ्यांना विचारण्यासाठी ५ सोपे व ५ विचार करायला लावणारे MCQ प्रश्न आणि उत्तरपत्रिका तयार कर.',
      order: 1,
    },
    {
      id: 'business',
      roleMr: 'दुकानदार / व्यावसायिक (Business Owner)',
      roleHi: 'दुकानदार / व्यवसायी (Business Owner)',
      icon: 'Briefcase',
      pipeline: ['Business', 'Advertisement', 'Poster', 'WhatsApp', 'Customer Reply'],
      pipelineTextMr: 'व्यवसाय → जाहिरात मजकूर → आकर्षक पोस्टर → WhatsApp ब्रॉडकास्ट → ऑटो ग्राहक उत्तर',
      pipelineTextHi: 'बिजनेस → विज्ञापन कॉपी → पोस्टर डिजाइन → WhatsApp मैसेज → ग्राहक उत्तर',
      toolsUsed: ['ChatGPT', 'Canva AI', 'Google Gemini', 'Zapier'],
      outcomeMr: 'महागड्या एजन्सीची गरज नाही! स्वतःच्या दुकानासाठी किंवा सर्व्हिससाठी सणांची जाहिरात, बॅनर व WhatsApp मेसेज काही मिनिटांत तयार.',
      outcomeHi: 'बिना किसी एजेंसी के अपने बिजनेस के लिए फेस्टिवल ऑफर्स, पोस्टर और ऑटोमैटिक WhatsApp जवाब बनाएं।',
      sampleInput: 'पुण्यातील कपड्यांचे दुकान / सणासुदीची विशेष १०% सवलत',
      samplePrompt: 'माझे पुण्यात साड्यांचे दुकान आहे. येणाऱ्या सणासाठी ग्राहकांना आकर्षित करणारा एक भावनिक आणि प्रभावी मराठी WhatsApp ऑफर मेसेज तयार कर, ज्यात १०% सूट आणि पत्ता नमूद असेल.',
      order: 2,
    },
    {
      id: 'professional',
      roleMr: 'ऑफिस कर्मचारी (Working Professional)',
      roleHi: 'दफ्तर कर्मचारी (Working Professional)',
      icon: 'Laptop',
      pipeline: ['Email', 'Excel', 'Report', 'Presentation'],
      pipelineTextMr: 'क्लायंट ईमेल → Excel डेटा फॉर्म्युला → संक्षिप्त अहवाल → मॅनेजमेंट प्रेझेंटेशन',
      pipelineTextHi: 'ईमेल ड्राफ्ट → Excel फॉर्मूला → समरी रिपोर्ट → बोर्ड प्रेजेंटेशन',
      toolsUsed: ['Microsoft Copilot', 'ChatGPT', 'Claude', 'Gamma'],
      outcomeMr: 'ऑफिसमध्ये वेळेवर काम पूर्ण करून बॉस व मॅनेजमेंटवर छाप पाडा. अवघड Excel फॉर्म्युले व प्रेझेंटेशन अगदी सहज!',
      outcomeHi: 'दफ्तर में घंटों का काम मिनटों में पूरा करें। कठिन Excel सूत्र और रिपोर्ट समरी सेकंड्स में तैयार।',
      sampleInput: 'तिमाही विक्री डेटा व क्लायंट फॉलो-अप ईमेल',
      samplePrompt: 'आमच्या क्लायंटने पेमेंट उशिरा केले आहे. त्यांना नम्र परंतु ठामपणे आठवण करून देणारा एक औपचारिक कॉर्पोरेट ईमेल तयार कर, ज्यात प्रोजेक्ट डेडलाइनचा उल्लेख असेल.',
      order: 3,
    },
    {
      id: 'parent',
      roleMr: 'गृहिणी / पालक (Homemaker / Parent)',
      roleHi: 'माता-पिता / गृहिणी (Parent / Homemaker)',
      icon: 'Home',
      pipeline: ['Child', 'Study Plan', 'Notes', 'Quiz', 'Revision'],
      pipelineTextMr: 'मुलाचे वय/वर्ग → अभ्यासाचे वेळापत्रक → सोप्या भाषेत नोट्स → खेळातील प्रश्नमंजुषा → रिव्हिजन',
      pipelineTextHi: 'बच्चे की कक्षा → टाइमटेबल → सरल नोट्स → मजेदार क्विज → परीक्षा रिविजन',
      toolsUsed: ['ChatGPT', 'Google Lens', 'Gemini'],
      outcomeMr: 'मुलांना ट्यूशनची गरज न भासता घरच्या घरी खेळता खेळता अभ्यास करून घेण्याचा नवा मार्ग! पालक व मुले दोघांचाही तणाव दूर.',
      outcomeHi: 'बच्चों की पढ़ाई में बिना किसी तनाव के मदद करें। बोरिंग विषयों को मजेदार कहानियों और क्विज में बदलें।',
      sampleInput: '८ वर्षांच्या मुलासाठी इतिहास व गणिताचा मनोरंजक अभ्यास',
      samplePrompt: 'माझ्या ८ वर्षांच्या मुलाला छत्रपती शिवाजी महाराजांचा इतिहास सोप्या गोष्टीच्या रूपात सांगा आणि त्यावर आधारित ३ मनोरंजक प्रश्न तयार करा जेणेकरून त्याला ते लक्षात राहील.',
      order: 4,
    },
    {
      id: 'govt',
      roleMr: 'शासकीय कर्मचारी (Government Employee)',
      roleHi: 'सरकारी कर्मचारी (Government Employee)',
      icon: 'Landmark',
      pipeline: ['Document', 'Summary', 'Official Letter', 'Report'],
      pipelineTextMr: 'शासकीय जीआर / फाईल → त्वरित सारांश → अधिकृत शासकीय पत्रव्यवहार → वरिष्ठ अहवाल',
      pipelineTextHi: 'सरकारी दस्तावेज / फाइल → त्वरित समरी → आधिकारिक पत्र ड्राफ्ट → विभाग रिपोर्ट',
      toolsUsed: ['NotebookLM', 'Copilot', 'ChatGPT'],
      outcomeMr: 'शेकडो पानांचे शासकीय परिपत्रके व नियम काही सेकंदात समजून घेऊन अचूक शासकीय मराठीत परिपत्रके व टीपणी (Noting) तयार करा.',
      outcomeHi: 'लंबे सरकारी दस्तावेजों का त्वरित सार समझें और नियमानुसार शुद्ध भाषा में आधिकारिक पत्र व रिपोर्ट तैयार करें।',
      sampleInput: 'नवीन शासन निर्णय (GR) चा सारांश व नागरिकांसाठी नोटीस',
      samplePrompt: 'नवीन पाणीपुरवठा योजनेविषयी नागरिकांना माहिती देण्यासाठी शासकीय शिष्टाचाराला धरून एक स्पष्ट व नम्र मराठी जाहीर सूचना पत्रक तयार कर.',
      order: 5,
    },
    {
      id: 'freelancer',
      roleMr: 'फ्रीलान्सर (Freelancer)',
      roleHi: 'फ्रीलांसर (Freelancer)',
      icon: 'Rocket',
      pipeline: ['Client', 'Proposal', 'Quotation', 'Content', 'Invoice'],
      pipelineTextMr: 'क्लायंट ब्रीफ → प्रभावी प्रपोजल → कोटेशन पत्र → गुणवत्तापूर्ण कंटेंट → इनव्हॉइस',
      pipelineTextHi: 'क्लाइंट रिक्वायरमेंट → मजबूत प्रपोजल → कोटेशन → कंटेंट डिलीवरी → इनवॉइस',
      toolsUsed: ['Claude', 'ChatGPT', 'Canva AI', 'Zapier'],
      outcomeMr: 'आंतरराष्ट्रीय व स्थानिक क्लायंट्ससाठी प्रोफेशनल प्रपोजल्स व कोटेशन बनवून दुप्पट दराने काम मिळवण्याची क्षमता.',
      outcomeHi: 'क्लाइंट्स को प्रभावित करने वाले प्रपोजल और कोटेशन मिनटों में तैयार कर अपनी कमाई और क्लाइंट बेस बढ़ाएं।',
      sampleInput: 'वेबसाईट रीडिझाईन व सोशल मीडिया मॅनेजमेंट प्रपोजल',
      samplePrompt: 'एका रेस्टॉरंटच्या डिजिटल मार्केटिंगसाठी ₹२५,००० प्रति महिना या दराने एक प्रभावी आणि व्यावसायिक क्लायंट प्रपोजल ड्राफ्ट कर, ज्यात सेवांची यादी व फायदे असतील.',
      order: 6,
    },
    {
      id: 'entrepreneur',
      roleMr: 'स्टार्टअप / उद्योजक (Entrepreneur)',
      roleHi: 'उद्यमी (Entrepreneur)',
      icon: 'Target',
      pipeline: ['Business Idea', 'Market Research', 'Business Plan', 'Marketing'],
      pipelineTextMr: 'बिझनेस आयडिया → मार्केट रिसर्च → संपूर्ण बिझनेस प्लॅन → गो-टू-मार्केट स्ट्रॅटेजी',
      pipelineTextHi: 'बिजनेस आइडिया → मार्केट रिसर्च → कम्प्लीट बिजनेस प्लान → मार्केटिंग रणनीति',
      toolsUsed: ['Perplexity', 'ChatGPT Plus', 'Claude', 'Gamma'],
      outcomeMr: 'नवीन व्यवसाय सुरू करताना होणारा लाखो रुपयांचा खर्च वाचवा; बाजारातील स्पर्धा, किंमत धोरण व ग्रोथ प्लॅन AI कडून तपासा.',
      outcomeHi: 'नया बिजनेस शुरू करने के लिए संपूर्ण मार्केट रिसर्च, प्रतियोगी विश्लेषण और 90 दिनों का ग्रोथ रोडमैप हासिल करें।',
      sampleInput: 'पुण्यात सेंद्रिय अन्नधान्य (Organic Store) ची सुरुवात',
      samplePrompt: 'पुण्यात सेंद्रिय भाजीपाला व किराणा सुरू करण्यासाठी एक प्राथमिक बिझनेस प्लॅन तयार कर. ग्राहकांची गरज, संभाव्य अडथळे आणि पहिल्या ३ महिन्यांचे मार्केटिंग बजेट स्पष्ट कर.',
      order: 7,
    },
    {
      id: 'general40',
      roleMr: 'ज्येष्ठ नागरिक / ४०+ (General 40+)',
      roleHi: 'वरिष्ठ नागरिक / 40+ (General 40+)',
      icon: 'Users',
      pipeline: ['Question', 'Research', 'Summary', 'Planning', 'Action'],
      pipelineTextMr: 'मनातील शंका/प्रश्न → सखोल माहिती शोध → सोपा मराठी सारांश → नियोजन → प्रत्यक्ष कृती',
      pipelineTextHi: 'मन का सवाल → जानकारी खोज → सरल भाषा में समरी → दैनिक प्लानिंग → प्रत्यक्ष क्रिया',
      toolsUsed: ['Google Lens', 'ChatGPT', 'Google Gemini'],
      outcomeMr: 'तंत्रज्ञानाची कोणतीही भीती न बाळगता मोबाईलवर बोलून आरोग्य, प्रवास, बँकिंग व कौटुंबिक नियोजन स्वतःच्या हाताने आत्मविश्वासाने करा.',
      outcomeHi: 'बिना किसी तकनीकी डर के आवाज से बात करके स्वास्थ्य, यात्रा और दैनिक कार्यों की पूरी जानकारी प्राप्त करें।',
      sampleInput: 'ज्येष्ठ नागरिकांसाठी अष्टविनायक यात्रा नियोजन व आरोग्य काळजी',
      samplePrompt: 'पुण्याहून ज्येष्ठ नागरिकांसाठी ३ दिवसांच्या अष्टविनायक यात्रेचे आरामदायी नियोजन तयार करा, ज्यात प्रवासातील अंतर, विश्रांतीची ठिकाणे आणि घ्यावयाची काळजी स्पष्ट असेल.',
      order: 8,
    },
  ],
  batches: [
    {
      id: 'batch-1',
      title: 'बॅच १: आगामी रविवार (Pune Offline + Zoom Live)',
      date: 'येणारा रविवार (Upcoming Sunday)',
      time: 'सकाळी १०:०० ते संध्याकाळी ५:००',
      mode: 'Pune Offline + Zoom Live Online',
      seatsTotal: 15,
      seatsBooked: 9,
      status: 'Filling Fast',
    },
    {
      id: 'batch-2',
      title: 'बॅच २: पुढील वीकेंड (Next Weekend Special)',
      date: 'पुढील रविवार (Next Sunday)',
      time: 'सकाळी १०:०० ते संध्याकाळी ५:००',
      mode: 'Online Zoom Special',
      seatsTotal: 20,
      seatsBooked: 5,
      status: 'Open',
    },
  ],
};

const AI_COURSE_STORAGE_KEY = 'pooja_ai_course_data_v2';
let memoryAICourseCache: AICourseData | null = null;

export function getInitialAICourseData(): AICourseData {
  if (memoryAICourseCache) return memoryAICourseCache;
  if (typeof window === 'undefined') return DEFAULT_AI_COURSE_DATA;

  try {
    const saved = localStorage.getItem(AI_COURSE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.config && Array.isArray(parsed.tools)) {
        memoryAICourseCache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return DEFAULT_AI_COURSE_DATA;
}

export async function loadAICourseDataAsync(): Promise<AICourseData> {
  // First check server
  const serverData = await fetchServerSiteData();
  if (serverData && serverData.aiCourseData && serverData.aiCourseData.config) {
    memoryAICourseCache = serverData.aiCourseData;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AI_COURSE_STORAGE_KEY, JSON.stringify(serverData.aiCourseData));
      } catch {}
      saveToIDB(AI_COURSE_STORAGE_KEY, serverData.aiCourseData);
    }
    return serverData.aiCourseData;
  }

  // Next check IDB
  const fromIDB = await getFromIDB<AICourseData>(AI_COURSE_STORAGE_KEY);
  if (fromIDB && fromIDB.config) {
    memoryAICourseCache = fromIDB;
    return fromIDB;
  }

  return getInitialAICourseData();
}

export async function saveAICourseDataAsync(data: AICourseData): Promise<boolean> {
  memoryAICourseCache = data;

  // 1. Sync to server API
  postServerSiteData({ aiCourseData: data });

  // 2. Save to IDB
  await saveToIDB(AI_COURSE_STORAGE_KEY, data);

  // 3. Save to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(AI_COURSE_STORAGE_KEY, JSON.stringify(data));
    } catch {}

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_ai_course_updated', {
          detail: data,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }

  return true;
}

