# MindHealer - Mental Health Support Platform

A comprehensive mental health support platform featuring AI-powered chat assistance, mood tracking, community support, and professional therapy services.

## 🌟 Key Features

- 🤖 AI-powered Mental Health Chatbot (Google Gemini AI)
- 📊 Interactive Mood Tracking & Analytics Dashboard
- 💭 Personal Journal with Daily Prompts
- 👥 Community Support Forum
- 🏥 Professional Therapist Booking System
- 👤 User Profile Management

## 🏗 Project Structure

```
mindhealer/
├── mindhealer-frontend/           # React frontend application
│   ├── src/
│   │   ├── api/                  # API integration
│   │   ├── components/           # Reusable React components
│   │   ├── context/             # React Context providers
│   │   ├── pages/              # Main application pages
│   │   ├── styles/             # CSS styles
│   │   └── utils/              # Helper functions
│   └── public/                 # Static assets
│
└── mindhealer-backend/          # Node.js backend server
    ├── models/                 # Database schemas
    ├── routes/                # API endpoints
    ├── middleware/            # Custom middleware
    ├── utils/                # Helper functions
    └── uploads/              # User uploaded files
```

## 🛠 Tech Stack

### Frontend
- React 19.0.0 with Vite 6.1.0
- React Router DOM 6.29.0
- Material UI 6.4.4
- Tailwind CSS 3.3.3
- Chart.js 4.4.8 with react-chartjs-2
- React Markdown 10.1.0
- Context API for state management
- Axios 1.7.9 for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Google Gemini AI API
- JWT Authentication
- Multer for file uploads
- CORS enabled

## ⚙️ Prerequisites

- Node.js ≥ 18.0.0
- MongoDB ≥ 5.0
- Google Cloud Account with Gemini API access
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository
\`\`\`bash
git clone [repository-url]
cd mindhealer
\`\`\`

### 2. Environment Setup

#### Backend (.env)
Create \`mindhealer-backend/.env\`:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5050
\`\`\`

#### Frontend (.env)
Create \`mindhealer-frontend/.env\`:
\`\`\`
VITE_API_BASE_URL=http://localhost:5050
\`\`\`

### 3. Install Dependencies

Backend:
\`\`\`bash
cd mindhealer-backend
npm install
mkdir -p uploads  # Create uploads directory
\`\`\`

Frontend:
\`\`\`bash
cd mindhealer-frontend
npm install
\`\`\`

### 4. Start the Application

Backend:
\`\`\`bash
cd mindhealer-backend
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd mindhealer-frontend
npm run dev
\`\`\`

Access the application at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5050

## 📚 API Documentation

### Authentication
- POST `/api/auth/signup` - Register new user
  - Body: \`{ username, email, password }\`
  - Returns: \`{ user, authToken }\`

- POST `/api/auth/login` - Login user
  - Body: \`{ email, password }\`
  - Returns: \`{ user, authToken }\`

- POST `/api/auth/logout` - Logout user
  - Requires: Authentication header

### Chatbot
- GET `/api/chatbot/history` - Get chat history
  - Requires: Authentication
  - Returns: Array of messages

- POST `/api/chatbot/message` - Send message to AI
  - Body: \`{ message }\`
  - Requires: Authentication
  - Returns: AI response

### Dashboard
- GET `/api/dashboard/mood` - Get mood history
  - Requires: Authentication
  - Returns: Array of mood entries

- POST `/api/dashboard/mood` - Add mood entry
  - Body: \`{ mood, journal }\`
  - Requires: Authentication

### Profile
- GET `/api/profile` - Get user profile
- PUT `/api/profile/update` - Update profile
  - Body: \`{ bio, age, location }\`
- POST `/api/profile/upload-image` - Upload profile picture
  - Body: FormData with image

## 💻 Development Guide

### Frontend Components

#### Project Structure
- \`components/\`: Reusable UI components
- \`pages/\`: Main application views
- \`context/\`: React Context providers
- \`api/\`: API integration services
- \`utils/\`: Helper functions
- \`styles/\`: CSS stylesheets

#### Component Guidelines
1. Use functional components with hooks
2. Implement proper error boundaries
3. Use Material UI components when possible
4. Follow atomic design principles

### State Management
- Use AuthContext for authentication
- Local state for component data
- URL params for page states

### Styling
- Tailwind CSS for layouts
- Material UI components
- Custom CSS when needed

## 🔒 Security Features

- JWT authentication with short-lived tokens
- Password hashing using bcrypt
- File upload validation
- Rate limiting on chat endpoints
- CORS configuration
- Input validation

## 🚦 Rate Limiting

Chat endpoints are rate-limited:
- 5 requests per minute per user
- 100 requests per day per user

## 📈 Performance Optimization

- Lazy loading of routes
- Image optimization
- Code splitting
- Memoization of expensive operations

## ❗ Troubleshooting

### Common Issues

1. API Connection Errors
   - Check if backend is running
   - Verify API_BASE_URL in .env
   - Check CORS settings

2. Build Errors
   - Clear node_modules and reinstall
   - Update dependencies
   - Check TypeScript errors

3. Authentication Issues
   - Clear localStorage
   - Check token expiration
   - Verify API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License