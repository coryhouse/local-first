import type { CustomMutatorDefs } from "@rocicorp/zero";
import type { schema } from "./schema";

export function createMutators() {
  return {
    vehicle: {
      update: async (tx, { id, make }: { id: string; make: string }) => {
        // Read existing vehicle
        const prev = await tx.query.vehicle.where("id", id).one();

        // Validate title length. Legacy issues are exempt.
        if (make.length < 2) {
          throw new Error(`Make is too short`);
        }

        await tx.mutate.vehicle.update({ id, make });
      },
    },
  } as const satisfies CustomMutatorDefs<typeof schema>;
}
