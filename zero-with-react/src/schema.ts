// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/schema.ts
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
  PermissionsConfig,
} from "@rocicorp/zero";

const vehicle = table("vehicle")
  .columns({
    id: string(),
    make: string(),
    model: string(),
    year: number(),
    price: number(),
    status: string(),
  })
  .primaryKey("id");

const user = table("user")
  .columns({
    id: string(),
    name: string(),
    partner: boolean(),
  })
  .primaryKey("id");

export const schema = createSchema({
  tables: [user, vehicle],
  relationships: [],
});

export type Schema = typeof schema;
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

  const allowIfVehicleOwner = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<Schema, "vehicle">
  ) => cmp("id", "!=", ""); // Hack. Allow anyone to update.

  return {
    vehicle: {
      row: {
        select: ANYONE_CAN,
        delete: ANYONE_CAN,
        insert: ANYONE_CAN,
        update: {
          preMutation: [allowIfVehicleOwner],
          postMutation: [allowIfVehicleOwner],
        },
      },
    },
    user: {
      row: {
        select: ANYONE_CAN,
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
