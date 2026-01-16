#FROM node:18-slim
#WORKDIR /usr/src/app
#COPY package*.json ./
#RUN npm install --only=production
#COPY . .
#EXPOSE 8080
#CMD [ "npm", "start" ]

# Stage 1: build
FROM node:25-alpine AS builder
WORKDIR /app
RUN npm install -g npm@11.7.0
COPY package*.json ./
RUN npm ci
COPY . .
# TS -> JS
RUN npx tsc

# Stage 2: run
FROM node:25-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g npm@11.7.0
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY links.json ./
COPY public ./public
USER node
EXPOSE 8080
CMD [ "node", "dist/index.js" ]