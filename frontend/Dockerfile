ARG NODE_VERSION=24.12.0-alpine
ARG NGINX_VERSION=alpine3.22

#Stage 1: Build React app
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . . 
RUN npm run build

#Stage 2: Serve React app
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]