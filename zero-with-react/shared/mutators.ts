import type { CustomMutatorDefs } from "@rocicorp/zero";
import type { schema, VehicleStatus } from "./schema";

export function createMutators() {
  return {
    vehicle: {
      update: async (
        tx,
        {
          id,
          price,
          status,
        }: { id: string; price: number; status: VehicleStatus }
      ) => {
        // Read existing vehicle
        const prev = await tx.query.vehicle.where("id", id).one();

        // Validate price.
        if (price < 0) {
          throw new Error(`Price must be positive`);
        }

        await tx.mutate.vehicle.update({ id, price, status });
      },
    },
  } as const satisfies CustomMutatorDefs<typeof schema>;
}
