# Student Elections 2024 - Voting System

A complete authentication-based voting system for student elections built with React, Express.js, and PostgreSQL.

## Features

- **Secure Authentication**: University email validation (@mallareddyuniversity.ac.in)
- **One-Time Voting**: Students can vote only once with session tracking
- **Admin Dashboard**: Real-time vote monitoring and analytics
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live vote counts and recent activity

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-elections-2024
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/elections_db
   SESSION_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and validation
└── package.json           # Dependencies and scripts
```

## Usage

### For Students

1. **Register**: Sign up with your university email (@mallareddyuniversity.ac.in)
2. **Login**: Use your credentials to access the voting system
3. **Vote**: Select your preferred candidate and submit your vote
4. **View Results**: Check the leaderboard when it becomes available

### For Administrators

1. **Admin Login**: Use username `admin` and password `password`
2. **Dashboard**: Monitor real-time voting statistics
3. **View Activity**: Track recent votes and candidate performance
4. **Manage Settings**: Control when results are visible to students

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Apply database schema changes
- `npm run check` - Type check the project

## Database Schema

The application uses the following main tables:

- **users**: Student accounts with email validation
- **candidates**: Election candidates with profiles
- **votes**: Vote records with user and candidate references
- **settings**: System configuration (leaderboard visibility, etc.)
- **sessions**: User session management

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret key for session encryption | Yes |
| `PORT` | Server port (default: 5000) | No |

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- Input validation with Zod
- University email domain restriction

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the GitHub repository.