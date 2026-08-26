/**
 * MarqueeStripe — a full-width scrolling ticker that runs immediately after the
 * hero section. It loops project / brand names to signal social proof at a glance.
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
  "University of Dhaka",
];

export default function MarqueeStripe({ items = DEFAULT_ITEMS }) {
  // Duplicate the list so the loop is seamless
  const track = [...items, ...items];

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-line bg-ink py-4"
    >
      {/* left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-24" />
      {/* right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-24" />

      <div className="flex w-max animate-marquee items-center gap-10 px-6 sm:gap-16 sm:px-8">
        {track.map((item, i) => (
          <span
            key={i}
            className="text-lg font-bold uppercase tracking-wide text-white/25 transition-colors hover:text-white/60 sm:text-xl"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
