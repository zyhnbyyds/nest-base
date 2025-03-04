# ---------- 第一阶段：构建阶段 ----------
ARG IMAGE_REGISTRY=docker.io
ARG IMAGE_NAMESPACE=library/
ARG NODE_VERSION=22.0.0
FROM ${IMAGE_REGISTRY}/${IMAGE_NAMESPACE}/node:${NODE_VERSION}

WORKDIR /app

COPY . .
COPY /env/.env.prod .

RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

RUN pnpm dlx prisma generate && pnpm build:all

RUN npm install -g pm2
COPY ecosystem.config.js ./

EXPOSE 3000
EXPOSE 3001
EXPOSE 3004
EXPOSE 3005
EXPOSE 3006
EXPOSE 3100

CMD ["sh", "-c", "pm2-runtime start ecosystem.config.js"]
