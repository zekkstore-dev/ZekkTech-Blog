-- Migration: Add section column to certificates table
-- Run this in the Supabase SQL Editor:

ALTER TABLE certificates ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'Lainnya';
