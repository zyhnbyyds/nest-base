/*
  Warnings:

  - You are about to drop the column `register_time` on the `register_user` table. All the data in the column will be lost.
  - Made the column `created_at` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `register_user` DROP COLUMN `register_time`,
    ADD COLUMN `created_at` TIME NOT NULL DEFAULT NOW(),
    ADD COLUMN `updated_at` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `user` MODIFY `created_at` TIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW();
