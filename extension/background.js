// Background service worker

chrome.runtime.onInstalled.addListener(() => {
    console.log("Idea Collision Generator Extension Installed");
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureArticle") {
        console.log("Capturing article:", request.data);

        // TODO: Send to backend API
        fetch('http://localhost:8000/ingest/article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                sendResponse({ status: "success", data: data });
            })
            .catch((error) => {
                console.error('Error:', error);
                sendResponse({ status: "error", error: error });
            });

        return true; // Will respond asynchronously
    }
});
