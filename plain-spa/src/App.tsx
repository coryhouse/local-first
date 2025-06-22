import { useState } from "react";
import type { Vehicle } from "./types/Vehicle";

const emptyVehicle = {
  id: "",
  make: "",
  model: "",
  year: null,
};

export default function Inventory() {
  const [newVehicle, setNewVehicle] = useState(emptyVehicle);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  function onAddVehicleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [e.target.placeholder.toLowerCase()]:
        e.target.type === "number" ? Number(value) : value,
    }));
  }

  function onVehicleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const id = e.target.closest("li")?.getAttribute("data-id");
    if (id) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                [e.target.placeholder.toLowerCase()]:
                  e.target.type === "number" ? Number(value) : value,
              }
            : v
        )
      );
    }
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
            // TODO INSERT
            setNewVehicle(emptyVehicle); // Reset the form
          }}
        >
          Add
        </button>
      </form>

      {vehicles.map((v) => (
        <ul key={v.id}>
          <li>
            <input type="text" value={v.year} onChange={onVehicleInputChange} />{" "}
            <input type="text" value={v.make} onChange={onVehicleInputChange} />{" "}
            <input
              type="text"
              value={v.model}
              onChange={onVehicleInputChange}
            />{" "}
            <button
              onClick={() => {
                // TODO UPDATE
              }}
            >
              Update
            </button>{" "}
            <button
              onClick={() => {
                // TODO DELETE
              }}
            >
              Delete
            </button>
          </li>
        </ul>
      ))}
    </>
  );
}
