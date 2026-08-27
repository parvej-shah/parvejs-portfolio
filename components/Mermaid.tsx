"use client";
import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
});

export default function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart).then(({ svg }) => {
      setSvg(svg);
    }).catch((e) => console.error("Mermaid render error", e));
  }, [chart]);

  if (!svg) {
    return <div className="my-8 flex justify-center animate-pulse h-48 bg-ink-2 rounded-xl" />;
  }

  return (
    <div 
      className="mermaid-container my-8 flex justify-center w-full overflow-x-auto rounded-xl border border-line bg-ink-2 p-6" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
