export default defineBackground(() => {
  defaultSidepanel();
});

function defaultSidepanel() {
  browser.action.onClicked.addListener(async () => {
    try {
      await browser.sidePanel.setPanelBehavior({
        openPanelOnActionClick: true,
      });
    } catch (error) {
      console.error(error);
    }
  });
}
