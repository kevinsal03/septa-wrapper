import { z } from "zod";

const TripStatusEnum = z.enum([
  "ON-TIME",
  "LATE",
  "EARLY",
  "NO GPS",
  "CANCELED",
]);

export const TripSchema = z.object({
  // --- Common Fields  ---
  route_id: z.string(),
  trip_id: z.string(),
  trip_headsign: z.string(),
  direction_id: z.number(),
  block_id: z.union([z.string(), z.number()]), // RR uses string, Bus+Trolley use number
  delay: z.number(),
  status: TripStatusEnum,
  lat: z.string().nullable(),
  lon: z.string().nullable(),
  heading: z.union([z.string(), z.number()]).nullable(), // Rail uses string, bus use number
  next_stop_id: z.union([z.string(), z.number()]).nullable(),
  next_stop_name: z.string().nullable(),
  next_stop_sequence: z.number().nullable(),

  seat_availability: z.string().nullable(),

  vehicle_id: z.string().nullable(), // Can be "None", a single ID, or a comma-separated list
  timestamp: z.number(),

  // --- Regional Rail Specific Fields (optional) ---
  service_id: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),

  // --- Bus/Trolley Specific Fields (optional) ---
  trip_completion: z.string().nullable().optional(),
  transit_date: z.string().optional(),
  direction_name: z.string().optional(),
});

export const TripArraySchema = z.array(TripSchema);

export type Trip = z.infer<typeof TripSchema>;
