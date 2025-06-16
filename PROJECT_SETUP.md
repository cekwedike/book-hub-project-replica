# Book Hub Project Setup

## Project Structure
```
book-hub/
├── frontend/          # React + TypeScript application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
├── package.json       # Root package.json for managing both projects
├── .gitignore
└── README.md
```

## Completed Tasks (Level 1 - Project Setup & Foundation)

### ✅ Project Structure Setup
- [x] Created frontend directory with React + TypeScript (Vite)
- [x] Created backend directory with Express.js
- [x] Set up package.json files for both frontend and backend
- [x] Configured TypeScript for frontend
- [x] Set up development environment

### ✅ Basic Configuration
- [x] Configured build tools (Vite for frontend)
- [x] Set up linting and formatting (ESLint included with Vite)
- [x] Configured Git hooks and project structure
- [x] Set up environment variables structure
- [x] Created root package.json with concurrent development scripts

### ✅ Dependencies Installed

#### Frontend Dependencies:
- React + TypeScript (Vite)
- Material-UI (@mui/material, @emotion/react, @emotion/styled)
- React Router DOM
- Axios for API calls
- Development tools (ESLint, Prettier, @types/node)

#### Backend Dependencies:
- Express.js
- CORS middleware
- dotenv for environment variables
- Mongoose for MongoDB
- Development tools (nodemon, TypeScript types)

## Next Steps

### Level 2: Backend Foundation
1. **Database Setup**
   - Set up MongoDB connection
   - Design book data schema
   - Create database models

2. **Basic API Structure**
   - Set up Express.js server with proper middleware
   - Create basic API endpoints
   - Add error handling

3. **Sample Data**
   - Create seed data with books
   - Include various genres, authors, publication dates

### Level 3: Frontend Foundation
1. **React App Setup**
   - Set up routing (React Router)
   - Configure state management (Context API)
   - Set up Material-UI theme

2. **Core Components**
   - Create basic layout components
   - Implement navigation/header
   - Create book card component

## Development Commands

### Root Level (Run both frontend and backend)
```bash
npm run dev              # Start both frontend and backend in development mode
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run build           # Build frontend for production
npm run start           # Start backend in production mode
```

### Frontend Only
```bash
cd frontend
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```

### Backend Only
```bash
cd backend
npm run dev             # Start development server with nodemon
npm start               # Start production server
```

## Environment Variables

### Backend (.env file needed in backend directory)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```

### Frontend (.env file needed in frontend directory)
```
VITE_API_URL=http://localhost:5000
```

## Notes
- Frontend runs on http://localhost:5173 (Vite default)
- Backend runs on http://localhost:5000
- Both projects are configured for concurrent development
- TypeScript is configured for both frontend and backend
- Material-UI is set up for frontend styling
- MongoDB will be used as the database 