import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import businessData from '../../../data/business-data.json';
import { submitInquiryToWordPress } from '../../../lib/wordpress';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'site-data.json');

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

export interface SiteData {
  workshopConfig: WorkshopConfig;
  galleryItems: any[];
  styleImages: Record<string | number, string>;
  leads: any[];
  adminPin: string;
  updatedAt: string;
  aiCourseData?: any;
}

const DEFAULT_WORKSHOP_CONFIG: WorkshopConfig = {
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

function getInitialData(): SiteData {
  return {
    workshopConfig: DEFAULT_WORKSHOP_CONFIG,
    galleryItems: businessData.galleryItems || [],
    styleImages: {},
    leads: [],
    adminPin: '1234',
    updatedAt: new Date().toISOString(),
  };
}

// In-memory cache for fast read responses
let inMemorySiteData: SiteData | null = null;

function readSiteData(): SiteData {
  if (inMemorySiteData) {
    return inMemorySiteData;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      inMemorySiteData = {
        workshopConfig: { ...DEFAULT_WORKSHOP_CONFIG, ...(parsed.workshopConfig || {}) },
        galleryItems: Array.isArray(parsed.galleryItems) && parsed.galleryItems.length > 0
          ? parsed.galleryItems
          : businessData.galleryItems || [],
        styleImages: parsed.styleImages || {},
        leads: Array.isArray(parsed.leads) ? parsed.leads : [],
        adminPin: parsed.adminPin || '1234',
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
      return inMemorySiteData;
    }
  } catch (err) {
    console.error('Error reading site data file:', err);
  }

  // If file doesn't exist or failed to parse, create initial file
  const initial = getInitialData();
  writeSiteData(initial);
  return initial;
}

function writeSiteData(data: SiteData): boolean {
  try {
    inMemorySiteData = data;
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing site data file:', err);
    return false;
  }
}

export async function GET() {
  try {
    const data = readSiteData();
    return NextResponse.json({
      success: true,
      data,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err) {
    console.error('API GET /api/site-data error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch site data',
      data: getInitialData(),
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readSiteData();

    if (body.reset === 'all') {
      const initial = getInitialData();
      writeSiteData(initial);
      return NextResponse.json({ success: true, data: initial });
    }

    const updated: SiteData = {
      ...current,
      workshopConfig: body.workshopConfig
        ? { ...current.workshopConfig, ...body.workshopConfig }
        : current.workshopConfig,
      galleryItems: Array.isArray(body.galleryItems)
        ? body.galleryItems
        : current.galleryItems,
      styleImages: body.styleImages !== undefined
        ? { ...current.styleImages, ...body.styleImages }
        : current.styleImages,
      leads: Array.isArray(body.leads)
        ? body.leads
        : body.newLead
        ? [body.newLead, ...current.leads]
        : current.leads,
      aiCourseData: body.aiCourseData !== undefined
        ? body.aiCourseData
        : current.aiCourseData,
      adminPin: body.adminPin ? String(body.adminPin) : current.adminPin,
      updatedAt: new Date().toISOString(),
    };

    if (body.newLead) {
      submitInquiryToWordPress({
        name: body.newLead.name,
        phone: body.newLead.phone,
        workshopType: body.newLead.workshopType,
        participants: body.newLead.participants,
        message: body.newLead.message,
      }).catch((err) => console.warn('WordPress inquiry sync error:', err));
    }

    const saved = writeSiteData(updated);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Could not write updates to disk', data: current },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err) {
    console.error('API POST /api/site-data error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to update site data',
    }, { status: 500 });
  }
}
