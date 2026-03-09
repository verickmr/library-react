FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json turbo.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/types/package*.json ./packages/types/
COPY packages/db/package*.json ./packages/db/
COPY packages/services/package*.json ./packages/services/
COPY packages/ui/package*.json ./packages/ui/

RUN npm install

COPY . .

RUN cd apps/web && npx vite build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80