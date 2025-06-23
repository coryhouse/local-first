import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
            <button
              className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
              onClick={(e) => {
                e.preventDefault();
                void deleteVehicle({ id: vehicle._id });
                toast.success("Vehicle deleted");
              }}
            >
              ❌
            </button>
            {vehicle.year} {vehicle.make} {vehicle.model} $
            <input
              type="number"
              className="bg-light w-20 dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
              name="price"
              placeholder="Price"
              value={vehicle.price}
              onBlur={(e) => {
                void updateVehicle({
                  ...vehicle,
                  price: parseInt(e.target.value),
                });
                toast.success("Vehicle updated");
              }}
            />{" "}
            <select
              className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
              name="status"
              value={vehicle.status || ""}
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
            </select>{" "}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold">Add Vehicle</h2>
      <form>
        <input
          type="text"
          placeholder="Make"
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
          value={newVehicle.make}
          onChange={onAddVehicleChange}
        />
        <input
          type="text"
          placeholder="Model"
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
          value={newVehicle.model}
          onChange={onAddVehicleChange}
        />
        <input
          type="number"
          placeholder="Year"
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
          value={newVehicle.year}
          onChange={onAddVehicleChange}
        />
        <button
          type="submit"
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
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
        </button>
      </form>
    </main>
  );
}
