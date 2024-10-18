-- CreateTable
CREATE TABLE `im_user` (
    `user_id` VARCHAR(191) NOT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_group` (
    `group_id` VARCHAR(191) NOT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_group_member` (
    `group_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`group_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `im_message` (
    `message_id` VARCHAR(191) NOT NULL,
    `from_user_id` VARCHAR(191) NOT NULL,
    `to_user_id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `type` INTEGER NULL DEFAULT 0,
    `status` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`message_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
