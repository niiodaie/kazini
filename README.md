# Kazini - AI-Powered Emotional Truth Detection

## Project Overview

Kazini is a cutting-edge React application that provides AI-powered emotional truth detection for deeper, more authentic relationships. Built according to the production brief specifications, this application helps users understand the real emotions behind conversations through advanced AI analysis.

## Features Implemented

### ✅ Core Features
- **Truth Test**: Step-by-step AI analysis of questions and answers
- **Couple Modes**: Both Live (real-time) and Async (link sharing) modes
- **Trust Index**: Visual scoring and confidence tracking with charts
- **History**: Timestamped records of all tests with filtering
- **Beautiful Hero Section**: Gradient UI with animations and CTAs
- **Responsive Design**: Mobile-friendly PWA-ready interface

### ✅ Technical Stack (As Specified)
- **Frontend**: React 18 + Functional Components + Hooks
- **Styling**: TailwindCSS + shadcn/ui components
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for Trust Index visualizations
- **Icons**: Lucide React icons
- **Build Tool**: Vite for fast development

### ✅ UI/UX Features
- **Brand Colors**: Kazini purple (#3B2A4A) and coral (#FF5A5F) gradients
- **Floating Animations**: CSS keyframe animations for visual appeal
- **Progress Indicators**: Step-by-step flow visualization
- **Interactive Elements**: Hover states, transitions, and micro-interactions
- **Loading States**: Spinner animations during AI analysis
- **Error Handling**: User-friendly error messages and validation

### ✅ AI Analysis Engine
- **Mock AI Logic**: Simulates GPT-4o analysis with confidence scoring
- **Result Types**: Truth (✅), Uncertain (⚠️), Deception (❌)
- **Confidence Scoring**: 60-100% range with detailed explanations
- **Trust Impact**: Points system for relationship tracking

## Project Structure

```
kazini-app/
├── public/
├── src/
│   ├── assets/           # Logo and brand assets
│   ├── components/       # React components
│   │   ├── TruthTest.jsx    # Core truth detection interface
│   │   ├── CoupleMode.jsx   # Live and async couple modes
│   │   ├── TrustIndex.jsx   # Charts and scoring dashboard
│   │   └── History.jsx      # Test history with filtering
│   ├── App.jsx          # Main application component
│   ├── App.css          # Custom styles and animations
│   └── main.jsx         # Application entry point
├── components.json      # shadcn/ui configuration
├── package.json         # Dependencies and scripts
└── README.md           # This documentation
```

## Key Components

### 1. TruthTest Component
- 3-step process: Question → Answer → Analysis
- Voice input support (UI ready)
- Real-time AI analysis with loading states
- Detailed results with confidence scoring

### 2. CoupleMode Component
- **Live Mode**: Room code generation and joining
- **Async Mode**: Shareable link creation
- Clean mode selection interface
- Copy-to-clipboard functionality

### 3. TrustIndex Component
- Circular progress indicators
- Interactive charts (Line, Pie, Bar)
- Statistics dashboard
- Recent test history

### 4. History Component
- Searchable test records
- Filter by result type and time period
- Expandable test details
- Export functionality (UI ready)

## Brand Implementation

### Visual Identity
- **Logo**: Integrated Kazini heart logo with flame
- **Colors**: Purple-to-coral gradient backgrounds
- **Typography**: Clean, modern font hierarchy
- **Animations**: Floating elements and pulse effects

### User Experience
- **Onboarding**: Clear step-by-step flows
- **Feedback**: Immediate visual responses
- **Navigation**: Intuitive back buttons and breadcrumbs
- **Accessibility**: Keyboard navigation ready

## Development Status

### ✅ Completed (Phase 1, 3, 4 as requested)
- Full React application with all core features
- Beautiful hero section with animations
- Complete Truth Test workflow
- Couple Mode (Live and Async)
- Trust Index with charts
- History with filtering
- Responsive design
- Brand integration

### 🚀 Ready for Enhancement
- **Backend Integration**: Supabase setup for real data
- **Real AI**: OpenAI GPT-4o integration
- **Authentication**: Google OAuth implementation
- **Real-time Features**: WebSocket for live couple mode
- **PWA Features**: Service worker and offline support
- **Analytics**: Google Analytics 4 integration

## Running the Application

### Development Server
```bash
cd kazini-app
npm install --legacy-peer-deps
npm run dev --host
```
Access at: http://localhost:5173

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment Ready

The application is fully prepared for deployment to:
- **Vercel** (recommended for frontend)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

## Technical Highlights

### Performance
- Vite for fast builds and hot reload
- Lazy loading with React.lazy (ready for implementation)
- Optimized animations with Framer Motion
- Responsive images and assets

### Code Quality
- Functional components with hooks
- Clean component architecture
- Consistent styling with Tailwind
- Proper state management
- Error boundaries ready

### Scalability
- Modular component structure
- Reusable UI components
- Centralized styling system
- Easy feature addition

## Future Enhancements

### Backend Integration
- Supabase database for user data
- Real-time subscriptions for couple mode
- File storage for test history
- User authentication and profiles

### AI Enhancement
- OpenAI API integration
- Voice-to-text transcription
- Video reaction analysis
- Advanced emotion detection

### Social Features
- Test result sharing
- Public link generation
- Social media integration
- Community features

## Brand Compliance

✅ **Visnec Global Branding**: "Powered by Visnec Global" in footer
✅ **Kazini Identity**: Consistent logo and color usage
✅ **Professional Design**: Enterprise-grade UI/UX
✅ **Mobile Responsive**: Works on all devices
✅ **Accessibility**: Screen reader friendly structure

## Contact & Support

- **Platform Owner**: Visnec Global (Visnec.com / Visnec.ai)
- **Client**: VNX Product (Visnec Global)
- **Primary Contact**: info@visnec.com | support@visnec-it.com

---

**Built with ❤️ for authentic relationships**
*Kazini - Discover Emotional Truth*

