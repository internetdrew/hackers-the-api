FROM node:lts-alpine AS base
WORKDIR /app

RUN chown node:node /app
USER node

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY --chown=node:node package.json package-lock.json ./

FROM base AS prod-deps
RUN npm ci --omit=dev

FROM base AS build-deps
RUN npm ci

FROM build-deps AS build
COPY --chown=node:node . .
ARG PUBLIC_BASE_URL
ENV PUBLIC_BASE_URL=${PUBLIC_BASE_URL}
RUN npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]