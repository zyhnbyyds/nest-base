/*
  Warnings:

  - The primary key for the `weixin_user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `weixin_user` DROP PRIMARY KEY,
    MODIFY `user_id` BIGINT NOT NULL,
    MODIFY `open_id` BIGINT NOT NULL,
    ADD PRIMARY KEY (`user_id`);
