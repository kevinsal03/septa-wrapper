import { Hono } from "hono";
import { septaAPI } from "../index.js";

export const septaAlert = new Hono();

septaAlert.get("/", async (ctx) => {
  const routes = await septaAPI.std.getAlerts();
  return ctx.json(routes);
});

septaAlert.get("/:alert_id", async (ctx) => {
  const alert_id = ctx.req.param("alert_id");
  const routes = await septaAPI.std.getAlert(alert_id);
  return ctx.json(routes);
});
