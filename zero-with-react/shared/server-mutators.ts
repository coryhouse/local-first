import {
  CustomMutatorDefs,
  PostgresJSTransaction,
  ServerTransaction,
} from "@rocicorp/zero/pg";
import { Schema } from "./schema";
import { type UpdateVehicleArgs } from "./mutators";

export function createMutators(clientMutators: CustomMutatorDefs<Schema>) {
  return {
    // Reuse all client mutators on the server, except the ones overridden below
    ...clientMutators,

    vehicle: {
      // Reuse all issue mutators except `update`
      ...clientMutators.vehicle,

      update: async (tx, { id, price, status }: UpdateVehicleArgs) => {
        if (price < 0) {
          throw new Error(`Price must be positive (validated on server)`);
        }

        await tx.mutate.vehicle.update({ id, price, status });
      },
    },
  } as const satisfies CustomMutatorDefs<
    ServerTransaction<Schema, PostgresJSTransaction>
  >;
}
