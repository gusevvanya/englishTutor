import { PAGES } from '../constants.ts';
import { insertWordsInPromptString, getWordsForRepeat } from '../utils/index.ts';
import { getDataFromPage } from './google-sheets.ts';
import { parseJsonWord } from './validations';
// Set up authentication using a Service Account key

export async function getPrompt() {
  try {
    const [allInProgressWords, allLearnedWords] = await Promise.all([
      getDataFromPage(PAGES.IN_PROGRESS),
      getDataFromPage(PAGES.LEARNED),
    ]);

    const wordsForRepeat = getWordsForRepeat(allLearnedWords);
    const wordsForPrompt = [...allInProgressWords, ...wordsForRepeat];

    return insertWordsInPromptString(wordsForPrompt);
  } catch (error) {
    console.error('getPrompt error:', error);
    throw error;
  }
}

export async function processSessionResult(result: string) {
  const parsedResult = parseJsonWord(result);

  // set results
}
