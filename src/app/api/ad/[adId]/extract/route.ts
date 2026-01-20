import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { extractMediaFromSnapshot } from '@/lib/robot';

export async function POST(req: Request, { params }: { params: { adId: string } }) {
  const adId = Number(params.adId);
  const pool = db();

  const { rows } = await pool.query('SELECT * FROM ads WHERE id = $1', [adId]);
  const ad = rows[0];
  if (!ad) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }

  const snapshotUrl = String(ad.snapshot_url ?? '');
  if (!snapshotUrl) {
    return NextResponse.redirect(new URL(`/search/${ad.search_id}/videos`, req.url));
  }

  const result = await extractMediaFromSnapshot(snapshotUrl);

  await pool.query('UPDATE ads SET video_url=$1, image_url=$2 WHERE id=$3', [result.videoUrl, result.imageUrl, adId]);

  return NextResponse.redirect(new URL(`/search/${ad.search_id}/videos`, req.url));
}
