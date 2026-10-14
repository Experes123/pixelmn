export function Logo({ light = false, name = "Халдэн" }: { light?: boolean; name?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-display text-base font-semibold tracking-tight">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <rect width="28" height="28" rx="8" fill={light ? "#fff" : "#0b0b0c"} />
        <path d="M8 7l12 14M20 7L8 21" stroke="#ff4a1c" strokeWidth="3" strokeLinecap="square" fill="none" />
      </svg>
      <span className={light ? "text-white" : ""}>{name}</span>
    </span>
  );
}
