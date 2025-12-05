import * as z from 'zod';
import { WordSchema, WordStatusEnum } from "../services/validations/schemas/Word";

export type WordStatus = z.infer<typeof WordStatusEnum>;
export type Word = z.infer<typeof WordSchema>;