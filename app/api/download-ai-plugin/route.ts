import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const pluginPath = path.join(process.cwd(), 'wordpress', 'ai-course-cms.php');
    if (!fs.existsSync(pluginPath)) {
      return NextResponse.json({ error: 'AI Course plugin file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(pluginPath, 'utf-8');
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    if (format === 'raw' || format === 'json') {
      return NextResponse.json({
        success: true,
        code: fileContent,
        filename: 'ai-course-cms.php',
      });
    }

    const fileBuffer = Buffer.from(fileContent, 'utf-8');

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-php',
        'Content-Disposition': 'attachment; filename="ai-course-cms.php"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to download AI Course plugin' }, { status: 500 });
  }
}

