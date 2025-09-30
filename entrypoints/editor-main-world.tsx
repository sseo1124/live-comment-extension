import React from "react";
import { createRoot } from "react-dom/client";
import { defineUnlistedScript } from "#imports";
import App from "@/entrypoints/content/App";

export default defineUnlistedScript(() => {
  const container = document.createElement("div");
  container.id = "live-comment-container";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
