# Build stage
FROM node:20-alpine AS build
WORKDIR /home/node/src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:lts-alpine AS production
WORKDIR /home/node/app
COPY --from=build /home/node/src/dist ./dist
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["npm", "run", "start"]
