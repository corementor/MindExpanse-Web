# Infinity Mind

A web-based math practice platform for students to improve arithmetic skills through interactive worksheets.

## Features

- **Addition** – Practice with and without regrouping (carries)
- **Subtraction** – Practice with and without regrouping (borrows)
- **Multiplication** – Step-by-step with partial products and carries
- **Division** – Long division with intermediate steps and remainders
- Results modal with score, percentage, and per-question validation
- JWT-based authentication with access/refresh token handling
- Protected routes with automatic session expiry and token refresh

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | Radix UI + shadcn/ui |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Routing | React Router v7 |
| Animations | Framer Motion |

## Project Structure

```
src/
├── pages/
│   ├── auth/          # Login & Signup pages
│   ├── dashboard/     # Dashboard with math sections overview
│   └── MathGrid/      # Worksheets: addition, subtraction, multiplication, division
├── services/          # API calls (AuthService, mathService, httpClient)
├── contexts/          # AuthContext (global auth state)
├── routes/            # App routes + ProtectedRoutes guard
├── layout/            # DashboardLayout, Navbar, Sidebar, ActionBar
├── components/ui/     # Reusable UI components
├── hooks/             # useApi hook
├── utils/             # Axios instance, token utilities
└── environment/       # Environment config (API base URL)
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn >= 1.22

### Installation

```bash
yarn install
```

### Environment Variables

Create a `.env` file at the project root:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Running Locally

```bash
yarn dev
```

### Build

```bash
yarn build
```

## Routes

| Path | Access | Description |
|---|---|---|
| `/login` | Public | Login page |
| `/signup` | Public | Registration page |
| `/dashboard` | Protected | Math sections overview |
| `/additiongrid` | Protected | Addition worksheet |
| `/subtractiongrid` | Protected | Subtraction worksheet |
| `/multiplicationgrid` | Protected | Multiplication worksheet |
| `/divisiongrid` | Protected | Division worksheet |

## API Endpoints (consumed)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/register` | Register new user |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/math/generateArray` | Generate number grid |
| GET | `/math/generate-division` | Generate division questions |
| POST | `/math/verify-additions` | Verify addition answers |
| POST | `/math/verify-subtractions` | Verify subtraction answers |
| POST | `/math/verify-multiplications` | Verify multiplication answers |
| POST | `/math/verify-division` | Verify division answers |
