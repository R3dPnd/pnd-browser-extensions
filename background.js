// Background service worker
console.log('Background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
    console.log('Extension installed:', details.reason);
    
    if (details.reason === 'install') {
        // Set initial data
        chrome.storage.local.set({
            clickCount: 0,
            installDate: Date.now()
        });
        
        // Show welcome notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/rd_pnd_2025_rd_128.png',
            title: 'Extension Installed',
            message: 'Thank you for installing My Browser Extension!'
        });
    }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background received message:', request);
    
    if (request.action === 'buttonClicked') {
        // Log the button click
        console.log('Button clicked at:', new Date(request.timestamp));
        
        // You can add more background processing here
        // For example, analytics, data processing, etc.
        
        // Send response back to popup
        sendResponse({ success: true, message: 'Button click processed' });
    }
    
    return true; // Keep the message channel open for async response
});

// Handle tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('Tab updated:', tab.url);
        
        // You can add logic here to interact with specific websites
        // For example, injecting content scripts conditionally
    }
});

// Handle extension icon click (if no popup is defined)
chrome.action.onClicked.addListener(function(tab) {
    console.log('Extension icon clicked on tab:', tab.id);
    
    // You can add logic here for when users click the extension icon
    // This is useful if you don't want a popup but want to perform actions
}); 