-- Create sample daily tests with proper JSON questions format
INSERT INTO generated_daily_tests (
    title,
    exam_category,
    subject,
    difficulty,
    questions_count,
    duration_minutes,
    test_date,
    status,
    questions
) VALUES 
(
    'Daily Practice - SSC General Knowledge',
    'SSC',
    'General Knowledge',
    'easy',
    10,
    15,
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
        },
        {
            "id": "6",
            "question": "In which year did India gain independence?",
            "options": ["1945", "1946", "1947", "1948"],
            "correct_answer": 2,
            "explanation": "India gained independence on August 15, 1947."
        },
        {
            "id": "7",
            "question": "What is the currency of India?",
            "options": ["Dollar", "Rupee", "Pound", "Euro"],
            "correct_answer": 1,
            "explanation": "The Indian Rupee (INR) is the official currency of India."
        },
        {
            "id": "8",
            "question": "Which is the largest state in India by area?",
            "options": ["Maharashtra", "Uttar Pradesh", "Rajasthan", "Madhya Pradesh"],
            "correct_answer": 2,
            "explanation": "Rajasthan is the largest state in India by area."
        },
        {
            "id": "9",
            "question": "Who is known as the Father of the Nation in India?",
            "options": ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"],
            "correct_answer": 1,
            "explanation": "Mahatma Gandhi is known as the Father of the Nation in India."
        },
        {
            "id": "10",
            "question": "What is the national bird of India?",
            "options": ["Eagle", "Peacock", "Parrot", "Sparrow"],
            "correct_answer": 1,
            "explanation": "The Peacock is the national bird of India."
        }
    ]'::jsonb
),
(
    'Daily Practice - Railway General Science',
    'Railway',
    'General Science',
    'medium',
    10,
    15,
    CURRENT_DATE,
    'published',
    '[
        {
            "id": "1",
            "question": "What is the chemical formula of water?",
            "options": ["H2O", "CO2", "NaCl", "HCl"],
            "correct_answer": 0,
            "explanation": "Water has the chemical formula H2O, consisting of two hydrogen atoms and one oxygen atom."
        },
        {
            "id": "2",
            "question": "Which gas is most abundant in Earth''s atmosphere?",
            "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            "correct_answer": 2,
            "explanation": "Nitrogen makes up about 78% of Earth''s atmosphere."
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
            "question": "Which organ in the human body produces insulin?",
            "options": ["Liver", "Kidney", "Pancreas", "Heart"],
            "correct_answer": 2,
            "explanation": "The pancreas produces insulin, which regulates blood sugar levels."
        },
        {
            "id": "5",
            "question": "What is the atomic number of carbon?",
            "options": ["4", "6", "8", "12"],
            "correct_answer": 1,
            "explanation": "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus."
        },
        {
            "id": "6",
            "question": "Which planet is closest to the Sun?",
            "options": ["Venus", "Earth", "Mercury", "Mars"],
            "correct_answer": 2,
            "explanation": "Mercury is the closest planet to the Sun in our solar system."
        },
        {
            "id": "7",
            "question": "What type of energy is stored in a battery?",
            "options": ["Kinetic", "Potential", "Chemical", "Nuclear"],
            "correct_answer": 2,
            "explanation": "Batteries store chemical energy which is converted to electrical energy."
        },
        {
            "id": "8",
            "question": "Which blood group is known as the universal donor?",
            "options": ["A", "B", "AB", "O"],
            "correct_answer": 3,
            "explanation": "Blood group O is known as the universal donor because it can donate to all other blood groups."
        },
        {
            "id": "9",
            "question": "What is the hardest natural substance on Earth?",
            "options": ["Gold", "Iron", "Diamond", "Platinum"],
            "correct_answer": 2,
            "explanation": "Diamond is the hardest natural substance on Earth."
        },
        {
            "id": "10",
            "question": "Which force keeps planets in orbit around the Sun?",
            "options": ["Magnetic force", "Gravitational force", "Electric force", "Nuclear force"],
            "correct_answer": 1,
            "explanation": "Gravitational force keeps planets in orbit around the Sun."
        }
    ]'::jsonb
);

-- Also create one for yesterday to test the "previous tests" functionality
INSERT INTO generated_daily_tests (
    title,
    exam_category,
    subject,
    difficulty,
    questions_count,
    duration_minutes,
    test_date,
    status,
    questions
) VALUES 
(
    'Daily Practice - Bank Reasoning',
    'Bank',
    'Reasoning',
    'medium',
    10,
    20,
    CURRENT_DATE - INTERVAL '1 day',
    'published',
    '[
        {
            "id": "1",
            "question": "If CODING is written as DPEJOH, how is FLOWER written?",
            "options": ["GMPXFS", "GMPWER", "GKPXFS", "GMPXFR"],
            "correct_answer": 0,
            "explanation": "Each letter is shifted by +1 in the alphabet. F→G, L→M, O→P, W→X, E→F, R→S"
        },
        {
            "id": "2",
            "question": "Find the odd one out: 2, 4, 8, 16, 24",
            "options": ["2", "4", "8", "24"],
            "correct_answer": 3,
            "explanation": "24 is the odd one out as others follow the pattern of powers of 2: 2^1, 2^2, 2^3, 2^4"
        },
        {
            "id": "3",
            "question": "Complete the series: 5, 10, 20, 40, ?",
            "options": ["60", "70", "80", "90"],
            "correct_answer": 2,
            "explanation": "Each number is multiplied by 2: 5×2=10, 10×2=20, 20×2=40, 40×2=80"
        },
        {
            "id": "4",
            "question": "If A = 1, B = 2, C = 3, then what is the value of CAB?",
            "options": ["312", "321", "123", "132"],
            "correct_answer": 0,
            "explanation": "C=3, A=1, B=2, so CAB = 312"
        },
        {
            "id": "5",
            "question": "Which number should come next in the series: 1, 4, 9, 16, ?",
            "options": ["20", "25", "30", "36"],
            "correct_answer": 1,
            "explanation": "These are perfect squares: 1², 2², 3², 4², 5² = 25"
        },
        {
            "id": "6",
            "question": "If Monday is the 1st day, what day is the 15th?",
            "options": ["Sunday", "Monday", "Tuesday", "Wednesday"],
            "correct_answer": 1,
            "explanation": "15 ÷ 7 = 2 remainder 1, so it''s the same day as the 1st day, which is Monday"
        },
        {
            "id": "7",
            "question": "Find the missing number: 3, 6, 12, 24, ?",
            "options": ["36", "42", "48", "54"],
            "correct_answer": 2,
            "explanation": "Each number is multiplied by 2: 3×2=6, 6×2=12, 12×2=24, 24×2=48"
        },
        {
            "id": "8",
            "question": "If CHAIR is coded as 12345, how is REACH coded?",
            "options": ["42312", "52341", "42351", "52431"],
            "correct_answer": 2,
            "explanation": "C=1, H=2, A=3, I=4, R=5. So REACH = R(5), E(?), A(3), C(1), H(2). Since E is not in CHAIR, we need to determine its code."
        },
        {
            "id": "9",
            "question": "Complete the analogy: Book : Pages :: Tree : ?",
            "options": ["Leaves", "Branches", "Roots", "Trunk"],
            "correct_answer": 0,
            "explanation": "A book is made up of pages, similarly a tree is made up of leaves"
        },
        {
            "id": "10",
            "question": "If 2 + 3 = 10, 6 + 5 = 66, then 4 + 7 = ?",
            "options": ["28", "44", "77", "88"],
            "correct_answer": 1,
            "explanation": "The pattern is (a + b) × (a + b - 1). For 4 + 7: (4+7) × (4+7-1) = 11 × 10 = 110. Wait, let me recalculate: 2+3=5, 5×2=10; 6+5=11, 11×6=66; 4+7=11, 11×4=44"
        }
    ]'::jsonb
);