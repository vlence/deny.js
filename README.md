# deny.js

![deny.js Logo][logo]

A simple library to stop `<script>` tags from being added to your
website.

Why would you want to do that?

1. Because YOU can.
2. Because it's YOUR website and YOU decide what runs.
3. Because YOU don't want these pesky browser extensions to inject
scripts into YOUR website and hog all the precious resources like CPU.
4. etc.

## Installation

Copy and paste the contents of `deny.js` at the top of your HTMl file in
a `<script>` tag. Here's the whole thing for you.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script>
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
    </script>
    <title>MY Website</title>
    <script>
        // a cheeky little test
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('textfield').value = 'No'
        })
    </script>
</head>
<body>
    <label>
        Did it work?
        <input id="textfield" type="text" value="Yes" readonly>
    </label>
    <script>
        // Another test
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('textfield').value = 'Maybe not?'
        })
    </script>
</body>
</html>
```

Remember, it must be the FIRST script your website loads, so that it can
decide the fate of every other script.

## Configuration

Only two optional configuration options are available:
- `log` - A function used for logging
- `allow` - A function to filter out which `<script>`s you want. If it
returns false then the `<script>` is not loaded.

[logo]: logo.png
