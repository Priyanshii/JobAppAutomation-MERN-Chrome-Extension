async function clickApplyButton() {
  const applyButton = document.querySelector('.postings-btn');

  if (applyButton) {
    await applyButton.click();
  }
  chrome.runtime.sendMessage({ type: "applyButtonClicked" });
}

clickApplyButton();