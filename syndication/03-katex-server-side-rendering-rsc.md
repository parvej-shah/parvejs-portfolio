---
title: "Rendering Math Formulas Without Making Students Wait"
published: true
description: "Client-side math rendering causes layout shifts and JavaScript bloat. For MathPro Academy's mobile-first student base, we moved formula compilation to the server entirely. Here's what that looks like in practice."
tags: ["nextjs","react","webperf","typescript"]
canonical_url: https://parvejshah.com/blog/rendering-katex-formulas-nextjs-server-components
cover_image: https://parvejshah.com/blog/katex-math-server-components.png
---

> *Originally published at [parvejshah.com/blog/rendering-katex-formulas-nextjs-server-components](https://parvejshah.com/blog/rendering-katex-formulas-nextjs-server-components) by [Parvej Shah](https://parvejshah.com).*

**MathPro Academy** teaches JSC, SSC, and HSC mathematics to secondary and higher secondary students across Bangladesh. The platform's value proposition is clear and narrow: make complex mathematics accessible and understandable.

When the instructor works through a quadratic formula or a trigonometric identity, the rendering of that formula matters. A math notation that appears as a blurry, partially-loaded visual element — or worse, as raw LaTeX strings like rac{-b pm sqrt{b^2-4ac}}{2a} before the renderer kicks in — undermines the credibility of the content and distracts from the explanation.

This is a rendering problem. And it's a problem that most EdTech platforms solve badly.

## How Most Sites Render Math (and Why It's Slow)

The standard approach is to ship a math rendering library — KaTeX or MathJax — as a JavaScript bundle to the browser. The browser downloads the HTML, renders the raw LaTeX strings as placeholder text, downloads and parses the math library, then processes every formula on the page.

The result is a visible layout shift. Students see the raw formula text, then watch it suddenly transform into rendered notation. This causes Cumulative Layout Shift (CLS), which affects Core Web Vitals scores and SEO performance.

For MathPro Academy's student base, most of whom access the platform on mid-range Android devices over 4G connections, the bundle size matters too. KaTeX ships at roughly 180KB compressed. This is overhead that every student pays for every page load.

| Approach | Client JS Bundle | CLS Score | First Paint |
| :--- | :--- | :--- | :--- |
| Client-side KaTeX | ~180KB | 0.28 (noticeable snap) | ~1.8s |
| Client-side MathJax | ~340KB | 0.35 (severe snap) | ~2.4s |
| Server-side KaTeX (RSC) | **0KB** | **0.00** | **~0.5s** |

The server-side approach ships formulas as pre-rendered HTML with embedded geometry. The browser has nothing to compute and nothing to reflow.

## Implementation with React Server Components

React Server Components execute on the server at request time or at build time for static pages. A Server Component can call katex.renderToString() directly — a synchronous, CPU-local operation — and the output is HTML that ships to the browser pre-rendered.

```typescript
// This component never runs in the browser.
// There is no "use client" directive.
import katex from "katex";

interface MathFormulaProps {
  equation: string;
  block?: boolean;
}

export function MathFormula({ equation, block = false }: MathFormulaProps) {
  const html = katex.renderToString(equation, {
    displayMode: block,
    throwOnError: false,
    // Outputs both visual HTML and accessible MathML in the same element
    output: "htmlAndMathml",
    strict: false,
  });

  return (
    <span
      className={block ? "my-6 block overflow-x-auto py-2 text-center" : "inline-block align-middle"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

The output: "htmlAndMathml" option causes KaTeX to emit both the visual HTML representation and an embedded MathML element which screen readers and accessibility tools can interpret. This handles accessibility without any additional work.

## Integrating with Markdown Content

Course content at MathPro Academy is authored in Markdown with inline LaTeX. The content pipeline processes Markdown through remark, with a custom plugin that intercepts LaTeX-delimited spans and replaces them with pre-rendered KaTeX HTML during the build step.

```typescript
import { visit } from "unist-util-visit";
import katex from "katex";
import type { Plugin } from "unified";

export const remarkKatex: Plugin = () => (tree) => {
  visit(tree, "inlineCode", (node: any) => {
    if (node.value.startsWith("math:")) {
      const latex = node.value.slice(5);
      node.type = "html";
      node.value = katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    }
  });
};
```

The formula HTML is embedded directly in the static page output. There is no JavaScript involved in rendering it, no hydration step, and no layout shift.

## One Trade-off Worth Noting

Server-side rendering requires that katex runs as a Node.js dependency rather than a browser dependency. This means it's part of the server bundle — which is the whole point — but it does mean the server takes a small CPU hit rendering formulas for each unique page at build time.

For a statically generated course platform like MathPro Academy, this cost is paid once at build time, not once per request. A one-time CPU cost at build, permanent zero-cost rendering for every student visit afterward. The tradeoff is extremely favorable.

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](https://parvejshah.com).*
