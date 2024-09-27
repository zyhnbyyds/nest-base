/*
  Warnings:

  - The primary key for the `weixin_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `weixin_user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `open_id` on the `weixin_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `weixin_user` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `open_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`);
