FROM node:trixie-slim

WORKDIR /usr/src/supersocialmedia


COPY package.json ./
COPY package-lock.json ./
COPY src ./src
COPY public ./public
COPY policies ./policies
COPY prisma ./prisma


RUN npm install
RUN npx prisma generate


CMD ["npm","start"]
