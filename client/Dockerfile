FROM node:lts-alpine AS base
WORKDIR /app

RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./

FROM base AS prod-deps
RUN npm ci --omit=dev

FROM base AS build-deps
RUN npm ci

FROM build-deps AS build
COPY --chown=node:node . .
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
RUN npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]