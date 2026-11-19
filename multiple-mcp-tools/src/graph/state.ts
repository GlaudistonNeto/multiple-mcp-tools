import { MessagesZodState } from '@langchain/langgraph';
import { z } from 'zod/v3';

export const GraphAnnotation = MessagesZodState.extend({
    answer: z.string().optional(),
    intent: z.string().optional(),
    fileContent: z.string().optional(),
    fileName: z.string().optional(),
    error: z.string().optional(),
});

export type GraphState = z.infer<typeof GraphAnnotation>;
