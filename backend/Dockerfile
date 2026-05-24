FROM composer:2.8 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM php:8.2-fpm-alpine

RUN apk add --no-cache nginx libpq-dev libzip-dev zip unzip curl supervisor \
    && docker-php-ext-install pdo pdo_pgsql zip opcache

RUN printf '[supervisord]\nnodaemon=true\n\n[program:php-fpm]\ncommand=php-fpm -F\n\n[program:nginx]\ncommand=nginx -g "daemon off;"\n' > /etc/supervisord.conf

RUN printf 'server {\n    listen 80;\n    root /var/www/html/public;\n    index index.php;\n    location / { try_files $uri $uri/ /index.php?$query_string; }\n    location ~ \\.php$ {\n        fastcgi_pass 127.0.0.1:9000;\n        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;\n        include fastcgi_params;\n    }\n}\n' > /etc/nginx/http.d/default.conf

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --from=assets --chown=www-data:www-data /app/public/build ./public/build

RUN rm -f bootstrap/cache/*.php

RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

CMD ["sh", "-c", "php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan storage:link --force && exec supervisord -c /etc/supervisord.conf"]
