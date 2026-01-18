-- Create sample daily tests for testing
-- This will create tests for today and previous days

-- Today's tests
INSERT INTO generated_daily_tests (
    id,
    title,
    exam_category,
    subject,
    difficulty,
    questions_count,
    duration_minutes,
    test_date,
    status,
    questions,
    created_at,
    updated_at
) VALUES 
-- Today's Tests
(
    gen_random_uuid(),
    'Daily Practice Test - SSC General Knowledge',
    'SSC',
    'General Knowledge',
    'medium',
    10,
    15,
    CURRENT_DATE,
    'published',
    '[
        {
            "id": 1,
            "question": "Who is the current President of India?",
            "options": ["Ram Nath Kovind", "Droupadi Murmu", "Pranab Mukherjee", "A.P.J. Abdul Kalam"],
            "correct_answer": 1,
            "explanation": "Droupadi Murmu is the current President of India, serving since July 2022."
        },
        {
            "id": 2,
            "question": "Which planet is known as the Red Planet?",
            "options": ["Venus", "Mars", "Jupiter", "Saturn"],
            "correct_answer": 1,
            "explanation": "Mars is known as the Red Planet due to iron oxide on its surface."
        },
        {
            "id": 3,
            "question": "What is the capital of Rajasthan?",
            "options": ["Jodhpur", "Udaipur", "Jaipur", "Kota"],
            "correct_answer": 2,
            "explanation": "Jaipur is the capital city of Rajasthan, also known as the Pink City."
        },
        {
            "id": 4,
            "question": "Who wrote the Indian National Anthem?",
            "options": ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Mahatma Gandhi"],
            "correct_answer": 0,
            "explanation": "Jana Gana Mana was written by Rabindranath Tagore."
        },
        {
            "id": 5,
            "question": "Which is the longest river in India?",
            "options": ["Yamuna", "Brahmaputra", "Ganga", "Godavari"],
            "correct_answer": 2,
            "explanation": "The Ganga is the longest river in India, flowing for about 2,525 km."
        },
        {
            "id": 6,
            "question": "In which year did India gain independence?",
            "options": ["1945", "1946", "1947", "1948"],
            "correct_answer": 2,
            "explanation": "India gained independence on August 15, 1947."
        },
        {
            "id": 7,
            "question": "What is the currency of Japan?",
            "options": ["Yuan", "Won", "Yen", "Ringgit"],
            "correct_answer": 2,
            "explanation": "The Japanese Yen is the official currency of Japan."
        },
        {
            "id": 8,
            "question": "Which gas is most abundant in Earth''s atmosphere?",
            "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            "correct_answer": 2,
            "explanation": "Nitrogen makes up about 78% of Earth''s atmosphere."
        },
        {
            "id": 9,
            "question": "Who is known as the Father of the Nation in India?",
            "options": ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"],
            "correct_answer": 1,
            "explanation": "Mahatma Gandhi is known as the Father of the Nation in India."
        },
        {
            "id": 10,
            "question": "Which is the smallest state in India by area?",
            "options": ["Sikkim", "Tripura", "Goa", "Manipur"],
            "correct_answer": 2,
            "explanation": "Goa is the smallest state in India by area."
        }
    ]'::jsonb,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Daily Practice Test - Railway Mathematics',
    'Railway',
    'Mathematics',
    'easy',
    10,
    15,
    CURRENT_DATE,
    'published',
    '[
        {
            "id": 1,
            "question": "What is 15% of 200?",
            "options": ["25", "30", "35", "40"],
            "correct_answer": 1,
            "explanation": "15% of 200 = (15/100) × 200 = 30"
        },
        {
            "id": 2,
            "question": "If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?",
            "options": ["120 km", "130 km", "140 km", "150 km"],
            "correct_answer": 3,
            "explanation": "Distance = Speed × Time = 60 × 2.5 = 150 km"
        },
        {
            "id": 3,
            "question": "What is the square root of 144?",
            "options": ["11", "12", "13", "14"],
            "correct_answer": 1,
            "explanation": "√144 = 12 because 12 × 12 = 144"
        },
        {
            "id": 4,
            "question": "If 3x + 5 = 20, what is the value of x?",
            "options": ["3", "4", "5", "6"],
            "correct_answer": 2,
            "explanation": "3x + 5 = 20, so 3x = 15, therefore x = 5"
        },
        {
            "id": 5,
            "question": "What is 7 × 8?",
            "options": ["54", "56", "58", "60"],
            "correct_answer": 1,
            "explanation": "7 × 8 = 56"
        },
        {
            "id": 6,
            "question": "What is the area of a rectangle with length 8 cm and width 5 cm?",
            "options": ["35 cm²", "40 cm²", "45 cm²", "50 cm²"],
            "correct_answer": 1,
            "explanation": "Area = length × width = 8 × 5 = 40 cm²"
        },
        {
            "id": 7,
            "question": "What is 25% of 80?",
            "options": ["15", "20", "25", "30"],
            "correct_answer": 1,
            "explanation": "25% of 80 = (25/100) × 80 = 20"
        },
        {
            "id": 8,
            "question": "If a dozen eggs cost ₹60, what is the cost of 8 eggs?",
            "options": ["₹35", "₹40", "₹45", "₹50"],
            "correct_answer": 1,
            "explanation": "Cost per egg = 60/12 = ₹5, so 8 eggs = 8 × 5 = ₹40"
        },
        {
            "id": 9,
            "question": "What is the next number in the series: 2, 4, 8, 16, ?",
            "options": ["24", "28", "32", "36"],
            "correct_answer": 2,
            "explanation": "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
        },
        {
            "id": 10,
            "question": "What is 100 - 37?",
            "options": ["63", "67", "73", "77"],
            "correct_answer": 0,
            "explanation": "100 - 37 = 63"
        }
    ]'::jsonb,
    NOW(),
    NOW()
),

-- Yesterday's test
(
    gen_random_uuid(),
    'Daily Practice Test - Bank English',
    'Bank',
    'English',
    'medium',
    10,
    15,
    CURRENT_DATE - INTERVAL '1 day',
    'published',
    '[
        {
            "id": 1,
            "question": "Choose the correct synonym for ''Abundant'':",
            "options": ["Scarce", "Plentiful", "Limited", "Rare"],
            "correct_answer": 1,
            "explanation": "Abundant means existing in large quantities; plentiful."
        },
        {
            "id": 2,
            "question": "Identify the error in: ''He don''t like to eat vegetables.''",
            "options": ["He", "don''t", "like", "vegetables"],
            "correct_answer": 1,
            "explanation": "Should be ''doesn''t'' instead of ''don''t'' for third person singular."
        },
        {
            "id": 3,
            "question": "Choose the correct antonym for ''Optimistic'':",
            "options": ["Hopeful", "Positive", "Pessimistic", "Confident"],
            "correct_answer": 2,
            "explanation": "Pessimistic is the opposite of optimistic."
        },
        {
            "id": 4,
            "question": "Fill in the blank: ''She has been working here _____ five years.''",
            "options": ["since", "for", "from", "during"],
            "correct_answer": 1,
            "explanation": "''For'' is used with duration of time."
        },
        {
            "id": 5,
            "question": "Choose the correctly spelled word:",
            "options": ["Recieve", "Receive", "Receve", "Receeve"],
            "correct_answer": 1,
            "explanation": "The correct spelling is ''Receive'' (i before e except after c)."
        },
        {
            "id": 6,
            "question": "What is the plural of ''Child''?",
            "options": ["Childs", "Children", "Childes", "Childrens"],
            "correct_answer": 1,
            "explanation": "The plural of child is children."
        },
        {
            "id": 7,
            "question": "Choose the correct form: ''If I _____ rich, I would help the poor.''",
            "options": ["am", "was", "were", "will be"],
            "correct_answer": 2,
            "explanation": "In conditional sentences, we use ''were'' for all persons."
        },
        {
            "id": 8,
            "question": "What does ''Break the ice'' mean?",
            "options": ["To break something", "To start a conversation", "To be cold", "To stop working"],
            "correct_answer": 1,
            "explanation": "''Break the ice'' means to initiate conversation or social interaction."
        },
        {
            "id": 9,
            "question": "Choose the correct preposition: ''She is good _____ mathematics.''",
            "options": ["in", "at", "on", "with"],
            "correct_answer": 1,
            "explanation": "We use ''good at'' for skills and abilities."
        },
        {
            "id": 10,
            "question": "Identify the noun in: ''The beautiful flowers bloom in spring.''",
            "options": ["beautiful", "flowers", "bloom", "spring"],
            "correct_answer": 1,
            "explanation": "''Flowers'' is a noun (thing), while ''spring'' is also a noun but ''flowers'' is the main subject."
        }
    ]'::jsonb,
    NOW(),
    NOW()
),

-- Day before yesterday
(
    gen_random_uuid(),
    'Daily Practice Test - RPSC History',
    'RPSC',
    'History',
    'hard',
    10,
    15,
    CURRENT_DATE - INTERVAL '2 days',
    'published',
    '[
        {
            "id": 1,
            "question": "Who founded the Mauryan Empire?",
            "options": ["Ashoka", "Chandragupta Maurya", "Bindusara", "Bimbisara"],
            "correct_answer": 1,
            "explanation": "Chandragupta Maurya founded the Mauryan Empire in 321 BCE."
        },
        {
            "id": 2,
            "question": "The Battle of Panipat (1526) was fought between:",
            "options": ["Babur and Ibrahim Lodi", "Akbar and Hemu", "Ahmad Shah Abdali and Marathas", "Prithviraj and Ghori"],
            "correct_answer": 0,
            "explanation": "The First Battle of Panipat was fought between Babur and Ibrahim Lodi in 1526."
        },
        {
            "id": 3,
            "question": "Who was the first Governor-General of India?",
            "options": ["Warren Hastings", "Lord Cornwallis", "Lord Wellesley", "Lord Dalhousie"],
            "correct_answer": 0,
            "explanation": "Warren Hastings was the first Governor-General of India (1773-1785)."
        },
        {
            "id": 4,
            "question": "The Quit India Movement was launched in:",
            "options": ["1940", "1941", "1942", "1943"],
            "correct_answer": 2,
            "explanation": "The Quit India Movement was launched on August 8, 1942."
        },
        {
            "id": 5,
            "question": "Who built the Red Fort in Delhi?",
            "options": ["Akbar", "Shah Jahan", "Aurangzeb", "Humayun"],
            "correct_answer": 1,
            "explanation": "The Red Fort was built by Shah Jahan in the 17th century."
        },
        {
            "id": 6,
            "question": "The Indus Valley Civilization belonged to which age?",
            "options": ["Stone Age", "Bronze Age", "Iron Age", "Copper Age"],
            "correct_answer": 1,
            "explanation": "The Indus Valley Civilization belonged to the Bronze Age (3300-1300 BCE)."
        },
        {
            "id": 7,
            "question": "Who was known as the ''Iron Man of India''?",
            "options": ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "Bhagat Singh"],
            "correct_answer": 1,
            "explanation": "Sardar Vallabhbhai Patel was known as the Iron Man of India."
        },
        {
            "id": 8,
            "question": "The Sepoy Mutiny started in which year?",
            "options": ["1856", "1857", "1858", "1859"],
            "correct_answer": 1,
            "explanation": "The Sepoy Mutiny (First War of Independence) started in 1857."
        },
        {
            "id": 9,
            "question": "Who founded the Arya Samaj?",
            "options": ["Raja Ram Mohan Roy", "Dayananda Saraswati", "Keshab Chandra Sen", "Ishwar Chandra Vidyasagar"],
            "correct_answer": 1,
            "explanation": "Arya Samaj was founded by Dayananda Saraswati in 1875."
        },
        {
            "id": 10,
            "question": "The capital of the Vijayanagara Empire was:",
            "options": ["Madurai", "Thanjavur", "Hampi", "Kanchipuram"],
            "correct_answer": 2,
            "explanation": "Hampi was the capital of the Vijayanagara Empire."
        }
    ]'::jsonb,
    NOW(),
    NOW()
);

-- Check the created tests
SELECT 
    id,
    title,
    exam_category,
    subject,
    difficulty,
    test_date,
    status,
    questions_count
FROM generated_daily_tests
WHERE test_date >= CURRENT_DATE - INTERVAL '3 days'
ORDER BY test_date DESC, exam_category;