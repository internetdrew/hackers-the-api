FROM node:16-alpine

USER node

RUN mkdir /home/node/src

WORKDIR /home/node/src

RUN rm -rf node_modules build

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node . .

CMD ["npm", "run", "dev"]