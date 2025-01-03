console.log("helloyyy her eis thr date un bg js");
chrome.runtime.onStartup.addListener(() => {
    // Always execute the script on startup without checking the date
    console.log("helloyyy123");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            console.log("helloyyy2");
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            });
            console.log("helloyyy3");
        }
    });
});
