import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pluginPath = path.join(process.cwd(), 'wordpress', 'pooja-saree-draping-cms.php');
    if (!fs.existsSync(pluginPath)) {
      return NextResponse.json({ error: 'Plugin file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(pluginPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-php',
        'Content-Disposition': 'attachment; filename="pooja-saree-draping-cms.php"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to download plugin' }, { status: 500 });
  }
}
