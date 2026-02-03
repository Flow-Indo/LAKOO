-- Remove legacy seller-owned product tables.
-- Products now live in product_db (product-service).
--
-- This migration is designed to be safe to re-run.

BEGIN;

DROP TABLE IF EXISTS seller_product_variant CASCADE;
DROP TABLE IF EXISTS seller_product CASCADE;

COMMIT;

