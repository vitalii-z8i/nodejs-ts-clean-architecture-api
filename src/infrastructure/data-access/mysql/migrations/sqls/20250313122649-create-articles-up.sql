CREATE TABLE `articles` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `isPublished` boolean NOT NULL DEFAULT 0,
    `title` varchar(255) NOT NULL,
    `description` varchar(255),
    `content` text NOT NULL,
    `authorID` int(11),
    PRIMARY KEY (`id`),
    INDEX `isPublished` (`isPublished`),
    FOREIGN KEY (`authorID`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
