import { z } from "zod";

z.config(z.locales.fr());

const id = z.string().min(1);

export const richDocSchema = z.looseObject({
  type: z.literal("doc"),
  content: z.array(z.unknown()).optional(),
});

export const entrySchema = z.object({ id, text: z.string() });

export const statusSchema = z.enum(["validated", "partial", "invalidated"]);

export const settingsSchema = z.object({
  repo: z
    .string()
    .trim()
    .regex(/^[\w.-]+\/[\w.-]+$/, "Au format username/repo"),
  token: z.string().trim().min(1, "Token requis"),
});

export const aavSchema = z.object({
  id,
  level: z.string(),
  label: z.string(),
  status: statusSchema.nullable(),
});

export const outboundSchema = z.object({
  loop: z.number().int().min(1),
  ue: z.string(),
  context: z.string().default(""),
  keywords: z.array(z.string()),
  unknownWords: z.array(z.string()),
  problem: z.string(),
  constraints: z.array(entrySchema),
  deliverables: z.array(entrySchema),
  generalization: z.string(),
  hypotheses: z.array(entrySchema),
  actionPlan: z.array(entrySchema),
});

export const returnSchema = z.object({
  definitions: z.record(z.string(), z.string()),
  verdicts: z.record(z.string(), statusSchema),
  comments: z.record(z.string(), z.string()),
  actionPlan: richDocSchema.optional(),
  aavs: z.array(aavSchema),
  questions: z.array(
    z.object({ id, question: z.string(), answer: z.string() }),
  ),
});

export const loopSchema = z.object({
  id,
  outbound: outboundSchema,
  return: returnSchema,
});

export type RichDoc = z.infer<typeof richDocSchema>;
export type Entry = z.infer<typeof entrySchema>;
export type Status = z.infer<typeof statusSchema>;
export type SettingsData = z.infer<typeof settingsSchema>;
export type Aav = z.infer<typeof aavSchema>;
export type Outbound = z.infer<typeof outboundSchema>;
export type Return = z.infer<typeof returnSchema>;
export type LoopData = z.infer<typeof loopSchema>;

export const statusLabels: Record<Status, string> = {
  validated: "Validée",
  partial: "Partielle",
  invalidated: "Invalidée",
};

export const newId = () => crypto.randomUUID();

export const newOutbound = (): Outbound => ({
  loop: 1,
  ue: "",
  context: "",
  keywords: [],
  unknownWords: [],
  problem: "",
  constraints: [],
  deliverables: [],
  generalization: "",
  hypotheses: [],
  actionPlan: [],
});

export const newReturn = (): Return => ({
  definitions: {},
  verdicts: {},
  comments: {},
  aavs: [],
  questions: [],
});
