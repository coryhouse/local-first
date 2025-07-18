import type { CustomMutatorDefs } from "@rocicorp/zero";
import type { Schema, VehicleStatus } from "./schema";

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
        // const prev = await tx.query.vehicle.where("id", id).one();

        if (tx.location === "server") {
          if (price < 0) {
            throw new Error(
              `Price must be positive (validated on server) Price: ${price}`
            );
          }
        } else {
          if (price < 0) {
            throw new Error(
              `Price must be positive (validated on client) Price: ${price}`
            );
          }
        }

        await tx.mutate.vehicle.update({ id, price, status });
      },
    },
  } as const satisfies CustomMutatorDefs<Schema>;
}
