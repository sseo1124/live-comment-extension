import { injectScript } from "#imports";

export default defineContentScript({
  matches: ["*://*/*"],
  async main() {
    await injectScript("/editor-main-world.js", {
      keepInDom: true,
    });
  },
});
