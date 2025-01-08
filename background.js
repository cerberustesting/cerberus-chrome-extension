const message = {
  action: "",
  isActive: false,
};

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "isErratumActive") {
      message.action = "erratum";
      message.isActive = newValue;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    }
  }
});

chrome.storage.sync.get(["isErratumActive"], (response) => {
  chrome.storage.sync.set(
    {
      isErratumActive:
        "isErratumActive" in response ? response.isErratumActive : false,
    },
    () => {
      message.isActive = response.isErratumActive;
    }
  );
});

chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.sync.set({
    isErratumActive: false,
    cerberusElements: [],
  });
});

var tabId = "";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleStartButton" && request.tabId) {
    this.tabId = request.tabId;
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: toggleDivInContentScript
    });

  }
});


function toggleDivInContentScript() {
  toggleDiv();
  start();
  /*chrome.tabs.get(this.tabId).query({active: true, currentWindow: true}, function(tabs) {
    chrome.runtime.sendMessage({action: "toggleDiv", tabId: tabs[0].id});
  });
   */
}

