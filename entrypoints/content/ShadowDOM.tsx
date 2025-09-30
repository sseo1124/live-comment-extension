import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

type ShadowDOMProps = {
  container: HTMLDivElement;
};

export default function ShadowDOM({ container }: ShadowDOMProps) {
  useEffect(() => {
    if (!container || container.shadowRoot) {
      return;
    }

    const outerShadowRoot = container.attachShadow({ mode: "open" });
    const host = document.createElement("div");
    outerShadowRoot.appendChild(host);

    const innerShadowRoot = host.attachShadow({ mode: "open" });
    const reactRoot = document.createElement("div");
    innerShadowRoot.appendChild(reactRoot);

    const root = createRoot(reactRoot);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    return () => {
      root.unmount();
      outerShadowRoot.innerHTML = "";
    };
  }, [container]);

  return <div data-live-comment-shadow-host />;
}
