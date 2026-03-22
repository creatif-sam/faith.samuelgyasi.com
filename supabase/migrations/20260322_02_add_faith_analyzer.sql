-- Migration: Add faith analyzer (tests and questions)
-- Date: 2026-03-22
-- Description: Adds faith_tests, faith_test_questions, and faith_test_attempts tables

-- =============================================
-- 0. Create update_updated_at_column function if not exists
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 1. Create faith_tests table
-- =============================================
CREATE TABLE IF NOT EXISTS faith_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_en TEXT,
  description_fr TEXT,
  disclaimer_en TEXT,
  disclaimer_fr TEXT,
  total_takes INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'faith_tests' AND column_name = 'sort_order') 
  THEN
    ALTER TABLE faith_tests ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'faith_tests' AND column_name = 'disclaimer_en') 
  THEN
    ALTER TABLE faith_tests ADD COLUMN disclaimer_en TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'faith_tests' AND column_name = 'disclaimer_fr') 
  THEN
    ALTER TABLE faith_tests ADD COLUMN disclaimer_fr TEXT;
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_faith_tests_slug ON faith_tests(slug);
CREATE INDEX IF NOT EXISTS idx_faith_tests_published ON faith_tests(published);
CREATE INDEX IF NOT EXISTS idx_faith_tests_sort_order ON faith_tests(sort_order);

-- Add comments
COMMENT ON TABLE faith_tests IS 'Faith analyzer tests/quizzes';
COMMENT ON COLUMN faith_tests.disclaimer_en IS 'Disclaimer text shown before test (English)';
COMMENT ON COLUMN faith_tests.disclaimer_fr IS 'Disclaimer text shown before test (French)';
COMMENT ON COLUMN faith_tests.total_takes IS 'Total number of times this test has been taken';

-- =============================================
-- 2. Create faith_test_questions table
-- =============================================
CREATE TABLE IF NOT EXISTS faith_test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES faith_tests(id) ON DELETE CASCADE,
  question_en TEXT NOT NULL,
  question_fr TEXT NOT NULL,
  option_a_en TEXT NOT NULL,
  option_a_fr TEXT NOT NULL,
  option_b_en TEXT NOT NULL,
  option_b_fr TEXT NOT NULL,
  option_c_en TEXT NOT NULL,
  option_c_fr TEXT NOT NULL,
  correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C')),
  explanation_en TEXT,
  explanation_fr TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'faith_test_questions' AND column_name = 'sort_order') 
  THEN
    ALTER TABLE faith_test_questions ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'faith_test_questions' AND column_name = 'explanation_en') 
  THEN
    ALTER TABLE faith_test_questions ADD COLUMN explanation_en TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'faith_test_questions' AND column_name = 'explanation_fr') 
  THEN
    ALTER TABLE faith_test_questions ADD COLUMN explanation_fr TEXT;
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_faith_test_questions_test_id ON faith_test_questions(test_id);
CREATE INDEX IF NOT EXISTS idx_faith_test_questions_sort_order ON faith_test_questions(sort_order);

-- Add comments
COMMENT ON TABLE faith_test_questions IS 'Questions for faith analyzer tests';
COMMENT ON COLUMN faith_test_questions.correct_option IS 'The correct answer: A, B, or C';

-- =============================================
-- 3. Create faith_test_attempts table
-- =============================================
CREATE TABLE IF NOT EXISTS faith_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES faith_tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_faith_test_attempts_test_id ON faith_test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_faith_test_attempts_attempted_at ON faith_test_attempts(attempted_at);

-- Add comments
COMMENT ON TABLE faith_test_attempts IS 'Log of test attempts (anonymous)';

-- =============================================
-- 4. Update triggers
-- =============================================
DROP TRIGGER IF EXISTS update_faith_tests_updated_at ON faith_tests;
CREATE TRIGGER update_faith_tests_updated_at
  BEFORE UPDATE ON faith_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
