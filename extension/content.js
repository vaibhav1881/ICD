// Content script to scrape page content

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeContent") {
        const data = {
            title: document.title,
            url: window.location.href,
            text: document.body.innerText, // Simple extraction for now
            timestamp: new Date().toISOString()
        };

        sendResponse({ data: data });
    }
});
