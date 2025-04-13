 # MindHealer

A comprehensive mental health support platform featuring AI-powered chat assistance, mood tracking, community forum, and professional therapist booking system.

## Features

- 🤖 AI-powered Mental Health Chatbot
- 📊 Mood Tracking & Analytics Dashboard
- 💭 Personal Journal
- 👥 Community Forum
- 🏥 Professional Therapist Booking
- 👤 User Profile Management

## Tech Stack

### Frontend
- React 19.0.0
- Vite 6.1.0
- React Router DOM 6.29.0
- Material UI 6.4.4
- Tailwind CSS 3.3.3
- Chart.js 4.4.8 with react-chartjs-2
- React Markdown 10.1.0
- Context API for state management
- Axios 1.7.9 for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- Google Gemini AI API

## Prerequisites

- Node.js ≥ 18.0.0
- MongoDB
- Google Gemini API key
- Backend server running (see backend README)

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd mindhealer
```

2. Frontend Setup
```bash
cd mindhealer-frontend
npm install
```

3. Backend Setup
```bash
cd mindhealer-backend
npm install
```

4. Environment Variables

Create `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Create `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:5050
```

## Running the Application

1. Start the Backend
```bash
cd mindhealer-backend
npm run dev
```

2. Start the Frontend (in a new terminal)
```bash
cd mindhealer-frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Routes

### Authentication
- POST /api/auth/signup - Create new user
- POST /api/auth/login - User login

### Chat
- GET /api/chatbot/history - Get chat history
- POST /api/chatbot/message - Send message to AI

### Dashboard
- GET /api/dashboard/mood - Get mood history
- POST /api/dashboard/mood - Add mood entry

### Profile
- GET /api/profile - Get user profile
- PUT /api/profile - Update profile
- POST /api/profile/upload - Upload profile picture

## Frontend Development Guide

### Project Structure

```
src/
├── api/                # API integration
│   ├── auth.jsx       # Authentication API
│   └── profile.jsx    # Profile management API
├── components/        # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ...
├── context/          # React Context providers
│   └── AuthContext.jsx
├── pages/           # Main application pages
│   ├── Home.jsx
│   ├── Chat.jsx
│   ├── Dashboard.jsx
│   └── ...
├── styles/          # CSS styles
│   └── Chat.css
└── utils/           # Helper functions
    └── quotes.js
```

### Features

#### Authentication
- JWT-based authentication
- Protected routes
- Persistent login state

#### Dashboard
- Interactive mood tracking
- Chart.js visualizations
- Journal entries with prompts

#### Chat Interface
- Real-time AI responses
- Chat history persistence
- Markdown support for bot responses
- Rate limit indicators

#### Profile Management
- Profile image upload
- User information management
- Settings customization

#### Community Features
- Forum discussions
- Therapist booking system
- Resource sharing

### Development

#### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Code Style

This project uses ESLint with the following key configurations:
- React 19 features enabled
- React Hooks rules
- ES2020+ features

#### Component Guidelines

1. Use functional components with hooks
2. Implement proper error boundaries
3. Use Material UI components when possible
4. Follow atomic design principles

#### State Management

- Use AuthContext for authentication state
- Use local state for component-specific data
- Use URL params for page-specific states

#### API Integration

All API calls should:
- Include proper error handling
- Show loading states
- Handle token expiration
- Implement retry logic

#### Styling

- Use Tailwind CSS for layout and basic styling
- Use Material UI components for complex UI elements
- Custom CSS only when necessary

### Production Build

1. Build the application:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

### Performance Optimization

- Lazy loading of routes
- Image optimization
- Code splitting
- Memoization of expensive computations

### Troubleshooting

#### Common Issues

1. API Connection Errors
- Check if backend server is running
- Verify API_BASE_URL in .env
- Check CORS settings

2. Build Errors
- Clear node_modules and reinstall
- Update dependencies
- Check for TypeScript errors

3. Authentication Issues
- Clear localStorage
- Check token expiration
- Verify API endpoints

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details
