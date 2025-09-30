import { injectScript } from "#imports";

export default defineContentScript({
  matches: ["*://*/*"],
  async main() {
    await injectScript("/overlay-main-world.js", {
      keepInDom: true,
    });
  },
});
