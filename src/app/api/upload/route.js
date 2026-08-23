import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'اسم الملف مطلوب' }, { status: 400 });
    }

    // Get file binary from request body
    const body = await request.arrayBuffer();
    if (!body || body.byteLength === 0) {
      return NextResponse.json({ error: 'محتوى الملف فارغ' }, { status: 400 });
    }

    // Upload to Vercel Blob Storage
    const blob = await put(filename, body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType
    });
  } catch (error) {
    console.error('Vercel Blob Upload Error:', error);
    return NextResponse.json({ error: error.message || 'فشل رفع الملف إلى Vercel Blob' }, { status: 500 });
  }
}
