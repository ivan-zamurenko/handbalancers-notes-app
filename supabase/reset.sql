-- ============================================================
-- RESET SCRIPT — Run this BEFORE applying schema.sql
-- Paste into Supabase SQL Editor and execute
-- WARNING: This drops ALL app tables and related objects
-- ============================================================

-- Drop tables (order matters: dependents first)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS workout_logs CASCADE;
DROP TABLE IF EXISTS user_programs CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS days CASCADE;
DROP TABLE IF EXISTS weeks CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop trigger and function for new user handler
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
