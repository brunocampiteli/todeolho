export function splitLines(text: string): string[] {
  return String(text ?? '').split(/\r?\n/);
}

export function normalizeDomain(input: string): string {
  let d = String(input ?? '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//i, '');
  d = d.replace(/\/.*$/, '');
  return d;
}

export function normalizeMetaSnapshotUrl(input: string): string {
  const u = String(input ?? '').trim();
  if (!u) return '';

  try {
    const parsed = new URL(u);
    const host = String(parsed.hostname || '').toLowerCase();
    const path = String(parsed.pathname || '');
    const id = parsed.searchParams.get('id');

    if (id && host.includes('facebook.com') && /^\/ads\/library/i.test(path)) {
      return `https://www.facebook.com/ads/archive/render_ad/?id=${encodeURIComponent(id)}`;
    }

    return u;
  } catch {
    return u;
  }
}

export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|m3u8)(\?|$)/i.test(String(url ?? ''));
}

export function isDirectImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(String(url ?? ''));
}
