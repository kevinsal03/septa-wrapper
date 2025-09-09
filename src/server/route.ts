import { Hono } from "hono";
import { septaAPI } from "../index.js";

export const septaRoute = new Hono();

septaRoute.get("/", async (ctx) => {
  const routes = await septaAPI.flat.getRoutes();
  return ctx.json(routes);
});

septaRoute.get("/:route_id", async (ctx) => {
  const routeId = ctx.req.param("route_id");
  const route = await septaAPI.flat.getRoute(routeId);

  if (!route) {
    ctx.status(201);
    return ctx.json({});
  }

  return ctx.json(route);
});

septaRoute.get("/:route_id/alerts", async (ctx) => {
  const routeId = ctx.req.param("route_id");
  const route = await septaAPI.std.getAlertsForRoute(routeId);

  return ctx.json(route);
});

septaRoute.get("/:route_id/trips", async (ctx) => {
  const routeId = ctx.req.param("route_id");
  const route = await septaAPI.std.getTripsForRoute(routeId);

  return ctx.json(route);
});
