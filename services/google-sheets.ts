import { google } from 'googleapis';
import { VOCABULARY_SHEET_ID, PAGES } from '../constants.ts';
import { tableStringToObject } from '../utils/index.ts';
// Set up authentication using a Service Account key
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // path to your service account JSON
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getDataFromPage(page = PAGES.IN_PROGRESS) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: VOCABULARY_SHEET_ID,
      range: `${page}!A2:Z`,
    });

    const tableValues = res.data.values || [];

    return tableStringToObject(tableValues)
  } catch (error) {
    console.error('Google Docs API error:', error);
    throw error;
  }
}

