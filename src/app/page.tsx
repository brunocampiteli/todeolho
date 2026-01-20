import { db } from '@/lib/db';

export default async function HomePage() {
  const pool = db();
  const { rows } = await pool.query(
    'SELECT id, domain, status, message, created_at FROM ad_searches ORDER BY id DESC LIMIT 50'
  );

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Buscas / Importações</h1>
          <div style={{ color: '#666', fontSize: 13 }}>Últimas 50.</div>
        </div>
        <div>
          <a href="/import">Importar links</a>
        </div>
      </div>

      {rows.length === 0 ? (
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd' }}>Nenhuma busca ainda.</div>
      ) : (
        <div style={{ marginTop: 16, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: 8 }}>ID</th>
                <th style={{ padding: 8 }}>Domínio</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Mensagem</th>
                <th style={{ padding: 8 }}>Criado</th>
                <th style={{ padding: 8 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: 8 }}>{r.id}</td>
                  <td style={{ padding: 8, fontWeight: 600 }}>{r.domain}</td>
                  <td style={{ padding: 8 }}>{r.status}</td>
                  <td style={{ padding: 8, color: '#666' }}>{r.message ?? ''}</td>
                  <td style={{ padding: 8, color: '#666' }}>{String(r.created_at ?? '')}</td>
                  <td style={{ padding: 8 }}>
                    <a href={`/search/${r.id}`}>Resultados</a>
                    {' | '}
                    <a href={`/search/${r.id}/videos`}>Vídeos</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
