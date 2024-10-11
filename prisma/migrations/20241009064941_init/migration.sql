/*
  Warnings:

  - Made the column `nickname` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar_url` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `language` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `nickname` VARCHAR(191) NOT NULL,
    MODIFY `avatar_url` VARCHAR(191) NOT NULL,
    MODIFY `gender` INTEGER NOT NULL DEFAULT 0,
    MODIFY `language` VARCHAR(191) NOT NULL DEFAULT 'zh_CN',
    MODIFY `phone_number` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `register_user` (
    `user_id` VARCHAR(191) NOT NULL,
    `register_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_delete` BOOLEAN NULL DEFAULT false,
    `status` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
