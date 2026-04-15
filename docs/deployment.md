# Deployment

## Überblick

Die App wird als **Docker-Container** ausgeliefert. Ein Multi-Stage-Dockerfile baut die Anwendung und serviert sie über **Nginx**.

---

## Docker Build (Multi-Stage)

**Datei:** `Dockerfile`

### Stage 1: Build

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build-only
```

- **Base Image:** `node:20-alpine` (kleines Image)
- **Dependencies:** `npm ci` für reproduzierbare Builds
- **Build-Argument:** `VITE_API_BASE_URL` kann zur Build-Zeit gesetzt werden (Default: `/api`)
- **Output:** Statische Dateien in `/app/dist`

### Stage 2: Serve

```dockerfile
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- **Base Image:** `nginx:alpine`
- **Statische Dateien:** Kopiert aus der Build-Stage
- **Nginx-Config:** Custom-Konfiguration für SPA-Routing
- **Port:** 80

### Build-Befehl

```bash
# Standard-Build (VITE_API_BASE_URL=/api)
docker build -t nom-nom-now-frontend .

# Mit custom API-URL
docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t nom-nom-now-frontend .
```

---

## Nginx-Konfiguration

**Datei:** `nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA-Fallback: Alle Routen auf index.html umleiten
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static Asset Caching: 1 Jahr mit immutable
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Wichtige Aspekte:**

- **SPA-Routing:** `try_files $uri $uri/ /index.html` sorgt dafür, dass alle clientseitigen Routen funktionieren
- **Asset-Caching:** Statische Assets werden 1 Jahr im Browser gecacht. Vite generiert gehashte Dateinamen, sodass Cache-Busting automatisch erfolgt.

---

## Docker Compose

**Datei:** `compose.yaml`

```yaml
services:
  frontend:
    image: ghcr.io/nom-nom-now/nom-nom-now-frontend:latest
    container_name: nomnomnow-frontend
    restart: unless-stopped
    networks:
      - web

networks:
  web:
    external: true
```

### Details

- **Image:** Wird aus der GitHub Container Registry (GHCR) gezogen
- **Netzwerk:** Nutzt ein externes `web`-Netzwerk (typischerweise mit einem Reverse-Proxy wie Traefik verbunden)
- **Restart-Policy:** `unless-stopped` – Container startet nach Reboot neu, außer er wurde manuell gestoppt

### Verwendung

```bash
# Container starten
docker compose up -d

# Logs anzeigen
docker compose logs -f frontend

# Container stoppen
docker compose down
```

---

## CI/CD

Das Docker-Image wird automatisch gebaut und in die GitHub Container Registry (GHCR) gepusht:

```
ghcr.io/nom-nom-now/nom-nom-now-frontend:latest
```

### Empfohlener CI-Workflow

1. **Lint & Test:** `npm run lint` + `npm run test:unit`
2. **Type-Check:** `npm run type-check`
3. **Build:** `npm run build`
4. **Docker Build:** `docker build -t ghcr.io/nom-nom-now/nom-nom-now-frontend:latest .`
5. **Push:** `docker push ghcr.io/nom-nom-now/nom-nom-now-frontend:latest`

---

## Lokales Testen mit Docker

```bash
# Image bauen
docker build -t nom-nom-now-frontend .

# Container starten
docker run -p 3000:80 nom-nom-now-frontend

# App aufrufen
open http://localhost:3000
```
