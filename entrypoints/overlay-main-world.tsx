import React from "react";
import { createRoot } from "react-dom/client";
import { defineUnlistedScript } from "#imports";
import ShadowDOM from "@/entrypoints/content/ShadowDOM";

export default defineUnlistedScript(() => {
  const container = document.createElement("div");
  container.id = "live-comment-container";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<ShadowDOM container={container} />);

  return () => {
    root.unmount();
    container.remove();
  };
});
