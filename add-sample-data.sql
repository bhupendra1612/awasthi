-- Add missing columns first
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS board TEXT DEFAULT 'CBSE',
ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '6 months',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Education',
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Awasthi Classes';

-- Insert sample courses
INSERT INTO courses (title, description, class, subject, board, duration, price, original_price, is_published, is_featured, is_trending) VALUES
('Complete Mathematics for Class 10', 'Comprehensive course covering all topics of Class 10 Mathematics with detailed explanations and practice questions.', 'Class 10', 'Mathematics', 'CBSE', '12 months', 2999, 4999, true, true, true),
('Physics Mastery Class 12', 'Master Physics concepts for Class 12 with practical examples and problem-solving techniques.', 'Class 12', 'Physics', 'CBSE', '10 months', 3999, 5999, true, true, false),
('SSC Mathematics Complete Course', 'Complete Mathematics preparation for SSC exams with shortcuts and tricks.', 'SSC', 'Mathematics', 'SSC', '8 months', 1999, 2999, true, false, true),
('Railway Group D Complete Package', 'Complete preparation package for Railway Group D examination.', 'Railway', 'All Subjects', 'Railway', '6 months', 1499, 2499, true, true, true),
('Free Basic Mathematics', 'Free basic mathematics course for beginners.', 'Class 6', 'Mathematics', 'CBSE', '3 months', 0, 0, true, false, false)
ON CONFLICT DO NOTHING;

-- Insert sample blogs
INSERT INTO blogs (title, slug, content, excerpt, image_url, category, author, is_published, published_at) VALUES
('Top 10 Tips for Mathematics Preparation', 'top-10-tips-mathematics-preparation', 'Mathematics can be challenging, but with the right approach, you can master it. Here are our top 10 tips...', 'Discover the best strategies to excel in mathematics with these proven tips from our expert teachers.', '/images/math-tips.jpg', 'Study Tips', 'Awasthi Classes', true, NOW()),
('How to Crack SSC Exams in First Attempt', 'how-to-crack-ssc-exams-first-attempt', 'SSC exams require strategic preparation. Here is a complete guide to crack SSC in your first attempt...', 'Complete guide with proven strategies to clear SSC examinations in your first attempt.', '/images/ssc-guide.jpg', 'Exam Strategy', 'Awasthi Classes', true, NOW()),
('Railway Exam Preparation Strategy', 'railway-exam-preparation-strategy', 'Railway exams are highly competitive. Learn the best preparation strategies from our experts...', 'Expert tips and strategies for Railway exam preparation to secure your government job.', '/images/railway-prep.jpg', 'Career Guidance', 'Awasthi Classes', true, NOW())
ON CONFLICT (slug) DO NOTHING;

SELECT 'Sample data added successfully!' as message;