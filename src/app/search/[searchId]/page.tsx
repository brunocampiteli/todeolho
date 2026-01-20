import { db } from '@/lib/db';

export default async function SearchPage({ params }: { params: { searchId: string } }) {
  const searchId = Number(params.searchId);
  const pool = db();

  const searchRes = await pool.query('SELECT * FROM ad_searches WHERE id = $1', [searchId]);
  const search = searchRes.rows[0];
  if (!search) {
    return <main>Busca não encontrada.</main>;
  }

  const adsRes = await pool.query('SELECT * FROM ads WHERE search_id = $1 ORDER BY id DESC LIMIT 300', [searchId]);

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Resultados</h1>
          <div style={{ color: '#666', fontSize: 13 }}>Domínio: <strong>{search.domain}</strong></div>
          <div style={{ color: '#666', fontSize: 13 }}>Status: {search.status}</div>
          {search.message ? <div style={{ color: '#b00', fontSize: 13 }}>{search.message}</div> : null}
        </div>
        <div>
          <a href={`/search/${searchId}/videos`}>Vídeos</a>
        </div>
      </div>

      <div style={{ marginTop: 16, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: 8 }}>Ad</th>
              <th style={{ padding: 8 }}>Snapshot</th>
              <th style={{ padding: 8 }}>Vídeo</th>
            </tr>
          </thead>
          <tbody>
            {adsRes.rows.map((ad) => (
              <tr key={ad.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 8, color: '#666' }}>{ad.ad_archive_id}</td>
                <td style={{ padding: 8 }}>
                  {ad.snapshot_url ? (
                    <a href={ad.snapshot_url} target="_blank" rel="noreferrer">Abrir</a>
                  ) : (
                    '-'
                  )}
                </td>
                <td style={{ padding: 8 }}>{ad.video_url ? 'OK' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
