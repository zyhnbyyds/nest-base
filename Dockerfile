FROM node:20.3.1
WORKDIR /app

COPY package.json ./
COPY pnpm*.yaml ./
COPY . .

RUN npm install -g pnpm && npm i pm2 -g && pnpm install

RUN pnpm db:init

RUN pnpm build:all

# 移除构建阶段的 db:init（应在容器启动时执行）
CMD ["sh", "-c", "pm2-runtime start ecosystem.config.js"]