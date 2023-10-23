console.log("this is the background file")

let currentIndex;
let allLinks = [];
let currentTabUrl;
let jobApplicationCount;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'startJobAutomation') {
    const targetURL = message.targetURL;
    jobApplicationCount = message.jobApplicationCount;
    currentIndex =  message.currentApplicationIndex;

    chrome.tabs.create({ url: targetURL }, function (newTab) {
      chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        files: ['content.js']
      }, function() {
        chrome.tabs.sendMessage(newTab.id, { type: 'startAutomation', targetURL: targetURL });
      });
    });
  } else if (message.type === 'extractedJobLinks') {
    allLinks = message.links;
    processLinks(sender.tab.id);

  } else if (message.type === "applyButtonClicked") {

    console.log("Apply button clicked");

  } else if (message.type === "detectedJobApplicationQuestions") {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      currentTabUrl = tabs[0].url
      sendResponse({ url: currentTabUrl });
    });
    console.log(currentTabUrl);
    console.log(message.questions);
  }
  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  if (tabId && tab.url) {

    if (tab.url.includes("apply#")) {
      if (changeInfo.status === "complete") {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content_script_job_submit.js']
        });
      }
    } else if (tab.url.includes("thanks")) {
      if (changeInfo.status === "complete") {
        processLinks(tabId);
      }
    } else if (tab.url.includes("already-received")) {
      if (changeInfo.status === "complete") {
        processLinks(tabId);
        // chrome.runtime.sendMessage({ type: 'alreadySubmitted' })
      }
    }
    else {
      if (changeInfo.status === "complete") {
        // chrome.scripting.executeScript({
        //   target: { tabId: tabId },
        //   files: ['content_script_job_link.js']
        // });
      }
    }
  }
});

function processLinks(tabId) {
  currentIndex = currentIndex + 1;
  if (currentIndex < allLinks.length) {
    console.log(currentIndex, "currentIndexxxxxxxxxxxxx");
    const nextUrl = allLinks[currentIndex];
    console.log(nextUrl);
    chrome.tabs.update(tabId, { url: nextUrl });
  } else {
    console.log("All URLs processed");
  }
}