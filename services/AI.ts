import { PAGES, TIMES_TO_LEARN_WORD, WORDS_IN_LEARNING_NUMBER } from '../constants/constants.ts';
import { Word } from '../types/Word.ts';
import { insertWordsInPromptString, getWordsForRepeat, objectsToTableStrings } from '../utils/index.ts';
import { addNewRows, getDataFromPage, replaceRows } from './google-sheets.ts';
import { parseJsonWords } from './validations';

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
  // Parse result
  const sessionResult = parseJsonWords(result);

  // get data from NEW, LEARNED pages
  const [newWords] = await Promise.all([
    getDataFromPage(PAGES.NEW)
  ]);
  let newWordsForPaste: Word[] = newWords;
  let inProgressWordsForPaste: Word[] = sessionResult.filter((word => word.status === PAGES.IN_PROGRESS));;
  let learnedWordsToAdd: Word[] = sessionResult.filter((word => word.status === PAGES.LEARNED && word.learn_score === TIMES_TO_LEARN_WORD));

  // add new words for inProgress if needed
  if (inProgressWordsForPaste.length < WORDS_IN_LEARNING_NUMBER) {
    const wordsNumberToAdd = WORDS_IN_LEARNING_NUMBER - inProgressWordsForPaste.length;
    const newWordsToLearn = newWordsForPaste.slice(0, wordsNumberToAdd).map((word) => ({
      ...word,
      status: PAGES.IN_PROGRESS,
    }));

    newWordsForPaste = newWordsForPaste.slice(wordsNumberToAdd);
    inProgressWordsForPaste = [...inProgressWordsForPaste, ...newWordsToLearn];
  }

  const newWordsForPasteData = objectsToTableStrings(newWordsForPaste);
  const inProgressWordsForPasteData = objectsToTableStrings(inProgressWordsForPaste);
  const learnedWordsToAddData = objectsToTableStrings(learnedWordsToAdd);

  console.log('newWordsForPasteData', newWordsForPasteData);
  console.log('inProgressWordsForPasteData', inProgressWordsForPasteData);
  console.log('learnedWordsForPasteData', learnedWordsToAddData);

  Promise.all([
    replaceRows(newWordsForPasteData, PAGES.NEW),
    replaceRows(inProgressWordsForPasteData, PAGES.IN_PROGRESS),
    // Leared words are only add, not replace all
    addNewRows(learnedWordsToAddData, PAGES.LEARNED),
  ]);
}
