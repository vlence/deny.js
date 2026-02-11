(function deny(config = {}) {
    const log = config.log || function() {}
    const allow = config.allow || function () { return false }

    const observer = new MutationObserver(function (records, observer) {
        for (const record of records) {
            record.addedNodes.forEach(function (node) {
                if (!(node instanceof HTMLScriptElement)) {
                    return
                }

                if (allow(node)) {
                    log('allowing script', node)
                    return
                }

                log('denying script', node)
                node.remove()
            })
        }
    })

    /** @type {MutationObserverInit} */
    const options = {
        subtree: true,
        childList: true,
    }

    observer.observe(document, options)
})()
