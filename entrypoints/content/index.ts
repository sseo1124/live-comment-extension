import { injectScript } from "#imports";

export default defineContentScript({
  matches: ["*://*/*"],
  async main() {
    browser.runtime.onMessage.addListener((msg) => {
      if (msg?.type !== "JOIN_ROOM") return;
      console.log(msg.payload);
    });
    await injectScript("/overlay-main-world.js", {
      keepInDom: true,
    });
  },
});
