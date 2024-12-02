-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(20) NOT NULL,
    `open_id` VARCHAR(20) NOT NULL,
    `nickname` VARCHAR(20) NOT NULL,
    `avatar_url` VARCHAR(100) NOT NULL,
    `gender` CHAR(6) NOT NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'zh_CN',
    `province` VARCHAR(10) NULL,
    `country` VARCHAR(10) NULL,
    `phone_number` VARCHAR(32) NOT NULL,
    `last_login_time` VARCHAR(191) NULL,
    `created_at` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NULL,
    `is_delete` BOOLEAN NULL DEFAULT false,
    `email` VARCHAR(20) NOT NULL,
    `password` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `user_open_id_key`(`open_id`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `register_user` (
    `user_id` VARCHAR(191) NOT NULL,
    `register_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_delete` BOOLEAN NULL DEFAULT false,
    `status` INTEGER NULL DEFAULT 0,
    `email` VARCHAR(20) NULL,

    UNIQUE INDEX `register_user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
