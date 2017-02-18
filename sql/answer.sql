CREATE TABLE IF NOT EXISTS `answer` (
  `id` int(11) NOT NULL,
  `answer` varchar(200) DEFAULT NULL,
  `good` tinyint(1) DEFAULT NULL,
  `id_question` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `answer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_question` (`id_question`);

ALTER TABLE `answer` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
