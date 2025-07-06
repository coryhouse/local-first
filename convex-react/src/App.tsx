import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Select } from "./components/Select";
import { Doc } from "../convex/_generated/dataModel";

export default function App() {
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
  });

  type Vehicle = Doc<"vehicles">;

  const vehiclesInDb = useQuery(api.vehicles.list);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const deleteVehicle = useMutation(api.vehicles.deleteVehicle);
  const addVehicle = useMutation(api.vehicles.add);
  const updateVehicle = useMutation(api.vehicles.update);

  useEffect(
    function copyDbToLocalState() {
      if (vehiclesInDb) {
        setVehicles(vehiclesInDb);
      }
    },
    [vehiclesInDb],
  );

  function onAddVehicleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [e.target.placeholder.toLowerCase()]:
        e.target.type === "number" ? Number(value) : value,
    }));
  }

  function saveVehicle(vehicle: Vehicle) {
    const { _creationTime, ...vehicleWithoutCreationTime } = vehicle;
    void updateVehicle(vehicleWithoutCreationTime);
    toast.success("Vehicle updated");
  }

  if (vehiclesInDb === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8 flex flex-col gap-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Crazy Cory's Car Lot (Convex)</h1>
      <ul className="m-0 p-0">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle._id}
            className="list-none p-0 m-2 flex items-center gap-2"
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                setVehicles((prev) =>
                  prev.filter((v) => v._id !== vehicle._id),
                );
                void deleteVehicle({ id: vehicle._id });
                toast.success("Vehicle deleted");
              }}
            >
              ❌
            </Button>
            <span className="flex-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
            <span className="flex items-center gap-2">
              $
              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={vehicle.price}
                className="w-24"
                onChange={(e) => {
                  setVehicles((prev) =>
                    prev.map((v) =>
                      v._id === vehicle._id
                        ? { ...v, price: parseInt(e.target.value) }
                        : v,
                    ),
                  );
                }}
              />
              <Select
                name="status"
                value={vehicle.status}
                onChange={(e) => {
                  setVehicles((prev) =>
                    prev.map((v) =>
                      v._id === vehicle._id
                        ? {
                            ...v,
                            status: e.target.value as
                              | "on sale"
                              | "sold"
                              | "reconditioning",
                          }
                        : v,
                    ),
                  );
                }}
              >
                <option value="reconditioning">Reconditioning</option>
                <option value="on sale">On Sale</option>
                <option value="sold">Sold</option>
              </Select>
              <Button onClick={() => saveVehicle(vehicle)}>Save</Button>
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Add Vehicle</h2>
        <form>
          <Input
            type="number"
            placeholder="Year"
            value={newVehicle.year}
            onChange={onAddVehicleChange}
          />
          <Input
            type="text"
            placeholder="Make"
            value={newVehicle.make}
            onChange={onAddVehicleChange}
          />
          <Input
            type="text"
            placeholder="Model"
            value={newVehicle.model}
            onChange={onAddVehicleChange}
          />
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (!navigator.onLine) {
                // NOTE: Convex doesn't support local ID allocation yet.
                // Ideally, we'd do something like this:
                // _id: (crypto.randomUUID() as Id<"vehicles">,
                // More: https://stack.convex.dev/object-sync-engine#convex-2
                toast.error(
                  "You're offline. Please try again later. (Convex doesn't support offline add yet.)",
                );
                return;
              }

              void addVehicle({
                make: newVehicle.make,
                model: newVehicle.model,
                year: Number(newVehicle.year),
                price: 0,
                status: "reconditioning",
              });
              setNewVehicle({ make: "", model: "", year: "" });
              toast.success("Vehicle added");
            }}
          >
            Add
          </Button>
        </form>
      </div>
    </main>
  );
}
