import { z } from "zod";

export enum RouteType {
  TROLLEY = 0,
  SUBWAY = 1,
  REGIONAL_RAIL = 2,
  BUS = 3,
  TRACKLESS_TROLLEY = 11,
}

export const RouteDocumentSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    url: z.string(),
    linkLabel: z.string(),
  })
  .strip();

export const DetailedRouteSchema = z
  .object({
    route_id: z.string(),
    route_long_name: z.string(),
    route_short_name: z.string(),
    route_type: z.enum(RouteType),
    route_color: z.string(),
    route_text_color: z.string(),
    route_color_dark: z.string(),
    route_color_text_dark: z.string(),
    route_frequency_text: z.string(),
    is_frequent_bus: z.boolean(),
  })
  .strip();

export const FullRouteSchema = DetailedRouteSchema.extend({
  documents: z.array(RouteDocumentSchema),
}).strip();

export const FullRouteArraySchema = z.array(FullRouteSchema);

export type RouteDocument = z.infer<typeof RouteDocumentSchema>;
export type DetailedRoute = z.infer<typeof DetailedRouteSchema>;
export type FullRoute = z.infer<typeof FullRouteSchema>;
export type FullRouteArray = z.infer<typeof FullRouteArraySchema>;
