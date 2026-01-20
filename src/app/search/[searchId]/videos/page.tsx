import { db } from '@/lib/db';

export default async function VideosPage({ params }: { params: { searchId: string } }) {
  const searchId = Number(params.searchId);
  const pool = db();

  const searchRes = await pool.query('SELECT * FROM ad_searches WHERE id = $1', [searchId]);
  const search = searchRes.rows[0];
  if (!search) {
    return <main>Busca não encontrada.</main>;
  }

  const adsRes = await pool.query('SELECT * FROM ads WHERE search_id = $1 ORDER BY id DESC LIMIT 200', [searchId]);

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Vídeos</h1>
          <div style={{ color: '#666', fontSize: 13 }}>Domínio: <strong>{search.domain}</strong></div>
        </div>
        <div>
          <a href={`/search/${searchId}`}>Voltar</a>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {adsRes.rows.map((ad) => {
          const hasVideo = Boolean(ad.video_url);
          return (
            <div key={ad.id} style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{ad.page_name ?? '-'}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>ad: {ad.ad_archive_id}</div>
                </div>
                <div style={{ fontSize: 12, color: hasVideo ? '#0a0' : '#666' }}>
                  {hasVideo ? 'vídeo' : 'sem vídeo'}
                </div>
              </div>

              {hasVideo ? (
                <div style={{ marginTop: 10 }}>
                  <video controls preload="none" style={{ width: '100%', maxHeight: 360 }} src={`/api/ad/${ad.id}/download?type=video`} />
                </div>
              ) : (
                <div style={{ marginTop: 10, color: '#666', fontSize: 12 }}>
                  Clique em “Extrair (robô)”.
                </div>
              )}

              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ad.snapshot_url ? (
                  <a href={ad.snapshot_url} target="_blank" rel="noreferrer">Snapshot</a>
                ) : null}

                <form action={`/api/ad/${ad.id}/extract`} method="post">
                  <button type="submit">Extrair (robô)</button>
                </form>

                {hasVideo ? <a href={`/api/ad/${ad.id}/download?type=video`}>Baixar</a> : null}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
