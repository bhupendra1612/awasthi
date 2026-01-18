# Manual Fix for Daily Tests - URGENT

## Problem
The `generated_daily_tests` table is missing the `questions` column, which is needed for the daily tests to work.

## Quick Manual Fix

### Step 1: Add the Questions Column
Go to your Supabase dashboard → SQL Editor and run this command:

```sql
ALTER TABLE generated_daily_tests 
ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;
```

### Step 2: Insert Sample Daily Tests
After adding the column, run this command to create sample tests:

```sql
INSERT INTO generated_daily_tests (
    title, exam_category, subject, difficulty, questions_count, 
    duration_minutes, test_date, status, questions
) VALUES 
(
    'Daily Practice - SSC General Knowledge',
    'SSC',
    'General Knowledge',
    'easy',
    5,
    10,
    CURRENT_DATE,
    'published',
    '[
        {
            "id": "1",
            "question": "Who is the current President of India?",
            "options": ["Ram Nath Kovind", "Droupadi Murmu", "Pranab Mukherjee", "A.P.J. Abdul Kalam"],
            "correct_answer": 1,
            "explanation": "Droupadi Murmu is the current President of India, serving since July 2022."
        },
        {
            "id": "2",
            "question": "Which planet is known as the Red Planet?",
            "options": ["Venus", "Mars", "Jupiter", "Saturn"],
            "correct_answer": 1,
            "explanation": "Mars is known as the Red Planet due to iron oxide on its surface."
        },
        {
            "id": "3",
            "question": "What is the capital of Rajasthan?",
            "options": ["Jodhpur", "Udaipur", "Jaipur", "Kota"],
            "correct_answer": 2,
            "explanation": "Jaipur is the capital city of Rajasthan, also known as the Pink City."
        },
        {
            "id": "4",
            "question": "Who wrote the Indian National Anthem?",
            "options": ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Mahatma Gandhi"],
            "correct_answer": 0,
            "explanation": "Jana Gana Mana was written by Rabindranath Tagore."
        },
        {
            "id": "5",
            "question": "Which is the longest river in India?",
            "options": ["Yamuna", "Brahmaputra", "Ganga", "Godavari"],
            "correct_answer": 2,
            "explanation": "The Ganga is the longest river in India, flowing for about 2,525 km."
        }
    ]'::jsonb
),
(
    'Daily Practice - Railway General Science',
    'Railway',
    'General Science',
    'medium',
    5,
    10,
    CURRENT_DATE,
    'published',
    '[
        {
            "id": "1",
            "question": "What is the chemical formula of water?",
            "options": ["H2O", "CO2", "NaCl", "HCl"],
            "correct_answer": 0,
            "explanation": "Water has the chemical formula H2O."
        },
        {
            "id": "2",
            "question": "Which gas is most abundant in Earth atmosphere?",
            "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            "correct_answer": 2,
            "explanation": "Nitrogen makes up about 78% of Earth atmosphere."
        },
        {
            "id": "3",
            "question": "What is the speed of light in vacuum?",
            "options": ["3 × 10^8 m/s", "3 × 10^6 m/s", "3 × 10^10 m/s", "3 × 10^4 m/s"],
            "correct_answer": 0,
            "explanation": "The speed of light in vacuum is approximately 3 × 10^8 meters per second."
        },
        {
            "id": "4",
            "question": "Which organ produces insulin?",
            "options": ["Liver", "Kidney", "Pancreas", "Heart"],
            "correct_answer": 2,
            "explanation": "The pancreas produces insulin, which regulates blood sugar levels."
        },
        {
            "id": "5",
            "question": "What is the atomic number of carbon?",
            "options": ["4", "6", "8", "12"],
            "correct_answer": 1,
            "explanation": "Carbon has an atomic number of 6."
        }
    ]'::jsonb
);
```

### Step 3: Test the Daily Tests
After running both SQL commands:
1. Go to `http://localhost:4002/tests`
2. You should see the daily practice tests
3. Click "Start Test" on any daily practice test
4. It should now work properly!

## Alternative: Try the API Again
After running the SQL commands manually, you can also try the create test data page again:
`http://localhost:4002/create-test-data`

## What This Does
- ✅ Adds the missing `questions` column to store questions as JSON
- ✅ Creates 2 sample daily tests with proper question format
- ✅ Makes daily tests work immediately in the modal interface

## Expected Result
After running these commands, daily practice tests should work perfectly with:
- ✅ Proper question display
- ✅ Multiple choice options
- ✅ Timer functionality
- ✅ Score calculation
- ✅ Results with explanations