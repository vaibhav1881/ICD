document.getElementById('captureBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
        document.getElementById('status').textContent = "Capturing...";

        // Send message to content script to scrape data
        chrome.tabs.sendMessage(tab.id, { action: "scrapeContent" }, (response) => {
            if (chrome.runtime.lastError) {
                document.getElementById('status').textContent = "Error: " + chrome.runtime.lastError.message;
                return;
            }

            if (response && response.data) {
                // Send data to background script for processing
                chrome.runtime.sendMessage({ action: "captureArticle", data: response.data }, (bgResponse) => {
                    if (bgResponse && bgResponse.status === "success") {
                        document.getElementById('status').textContent = "Saved!";
                    } else {
                        document.getElementById('status').textContent = "Failed to save.";
                    }
                });
            } else {
                document.getElementById('status').textContent = "Could not extract content.";
            }
        });
    }
});
