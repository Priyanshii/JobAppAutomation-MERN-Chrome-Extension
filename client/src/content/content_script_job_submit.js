//Submit Button Clicked !!
async function clickSubmitButton() {
  const submitButton = document.getElementById('btn-submit');

  if (submitButton) {
    await submitButton.click();
  }
  chrome.runtime.sendMessage({ type: "submitButtonClicked" });
}

clickSubmitButton();