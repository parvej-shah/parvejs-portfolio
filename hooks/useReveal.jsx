"use client";

import { useEffect } from "react";

/**
 * Adds `.in-view` to every `.reveal` element when it scrolls into view.
 * Replaces AOS. Mount once (e.g. in a top-level client component).
 */
export default function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Page content (e.g. async Server Components) can stream/hydrate in after this
    // effect runs, so `.reveal` elements may not exist yet on first mount — watch
    // for new ones and observe them too, otherwise they stay stuck at opacity: 0.
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(".reveal")) io.observe(node);
          node.querySelectorAll?.(".reveal").forEach((el) => io.observe(el));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
