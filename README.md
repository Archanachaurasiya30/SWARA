# SWARA – Smart Women Assistance, Reporting & Alert System

SWARA is an AI-assisted web application designed to help users prepare and submit incident reports through a simple interface.

The platform integrates Google Gemini AI to provide suggestions for complaint categorization and summarization.

## Features

- Incident reporting system
- AI-assisted complaint analysis
- Suggested complaint categories and summaries
- MongoDB-based report storage
- Input validation
- Rate limiting on report submissions
- Restricted public access to submitted reports
- Responsive web interface

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### AI Integration
- Google Gemini API

## Project Structure

```text
SWARA/
│
├── frontend/
├── backend/
├── ai-backend/
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-documentation.md
│   └── test-cases.md
│
├── screenshots/
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB
- Google Gemini API key
- VS Code (recommended)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SWARA
```

### 2. Start Main Backend

```bash
cd backend
npm install
npm run dev
```

Main backend:
`http://localhost:5001`

### 3. Start AI Backend

Open another terminal:

```bash
cd ai-backend
npm install
npm run dev
```

AI backend:
`http://localhost:5002`

### 4. Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

## Environment Variables

Create separate `.env` files in the backend and AI backend folders.

### backend/.env

Configure:
- PORT=5001
- MONGO_URI=your_mongodb_connection_string

### ai-backend/.env

Configure:
- GEMINI_API_KEY=your_gemini_api_key
- GEMINI_MODEL=your_supported_gemini_model
- PORT=5002
- ALLOWED_ORIGINS=http://localhost:5173

Never upload API keys, passwords, or private environment variables to GitHub.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Check backend and database |
| POST | /api/reports | Submit an incident report |
| GET | /api/reports | Restricted public access |
| GET | /api/health (AI backend) | Check AI backend |

## Security Features

- Report input validation
- Rate limiting on report submissions
- Restricted public report retrieval
- Environment-based API credentials
- Error handling
- Dependency vulnerability checks

## Documentation

Detailed project documentation is available in the `docs/` directory.

- System Architecture
- Database Schema
- API Documentation
- Test Cases

## Important Disclaimer

SWARA is an educational project and is not an official police reporting or emergency response service.

AI-generated suggestions are informational and should be reviewed by the user. Do not submit real sensitive personal information while testing this application.

## Future Enhancements

- User authentication
- Secure user-specific report access
- Emergency contact integration
- Location-based assistance
- Improved privacy and security controls
- Deployment and production testing

## Project Status

Mini-project development version. Core frontend, backend, database, AI integration, and report submission features are working locally.