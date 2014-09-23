-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 22, 2014 at 08:34 PM
-- Server version: 5.6.14
-- PHP Version: 5.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hackmaster`
--

-- --------------------------------------------------------

--
-- Table structure for table `corporateledgers`
--

CREATE TABLE IF NOT EXISTS `corporateledgers` (
  `username` varchar(50) NOT NULL,
  `data` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `corporateledgers`
--

INSERT INTO `corporateledgers` (`username`, `data`) VALUES
('alex', '27d5482eebd075de44389774fce28c69f45c8a75'),
('theon', '9a78211436f6d425ec38f5c4e02270801f3524f8'),
('grey', '84a516841ba77a5b4648de2cd0dfcb30ea46dbb4'),
('joy', '13fbd79c3d390e5d6585a21e11ff5ec1970cff0c'),
('geoff', '8efd86fb78a56a5145ed7739dcb00c78581c5375'),
('jeff', 'd08f88df745fa7950b104e4a707a31cfce7b5841'),
('gold', '356a192b7913b04c54574d18c28d46e6395428ab'),
('walt', '3cdf2936da2fc556bfa533ab1eb59ce710ac80e5');

-- --------------------------------------------------------

--
-- Table structure for table `corporatepersonnel`
--

CREATE TABLE IF NOT EXISTS `corporatepersonnel` (
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `corporatepersonnel`
--

INSERT INTO `corporatepersonnel` (`username`, `password`) VALUES
('alex', 'amy123'),
('vishwanth', 'adr095'),
('amy', 'asnnam1ad2'),
('theon', '1943'),
('wasim', 'troyanarchy');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `name` varchar(30) NOT NULL,
  `project id` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`name`, `project id`) VALUES
('theon', '1123'),
('theon', '1324')
('alex', '4322'),
('alex', '1123'),
('alex', '5432'),
('vishwanth', '1324'),
('amy', '1123'),
('amy', '4322'),
('amy', '5432'),
('wasim', '1324'),
('wasim', '4322'),
('wasim', '5432');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
