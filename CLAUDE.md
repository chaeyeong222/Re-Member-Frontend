# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Re:Member is a Next.js-based customer relationship management (CRM) application for small businesses. It helps store owners manage customer information, visit histories, and bookings through an intuitive interface. The application uses Kakao OAuth for authentication and communicates with a backend API for data persistence.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

The development server runs on `http://localhost:3000` by default.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks (useState, useEffect)
- **Authentication**: Kakao OAuth
- **Icons**: Lucide React

### Directory Structure

```
app/
├── booking/[storekey]/     # Customer booking flow by store
├── customer/[id]/          # Customer detail and visit history
├── dashboard/[storeKey]/   # Main dashboard for store owners
├── oauth/kakao/            # Kakao OAuth callback handling
├── signup/                 # User signup
├── store/
│   ├── register/           # Store registration form
│   └── page.tsx            # Store listing/management
├── waiting-room/           # Waiting room functionality
├── layout.tsx              # Root layout with fonts
├── page.tsx                # Landing/login page
└── globals.css             # Global styles and CSS variables

components/ui/              # shadcn/ui components
lib/utils.ts                # Utility functions (cn helper)
```

### API Integration

The frontend communicates with a backend API using the base URL from `NEXT_PUBLIC_API_URL`. Key endpoints:

- `GET /customer/getCustomers?storeKey={storeKey}` - Fetch all customers for a store
- `GET /customer/{id}` - Fetch customer details
- `POST /customer/add` - Add new customer
- Store registration and OAuth endpoints

### Authentication Flow

1. User clicks "Kakao Login" on landing page
2. Redirects to Kakao OAuth (`/oauth/kakao`)
3. On successful auth, stores `kakao_token` and `store_key` in localStorage
4. Redirects to dashboard with storeKey parameter

### Key Patterns

**Dynamic Routes**: The app uses Next.js dynamic routes extensively:
- `[storeKey]` for store-specific dashboards
- `[id]` for customer details
- Route params accessed via `useParams()` hook and unwrapped with React `use()`

**Client Components**: All pages use `"use client"` directive for interactivity with hooks

**Data Fetching**: Client-side fetching with `useEffect` and native `fetch` API

**Path Aliases**: Uses `@/` prefix for imports (configured in tsconfig.json)
- `@/components` → components directory
- `@/lib` → lib directory

**Styling**: Combines Tailwind utility classes with shadcn/ui component variants using the `cn()` helper from `lib/utils.ts`

## Environment Variables

Required variables in `.env.local`:

```
NEXT_PUBLIC_KAKAO_CLIENT_ID=     # Kakao OAuth client ID
NEXT_PUBLIC_KAKAO_REDIRECT_URI=  # OAuth callback URL
NEXT_PUBLIC_API_URL=             # Backend API base URL
KAKAO_CLIENT_SECRET=             # Kakao OAuth secret
```

## UI Components

The project uses shadcn/ui components configured in `components.json`:
- Style variant: "new-york"
- Base color: "neutral"
- CSS variables enabled
- Icon library: lucide-react

Components are in `components/ui/` and include: Button, Card, Input, Table, Calendar, Badge, etc.

## Styling System

Uses Tailwind CSS with custom CSS variables defined in `globals.css`. The theme extends base Tailwind with:
- HSL-based color system for consistent theming
- Custom border radius tokens (`--radius`)
- Dark mode support via class strategy
- Animations via `tailwindcss-animate` plugin

## Common Patterns

**Date Formatting**: Many components include custom `formatDate` utility functions for converting ISO timestamps to Korean locale format

**API Error Handling**: Check for 204 (no content) responses for empty data sets, handle non-ok responses with user-friendly error messages

**Loading States**: Components use `isLoading` state with conditional rendering for better UX

**Form Validation**: Client-side validation with error state management before API calls

**Modal Patterns**: Use local state (`isModalOpen`) to control modal visibility without additional libraries

## Backend Communication

API calls go through the configured `NEXT_PUBLIC_API_URL`. The Next.js config includes a rewrite rule to proxy `/api/*` requests to the backend, though most components use direct API calls.

## Git Commit Conventions

Based on recent commits, the project uses Korean commit messages with gitmoji prefixes:
- `:recycle:` for refactoring
- `:sparkles:` for new features
- `:bug:` for bug fixes