# 🚀 Ultra Quick Start

## For Developers Who Want It FAST

```bash
# 1. Clone this repo
git clone <your-repo-url>
cd <repo-folder-name>

# 2. Install and run
npm install && npm run dev

# 3. Open browser
# Visit: http://localhost:5000
```

## Test the System Immediately

### Student Flow:
1. Click "Register" tab
2. Use any name + email ending with `@mallareddyuniversity.ac.in` 
3. Click "Login" tab and login with those credentials
4. Vote for any of the 5 candidates
5. Try voting again (will be blocked)

### Admin Flow:
1. Click "Admin" tab
2. Username: `admin` Password: `password`
3. See real-time vote results and statistics

## What's Pre-loaded

- ✅ 5 candidates with photos and platforms
- ✅ In-memory session storage
- ✅ University email validation
- ✅ Password hashing and security
- ✅ One-time voting enforcement
- ✅ Real-time admin dashboard

## No Setup Required

- ❌ No database installation
- ❌ No API keys
- ❌ No environment variables
- ❌ No external services

## Project Structure

```
/
├── client/           # React frontend
│   └── src/
│       ├── pages/    # Login, Voting, Admin pages
│       └── components/
├── server/           # Express backend
│   ├── routes.ts     # API endpoints
│   └── storage-memory.ts # In-memory data
├── shared/           # TypeScript types
└── package.json      # Dependencies
```

Perfect for testing, demos, and development!