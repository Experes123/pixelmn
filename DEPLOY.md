# Pixelmn — Деплой хийх заавар

Энэ төсөл нь **Next.js 16 (App Router) + Prisma + SQLite** дээр ажилладаг нэг апп бөгөөд
дотор нь үндсэн сайт, **/admin** хамгаалагдсан админ панель, мөн 6 демо вэбсайт
(`/#/demo/<id>` hash route-ууд) багтсан.

> **Netlify дээр deploy хийх бол §4-ийг уншина уу** — serverless орчинд SQLite
> файл хадгалагдахгүй тул Turso (libSQL) cloud DB ашиглана.

---

## 1. Байршуулахын өмнө заавал хийх 3 зүйл

| # | Юу | Хэрхэн |
|---|-----|--------|
| 1 | **Админ нууц үгийг солих** | `project/.env` дэх `ADMIN_PASSWORD`-ийг шинэ, хүчтэй нууц үгээр солино. |
| 2 | **Сессийн секретийг солих** | Доорх командаар шинэ утга үүсгээд `ADMIN_SECRET`-д тавина (32+ тэмдэгт). |
| 3 | **DATABASE_URL-ийг absolute болгох** | Docker/VPS дээр `file:/app/db/custom.db` гэх мэт **бүтэн зам** ашиглана. Netlify дээр энэ алхам шаардлагагүй — Turso cloud DB (§4). |

```bash
# Шинэ ADMIN_SECRET үүсгэх (Windows PowerShell / cmd / bash — бүгд ажиллана)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ `ADMIN_SECRET` солиход бүх хуучин админ сесс автоматаар хүчингүй болно.
> `.env` файлыг хэзээ ч нийтэд (git, чат) үлдээхгүй — зөвхөн сервер дээр байрлуулна.

---

## 2. Локал дээр ажиллуулах

```bash
cd project
bun install            # эсвэл: npm install
bunx prisma generate
bunx prisma db push    # schema-г db/custom.db руу түлхэх
bun run dev            # http://localhost:3000
```

## 3. Production build & эхлүүлэх

```bash
bun run build          # next build + standalone руу static/public хуулна
bun run start          # node .next/standalone/server.js  (default PORT=3000)
```

Порт солих бол: `PORT=8080 node .next/standalone/server.js` (Windows: `$env:PORT=8080; node ...`).

Сервер дээр **Node.js 20+** шаардана.

Апп амжилттай ажиллаж байгааг шалгах: `http://<host>:3000/api/health` → `{"ok":true}` буцаана.

---

## 4. Netlify + Turso (cloud DB) — санал болгож буй

### Яагаад Turso вэ?

Netlify Functions-ийн файлын систем **түр зуурын** — `db/custom.db` файл
хадгалагдахгүй, функцийн instance солигдоход өгөгдөл алга болно. Тиймээс
Netlify дээр өгөгдлийг **Turso (libSQL)** cloud DB-д хадгална. Схем нь SQLite
хэвээр, Prisma-гийн дуудалт өөрчлөгдөхгүй — зөвхөн холболтын адаптер л өөр.

### 1) Turso DB үүсгэх

1. https://app.turso.tech → бүртгүүлэх/нэвтрэх → **Create Database**
2. Нэр: `pixelmn`; бүс: `aws-ap-northeast-1` (Tokyo) эсвэл хамгийн ойр
3. DB-ийн **URL**-ийг хуулна: `libsql://pixelmn-<org>.turso.io`
4. **Create Token** → токеныг хуулна (нэг л удаа харагдана)

### 2) Локал `.env`-д нэмэх

```env
TURSO_DATABASE_URL="libsql://pixelmn-<org>.turso.io"
TURSO_AUTH_TOKEN="<token>"
```

### 3) Өгөгдлийг Turso руу хуулах

```bash
bun run db:turso
```

Локал `db/custom.db`-ийн бүх хүснэгт (үндсэн сайт + 6 демо, ~124 мөр)
Turso руу хуулагдана. Дахин seed хийх бол `bun run db:turso -- --force`
(⚠️ Turso дээрх одоогийн өгөгдлийг устгана).

### 4) GitHub дээр тавих

```bash
git init -b main
git add .
git commit -m "Pixelmn"
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

`.env` нь `.gitignore`-д байгаа тул GitHub руу гарахгүй.

### 5) Netlify дээр import

1. https://app.netlify.com → **Add new site → Import an existing project**
2. GitHub → repo-гоо сонгоно
3. Build command/publish нь `netlify.toml`-оос автоматаар ирнэ
   (`npm run build:netlify`, publish `.next`)
4. **Site configuration → Environment variables** — заавал нэмнэ:

   | Хувьсагч | Утга |
   |---|---|
   | `TURSO_DATABASE_URL` | Turso DB-ийн `libsql://...` URL |
   | `TURSO_AUTH_TOKEN` | Turso token |
   | `ADMIN_PASSWORD` | **Шинэ**, хүчтэй нууц үг (локал `.env`-ээс ялгаатай) |
   | `ADMIN_SECRET` | 64 hex — доорх командаар үүсгэнэ |

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy site**

### 6) Шалгах

- `https://<site>.netlify.app/api/health` → `{"ok":true}`
- `https://<site>.netlify.app/admin` → нэвтрэх → контент хадгалах
- Хуудсыг refresh хийхэд өөрчлөлт **хадгалагдсан** байх ёстой
- Формоор хүсэлт илгээж, админ панелд харагдахыг шалгана

> ⚠️ Netlify-ийн `ADMIN_PASSWORD`/`ADMIN_SECRET` нь локал `.env`-ээс
> **заавал ялгаатай** байх ёстой. `.env` deploy-д орохгүй.

#### Алдаа гарвал (troubleshooting)

| Шинж тэмдэг | Шалтгаан / Шийдэл |
|---|---|
| Build `bun install` дээр унана | Repo-д `bun.lock` байгаа тул Netlify Bun-аар суулгаж байна. `git rm --cached bun.lock` хийгээд, `npm install --package-lock-only` ажиллуулж `package-lock.json`-ыг commit хийнэ. |
| `/api/health` → `{"ok":false}` | `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` буруу эсвэл токен хүчингүй. Turso dashboard-оос шалгаад дахин оруулна. |
| `/admin` дээр нэвтэрч чадахгүй | `ADMIN_PASSWORD` env зөв эсэх; deploy дараа env сольсон бол **Deploys → Trigger deploy** хийнэ. |
| Хуудас ачаалагдаж байгаа ч өгөгдөл хоосон | `bun run db:turso` ажиллуулаагүй байна — Turso DB хоосон байна. |

---

## 5. Docker

Repo дотор бэлэн **`Dockerfile`**, **`.dockerignore`**, **`docker-compose.yml`** байна.

### Арга 1 — docker compose (санал болгож буй)

1. Төслийн хавтсанд `.env` файл байх ёстой (дотор нь `ADMIN_PASSWORD`, `ADMIN_SECRET` — утгуудыг заавал солино).
2. Ажиллуулах:
   ```bash
   docker compose up -d --build
   ```
3. Шалгах: `http://localhost:3000/api/health` → `{"ok":true}` гэж хариулах ёстой.

### Арга 2 — энгийн docker

```bash
docker build -t pixelmn .
docker run -d -p 3000:3000 \
  -e ADMIN_PASSWORD='<шинэ нууц үг>' \
  -e ADMIN_SECRET='<шинэ секрет>' \
  -e DATABASE_URL='file:/app/db/custom.db' \
  -v pixelmn-db:/app/db \
  --name pixelmn pixelmn
```

Тэмдэглэл:

- `db/custom.db` (seed өгөгдөл) нь image дотор багтсан бөгөөд volume анх үүсэхэд тийшээ хуулагдана.
- `.dockerignore` нь `.env`-ийг build context-оос хасдаг тул **секрет image дотор орохгүй** — env хувьсагчдыг runtime дээр өгнө.
- Image дотор `HEALTHCHECK` тохируулсан — `/api/health` ажиллахгүй бол container unhealthy гэж тэмдэглэгдэнэ.
- Docker-ыг энэ хөгжүүлэлтийн машин дээр туршаагүй (Docker суулгаагүй) — сервер дээр `docker compose up -d --build` хийгээд `/api/health`-ээр баталгаажуулна уу.

---

## 6. Урвуу прокси (nginx) — HTTPS

```nginx
server {
    listen 443 ssl;
    server_name pixelmn.mn;

    ssl_certificate     /etc/letsencrypt/live/pixelmn.mn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pixelmn.mn/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

HTTPS-ийг заавал асаана (Let's Encrypt г.м.) — админ сесс cookie нь
`secure` флагтай тул HTTP дээр ажиллахгүй.

---

## 7. Аюулгүй байдлын загвар (товч)

- `/admin` хуудас **сервер талд** cookie шалгана. Нэвтрэх нууц үг зөв бол
  зөвхөн httpOnly + sameSite=strict (production дээр secure) **12 цагийн**
  HMAC-гаар гарын үсэглэсэн сесс cookie тогтооно.
- **Бичих бүх API** (POST/PATCH/DELETE) админ сесс шаардана. Үл хамаарах
  зүйлс (нийтийн зочны урсгал хэвээр ажиллана):
  - маягт/захиалга **үүсгэх** POST (`inquiries`, `barber-bookings`, `pc-bookings`,
    `restaurant-orders`, `company-inquiries`, `stream-subs`, `shop-orders`);
  - төлбөрийн төлөв (`paymentStatus`), захиалга **цуцлах** (`status = 'цуцлагдсан'`);
  - үзсэн тоолуур (`stream-titles.meta`: views/watchSeconds — зөвхөн нэмэгдэнэ).
- Нэвтрэх оролдлого **IP тус бүр 10 минутад 6 удаа** хязгаарлагдана.
- `/admin` нь `noindex, nofollow` — хайлтын системд орохгүй.
- Security headers (бүх хуудсанд): `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- `poweredByHeader: false` — Next.js хувилбар задруулахгүй.

## 8. Нөөцлөлт

Netlify + Turso ашиглаж байгаа бол өгөгдөл Turso дээр байна — Turso dashboard
→ **Backups** (эсвэл `turso db dump`) ашиглана. Доорх нь Docker/VPS дээрх
SQLite файлын нөөцлөлт:

```bash
# Бүх өгөгдөл нэг SQLite файлд
copy db\custom.db backups\custom-%date%.db        # Windows
cp db/custom.db backups/custom-$(date +%F).db     # Linux
```

## 9. Админ хэрэглээ

| Хаана | Юу засварлаж болох вэ |
|-------|------------------------|
| `/admin` → **Ерөнхий** | Нүүр гарчиг, товч, холбоо барих, хөл хэсэг, сошиал холбоос |
| `/admin` → **Үйлчилгээ / Давуу тал / Ажлын урсгал / ТҮА / Хамтын ажиллагаа** | Хэсэг бүрийн бүх текст, жагсаалт (нэмэх/устгах) |
| `/admin` → **Үнийн санал** | Багцын нэр, үнэ, тайлбар, багтсан зүйлс |
| `/admin` → **Хүсэлтүүд** | Ирсэн хүсэлтүүд: төлөв солих, устгах, CSV татах |
| `/#/demo/<id>/admin` | Демо сайтуудын өөрсдийн админ панелууд (ижил сессээр ажиллана) |

Контентын өөрчлөлт хадгалагдмагц нийтийн сайтад шууд харагдана —
дахин deploy хийх шаардлагагүй.
