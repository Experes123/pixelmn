'use client'

import { useEffect, useState } from 'react'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DISPLAY_FONT } from '@/config/agency'
import type {
  ContactContent,
  FaqText,
  FooterContent,
  HeroContent,
  ServiceText,
  SiteContent,
} from '@/lib/site-content'

/** Бүх контентыг нэг бичилтэд (site-content key='content') хадгална */
export type SaveSiteContent = (next: SiteContent) => Promise<void>

/** Хадгалах төлөв + амжилт/алдааны мэдэгдэл — бүх табад нэгдсэн */
function useSectionSave(onSave: SaveSiteContent) {
  const [saving, setSaving] = useState(false)
  const save = async (next: SiteContent) => {
    setSaving(true)
    try {
      await onSave(next)
      toast.success('Хадгалагдлаа — өөрчлөлт нийтийн сайтад шууд харагдана.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Хадгалахад алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setSaving(false)
    }
  }
  return { saving, save }
}

/** Табын толгой — гарчиг, тайлбар, хадгалах товч */
function EditorPanel({
  title,
  note,
  saving,
  onSave,
  aside,
  children,
}: {
  title: string
  note: string
  saving: boolean
  onSave: () => void
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-black/[0.08] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 style={DISPLAY_FONT} className="text-lg font-extrabold tracking-tight">
              {title}
            </h2>
            <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-black/50">{note}</p>
          </div>
          <div className="flex items-center gap-2">
            {aside}
            <Button
              onClick={onSave}
              disabled={saving}
              className="h-10 rounded-xl bg-[#E4572E] font-bold text-white hover:bg-[#d24a22]"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Хадгалж байна…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Хадгалах
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[12.5px] font-semibold text-black/60">{label}</Label>
      {children}
      {hint && <p className="text-[11.5px] text-black/40">{hint}</p>}
    </div>
  )
}

/** ───────────────── Ерөнхий: геро + холбоо + хөл ───────────────── */

export function GeneralTab({
  content,
  onSave,
}: {
  content: SiteContent
  onSave: SaveSiteContent
}) {
  const { saving, save } = useSectionSave(onSave)
  const [hero, setHero] = useState<HeroContent>(content.hero)
  const [contact, setContact] = useState<ContactContent>(content.contact)
  const [footer, setFooter] = useState<FooterContent>(content.footer)

  const heroKey = JSON.stringify(content.hero)
  const contactKey = JSON.stringify(content.contact)
  const footerKey = JSON.stringify(content.footer)
  useEffect(() => {
    setHero(content.hero)
     
  }, [heroKey])
  useEffect(() => {
    setContact(content.contact)
     
  }, [contactKey])
  useEffect(() => {
    setFooter(content.footer)
     
  }, [footerKey])

  return (
    <EditorPanel
      title="Ерөнхий контент"
      note="Нүүр хэсгийн гарчиг, товчны шошго, холбоо барих мэдээлэл болон хөл хэсгийн текстийг эндээс засварлана."
      saving={saving}
      onSave={() => save({ ...content, hero, contact, footer })}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Геро карт */}
        <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white p-5">
          <p style={DISPLAY_FONT} className="text-[13px] font-bold uppercase tracking-[0.14em] text-black/40">
            Нүүр (геро) хэсэг
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Гарчгийн эхлэл">
              <Input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="h-10 rounded-xl" />
            </Field>
            <Field label="Онцолсон үг" hint="Улбар шараар тодрох үг">
              <Input value={hero.titleAccent} onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })} className="h-10 rounded-xl" />
            </Field>
            <Field label="Гарчгийн төгсгөл">
              <Input value={hero.titleEnd} onChange={(e) => setHero({ ...hero, titleEnd: e.target.value })} className="h-10 rounded-xl" />
            </Field>
          </div>
          <Field label="Дэд гарчиг (жижиг шошго)">
            <Input value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} className="h-10 rounded-xl" />
          </Field>
          <Field label="Тайлбар өгүүлбэр">
            <Textarea rows={3} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className="rounded-xl" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Гол товчны шошго">
              <Input value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} className="h-10 rounded-xl" />
            </Field>
            <Field label="Хоёрдогч товчны шошго">
              <Input value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} className="h-10 rounded-xl" />
            </Field>
          </div>
          <Field label="Давуу талын жижиг шошгууд" hint="Мөр бүрт нэг шошго (дээд тал нь 6)">
            <Textarea
              rows={3}
              value={hero.chips.join('\n')}
              onChange={(e) => setHero({ ...hero, chips: e.target.value.split('\n') })}
              className="rounded-xl"
            />
          </Field>
        </div>

        <div className="flex flex-col gap-4">
          {/* Холбоо барих карт */}
          <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white p-5">
            <p style={DISPLAY_FONT} className="text-[13px] font-bold uppercase tracking-[0.14em] text-black/40">
              Холбоо барих
            </p>
            <Field label="Имэйл">
              <Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="h-10 rounded-xl" />
            </Field>
            <Field label="Утас">
              <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="h-10 rounded-xl" />
            </Field>
            <Field label="Хаяг">
              <Input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} className="h-10 rounded-xl" />
            </Field>
          </div>

          {/* Хөл карт */}
          <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white p-5">
            <p style={DISPLAY_FONT} className="text-[13px] font-bold uppercase tracking-[0.14em] text-black/40">
              Хөл хэсэг
            </p>
            <Field label="Товч танилцуулга">
              <Textarea rows={3} value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} className="rounded-xl" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Facebook холбоос">
                <Input value={footer.socials.facebook} onChange={(e) => setFooter({ ...footer, socials: { ...footer.socials, facebook: e.target.value } })} placeholder="https://facebook.com/…" className="h-10 rounded-xl" />
              </Field>
              <Field label="Instagram холбоос">
                <Input value={footer.socials.instagram} onChange={(e) => setFooter({ ...footer, socials: { ...footer.socials, instagram: e.target.value } })} placeholder="https://instagram.com/…" className="h-10 rounded-xl" />
              </Field>
              <Field label="LinkedIn холбоос">
                <Input value={footer.socials.linkedin} onChange={(e) => setFooter({ ...footer, socials: { ...footer.socials, linkedin: e.target.value } })} placeholder="https://linkedin.com/…" className="h-10 rounded-xl" />
              </Field>
              <Field label="YouTube холбоос">
                <Input value={footer.socials.youtube} onChange={(e) => setFooter({ ...footer, socials: { ...footer.socials, youtube: e.target.value } })} placeholder="https://youtube.com/…" className="h-10 rounded-xl" />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </EditorPanel>
  )
}

/** ───────────────── Жагсаалт засварлагч (үйлчилгээ, давуу тал, урсгал, ТҮА) ───────────────── */

type ListField = { key: string; label: string; textarea?: boolean; rows?: number; placeholder?: string }

function ListEditor<T extends Record<string, string>>({
  items,
  setItems,
  fields,
  addLabel,
  maxItems,
  blank,
}: {
  items: T[]
  setItems: (next: T[]) => void
  fields: ListField[]
  addLabel: string
  maxItems: number
  blank: T
}) {
  const patch = (index: number, key: string, value: string) =>
    setItems(items.map((it, i) => (i === index ? { ...it, [key]: value } : it)))
  const remove = (index: number) => setItems(items.filter((_, i) => i !== index))
  const add = () => setItems([...items, { ...blank }])

  return (
    <div className="grid gap-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-black/[0.08] bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p style={DISPLAY_FONT} className="text-[13px] font-bold uppercase tracking-[0.14em] text-black/40">
              #{i + 1}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              disabled={items.length <= 1}
              className="h-8 rounded-lg px-2.5 text-[12px] text-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label={`${i + 1} дэх мөрийг устгах`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Устгах
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.textarea ? (
                  <Textarea
                    rows={f.rows ?? 2}
                    value={item[f.key] ?? ''}
                    onChange={(e) => patch(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="rounded-xl"
                  />
                ) : (
                  <Input
                    value={item[f.key] ?? ''}
                    onChange={(e) => patch(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="h-10 rounded-xl"
                  />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={add}
        disabled={items.length >= maxItems}
        className="h-11 w-fit rounded-xl border-dashed border-black/20 font-semibold text-black/60 hover:border-[#E4572E]/50 hover:text-[#E4572E]"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  )
}

/** ───────────────── Үйлчилгээ ───────────────── */

export function ServicesTab({
  content,
  onSave,
}: {
  content: SiteContent
  onSave: SaveSiteContent
}) {
  const { saving, save } = useSectionSave(onSave)
  const [services, setServices] = useState<ServiceText[]>(content.services)
  const key = JSON.stringify(content.services)
  useEffect(() => {
    setServices(content.services)
     
  }, [key])

  return (
    <EditorPanel
      title="Үйлчилгээ"
      note="Үйлчилгээний картуудын текст. Дүрс тэмдэг нь дарааллаараа хэвээр үлдэнэ — эхний карт эхний дүрс, гэх мэт."
      saving={saving}
      onSave={() => save({ ...content, services })}
    >
      <ListEditor<ServiceText>
        items={services}
        setItems={setServices}
        fields={[
          { key: 'title', label: 'Гарчиг' },
          { key: 'description', label: 'Тайлбар', textarea: true, rows: 3 },
        ]}
        addLabel="Үйлчилгээ нэмэх"
        maxItems={12}
        blank={{ title: 'Шинэ үйлчилгээ', description: 'Тайлбар…' }}
      />
    </EditorPanel>
  )
}

/** ───────────────── Давуу тал ───────────────── */

export function BenefitsTab({
  content,
  onSave,
}: {
  content: SiteContent
  onSave: SaveSiteContent
}) {
  const { saving, save } = useSectionSave(onSave)
  const [benefits, setBenefits] = useState<ServiceText[]>(content.benefits)
  const key = JSON.stringify(content.benefits)
  useEffect(() => {
    setBenefits(content.benefits)
     
  }, [key])

  return (
    <EditorPanel
      title="Давуу тал"
      note="«Бидний тухай» хэсгийн 6 давуу талын карт. Дүрс тэмдгүүд дарааллаараа хэвээр."
      saving={saving}
      onSave={() => save({ ...content, benefits })}
    >
      <ListEditor<ServiceText>
        items={benefits}
        setItems={setBenefits}
        fields={[
          { key: 'title', label: 'Гарчиг' },
          { key: 'description', label: 'Тайлбар', textarea: true, rows: 3 },
        ]}
        addLabel="Давуу тал нэмэх"
        maxItems={9}
        blank={{ title: 'Шинэ давуу тал', description: 'Тайлбар…' }}
      />
    </EditorPanel>
  )
}

/** ───────────────── Ажлын урсгал ───────────────── */

export function StepsTab({
  content,
  onSave,
}: {
  content: SiteContent
  onSave: SaveSiteContent
}) {
  const { saving, save } = useSectionSave(onSave)
  const [steps, setSteps] = useState<ServiceText[]>(content.steps)
  const key = JSON.stringify(content.steps)
  useEffect(() => {
    setSteps(content.steps)
     
  }, [key])

  return (
    <EditorPanel
      title="Ажлын урсгал"
      note="Хамтын ажиллагааны үе шатууд (01–06). Алхам нэмж, хасах боломжтой."
      saving={saving}
      onSave={() => save({ ...content, steps })}
    >
      <ListEditor<ServiceText>
        items={steps}
        setItems={setSteps}
        fields={[
          { key: 'title', label: 'Алхмын нэр' },
          { key: 'description', label: 'Тайлбар', textarea: true, rows: 2 },
        ]}
        addLabel="Алхам нэмэх"
        maxItems={9}
        blank={{ title: 'Шинэ алхам', description: 'Тайлбар…' }}
      />
    </EditorPanel>
  )
}

/** ───────────────── Түгээмэл асуулт (ТҮА) ───────────────── */

export function FaqTab({
  content,
  onSave,
}: {
  content: SiteContent
  onSave: SaveSiteContent
}) {
  const { saving, save } = useSectionSave(onSave)
  const [faq, setFaq] = useState<FaqText[]>(content.faq)
  const key = JSON.stringify(content.faq)
  useEffect(() => {
    setFaq(content.faq)
     
  }, [key])

  return (
    <EditorPanel
      title="Түгээмэл асуулт"
      note="Асуулт, хариултын жагсаалт. Хайлтын талбар автоматаар шинэчлэгдэнэ."
      saving={saving}
      onSave={() => save({ ...content, faq })}
    >
      <ListEditor<FaqText>
        items={faq}
        setItems={setFaq}
        fields={[
          { key: 'q', label: 'Асуулт' },
          { key: 'a', label: 'Хариулт', textarea: true, rows: 3 },
        ]}
        addLabel="Асуулт нэмэх"
        maxItems={20}
        blank={{ q: 'Шинэ асуулт?', a: 'Хариулт…' }}
      />
    </EditorPanel>
  )
}

/** ───────────────── Хамтын ажиллагаа (түншийн байр) ───────────────── */

export function PartnersTab({
  content,
  onSave,
}: {
  content: SiteContent
  onSave: SaveSiteContent
}) {
  const { saving, save } = useSectionSave(onSave)
  const [partners, setPartners] = useState<string[]>(content.partners)
  const key = JSON.stringify(content.partners)
  useEffect(() => {
    setPartners(content.partners)
     
  }, [key])

  const patch = (i: number, value: string) =>
    setPartners(partners.map((p, idx) => (idx === i ? value : p)))

  return (
    <EditorPanel
      title="Хамтын ажиллагаа"
      note="Түншийн байрны нэрс. Байр бүр нийтийн сайт дээр «Тун удахгүй» төлөвтэйгээр хязгааргүй карусельд харагдана."
      saving={saving}
      onSave={() => save({ ...content, partners: partners.map((p) => p.trim()).filter(Boolean) })}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {partners.map((p, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl border border-black/[0.08] bg-white p-4">
            <div className="flex items-center justify-between">
              <Label className="text-[12px] font-semibold text-black/45">Байр #{i + 1}</Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPartners(partners.filter((_, idx) => idx !== i))}
                disabled={partners.length <= 1}
                className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                aria-label={`${i + 1} дэх байрыг устгах`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Input value={p} onChange={(e) => patch(i, e.target.value)} className="h-10 rounded-xl" />
            <p className="text-[11px] text-black/40">Нийтийн харагдац: «Тун удахгүй» бэйджтэй</p>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={() => setPartners([...partners, 'Шинэ түнш'])}
        disabled={partners.length >= 24}
        className="h-11 w-fit rounded-xl border-dashed border-black/20 font-semibold text-black/60 hover:border-[#E4572E]/50 hover:text-[#E4572E]"
      >
        <Plus className="h-4 w-4" />
        Байр нэмэх
      </Button>
    </EditorPanel>
  )
}
