// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/shared/schema.ts
// for more complex examples, including many-to-many.

import {
  createSchema,
  definePermissions,
  ExpressionBuilder,
  Row,
  ANYONE_CAN,
  table,
  string,
  boolean,
  number,
  relationships,
  PermissionsConfig,
  enumeration,
  json,
} from "@rocicorp/zero";

export type VehicleStatus = "on sale" | "sold" | "reconditioning";

const vehicle = table("vehicle")
  .columns({
    id: string(),
    make: string(),
    model: string(),
    year: number(),
    price: number(),
    status: enumeration<VehicleStatus>(),
  })
  .primaryKey("id");

const message = table("message")
  .columns({
    id: string(),
    senderID: string().from("sender_id"),
    mediumID: string().from("medium_id"),
    body: string(),
    labels: json<string[]>(),
    timestamp: number(),
  })
  .primaryKey("id");

const user = table("user")
  .columns({
    id: string(),
    name: string(),
    partner: boolean(),
  })
  .primaryKey("id");

const medium = table("medium")
  .columns({
    id: string(),
    name: string(),
  })
  .primaryKey("id");

const messageRelationships = relationships(message, ({ one }) => ({
  sender: one({
    sourceField: ["senderID"],
    destField: ["id"],
    destSchema: user,
  }),
  medium: one({
    sourceField: ["mediumID"],
    destField: ["id"],
    destSchema: medium,
  }),
}));

export const schema = createSchema({
  tables: [user, medium, message, vehicle],
  relationships: [messageRelationships],
});

export type Schema = typeof schema;
export type Message = Row<typeof schema.tables.message>;
export type Medium = Row<typeof schema.tables.medium>;
export type User = Row<typeof schema.tables.user>;
export type Vehicle = Row<typeof schema.tables.vehicle>;

// The contents of your decoded JWT.
type AuthData = {
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const allowIfLoggedIn = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, keyof Schema["tables"]>
  ) => cmpLit(authData.sub, "IS NOT", null);

  const allowIfMessageSender = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<Schema, "message">
  ) => cmp("senderID", "=", authData.sub ?? "");

  const allowIfAdmin = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<Schema, "vehicle">
  ) => cmp("id", "!=", ""); // TODO. Only allow if admin.

  return {
    vehicle: {
      row: {
        select: ANYONE_CAN,
        delete: ANYONE_CAN,
        insert: ANYONE_CAN,
        update: {
          preMutation: [allowIfAdmin],
          postMutation: [allowIfAdmin],
        },
      },
    },
    medium: {
      row: {
        select: ANYONE_CAN,
      },
    },
    user: {
      row: {
        select: ANYONE_CAN,
      },
    },
    message: {
      row: {
        // anyone can insert
        insert: ANYONE_CAN,
        update: {
          // sender can only edit own messages
          preMutation: [allowIfMessageSender],
          // sender can only edit messages to be owned by self
          postMutation: [allowIfMessageSender],
        },
        // must be logged in to delete
        delete: [allowIfLoggedIn],
        // everyone can read current messages
        select: ANYONE_CAN,
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
