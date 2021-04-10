-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Win64 (AMD64)
--
-- Host: us-cdbr-east-03.cleardb.com    Database: heroku_2fd7018fa458a0f
-- ------------------------------------------------------
-- Server version	5.6.50-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apicount`
--

DROP TABLE IF EXISTS `apicount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apicount` (
  `apiID` int(11) NOT NULL AUTO_INCREMENT,
  `httpMethod` varchar(6) NOT NULL,
  `endpoint` varchar(50) NOT NULL,
  `requests` int(11) DEFAULT '0',
  PRIMARY KEY (`apiID`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apicount`
--

LOCK TABLES `apicount` WRITE;
/*!40000 ALTER TABLE `apicount` DISABLE KEYS */;
INSERT INTO `apicount` VALUES (4,'POST','/task',36),(14,'POST','/task/moveTasks',6),(24,'PUT','/task/{taskID}',48),(34,'DELETE','/task/{taskID}',14),(44,'PUT','/task/{taskID}/complete',8),(54,'GET','/user',209),(64,'POST','/taskList',8),(74,'GET','/taskList',614),(84,'DELETE','/taskList/{taskListID}',4),(94,'GET','/admin/stats',16);
/*!40000 ALTER TABLE `apicount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `taskID` int(11) NOT NULL AUTO_INCREMENT,
  `taskListID` int(11) NOT NULL,
  `taskName` varchar(100) NOT NULL,
  `taskDescription` varchar(255) NOT NULL,
  `isComplete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`taskID`),
  KEY `FK_taskListID` (`taskListID`),
  CONSTRAINT `FK_taskListID` FOREIGN KEY (`taskListID`) REFERENCES `tasklist` (`taskListID`)
) ENGINE=InnoDB AUTO_INCREMENT=464 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (154,294,'sunt exercitation culpa','magna commodo ad ea cupid',0),(164,294,'sunt exercitation culpa','magna commodo ad ea cupid',0),(174,284,'sunt exercitation culpa','magna commodo ad ea cupid',1),(184,294,'sunt exercitation culpa','magna commodo ad ea cupid',0),(194,334,'deserunt Ut ex Excepteur','velit tem',0),(234,334,'Run','Nvm',0),(434,364,'Not sure','123',1),(444,374,'Idk man','123',0),(454,374,'test push','123',0);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasklist`
--

DROP TABLE IF EXISTS `tasklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasklist` (
  `taskListID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`taskListID`),
  KEY `FK_userID` (`userID`),
  CONSTRAINT `FK_userID` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=394 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasklist`
--

LOCK TABLES `tasklist` WRITE;
/*!40000 ALTER TABLE `tasklist` DISABLE KEYS */;
INSERT INTO `tasklist` VALUES (284,274,'2021-04-09'),(294,274,'2021-04-10'),(304,294,'2021-04-09'),(314,294,'2021-04-09'),(334,294,'2021-04-11'),(354,294,'2021-04-10'),(364,304,'2021-04-10'),(374,304,'2021-04-11'),(384,304,'2021-04-11');
/*!40000 ALTER TABLE `tasklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `token` (
  `tokenID` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`tokenID`)
) ENGINE=InnoDB AUTO_INCREMENT=484 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (314,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI3NCwidXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJKb24iLCJpc0FkbWluIjoxLCJpYXQiOjE2MTgwMjgxMzV9.ONt_Sdq74nvifKKRweC5-4Wo7ryzkR1eoJHYrKVBOxs'),(324,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI4NCwidXNlcm5hbWUiOiJ1c2VyIiwibmFtZSI6IkpvbiIsImlzQWRtaW4iOjAsImlhdCI6MTYxODAzMDgyMn0.HjlSVG4bO6kO2V6yrpjGCc3i2SFTvTEuxi6_Ew7l1Q8'),(334,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MCwiaWF0IjoxNjE4MDUwOTczfQ.j_4Ki_XFdW9Cs5wiVZWprXGBKCXrqaF-M6fTrAlZ_M4'),(344,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MCwiaWF0IjoxNjE4MDUxMTE3fQ.St-kM1LIHFZ6O7oQmkyDsxF7BDOy2kt4h8s3hOcFpzA'),(354,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MCwiaWF0IjoxNjE4MDU0MzU1fQ.URPqM1NJxsJ-GUCyMyKl0VoCP_S9jlXs2vfyVNM7YNs'),(364,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MCwiaWF0IjoxNjE4MDU0NTQyfQ.huBkMO5-IruiARk4ho87_tmqljKLWFpWzkJMN2x3JA8'),(384,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MCwiaWF0IjoxNjE4MDYxOTk4fQ.sfrQTK1emqdg2OBtr2u9LwjKd5LLtpknPvUn266lFd4'),(394,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MSwiaWF0IjoxNjE4MDgyMDE5fQ.qyUB6RM-Vq7o1vMiTa65U-9UNMfM19USIvLjF68PVPY'),(404,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MSwiaWF0IjoxNjE4MDgzOTk1fQ.BwbBkCn3YQV02SGelFzoN_RLb1iOE4aJhnQh4ZHnHlY'),(474,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI5NCwidXNlcm5hbWUiOiJicmlhbmxpIiwibmFtZSI6IkJyaWFuIExpIiwiaXNBZG1pbiI6MSwiaWF0IjoxNjE4MDk3ODI2fQ.cPtkPkH2fb3NKYPCQQrXKYpqCgH0XgHmKV9BeyEc6Bc');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=334 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (274,'admin','$2b$10$8PG77.a/GCm9B8ewru1CmeU7q1ikMMlw3ftzwLKs9.mS8oLNraTk.','Jon',1),(284,'user','$2b$10$AKBYXVJAfUnreFdtdSkg4O4VL6B58xZUqrAVHzEJhvRPTITXMV6L6','Jon',0),(294,'brianli','$2b$10$jTlZ9DshOwBfyHqE83I9Le1HQaL.m6nTL5XrpVL4MOGvNvjPhMww.','Brian Li',1),(304,'brianli2','$2b$10$pisIxIym4jjAi9QOOTtxh.A0sSJbcP7hPFH0F4M4TPfM3cwZXCsrW','Brian Li',0),(314,'brianli3','$2b$10$TV3k.07S1AfCDz5f01rdAO8ZuwJHDzx4KeMFEelkP1H5r.oW8ZuCe','Brian Li',0),(324,'testyo','$2b$10$byRRQ3XsWyTCeX0D84HpTu356ygpkZ2Kbk2bsGAZmqQIkB076G20S','testing guy',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'heroku_2fd7018fa458a0f'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-10 16:39:17
