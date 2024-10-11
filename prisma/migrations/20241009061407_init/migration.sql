/*
  Warnings:

  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(30) NOT NULL,
    MODIFY `gender` INTEGER NULL DEFAULT 0,
    MODIFY `language` VARCHAR(191) NULL DEFAULT 'zh_CN';
