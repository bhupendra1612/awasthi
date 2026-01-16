-- =====================================================
-- AWASTHI CLASSES - TEST SYSTEM DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. TESTS TABLE - Main test/exam information
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- SSC, Railway, Bank, RPSC, etc.
    subject TEXT, -- GK, Reasoning, Math, English, etc.
    
    -- Test Configuration
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_questions INTEGER DEFAULT 0,
    total_marks DECIMAL(10,2) DEFAULT 0,
    passing_marks DECIMAL(10,2) DEFAULT 0,
    marks_per_question DECIMAL(5,2) DEFAULT 1,
    negative_marks DECIMAL(5,2) DEFAULT 0, -- 0.25, 0.33, etc.
    
    -- Pricing
    is_free BOOLEAN DEFAULT TRUE,
    price DECIMAL(10,2) DEFAULT 0,
    original_price DECIMAL(10,2),
    
    -- Status & Visibility
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Scheduling
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    
    -- Metadata
    instructions TEXT,
    thumbnail_url TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. QUESTIONS TABLE - Individual questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    
    -- Question Content
    question_text TEXT NOT NULL,
    question_image TEXT, -- Optional image for question
    
    -- Options (A, B, C, D)
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    option_d TEXT,
    
    -- Answer
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT, -- Solution explanation
    
    -- Metadata
    marks DECIMAL(5,2) DEFAULT 1,
    negative_marks DECIMAL(5,2) DEFAULT 0,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    topic TEXT,
    order_index INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEST_ENROLLMENTS TABLE - Student enrollment in tests
CREATE TABLE IF NOT EXISTS test_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    
    -- Payment
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'free')),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    
    -- Attempt tracking
    attempts_allowed INTEGER DEFAULT 1,
    attempts_used INTEGER DEFAULT 0,
    
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    UNIQUE(user_id, test_id)
);

-- 4. TEST_ATTEMPTS TABLE - Each attempt by student
CREATE TABLE IF NOT EXISTS test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES test_enrollments(id) ON DELETE CASCADE,
    
    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    time_taken_seconds INTEGER,
    
    -- Status
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'auto_submitted', 'abandoned')),
    
    -- Results (calculated after submission)
    total_questions INTEGER DEFAULT 0,
    attempted INTEGER DEFAULT 0,
    correct INTEGER DEFAULT 0,
    wrong INTEGER DEFAULT 0,
    skipped INTEGER DEFAULT 0,
    
    marks_obtained DECIMAL(10,2) DEFAULT 0,
    total_marks DECIMAL(10,2) DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0,
    rank INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TEST_ANSWERS TABLE - Individual answers by student
CREATE TABLE IF NOT EXISTS test_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    
    selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D', NULL)),
    is_correct BOOLEAN,
    is_marked_for_review BOOLEAN DEFAULT FALSE,
    time_spent_seconds INTEGER DEFAULT 0,
    
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(attempt_id, question_id)
);

-- 6. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_tests_category ON tests(category);
CREATE INDEX IF NOT EXISTS idx_tests_published ON tests(is_published);
CREATE INDEX IF NOT EXISTS idx_tests_featured ON tests(is_featured);
CREATE INDEX IF NOT EXISTS idx_questions_test ON questions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_enrollments_user ON test_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_test_enrollments_test ON test_enrollments(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_test_answers_attempt ON test_answers(attempt_id);

-- 7. UPDATE TRIGGER for tests
CREATE OR REPLACE FUNCTION update_test_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total questions and marks when questions are added/removed
    UPDATE tests 
    SET 
        total_questions = (SELECT COUNT(*) FROM questions WHERE test_id = NEW.test_id),
        total_marks = (SELECT COALESCE(SUM(marks), 0) FROM questions WHERE test_id = NEW.test_id),
        updated_at = NOW()
    WHERE id = NEW.test_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_test_stats_trigger ON questions;
CREATE TRIGGER update_test_stats_trigger
    AFTER INSERT OR DELETE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_test_stats();

-- 8. Verification
SELECT 'Test system tables created successfully!' as result;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('tests', 'questions', 'test_enrollments', 'test_attempts', 'test_answers')
ORDER BY table_name;