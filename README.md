# Bike Dealership Management System - Frontend

A modern, responsive React application for managing bike dealership operations.

## Features

- 🔐 Firebase Authentication with role-based access
- 👨‍💼 **Worker Dashboard**:
  - Add new bikes with image upload
  - View inventory (all/available/sold)
  - Mark bikes as sold with customer details
- 👑 **Admin Dashboard**:
  - KPI cards (Profit, Revenue, Expenses, Sales)
  - Interactive monthly sales analytics chart
  - Complete transaction history table
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Fully responsive design
- ⚡ Fast and optimized

## Tech Stack

- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Firebase (Auth, Firestore, Storage)
- Recharts for analytics
- Axios for API calls
- React Router for navigation

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Backend server running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure `.env` file with your Firebase credentials and API URL

### Running the App

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Enable Storage
6. Get your config from Project Settings
7. Add config to `.env` file

## User Roles

To set user roles, use Firebase Admin SDK in your backend or Firebase Console:

**Admin**: Full access to analytics and worker features
**Worker**: Can add bikes and mark as sold

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── admin/       # Admin-specific components
│   └── worker/      # Worker-specific components
├── pages/           # Page components
├── contexts/        # React contexts (Auth)
├── services/        # API services
├── config/          # Configuration files
└── types/           # TypeScript type definitions
```

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
