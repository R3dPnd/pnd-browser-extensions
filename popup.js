document.addEventListener('DOMContentLoaded', function() {
    const actionButton = document.getElementById('actionButton');
    const statusDiv = document.getElementById('status');

    // Load saved state
    chrome.storage.local.get(['clickCount'], function(result) {
        const count = result.clickCount || 0;
        updateStatus(`Button clicked ${count} times`);
    });

    actionButton.addEventListener('click', function() {
        // Increment click count
        chrome.storage.local.get(['clickCount'], function(result) {
            const newCount = (result.clickCount || 0) + 1;
            chrome.storage.local.set({ clickCount: newCount });
            updateStatus(`Button clicked ${newCount} times`);
        });

        // Send message to background script
        chrome.runtime.sendMessage({ 
            action: 'buttonClicked',
            timestamp: Date.now()
        });

        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'popupButtonClicked',
                message: 'Hello from popup!'
            });
        });
    });

    function updateStatus(message) {
        statusDiv.textContent = message;
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updateStatus') {
            updateStatus(request.message);
        }
    });
}); 