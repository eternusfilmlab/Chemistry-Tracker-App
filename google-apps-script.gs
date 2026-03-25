/**
 * ============================================================
 * ETERNUS CHEMISTRY TRACKER — Google Apps Script Backend
 * ============================================================
 * 
 * HOW TO SET UP:
 * 1. Open your Google Sheet (Chemistry Tracker)
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" → "New Deployment"
 * 5. Choose type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone" 
 * 8. Click "Deploy" and authorize when prompted
 * 9. Copy the Web App URL — paste it into the app's Settings
 * 
 * SHEET FORMAT (Row 1 must have these exact headers):
 * A: KITS NAME | B: Chemistry | C: Mix Date | D: Max Rolls | E: Notes | F: Status | G: Total Rolls for Batch | H: Additional Notes
 *
 * The app will read from and write to this sheet.
 * ============================================================
 */

// Configuration
const SHEET_NAME = 'Sheet1'; // Change if your sheet tab has a different name

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const action = e.parameter.action || 'read';
  
  try {
    let result;
    
    switch (action) {
      case 'read':
        result = readAllBatches();
        break;
      case 'add':
        result = addBatch(JSON.parse(e.postData.contents));
        break;
      case 'update':
        result = updateBatch(JSON.parse(e.postData.contents));
        break;
      case 'delete':
        result = deleteBatch(e.parameter.row);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Read all batches from the sheet
 */
function readAllBatches() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const batches = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Skip empty rows
    if (!row[0] && !row[1]) continue;
    
    batches.push({
      row: i + 1, // Actual row number in sheet (for updates)
      kit: (row[0] || '').toString().trim(),
      chem: (row[1] || '').toString().trim(),
      mixDate: (row[2] || '').toString().trim(),
      maxRolls: (row[3] || '').toString().trim(),
      notes: (row[4] || '').toString().trim(),
      status: (row[5] || '').toString().trim(),
      rolls: (row[6] || '').toString().trim().replace(/\n/g, ', '),
      extra: (row[7] || '').toString().trim()
    });
  }
  
  return { success: true, data: batches, count: batches.length, timestamp: new Date().toISOString() };
}

/**
 * Add a new batch to the sheet
 */
function addBatch(batch) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  // Find the first empty row after existing data
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;
  
  // Convert comma-separated rolls back to newline-separated for the sheet
  const rollsForSheet = (batch.rolls || '').replace(/, /g, '\n');
  
  sheet.getRange(newRow, 1, 1, 8).setValues([[
    batch.kit || '',
    batch.chem || '',
    batch.mixDate || '',
    batch.maxRolls || '',
    batch.notes || '',
    batch.status || 'Fresh',
    rollsForSheet,
    batch.extra || ''
  ]]);
  
  return { success: true, row: newRow, message: 'Batch added successfully' };
}

/**
 * Update an existing batch (by row number)
 */
function updateBatch(batch) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const row = batch.row;
  
  if (!row || row < 2) {
    return { error: 'Invalid row number' };
  }
  
  const rollsForSheet = (batch.rolls || '').replace(/, /g, '\n');
  
  sheet.getRange(row, 1, 1, 8).setValues([[
    batch.kit || '',
    batch.chem || '',
    batch.mixDate || '',
    batch.maxRolls || '',
    batch.notes || '',
    batch.status || '',
    rollsForSheet,
    batch.extra || ''
  ]]);
  
  return { success: true, row: row, message: 'Batch updated successfully' };
}

/**
 * Delete a batch (clear the row)
 */
function deleteBatch(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  row = parseInt(row);
  
  if (!row || row < 2) {
    return { error: 'Invalid row number' };
  }
  
  sheet.getRange(row, 1, 1, 8).clearContent();
  return { success: true, message: 'Batch deleted' };
}

/**
 * Utility: Test the script works (run this manually)
 */
function testRead() {
  const result = readAllBatches();
  Logger.log(JSON.stringify(result, null, 2));
}
