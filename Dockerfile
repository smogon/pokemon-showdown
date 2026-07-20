FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=dev

COPY . .

RUN node --version
RUN npm run build

EXPOSE 8000

CMD ["node", "pokemon-showdown", "start", "--no-security"]
