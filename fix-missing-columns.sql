-- Script: fix-missing-columns.sql
-- Purpose: Add missing columns to tables if they do not exist

-- Example: Add 'email' column to 'users' table if missing (PostgreSQL syntax)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='email'
    ) THEN
        ALTER TABLE users ADD COLUMN email VARCHAR(255);
    END IF;
END$$;

-- Add more ALTER TABLE statements below as needed
-- Example:
-- IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_date')
-- THEN ALTER TABLE orders ADD COLUMN order_date DATE;