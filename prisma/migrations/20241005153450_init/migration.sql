/*
  Warnings:

  - You are about to drop the column `union_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `union_id_index` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `union_id`;

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);
