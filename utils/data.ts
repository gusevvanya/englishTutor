import { WORDS_FOR_REPEAT_NUMBER } from '../constants/constants.ts';
import { Word } from '../types/Word.ts';

// {
//   "name": "string",
//   "status": "IN_PROGRESS | NEW | LEARNED",
//   "last_review": "date",
//   "learn_score": "number 1-5",
//   "learning_notes": "description form chat gpt about word learning progress"
// }

export function tableStringToObject(tableData: any) {
  return tableData.map(
    ([name, status, last_review, learn_score, learning_notes]) => ({
      name,
      status,
      last_review,
      learn_score,
      learning_notes,
    })
  );
}

export function objectToTableString(word: Word) {
  const { name, status, last_review, learn_score, learning_notes } = word;
  return [
    name,
    status,
    last_review,
    learn_score,
    learning_notes,
  ];
}

export function objectsToTableStrings(words: Word[]) {
  return words.map((word) => objectToTableString(word));
}

// TODO IT'S A BUSINESS LOGIC, MOVE TO SERVICE
export function getWordsForRepeat(words: Word[]) {
  const currentDate = Date.now();
  const onlyWordsForRepeat = words.filter(
    (word) => new Date(word.last_review).getTime() <= currentDate
  );

  const sortedWords = onlyWordsForRepeat.sort((a, b) => {
    const priorityA = Math.abs(new Date(a.last_review).getTime() - currentDate) / a.learn_score;
    const priorityB = Math.abs(new Date(b.last_review).getTime() - currentDate) / b.learn_score;

    return priorityB - priorityA;
  });

  return sortedWords.slice(0, WORDS_FOR_REPEAT_NUMBER);
}

export function getTableStringsForNewWords(newWords: string[]) {
  return newWords.map((word) => {
    const wordData: Word = {
      name: word,
      status: 'NEW',
      last_review: new Date().toISOString(),
      learn_score: 1,
      learning_notes: '',
    };

    return objectToTableString(wordData);
  });
}
