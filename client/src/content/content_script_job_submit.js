async function clickSubmitButton() {
  const submitButton = document.getElementById('btn-submit');
  if (submitButton) {
    console.log("submit button found");
    await submitButton.click(); 
  }
  chrome.runtime.sendMessage({ type: "submitButtonClicked" });
}

clickSubmitButton();