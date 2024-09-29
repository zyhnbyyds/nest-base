-- CreateTable
CREATE TABLE `Log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `logLevel` VARCHAR(50) NOT NULL,
    `message` TEXT NOT NULL,
    `context` JSON NULL,
    `serviceName` VARCHAR(100) NOT NULL,
    `methodName` VARCHAR(100) NOT NULL,
    `requestId` VARCHAR(100) NULL,
    `traceId` VARCHAR(100) NULL,
    `spanId` VARCHAR(100) NULL,
    `parentSpanId` VARCHAR(100) NULL,
    `statusCode` INTEGER NULL,
    `errorStack` TEXT NULL,
    `hostName` VARCHAR(255) NULL,
    `ipAddress` VARCHAR(50) NULL,
    `userAgent` VARCHAR(255) NULL,
    `requestPath` VARCHAR(255) NULL,
    `executionTime` INTEGER NULL,
    `userId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
