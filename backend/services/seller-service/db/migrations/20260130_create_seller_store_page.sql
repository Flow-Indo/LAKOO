-- Create seller store page table (Taobao-style store builder).
-- This is safe to re-run.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS seller_store_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL UNIQUE REFERENCES seller(id) ON DELETE CASCADE,
  layout_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  draft_layout_blocks jsonb,
  primary_color varchar(7),
  secondary_color varchar(7),
  font_family varchar(100),
  draft_primary_color varchar(7),
  draft_secondary_color varchar(7),
  draft_font_family varchar(100),
  custom_css text,
  draft_custom_css text,
  is_published boolean NOT NULL DEFAULT false,
  has_draft_changes boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seller_store_page_seller_id ON seller_store_page(seller_id);

