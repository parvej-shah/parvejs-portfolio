"use client";

/**
 * Thin wrapper that opts an element into the scroll reveal animation.
 * Delay is staggered via the --reveal-delay CSS var.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...props }) {
  return (
    <Tag
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
