import { useEffect, useState } from "react";
import type { Vehicle } from "./types/Vehicle";
import { toast } from "sonner";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Select } from "./components/Select";

const emptyVehicle: Vehicle = {
  id: "",
  make: "",
  model: "",
  year: null,
  price: null,
  status: null,
};

export default function App() {
  const [newVehicle, setNewVehicle] = useState(emptyVehicle);
  const [savingVehicleIds, setSavingVehicleIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingVehicleIds, setDeletingVehicleIds] = useState<string[]>([]);
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
    <main className="p-8 flex flex-col gap-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Crazy Cory's Car Lot (Plain SPA)</h1>

      {vehicles.length === 0 && <p>No vehicles found.</p>}

      <form>
        <ul className="m-0 p-0">
          {vehicles.map((v) => (
            <li
              key={v.id}
              className="list-none p-0 m-2 flex items-center gap-2"
            >
              <Button
                style={{ backgroundColor: "white" }}
                onClick={(e) => {
                  e.preventDefault();
                  setDeletingVehicleIds((prev) => [...prev, v.id]);
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
                    })
                    .finally(() => {
                      toast.success("Vehicle deleted");
                      setDeletingVehicleIds((prev) =>
                        prev.filter((id) => id !== v.id)
                      );
                    });
                }}
              >
                {deletingVehicleIds.find((id) => id === v.id) ? (
                  <span>Deleting...</span>
                ) : (
                  "❌"
                )}
              </Button>
              <span className="flex-1">
                {v.year} {v.make} {v.model}
              </span>
              <span className="flex items-center gap-2">
                ${" "}
                <Input
                  type="text"
                  name="price"
                  placeholder="Price"
                  className="w-20"
                  value={v.price || ""}
                  onChange={(e) => onPriceChange(e, v)}
                />{" "}
                <Select
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
                </Select>{" "}
                <Button
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
                  Save
                </Button>{" "}
                {savingVehicleIds.find((i) => i === v.id) && (
                  <span>Saving...</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </form>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Add Vehicle</h2>

        <form>
          <Input
            type="number"
            name="year"
            placeholder="Year"
            onChange={onAddVehicleChange}
            value={newVehicle.year || ""}
          />{" "}
          <Input
            type="text"
            name="make"
            placeholder="Make"
            onChange={onAddVehicleChange}
            value={newVehicle.make}
          />{" "}
          <Input
            type="text"
            name="model"
            placeholder="Model"
            onChange={onAddVehicleChange}
            value={newVehicle.model}
          />{" "}
          <Button
            onClick={async (e) => {
              e.preventDefault();
              if (!newVehicle.year || !newVehicle.make || !newVehicle.model) {
                toast.error("Please fill in all fields.");
                return;
              }
              setIsAdding(true);

              try {
                const response = await fetch("http://localhost:3001/vehicles", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newVehicle),
                });
                const savedVehicle = await response.json();
                setVehicles((prev) => [...prev, savedVehicle]);
                setNewVehicle(emptyVehicle); // Reset the form
              } catch (error: unknown) {
                if (error instanceof Error) {
                  toast.error("Failed to add vehicle: " + error.message);
                } else {
                  toast.error("Failed to add vehicle: " + String(error));
                }
              } finally {
                setIsAdding(false);
              }
            }}
          >
            Add
          </Button>
          {isAdding && <span>Adding...</span>}
        </form>
      </div>
    </main>
  );
}
