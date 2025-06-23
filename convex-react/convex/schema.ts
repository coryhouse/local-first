import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  vehicles: defineTable({
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
  }),
});
