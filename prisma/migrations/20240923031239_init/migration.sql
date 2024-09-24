-- CreateTable
CREATE TABLE `weixin_user` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
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
    `subscribe_status` BOOLEAN NOT NULL DEFAULT false,
    `subscribe_time` DATETIME(3) NULL,
    `unsubscribe_time` DATETIME(3) NULL,
    `last_login_time` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `weixin_user_open_id_key`(`open_id`),
    INDEX `union_id_index`(`union_id`),
    INDEX `subscribe_status_index`(`subscribe_status`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
