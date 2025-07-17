export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: VehicleStatus;
};

export type VehicleStatus = "on sale" | "sold" | "reconditioning";
