import { useEffect, useState } from "react";
import type { Vehicle } from "./types/Vehicle";

const emptyVehicle = {
  id: "",
  make: "",
  model: "",
  year: null,
};

export default function Inventory() {
  const [newVehicle, setNewVehicle] = useState(emptyVehicle);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/vehicles").then((response) =>
      response
        .json()
        .then((data) => {
          setVehicles(data);
        })
        .finally(() => {
          setIsLoading(false);
        })
    );
  }, []);

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

      {isLoading && <p>Loading...</p>}
      {!isLoading && vehicles.length === 0 && <p>No vehicles found.</p>}

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
                fetch(`http://localhost:3001/vehicles/${v.id}`, {
                  method: "DELETE",
                }).then(() => {
                  setVehicles((prev) =>
                    prev.filter((vehicle) => vehicle.id !== v.id)
                  );
                });
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
