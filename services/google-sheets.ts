import { google } from 'googleapis';
import { VOCABULARY_SHEET_ID, PAGES } from '../constants/constants.ts';
import { tableStringToObject } from '../utils/index.ts';
import { WordStatus } from '../types/Word.ts';
// Set up authentication using a Service Account key
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // path to your service account JSON
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getDataFromPage(page: WordStatus = PAGES.IN_PROGRESS) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: VOCABULARY_SHEET_ID,
      range: `${page}!A2:E`,
    });

    const tableValues = res.data.values || [];

    return tableStringToObject(tableValues);
  } catch (error) {
    console.error('Google Docs API error:', error);
    throw error;
  }
}

export async function addNewRows(data: string[][], page: WordStatus) {
  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: VOCABULARY_SHEET_ID,
      range: `${page}!A:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: data,
      },
    });

    return res;
  } catch (error) {
    console.error('Error adding rows to Google Sheets:', error);
    throw error;
  }
}

// replace all rows with new data
export async function replaceRows(data: string[][], page: WordStatus) {
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: VOCABULARY_SHEET_ID,
      range: `${page}!A2:E`,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: VOCABULARY_SHEET_ID,
      range: `${page}!A2:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: data },
    });
  } catch (error) {
    console.error('Error replacing rows in Google Sheets:', error);
    throw error;
  }
}
