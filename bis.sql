-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 01, 2022 at 01:53 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bis`
--

-- --------------------------------------------------------

--
-- Table structure for table `barangay_bus_setup`
--

CREATE TABLE `barangay_bus_setup` (
  `ID` int(255) NOT NULL,
  `BUS_ID` varchar(255) NOT NULL,
  `BUS_NAME` varchar(255) NOT NULL,
  `IS_LEGAL_TO_OPERATE` tinyint(1) NOT NULL,
  `FIRST_OP_DATE` date NOT NULL,
  `BUS_EXP_DATE` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `barangay_emp_setup`
--

CREATE TABLE `barangay_emp_setup` (
  `ID` int(64) NOT NULL,
  `RESIDENT_ID` varchar(255) NOT NULL,
  `EMP_ID` varchar(255) NOT NULL,
  `USERNAME` varchar(255) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `POSITION` varchar(255) NOT NULL,
  `DESIGNATION` varchar(255) NOT NULL,
  `STATUS` varchar(255) NOT NULL,
  `IS_BRGY_CAPTAIN` int(11) NOT NULL,
  `BARANGAY_ID` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `barangay_emp_setup`
--

INSERT INTO `barangay_emp_setup` (`ID`, `RESIDENT_ID`, `EMP_ID`, `USERNAME`, `PASSWORD`, `POSITION`, `DESIGNATION`, `STATUS`, `IS_BRGY_CAPTAIN`, `BARANGAY_ID`) VALUES
(1, 'BRGY_BCD_01_RES_01', 'BRGY_BCD_01_EMP_01', 'ray', 'sales', 'secretary', 'System Administrator', 'Active', 0, 'BRGY_BCD_01'),
(2, 'BRGY_BCD_01_RES_02', 'BRGY_BCD_01_EMP_02', 'boy', 'pico', 'BARANGGAY CAPTAIN', 'Administrator', 'Active', 1, 'BRGY_BCD_01');

-- --------------------------------------------------------

--
-- Table structure for table `barangay_land_marks`
--

CREATE TABLE `barangay_land_marks` (
  `ID` int(64) NOT NULL,
  `FOREIGN_KEY` varchar(255) NOT NULL,
  `LAT` varchar(255) NOT NULL,
  `LNG` varchar(255) NOT NULL,
  `TYPE` varchar(255) NOT NULL,
  `ICON` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `barangay_prk_setup`
--

CREATE TABLE `barangay_prk_setup` (
  `ID` int(64) NOT NULL,
  `PRK_ID` varchar(255) NOT NULL,
  `PRK_NAME` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `barangay_res_setup`
--

CREATE TABLE `barangay_res_setup` (
  `ID` int(64) NOT NULL,
  `RESIDENT_ID` varchar(255) NOT NULL,
  `LASTNAME` varchar(255) NOT NULL,
  `FIRSTNAME` varchar(255) NOT NULL,
  `MIDDLENAME` varchar(255) NOT NULL,
  `IS_BRGY_EMP` tinyint(1) NOT NULL,
  `IS_FAMILY_LEADER` tinyint(1) NOT NULL,
  `ADDRESS` varchar(255) NOT NULL,
  `BARANGAY_ID` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `barangay_res_setup`
--

INSERT INTO `barangay_res_setup` (`ID`, `RESIDENT_ID`, `LASTNAME`, `FIRSTNAME`, `MIDDLENAME`, `IS_BRGY_EMP`, `IS_FAMILY_LEADER`, `ADDRESS`, `BARANGAY_ID`) VALUES
(1, 'BRGY_BCD_01_RES_01', 'SALES', 'RAY BERNARD', 'LOZADA', 1, 1, '', 'BRGY_BCD_01'),
(2, 'BRGY_BCD_01_RES_02', 'PICO', 'BOY', '', 1, 1, '', 'BRGY_BCD_01');

-- --------------------------------------------------------

--
-- Table structure for table `barangay_setup`
--

CREATE TABLE `barangay_setup` (
  `ID` int(255) NOT NULL,
  `BARANGAY_NAME` varchar(255) NOT NULL,
  `BARANGAY_ID` varchar(255) NOT NULL,
  `BARANGAY_LOGO` varchar(255) NOT NULL,
  `BARANGAY_CAPTAIN` int(11) NOT NULL,
  `BARANGAY_DIR` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `barangay_setup`
--

INSERT INTO `barangay_setup` (`ID`, `BARANGAY_NAME`, `BARANGAY_ID`, `BARANGAY_LOGO`, `BARANGAY_CAPTAIN`, `BARANGAY_DIR`) VALUES
(1, 'BARANGAY MANSILINGAN', 'BRGY_BCD_01', 'mansilingan_logo.jfif', 0, 'mansilingan_bcd');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barangay_bus_setup`
--
ALTER TABLE `barangay_bus_setup`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `barangay_emp_setup`
--
ALTER TABLE `barangay_emp_setup`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `barangay_land_marks`
--
ALTER TABLE `barangay_land_marks`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `barangay_res_setup`
--
ALTER TABLE `barangay_res_setup`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `barangay_setup`
--
ALTER TABLE `barangay_setup`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barangay_bus_setup`
--
ALTER TABLE `barangay_bus_setup`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `barangay_emp_setup`
--
ALTER TABLE `barangay_emp_setup`
  MODIFY `ID` int(64) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `barangay_land_marks`
--
ALTER TABLE `barangay_land_marks`
  MODIFY `ID` int(64) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `barangay_res_setup`
--
ALTER TABLE `barangay_res_setup`
  MODIFY `ID` int(64) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `barangay_setup`
--
ALTER TABLE `barangay_setup`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
