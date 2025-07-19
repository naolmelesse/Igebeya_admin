# Local Development Setup Guide

## 🔧 **Development Mode Features**

Your Next.js app now includes special features for local development:

### **1. Mock Telegram WebApp**
- **Automatically detects** when running locally (`npm run dev`)
- **Provides mock user data** so you can test without Telegram
- **Simulates all Telegram WebApp functions** (buttons, user data, etc.)

### **2. Development Indicator**
- **Yellow banner** at the top shows you're in development mode
- **Dev Config button** (⚙️) in bottom-right corner for settings

### **3. Mock User Configuration**
- **Default mock user ID**: 12345
- **Configurable** through the dev config panel
- **Persists** across page reloads

---

## 🚀 **How to Test Locally**

### **Step 1: Start Development Server**
```bash
npm run dev
```

### **Step 2: Open Browser**
Visit: `http://localhost:3000`

### **Step 3: You'll See:**
- Yellow development banner at top
- Normal login form
- Dev config button (⚙️) in bottom-right

### **Step 4: Test Login**
Use any valid admin credentials from your system:
- **Email**: Your admin email
- **Username**: Your admin username  
- **Password**: Your admin password
- **2FA**: Your 2FA code

The app will automatically use mock user ID `12345` for the `chat_id` field.

---

## 🎯 **Development Features**

### **Mock User Data:**
```javascript
{
  id: 12345,           // Used as chat_id in API calls
  first_name: 'Test',
  last_name: 'Admin', 
  username: 'testadmin'
}
```

### **Console Logging:**
- All Telegram WebApp function calls are logged to console
- API requests are visible in Network tab
- Clear debugging information

### **Configurable Mock User:**
1. Click the ⚙️ dev config button
2. Change the mock user ID
3. Click "Apply & Reload"
4. Test with different user IDs

---

## 🔍 **Troubleshooting**

### **Issue: "Unable to get user data"**
**Solution:** Make sure you're in development mode:
```bash
# Check your environment
echo $NODE_ENV

# Should show "development" or be empty
# If production, the mock won't work
```

### **Issue: Network requests not showing**
**Solution:** 
1. Open browser dev tools (F12)
2. Go to Network tab
3. Try login again
4. You should see POST request to `/api/admin_login`

### **Issue: API errors**
**Solution:**
1. Check if your backend is running
2. Verify API proxy in `next.config.js`
3. Ensure `https://igebeyamarch2025.onrender.com` is accessible

---

## 🚀 **Production Deployment**

### **When you deploy to production:**
1. **Mock features automatically disabled**
2. **Real Telegram WebApp data used**
3. **Development banner/config hidden**
4. **Works normally through Telegram bot**

### **Environment Detection:**
```javascript
// Automatically detects environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Uses real Telegram data in production
// Uses mock data in development
```

---

## ✅ **Testing Checklist**

- [ ] App starts without errors (`npm run dev`)
- [ ] Yellow dev banner appears at top
- [ ] Login form loads correctly
- [ ] Dev config button (⚙️) visible
- [ ] Login attempt shows network request
- [ ] Can navigate between pages
- [ ] User management features work
- [ ] Console shows mock Telegram logs

---

## 🎭 **Mock vs Real Comparison**

| Feature | Development (Mock) | Production (Real) |
|---------|-------------------|-------------------|
| User ID | 12345 (configurable) | Real Telegram user ID |
| User Data | Mock test data | Real Telegram profile |
| WebApp Functions | Console logged | Real Telegram actions |
| Environment Banner | Visible | Hidden |
| Dev Config | Available | Hidden |

---

## 🔧 **Advanced Configuration**

### **Custom Mock User:**
Edit `utils/telegram.ts` to change default mock data:

```typescript
const createMockTelegramWebApp = (): TelegramWebApp => ({
  initDataUnsafe: {
    user: {
      id: 99999,              // Your preferred test ID
      first_name: 'Your',
      last_name: 'Name',
      username: 'yourusername',
    },
    // ... rest of config
  },
  // ...
});
```

### **Disable Development Features:**
Set `NODE_ENV=production` to test production behavior locally:

```bash
NODE_ENV=production npm run dev
```

---

**Now you can develop and test your admin panel locally without needing Telegram!** 🎉

When you're ready to deploy, everything will automatically work with the real Telegram WebApp data.
