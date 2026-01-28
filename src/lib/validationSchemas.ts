import { z } from "zod";

// Profile validation schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  city: z
    .string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(100, "Cidade deve ter no máximo 100 caracteres")
    .trim(),
  neighborhood: z
    .string()
    .min(2, "Bairro deve ter pelo menos 2 caracteres")
    .max(100, "Bairro deve ter no máximo 100 caracteres")
    .trim(),
  years_playing: z
    .number()
    .int()
    .min(0, "Anos de prática não pode ser negativo")
    .max(100, "Anos de prática inválido")
    .optional()
    .nullable(),
  skill_level: z
    .number()
    .int()
    .min(1, "Nível mínimo é 1")
    .max(5, "Nível máximo é 5"),
  frequency: z.enum(["iniciante", "casual", "regular", "competitivo"]),
  dominant_hand: z.enum(["direita", "esquerda", "ambas"]),
  max_travel_radius: z
    .number()
    .int()
    .min(1, "Raio mínimo é 1km")
    .max(100, "Raio máximo é 100km")
    .optional(),
  availability: z
    .array(
      z.object({
        day: z.enum(["seg", "ter", "qua", "qui", "sex", "sab", "dom"]),
        slots: z
          .array(z.enum(["manha", "tarde", "noite"]))
          .min(1, "Selecione pelo menos um horário"),
      })
    )
    .optional(),
});

// Game invite validation schema
export const gameInviteSchema = z.object({
  neighborhood: z
    .string()
    .min(2, "Bairro deve ter pelo menos 2 caracteres")
    .max(100, "Bairro deve ter no máximo 100 caracteres")
    .trim(),
  city: z
    .string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(100, "Cidade deve ter no máximo 100 caracteres")
    .trim(),
  notes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .nullable(),
  court_name: z
    .string()
    .max(200, "Nome da quadra deve ter no máximo 200 caracteres")
    .optional()
    .nullable(),
  court_address: z
    .string()
    .max(300, "Endereço deve ter no máximo 300 caracteres")
    .optional()
    .nullable(),
  date: z.string().min(1, "Data é obrigatória"),
  time_slot: z.enum(["manha", "tarde", "noite"]),
  game_type: z.enum(["simples", "duplas"]),
  desired_level: z.number().int().min(1).max(5),
  level_range_min: z.number().int().min(1).max(5).optional().nullable(),
  level_range_max: z.number().int().min(1).max(5).optional().nullable(),
  max_radius: z.number().int().min(1).max(100).optional().nullable(),
});

// Message validation schema
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Mensagem não pode estar vazia")
    .max(2000, "Mensagem deve ter no máximo 2000 caracteres")
    .trim(),
});

// Match request validation schema
export const matchRequestSchema = z.object({
  message: z
    .string()
    .max(500, "Mensagem deve ter no máximo 500 caracteres")
    .optional()
    .nullable(),
});

// Type exports
export type ProfileFormData = z.infer<typeof profileSchema>;
export type GameInviteFormData = z.infer<typeof gameInviteSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type MatchRequestFormData = z.infer<typeof matchRequestSchema>;

// Validation helper function
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = result.error.errors.map(
    (err) => `${err.path.join(".")}: ${err.message}`
  );
  return { success: false, errors };
}
