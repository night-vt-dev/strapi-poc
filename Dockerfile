FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY . .
RUN npm run build
ENV PORT=8080 HOST=0.0.0.0 NODE_ENV=production
EXPOSE 8080
CMD ["npm","run","start"]
