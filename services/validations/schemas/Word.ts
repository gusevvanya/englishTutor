import * as z from 'zod';

export const WordStatusEnum = z.enum(['IN_PROGRESS', 'NEW', 'LEARNED']);

export const WordSchema = z.object({
  name: z.string().min(1, "name can't be empty"),
  status: WordStatusEnum,
  last_review: z.coerce.date()
    .min(1, "date can't be empty")
    .min(1, "last_review can't be empty"),
  learn_score: z
    .number()
    .int('learn_score must be an integer')
    .min(1, 'learn_score must be >= 1')
    .max(5, 'learn_score must be <= 5')
    .min(1, "learn_score can't be empty"),
  repeat_score: z
    .number()
    .int('repeat_score must be an integer')
    .min(1, 'repeat_score must be >= 1')
    .min(1, "repeat_score can't be empty"),
  learning_notes: z.string().optional().default(''),
});

export type Word = z.infer<typeof WordSchema>;