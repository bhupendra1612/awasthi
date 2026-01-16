-- Daily Test System Schema for AI-Generated Practice Tests
-- Run this in Supabase SQL Editor

-- 1. Create daily_test_templates table (stores AI prompt configurations)
CREATE TABLE IF NOT EXISTS daily_test_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    exam_category VARCHAR(100) NOT NULL, -- SSC, Railway, Bank, RPSC, etc.
    subject VARCHAR(100) NOT NULL, -- GK, Math, Reasoning, English, Hindi
    difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    questions_count INTEGER DEFAULT 10,
    duration_minutes INTEGER DEFAULT 10,
    ai_prompt TEXT NOT NULL, -- Custom instructions for ChatGPT
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create generated_daily_tests table (stores AI-generated tests)
CREATE TABLE IF NOT EXISTS generated_daily_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES daily_test_templates(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    exam_category VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    questions_count INTEGER DEFAULT 10,
    duration_minutes INTEGER DEFAULT 10,
    status VARCHAR(20) DEFAULT 'pending_approval', -- pending_approval, approved, published, rejected
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approval_deadline TIMESTAMP WITH TIME ZONE, -- Auto-publish after this time
    approved_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES profiles(id),
    test_date DATE DEFAULT CURRENT_DATE, -- Which day this test is for
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create generated_daily_questions table (stores AI-generated questions)
CREATE TABLE IF NOT EXISTS generated_daily_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_test_id UUID REFERENCES generated_daily_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create daily_test_attempts table (track student attempts)
CREATE TABLE IF NOT EXISTS daily_test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    daily_test_id UUID REFERENCES generated_daily_tests(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 10,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    time_taken_seconds INTEGER,
    answers JSONB DEFAULT '{}', -- Store answers as JSON
    UNIQUE(user_id, daily_test_id) -- One attempt per user per test
);

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_templates_active ON daily_test_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_templates_category ON daily_test_templates(exam_category);
CREATE INDEX IF NOT EXISTS idx_generated_tests_status ON generated_daily_tests(status);
CREATE INDEX IF NOT EXISTS idx_generated_tests_date ON generated_daily_tests(test_date);
CREATE INDEX IF NOT EXISTS idx_generated_tests_published ON generated_daily_tests(status, test_date) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_daily_questions_test ON generated_daily_questions(daily_test_id);
CREATE INDEX IF NOT EXISTS idx_daily_attempts_user ON daily_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_attempts_test ON daily_test_attempts(daily_test_id);

-- 6. Insert some default templates for government exams
INSERT INTO daily_test_templates (name, exam_category, subject, difficulty, questions_count, duration_minutes, ai_prompt) VALUES
(
    'SSC CGL - General Knowledge',
    'SSC',
    'General Knowledge',
    'medium',
    10,
    10,
    'Generate 10 multiple choice questions for SSC CGL exam preparation on General Knowledge. Include questions on:
- Indian History (2 questions)
- Indian Geography (2 questions)
- Indian Polity & Constitution (2 questions)
- Current Affairs (2 questions)
- General Science (2 questions)

Each question should have 4 options (A, B, C, D) with only one correct answer.
Difficulty level: Medium (suitable for SSC CGL aspirants)
Language: English with Hindi terms where appropriate
Include brief explanation for each answer.

Format your response as JSON array with this structure:
[{
  "question": "Question text here?",
  "option_a": "Option A",
  "option_b": "Option B", 
  "option_c": "Option C",
  "option_d": "Option D",
  "correct_option": "A",
  "explanation": "Brief explanation of the correct answer"
}]'
),
(
    'Railway Group D - Mathematics',
    'Railway',
    'Mathematics',
    'easy',
    10,
    10,
    'Generate 10 multiple choice questions for Railway Group D exam preparation on Mathematics. Include questions on:
- Number System (2 questions)
- Percentage & Ratio (2 questions)
- Time & Work (2 questions)
- Simple & Compound Interest (2 questions)
- Profit & Loss (2 questions)

Each question should have 4 options (A, B, C, D) with only one correct answer.
Difficulty level: Easy to Medium (suitable for Railway Group D aspirants)
Questions should be calculation-based with practical examples.
Include step-by-step explanation for each answer.

Format your response as JSON array with this structure:
[{
  "question": "Question text here?",
  "option_a": "Option A",
  "option_b": "Option B",
  "option_c": "Option C",
  "option_d": "Option D",
  "correct_option": "B",
  "explanation": "Step by step solution"
}]'
),
(
    'Bank PO - Reasoning',
    'Bank',
    'Reasoning',
    'medium',
    10,
    10,
    'Generate 10 multiple choice questions for Bank PO exam preparation on Logical Reasoning. Include questions on:
- Blood Relations (2 questions)
- Direction Sense (2 questions)
- Coding-Decoding (2 questions)
- Syllogism (2 questions)
- Seating Arrangement (2 questions)

Each question should have 4 options (A, B, C, D) with only one correct answer.
Difficulty level: Medium (suitable for Bank PO aspirants)
Include clear logical explanation for each answer.

Format your response as JSON array with this structure:
[{
  "question": "Question text here?",
  "option_a": "Option A",
  "option_b": "Option B",
  "option_c": "Option C",
  "option_d": "Option D",
  "correct_option": "C",
  "explanation": "Logical explanation"
}]'
),
(
    'RPSC - Hindi',
    'RPSC',
    'Hindi',
    'medium',
    10,
    10,
    'Generate 10 multiple choice questions for RPSC exam preparation on Hindi Language. Include questions on:
- संधि (Sandhi) - 2 questions
- समास (Samas) - 2 questions
- पर्यायवाची शब्द (Synonyms) - 2 questions
- विलोम शब्द (Antonyms) - 2 questions
- मुहावरे और लोकोक्तियाँ (Idioms) - 2 questions

Each question should have 4 options (A, B, C, D) with only one correct answer.
Difficulty level: Medium (suitable for RPSC aspirants)
Questions should be in Hindi.
Include explanation in Hindi for each answer.

Format your response as JSON array with this structure:
[{
  "question": "प्रश्न यहाँ लिखें?",
  "option_a": "विकल्प A",
  "option_b": "विकल्प B",
  "option_c": "विकल्प C",
  "option_d": "विकल्प D",
  "correct_option": "A",
  "explanation": "उत्तर का स्पष्टीकरण"
}]'
),
(
    'Police Constable - General Knowledge',
    'Police',
    'General Knowledge',
    'easy',
    10,
    10,
    'Generate 10 multiple choice questions for Rajasthan Police Constable exam preparation on General Knowledge. Include questions on:
- Rajasthan GK (3 questions) - History, Geography, Culture
- Indian History (2 questions)
- Indian Geography (2 questions)
- Current Affairs (2 questions)
- Basic Science (1 question)

Each question should have 4 options (A, B, C, D) with only one correct answer.
Difficulty level: Easy (suitable for Police Constable aspirants)
Focus on Rajasthan-specific content where applicable.
Include brief explanation for each answer.

Format your response as JSON array with this structure:
[{
  "question": "Question text here?",
  "option_a": "Option A",
  "option_b": "Option B",
  "option_c": "Option C",
  "option_d": "Option D",
  "correct_option": "D",
  "explanation": "Brief explanation"
}]'
);

-- Success message
SELECT 'Daily Test System tables created successfully!' as message;
