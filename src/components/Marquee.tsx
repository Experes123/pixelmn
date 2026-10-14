
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div aria-hidden className="select-none overflow-hidden border-y border-ink bg-white py-5">
      <div className="flex w-max animate-marquee gap-10 font-display text-3xl font-semibold uppercase sm:text-5xl">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className={i % 2 ? "outline-text" : ""}>{t}</span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
