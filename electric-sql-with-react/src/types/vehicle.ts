export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: "on sale" | "sold" | "reconditioning";
};
