export default function ImportPage() {
  return (
    <main>
      <h1 style={{ margin: 0, fontSize: 22 }}>Importar links</h1>
      <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>
        Cole links (um por linha). Aceita snapshot (ads/library ou render_ad) e links diretos .mp4/.m3u8.
      </div>

      <form action="/api/import" method="post" style={{ marginTop: 16, maxWidth: 900 }}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Domínio</label>
          <input name="domain" placeholder="ex: exemplo.com" style={{ width: '100%', padding: 10 }} required />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Links (um por linha)</label>
          <textarea name="links" rows={10} style={{ width: '100%', padding: 10 }} required />
        </div>

        <button type="submit" style={{ padding: '10px 14px' }}>Importar</button>
      </form>
    </main>
  );
}
