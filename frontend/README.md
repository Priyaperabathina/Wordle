# Wordle - Frontend

React frontend for the Wordle clone game.

## Features

- Interactive 5x5 Wordle grid with animations
- JWT-based authentication (login/register)
- PlayerDashboard and AdminDashboard
- Real-time feedback and daily game statistics
- Responsive design and Material-UI theme

## Tech Stack

- React 19.1.1, Material-UI 5, Framer Motion
- React Router, Axios, Context API

## Project Structure
src/

├── components/   # Player and admin components

├── contexts/     # AuthContext and GameContext

├── hooks/        # Custom hooks

├── pages/        # Login, Register, Dashboards

├── services/     # API service

├── utils/        # Helper functions

└── App.js

## Configuration
Configure backend API URL in .env or src/services/api.js:
```bash
REACT_APP_API_URL=http://localhost:9090/api
```

## Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000
