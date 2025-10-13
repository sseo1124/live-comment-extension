import "@/assets/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import SidepanelApp from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element for the side panel was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SidepanelApp />
  </React.StrictMode>
);
