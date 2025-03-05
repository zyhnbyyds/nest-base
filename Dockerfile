# ---------- 第一阶段：构建阶段 ----------
ARG IMAGE_REGISTRY=registry.cn-heyuan.aliyuncs.com
ARG IMAGE_NAMESPACE=centos7_zhang
ARG NODE_VERSION=22-alpine

# 使用更小的 Alpine 基础镜像
FROM ${IMAGE_REGISTRY}/${IMAGE_NAMESPACE}/node:${NODE_VERSION} AS builder

WORKDIR /app

# 仅复制必要的构建文件（优化构建缓存）
COPY . .

# 安装 pnpm 并构建依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# 生成 Prisma 客户端并构建项目
RUN pnpm prisma generate && pnpm build:all

# ---------- 第二阶段：运行阶段 ----------
FROM ${IMAGE_REGISTRY}/${IMAGE_NAMESPACE}/node:${NODE_VERSION}

WORKDIR /app

# 仅复制运行时必要文件（减少镜像体积）
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/env/.env* .
COPY --from=builder /app/ecosystem.config.js .
COPY --from=builder /app/package.json .
COPY --from=builder /app/.npmrc .

# 安装仅运行时依赖（生产环境）
RUN npm install -g pm2 && npm i pnpm -g


# 合并 EXPOSE 指令
EXPOSE 3000 3001 3004-3006 3100

# 启动应用
CMD ["sh", "-c", "pnpm db:deploy && pm2-runtime ecosystem.config.js"]
