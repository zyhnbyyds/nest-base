/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `register_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `register_user` ADD COLUMN `email` VARCHAR(20) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `register_user_email_key` ON `register_user`(`email`);
