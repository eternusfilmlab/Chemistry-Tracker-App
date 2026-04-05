# Eternus Chemistry Tracker — Setup Guide

A cross-platform installable app for tracking your film chemistry batches, synced in real-time with Google Sheets.

---

## Architecture

```
Phone/PC (PWA App)  ←→  Google Apps Script (free API)  ←→  Google Sheet (database)
```

- **App**: Installable PWA — works like a native app on phone & desktop
- **Backend**: Google Apps Script — completely free, no server needed
- **Database**: Your existing Google Sheet — you can still edit it manually too
- **Sync**: Any change in the app writes to the sheet instantly. Hit ↻ to pull latest data.

---

## Step 1: Deploy the App on GitHub Pages

1. Create a new GitHub repo (e.g. `chemistry-tracker`)
2. Upload all these files to the repo root:
   ```
   index.html
   manifest.json
   sw.js
   icons/
     icon.svg
     icon-192.png
     icon-512.png
   ```
3. Go to **Settings → Pages** → set Source to "main" branch, root folder
4. Your app is now live at `https://yourusername.github.io/chemistry-tracker/`

---

## Step 2: Set Up Google Sheets Backend

### 2a. Prepare Your Sheet

Make sure your Google Sheet has these exact headers in Row 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| KITS NAME | Chemistry | Mix Date | Max Rolls | Notes | Status | Total Rolls for Batch | Additional Notes |

(Your existing sheet already has this format — you're good!)

### 2b. Add the Apps Script

1. Open your Chemistry Tracker Google Sheet
2. Click **Extensions → Apps Script**
3. Delete any existing code in the editor
4. Copy the entire contents of `google-apps-script.gs` and paste it in
5. **Important**: If your sheet tab is not named "Sheet1", change line 28:
   ```javascript
   const SHEET_NAME = 'Sheet1'; // Change this to your tab name
   ```
6. Click **Save** (💾)

### 2c. Deploy as Web App

1. In Apps Script, click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set these options:
   - **Description**: Chemistry Tracker API
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** the app when Google prompts you:
   - Click "Advanced" → "Go to [your project] (unsafe)" → "Allow"
   - This is safe — it's YOUR script accessing YOUR sheet
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## Step 3: Connect the App to Your Sheet

1. Open the app on your phone or PC
2. Tap the **⚙ Settings** button
3. Paste the Web App URL from Step 2c
4. Tap **Save & Sync**
5. Your data should load from the sheet!

---

## Step 4: Install as App

### On Phone (Android/iOS):
1. Open the app URL in Chrome (Android) or Safari (iOS)
2. **Android**: Tap the ⋮ menu → "Add to Home Screen" or "Install App"
3. **iOS**: Tap the Share button → "Add to Home Screen"
4. It now appears as a standalone app with the chemistry flask icon!

### On PC (Chrome/Edge):
1. Open the app URL in Chrome or Edge
2. Click the install icon (⊕) in the address bar, or go to ⋮ → "Install Eternus Chemistry Tracker"
3. It opens as a standalone window — no browser chrome

---

## How Sync Works

| Action | What happens |
|--------|-------------|
| **Add batch in app** | Instantly written to Google Sheet + saved locally |
| **Change status** | Updated in the Sheet in real-time |
| **Add rolls** | Roll log updated in the Sheet |
| **Edit Sheet directly** | Tap ↻ in the app to pull changes |
| **Offline usage** | Works from cache — syncs when back online |

Both the app and the Sheet always stay in sync. You can still use the Sheet directly if you want — just hit refresh in the app.

---

## Updating the Apps Script

If you need to update the script:
1. Go to Extensions → Apps Script
2. Make your changes
3. Click **Deploy → Manage deployments**
4. Click the ✏ edit icon on your deployment
5. Set version to **New version**
6. Click **Deploy**
7. The same URL will now use the updated code

---

## Troubleshooting

**"Connection failed"**: Check that the Apps Script URL is correct and the deployment is set to "Anyone" access.

**Data not showing**: Make sure your sheet headers match exactly (Row 1). Also check the `SHEET_NAME` in the script matches your sheet tab name.

**CORS errors**: The Apps Script handles CORS automatically. If you see errors, try redeploying.

**Sync seems slow**: Google Apps Script has a ~1-2 second latency. This is normal for a free service.

---

Built for Eternus Film Orders. Happy developing! 🎞
