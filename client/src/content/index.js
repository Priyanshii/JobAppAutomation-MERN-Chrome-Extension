console.log("this is the content.js file")

//Extract job URLs based on the specified number of job applications to be applied."
//Here jobApplicationCount is the specified number of job applications to be applied.
function extractJobURLs(jobApplicationCount) {
  const jobURLs = [];
  const jobLinks = document.querySelectorAll('.posting-title');
  let count = 0;
  for (const link of jobLinks) {
    console.log(count);
    if (count == jobApplicationCount) {
      break;
    }
    jobURLs.push(link.href);
    count++;
  }
  console.log(jobURLs);
  return jobURLs;
}

//Send Message to Background.js file to process the Extracted Job Links one by one.
function applyToJobs(jobApplicationCount) {
  const jobURLs = extractJobURLs(jobApplicationCount);
  console.log(jobURLs);
  chrome.runtime.sendMessage({ type: 'extractedJobLinks', links: jobURLs });
}

//Listening to the Start Automation Command
//Injecting programmatically.
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'startAutomation') {
    applyToJobs(message.jobApplicationCount);
  }
});