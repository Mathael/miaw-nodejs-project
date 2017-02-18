

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";



CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `question` varchar(250) DEFAULT NULL,
  `multiple` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

