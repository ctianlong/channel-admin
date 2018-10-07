/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.5.54-0ubuntu0.14.04.1 : Database - channel
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`channel` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `channel`;

/*Table structure for table `account_user` */

DROP TABLE IF EXISTS `account_user`;

CREATE TABLE `account_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `password` varchar(128) NOT NULL COMMENT '密码',
  `username` varchar(128) NOT NULL COMMENT '用户名',
  `chname` varchar(128) NOT NULL COMMENT '姓名',
  `phone` varchar(64) DEFAULT NULL COMMENT '联系方式',
  `company` varchar(128) DEFAULT NULL COMMENT '工作单位',
  `address` varchar(128) DEFAULT NULL COMMENT '通讯地址',
  `is_superuser` tinyint(1) unsigned NOT NULL COMMENT '是否管理员',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `account_user` */

insert  into `account_user`(`id`,`password`,`username`,`chname`,`phone`,`company`,`address`,`is_superuser`,`gmt_create`,`gmt_modified`) values (1,'$2a$10$VdAbRO0eiqV3dPCRS0OPt.gZVVk2YlW7KXOf1ukw4oC7b0Sb/ASPy','super','超级管理员','18811112234','','杭州',1,'2017-10-15 14:49:30','2018-09-29 13:09:20'),(2,'$2a$10$JBstL3cYDvWvmZ3plNYCtuiPD5q3qwu1k70BwTHO3H4uXaVu6LTai','admin','管理员','18855556666','','杭州',0,'2017-10-16 19:31:39','2018-09-17 16:49:42');

/*Table structure for table `channel` */

DROP TABLE IF EXISTS `channel`;

CREATE TABLE `channel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channelName` varchar(255) DEFAULT '' COMMENT '渠道名称',
  `payType` int(11) DEFAULT '0' COMMENT '付费方式0-cpm 1-cpc 2-cpa',
  `price` int(11) DEFAULT '0' COMMENT '单价',
  `parentId` bigint(20) DEFAULT '0' COMMENT '父渠道id',
  `createTime` bigint(20) DEFAULT '0' COMMENT '记录创建时间',
  `updateTime` bigint(20) DEFAULT '0' COMMENT '记录更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COMMENT='渠道信息';

/*Data for the table `channel` */

insert  into `channel`(`id`,`channelName`,`payType`,`price`,`parentId`,`createTime`,`updateTime`) values (1,'网易新闻',0,0,0,1538052362000,1538052362000),(2,'网易新闻-PC',1,5,1,1538052362000,1538052362000),(3,'网易新闻-APP',2,10,1,1538052362000,1538052362000),(4,'百度新闻',0,0,0,1538052362000,1538052362000),(5,'百度新闻-PC',2,6,4,1538052362000,1538052362000),(6,'百度新闻-APP',1,11,4,1538052362000,1538052362000),(7,'腾讯新闻',0,0,0,1538104419567,1538104419567),(8,'腾讯新闻-PC',0,7,7,1538104445807,1538104445807),(11,'爱奇艺',0,0,0,1538283013968,1538283013968),(12,'爱奇艺-PC',0,4,11,1538283041946,1538287940360),(13,'爱奇艺-APP',1,5,11,1538283080752,1538283080752);

/*Table structure for table `channellog` */

DROP TABLE IF EXISTS `channellog`;

CREATE TABLE `channellog` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channelId` bigint(20) DEFAULT '0' COMMENT 'channel表的id',
  `channelName` varchar(255) DEFAULT '' COMMENT '渠道名称',
  `payType` int(11) DEFAULT '0' COMMENT '付费方式0-cpm 1-cpc 2-cpa',
  `price` int(11) DEFAULT '0' COMMENT '单价',
  `parentId` bigint(20) DEFAULT '0' COMMENT '父渠道id',
  `day` int(11) DEFAULT '0' COMMENT '统计日期20180919',
  `click` int(11) DEFAULT '0' COMMENT '点击数',
  `display` int(11) DEFAULT '0' COMMENT '展示数，不要用show，按show排序sql会有问题',
  `activity` int(11) DEFAULT '0' COMMENT '激活数',
  `createTime` bigint(20) DEFAULT '0' COMMENT '记录创建时间',
  `updateTime` bigint(20) DEFAULT '0' COMMENT '记录更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COMMENT='渠道跟踪日志表';

/*Data for the table `channellog` */

insert  into `channellog`(`id`,`channelId`,`channelName`,`payType`,`price`,`parentId`,`day`,`click`,`display`,`activity`,`createTime`,`updateTime`) values (1,2,'网易新闻-PC',1,5,1,20180927,100,2000,50,1538052362000,1538052362000),(2,3,'网易新闻-APP',2,10,1,20180927,120,1800,60,1538052362000,1538052362000),(3,5,'百度新闻-PC',2,6,4,20180927,90,1900,55,1538052362000,1538052362000),(4,6,'百度新闻-APP',1,11,4,20180927,95,1955,56,1538052362000,1538052362000),(5,8,'腾讯新闻-PC',0,7,7,20180927,99,988,78,1538052362000,1538052362000),(6,2,'网易新闻-PC',1,5,1,20180928,120,2500,88,1538104445807,1538104445807),(7,3,'网易新闻-APP',2,10,1,20180928,122,2400,99,1538104445807,1538104445807),(8,5,'百度新闻-PC',2,6,4,20180928,111,2300,91,1538104445807,1538104445807),(9,6,'百度新闻-APP',1,11,4,20180928,105,2200,85,1538104445807,1538104445807),(10,8,'腾讯新闻-PC',0,7,7,20180928,118,2160,84,1538104445807,1538104445807),(11,2,'网易新闻-PC',1,5,1,20180929,60,3500,40,1538052362000,1538052362000),(12,2,'网易新闻-PC',1,5,1,20180930,80,3000,15,1538052362000,1538052362000),(13,2,'网易新闻-PC',1,5,1,20181001,70,1900,72,1538052362000,1538052362000),(14,2,'网易新闻-PC',1,5,1,20180926,90,1780,102,1538052362000,1538052362000),(15,2,'网易新闻-PC',1,5,1,20180925,150,1680,150,1538052362000,1538052362000),(16,2,'网易新闻-PC',1,5,1,20180924,55,1868,126,1538052362000,1538052362000),(17,2,'网易新闻-PC',1,5,1,20180923,180,1500,33,1538052362000,1538052362000);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
