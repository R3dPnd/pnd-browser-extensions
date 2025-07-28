// Content script that runs on web pages
console.log('Content script loaded on:', window.location.href);

// Create a floating notification element
function createNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Listen for messages from popup and background scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Content script received message:', request);
    
    if (request.action === 'popupButtonClicked') {
        // Show notification on the webpage
        createNotification(request.message);
        
        // You can add more DOM manipulation here
        // For example, highlighting elements, modifying content, etc.
        
        sendResponse({ success: true, message: 'Content script processed the message' });
    }
    
    return true;
});

// Example: Add a subtle indicator to show the extension is active
function addExtensionIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        z-index: 9999;
        opacity: 0.7;
        pointer-events: none;
    `;
    indicator.title = 'My Extension is active';
    document.body.appendChild(indicator);
}

// Add the indicator when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addExtensionIndicator);
} else {
    addExtensionIndicator();
}

// Example: Monitor for specific page events
document.addEventListener('click', function(event) {
    // You can add logic here to track user interactions
    // For example, logging clicks on specific elements
    if (event.target.tagName === 'A') {
        console.log('User clicked a link:', event.target.href);
    }
});

// Example: Modify page content (uncomment to enable)
/*
function enhancePage() {
    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        .extension-enhanced {
            border: 2px solid #667eea !important;
            border-radius: 4px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Example: Add enhancement to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.classList.add('extension-enhanced');
        });
        img.addEventListener('mouseleave', function() {
            this.classList.remove('extension-enhanced');
        });
    });
}

// Run enhancement after page loads
setTimeout(enhancePage, 1000);
*/ 