# syntax=docker/dockerfile:1
FROM node:18-alpine3.14
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

CMD ["node", "index.js"]