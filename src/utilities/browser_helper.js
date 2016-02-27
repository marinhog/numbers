var BrowserHelper = {
    runningInIframe: function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
}

export default BrowserHelper;