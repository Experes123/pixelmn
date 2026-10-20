'use client'

import type { ReactNode } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/agency/brand'
import { DISPLAY_FONT } from '@/config/agency'
import { useSiteContent } from '@/lib/site-content'

/** Холбоо барих мэдээлэл — админ панелаас засварласан утгыг уншина */
function useContact() {
  const { content } = useSiteContent()
  return content.contact
}

/** Хуулийн хуудсуудын нийтлэг бүтэц */
function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#FAFAF8] text-[#0B0B0C]"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <header className="border-b border-black/[0.08] bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <a href="#/" aria-label="Pixelmn — үндсэн сайт">
            <Logo size={32} />
          </a>
          <a
            href="#/"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-black/70 transition-colors hover:bg-[#F2F1EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Үндсэн сайт
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#E4572E]">
          <ShieldCheck className="h-4 w-4" />
          Pixelmn
        </p>
        <h1
          style={DISPLAY_FONT}
          className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          {title}
        </h1>
        <p className="mt-2 text-[13px] text-black/45">Сүүлийн шинэчлэл: 2026 он</p>

        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </main>

      <footer className="mt-auto border-t border-black/[0.08] bg-white py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 text-[12px] text-black/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Pixelmn. Бүх эрх хамгаалагдсан.</p>
          <div className="flex gap-4">
            <a href="#/privacy" className="transition-colors hover:text-black/70">
              Нууцлалын бодлого
            </a>
            <a href="#/terms" className="transition-colors hover:text-black/70">
              Үйлчилгээний нөхцөл
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2
        style={DISPLAY_FONT}
        className="mb-2.5 text-[18px] font-extrabold tracking-tight text-[#0B0B0C]"
      >
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-[14px] leading-relaxed text-black/65">
        {children}
      </div>
    </section>
  )
}

/** ───────────────── Нууцлалын бодлого ───────────────── */
export function PrivacyPage() {
  const contact = useContact()

  return (
    <LegalLayout title="Нууцлалын бодлого">
      <Section title="1. Ерөнхий мэдээлэл">
        <p>
          Pixelmn (цаашид «бид») нь танай хувийн мэдээллийг хүндэтгэдэг. Энэ бодлого нь
          манай вэбсайтаар дамжуулан ямар мэдээллийг хэрхэн цуглуулж, ашигладаг тухай тайлбарлана.
        </p>
      </Section>

      <Section title="2. Бид ямар мэдээллийг цуглуулдаг вэ?">
        <p>
          Зөвхөн та өөрөө бөглөсөн мэдээллийг л авдаг: хүсэлтийн маягтаар дамжуулан —
          <strong> нэр, имэйл хаяг, компани, байгууллагын нэр (боломжтой), сонгосон үйлчилгээний
          төрөл, төсвийн хүрээ, төслийн дэлгэрэнгүй мэдээлэл.</strong>
        </p>
        <p>
          Эдгээрээс бусад ямар нэгэн профайл, бүртгэл, хувийн баримт бичгийг шаарддаггүй.
        </p>
      </Section>

      <Section title="3. Бид юуг цуглуулдаггүй вэ?">
        <p>Бид дараах зүйлсийг хийдэггүй:</p>
        <p>
          — Хуудасны хөдөлгөөнийг хянах зориулалттай cookie болон трекер ашигладаггүй;
          <br />
          — Зар суртчилгааны гуравдагч этгээдэд мэдээлэл дамжуулдаггүй;
          <br />
          — Танай зөвшөөрөлгүйгээр борлуулалтын жагсаалт бүрдүүлдэггүй;
          <br />
          — Төлбөрийн картын мэдээлэл хүлээн авдаггүй, хадгалдаггүй.
        </p>
      </Section>

      <Section title="4. Мэдээллийг хэрхэн ашигладаг вэ?">
        <p>
          Цуглуулсан мэдээллийг зөвхөн танай хүсэлтийг судалж, танд буцаж холбогдох, үнийн санал
          боловсруулах, төслийн цар хүрээг тодорхойлоход ашиглана. Өөр зорилгоор шилжүүлдэггүй.
        </p>
      </Section>

      <Section title="5. Мэдээллийг хаана, хэр удаан хадгалдаг вэ?">
        <p>
          Хүсэлтийн мэдээлэл манай өгөгдлийн санд хадгалагдана. Одоогийн хувилбарт сайт демо горимд
          ажиллаж байгаа тул бүртгэл нь түр зуурын, туршилтын орчинд байгааг анхаарна уу. Бодит
          ажиллагаанд шилжихэд энэ хуудсанд хугацаа, хамгаалалтын дэлгэрэнгүй нөхцөлийг
          шинэчилнэ.
        </p>
      </Section>

      <Section title="6. Гуравдагч этгээд">
        <p>
          Танай мэдээллийг худалдах, өгөх, зарахгүй. Хөгжүүлэлтийн явцад хэрэгтэй бол хамрагч
          мэргэжилтэнтэй зөвхөн төслийн цар хүрээтэй холбоотой хэсгийг, танай зөвшөөрлөөр
          хуваалцана.
        </p>
      </Section>

      <Section title="7. Мэдээллээ хэрхэн устгах вэ?">
        <p>
          Танай бүртгэсэн хүсэлтийг устгах, зассан хөтлөхийг хүсвэл {contact.email} хаягаар
          холбогдоно уу. Хүсэлтийг хүлээн авмагц богино хугацаанд гүйцэтгэнэ.
        </p>
      </Section>

      <Section title="8. Бодлогын өөрчлөлт">
        <p>
          Энэ бодлогыг бодит ажиллагаанд шилжих, шинэ үйлчилгээ нэмэгдэх зэрэг тохиолдолд
          шинэчилж болно. Шинэчлэл бүрийг хуудас дээрх «Сүүлийн шинэчлэл» огноогоор тэмдэглэнэ.
        </p>
      </Section>

      <Section title="9. Холбоо барих">
        <p>
          Нууцлалын бодлоготой холбоотой асуух зүйл байвал {contact.email} имэйлээр хандана уу.
        </p>
      </Section>
    </LegalLayout>
  )
}

/** ───────────────── Үйлчилгээний нөхцөл ───────────────── */
export function TermsPage() {
  const contact = useContact()

  return (
    <LegalLayout title="Үйлчилгээний нөхцөл">
      <Section title="1. Ерөнхий нөхцөл">
        <p>
          Энэхүү нөхцөл нь Pixelmn студийн вэбсайт болон үйлчилгээг ашиглахад хамаатай.
          Вэбсайтад зочилж, хүсэлт илгээсэн нь эдгээр нөхцөлийг хүлээн зөвшөөрсэн гэж үзнэ.
        </p>
      </Section>

      <Section title="2. Үйлчилгээний цар хүрээ">
        <p>
          Бид вэбсайт хөгжүүлэлт, UI/UX дизайн, брэнд хөгжүүлэлт, цахим худалдаа, захиалгын систем,
          бизнес автоматжуулалт, AI интеграц, мобайл апп, арчилгааны үйлчилгээг санал болгодог.
          Тодорхой төслийн цар хүрээ, хугацаа, үнийг ажил эхлэхээс өмнө бичгээр (имэйл, гэрээ)
          тохирно.
        </p>
      </Section>

      <Section title="3. Демо агуулга">
        <p>
          Манай порфолиод байгаа 6 төсөл нь бүрэн ажиллагаатай демо вэбсайт бөгөөд демо горимд
          ажиллана: төлбөр, захиалга бүхий үйлдэл бодит бус, өгөгдөл нь жишээ контент юм.
        </p>
      </Section>

      <Section title="4. Үнийн нөхцөл">
        <p>
          Вэбсайт дээрх багцын үнүүд (400,000₮ — 1,500,000₮ ба онцгой багцын тохиролцооны үнэ) нь
          эхлэн үнэ бөгөөд тусгай функц, интеграц нэмэгдэх тутам өөрчлөгдөж болно. Эцсийн үнийг
          төсөл эхлэхээс өмнө бичгээр баталгаажуулна. Төлбөрийн хуваарийг гэрээнд тодорхойлно.
        </p>
      </Section>

      <Section title="5. Интелектуаль эзэмшил">
        <p>
          Төсөл бүрэн төлбөрт орох хүртэл дизайны эх загвар, код, материалын эрх бидэнд хамаарна.
          Төлбөрийг бүрэн төлсний дараа танай төслийн эцсийн бүтээгдэхүүний эрх танайд шилжинэ
          (гуравдагч этгээдийн лицензтэй бүрээс бусад). Манай лого, брэндийн материалыг зөвшөөрөлгүй
          ашиглахыг хориглоно.
        </p>
      </Section>

      <Section title="6. Хариуцлагын хязгаарлалт">
        <p>
          Демо вэбсайтуудын агуулга нь зөвхөн чадварыг харуулах зорилготой. Демо горимд
          бодит төлбөр хийх, бодит захиалга үүсгэх боломжгүй тул үүнтэй холбоотой хохиролд бид
          хариуцлага хүлээхгүй. Бодит төсөл дээрх хариуцлагыг гэрээгээр тодорхойлно.
        </p>
      </Section>

      <Section title="7. Хугацаа ба хүлээлт">
        <p>
          Төслийн хугацаа нь цар хүрээ, талаас нь шуурхай хариу өгөх хурдаас хамаарна. Баталгаат
          хугацааны оронд шат дараалсан төлөвлөгөө, тайлагналыг баримталж, саатал үүсэх тохиолдолд
          шууд мэдэгдэнэ.
        </p>
      </Section>

      <Section title="8. Хамтын ажиллагааг зогсоох">
        <p>
          Хоёр тал ажлын явцад тохиролцож болно. Төслийн явцад харилцаа таслагдах тохиолдолд
          хийгдсэн ажлын хэмжээг тодорхойлж, түүнтэй уялдсан тооцоог хийнэ.
        </p>
      </Section>

      <Section title="9. Нөхцөлийн өөрчлөлт">
        <p>
          Эдгээр нөхцөлийг цаг хугацааны явцад шинэчилж болно. Шинэчилсэн хувилбар энэ хуудсанд
          нийтлэгдмэгц хүчинтэй болно.
        </p>
      </Section>

      <Section title="10. Холбоо барих">
        <p>
          Үйлчилгээний нөхцөлтэй холбоотой асуулт, санал байвал {contact.email} хаягаар хандана уу.
        </p>
      </Section>
    </LegalLayout>
  )
}
