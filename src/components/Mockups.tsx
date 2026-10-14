// Pure JSX/CSS interface mockups: zero image weight, crisp at any size.
const bars = [38, 52, 44, 68, 58, 82, 74, 92];

function Chrome({ url, children, dark = false }: { url: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl border shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)] ${dark ? "border-white/10 bg-ink text-white" : "border-line bg-white"}`}>
      <div className={`flex items-center gap-1.5 border-b px-4 py-3 ${dark ? "border-white/10" : "border-line"}`}>
        <i className="h-2.5 w-2.5 rounded-full bg-neutral-300/80" /><i className="h-2.5 w-2.5 rounded-full bg-neutral-300/80" /><i className="h-2.5 w-2.5 rounded-full bg-neutral-300/80" />
        <span className={`ml-3 rounded-md px-3 py-0.5 text-[10px] ${dark ? "bg-white/10 text-white/60" : "bg-mist text-neutral-500"}`}>{url}</span>
      </div>
      {children}
    </div>
  );
}

export function HeroMockup() {
  return (
    <div className="relative">
      <Chrome url="апп.жишээ.мн/тойм">
        <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[150px_1fr]">
          <aside className="space-y-2 border-r border-line bg-mist/60 p-3 sm:p-4">
            <div className="mb-4 h-5 w-5 rounded-md bg-ink" />
            {["Тойм", "Төсөл", "Хэрэглэгч", "Тайлан", "Тохиргоо"].map((l, i) => (
              <div key={l} className={`rounded-lg px-2 py-1.5 text-[11px] font-medium ${i === 0 ? "bg-white shadow-sm" : "text-neutral-500"}`}>
                <span className="hidden sm:inline">{l}</span><span className="sm:hidden">•</span>
              </div>
            ))}
          </aside>
          <div className="p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div><div className="text-[11px] text-neutral-500">Өглөөний мэнд</div><div className="font-display text-lg font-semibold">7 хоногийн тойм</div></div>
              <div className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold text-white">Шинэ тайлан</div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              {["Зочин", "Бүртгэл", "Захиалга"].map((k, i) => (
                <div key={k} className="rounded-xl border border-line p-3">
                  <div className="text-[10px] text-neutral-500">{k}</div>
                  <div className={`mt-2 h-2.5 rounded-full ${i === 1 ? "w-3/4 bg-accent" : "w-1/2 bg-ink"}`} />
                  <div className="mt-2 h-1.5 w-2/3 rounded-full bg-neutral-200" />
                </div>
              ))}
            </div>
            <div className="flex h-36 items-end gap-2 rounded-xl bg-mist p-4">
              {bars.map((h, i) => (
                <div key={i} className={`bar flex-1 rounded-t-md ${i === 7 ? "bg-accent" : "bg-ink/85"}`} style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </Chrome>
      <div className="animate-floaty absolute -bottom-8 -left-4 hidden w-52 rounded-2xl border border-line bg-white p-4 shadow-xl sm:block md:-left-10">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold"><span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] text-white">✓</span>Нээлтийн жагсаалт</div>
        {[100, 100, 60].map((w, i) => <div key={i} className="mt-2 h-1.5 rounded-full bg-neutral-200"><div className="h-full rounded-full bg-ink" style={{ width: `${w}%` }} /></div>)}
      </div>
      <div className="absolute -right-3 -top-5 hidden rotate-3 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white shadow-lg sm:block">Жишиг интерфейс</div>
    </div>
  );
}

export function ProjectMockup({ kind }: { kind: string }) {
  if (kind === "dashboard")
    return (
      <Chrome url="лүмэн.жишээ/данс" dark>
        <div className="space-y-3 p-5">
          <div className="flex items-end justify-between"><div><div className="text-[10px] text-white/50">Нийт үлдэгдэл</div><div className="font-display text-3xl font-semibold">$ ••••••</div></div><div className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold">Шилжүүлэх</div></div>
          <svg viewBox="0 0 300 80" className="h-24 w-full"><path d="M0 60 C40 55 50 20 90 30 S150 70 190 40 260 10 300 18" fill="none" stroke="#ff4a1c" strokeWidth="2.5" /><path d="M0 70 C50 60 80 55 120 58 S220 45 300 50" fill="none" stroke="#ffffff55" strokeWidth="1.5" /></svg>
          <div className="grid grid-cols-2 gap-2">{[0, 1].map(i => <div key={i} className="rounded-lg bg-white/5 p-3"><div className="h-1.5 w-1/2 rounded bg-white/30" /><div className="mt-2 h-2 w-3/4 rounded bg-white/60" /></div>)}</div>
        </div>
      </Chrome>
    );
  if (kind === "shop")
    return (
      <Chrome url="ферүнхил.жишээ/дэлгүүр">
        <div className="p-5">
          <div className="mb-3 flex justify-between text-[10px] font-semibold"><span>ФЕРҮНХИЛ</span><span className="text-neutral-400">Сагс (2)</span></div>
          <div className="grid grid-cols-3 gap-3">
            {["#e9e4da", "#ff4a1c", "#d6dccf"].map((c, i) => (
              <div key={i}><div className="aspect-[3/4] rounded-lg" style={{ background: c }} /><div className="mt-2 h-1.5 w-3/4 rounded bg-neutral-300" /><div className="mt-1.5 h-1.5 w-1/3 rounded bg-neutral-200" /></div>
            ))}
          </div>
        </div>
      </Chrome>
    );
  if (kind === "automation")
    return (
      <Chrome url="орбит.жишээ/урсгал">
        <div className="relative h-52 bg-mist p-5">
          {[["left-5 top-6", "Нэхэмжлэх ирлээ"], ["left-[38%] top-20", "AI ангилна"], ["right-5 top-8", "Багт мэдэгдэх"]].map(([p, l], i) => (
            <div key={i} className={`absolute ${p} rounded-xl border border-line bg-white px-3 py-2 text-[10px] font-semibold shadow-sm`}><span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${i === 1 ? "bg-accent" : "bg-ink"}`} />{l}</div>
          ))}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="#0b0b0c55" strokeDasharray="2 2" vectorEffect="non-scaling-stroke"><path d="M30 28 C40 28 36 58 44 58" /><path d="M66 58 C76 58 72 30 82 30" /></svg>
        </div>
      </Chrome>
    );
  return (
    <div className="mx-auto flex justify-center gap-4 py-2">
      {[0, 1].map((i) => (
        <div key={i} className={`w-32 rounded-[1.6rem] border-[5px] border-ink bg-white p-3 shadow-xl ${i ? "mt-8" : ""}`}>
          <div className="mx-auto mb-3 h-1 w-8 rounded bg-ink" />
          <div className={`mb-2 h-16 rounded-xl ${i ? "bg-ink" : "bg-accent"}`} />
          {[80, 60, 70].map((w, j) => <div key={j} className="mt-2 h-1.5 rounded bg-neutral-200" style={{ width: `${w}%` }} />)}
          <div className="mt-3 rounded-full bg-mist py-1.5 text-center text-[8px] font-semibold">Аялал эхлүүлэх</div>
        </div>
      ))}
    </div>
  );
}
