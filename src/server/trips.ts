import { Hono } from "hono";
import { septaAPI } from "../index.js";

export const septaTrips = new Hono();

septaTrips.get("/", async (ctx) => {
  const route_ids = await septaAPI.flat.getAllRouteIds();
  const route_ids_formatted = route_ids.join(",");
  console.log(route_ids_formatted);
  const data = await septaAPI.std.getTripsForRoute(route_ids_formatted);
  return ctx.json(data);
});
