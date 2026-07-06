"use client";

import useReveal from "../hooks/useReveal";

/** Runs the IntersectionObserver once for all `.reveal` elements on the page. */
export default function RevealProvider() {
  useReveal();
  return null;
}
