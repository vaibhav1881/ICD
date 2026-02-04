# 🧩 Browser Extension - Loading & Testing Guide

## Step 1: Load the Extension in Chrome

### 1.1 Open Extensions Page
1. Open Google Chrome
2. In the address bar, type: `chrome://extensions/`
3. Press Enter

### 1.2 Enable Developer Mode
1. Look for the **"Developer mode"** toggle in the **top-right corner**
2. Click to enable it (should turn blue/on)

### 1.3 Load the Extension
1. Click the **"Load unpacked"** button (appears after enabling Developer mode)
2. A file browser will open
3. Navigate to: `D:\VJTI\VJTI\FYP\extension`
4. Click **"Select Folder"**

### 1.4 Verify Extension Loaded
You should see a new card appear with:
- **Name**: "Idea Collision Capture"
- **ID**: (random string)
- **Version**: 1.0
- **Status**: Enabled (toggle should be ON)

### 1.5 Pin the Extension (Optional but Recommended)
1. Click the **puzzle piece icon** (🧩) in Chrome toolbar (top-right)
2. Find "Idea Collision Capture"
3. Click the **pin icon** next to it
4. The extension icon should now appear in your toolbar

---

## Step 2: Test the Extension

### Test 1: Capture a Wikipedia Article

1. **Open a new tab** and go to: https://en.wikipedia.org/wiki/Artificial_intelligence

2. **Click the extension icon** in your toolbar

3. **Click "Capture This Page"** button

4. **Expected Result**: 
   - You should see a success message: "Article saved successfully!"
   - Or: "Saved!" notification

### Test 2: Verify Article was Saved

1. **Open a new tab** and go to: http://localhost:8000/articles

2. **Expected Result**: 
   - You should see JSON data with your captured article
   - It should include:
     ```json
     {
       "id": 1,
       "title": "Artificial intelligence - Wikipedia",
       "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
       "text": "Artificial intelligence (AI)...",
       "created_at": "2025-11-23T..."
     }
     ```

### Test 3: View in Dashboard

1. **Go to**: http://localhost:3000

2. **Check the "Recent Articles" section**
   - You should see your Wikipedia article listed

3. **Check the stats**
   - "Total Concepts" should have increased
   - This shows NLP extraction worked!

### Test 4: Generate a Collision

1. **Go to**: http://localhost:3000/collisions

2. **Click "Generate New" button**

3. **Expected Result**:
   - A new collision card appears
   - Shows two concepts and their creative connection
   - Example: "Neural Networks" × "Urban Planning"

---

## Troubleshooting

### Extension doesn't appear after loading
- **Check**: Make sure you selected the `extension` folder, not a subfolder
- **Fix**: Remove and reload the extension

### "Capture This Page" button doesn't work
- **Check**: Open browser console (F12) and look for errors
- **Check**: Make sure backend is running at http://localhost:8000
- **Fix**: Restart the backend server

### No articles appear in dashboard
- **Check**: Visit http://localhost:8000/articles to see if data was saved
- **Check**: Backend console for errors
- **Fix**: Check database connection (PostgreSQL should be running)

### CORS errors in console
- **Check**: Backend CORS settings in `main.py`
- **Fix**: Backend should allow `chrome-extension://*`

---

## Extension Files Overview

Your extension consists of:

```
extension/
├── manifest.json       # Extension configuration
├── background.js       # Service worker (handles API calls)
├── content.js         # Page scraper (extracts content)
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
└── icons/             # Extension icons (optional)
```

---

## Next Steps After Testing

Once you've successfully captured an article:

1. ✅ **Capture more articles** from different domains
2. ✅ **Generate collisions** to see AI-powered insights
3. ✅ **Explore the 3D graph** to visualize concept connections
4. ✅ **Check Neo4j browser** (http://localhost:7474) to see the graph database

---

## Quick Reference

| Action | URL |
|--------|-----|
| **Load Extension** | `chrome://extensions/` |
| **Dashboard** | http://localhost:3000 |
| **API Docs** | http://localhost:8000/docs |
| **View Articles (JSON)** | http://localhost:8000/articles |
| **Neo4j Browser** | http://localhost:7474 |

---

Happy capturing! 🚀
