# syntax=docker/dockerfile:1.7

# === Build stage ===
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig*.json ./
COPY public ./public
COPY src ./src
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build-only

# === Serve stage ===
FROM nginx:alpine
RUN apk add --no-cache libcap \
    && setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx \
    && touch /run/nginx.pid \
    && chown -R nginx:nginx /run/nginx.pid /var/cache/nginx /var/log/nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R a-w /usr/share/nginx/html /etc/nginx/conf.d
USER nginx
EXPOSE 80
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
