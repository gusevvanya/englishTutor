import { WORDS_FOR_REPEAT_NUMBER } from '../constants.ts';
import { Word } from '../services/validations/schemas/Word.ts';

// {
//   "name": "string",
//   "status": "IN_PROGRESS | NEW | LEARNED",
//   "last_review": "date",
//   "learn_score": "number 1-5",
//   "repeat_score": "number 1-...",
//   "learning_notes": "description form chat gpt about word learning progress"
// }

export function tableStringToObject(tableData: any) {
  return tableData.map(
    ([name, status, last_review, learn_score, repeat_score, learning_notes]) => ({
      name,
      status,
      last_review,
      learn_score,
      repeat_score,
      learning_notes,
    })
  );
}

export function objectToTableString(word: Word[]) {
  return word.map(({ name, status, last_review, learn_score, repeat_score, learning_notes }) => [
    name,
    status,
    last_review,
    learn_score,
    repeat_score,
    learning_notes,
  ]);
}

export function getWordsForRepeat(words: Word[]) {
  const currentDate = Date.now();

  const onlyWordsForRepeat = words.filter(
    (word) => new Date(word.last_review).getTime() <= currentDate
  );

  const sortedWords = onlyWordsForRepeat.sort((a, b) => {
    const priorityA = Math.abs(new Date(a.last_review).getTime() - currentDate) / a.repeat_score;
    const priorityB = Math.abs(new Date(b.last_review).getTime() - currentDate) / b.repeat_score;

    return priorityB - priorityA;
  });

  return sortedWords.slice(0, WORDS_FOR_REPEAT_NUMBER);
}

export function createTableStringsFromWords(rowWords: string[]) {
  return rowWords.map((word) => {
    const wordData: Word = {
      name: word,
      status: 'NEW',
      last_review: new Date().toISOString(),
      learn_score: 1,
      repeat_score: 1,
      learning_notes: '',
    };

    return objectToTableString([wordData]);
  });
}
