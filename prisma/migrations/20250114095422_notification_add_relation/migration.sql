/*
  Warnings:

  - Made the column `from_user_id` on table `notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `to_user_id` on table `notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `notification` MODIFY `from_user_id` VARCHAR(20) NOT NULL,
    MODIFY `to_user_id` VARCHAR(20) NOT NULL;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
