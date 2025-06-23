import { useEffect, useState } from "react";
import type { Vehicle } from "./types/Vehicle";
import toast from "react-hot-toast";

const emptyVehicle: Vehicle = {
  id: "",
  make: "",
  model: "",
  year: null,
  price: null,
  status: null,
};

export default function Inventory() {
  const [newVehicle, setNewVehicle] = useState(emptyVehicle);
  const [savingVehicleIds, setSavingVehicleIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/vehicles").then((response) =>
      response
        .json()
        .then((data) => {
          setVehicles(data);
        })
        .catch((error) => {
          toast.error("Failed to fetch vehicles: " + error.message);
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

  function onPriceChange(
    e: React.ChangeEvent<HTMLInputElement>,
    vehicle: Vehicle
  ) {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicle.id
          ? {
              ...v,
              [e.target.name]: e.target.value,
            }
          : v
      )
    );
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <main style={{ padding: 20 }}>
      <h2>Inventory</h2>

      {vehicles.length === 0 && <p>No vehicles found.</p>}

      <form>
        <ul style={{ margin: 0, padding: 0 }}>
          {vehicles.map((v) => (
            <li
              key={v.id}
              style={{ listStyleType: "none", paddingLeft: "0", margin: 0 }}
            >
              <button
                style={{ backgroundColor: "white" }}
                onClick={(e) => {
                  e.preventDefault();
                  fetch(`http://localhost:3001/vehicles/${v.id}`, {
                    method: "DELETE",
                  })
                    .then(() => {
                      setVehicles((prev) =>
                        prev.filter((vehicle) => vehicle.id !== v.id)
                      );
                    })
                    .catch((error) => {
                      toast.error("Failed to delete vehicle: " + error.message);
                    });
                }}
              >
                ❌
              </button>
              {`${v.year} ${v.make} ${v.model} -`}${" "}
              <input
                type="text"
                name="price"
                placeholder="Price"
                style={{ width: 50 }}
                value={v.price || ""}
                onChange={(e) => onPriceChange(e, v)}
              />{" "}
              <select
                name="status"
                value={v.status || ""}
                onChange={(e) => {
                  setVehicles((prev) =>
                    prev.map((vehicle) =>
                      vehicle.id === v.id
                        ? {
                            ...vehicle,
                            status: e.target.value as Vehicle["status"],
                          }
                        : vehicle
                    )
                  );
                }}
              >
                <option value="">Status</option>
                <option value="reconditioning">Reconditioning</option>
                <option value="on sale">On Sale</option>
                <option value="sold">Sold</option>
              </select>{" "}
              <button
                type="submit"
                style={{ backgroundColor: "white" }}
                onClick={(e) => {
                  e.preventDefault();
                  setSavingVehicleIds((prev) => [...prev, v.id]);
                  if (v.price === null || isNaN(v.price)) {
                    toast.error("Please enter a valid number for price.");
                    return;
                  }
                  fetch(`http://localhost:3001/vehicles/${v.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      price: v.price,
                      status: v.status,
                    }),
                  })
                    .then(() => {
                      toast.success("Vehicle saved");
                    })
                    .catch((error) => {
                      toast.error("Failed to save vehicle: " + error.message);
                    })
                    .finally(() => {
                      setSavingVehicleIds((prev) =>
                        prev.filter((id) => id !== v.id)
                      );
                    });
                }}
              >
                💾
              </button>{" "}
              {savingVehicleIds.find((i) => i === v.id) && (
                <span>Saving...</span>
              )}
            </li>
          ))}
        </ul>
      </form>

      <h2>Add Vehicle</h2>

      <form>
        <input
          type="number"
          placeholder="Year"
          onChange={onAddVehicleChange}
          value={newVehicle.year || ""}
        />{" "}
        <input
          type="text"
          placeholder="Make"
          onChange={onAddVehicleChange}
          value={newVehicle.make}
        />{" "}
        <input
          type="text"
          placeholder="Model"
          onChange={onAddVehicleChange}
          value={newVehicle.model}
        />{" "}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!newVehicle.year || !newVehicle.make || !newVehicle.model) {
              toast.error("Please fill in all fields.");
              return;
            }
            setIsAdding(true);

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
                setNewVehicle(emptyVehicle); // Reset the form
              })
              .catch((error) => {
                toast.error("Failed to add vehicle: " + error.message);
              })
              .finally(() => {
                setIsAdding(false);
              });
          }}
        >
          Add
        </button>
        {isAdding && <span>Adding...</span>}
      </form>
    </main>
  );
}
