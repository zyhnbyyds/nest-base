/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `user_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `open_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `nickname` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `avatar_url` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `province` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `country` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `phone_number` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(32)`.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `city`,
    MODIFY `user_id` VARCHAR(20) NOT NULL,
    MODIFY `open_id` VARCHAR(20) NOT NULL,
    MODIFY `nickname` VARCHAR(20) NOT NULL,
    MODIFY `avatar_url` VARCHAR(100) NOT NULL,
    MODIFY `gender` CHAR(6) NOT NULL,
    MODIFY `province` VARCHAR(10) NULL,
    MODIFY `country` VARCHAR(10) NULL,
    MODIFY `phone_number` VARCHAR(32) NOT NULL,
    MODIFY `password` VARCHAR(60) NOT NULL,
    ADD PRIMARY KEY (`user_id`);
