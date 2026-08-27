# The Surprising Complexity of Injecting UI into Other People's Webpages: Shadow DOM, Stylesheet Leaks, and Manifest V3

*By Parvej Shah · Lead Systems & Platform Engineer*

---

Building a standard web application gives you total sovereignty over your environment: you control the CSS reset, the DOM hierarchy, the script bundle, and the event bubbling lifecycle.

Building a **Chrome Extension content script** strips away every single one of those guarantees.

When building the **LinkedIn Brand Assistant** (an AI-powered tone and draft assistant running directly inside LinkedIn’s feed and messaging interface), our UI was forced to execute inside LinkedIn’s volatile, hyper-complex host DOM.

Early prototypes suffered immediate failures:
* LinkedIn's global CSS resets (`button { display: none; }`, `* { box-sizing: content-box; }`) bled into our extension, shattering buttons and modal alignments.
* Our extension's Tailwind CSS utilities bled into LinkedIn’s feed, corrupting author headers and comment boxes.
* Chrome’s **Manifest V3** service worker lifecycle unpredictably terminated background connections mid-stream.

This deep dive details how we engineered **total encapsulation using closed Shadow DOM roots, isolated CSS constructable stylesheets, and port-based event streaming**.

```
+---------------------------------------------------------------------------------------------------+
| 🛡️ EXTENSION ISOLATION ARCHITECTURE IN MANIFEST V3                                                |
|                                                                                                   |
|  [ Host Webpage (LinkedIn DOM) ]                                                                  |
|  Global Styles: `* { box-sizing: content-box; margin: 0; }`                                        |
|                 │                                                                                 |
|                 ├─── [ Custom Host Element: `<linkedin-brand-assistant-root>` ]                   |
|                 │          │                                                                      |
|                 │          ▼                                                                      |
|                 │    [ #shadow-root (open / closed) ]  <─── SHADOW DOM BOUNDARY                   |
|                 │          │                                                                      |
|                 │          ├─── 1. Injected Isolated Constructable Stylesheet                     |
|                 │          │    (Host styles CANNOT enter. Extension styles CANNOT leak out)      |
|                 │          │                                                                      |
|                 │          └─── 2. Isolated React 19 UI Tree                                     |
|                 │               (Tone Selector, AI Polish Widget, Diff Viewer)                    |
|                 │                                                                                 |
|  ───────────────┼───────────────────────────────────────────────────────────────────────────────  |
|  ASYNCHRONOUS PORT MESSAGING BRIDGE                                                               |
|                 │                                                                                 |
|                 ├─── 3. `chrome.runtime.connect({ name: "stream-port" })`                         |
|                 │          │                                                                      |
|                 │          ▼                                                                      |
|  [ Manifest V3 Background Service Worker ] ──(Streams Tokens)──> [ Shadow DOM Widget ]            |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. Zero CSS Leakage via Shadow Root Encapsulation

Attaching standard HTML nodes directly to `document.body` is fatal in browser extensions. We mount an isolated **Shadow Root**:

```typescript
// content-script/mountShadowRoot.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrandAssistantWidget } from "./components/BrandAssistantWidget";
import extensionTailwindCss from "./styles/extension-output.css?inline";

export function mountExtensionOverlay() {
  const existingHost = document.getElementById("brand-assistant-extension-host");
  if (existingHost) return;

  // 1. Create a custom host element in the outer document
  const hostElement = document.createElement("div");
  hostElement.id = "brand-assistant-extension-host";
  document.body.appendChild(hostElement);

  // 2. Attach Shadow Root to enforce DOM & CSS encapsulation
  const shadowRoot = hostElement.attachShadow({ mode: "open" });

  // 3. Inject dedicated stylesheet ONLY into the Shadow Root
  const styleTag = document.createElement("style");
  styleTag.textContent = extensionTailwindCss;
  shadowRoot.appendChild(styleTag);

  // 4. Mount isolated React application container
  const reactContainer = document.createElement("div");
  reactContainer.id = "extension-react-mount";
  shadowRoot.appendChild(reactContainer);

  const root = ReactDOM.createRoot(reactContainer);
  root.render(<BrandAssistantWidget />);
}
```

---

## 2. Surviving Manifest V3 Service Worker Terminations

In Chrome Manifest V3, background pages were replaced with **ephemeral Service Workers** that automatically suspend after 30 seconds of inactivity. If an LLM response streams for 40 seconds, a standard `chrome.runtime.sendMessage` disconnects mid-sentence with `Error: Extension context invalidated`.

We engineered **Long-Lived Port Connections with Automatic Reconnection and Keep-Alive Pings**:

```typescript
// content-script/services/llmStreamingPort.ts
export function createResilientStreamingPort(
  onTokenReceived: (token: string) => void,
  onComplete: () => void
) {
  let port = chrome.runtime.connect({ name: "ai-text-stream" });

  port.onMessage.addListener((msg) => {
    if (msg.type === "TOKEN") {
      onTokenReceived(msg.token);
    } else if (msg.type === "COMPLETE") {
      onComplete();
    }
  });

  // Keep-alive heartbeat interval preventing MV3 worker timeout
  const heartbeatInterval = setInterval(() => {
    try {
      port.postMessage({ type: "PING" });
    } catch {
      clearInterval(heartbeatInterval);
      // Re-establish port on disconnect
      port = chrome.runtime.connect({ name: "ai-text-stream" });
    }
  }, 20000);

  return {
    streamPrompt: (prompt: string) => {
      port.postMessage({ type: "GENERATE_DRAFT", prompt });
    },
    cleanup: () => {
      clearInterval(heartbeatInterval);
      port.disconnect();
    },
  };
}
```

---

## 📚 Source & Inspiration Notes

* **Google Chrome Extensions Documentation:** [*Manifest V3 Migration Guide & Service Worker Lifecycle*](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) — Ephemeral worker lifecycle and long-lived port messaging.
* **Apple / WebKit Web Standards:** [*Shadow DOM V1 Specification & CSS Scoping Rules*](https://webkit.org/) — Stylesheet isolation mechanics and boundary traversals.
