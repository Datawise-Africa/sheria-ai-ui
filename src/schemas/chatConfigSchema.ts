import { z } from "zod";

export const chatConfigSchema = z.object({
  responseStyle: z.enum(['formal', 'casual', 'academic', 'practical']),
  detailLevel: z.enum(['brief', 'moderate', 'comprehensive']),
  includeExamples: z.boolean(),
  includeCaseLaw: z.boolean(),
  includeProcedures: z.boolean(),
  language: z.enum(['english', 'swahili', 'bilingual']),
  focusArea: z.enum(['constitutional', 'criminal', 'civil', 'family', 'land', 'employment', 'all']),
  responseLength: z.enum(['short', 'medium', 'long']),
});

export type ChatConfigFormData = z.infer<typeof chatConfigSchema>;
