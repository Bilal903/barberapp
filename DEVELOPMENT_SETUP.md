# 🚀 Local Development Setup Guide

## Quick Setup (5 minutes)

### 1. Clone Once (Only First Time)
```bash
git clone https://github.com/murtaza2318/newbarber.git
cd newbarber
git checkout react-native-conversion
cd react-native
```

### 2. Install Dependencies (Only First Time)
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

### 4. Scan QR Code with Expo Go App
- Download "Expo Go" from Play Store
- Scan the QR code that appears
- App will load on your phone

## 🔄 Getting Updates (No Restart Needed!)

### When I Push Updates:
```bash
# In your local newbarber folder:
git pull origin react-native-conversion
```

**That's it!** Your phone will automatically reload with new changes! 🎉

## 🔥 Hot Reloading Benefits:

- ✅ **No QR scanning again** - Same QR code works
- ✅ **Instant updates** - Changes appear in 2-3 seconds
- ✅ **Keep app state** - Stay logged in, keep navigation state
- ✅ **Fast development** - See changes immediately

## 📱 Expo Go App Features:

- **Shake phone** → Open developer menu
- **Double tap with 2 fingers** → Reload app
- **Automatic reloading** when code changes

## 🛠️ Development Commands:

```bash
# Start development server
npm start

# Clear cache if needed
npm start -- --clear

# Run on web browser
npm start -- --web

# Check for updates
git pull origin react-native-conversion
```

## 🎯 Workflow Summary:

1. **Setup once** → Clone repo, install dependencies
2. **Start server** → `npm start`, scan QR code
3. **Get updates** → `git pull` (phone auto-reloads)
4. **Develop** → Make changes, see them instantly

No more cloning, no more QR scanning! 🚀