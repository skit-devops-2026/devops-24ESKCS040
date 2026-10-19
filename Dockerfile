# Multi-stage Docker build for Project ELARA
FROM node:20-alpine AS builder

WORKDIR /app

# Build User application
COPY User/package*.json ./User/
RUN cd User && npm ci
COPY User/ ./User/
RUN cd User && npm run build

# Build admin application
COPY admin/package*.json ./admin/
RUN cd admin && npm ci
COPY admin/ ./admin/
RUN cd admin && npm run build

# Production web server using lightweight Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built User and admin applications
COPY --from=builder /app/User/dist /usr/share/nginx/html
COPY --from=builder /app/admin/dist /usr/share/nginx/html/admin

# Copy custom Nginx configuration with /health and /metrics support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static health and metrics endpoints
COPY health /usr/share/nginx/html/health
COPY metrics /usr/share/nginx/html/metrics

EXPOSE 80

CMD [nginx, -g, daemon off;]
