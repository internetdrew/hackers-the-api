# Build stage
FROM node:20-alpine AS build
USER node
RUN mkdir -p /home/node/src && chown node:node /home/node/src
WORKDIR /home/node/src
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run build 2>/dev/null || true

# Production stage
FROM node:20-alpine AS production
USER node
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
COPY --from=build --chown=node:node /home/node/src/dist ./dist
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start"]
