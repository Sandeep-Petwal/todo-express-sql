import { createRoot } from "react-dom/client";
import router from "./router";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContextProvider";

createRoot(document.getElementById("root")).render(
  <>
    <div className=" min-h-screen bg-gray-900">
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  </>
);
