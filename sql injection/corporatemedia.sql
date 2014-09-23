-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 22, 2014 at 04:28 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `macsmec`
--

-- --------------------------------------------------------

--
-- Table structure for table `corporatemedia`
--

CREATE TABLE IF NOT EXISTS `corporatepersonnel` (
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `corporateprojects` (
  `project` varchar(50) NOT NULL,
  `amount in dollars` int(30) NOT NULL,
  `headed` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `corporatemedia`
--

INSERT INTO `corporatepersonnel` (`username`, `password`) VALUES
('alex', 'amy123'),
('vishwanth', 'adr095'),
('amy', 'asnnam1ad2'),
('theon', '1943'),
('wasim', 'troyanarchy');


INSERT INTO `corporateprojects` (`project`, `amount in dollars`, `headed`) VALUES
('Superserum Project', '1000000000000', 'Thaddeus'),
('Obedience Circlet', '5800000000', 'Thaddeus'),
('Damage control', '1000000000000000', 'Thaddeus');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
