CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL,
  `text` varchar(250) DEFAULT NULL,
  `ismultiple` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `question` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
