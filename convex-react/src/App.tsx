import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Select } from "./components/Select";

export default function App() {
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
  });
  const vehicles = useQuery(api.myFunctions.listVehicles);
  const deleteVehicle = useMutation(api.myFunctions.deleteVehicle);
  const addVehicle = useMutation(api.myFunctions.addVehicle);
  const updateVehicle = useMutation(api.myFunctions.updateVehicle);

  function onAddVehicleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [e.target.placeholder.toLowerCase()]:
        e.target.type === "number" ? Number(value) : value,
    }));
  }

  if (vehicles === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8 flex flex-col gap-16">
      <ul className="m-0 p-0">
        {vehicles.map((vehicle) => (
          <li key={vehicle._id} className="list-none p-0 m-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                void deleteVehicle({ id: vehicle._id });
                toast.success("Vehicle deleted");
              }}
            >
              ❌
            </Button>
            {vehicle.year} {vehicle.make} {vehicle.model} $
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={vehicle.price}
              className="w-20"
              onBlur={(e) => {
                void updateVehicle({
                  ...vehicle,
                  price: parseInt(e.target.value),
                });
                toast.success("Vehicle updated");
              }}
            />{" "}
            <Select
              name="status"
              value={vehicle.status}
              onChange={(e) => {
                void updateVehicle({
                  ...vehicle,
                  status: e.target.value as any,
                });
                toast.success("Vehicle updated");
              }}
            >
              <option value="reconditioning">Reconditioning</option>
              <option value="on sale">On Sale</option>
              <option value="sold">Sold</option>
            </Select>{" "}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold">Add Vehicle</h2>
      <form>
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
        <Input
          type="number"
          placeholder="Year"
          value={newVehicle.year}
          onChange={onAddVehicleChange}
        />
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
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
    </main>
  );
}
