-- CreateTable
CREATE TABLE `deepseek_every_news` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `deepseek_every_news_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_user` (
    `_id` VARCHAR(191) NOT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,
    `lastActiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_group` (
    `_id` VARCHAR(191) NOT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `group_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `master_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_message` (
    `id` VARCHAR(20) NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,
    `from_user_id` VARCHAR(191) NOT NULL,
    `to_user_id` VARCHAR(191) NULL,
    `to_group_id` VARCHAR(191) NULL,
    `content` VARCHAR(191) NOT NULL,
    `type` INTEGER NULL DEFAULT 0,
    `status` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `im_message_message_id_key`(`message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_user_friend` (
    `_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `friend_id` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_friend_apply` (
    `_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `friend_id` VARCHAR(191) NOT NULL,
    `nick_name` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `status` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expireAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,
    `isExpired` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(20) NOT NULL,
    `open_id` VARCHAR(20) NOT NULL,
    `nickname` VARCHAR(20) NOT NULL,
    `user_name` VARCHAR(20) NOT NULL,
    `avatar_url` VARCHAR(100) NOT NULL,
    `gender` CHAR(6) NOT NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'zh_CN',
    `province` VARCHAR(10) NULL,
    `country` VARCHAR(10) NULL,
    `phone_number` VARCHAR(32) NOT NULL,
    `last_login_time` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_delete` BOOLEAN NULL DEFAULT false,
    `email` VARCHAR(20) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `time_zone` VARCHAR(191) NULL,

    UNIQUE INDEX `user_open_id_key`(`open_id`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `register_user` (
    `user_id` VARCHAR(191) NOT NULL,
    `is_delete` BOOLEAN NULL DEFAULT false,
    `status` INTEGER NULL DEFAULT 0,
    `email` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `register_user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `notification_id` VARCHAR(20) NOT NULL,
    `notification_type` ENUM('FOLLOW', 'LIKE', 'COMMENT', 'REPLY', 'AT', 'SYSTEM', 'MESSAGE', 'APPLY', 'APPLY_RESULT', 'REPORT', 'REPORT_RESULT') NOT NULL,
    `from_user_id` VARCHAR(20) NOT NULL,
    `to_user_id` VARCHAR(20) NOT NULL,
    `title` VARCHAR(20) NOT NULL,
    `content` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NULL DEFAULT false,
    `is_read` BOOLEAN NULL DEFAULT false,
    `is_system` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
