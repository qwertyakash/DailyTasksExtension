// chrome.runtime.onStartup.addListener(() => {
//     chrome.storage.sync.get(["lastReminderDate"], (data) => {
//         const lastReminderDate = data.lastReminderDate;
//         const today = new Date().toLocaleDateString();

//         if (lastReminderDate !== today) {
//             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                 if (tabs[0]) {
//                     chrome.scripting.executeScript({
//                         target: { tabId: tabs[0].id },
//                         files: ["content.js"]
//                     });
//                 }
//             });

//             chrome.storage.sync.set({ lastReminderDate: today });
//         }
//     });
// });


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
