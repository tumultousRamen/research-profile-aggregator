# Research Profile Aggregator

A full-stack application that aggregates research profiles, publications, and academic content.

## Project Structure
- `frontend/`: React + Vite frontend application
- `backend/`: Node.js + Express + TypeScript backend application

## Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend
Create a `.env` file in the backend directory:
```env
PORT=3000
# Add other environment variables as needed
```

### Frontend
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

## Features
- Profile search and aggregation
- Academic publication fetching
- Content discovery from multiple sources
- Smart summarization
```

## Git Commands to Initialize Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Project setup with frontend and backend"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/research-profile-aggregator.git

# Push to GitHub
git push -u origin main