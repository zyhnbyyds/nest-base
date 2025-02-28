FROM node:20.3.1
WORKDIR /app

COPY package.json ./
COPY pnpm*.yaml ./
COPY . .

RUN npm install -g pnpm && npm i pm2 -g && pnpm install

RUN pnpm db:init

RUN pnpm build:all

CMD ["sh", "-c", "sleep 15 && pm2-runtime start ecosystem.config.js"]

