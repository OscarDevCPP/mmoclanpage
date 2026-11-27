FROM docker.io/library/node:22.23.4-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY angular.json tsconfig.json tsconfig.app.json ./
COPY .docker/nginx/watch.mjs ./
CMD ["node", "watch.mjs"]

FROM docker.io/library/nginx:stable-alpine AS nginx
COPY .docker/nginx/default.conf /etc/nginx/conf.d/default.conf
