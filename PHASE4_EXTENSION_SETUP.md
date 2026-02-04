# Phase 4: Browser Extension Setup Guide

## 🎯 Objective
Load the Idea Collision Generator Chrome extension and test article capture functionality.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Chrome Extensions Page
1. Open Google Chrome
2. Navigate to: `chrome://extensions/`
3. You should see the Chrome Extensions management page

### Step 2: Enable Developer Mode
1. Look for the **"Developer mode"** toggle in the **top-right corner**
2. Click the toggle to **turn it ON**
3. You should now see additional buttons appear: "Load unpacked", "Pack extension", "Update"

### Step 3: Load the Extension
1. Click the **"Load unpacked"** button
2. A file browser dialog will open
3. Navigate to: `D:\VJTI\VJTI\FYP\extension`
4. Click **"Select Folder"**

### Step 4: Verify Extension Loaded
After loading, you should see a new card appear with:
- **Name**: Idea Collision Generator
- **ID**: (a random extension ID)
- **Version**: 1.0
- **Description**: Capture articles and generate creative idea collisions
- **Status**: Should show as enabled (toggle is blue/on)

### Step 5: Pin the Extension (Optional but Recommended)
1. Click the **puzzle piece icon** (🧩) in Chrome's toolbar (top-right)
2. Find "Idea Collision Generator" in the list
3. Click the **pin icon** next to it
4. The extension icon should now appear in your toolbar

---

## 🧪 Testing the Extension

### Test 1: Capture a Wikipedia Article

1. **Navigate to a test article**:
   - Go to: https://en.wikipedia.org/wiki/Artificial_intelligence
   
2. **Open the extension**:
   - Click the extension icon in your toolbar
   - A popup should appear with the title "Idea Collision Generator"
   
3. **Capture the article**:
   - Click the **"Capture This Page"** button
   - You should see a success message: "Article saved successfully!"
   
4. **Verify in Backend**:
   - Open: http://localhost:8000/articles
   - You should see the Wikipedia article in the JSON response
   
5. **Verify in Dashboard**:
   - Open: http://localhost:3000
   - Check the "Recent Reads" section
   - The Wikipedia article should appear in the list

### Test 2: Capture Another Article

Try capturing different types of articles:
- Tech article: https://techcrunch.com/
- Science article: https://www.scientificamerican.com/
- News article: https://www.bbc.com/news

---

## 🔍 Troubleshooting

### Extension doesn't load
- **Check folder path**: Make sure you selected `D:\VJTI\VJTI\FYP\extension`
- **Check manifest.json**: Ensure the file exists and is valid JSON
- **Check console**: Look for errors in the Extensions page

### Extension loads but popup doesn't work
- **Check background.js**: Open the extension details and click "Inspect views: background page"
- **Check console errors**: Look for JavaScript errors
- **Verify permissions**: Ensure manifest.json has correct permissions

### Article capture fails
- **Check backend**: Ensure FastAPI is running on http://localhost:8000
- **Check CORS**: The backend should allow requests from chrome-extension://*
- **Check network**: Open DevTools (F12) → Network tab → Try capturing again
- **Check backend logs**: Look at the terminal running uvicorn for errors

### Article doesn't appear in dashboard
- **Refresh dashboard**: Press F5 on http://localhost:3000
- **Check API response**: Visit http://localhost:8000/articles directly
- **Check browser console**: Open DevTools on the dashboard page

---

## ✅ Success Criteria

You'll know Phase 4 is complete when:
- ✅ Extension appears in chrome://extensions/
- ✅ Extension icon is visible in Chrome toolbar
- ✅ Clicking extension shows popup with "Capture This Page" button
- ✅ Capturing an article shows success message
- ✅ Article appears in http://localhost:8000/articles
- ✅ Article appears in dashboard's "Recent Reads" section
- ✅ Knowledge graph updates with new concepts

---

## 📝 Notes

- The extension uses **Manifest V3** (latest Chrome extension format)
- It requires **activeTab** and **scripting** permissions
- Content is extracted from the page's `<body>` element
- The extension sends data to `http://localhost:8000/ingest/article`

---

**Ready to proceed?** Follow the steps above and let me know when you've loaded the extension!
