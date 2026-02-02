import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// GET /api/product-images?folder=<folderName>
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    if (!folder) {
      return NextResponse.json({ error: 'folder query parameter is required' }, { status: 400 });
    }

    // sanitize folder to avoid directory traversal
    if (folder.includes('..') || path.isAbsolute(folder)) {
      return NextResponse.json({ error: 'invalid folder' }, { status: 400 });
    }

    // Resolve path to the public products folder inside the frontend app
    const productsDir = path.join(process.cwd(), 'frontend', 'laku-frontend-v2', 'public', 'products', folder);

    const entries = await fs.promises.readdir(productsDir);
    const imageFiles = entries.filter((f) => /\.(webp|jpe?g|png|gif)$/i.test(f));
    const urls = imageFiles.map((f) => `/products/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`);

    return NextResponse.json(urls);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'not found' }, { status: 404 });
  }
}

