import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d694d660/health", (c) => {
  return c.json({ status: "ok" });
});

// Inventory CRUD using kv_store
app.get("/make-server-d694d660/items", async (c) => {
  try {
    const items = await kv.getByPrefix("item:");
    return c.json(items || []);
  } catch (err) {
    console.error("Error fetching items:", err);
    return c.json({ error: "Failed to fetch items" }, 500);
  }
});

app.post("/make-server-d694d660/items", async (c) => {
  try {
    const item = await c.req.json();
    if (!item.id) {
      item.id = Math.random().toString(36).substring(2, 9);
    }
    await kv.set(`item:${item.id}`, item);
    return c.json(item);
  } catch (err) {
    console.error("Error creating item:", err);
    return c.json({ error: "Failed to create item" }, 500);
  }
});

app.put("/make-server-d694d660/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const current = await kv.get(`item:${id}`);
    
    if (!current) {
      return c.json({ error: "Item not found" }, 404);
    }
    
    const updatedItem = { ...current, ...updates };
    await kv.set(`item:${id}`, updatedItem);
    return c.json(updatedItem);
  } catch (err) {
    console.error("Error updating item:", err);
    return c.json({ error: "Failed to update item" }, 500);
  }
});

app.delete("/make-server-d694d660/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`item:${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.error("Error deleting item:", err);
    return c.json({ error: "Failed to delete item" }, 500);
  }
});

Deno.serve(app.fetch);
