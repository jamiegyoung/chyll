SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `spotify_info`
--

CREATE TABLE `spotify_info` (
  `user_id` varchar(128) NOT NULL,
  `access_token` varchar(512) NOT NULL,
  `refresh_token` varchar(512) NOT NULL,
  `playlist_id` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `spotify_info`
--
ALTER TABLE `spotify_info`
  ADD PRIMARY KEY (`user_id`);
