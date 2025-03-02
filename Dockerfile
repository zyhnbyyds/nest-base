# ---------- 第一阶段：构建阶段 ----------
FROM node:20.18.3 AS builder

WORKDIR /cache

# 1. 复制包管理文件和 Prisma Schema
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# 2. 安装 pnpm 并构建依赖（包括开发依赖）
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# 4. 复制源码并构建
COPY . .
RUN pnpm dlx prisma generate && pnpm build:all

# ---------- 第二阶段：生产镜像 ----------
FROM builder as prod

WORKDIR /app

ENV NODE_ENV=prod

RUN npm install -g pnpm

# 3. 从构建阶段复制产物
COPY --from=builder /cache/dist ./dist
COPY --from=builder /cache/node_modules ./node_modules
COPY --from=builder /cache/.env.prod ./

# 4. 安装 PM2 并复制配置文件
RUN npm install -g pm2
COPY ecosystem.config.js ./

EXPOSE 3000
EXPOSE 3001
EXPOSE 3004
EXPOSE 3005
EXPOSE 3006
EXPOSE 3100

# 5. 容器启动时执行数据库迁移并启动应用
CMD ["sh", "-c", "pm2-runtime start ecosystem.config.js"]
