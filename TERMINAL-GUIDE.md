# Terminal & Command Line Guide

## Windows Users - Which Terminal Should I Use?

### Git Bash (RECOMMENDED for this project)
**When to use:** For any development work, especially Git repositories
**How to access:**
- Install Git for Windows from https://git-scm.com/
- Right-click in any folder → "Git Bash Here"
- Or open Git Bash from Start Menu

**Why it's best:**
- Supports Unix/Linux commands used in documentation
- Works seamlessly with Git
- Handles file paths better for development
- All our examples work perfectly

**Commands for this project:**
```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
npm run dev
```

### Command Prompt (Windows CMD)
**When to use:** Simple Windows tasks, basic npm commands
**How to access:**
- Press `Win + R`, type `cmd`, press Enter
- Or search "Command Prompt" in Start Menu

**Limitations:**
- Some Unix commands won't work
- Different file path handling

**Commands for this project:**
```cmd
git clone <your-repo-url>
cd <repo-folder>
npm install
npm run dev
```

### PowerShell
**When to use:** Advanced Windows scripting, system administration
**How to access:**
- Press `Win + X`, select "Windows PowerShell"
- Or search "PowerShell" in Start Menu

**Good for:**
- Both Windows and Unix-style commands
- Advanced scripting
- System administration

### Windows Terminal (Modern)
**When to use:** If you want a modern terminal experience
**How to access:**
- Install from Microsoft Store
- Combines Command Prompt, PowerShell, and Git Bash in one app

## Mac Users

### Terminal (Built-in)
**How to access:**
- Applications → Utilities → Terminal
- Or press `Cmd + Space`, type "Terminal"

**Commands for this project:**
```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
npm run dev
```

### iTerm2 (Popular Alternative)
- Download from https://iterm2.com/
- More features than built-in Terminal
- Better customization options

## Linux Users

### Default Terminal
**How to access:**
- Usually `Ctrl + Alt + T`
- Or search "Terminal" in your applications

**Commands for this project:**
```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
npm run dev
```

## Common Issues & Solutions

### "git: command not found"
**Solution:** Install Git
- Windows: Download from https://git-scm.com/
- Mac: Install Xcode Command Line Tools: `xcode-select --install`
- Linux: `sudo apt install git` (Ubuntu/Debian) or equivalent

### "npm: command not found"
**Solution:** Install Node.js
- Download from https://nodejs.org/
- Choose LTS version
- Restart terminal after installation

### "Permission denied" (Mac/Linux)
**Solution:** Use sudo for global installs or fix npm permissions
```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to ~/.bashrc or ~/.zshrc: export PATH=~/.npm-global/bin:$PATH
```

### Port 5000 already in use
**Solution:** Kill the process or use different port
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port
PORT=3000 npm run dev
```

## Quick Commands Reference

### Navigation
```bash
pwd          # Show current directory
ls           # List files (Unix) / dir (Windows CMD)
cd folder    # Enter folder
cd ..        # Go up one level
cd ~         # Go to home directory (Unix)
```

### Git Commands
```bash
git clone <url>     # Clone repository
git status          # Check repository status
git pull            # Update from remote
git add .           # Stage all changes
git commit -m "msg" # Commit changes
git push            # Push to remote
```

### npm Commands
```bash
npm install         # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm list            # List installed packages
```

## Pro Tips

1. **Use Tab completion** - Type first few letters, press Tab
2. **Use arrow keys** - Navigate through command history
3. **Use Ctrl+C** - Stop running processes
4. **Use clear** - Clear terminal screen
5. **Copy/paste** - Ctrl+Shift+C/V (Linux), Cmd+C/V (Mac), Right-click (Windows)