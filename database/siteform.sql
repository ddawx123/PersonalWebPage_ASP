/*
Navicat SQL Server Data Transfer

Source Server         : localhost
Source Server Version : 130000
Source Host           : localhost:1433
Source Database       : labindex
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 130000
File Encoding         : 65001

Date: 2017-09-25 10:52:34
*/


-- ----------------------------
-- Table structure for siteform
-- ----------------------------
DROP TABLE [dbo].[siteform]
GO
CREATE TABLE [dbo].[siteform] (
[id] int NOT NULL IDENTITY(1,1) ,
[sitename] varchar(100) NOT NULL ,
[sitedesc] varchar(150) NOT NULL ,
[siteurl] varchar(150) NOT NULL ,
[siteimg] varchar(150) NOT NULL ,
[status] int NOT NULL 
)


GO

-- ----------------------------
-- Records of siteform
-- ----------------------------
SET IDENTITY_INSERT [dbo].[siteform] ON
GO
SET IDENTITY_INSERT [dbo].[siteform] OFF
GO

-- ----------------------------
-- Indexes structure for table siteform
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table siteform
-- ----------------------------
ALTER TABLE [dbo].[siteform] ADD PRIMARY KEY ([id])
GO
