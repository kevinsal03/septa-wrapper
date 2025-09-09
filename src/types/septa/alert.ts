import { z } from "zod";

// Defines the schema for a single alert object
export const SeptaAlertSchema = z.object({
  alert_id: z.string(),

  routes: z.array(z.string()),

  type: z.enum(["ADVISORY", "ALERT", "DETOUR"]),

  subject: z.string().nullable(),

  message: z.string(),

  status: z.enum(["NORMAL", "SUSPENDED"]),

  cause: z.enum([
    "OTHER_CAUSE",
    "CONSTRUCTION",
    "MAINTENANCE",
    "UNKNOWN_CAUSE",
    "TECHNICAL_PROBLEM",
  ]),

  effect: z.enum([
    "MODIFIED_SERVICE",
    "NO_SERVICE",
    "ACCESSIBILITY_ISSUE",
    "OTHER_EFFECT",
    "UNKNOWN_EFFECT",
    "REDUCED_SERVICE",
    "DETOUR",
  ]),

  severity: z.enum(["SEVERE", "INFO", "UNKNOWN_SEVERITY", "WARNING"]),

  trains: z.array(z.string()),

  blocks: z.array(z.unknown()),

  trips: z.array(z.unknown()),

  stops: z.array(z.unknown()),

  start: z.string(),

  end: z.string().nullable(),
});

export const SeptaAlertArraySchema = z.array(SeptaAlertSchema);

export type SeptaAlert = z.infer<typeof SeptaAlertSchema>;
export type SeptaAlertArray = z.infer<typeof SeptaAlertSchema>;
