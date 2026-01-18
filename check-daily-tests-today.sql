-- Check if there are daily tests for today
SELECT 
    id,
    title,
    exam_category,
    subject,
    difficulty,
    questions_count,
    duration_minutes,
    test_date,
    status,
    created_at
FROM generated_daily_tests
WHERE test_date = CURRENT_DATE
AND status = 'published'
ORDER BY exam_category;

-- If no tests for today, check recent tests
SELECT 
    test_date,
    COUNT(*) as test_count,
    status
FROM generated_daily_tests
WHERE test_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY test_date, status
ORDER BY test_date DESC;
