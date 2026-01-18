-- Complete Blog Setup - Add sample data and verify structure
-- Run this in Supabase SQL Editor

-- First, check current blog structure
SELECT COUNT(*) as total_blogs FROM blogs;

-- Clean up any test data
DELETE FROM blogs WHERE title LIKE '%Test%' OR slug LIKE '%test%';

-- Add comprehensive sample blogs
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
-- Blog 1: SSC CGL Guide
(
    uuid_generate_v4(),
    'SSC CGL 2024: Complete Preparation Strategy',
    'ssc-cgl-2024-complete-preparation-strategy',
    'Staff Selection Commission Combined Graduate Level (SSC CGL) is one of India''s most competitive government exams. With lakhs of candidates appearing every year, a strategic approach is essential for success.

**Understanding SSC CGL Exam Structure**

The SSC CGL exam is conducted in four progressive tiers:

**Tier 1: Preliminary Examination**
- Computer-based objective test
- 100 questions in 60 minutes
- Subjects: General Intelligence, Quantitative Aptitude, English, General Awareness

**Tier 2: Main Examination**
- Four separate papers
- Paper I: Quantitative Abilities
- Paper II: English Language & Comprehension
- Paper III: Statistics (for specific posts)
- Paper IV: General Studies (Finance & Economics)

**Tier 3: Descriptive Paper**
- Pen and paper mode
- Essay, Letter, Application writing
- Tests language skills and expression

**Tier 4: Skill Test/Computer Proficiency**
- Data Entry Speed Test (DEST)
- Computer Proficiency Test (CPT)
- Document Verification

**Subject-wise Preparation Strategy**

**1. Quantitative Aptitude**
Master the fundamentals of arithmetic, algebra, geometry, and trigonometry. Focus on:
- Time and Work problems
- Percentage and Ratio
- Profit and Loss calculations
- Data Interpretation
- Mensuration formulas

Practice at least 50 questions daily and maintain an accuracy of 85%+.

**2. General Intelligence & Reasoning**
Develop logical thinking through:
- Verbal and Non-verbal reasoning
- Coding-Decoding patterns
- Blood Relations
- Direction and Distance
- Logical Venn Diagrams
- Puzzle solving techniques

**3. English Language & Comprehension**
Strengthen your language skills:
- Vocabulary building (learn 10 new words daily)
- Grammar rules and applications
- Reading Comprehension practice
- Error Detection techniques
- Sentence Improvement methods

**4. General Awareness**
Stay updated with:
- Current Affairs (last 6 months)
- Indian History and Culture
- Geography and Environment
- Indian Polity and Constitution
- Economics and Budget
- Science and Technology

**Effective Study Schedule**

**Phase 1: Foundation Building (3 months)**
- Complete basic concepts
- Read NCERT books (Class 6-12)
- Build strong fundamentals

**Phase 2: Practice and Application (2 months)**
- Solve previous year papers
- Take sectional tests
- Identify and improve weak areas

**Phase 3: Mock Tests and Revision (1 month)**
- Daily full-length mock tests
- Time management practice
- Final revision of important topics

**Success Tips from Awasthi Classes**

1. **Consistency is Key**: Study 6-8 hours daily without fail
2. **Quality over Quantity**: Focus on understanding concepts
3. **Regular Assessment**: Take weekly tests to track progress
4. **Stay Updated**: Read newspapers and current affairs magazines
5. **Healthy Lifestyle**: Maintain proper sleep and exercise routine

**Common Mistakes to Avoid**

- Neglecting any subject completely
- Not practicing enough mock tests
- Ignoring current affairs
- Poor time management during exam
- Lack of revision before exam

**Recommended Resources**

- NCERT Books (Class 6-12)
- Previous Year Question Papers
- Awasthi Classes Study Materials
- Online Mock Test Series
- Current Affairs Monthly Magazines

Success in SSC CGL requires dedication, smart preparation, and expert guidance. Join Awasthi Classes for comprehensive coaching and achieve your government job dreams.',
    'Master SSC CGL 2024 with our complete preparation strategy, study plan, and expert tips. Get detailed guidance on all four tiers and subject-wise preparation.',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW()
),

-- Blog 2: REET Preparation
(
    uuid_generate_v4(),
    'REET 2024: Ultimate Guide for Teacher Eligibility',
    'reet-2024-ultimate-guide-teacher-eligibility',
    'Rajasthan Eligibility Examination for Teachers (REET) is the gateway to becoming a government teacher in Rajasthan. This comprehensive guide will help you crack REET 2024 with confidence.

**REET Exam Overview**

REET is conducted for two levels:
- **Level 1**: For Classes I-V (Primary Teacher)
- **Level 2**: For Classes VI-VIII (Upper Primary Teacher)

**Detailed Exam Pattern**

**Level 1 Exam Pattern (Classes I-V)**
- Total Questions: 150
- Total Marks: 150
- Duration: 2 hours 30 minutes
- Negative Marking: No

Subject Distribution:
- Child Development & Pedagogy: 30 marks
- Language I (Hindi): 30 marks  
- Language II (English/Sanskrit/Urdu): 30 marks
- Mathematics: 30 marks
- Environmental Studies: 30 marks

**Level 2 Exam Pattern (Classes VI-VIII)**
- Total Questions: 150
- Total Marks: 150
- Duration: 2 hours 30 minutes
- Negative Marking: No

Subject Distribution:
- Child Development & Pedagogy: 30 marks
- Language I (Hindi): 30 marks
- Language II (English/Sanskrit/Urdu): 30 marks
- Mathematics & Science OR Social Studies: 60 marks

**Subject-wise Preparation Strategy**

**1. Child Development & Pedagogy (30 marks)**

Key Topics:
- Child Development theories (Piaget, Vygotsky, Kohlberg)
- Learning and its processes
- Individual differences and special needs
- Assessment and evaluation methods
- Inclusive education principles

Preparation Tips:
- Understand developmental stages thoroughly
- Practice case study questions
- Focus on learning theories and their applications
- Study NCF 2005 and RTE Act 2009

**2. Language Sections (60 marks total)**

**Hindi Language:**
- व्याकरण (Grammar): संधि, समास, उपसर्ग, प्रत्यय
- साहित्य (Literature): कविता, गद्य, लेखक परिचय
- भाषा शिक्षण विधियां (Teaching Methods)
- मूल्यांकन (Assessment techniques)

**English Language:**
- Grammar: Tenses, Voice, Narration, Articles
- Vocabulary and Comprehension
- Teaching Methods and Approaches
- Language Skills Development

**3. Mathematics (30 marks for Level 1, 30 marks for Level 2)**

Important Topics:
- Number System and Operations
- Fractions and Decimals
- Geometry and Mensuration
- Data Handling and Statistics
- Algebra (for Level 2)
- Mathematical Reasoning and Pedagogy

**4. Environmental Studies (Level 1 - 30 marks)**

Key Areas:
- Our Environment and Natural Resources
- Plants and Animals
- Food, Health and Hygiene
- Water and Air
- Weather and Climate
- Teaching Strategies for EVS

**5. Science (Level 2 - 30 marks)**

Physics Topics:
- Motion, Force and Energy
- Light, Sound and Heat
- Electricity and Magnetism

Chemistry Topics:
- Matter and its Properties
- Acids, Bases and Salts
- Metals and Non-metals

Biology Topics:
- Life Processes
- Human Body Systems
- Heredity and Evolution
- Environment and Natural Resources

**6. Social Studies (Level 2 - 30 marks)**

History:
- Ancient, Medieval and Modern India
- Rajasthan History and Culture
- Freedom Struggle

Geography:
- Physical Geography of India and Rajasthan
- Climate, Soil and Natural Resources
- Population and Urbanization

Political Science:
- Indian Constitution
- Democratic Politics
- Local Government (Panchayati Raj)

**Rajasthan Specific Preparation**

**History and Culture:**
- Rajput dynasties and their contributions
- Folk music, dance and festivals
- Art and architecture
- Important historical places

**Geography:**
- Physical features and climate
- Rivers, lakes and desert regions
- Mineral resources and industries
- Agriculture and irrigation

**Current Affairs:**
- Government schemes and policies
- Recent developments in education
- Sports and cultural events
- Important appointments and awards

**Effective Study Plan**

**Phase 1: Concept Building (2 months)**
- Complete NCERT books (Class I-VIII)
- Understand basic concepts of all subjects
- Make comprehensive notes

**Phase 2: Practice and Application (1.5 months)**
- Solve previous year papers
- Take subject-wise tests
- Focus on weak areas

**Phase 3: Intensive Revision (15 days)**
- Revise important formulas and facts
- Take full-length mock tests
- Practice time management

**Success Strategies**

1. **NCERT Focus**: Thoroughly study NCERT books
2. **Previous Papers**: Solve at least 10 years of question papers
3. **Mock Tests**: Take regular practice tests
4. **Current Affairs**: Stay updated with educational news
5. **Rajasthan GK**: Give special attention to state-specific topics

**Time Management Tips**

- Allocate time based on marks weightage
- Practice quick problem-solving techniques
- Develop shortcuts for calculations
- Regular revision to retain information

**Common Mistakes to Avoid**

- Ignoring pedagogy sections
- Weak preparation in Rajasthan GK
- Not practicing enough mock tests
- Poor time management during exam
- Neglecting NCERT books

REET success requires systematic preparation and deep understanding of concepts. Join Awasthi Classes for expert guidance, comprehensive study materials, and regular mock tests to achieve your teaching career goals.',
    'Complete REET 2024 preparation guide with exam pattern, syllabus, and effective study strategies for both Level 1 and Level 2 examinations.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW() - INTERVAL '1 day'
),

-- Blog 3: Railway Group D
(
    uuid_generate_v4(),
    'Railway Group D 2024: Complete Success Guide',
    'railway-group-d-2024-complete-success-guide',
    'Railway Group D is one of India''s largest recruitment drives, offering excellent career opportunities with job security. This comprehensive guide will help you crack the exam with confidence.

**Railway Group D Overview**

Railway Group D exam is conducted by Railway Recruitment Board (RRB) for various posts including:
- Track Maintainer Grade-IV
- Helper/Assistant in various departments
- Porter
- Pointsman
- Level-1 posts in different railway zones

**Exam Pattern Details**

**Computer Based Test (CBT)**
- Total Questions: 100
- Total Marks: 100
- Duration: 90 minutes
- Negative Marking: 1/3 mark deducted for wrong answers

**Subject-wise Distribution:**
- Mathematics: 25 questions (25 marks)
- General Intelligence & Reasoning: 30 questions (30 marks)
- General Science: 25 questions (25 marks)
- General Awareness & Current Affairs: 20 questions (20 marks)

**Detailed Syllabus and Preparation Strategy**

**1. Mathematics (25 marks)**

**Number System:**
- Natural numbers, whole numbers, integers
- Rational and irrational numbers
- Prime and composite numbers
- LCM and HCF problems
- BODMAS rule applications

**Arithmetic:**
- Percentage calculations and applications
- Ratio and Proportion problems
- Time and Work concepts
- Time, Speed and Distance
- Simple and Compound Interest
- Profit, Loss and Discount

**Algebra:**
- Basic algebraic expressions
- Linear equations in one variable
- Quadratic equations (simple cases)

**Geometry:**
- Basic geometric figures and properties
- Area and perimeter of triangles, rectangles, circles
- Volume and surface area of cube, cuboid, cylinder
- Pythagoras theorem applications

**Statistics:**
- Mean, median, mode
- Bar graphs and pie charts interpretation
- Simple probability problems

**Preparation Tips for Mathematics:**
- Master basic arithmetic operations
- Learn shortcuts and tricks for quick calculations
- Practice mental math regularly
- Focus on accuracy over speed initially
- Solve at least 30 questions daily

**2. General Intelligence & Reasoning (30 marks)**

**Verbal Reasoning:**
- Analogies and similarities
- Differences and classifications
- Synonyms and antonyms
- Coding and decoding
- Mathematical operations
- Relationships and blood relations

**Non-Verbal Reasoning:**
- Figure series and patterns
- Mirror images and water images
- Paper cutting and folding
- Embedded figures
- Counting of figures

**Logical Reasoning:**
- Direction sense test
- Ranking and arrangement
- Logical Venn diagrams
- Statement and conclusions
- Cause and effect relationships

**Preparation Strategy:**
- Practice different types of reasoning questions daily
- Develop pattern recognition skills
- Work on improving logical thinking
- Time yourself while solving questions
- Focus on accuracy in non-verbal reasoning

**3. General Science (25 marks)**

**Physics (8-10 questions):**
- Motion and Force
- Work, Energy and Power
- Light and Sound
- Heat and Temperature
- Electricity and Magnetism
- Simple Machines

**Chemistry (8-10 questions):**
- Matter and its states
- Atoms and molecules
- Acids, Bases and Salts
- Metals and Non-metals
- Carbon compounds
- Chemical reactions

**Biology (7-9 questions):**
- Human body systems
- Plant structure and functions
- Diseases and immunity
- Heredity and evolution
- Environment and ecology
- Food and nutrition

**Preparation Approach:**
- Study NCERT books (Class 6-10)
- Focus on basic concepts and definitions
- Make short notes for quick revision
- Practice diagrams and scientific processes
- Stay updated with recent scientific developments

**4. General Awareness & Current Affairs (20 marks)**

**Static GK:**
- Indian History (Ancient, Medieval, Modern)
- Indian Geography (Physical and Economic)
- Indian Polity and Constitution
- Indian Economy basics
- Sports and Games
- Books and Authors
- Important Days and Dates

**Current Affairs (Last 6 months):**
- National and International news
- Government schemes and policies
- Awards and honors
- Scientific discoveries
- Railway-related current affairs
- Economic developments

**Preparation Strategy:**
- Read newspapers daily
- Follow current affairs magazines
- Make monthly current affairs notes
- Focus on railway-related news
- Revise static GK regularly

**Effective Study Schedule**

**Phase 1: Foundation (2 months)**
- Complete basic concepts of all subjects
- Read NCERT books thoroughly
- Make comprehensive notes

**Phase 2: Practice (1.5 months)**
- Solve previous year papers
- Take subject-wise mock tests
- Identify and improve weak areas

**Phase 3: Final Preparation (15 days)**
- Intensive revision of all topics
- Daily full-length mock tests
- Focus on time management
- Current affairs final revision

**Time Management Strategy**

**During Exam (90 minutes for 100 questions):**
- Mathematics: 20-22 minutes (25 questions)
- Reasoning: 25-27 minutes (30 questions)
- General Science: 20-22 minutes (25 questions)
- General Awareness: 15-18 minutes (20 questions)
- Review and marking: 5-8 minutes

**Preparation Tips:**
- Practice with timer regularly
- Develop question selection strategy
- Learn to identify easy questions quickly
- Avoid spending too much time on difficult questions

**Success Strategies**

**1. Smart Preparation:**
- Focus on high-weightage topics
- Practice previous year questions
- Take regular mock tests
- Analyze performance and improve

**2. Accuracy Focus:**
- Maintain 80%+ accuracy in practice
- Avoid random guessing
- Double-check calculations
- Read questions carefully

**3. Current Affairs:**
- Maintain a current affairs diary
- Focus on railway-related news
- Revise monthly current affairs
- Stay updated till exam day

**4. Physical and Mental Preparation:**
- Maintain regular study schedule
- Take adequate rest and sleep
- Practice relaxation techniques
- Stay positive and confident

**Common Mistakes to Avoid**

- Neglecting any subject completely
- Not practicing enough mock tests
- Poor time management during exam
- Ignoring negative marking
- Lack of current affairs preparation
- Not revising basic concepts

**Recommended Study Materials**

- NCERT Books (Class 6-10)
- Previous Year Question Papers
- Awasthi Classes Study Materials
- Current Affairs Monthly Magazines
- Online Mock Test Series
- Railway Group D Specific Books

**Physical Efficiency Test (PET)**

After clearing CBT, candidates need to qualify PET:
- 35 kg weight lifting and carrying for 100 meters
- Running 1000 meters in 4 minutes 15 seconds (for men)
- Running 1000 meters in 5 minutes 40 seconds (for women)

**Document Verification**

Final stage includes verification of:
- Educational certificates
- Caste certificate (if applicable)
- Medical fitness certificate
- Character certificate

Railway Group D offers excellent career growth opportunities with job security and good benefits. With proper preparation and guidance from Awasthi Classes, you can achieve success in this competitive exam. Start your preparation today and take the first step towards a secure government job in Indian Railways.',
    'Complete Railway Group D 2024 guide with detailed syllabus, preparation strategy, time management tips, and success techniques for government railway jobs.',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW(),
    NOW() - INTERVAL '2 days'
);

-- Verify the blogs were inserted successfully
SELECT 
    id,
    title,
    slug,
    is_published,
    LENGTH(content) as content_length,
    created_at
FROM blogs 
WHERE is_published = true 
ORDER BY created_at DESC;