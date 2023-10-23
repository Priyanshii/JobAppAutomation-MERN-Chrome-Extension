async function clickApplyButton() {
  const applyButton = document.querySelector('.postings-btn'); 

  if (applyButton) {
    console.log("apply button found");
    await applyButton.click(); 
  }
  chrome.runtime.sendMessage({ type: "applyButtonClicked" });
}

clickApplyButton();