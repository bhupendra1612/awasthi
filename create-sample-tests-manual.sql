-- Create sample regular tests with questions
-- First, insert sample tests
INSERT INTO tests (
    title, 
    description, 
    category, 
    subject, 
    duration_minutes, 
    total_questions, 
    total_marks, 
    is_free, 
    price, 
    original_price, 
    is_featured, 
    is_published, 
    negative_marks
) VALUES 
(
    'SSC CGL Mock Test - General Knowledge',
    'Comprehensive mock test for SSC CGL General Knowledge section',
    'SSC',
    'General Knowledge',
    60,
    25,
    50,
    true,
    0,
    199,
    true,
    true,
    true
),
(
    'Railway Group D Practice Test',
    'Practice test for Railway Group D examination',
    'Railway',
    'General Science',
    90,
    100,
    100,
    true,
    0,
    299,
    false,
    true,
    true
),
(
    'Bank PO Reasoning Test',
    'Reasoning ability test for Bank PO preparation',
    'Bank',
    'Reasoning',
    45,
    30,
    60,
    false,
    99,
    199,
    true,
    true,
    true
);

-- Get the test IDs (you'll need to run this and get the actual IDs)
-- For now, let's assume the test IDs are generated. 
-- You can run: SELECT id, title FROM tests ORDER BY created_at DESC LIMIT 3;
-- Then use those IDs in the questions below

-- Sample questions for SSC CGL test (replace test_id with actual ID)
-- INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, marks, negative_marks, order_index)
-- VALUES 
-- ('actual-test-id-here', 'Who is the current President of India?', 'Ram Nath Kovind', 'Droupadi Murmu', 'Pranab Mukherjee', 'A.P.J. Abdul Kalam', 'B', 'Droupadi Murmu is the current President of India, serving since July 2022.', 2, 0.5, 1),
-- ('actual-test-id-here', 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B', 'Mars is known as the Red Planet due to iron oxide on its surface.', 2, 0.5, 2);

-- Note: After running the test insert, get the actual test IDs and create questions for each test