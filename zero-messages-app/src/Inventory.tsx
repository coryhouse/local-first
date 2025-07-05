import { useQuery, useZero } from "@rocicorp/zero/react";
import { Schema } from "./schema";
import { useState } from "react";

const emptyVehicle = {
  id: "",
  make: "",
  model: "",
  year: null,
};

export default function Inventory() {
  const [newVehicle, setNewVehicle] = useState(emptyVehicle);
  const z = useZero<Schema>();
  const [inventory] = useQuery(z.query.inventory, {
    ttl: "5m",
  });

  // If initial sync hasn't completed, render nothing.
  if (!inventory.length) {
    return null;
  }

  function onAddVehicleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [e.target.placeholder.toLowerCase()]:
        e.target.type === "number" ? Number(value) : value,
    }));
  }

  return (
    <>
      <h1>Inventory</h1>

      <h2>Add Vehicle</h2>

      <form>
        <input
          type="number"
          placeholder="Year"
          onChange={onAddVehicleChange}
          value={newVehicle.year || ""}
        />
        <input
          type="text"
          placeholder="Make"
          onChange={onAddVehicleChange}
          value={newVehicle.make}
        />
        <input
          type="text"
          placeholder="Model"
          onChange={onAddVehicleChange}
          value={newVehicle.model}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            z.mutate.inventory.insert({
              ...newVehicle,
              year: newVehicle.year || 0, // Ensure year is a number
              id: crypto.randomUUID(),
            });
            setNewVehicle(emptyVehicle); // Reset the form
          }}
        >
          Add
        </button>
      </form>

      {inventory.map((v) => (
        <ul key={v.id}>
          <li>
            <input
              type="text"
              value={v.year}
              onChange={(e) => {
                z.mutate.inventory.update({
                  id: v.id,
                  make: v.make,
                  model: v.model,
                  year: e.target.value ? Number(e.target.value) : 0,
                });
              }}
            />{" "}
            <input
              type="text"
              value={v.make}
              onChange={(e) => {
                z.mutate.inventory.update({
                  id: v.id,
                  make: e.target.value,
                  model: v.model,
                  year: v.year,
                });
              }}
            />{" "}
            <input
              type="text"
              value={v.model}
              onChange={(e) => {
                z.mutate.inventory.update({
                  id: v.id,
                  make: v.make,
                  model: e.target.value,
                  year: v.year,
                });
              }}
            />{" "}
            <button
              onClick={() =>
                z.mutate.inventory.update({
                  id: v.id,
                  make: v.make,
                  model: v.model,
                  year: v.year,
                })
              }
            >
              Update
            </button>{" "}
            <button onClick={() => z.mutate.inventory.delete({ id: v.id })}>
              Delete
            </button>
          </li>
        </ul>
      ))}
    </>
  );
}
