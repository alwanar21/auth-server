-- CreateTable
CREATE TABLE `users` (
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `username` VARCHAR(100) NOT NULL,
    `firstName` VARCHAR(50) NULL,
    `lastName` VARCHAR(50) NULL,
    `birthDate` DATETIME(3) NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `profiles_email_key`(`email`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
