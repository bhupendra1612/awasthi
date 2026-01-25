# Awasthi Classes - Online Coaching Platform

A modern, full-featured online coaching platform built with Next.js 16, React 19, and Supabase for government exam preparation in India.

## 🚀 Features

### For Students

- 📚 **Course Management** - Browse and enroll in courses for various government exams
- 📝 **Daily Tests** - Practice with daily test series
- 🎯 **Test Series** - Comprehensive test series with instant results
- 💬 **AI Chatbot** - Ask Teacher AI for doubt solving (Gemini 2.5 Flash powered)
- 📊 **Progress Tracking** - Track your performance and progress
- 🎥 **Video Lectures** - High-quality video content via Bunny CDN
- 📖 **Blog & Resources** - Educational content and study materials
- 🖼️ **Gallery** - View institute photos and videos

### For Teachers

- 📝 **Course Creation** - Create and manage courses
- ✍️ **Test Creation** - Create tests with AI-powered question generation
- 📊 **Student Analytics** - Track student performance
- 🎥 **Video Upload** - Upload lectures to Bunny Stream

### For Admins

- 👥 **User Management** - Manage students, teachers, and admins
- 📚 **Content Management** - Manage courses, tests, blogs, and gallery
- 💰 **Payment Tracking** - Monitor enrollments and payments
- 📊 **Analytics Dashboard** - Comprehensive platform analytics
- 🎨 **Gallery Management** - Upload and manage photos/videos

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image Component

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (images) + Bunny CDN (videos)
- **Video Streaming**: Bunny Stream
- **AI**: Google Gemini 2.5 Flash

### Deployment

- **Hosting**: Vercel
- **CDN**: Bunny CDN for video delivery

## 📁 Project Structure

```
awasthi/
├── src/
│   ├── app/
│   │   ├── (admin)/          # Admin dashboard routes
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (student)/        # Student dashboard
│   │   ├── (teacher)/        # Teacher dashboard
│   │   ├── api/              # API routes
│   │   ├── blog/             # Blog pages
│   │   ├── gallery/          # Gallery page
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable components
│   └── lib/                  # Utilities and helpers
├── public/                   # Static assets
└── supabase/                 # Database migrations (if any)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Bunny CDN account (for video streaming)
- Google Gemini API key (for AI chatbot)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/bhupendra1612/awasthi.git
cd awasthi
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Bunny Stream
BUNNY_LIBRARY_ID=your_library_id
BUNNY_API_KEY=your_api_key
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=your_cdn_hostname
NEXT_PUBLIC_BUNNY_LIBRARY_ID=your_library_id

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Razorpay (optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. **Set up Supabase**

- Create a new Supabase project
- Set up the required tables (see Database Schema below)
- Configure Storage buckets: `gallery`, `course-files`, `videos`, `doubt-images`, `test-thumbnails`
- Make buckets public for image/video access

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Main Tables

- `profiles` - User profiles (students, teachers, admins)
- `courses` - Course information
- `chapters` - Course chapters
- `enrollments` - Student course enrollments
- `daily_tests` - Daily test series
- `test_series` - Comprehensive test series
- `questions` - Test questions
- `test_attempts` - Student test submissions
- `blogs` - Blog posts
- `gallery` - Photo gallery
- `video_gallery` - Video gallery
- `ai_chat_history` - AI chatbot conversations

### Storage Buckets

- `gallery` - Gallery images (5MB limit)
- `course-files` - Course thumbnails and materials (50MB limit)
- `videos` - Video files (500MB limit)
- `doubt-images` - Student doubt images
- `test-thumbnails` - Test thumbnail images

## 🎨 Design System

The project follows a consistent design system:

- **Primary Color**: Blue (#2563eb)
- **Typography**: System font stack
- **Components**: Reusable Tailwind CSS components
- **Animations**: Smooth transitions and hover effects

See `design-system.md` for detailed guidelines.

## 🔐 Authentication & Authorization

### User Roles

1. **Student** - Can enroll in courses, take tests, use AI chatbot
2. **Teacher** - Can create courses and tests
3. **Admin** - Full access to all features

### Protected Routes

- `/admin/*` - Admin only
- `/teacher/*` - Teachers and admins
- `/student/*` - Authenticated students

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The site will be automatically deployed on every push to the main branch.

## 📝 Key Features Implementation

### AI Chatbot (Ask Teacher)

- Powered by Google Gemini 2.5 Flash
- Supports text and image questions
- Hinglish language support
- Chat history stored in database

### Video Streaming

- Videos uploaded to Bunny Stream
- HLS streaming for adaptive quality
- Thumbnail generation
- Progress tracking

### Test System

- Multiple choice questions
- Instant results and scoring
- Time tracking
- Detailed analytics

### Gallery

- Photo and video galleries
- Category filtering
- Lightbox view
- Admin upload interface

## 🤝 Contributing

This is a private project for Awasthi Classes. For any issues or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved by Awasthi Classes

## 👨‍💻 Developer

Developed by Bhupendra

## 📞 Support

For support, email: [your-email@example.com]

---

**Last Updated**: January 2026
**Version**: 1.0.0
