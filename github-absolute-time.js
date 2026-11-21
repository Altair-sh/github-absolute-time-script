// ==UserScript==
// @name         GitHub Absolute Time
// @namespace    https://github.com/
// @version      1.0
// @description  Replaces <relative-time> tags with <absolute-time> on GitHub
// @match        https://github.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function convertRelativeTime(root = document) {
        const elements = root.querySelectorAll('relative-time');
        for (const el of elements) {
            const abs = document.createElement('absolute-time');
            for (const attr of el.attributes) {
                abs.setAttribute(attr.name, attr.value);
            }
            abs.textContent = el.textContent;
            el.replaceWith(abs);
        }
    }

    // Initial pass
    convertRelativeTime();

    // Watch for Turbo navigation and dynamically loaded commits/releases
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'RELATIVE-TIME') {
                        convertRelativeTime(node.parentNode || document);
                    } else if (node.querySelector('relative-time')) {
                        convertRelativeTime(node);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();