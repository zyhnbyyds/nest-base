/*
  Warnings:

  - You are about to drop the `weixin_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `weixin_user`;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(191) NOT NULL,
    `open_id` VARCHAR(191) NOT NULL,
    `union_id` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `avatar_url` VARCHAR(191) NULL,
    `gender` INTEGER NOT NULL DEFAULT 0,
    `language` VARCHAR(191) NOT NULL DEFAULT 'zh_CN',
    `city` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `last_login_time` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NULL,

    UNIQUE INDEX `user_open_id_key`(`open_id`),
    INDEX `union_id_index`(`union_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
