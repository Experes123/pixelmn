# syntax=docker/dockerfile:1
#
# ───────────────── Pixelmn — production image ─────────────────
# Олон шатлалт build: хамаарал + build → зөвхөн standalone гаралтыг ажиллуулна.
# Ажиллуулах жишээ (docker-compose.yml-ийг үзнэ үү):
#   docker compose up -d --build

# ─────────────────────────── 1) Build шат ───────────────────────────
FROM node:22-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Prisma query engine болон sharp-д openssl шаардлагатай
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# Хамаарлыг эхлээд суулгана (кодын өөрчлөлтөд кэш хадгалагдана)
COPY package.json ./
RUN npm install

# Эх код + Prisma client + production build
# (npm run build нь scripts/postbuild.mjs-ээр static/public-ыг standalone руу хуулна)
COPY . .
RUN npx prisma generate && npm run build

# ────────────────────────── 2) Runtime шат ──────────────────────────
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# Standalone гаралт — server.js, node_modules, .next/static, public бүгд багтсан
COPY --from=build /app/.next/standalone ./
# SQLite өгөгдлийн сан (seed өгөгдөлтэй). Анх ажиллуулахад volume рүү хуулагдана.
COPY --from=build /app/db ./db

EXPOSE 3000

# Апп + DB ажиллаж байгаа эсэхийг /api/health-ээр шалгана
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
