FROM node:22-alpine AS builder

ARG VITE_BASE_API_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN if [ -n "$VITE_BASE_API_URL" ]; then \
      echo "VITE_BASE_API_URL=$VITE_BASE_API_URL" > .env; \
    fi
RUN test -f .env || (echo "ERROR: .env missing and VITE_BASE_API_URL build arg not provided" && exit 1)
RUN grep -q '^VITE_BASE_API_URL=' .env || (echo "ERROR: VITE_BASE_API_URL missing in .env" && exit 1)
RUN npx expo export --platform web

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN printf 'server {\n    listen 80;\n    root /usr/share/nginx/html;\n    index index.html;\n    location / { try_files $uri $uri/ /index.html; }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
