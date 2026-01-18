-- First, let's check if we have any blogs
SELECT COUNT(*) as total_blogs FROM blogs;
SELECT COUNT(*) as published_blogs FROM blogs WHERE is_published = true;

-- Check existing blog slugs
SELECT id, title, slug, is_published FROM blogs ORDER BY created_at DESC;

-- Clean up any existing test blogs
DELETE FROM blogs WHERE title LIKE '%Test%' OR title LIKE '%test%';

-- Add proper sample blogs with clean slugs
INSERT INTO blogs (
    id,
    title,
    slug,
    content,
    excerpt,
    cover_image,
    author_id,
    is_published,
    published_at,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'SSC CGL Preparation Strategy 2024',
    'ssc-cgl-preparation-strategy-2024',
    'Staff Selection Commission Combined Graduate Level (SSC CGL) is one of the most competitive exams in India. Here''s your complete preparation guide.

**Understanding SSC CGL Exam Pattern:**

The SSC CGL exam is conducted in four tiers:
- Tier 1: Computer Based Examination (Objective)
- Tier 2: Computer Based Examination (Objective)
- Tier 3: Descriptive Paper (Pen and Paper)
- Tier 4: Computer Proficiency Test/Skill Test

**Subject-wise Preparation Strategy:**

**1. Quantitative Aptitude:**
- Focus on basic arithmetic, algebra, geometry, and trigonometry
- Practice time and work, percentage, profit and loss problems
- Solve at least 50 questions daily

**2. General Intelligence & Reasoning:**
- Master verbal and non-verbal reasoning
- Practice coding-decoding, blood relations, direction sense
- Focus on logical reasoning and analytical ability

**3. English Language & Comprehension:**
- Improve vocabulary and grammar
- Practice reading comprehension daily
- Focus on error detection and sentence improvement

**4. General Awareness:**
- Stay updated with current affairs
- Study Indian history, geography, and polity
- Focus on science and technology developments

**Time Management Tips:**
- Create a realistic study schedule
- Take regular mock tests
- Analyze your performance and improve weak areas
- Maintain consistency in preparation

**Recommended Study Materials:**
- NCERT books for basic concepts
- Previous year question papers
- Online mock test series
- Current affairs magazines

Success in SSC CGL requires dedication, smart preparation, and consistent practice. Join Awasthi Classes for expert guidance and comprehensive study materials.',
    'Complete preparation strategy for SSC CGL 2024 with expert tips, study plan, and recommended resources from Awasthi Classes.',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'REET Exam Complete Guide 2024',
    'reet-exam-complete-guide-2024',
    'Rajasthan Eligibility Examination for Teachers (REET) is conducted for recruitment of teachers in government schools of Rajasthan.

**REET Exam Pattern:**

**Level 1 (Classes I-V):**
- Child Development & Pedagogy: 30 marks
- Language I (Hindi): 30 marks
- Language II (English/Sanskrit/Urdu): 30 marks
- Mathematics: 30 marks
- Environmental Studies: 30 marks

**Level 2 (Classes VI-VIII):**
- Child Development & Pedagogy: 30 marks
- Language I (Hindi): 30 marks
- Language II (English/Sanskrit/Urdu): 30 marks
- Mathematics & Science OR Social Studies: 60 marks

**Preparation Strategy:**

**1. Child Development & Pedagogy:**
- Understand child psychology and development stages
- Study learning theories and teaching methods
- Practice questions on inclusive education

**2. Language Sections:**
- Focus on grammar, comprehension, and pedagogy
- Practice unseen passages and poetry
- Improve vocabulary and writing skills

**3. Mathematics:**
- Master basic arithmetic and geometry
- Practice word problems and data interpretation
- Focus on mathematical reasoning and pedagogy

**4. Environmental Studies/Science:**
- Study NCERT books thoroughly
- Focus on environmental awareness and conservation
- Practice questions on natural resources and pollution

**5. Social Studies:**
- Cover Indian history, geography, and civics
- Study Rajasthan-specific topics in detail
- Focus on current affairs and social issues

**Important Tips:**
- Solve previous year papers regularly
- Take online mock tests
- Focus on Rajasthan GK and current affairs
- Maintain a proper study schedule
- Practice time management

**Rajasthan Specific Topics:**
- History of Rajasthan
- Geography and climate
- Art, culture, and traditions
- Important personalities
- Government schemes and policies

Join Awasthi Classes for comprehensive REET preparation with experienced faculty and updated study materials.',
    'Complete REET exam guide 2024 with syllabus, preparation strategy, and Rajasthan-specific topics from expert teachers.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW() - INTERVAL '1 day'
),
(
    uuid_generate_v4(),
    'Railway Group D Exam Preparation Tips',
    'railway-group-d-exam-preparation-tips',
    'Railway Group D is one of the largest recruitment drives in India. Here''s how to prepare effectively for this competitive exam.

**Railway Group D Exam Pattern:**

The exam consists of 100 questions for 90 minutes:
- Mathematics: 25 questions
- General Intelligence & Reasoning: 30 questions
- General Science: 25 questions
- General Awareness & Current Affairs: 20 questions

**Subject-wise Preparation:**

**1. Mathematics (25 marks):**
- Number System and BODMAS
- Decimals, Fractions, and LCM HCF
- Ratio and Proportion, Percentage
- Time and Work, Time and Distance
- Simple and Compound Interest
- Profit and Loss, Average
- Mensuration and Basic Geometry
- Elementary Statistics

**2. General Intelligence & Reasoning (30 marks):**
- Analogies and Classification
- Coding-Decoding
- Blood Relations
- Direction Sense Test
- Logical Venn Diagrams
- Puzzle and Seating Arrangement
- Mathematical Operations
- Series Completion

**3. General Science (25 marks):**
- Physics: Motion, Force, Energy, Light, Sound
- Chemistry: Acids, Bases, Metals, Non-metals
- Biology: Human Body, Plants, Animals, Diseases
- Environmental Science and Ecology

**4. General Awareness & Current Affairs (20 marks):**
- Indian History and Freedom Struggle
- Geography of India
- Indian Polity and Constitution
- Economics and Budget
- Sports and Awards
- Books and Authors
- Current Affairs (last 6 months)

**Preparation Strategy:**

**Phase 1 (Foundation - 2 months):**
- Complete basic concepts of all subjects
- Read NCERT books for Science
- Start with easy topics first

**Phase 2 (Practice - 2 months):**
- Solve topic-wise questions
- Take sectional tests
- Identify weak areas and improve

**Phase 3 (Mock Tests - 1 month):**
- Take full-length mock tests daily
- Analyze performance and time management
- Revise important formulas and facts

**Important Tips:**
- Focus on accuracy over speed initially
- Maintain a current affairs diary
- Practice mental math for quick calculations
- Stay updated with railway-related news
- Join online test series for better practice

**Time Management:**
- Mathematics: 20-25 minutes
- Reasoning: 25-30 minutes
- General Science: 20-25 minutes
- General Awareness: 15-20 minutes
- Review: 5-10 minutes

Railway Group D offers excellent career opportunities with job security and good salary. With proper preparation and guidance, you can crack this exam. Join Awasthi Classes for structured preparation and expert guidance.',
    'Complete Railway Group D preparation guide with exam pattern, syllabus, and effective study strategy for success.',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW() - INTERVAL '2 days'
);

-- Verify the blogs were inserted
SELECT id, title, slug, is_published FROM blogs WHERE is_published = true ORDER BY created_at DESC;