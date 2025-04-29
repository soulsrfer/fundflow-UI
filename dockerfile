# ─── Dockerfile (at your UI repo root) ─────────────────────────────────────────────

# Stage 1: install & build
FROM node:22-alpine AS build
WORKDIR /app

# copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy rest of the source, including tailwind/primes styles
COPY . .

# build for production (update <your-app-name> to match angular.json)
RUN npm run build -- --configuration production

# Stage 2: serve with nginx
FROM nginx:stable-alpine
# remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# copy built artifacts
COPY --from=build /app/dist/<your-app-name> /usr/share/nginx/html

# optional: use a custom nginx.conf if you need HTML5 push-state routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
