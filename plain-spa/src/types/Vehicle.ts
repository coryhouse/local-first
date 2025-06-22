export type Vehicle = {
  id: string;
  year: number | null;
  make: string;
  model: string;
  price: number | null;
  status: "reconditioning" | "on sale" | "sold" | null;
};
