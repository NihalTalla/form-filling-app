# Form-Filling Web Application

A full-stack web application for collecting user information through forms with React frontend, Node.js backend, and MySQL database.

## Project Structure

```
demo/
├── frontend/          # React application
├── backend/           # Node.js Express API
├── README.md          # This file
└── .env.example       # Environment variables template
```

## Features

- User-friendly form with name and email fields
- Form validation and error handling
- MySQL database storage
- REST API with Express.js
- Cloud deployment ready (Vercel/Netlify + Railway/Render)

## Quick Start

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

## Database Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your database credentials:

```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

## Deployment

- **Frontend**: Vercel or Netlify
- **Backend**: Railway or Render
- **Database**: Supabase, PlanetScale, or Railway MySQL

## API Endpoints

- `POST /api/users` - Create a new user
- `GET /api/health` - Health check

## Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js, MySQL2
- **Database**: MySQL
- **Security**: Helmet, CORS, Rate limiting