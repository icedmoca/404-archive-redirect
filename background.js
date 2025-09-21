// Background service worker for 404 Archive Redirect extension

chrome.webRequest.onCompleted.addListener(
  function(details) {
    console.log('Request completed:', details.url, 'Status:', details.statusCode);
    
    // Check if the response status is 404
    if (details.statusCode === 404) {
      console.log('404 detected for:', details.url);
      
      // Get the extension's base URL
      const extensionUrl = chrome.runtime.getURL('404.html');
      const redirectUrl = `${extensionUrl}?url=${encodeURIComponent(details.url)}`;
      
      console.log('Redirecting to:', redirectUrl);
      
      // Redirect to our custom 404 page with the original URL as a parameter
      chrome.tabs.update(details.tabId, {
        url: redirectUrl
      });
    }
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame"]
  }
);
