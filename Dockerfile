# --- build stage ---
FROM node:20-slim AS build
WORKDIR /app

# Install OS deps if needed (uncomment if your plugins require images/fonts, etc.)
# RUN apt-get update && apt-get install -y build-essential python3 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm i --include=optional

COPY . .
# Ensure production build assets are generated
RUN npm run build

# --- runtime stage ---
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
# Prefer IPv4 to avoid IPv6-only DNS hiccups
ENV NODE_OPTIONS=--dns-result-order=ipv4first

# Copy only what’s necessary to run
COPY --from=build /app ./

# Keep containers small
RUN npm prune --omit=dev

# Cloud Run will send traffic to PORT
EXPOSE 8080
CMD ["npm", "start"]
