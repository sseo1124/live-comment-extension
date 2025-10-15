import "@/assets/tailwind.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createShadowRootUi } from "#imports";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    browser.runtime.onMessage.addListener(async (msg) => {
      if (msg?.type !== "JOIN_ROOM") return;
      // const { projectId, roomId, accessToken } = msg.payload;

      const ui = await createShadowRootUi(ctx, {
        name: "livecomment-ui",
        position: "inline",
        anchor: "body",
        append: "first",
        onMount: (container) => {
          const wrapper = document.createElement("div");
          container.append(wrapper);

          const root = ReactDOM.createRoot(wrapper);
          root.render(<App />);
          return { root, wrapper };
        },
        onRemove: (elements) => {
          elements?.root.unmount();
          elements?.wrapper.remove();
        },
      });

      ui.mount();
    });
  },
});
