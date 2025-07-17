import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ZeroProvider } from "@rocicorp/zero/react";
import { Zero } from "@rocicorp/zero";
import { schema } from "../shared/schema";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { Toaster } from "sonner";
import { createMutators } from "../shared/mutators";

const encodedJWT = Cookies.get("jwt");
const decodedJWT = encodedJWT && decodeJwt(encodedJWT);
const userID = decodedJWT?.sub ? (decodedJWT.sub as string) : "anon";

const z = new Zero({
  userID,
  auth: () => encodedJWT,
  server: import.meta.env.VITE_PUBLIC_SERVER,
  schema,
  mutators: createMutators(),
  kvStore: "idb", // use IndexedDB as local store (this is the default)
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZeroProvider zero={z}>
      <Toaster position="top-right" richColors />
      <App />
    </ZeroProvider>
  </StrictMode>
);
