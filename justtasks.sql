-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: justtasks
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `justtasks`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `justtasks` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `justtasks`;

--
-- Table structure for table `assignee_assignor`
--

DROP TABLE IF EXISTS `assignee_assignor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignee_assignor` (
  `assignee_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL,
  `complete` tinyint(1) DEFAULT NULL,
  KEY `assignee_id` (`assignee_id`),
  KEY `manager_id` (`manager_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `assignee_assignor_ibfk_1` FOREIGN KEY (`assignee_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `assignee_assignor_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `assignee_assignor_ibfk_3` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignee_assignor`
--

LOCK TABLES `assignee_assignor` WRITE;
/*!40000 ALTER TABLE `assignee_assignor` DISABLE KEYS */;
INSERT INTO `assignee_assignor` VALUES (1,15,1,0),(16,15,2,1),(2,15,3,0),(16,15,18,0),(16,15,20,1),(16,15,22,1),(2,15,42,0),(2,15,43,NULL);
/*!40000 ALTER TABLE `assignee_assignor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `user_id` int(11) DEFAULT NULL,
  `messages` varchar(150) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'man1 created a new task for you','2020-06-03 13:12:06',NULL),(16,'test created a new task \"fix bugs\"','2020-06-17 11:12:43',NULL),(16,'test edited task \"write proposal\"','2020-06-17 11:13:21',NULL);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `off_dates`
--

DROP TABLE IF EXISTS `off_dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `off_dates` (
  `user_id` int(11) DEFAULT NULL,
  `off_date` varchar(15) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `off_dates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `off_dates`
--

LOCK TABLES `off_dates` WRITE;
/*!40000 ALTER TABLE `off_dates` DISABLE KEYS */;
INSERT INTO `off_dates` VALUES (15,'2020-06-15'),(15,'2020-07-13'),(15,'2020-06-08'),(15,'2020-06-09'),(15,'2020-07-06'),(16,'2020-06-02');
/*!40000 ALTER TABLE `off_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_name` varchar(100) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `priority` varchar(20) DEFAULT NULL,
  `group_task` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (1,'write report','2020-10-01','just write report','Low',1),(2,'FINISH','2020-06-05','just create','High',0),(3,'create agenda','2020-06-05','collaborate with someone','Medium',0),(15,'test4','2020-01-01',NULL,'Low',NULL),(16,'er','2020-01-01',NULL,'Low',NULL),(17,'df','2020-01-01',NULL,'Low',NULL),(18,'LET ME FINISH THIS !','2020-01-01','we','Medium',NULL),(20,'JUST LET','2020-01-01','were','High',NULL),(22,'ME','2020-06-01','null','Low',NULL),(40,'test2','2020-01-01',NULL,'Low',NULL),(42,'we','2020-01-01',NULL,'Low',NULL),(43,'tea','2020-01-01',NULL,'Low',NULL);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email_address` varchar(255) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `profile_pic` varchar(200) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `isManager` tinyint(1) DEFAULT '0',
  `role` varchar(100) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `session` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'emp1@email.com','test','/images/pepelaugh.png','emp1',0,'business analyst',15,NULL),(2,'email@email.com','$argon2i$v=19$m=4096,t=3,p=1$qZDbC6VpLtkg8fJqQVpVPA$KS7YZeIg0Frf+GVS9ruOXVGA5LNfXQWY/bAOUr5U8yc','/images/pepelaugh.png','Pearlyna',1,NULL,15,NULL),(3,'man1@email.com','test','/images/pepelaugh.png','man1',1,NULL,NULL,NULL),(15,'emp@email.com','$argon2i$v=19$m=4096,t=3,p=1$otQBd4RJJBvYJL2LY+nLZg$F6NUPEeucwGGUy/NqCvFoUKbAUPRbmWz9ktSlzpuUaM','/images/pepelaugh.png','Manager-san!',1,'the Bosses',15,NULL),(16,'SOsad@email.com','$argon2i$v=19$m=4096,t=3,p=1$gVWapLKr7t5jMjm16f/jsQ$C1ROIOoG+rrtht/qxHemA+48J3XidyRSM2FdGxLRn98','/images/pepesadhug.png','employee-san',0,'worker1',15,NULL),(17,'l@email.com','$argon2i$v=19$m=4096,t=3,p=1$uLmFSV6VT8PzpM45n9VB6w$VS5ATMAeRf56SRDmDtkFyBxnzMYxZVYdr3VnGmVeSmQ','/images/default_user.JPG','Pearlyna',0,NULL,NULL,NULL),(18,'emai@email.com','$argon2i$v=19$m=4096,t=3,p=1$ttELEwpg/m/IWBMg3A7jBg$9LugHg9RC2LJucqom6yBNm6b7ue2kS/yVb+fYVVenWk','/images/default_user.JPG','Pearlyna ',0,NULL,NULL,NULL),(19,'we@email.com','$argon2i$v=19$m=4096,t=3,p=1$b9ZvHOYuAiPYRa9je0HuJQ$GyEmM6dvg2htck99oqEX8YdFosx+XMBpFRucJs78PKU','/images/default_user.JPG','wed',0,NULL,NULL,NULL),(20,'ww@email.com','$argon2i$v=19$m=4096,t=3,p=1$sRwm/F/SGdKKSuup5SLaqA$e+wc8/rSL9ZANNMDD/atz0szY9+mvg3LdXcghg2qnyo','/images/default_user.JPG','er',0,NULL,NULL,NULL),(21,'sad@email.com','$argon2i$v=19$m=4096,t=3,p=1$2RVtPFevwKDANHSLWLEqAw$AqXBdTDuH4KUpQUj1qJL+AOqk0SGR11/IdefS8P49Y8','/images/default_user.JPG','er',0,NULL,NULL,NULL),(22,'email1@email.com','$argon2i$v=19$m=4096,t=3,p=1$vTr18yU03kTI8/kDo8EcWg$mE/9nAhMeJEM0gspOyyJ/JlnHXZAMtc8T8NyyMJv0As','/images/default_user.JPG','we',0,NULL,NULL,NULL),(27,'wewe@email.com','$argon2i$v=19$m=4096,t=3,p=1$vtYTwniTeKVcpHaOCvLyvg$GYGHITT9mm6kq94f8HHNafUtEHR3kgh9PkekzoQAubk','/images/default_user.JPG','we',0,NULL,NULL,NULL),(28,'s@s.s','$argon2i$v=19$m=4096,t=3,p=1$QdWvHEOTTv+bsR+mwV05cg$VG2fjjVYVtt+7p1sEqxQ1HJf8Pvg/MWi6C3pmD0TK4g','/images/default_user.JPG','we',0,NULL,NULL,NULL),(29,'wewewe@email.com','$argon2i$v=19$m=4096,t=3,p=1$08cEM+BN9RF7RkLiRolapg$sbgpHe7xjyUGZnlZVO6F6U+Gu+yvPS1AVY6Enn8E8D4','/images/default_user.JPG','wew',0,NULL,NULL,NULL),(30,'we@we.we','$argon2i$v=19$m=4096,t=3,p=1$nkdHzjZDMJpwBhSrN3K/Bg$l50psf76Eb4sm9TPr4KKBysfdO78P32iyxI3dIjVjzA','/images/default_user.JPG','we',0,NULL,NULL,NULL),(32,'wewewewewe@email.com','$argon2i$v=19$m=4096,t=3,p=1$PaXgBU83wUhYJbQ5UC6GzQ$Xixq1S94L2ihIIuz09TXtXRspNHyTXeGMV/loc4GeL0','/images/default_user.JPG','werwe',0,NULL,NULL,NULL),(33,'wewewewewewe@email.com','$argon2i$v=19$m=4096,t=3,p=1$DJSHUJaEVxSusBOAgm526A$DTJFWUR6n2P5z9CBPN2hR1cTY/nydpunx2m0Dg5G1QU','/images/default_user.JPG','werwe',0,NULL,NULL,NULL),(34,'q@email.com','$argon2i$v=19$m=4096,t=3,p=1$J31EvfdItflgpaDaD1dp0Q$5nag3j27xooRSvEQCr6EoGLUgd/9AWnkX7SDU8YVO0Y','/images/default_user.JPG','wer',0,NULL,NULL,NULL),(35,'emaiai@email.com','$argon2i$v=19$m=4096,t=3,p=1$M/JEwpZX8YLOWMSqzhK2OA$9h7FhqBlVDb4hB1+l9e/xKE+mVXP8JrLtVMeVW9IKz8','/images/default_user.JPG','wer',0,NULL,NULL,NULL),(36,'jsdnjsdjsd@email.com','$argon2i$v=19$m=4096,t=3,p=1$KCcb0HTW2/WaBsopzkipXg$YcwDpUzGpfepKswotkfyIFGQIvPAT/jRL4+khPyfk0k','/images/default_user.JPG','erer',0,NULL,NULL,NULL),(37,'ed@email.com','$argon2i$v=19$m=4096,t=3,p=1$jOWpYNjz667vMFy6vd9+2w$lM1zCO8nBTm8Zvmpi3e8XiOcGZBeKEVlmI66dpRNl/Y','/images/default_user.JPG','er',0,NULL,NULL,NULL),(38,'w@weami.c','$argon2i$v=19$m=4096,t=3,p=1$RLn37NXwcavXr9fTolsvpg$9dtBjUiVVwYy5QtDaYEan2jtLyNSi+XoHJe7pROjzx8','/images/default_user.JPG','ertert',0,NULL,NULL,NULL),(39,'w@w.w.w','$argon2i$v=19$m=4096,t=3,p=1$l9D8ZxuP4dvSk+c7osSjhQ$WkaOTVRWOzCmYHMHZ9lqJK6C9FKSOVnvOvaKdjdVTvQ','/images/default_user.JPG','we',0,NULL,NULL,NULL),(40,'wewed@email.com','$argon2i$v=19$m=4096,t=3,p=1$wiPmJi9160J57GniLcDknA$5VRctCNpKdgrhuFkwPqddsRWOnZ51jH+yspWsQO8wdk','/images/default_user.JPG','we',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-26  4:46:36
