-- Fix Database Schema Issues
-- Run these commands in your Supabase SQL Editor

-- 1. Add missing is_active column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Add missing is_active column to barbers table  
ALTER TABLE barbers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Update all existing records to be active
UPDATE products SET is_active = true WHERE is_active IS NULL;
UPDATE barbers SET is_active = true WHERE is_active IS NULL;

-- 4. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_barbers_is_active ON barbers(is_active);

-- 5. Verify the schema (run these to check)
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name = 'is_active';

-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'barbers' AND column_name = 'is_active';

-- 6. Check if data exists
-- SELECT COUNT(*) as total_products FROM products;
-- SELECT COUNT(*) as total_barbers FROM barbers;
-- SELECT COUNT(*) as total_services FROM services;