import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicles").order("desc").collect();
  },
});

export const deleteVehicle = mutation({
  args: {
    id: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const add = mutation({
  // NOTE: Can use Zod to validate args too: https://stack.convex.dev/typescript-zod-function-validation
  args: {
    make: v.string(),
    model: v.string(),
    year: v.number(),
    price: v.number(),
    status: v.union(
      v.literal("on sale"),
      v.literal("sold"),
      v.literal("reconditioning"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("vehicles", args);
  },
});

export const update = mutation({
  args: {
    _id: v.id("vehicles"),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    price: v.number(),
    status: v.union(
      v.literal("on sale"),
      v.literal("sold"),
      v.literal("reconditioning"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, args);
  },
});
