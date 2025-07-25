# Student Elections 2024 - Voting System

A complete authentication-based voting system for student elections built with React, Express.js, and in-memory storage.

> **🚀 Ultra Quick:** `git clone` → `npm install` → `npm run dev` → `http://localhost:5000`  
> **Zero Config:** No database, no API keys, no environment setup needed!

## Features

- **Secure Authentication**: University email validation (@mallareddyuniversity.ac.in)
- **One-Time Voting**: Students can vote only once with session tracking
- **Admin Dashboard**: Real-time vote monitoring and analytics
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live vote counts and recent activity

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript  
- **Storage**: In-memory with session management
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query

## Quick Start

### Prerequisites

- Node.js 18+ 
- Git
- npm or yarn

### Choose Your Terminal

**Windows Users:**
- **Git Bash** (Recommended) - Comes with Git installation, supports all Unix commands
- **Command Prompt** - Built-in Windows terminal
- **PowerShell** - Advanced Windows terminal
- **Windows Terminal** - Modern Windows terminal app

**Mac Users:**
- **Terminal** (Built-in) - Standard Mac terminal
- **iTerm2** - Popular third-party terminal

**Linux Users:**
- **Terminal** - Your distribution's default terminal

### Installation

1. **Open your terminal/Git Bash**
   
   **Windows:** Right-click in folder → "Git Bash Here" or open Git Bash and navigate
   
   **Mac/Linux:** Open Terminal app

2. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd <your-repository-folder>
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

**That's it!** No database setup, no API keys, no environment variables required. The app uses in-memory storage and comes with 5 pre-loaded candidates ready for voting.

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

- `npm run dev` - Start development server (most common)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check the project

## Data Storage

The application uses in-memory storage with these data structures:

- **users**: Student accounts with email validation
- **candidates**: Pre-loaded election candidates with profiles
- **votes**: Vote records linking users and candidates
- **settings**: System configuration (leaderboard visibility, etc.)
- **sessions**: User session management in memory

Data persists during the session but resets when the server restarts - perfect for testing and development!

## Environment Variables (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `SESSION_SECRET` | Secret key for session encryption | `student-elections-secret-key` |
| `PORT` | Server port | `5000` |

No database configuration needed! The app uses in-memory storage for simplicity.

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- Input validation with Zod
- University email domain restriction

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

Quick steps:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## Documentation

- [QUICK-START.md](QUICK-START.md) - Ultra-fast setup
- [SETUP.md](SETUP.md) - Detailed setup guide
- [TERMINAL-GUIDE.md](TERMINAL-GUIDE.md) - Terminal selection and usage
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the GitHub repository.