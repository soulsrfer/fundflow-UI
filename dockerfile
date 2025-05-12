# ─── Stage 1: Build Angular App ─────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the Angular app using the correct configuration
RUN npm run build -- --configuration production

# ─── Stage 2: Serve using Nginx ─────────────────────────────────────────────
FROM nginx:stable-alpine

# Remove default Nginx website files
RUN rm -rf /usr/share/nginx/html/*

# Copy only the client/browser build (where index.csr.html lives)
COPY --from=build /app/dist/fundflow-ui/browser/. /usr/share/nginx/html/

# Rename the CSR entry-point to index.html so Nginx will serve it
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

# (Optional) Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 and run Nginx in the foreground
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
