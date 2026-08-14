# ---- Base: install dependencies ----
FROM node:20-alpine AS base
WORKDIR /app

# Install production and dev dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev 2>/dev/null || npm install --production

# ---- Production image ----
FROM node:20-alpine AS production
WORKDIR /app

# Copy installed dependencies
COPY --from=base /app/node_modules ./node_modules

# Copy source
COPY . .

# Environment defaults (can be overridden at runtime)
ENV PORT=4000
ENV WS_PORT=8080
ENV WS_PATH=/ws
ENV CORS_ORIGINS=*
EXPOSE 4000
EXPOSE 8080

CMD ["node", "index.js"]
