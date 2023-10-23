console.log("this is the content.js file")

function extractJobURLs() {
  const jobURLs = [];
  const jobLinks = document.querySelectorAll('.posting-title');
  jobLinks.forEach((link) => {
    jobURLs.push(link.href);
  });
  return jobURLs;
}

function applyToJobs() {
  const jobURLs = extractJobURLs();
  console.log(jobURLs);
  chrome.runtime.sendMessage({ type: 'extractedJobLinks', links: jobURLs });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'startAutomation') {
    applyToJobs();
  }
});