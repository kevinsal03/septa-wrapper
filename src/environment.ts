import "dotenv/config";

export const ENV = {
  PORT: process.env["PORT"] ? Number(process.env["PORT"]) : 3000,
  HOST: process.env["HOST"] || "127.0.0.1",
  ALLOWED_HOSTS: process.env["ALLOWED_HOSTS"]
    ? process.env["ALLOWED_HOSTS"].split(",").map((h) => h.trim())
    : ["localhost", "127.0.0.1"],
  SEPTA_STANDARD_API_BASE: process.env["SEPTA_STANDARD_API_BASE"],
  SEPTA_FLAT_API_BASE: process.env["SEPTA_FLAT_API_BASE"],
};
