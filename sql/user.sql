CREATE TABLE IF NOT EXISTS `user` (
  `id` char(36) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `roles` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `user` ADD PRIMARY KEY (`id`);
