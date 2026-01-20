# ToDeOlho (VPS) - Next.js + Postgres + Playwright

## O que é
- Dashboard para importar anúncios (links) e baixar vídeos.
- Robô Playwright sob demanda: abre o `snapshot_url` e captura `.mp4/.m3u8` pelas requests.

## Subir no VPS (Ubuntu 22.04)

### 1) Pré-requisitos
- Docker + Docker Compose instalados
- DNS do domínio `todeolho.cozirpb.com` apontado para o IP do VPS
- Portas abertas: 80 e 443

### 2) Configurar env
Crie `.env` a partir de `.env.example` e ajuste `POSTGRES_PASSWORD`.

### 3) Subir

```bash
docker compose up -d --build
```

Acesse:
- https://todeolho.cozirpb.com

## Rotas
- `/` lista buscas/importações
- `/import` importa links
- `/search/:id/videos` galeria + botão Extrair (robô)

## Notas
- O download hoje é via redirect para o CDN (fbcdn). Se você precisar “proxy streaming” para evitar expiração, eu implemento como próxima etapa.
