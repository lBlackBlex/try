var targetHost = 'slitheriomods.net';

// Load external script.
var loadExtensionScript = function() {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('ext.js');
    (document.body || document.head || document.documentElement).appendChild(script);
};

// Load external script when extension is enabled.
chrome.runtime.sendMessage({name: 'ScriptRequest'}, function (response) {
    if (response === true) {
        // Add external script.
        if (document.readyState != 'loading') {
            loadExtensionScript();
        } else {
            document.addEventListener('DOMContentLoaded', function(e) {
                loadExtensionScript();
            });
        }
    }
});

// Messages listener.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.name == 'ScriptDisable') {
        // Reload page.
        window.postMessage('ScriptDisable', this.location);
    }
});