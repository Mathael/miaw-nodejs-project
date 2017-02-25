CREATE TABLE IF NOT EXISTS `answer` (
  `id` int(11) NOT NULL,
  `text` varchar(200) DEFAULT NULL,
  `good` tinyint(1) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `answer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

ALTER TABLE `answer` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
