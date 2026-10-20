# FOUNDATION.md — Агентүүдийн хамтын гэрээ (ЭХЭЛДЭЭГҮЙ УНШ!)

Энэ төсөл: **Pixelmn** — монгол дижитал студийн премиум вэбсайт + 6 бүрэн ажиллагаатай демо вэбсайт. **Бүх харагдах текст Монгол Кирилл** байх ЁСТОЙ (брэнд нэр, URL, техникийн нэрсээс бусад).

## Технологи

- Next.js 16 App Router, TypeScript, Tailwind CSS 4, shadcn/ui (`src/components/ui` дотор бүрэн багц бэлэн), framer-motion, sonner (toast), zod, lucide-react.
- Prisma + SQLite (`db/custom.db`). Сервер талд: `import { db } from '@/lib/db'`.
- Dev server: port 3000, аль хэдийн ажиллаж байгаа — **БҮҮ restart хий**. Алдааг `/home/z/my-project/dev.log`-ээс шалгана (`tail -50` — зөвхөн сүүлийн мөрүүд).
- Lint: `bun run lint` (зөвхөн өөрийн файлуудын алдааг зас). Production build БҮҮ ажиллуул.

## Хуудасны бүтэц — HASH ROUTER (чухал!)

Ганц route нь `src/app/page.tsx` (app shell). Бүх хуудас hash замаар ажилладаг:

- `#/` → үндсэн сайт (AgencySite)
- `#/privacy`, `#/terms` → legal хуудас
- `#/admin` → үндсэн сайтын админ
- `#/demo/barber`, `#/demo/pc-cafe`, `#/demo/urgo`, `#/demo/temuur`, `#/demo/uzeg`, `#/demo/nutag` → 6 демо
- Демо дотор дэд хуудас: `#/demo/barber/booking`, `#/demo/barber/admin` гэх мэт. Параметрт хуудас: `#/demo/uzeg/title?id=xxx`.

### Ашиглах API (src/lib/hash-router.tsx)

```tsx
import { useHashRoute, navigate, useDemoRoute, DemoLink, goHomeToPortfolio } from '@/lib/hash-router'

const { sub, query } = useDemoRoute('barber') // sub: '' | 'booking' | 'admin' | 'status'
navigate('/demo/barber/booking') // шилжилт (scroll to top автоматаар)
<DemoLink href="/demo/barber/admin">Admin Panel</DemoLink>
```

- page.tsx нь hash өөрчлөгдөхөд өөрөө `window.scrollTo(0,0)` хийдэг — демо дотор дахин хийх шаардлагагүй.
- Үндсэн сайтын порфолио хэсэг рүү шилжих: `goHomeToPortfolio()`.

## Эдгээр файлуудыг БҮҮ өөрчил (хориглосон)

`prisma/schema.prisma`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/*`, `src/components/shared/*`, `src/config/demos.ts`, бусад агентийн фолдерууд (`src/components/demos/<бусад-demo>`, `src/components/agency/*` нь 1-a агентийн эзэмшил).

Таны эзэмших фолдер:
- Демо агентууд: `src/components/demos/<demo-id>/` (файлын бүтэц чөлөөт, ГЭХДЭЭ index.tsx нь default export компонент байх ЁСТОЙ) + `prisma/seed-<demo-id>.ts`
- 1-a агент: `src/components/agency/` + `src/config/agency.ts`

## API — GENERIC REST (бүх демо энэ ашиглана)

Нэг эндпоинт систем: `/api/<resource>` ба `/api/<resource>/<id>`.

- `GET /api/<resource>` → жагсаалт (JSON массив)
- `POST /api/<resource>` → үүсгэх (body: талбарууд)
- `GET | PATCH | PUT | DELETE /api/<resource>/<id>`
- `GET /api/<resource>?key=pricing` → нэг бичилт (зөвхөн site-content, company-content дээр key талбартай)

Resource нэрс ба талбарууд ((I)=бүхэл тоо, (B)=boolean, (J)=Json, ?=сонголттой; бүгд id, createdAt, updatedAt, meta? автоматаар):

| resource | model | талбарууд |
|---|---|---|
| inquiries | Inquiry | name, email, company?, serviceType, budget, details, status(шинэ/хариулсан/хаагдсан) |
| site-content | SiteContent | key(unique), label?, value(J) |
| barber-services | BarberService | name, category(үс/сахлис/хосолсон/арчилгаа), price(I), durationMin(I), description, active(B) |
| barbers | Barber | name, title, bio, specialties(таслалаар тусгаарласан), imageUrl?, active(B) |
| barber-bookings | BarberBooking | serviceId?, serviceName, barberId?, barberName, date(YYYY-MM-DD), time(HH:mm), customerName, phone, email?, notes?, status, paymentStatus, totalAmount(I) |
| pc-stations | PcStation | name, zone(Стандарт/VIP/Консоль), cpu, gpu, ram, extras?, pricePerHour(I), status(боломжтой/эзлэгдсэн/засварт), active(B) |
| pc-bookings | PcBooking | stationId?, stationName, zone, date, startTime, hours(I), customerName, phone, status(идэвхтэй/дууссан/цуцлагдсан), paymentStatus, totalAmount(I) |
| menu-items | MenuItem | name, description, category(нэйлэг/зүсэмж/хөнгөн/амттан/уух зүйл), price(I), imageUrl?, spicy(B), available(B), popular(B) |
| restaurant-orders | RestaurantOrder | customerName, phone, address, notes?, items(J: [{id,name,price,qty,options[]}]), subtotal(I), deliveryFee(I), total(I), status, paymentStatus |
| company-services | CompanyService | title, description, icon(lucide нэр), order(I), active(B) |
| company-projects | CompanyProject | title, description, category, year, imageUrl?, order(I), active(B) |
| company-inquiries | CompanyInquiry | name, email, subject, message, status(шинэ/уншсан/хариулсан) |
| company-content | CompanyContent | key(unique), label?, value(string) |
| stream-titles | StreamTitle | title, type(кино/цуврал/баримтат), genre, year(I), rating(F 0-10), duration, description, posterGradient(CSS gradient string), backdropUrl?, videoUrl?, featured(B), isNew(B), active(B) |
| stream-subs | StreamSub | plan(Сар/Жил/Гэр бүл), customerName, email, amount(I), status(идэвхтэй/цуцлагдсан) |
| products | Product | name, description, category, price(I), oldPrice(I?), stock(I), imageUrl?, options(J: [{name,values[]}]), featured(B), active(B) |
| shop-orders | ShopOrder | customerName, phone, email?, city, address, notes?, items(J: [{id,name,price,qty,option}]), subtotal(I), deliveryFee(I), total(I), status, paymentStatus |

Төлөв нэрсийг дээрх дагуа Монголоор ашигла (StatusBadge автоматаар өнгөтэй харуулна).

## Бэлэн Shared компонентууд

```tsx
import { FakePaymentModal, ReturnToMain, DemoBadge } from '@/components/shared/demo-kit'
import { StatusBadge, EmptyState, LoadingState, ConfirmDelete, fmtMNT, fmtDate, fmtDateTime, DemoDataNote } from '@/components/shared/admin-kit'
import { useApi, fetchList, fetchByKey } from '@/lib/use-api'
```

- **FakePaymentModal**: `{open, onClose, amount, merchant, accent, processPayment(outcome)}` — демо карт цонх (зөвшөөрөх/татгалзах/цуцлах тест үр дүн). processPayment дотор захиалгын paymentStatus-г PATCH-ла.
- **ReturnToMain**: `{accent, dark}` — зүүн дээд буланд FIXED байгаа "Үндсэн сайт руу буцах" товч. Демо бүрийн root-д ЗААВАЛ нэм.
- **useApi<T>(resource)**: `{data, loading, error, reload, create, update, remove}`.
- **fmtMNT(400000)** → "400,000₮".

## Фонт хувьсагчууд (layout-д аль хэдийн ачаалагдсан)

| var | фонт | хэрэглэгч |
|---|---|---|
| --font-inter | Inter | үндсэн сайт body (default) |
| --font-manrope | Manrope | үндсэн сайт headings + НУТАГ дэлгүүр |
| --font-playfair | Playfair Display | ГАН Barbershop |
| --font-russo | Russo One | ШОНХОР Gaming Café |
| --font-lora | Lora | ӨРГӨӨ Ресторан |
| --font-noto-serif | Noto Serif | ТЭМҮҮР Групп |
| --font-unbounded | Unbounded | ҮЗЭГ Стриминг |

Root div дээр: `style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}` гэх мэтээр тохируулна. shadcn компонентууд theme CSS var ашигладаг тул dark демоны root div-д `className="dark"` нэмвэл Dialog/Input гэх мэт зөв dark харагдана.

## Зураг — бэлэн URL сан

`/home/z/my-project/assets-img/IMAGE_INDEX.json` — түлхүүр бүр URL массив (5-аас):

- `food1..food8` — рестораны хоол (food1 бууз, food2 махны шиш, food3 гүйлсэн шөл, food4 салад, food5 хуурч будаа, food6 хуушуур, food7 цай, food8 амттан)
- `prod1..prod8` — дэлгүүрийн бүтээгдэхүүн (prod1 арьсан цүнх, prod2 эсгий пантүфл, prod3 ваар аяга, prod4 цайн навч, prod5 хөвөн хоргүй ноосон хөлийн хэрэглэл, prod6 арьсан түрийвч, prod7 зэс аяга, prod8 аяллын дэр)
- `barber1..barber4` — барбершоп интерьер, ажиллагаа
- `pc1..pc3` — геймин PC, киберспорт өрөө
- `company1..company4` — корпорацийн барилга, багийн ажил
- `stream1..stream2` — кинематик бэкдроп (нүүдэлчин уул, неон шөнийн хот)

Зөвхөн `original_url` утгуудыг ашигла: `<img src={url} alt="..." loading="lazy" className="..." />` (next/image биш — гадаад URL).

## Seed файл (демо агентууд)

`prisma/seed-<demo-id>.ts` үүсгэж, дуусгаад **нэг удаа** ажиллуулна: `bun prisma/seed-<demo-id>.ts`. Давхардахгүйн тулд эхэндээ өөрийн модель дээр `deleteMany()` хий. Seed өгөгдөл нь БАЯЛАГ, бодитоор харагдах Монгол контент байх ЁСТОЙ (үнэ төглөгөөр). Lock error гарвал 2-3 удаа дахин оролд.

## Чанарын шаардлага (бүгдэд хамаатай)

1. Монгол Кирилл 100% (validation мессеж, toast, empty state бүгд монголоор).
2. Өөрийн брэнд: өнгө палитр, фонт, лого (wordmark SVG/текст), навигац, layout — бусад демоноос ЯЛГААТАЙ design language.
3. Responsive (mobile-first). Sticky footer: root `min-h-screen flex flex-col`, footer `mt-auto`.
4. Демо горим тодорхой: ReturnToMain + навигацид "Admin Panel" холбоос + DEMO бэйдж.
5. Admin panel: dashboard (тоон харалт), CRUD хүснэгт (хайлт), төлөв өөрчлөх, ConfirmDelete, loading/empty төлөв, бодит API-тай ажиллах, "Демо админ" гэж тэмдэглэсэн байх.
6. Loading: skeleton/spinner. Empty: EmptyState. Error: алдааны мессеж + toast (`import { toast } from 'sonner'`).
7. Form validation: шаардлагатай талбар, утасны формат (8 оронтой: `/^\d{8}$/`), имэйл формат, алдааны мессеж монголоор, submit товч disabled төлөв.
8. Хориг: next/image, бодит төлбөрийн систем, auth (демо админ нээлттэй, гэхдээ "Демо админ" гэсэн тэмдэгтэй).

## Нийтлэг зөвлөмж

- framer-motion subtle ашиглаж болно (аль хэдийн суулгасан).
- Хүснэгт: `components/ui/table.tsx`. Tabs, Select, Dialog, Switch, Checkbox, RadioGroup, Sheet, Accordion бүгд бэлэн.
- Урт жагсаалт: `max-h-[420px] overflow-y-auto nice-scroll`.
- Tailwind 4 arbitrary values OK (`bg-[#0A0F0D]`, `text-[13px]`).
- Дуусгаад: өөрийн seed ажиллуул, `bun run lint` үзүүлэлт цэвэр, dev.log шалгаж runtime алдаагүй эсэхийг батал, worklog.md-д хавсаргана.
