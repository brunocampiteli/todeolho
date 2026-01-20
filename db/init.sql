CREATE TABLE IF NOT EXISTS ad_searches (
  id BIGSERIAL PRIMARY KEY,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'done',
  message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ads (
  id BIGSERIAL PRIMARY KEY,
  search_id BIGINT NOT NULL REFERENCES ad_searches(id) ON DELETE CASCADE,
  ad_archive_id TEXT NOT NULL,
  page_name TEXT NULL,
  snapshot_url TEXT NULL,
  video_url TEXT NULL,
  image_url TEXT NULL,
  raw_json JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (search_id, ad_archive_id)
);

CREATE INDEX IF NOT EXISTS idx_ads_search_id ON ads(search_id);
CREATE INDEX IF NOT EXISTS idx_ads_video_url ON ads(video_url);
