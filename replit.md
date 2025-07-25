# Student Elections 2024 - Voting System

## Overview

This is a complete authentication-based voting system for student elections featuring login/signup, admin dashboard protection, email validation, and time-controlled leaderboard access. Students must register with university emails (@mallareddyuniversity.ac.in) to vote for 5 candidates: Ashvith, Vaishnavi, Sandeep, Sujasree, and Shashank. Admin access requires username "admin" and password "password".

## User Preferences

Preferred communication style: Simple, everyday language.
Code style: Clean code without comments as requested.
GitHub friendly: Simple structure and clean implementation with proper documentation.
User workflow: Registration should prompt to login separately, one-time voting with candidate images, admin dashboard shows all votes.
Repository structure: Easy to clone and run locally with clear setup instructions. Project files are in root directory, not in a subfolder.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with TypeScript, using Vite for development and build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application with client-side routing using Wouter
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for API data fetching and caching
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL dialect for type-safe queries
- **Session Management**: Simple IP-based session tracking to prevent duplicate voting
- **Data Storage**: Abstracted storage interface with in-memory implementation for development

### Database Schema
- **Candidates Table**: Stores candidate information (name, grade, platform, image)
- **Votes Table**: Records votes with candidate reference and session tracking
- **Session Tracking**: Prevents duplicate voting using sessionId (IP + user agent)

## Data Flow

1. **Voting Process**:
   - User views candidates on the voting page
   - System checks if user has already voted via session tracking
   - Vote submission validates candidate existence and session uniqueness
   - Successful votes are stored and UI is updated

2. **Admin Dashboard**:
   - Real-time polling of vote results and statistics
   - Display of vote counts, percentages, and recent activity
   - Automatic refresh every 3-5 seconds for live updates

3. **Data Persistence**:
   - Drizzle ORM handles database migrations and schema management
   - Type-safe queries ensure data integrity
   - Connection pooling via Neon serverless PostgreSQL

## External Dependencies

- **Database**: Neon serverless PostgreSQL for cloud database hosting
- **UI Components**: Radix UI primitives for accessible component foundations
- **Icons**: Lucide React for consistent iconography
- **Image Hosting**: Unsplash for candidate profile images
- **Development Tools**: Replit-specific plugins for development environment integration

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` starts both frontend and backend with hot reloading
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Production**: `npm start` serves the built application
- **Database Migrations**: `npm run db:push` applies schema changes to PostgreSQL

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Automatic SSL and connection pooling through Neon serverless
- Development-specific error overlays and debugging tools

### Key Architectural Decisions

1. **Monorepo Structure**: Keeps related code together while maintaining clear boundaries between client, server, and shared code
2. **TypeScript Throughout**: Ensures type safety across the entire stack with shared types
3. **Drizzle ORM**: Provides type-safe database operations with excellent TypeScript integration
4. **PostgreSQL Database**: Production-ready database with proper session management
5. **Session-Based Authentication**: Secure user authentication with PostgreSQL session storage
6. **Real-Time Updates**: Polling-based updates for admin dashboard to show live election results
7. **Component Abstraction**: shadcn/ui provides consistent, accessible UI components with Tailwind styling
8. **GitHub-Friendly Setup**: Complete documentation, environment examples, and easy local development setup