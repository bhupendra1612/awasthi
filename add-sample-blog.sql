-- Add a sample published blog for testing
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
) VALUES (
    uuid_generate_v4(),
    'Top 10 Tips for SSC CGL Preparation',
    'top-10-tips-ssc-cgl-preparation-' || extract(epoch from now())::text,
    'Preparing for SSC CGL requires a strategic approach and consistent effort. Here are the top 10 tips that will help you crack the exam with flying colors.

1. **Understand the Exam Pattern**: Familiarize yourself with the SSC CGL exam pattern, including the number of papers, subjects, and marking scheme.

2. **Create a Study Schedule**: Develop a realistic study timetable that covers all subjects systematically.

3. **Focus on Basics**: Build a strong foundation in mathematics, reasoning, English, and general awareness.

4. **Practice Previous Year Papers**: Solve at least 5 years of previous question papers to understand the exam trend.

5. **Take Mock Tests**: Regular mock tests help improve speed and accuracy.

6. **Stay Updated with Current Affairs**: Read newspapers and magazines regularly for general awareness.

7. **Improve English Skills**: Focus on grammar, vocabulary, and comprehension.

8. **Master Quantitative Aptitude**: Practice different types of mathematical problems daily.

9. **Logical Reasoning**: Develop analytical thinking through regular practice.

10. **Stay Motivated**: Maintain a positive attitude and stay consistent with your preparation.',
    'Master the SSC CGL exam with these proven preparation strategies and tips from Awasthi Classes experts.',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW()
);

-- Add another sample blog
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
) VALUES (
    uuid_generate_v4(),
    'Railway Exam Success Strategy',
    'railway-exam-success-strategy-' || extract(epoch from now())::text,
    'Railway exams are highly competitive and require focused preparation. Here''s your complete guide to success.

**Understanding Railway Exams**
Railway Recruitment Board conducts various exams for different positions. Each exam has its unique pattern and syllabus.

**Key Preparation Areas:**
- General Intelligence & Reasoning
- Mathematics
- General Science
- General Awareness & Current Affairs

**Study Plan:**
1. Analyze the syllabus thoroughly
2. Create a monthly study schedule
3. Focus on weak areas
4. Regular revision is key
5. Practice with time management

**Important Tips:**
- Stay updated with railway notifications
- Practice previous year questions
- Take online mock tests
- Join study groups for motivation
- Maintain physical and mental health

Success in railway exams requires dedication, smart work, and consistent effort. With proper guidance and preparation, you can achieve your dream job.',
    'Complete guide to crack railway exams with expert tips and strategies from Awasthi Classes.',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW() - INTERVAL '1 day'
);

-- Add a third sample blog
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
) VALUES (
    uuid_generate_v4(),
    'RSMSSB Exam Pattern and Syllabus Guide',
    'rsmssb-exam-pattern-syllabus-guide-' || extract(epoch from now())::text,
    'Rajasthan Subordinate and Ministerial Services Selection Board (RSMSSB) conducts various competitive exams for state government jobs.

**Popular RSMSSB Exams:**
- Patwari
- Lab Assistant
- Junior Assistant
- Stenographer
- Computer Operator

**General Exam Pattern:**
Most RSMSSB exams follow a similar pattern with multiple-choice questions covering:

1. **Rajasthan GK & History** (30-40 marks)
2. **General Knowledge & Current Affairs** (25-30 marks)
3. **Mathematics** (25-30 marks)
4. **Reasoning** (20-25 marks)
5. **English/Hindi** (15-20 marks)

**Preparation Strategy:**
- Focus heavily on Rajasthan-specific topics
- Study local history, geography, and culture
- Practice arithmetic and reasoning daily
- Stay updated with state and national current affairs
- Solve previous year papers regularly

**Key Success Factors:**
- Consistent daily study routine
- Strong focus on Rajasthan GK
- Regular mock test practice
- Time management skills
- Positive mindset and confidence

Join Awasthi Classes for comprehensive RSMSSB exam preparation with expert guidance and study materials.',
    'Complete guide to RSMSSB exams including pattern, syllabus, and preparation strategy.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW() - INTERVAL '2 days'
);