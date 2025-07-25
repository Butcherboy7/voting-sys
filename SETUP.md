# Quick Setup Guide

## Simple 3-Step Setup

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd student-elections-2024
   npm install
   ```

2. **Start the app**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Visit: `http://localhost:5000`

## That's it! 🎉

- No database setup required
- No API keys needed  
- No environment variables required
- Works immediately after `npm install`

## Test the App

### For Students:
1. Register with any `@mallareddyuniversity.ac.in` email
2. Login with your credentials
3. Vote for your preferred candidate
4. Try to vote again (should be blocked)

### For Admin:
1. Use Admin tab on login page
2. Username: `admin`
3. Password: `password`  
4. View real-time voting results and activity

## Pre-loaded Candidates

The app comes with 5 candidates:
- Ashvith (Computer Science)
- Vaishnavi (Business Administration)
- Sandeep (Environmental Science)
- Sujasree (Psychology)
- Shashank (Engineering)

## Features Working Out of the Box

✅ University email validation
✅ Secure password hashing
✅ One-time voting enforcement
✅ Real-time admin dashboard
✅ Session management
✅ Responsive design
✅ Vote statistics and analytics

## Troubleshooting

**If npm install fails:**
- Make sure you have Node.js 18+ installed
- Try: `npm cache clean --force`
- Try: `rm -rf node_modules && npm install`

**If the app won't start:**
- Check if port 5000 is available
- Try: `PORT=3000 npm run dev` for different port

**If registration fails:**
- Make sure to use `@mallareddyuniversity.ac.in` email domain
- Check browser console for specific errors

## Need Help?

- Check the main README.md for detailed documentation
- Look at CONTRIBUTING.md for development guidelines
- Open an issue on GitHub for bugs or questions