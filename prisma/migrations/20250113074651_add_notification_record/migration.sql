-- CreateTable
CREATE TABLE `notification` (
    `notification_id` VARCHAR(20) NOT NULL,
    `notification_type` ENUM('FOLLOW', 'LIKE', 'COMMENT', 'REPLY', 'AT', 'SYSTEM', 'MESSAGE', 'APPLY', 'APPLY_RESULT', 'REPORT', 'REPORT_RESULT') NOT NULL,
    `from_user_id` VARCHAR(20) NULL,
    `to_user_id` VARCHAR(20) NULL,
    `title` VARCHAR(20) NOT NULL,
    `content` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
