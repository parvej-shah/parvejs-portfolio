/**
 * MarqueeStripe — a full-width scrolling ticker that runs immediately after the
 * hero section. It loops shipped project names to signal social proof at a glance.
 * The visible track is duplicated for a seamless loop; the second copy is
 * aria-hidden so assistive tech reads each project once.
 */

const DEFAULT_ITEMS = [
  "Minions.AI",
  "VisaSphere",
  "Luxeory",
  "Mariscope",
  "SellerVAI",
  "MathPro Academy",
  "CoderVAI",
  "Genmorphics AI",
  "XpeedLab",
];

export default function MarqueeStripe({ items = DEFAULT_ITEMS }) {
  return (
    <div
      role="region"
      aria-label="Projects shipped"
      className="relative overflow-hidden bg-ink py-4"
    >
      {/* left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-24" />
      {/* right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-24" />

      <div className="flex w-max animate-marquee items-center gap-10 px-6 sm:gap-16 sm:px-8">
        {[false, true].map((isClone) =>
          items.map((item, i) => (
            <span
              key={`${isClone ? "clone" : "track"}-${i}`}
              aria-hidden={isClone || undefined}
              className="text-lg font-bold uppercase tracking-wide text-foreground/40 transition-colors hover:text-foreground/80 sm:text-xl"
            >
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
