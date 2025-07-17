import type { CustomMutatorDefs } from "@rocicorp/zero";
import type { schema, VehicleStatus } from "./schema";

export type UpdateVehicleArgs = {
  id: string;
  price: number;
  status: VehicleStatus;
};

export function createMutators() {
  return {
    vehicle: {
      update: async (tx, { id, price, status }: UpdateVehicleArgs) => {
        // Optionally, could read existing vehicle
        const prev = await tx.query.vehicle.where("id", id).one();

        // if (tx.location === "server") // could also do server-specific logic this way and just call this in server-mutators.ts
        if (price < 0) {
          throw new Error(`Price must be positive (validated on client)`);
        }

        await tx.mutate.vehicle.update({ id, price, status });
      },
    },
  } as const satisfies CustomMutatorDefs<typeof schema>;
}
