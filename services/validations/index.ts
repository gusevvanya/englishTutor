import * as z from 'zod';
import { WordSchema } from './schemas/Word.ts';
import { logError } from '../loggingService.ts';
export function parseJsonWord(word: string) {
  try {
    return WordSchema.parse(JSON.parse(word));
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessage = z.prettifyError(err);

      throw new Error(errorMessage);
    } else if (err instanceof SyntaxError && err.message.includes('JSON')) {
      throw new Error('‼️Invalid JSON format!');
    } else {
      logError(err as Error);
      throw new Error('‼️Something went wrong!');
    }
  }
}
