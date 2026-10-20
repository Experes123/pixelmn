'use client'

import { navigate } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  Bike,
  ChefHat,
  Clock,
  Leaf,
  MapPin,
  ShoppingBasket,
  Timer,
  Wallet,
} from 'lucide-react'
import { useCart } from './context'
import { Photo } from './photo'
import {
  CARD_BG,
  FOOD,
  GREEN,
  KICKER_GREEN,
  SAGE_BORDER,
  TERRA,
  type MenuItemData,
} from './constants'
import { fmtMNT } from '@/components/shared/admin-kit'

function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-[0.25em]"
      style={{ color: light ? '#A9C3B0' : KICKER_GREEN }}
    >
      {children}
    </p>
  )
}

function Hero() {
  const { count } = useCart()
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden px-4 pb-14 pt-10 sm:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Kicker>ӨРГӨӨ · МОНГОЛ ХООЛ</Kicker>
          <h1 className="mt-4 text-4xl font-bold leading-[1.15] sm:text-5xl" style={{ color: GREEN }}>
            Амт нь гэр шиг, орчин нь өргөө шиг.
          </h1>
          <p className="urgo-ui mt-5 max-w-lg text-base leading-relaxed text-[#4B5744]">
            Бууз, хуушуур, хорхог — гэр ахуйн жораар бэлтгэсэн уламжлалт монгол хоолыг Улаанбаатарын
            дотоод бүсэд 45–60 минутад хүргэж өгнө.
          </p>
          <div className="urgo-ui mt-7 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full text-white"
              style={{ backgroundColor: TERRA }}
              onClick={() => navigate('/demo/urgo/menu')}
            >
              Цэс үзэх
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-2 bg-transparent"
              style={{ borderColor: GREEN, color: GREEN }}
              onClick={() => navigate(count > 0 ? '/demo/urgo/cart' : '/demo/urgo/menu')}
            >
              <ShoppingBasket className="mr-2 h-4 w-4" />
              Хоол захиалах
            </Button>
          </div>
          <div className="urgo-ui mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#4B5744]">
            <span className="inline-flex items-center gap-2">
              <Timer className="h-4 w-4" style={{ color: TERRA }} /> 45–60 мин хүргэнэ
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" style={{ color: TERRA }} /> Дотоод бүсэд хүргэлт
            </span>
            <span className="inline-flex items-center gap-2">
              <ChefHat className="h-4 w-4" style={{ color: TERRA }} /> Гэр ахуйн жор
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div
            className="absolute -inset-3 -rotate-2 rounded-[2.2rem] border-2"
            style={{ borderColor: `${TERRA}40` }}
            aria-hidden="true"
          />
          <div
            className="absolute -right-4 -top-4 h-20 w-20 rounded-full border-2 border-dashed"
            style={{ borderColor: `${TERRA}66` }}
            aria-hidden="true"
          />
          <Photo
            src={FOOD.hero}
            alt="Халуун буузтай монгол ширээ"
            className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-xl"
          />
          <div
            className="urgo-ui absolute bottom-4 left-4 rounded-xl border px-4 py-2.5 shadow-lg backdrop-blur"
            style={{ backgroundColor: `${CARD_BG}F2`, borderColor: SAGE_BORDER }}
          >
            <p className="text-xs font-medium text-[#4B5744]">Өнөөдөр нээлттэй</p>
            <p className="text-sm font-bold" style={{ color: GREEN }}>
              10:00 – 22:00
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PopularSection() {
  const { data, loading } = useApi<MenuItemData>('menu-items')
  const { add } = useCart()
  const popular = data.filter((i) => i.popular).slice(0, 4)

  const quickAdd = (item: MenuItemData) => {
    if (!item.available) {
      toast.info(`${item.name} — өнөөдөр дууссан байна.`)
      return
    }
    add({ id: item.id, name: item.name, price: item.price }, [], 1)
    toast.success(`${item.name} — сагсанд нэмэгдлээ`)
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Kicker>АРДЫН ДУРТАЙ</Kicker>
          <h2 className="mt-2 text-3xl font-bold" style={{ color: GREEN }}>
            Онцлох хоолнууд
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigate('/demo/urgo/menu')}
          className="urgo-ui text-sm font-semibold underline-offset-4 hover:underline"
          style={{ color: TERRA }}
        >
          Бүх цэсийг үзэх →
        </button>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border" style={{ borderColor: SAGE_BORDER }}>
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
              style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}
            >
              <button
                type="button"
                onClick={() => navigate('/demo/urgo/menu')}
                className="relative block aspect-[4/3] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
                aria-label={`${item.name} — цэсэнд шилжих`}
              >
                <Photo
                  src={item.imageUrl ?? FOOD.hero}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </button>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-semibold leading-snug" style={{ color: GREEN }}>
                  {item.name}
                </h3>
                <p className="urgo-ui mt-1 line-clamp-1 text-sm text-[#6B7562]">{item.description}</p>
                <div className="urgo-ui mt-auto flex items-center justify-between pt-3">
                  <span className="text-base font-bold" style={{ color: TERRA }}>
                    {fmtMNT(item.price)}
                  </span>
                  <Button
                    size="sm"
                    disabled={!item.available}
                    onClick={() => quickAdd(item)}
                    className="rounded-full text-white"
                    style={{ backgroundColor: item.available ? GREEN : undefined }}
                  >
                    Сагслах
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function AboutStrip() {
  return (
    <section className="w-full" style={{ backgroundColor: GREEN }}>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <div style={{ color: '#EDE8DC' }}>
          <Kicker light>БИДНИЙ ТУХАЙ</Kicker>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Гэр ахуйн амт, цэвэр орц</h2>
          <p className="urgo-ui mt-5 max-w-xl text-base leading-relaxed text-[#C9D6CB]">
            ӨРГӨӨ нь эмээ насыйн жорыг орчин үеийн гал тогоотой нийлүүлдэг гэр бүлийн ресторан.
            Махаа өдөр бүр шинээр авч, буузаа гараар дарж, цайгаа өглөө бүр шинээр чанадаг — энэ бол
            бидний гэрээ.
          </p>
          <ul className="urgo-ui mt-7 space-y-4">
            {[
              {
                icon: ChefHat,
                title: 'Гэр ахуйн амт',
                text: 'Жор бүр гэр бүлийнх — хэт нарийн биш, харин танил, дулаан амттай.',
              },
              {
                icon: Leaf,
                title: 'Цэвэр орц',
                text: 'Ногоог өдөр бүр захаас, махыг орон нутгийн нийлүүлэгчдээс авна.',
              },
              {
                icon: Bike,
                title: 'Халуунаар нь хүргэнэ',
                text: 'Чийгтэй боовнуудыг ууртай цагт нь баглааж, шууд гарт чинь хүргэнэ.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full"
                  style={{ backgroundColor: `${TERRA}33` }}
                >
                  <Icon className="h-[18px] w-[18px]" style={{ color: '#E8A287' }} />
                </span>
                <span>
                  <span className="block font-semibold text-white">{title}</span>
                  <span className="block text-sm text-[#C9D6CB]">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-md pb-6 pl-6">
          <Photo
            src={FOOD.about1}
            alt="Гараар бууз дарж буй"
            className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl"
          />
          <Photo
            src={FOOD.about2}
            alt="Амттангийн ширээ"
            className="absolute bottom-0 left-0 h-32 w-32 rounded-2xl object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

function DeliverySection() {
  const cards = [
    {
      icon: MapPin,
      title: 'Хүргэлтийн бүс',
      text: 'Улаанбаатар хотын дотоод бүс — БГД, СБД, ЧД, ХД, БЗД-ийн ихэнх хороо.',
    },
    {
      icon: Clock,
      title: 'Хугацаа',
      text: 'Дунджаар 45–60 минут. Цагаан сарын үед бага зэрэг уртаснаа урьдчилан мэдэгдэнэ.',
    },
    {
      icon: Wallet,
      title: 'Хүргэлтийн хөлс',
      text: '5,000₮. 50,000₮-аас дээш захиалгад хүргэлт үнэ төлбөргүй.',
    },
  ]
  return (
    <section id="delivery" className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="text-center">
        <Kicker>ХҮРГЭЛТ</Kicker>
        <h2 className="mt-2 text-3xl font-bold" style={{ color: GREEN }}>
          Таны хоол хаанаас ч халуун ирнэ
        </h2>
      </div>
      <div className="urgo-ui mt-8 grid gap-5 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border p-6 shadow-sm"
            style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-full"
              style={{ backgroundColor: `${TERRA}1A` }}
            >
              <Icon className="h-5 w-5" style={{ color: TERRA }} />
            </span>
            <h3 className="mt-4 font-semibold" style={{ color: GREEN }}>
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#6B7562]">{text}</p>
          </div>
        ))}
      </div>
      <p className="urgo-ui mt-4 text-center text-xs text-[#8A9179]">
        * Хугацаа, бүс, хөлсний мэдээлэл нь демо зорилгоор харуулсан жишээ утга юм.
      </p>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20">
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12"
        style={{ backgroundColor: GREEN }}
      >
        <div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-2 border-dashed"
          style={{ borderColor: `${TERRA}55` }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full"
          style={{ backgroundColor: `${TERRA}22` }}
          aria-hidden="true"
        />
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Өнөөдрийн оройн хоолоо одоо захиалаарай
        </h2>
        <p className="urgo-ui mx-auto mt-3 max-w-xl text-[#C9D6CB]">
          Хамгийн дуртай бууз, хорхогоо сагслаарай — гал тогоо бэлэн, хүргэгч зам дээрээ.
        </p>
        <Button
          size="lg"
          className="urgo-ui mt-7 rounded-full text-white"
          style={{ backgroundColor: TERRA }}
          onClick={() => navigate('/demo/urgo/menu')}
        >
          Цэс рүү очих
        </Button>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <Hero />
      <PopularSection />
      <AboutStrip />
      <DeliverySection />
      <CtaBanner />
    </>
  )
}
