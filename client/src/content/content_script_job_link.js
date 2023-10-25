async function clickApplyButton() {
  const applyButton = document.querySelector('.postings-btn');

  if (applyButton) {
    await applyButton.click();
  }
  chrome.runtime.sendMessage({ type: "applyButtonClicked" });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'clickApplyButton') {
    clickApplyButton();
  }
});