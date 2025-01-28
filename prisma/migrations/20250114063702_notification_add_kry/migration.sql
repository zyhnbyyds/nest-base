-- AlterTable
ALTER TABLE `notification` ADD COLUMN `is_read` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `is_system` BOOLEAN NULL DEFAULT false;
