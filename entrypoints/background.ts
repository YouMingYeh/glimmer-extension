import { browser } from "wxt/browser";
import ExtMessage, { MessageFrom, MessageType } from "@/entrypoints/types.ts";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id }); // background.js

  // @ts-ignore
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: any) => console.error(error));

  let sidePanelOpen = false;

  //monitor the event from extension icon click
  browser.action.onClicked.addListener((tab) => {
    // 发送消息给content-script.js
    console.log("click icon");
    console.log(tab);
    browser.tabs.sendMessage(tab.id!, {
      messageType: MessageType.toggleSidePanel,
    });
  });

  // background.js
  browser.runtime.onMessage.addListener(
    async (
      message: ExtMessage,
      sender,
      sendResponse: (message: any) => void
    ) => {
      console.log("background:");
      console.log(message);
      if (message.messageType === MessageType.toggleSidePanel) {
        console.log("toggleSidePanel");
        if (sidePanelOpen) {
          // @ts-ignore
          browser.runtime.sendMessage({
            messageType: MessageType.closeSidePanel,
          });
          sidePanelOpen = false;
          return false;
        } else {
          // @ts-ignore
          browser.sidePanel.open({
            tabId: sender.tab?.id,
          });
          sidePanelOpen = true;
          return true;
        }
      } else if (message.messageType === MessageType.clickExtIcon) {
        // @ts-ignore
        browser.sidePanel.open({
          tabId: sender.tab?.id,
        });
        sidePanelOpen = true;
        return true;
      } else if (
        message.messageType === MessageType.changeTheme ||
        message.messageType === MessageType.changeLocale
      ) {
        let tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        console.log(`tabs:${tabs.length}`);
        if (tabs) {
          for (const tab of tabs) {
            await browser.tabs.sendMessage(tab.id!, message);
          }
        }
      } else if (
        message.messageType === MessageType.connect ||
        message.messageType === MessageType.disconnect
      ) {
        if (message.messageType === MessageType.connect) {
          sidePanelOpen = true;
        } else {
          sidePanelOpen = false;
        }
        let tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        console.log(`tabs:${tabs.length}`);
        if (tabs) {
          for (const tab of tabs) {
            await browser.tabs.sendMessage(tab.id!, message);
          }
        }
      }
    }
  );
});
