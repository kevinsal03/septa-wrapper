import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { appendTrailingSlash, trimTrailingSlash } from "hono/trailing-slash";
import { septaRoute } from "./server/route.js";
import { septaAPI as septaApiService } from "./upstream-services/septa.js";
import { septaAlert } from "./server/alerts.js";
import { septaTrips } from "./server/trips.js";

const app = new Hono();

const allowedHosts = ["localhost", "127.0.0.1"];
app.use(
  "*",
  cors({
    origin: (origin) => {
      try {
        const hostname = new URL(origin).hostname;
        if (allowedHosts.includes(hostname)) {
          return origin; // allow
        }
      } catch {
        return ""; // invalid origin format
      }
      return ""; // deny if not in list
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(appendTrailingSlash());
app.use(trimTrailingSlash());

app.route("/routes", septaRoute);
app.route("/alerts", septaAlert);
app.route("/trips", septaTrips);

app.get("/", (c) => {
  return c.text("SEPTA API Wrapper");
});

export const septaAPI = septaApiService();

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
