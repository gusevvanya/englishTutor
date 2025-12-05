import { WordStatus } from "../types/Word";

export const VOCABULARY_SHEET_ID = '1e7G8hn5g-FuMEP_zLyuwrFhFsyJuQM1QxjPipzCy3IU';

export const PAGES: Record<WordStatus, WordStatus>= {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  LEARNED: 'LEARNED',
};

export const WORDS_FOR_REPEAT_NUMBER = 3;

export const WORDS_IN_LEARNING_NUMBER = 7;

export const TIMES_TO_LEARN_WORD = 5;