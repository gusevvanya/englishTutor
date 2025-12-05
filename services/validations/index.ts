import * as z from 'zod';
import { WordsArraySchema } from './schemas/Word.ts';
import { logError } from '../loggingService.ts';

export function parseJsonWords(words: string) {
  try {
    return WordsArraySchema.parse(JSON.parse(words));
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessage = z.prettifyError(err);

      throw new Error(errorMessage);
    } else if (err instanceof SyntaxError && err.message.includes('JSON')) {
      console.error('JSON Syntax Error:', err.message);
      throw new Error('‼️Invalid JSON format!');
    } else {
      logError(err as Error);
      throw new Error('‼️Something went wrong!');
    }
  }
}