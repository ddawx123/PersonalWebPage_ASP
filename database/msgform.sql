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

Date: 2017-09-26 19:45:23
*/


-- ----------------------------
-- Table structure for msgform
-- ----------------------------
DROP TABLE [dbo].[msgform]
GO
CREATE TABLE [dbo].[msgform] (
[id] int NOT NULL IDENTITY(1,1) ,
[name] varchar(60) NOT NULL ,
[calling] varchar(100) NOT NULL ,
[message] varchar(255) NOT NULL ,
[time] datetime NOT NULL DEFAULT (getdate()) 
)


GO

-- ----------------------------
-- Records of msgform
-- ----------------------------
SET IDENTITY_INSERT [dbo].[msgform] ON
GO
SET IDENTITY_INSERT [dbo].[msgform] OFF
GO

-- ----------------------------
-- Indexes structure for table msgform
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table msgform
-- ----------------------------
ALTER TABLE [dbo].[msgform] ADD PRIMARY KEY ([id])
GO
