import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'ToDeOlho',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700 }}>ToDeOlho</div>
              <div style={{ color: '#666', fontSize: 13 }}>Dashboard + robô (VPS)</div>
            </div>
            <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a href="/" style={{ textDecoration: 'none' }}>Buscas</a>
              <a href="/import" style={{ textDecoration: 'none' }}>Importar</a>
            </nav>
          </header>
          <hr style={{ margin: '16px 0' }} />
          {children}
        </div>
      </body>
    </html>
  );
}
