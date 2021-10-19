CREATE TABLE `users` (
  `username` varchar(30) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `email` varchar(320) NOT NULL,
  `liked_post_ids` json DEFAULT NULL,
  `liked_comment_ids` json DEFAULT NULL,
  `confirmed` int NOT NULL,
  `role` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`username`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `post_username` varchar(30) NOT NULL,
  `post_content` varchar(300) NOT NULL,
  `post_date` varchar(200) NOT NULL,
  `post_likes` int NOT NULL DEFAULT (0),
  `comment_count` int DEFAULT '0',
  `post_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `post_username` (`post_username`),
  CONSTRAINT `POSTS_ibfk_1` FOREIGN KEY (`post_username`) REFERENCES `users` (`username`) ON DELETE CASCADE
);

CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_post_id` int NOT NULL,
  `comment_username` varchar(30) NOT NULL,
  `comment_content` varchar(300) NOT NULL,
  `comment_date` datetime NOT NULL,
  `comment_likes` int NOT NULL DEFAULT (0),
  PRIMARY KEY (`comment_id`),
  KEY `comment_username` (`comment_username`),
  KEY `comment_post_id` (`comment_post_id`),
  CONSTRAINT `COMMENTS_ibfk_1` FOREIGN KEY (`comment_username`) REFERENCES `users` (`username`) ON DELETE CASCADE,
  CONSTRAINT `COMMENTS_ibfk_2` FOREIGN KEY (`comment_post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
);
