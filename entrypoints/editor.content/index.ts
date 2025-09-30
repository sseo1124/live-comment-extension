import { injectScript } from "#imports";

export default defineContentScript({
  matches: ["*://*/*"],
  async main() {
    console.log("Injecting script...");
    await injectScript("/editor-main-world.js", {
      keepInDom: true,
    });
    console.log("Done!");
  },
});
