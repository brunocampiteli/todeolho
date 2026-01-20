import { normalizeMetaSnapshotUrl, isDirectVideoUrl, isDirectImageUrl } from '@/lib/utils';

export async function extractMediaFromSnapshot(snapshotUrl: string): Promise<{ ok: boolean; videoUrl: string | null; imageUrl: string | null; error?: string }> {
  const normalized = normalizeMetaSnapshotUrl(snapshotUrl);

  if (isDirectVideoUrl(normalized)) return { ok: true, videoUrl: normalized, imageUrl: null };
  if (isDirectImageUrl(normalized)) return { ok: true, videoUrl: null, imageUrl: normalized };

  const timeoutMs = Number(process.env.ROBOT_TIMEOUT_MS ?? '25000');
  const headless = String(process.env.ROBOT_HEADLESS ?? 'true') !== 'false';

  const { chromium } = await import('playwright');

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const hits = new Set<string>();

  page.on('response', (response) => {
    try {
      const url = response.url();
      if (isDirectVideoUrl(url) || isDirectImageUrl(url)) {
        hits.add(url);
      }
    } catch {
      // ignore
    }
  });

  try {
    await page.goto(normalized, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    await page.waitForTimeout(Math.min(9000, Math.max(2000, Math.floor(timeoutMs / 2))));

    const found = Array.from(hits);
    const videoUrl = found.find((u) => isDirectVideoUrl(u)) ?? null;
    const imageUrl = found.find((u) => isDirectImageUrl(u)) ?? null;

    if (videoUrl || imageUrl) {
      return { ok: true, videoUrl, imageUrl };
    }

    const html = await page.content();
    const mp4 = html.match(/https?:\/\/[^"'\s>]+\.mp4[^"'\s>]*/i);
    const img = html.match(/https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)[^"'\s>]*/i);

    if (!mp4 && !img) {
      return { ok: false, videoUrl: null, imageUrl: null, error: 'Não foi possível encontrar mídia.' };
    }

    return { ok: true, videoUrl: mp4?.[0] ?? null, imageUrl: img?.[0] ?? null };
  } catch (e: any) {
    return { ok: false, videoUrl: null, imageUrl: null, error: e?.message ?? 'Erro no robô' };
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
