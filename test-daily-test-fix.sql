-- Test query to check daily test data structure
-- Run this to see what data exists for daily tests

-- Check generated daily tests
SELECT 
    id,
    title,
    exam_category,
    subject,
    questions_count,
    status,
    test_date,
    CASE 
        WHEN questions IS NOT NULL THEN 'Has JSON questions'
        ELSE 'No JSON questions'
    END as questions_status
FROM generated_daily_tests 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if there are questions in the separate table
SELECT 
    gdt.id as test_id,
    gdt.title,
    COUNT(gdq.id) as question_count
FROM generated_daily_tests gdt
LEFT JOIN generated_daily_questions gdq ON gdt.id = gdq.daily_test_id
GROUP BY gdt.id, gdt.title
ORDER BY gdt.created_at DESC
LIMIT 5;

-- Check daily test attempts
SELECT 
    dta.daily_test_id,
    gdt.title,
    COUNT(dta.id) as attempt_count
FROM daily_test_attempts dta
JOIN generated_daily_tests gdt ON dta.daily_test_id = gdt.id
GROUP BY dta.daily_test_id, gdt.title
ORDER BY attempt_count DESC;