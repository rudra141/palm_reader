// Chat companion output shape — `answer` is the surface-level reply (50-100
// words, plain language, emoji-permitted), `detail` is the master-practitioner
// expansion (120-250 words, citations, native vocabulary). The UI renders
// `answer` immediately and `detail` only when the reader clicks "More detail".

import { z } from 'zod';

export const ChatAnswerSchema = z.object({
  answer: z.string().min(20).max(2000),
  detail: z.string().min(40).max(4000),
});

export type ChatAnswer = z.infer<typeof ChatAnswerSchema>;

/** Wire shape for the assistant message stored in the chat thread on the client. */
export interface AssistantMessage {
  id: string;
  role: 'assistant';
  answer: string;
  detail: string;
}

export interface UserMessage {
  id: string;
  role: 'user';
  content: string;
}

export type ChatMessage = AssistantMessage | UserMessage;

/** Compact subset of ClientContext that the chat needs for personalisation
 *  in /ask direct-chat mode (where there's no full reading row in the DB). */
import type { ClientContext, SubStyleId } from '@/lib/validation/inputSchemas';

export interface DirectChatContext {
  visionDescription: string;
  tradition: 'indian' | 'chinese';
  subStyle: SubStyleId;
  clientContext: ClientContext;
}
export type { ClientContext };
