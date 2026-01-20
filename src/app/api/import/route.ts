import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import {
  isDirectImageUrl,
  isDirectVideoUrl,
  normalizeDomain,
  normalizeMetaSnapshotUrl,
  splitLines,
} from '@/lib/utils';
import crypto from 'crypto';

const schema = z.object({
  domain: z.string().min(1),
  links: z.string().min(1),
});

export async function POST(req: Request) {
  const form = await req.formData();
  const parsed = schema.safeParse({
    domain: String(form.get('domain') ?? ''),
    links: String(form.get('links') ?? ''),
  });

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });
  }

  const domain = normalizeDomain(parsed.data.domain);
  const lines = splitLines(parsed.data.links);
  const urls = Array.from(
    new Set(
      lines
        .map((l) => l.trim().replace(/\s+/g, ''))
        .filter((u) => /^https?:\/\//i.test(u))
    )
  );

  if (!domain || urls.length === 0) {
    return NextResponse.json({ ok: false, error: 'Informe domínio e links' }, { status: 400 });
  }

  const pool = db();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const searchRes = await client.query(
      'INSERT INTO ad_searches (domain, status, message) VALUES ($1, $2, $3) RETURNING id',
      [domain, 'done', `Importado manualmente (${urls.length} links).`]
    );
    const searchId = Number(searchRes.rows[0].id);

    for (const u of urls) {
      const adArchiveId = 'manual_' + crypto.createHash('sha1').update(u).digest('hex').slice(0, 16);

      let snapshotUrl: string | null = null;
      let videoUrl: string | null = null;
      let imageUrl: string | null = null;

      if (isDirectVideoUrl(u)) {
        videoUrl = u;
      } else if (isDirectImageUrl(u)) {
        imageUrl = u;
      } else {
        snapshotUrl = normalizeMetaSnapshotUrl(u);
      }

      await client.query(
        'INSERT INTO ads (search_id, ad_archive_id, snapshot_url, video_url, image_url, raw_json) VALUES ($1,$2,$3,$4,$5,$6) '
          + 'ON CONFLICT (search_id, ad_archive_id) DO UPDATE SET snapshot_url=EXCLUDED.snapshot_url, video_url=EXCLUDED.video_url, image_url=EXCLUDED.image_url, raw_json=EXCLUDED.raw_json',
        [searchId, adArchiveId, snapshotUrl, videoUrl, imageUrl, JSON.stringify({ source: 'manual', input_url: u })]
      );
    }

    await client.query('COMMIT');
    return NextResponse.redirect(new URL(`/search/${searchId}/videos`, req.url));
  } catch (e: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ ok: false, error: e?.message ?? 'Erro' }, { status: 500 });
  } finally {
    client.release();
  }
}
