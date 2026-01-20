import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { adId: string } }) {
  const adId = Number(params.adId);
  const url = new URL(req.url);
  const type = url.searchParams.get('type') ?? 'video';

  const pool = db();
  const { rows } = await pool.query('SELECT * FROM ads WHERE id = $1', [adId]);
  const ad = rows[0];
  if (!ad) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }

  const mediaUrl = type === 'image' ? String(ad.image_url ?? '') : String(ad.video_url ?? '');
  if (!mediaUrl) {
    return NextResponse.json({ ok: false, error: 'No media URL' }, { status: 404 });
  }

  return NextResponse.redirect(mediaUrl);
}
