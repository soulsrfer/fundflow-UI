# ─── Stage 1: Build Angular SSR App ─────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:ssr

# ─── Stage 2: Run Angular SSR using Node ───────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Copy built browser + server bundles
COPY --from=build /app/dist/fundflow-ui /app/dist/fundflow-ui
COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev

# Use SSR entry point
CMD ["node", "dist/fundflow-ui/server/main.js"]

EXPOSE 4000
