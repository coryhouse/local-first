import { useEffect, useState } from "react";
import type { Vehicle } from "./types/Vehicle";

const emptyVehicle: Vehicle = {
  id: "",
  make: "",
  model: "",
  year: null,
  price: null,
  sold: false,
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

  function onVehicleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    vehicle: Vehicle
  ) {
    const { value } = e.target;
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicle.id
          ? {
              ...v,
              [e.target.name]: value,
            }
          : v
      )
    );
  }

  function onVehicleInputBlur(
    e: React.FocusEvent<HTMLInputElement>,
    vehicle: Vehicle
  ) {
    const { value } = e.target;
    if (e.target.name === "price" && value) {
      const price = Number(value);
      if (isNaN(price)) {
        alert("Please enter a valid number for price.");
        return;
      }
      fetch(`http://localhost:3001/vehicles/${vehicle.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price }),
      });
    }
  }

  return (
    <>
      <h1>Vehicles For Sale</h1>

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
            if (!newVehicle.year || !newVehicle.make || !newVehicle.model) {
              alert("Please fill in all fields.");
              return;
            }
            setIsLoading(true);

            fetch("http://localhost:3001/vehicles", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newVehicle),
            })
              .then((response) => response.json())
              .then((data) => {
                setVehicles((prev) => [...prev, data]);
              })
              .finally(() => {
                setIsLoading(false);
              });

            // Reset the form
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
          <li style={{ listStyleType: "none", paddingLeft: "0" }}>
            {`${v.year} ${v.make} ${v.model} -`}${" "}
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={v.price || ""}
              onChange={(e) => onVehicleInputChange(e, v)}
              onBlur={(e) => onVehicleInputBlur(e, v)}
            />
            <input
              type="checkbox"
              name="sold"
              checked={v.sold}
              onChange={(e) => {
                setVehicles((prev) =>
                  prev.map((vehicle) =>
                    vehicle.id === v.id
                      ? { ...vehicle, sold: e.target.checked }
                      : vehicle
                  )
                );
              }}
            />
            <label>Sold</label>
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
