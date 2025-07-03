import { useShape } from "@electric-sql/react";
import type { Vehicle } from "./types/score";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Select } from "./components/Select";
import api from "./client";

export default function App() {
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
  });

  const { isLoading, data: vehiclesInDb } = useShape<Vehicle>({
    url: `http://localhost:3000/v1/shape`,
    params: {
      table: `vehicles`,
    },
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(
    function copyDbToLocalState() {
      if (vehiclesInDb) {
        setVehicles(vehiclesInDb);
      }
    },
    [vehiclesInDb]
  );

  function onAddVehicleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [e.target.placeholder.toLowerCase()]:
        e.target.type === "number" ? Number(value) : value,
    }));
  }

  async function saveVehicle(vehicle: Vehicle) {
    await api.request("/vehicles", "PUT", vehicle);
    toast.success("Vehicle updated");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8 flex flex-col gap-8 max-w-3xl">
      <h1 className="text-3xl font-bold">
        Crazy Cory's Car Lot (Electric SQL)
      </h1>
      <details>
        <summary>
          Note: Electric supports{" "}
          <a href="https://electric-sql.com/docs/guides/writes#patterns">
            multiple write styles
          </a>{" "}
        </summary>
        <ol>
          <li className="list-decimal ml-4">
            <strong>Online writes</strong> (simplest, but only works online.)
            Good for occasional writes or read only apps. (this demo uses this)
          </li>
        </ol>
      </details>

      <ul className="m-0 p-0">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            className="list-none p-0 m-2 flex items-center gap-2"
          >
            <Button
              onClick={async (e) => {
                e.preventDefault();
                setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
                await api.request("/vehicles", "DELETE", vehicle);
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
                className="w-20"
                onChange={(e) => {
                  setVehicles((prev) =>
                    prev.map((v) =>
                      v.id === vehicle.id
                        ? { ...v, price: parseInt(e.target.value) }
                        : v
                    )
                  );
                }}
              />
              <Select
                name="status"
                value={vehicle.status}
                onChange={(e) => {
                  setVehicles((prev) =>
                    prev.map((v) =>
                      v.id === vehicle.id
                        ? {
                            ...v,
                            status: e.target.value as
                              | "on sale"
                              | "sold"
                              | "reconditioning",
                          }
                        : v
                    )
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
            onClick={async (e) => {
              e.preventDefault();
              const vehicle = {
                make: newVehicle.make,
                model: newVehicle.model,
                year: Number(newVehicle.year),
                price: 0,
                status: "reconditioning",
              };
              await api.request("/vehicles", "POST", vehicle);
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
