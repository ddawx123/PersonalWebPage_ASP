# 小丁工作室-个人网站信息发布系统
## 小丁工作室-个人网站信息发布门户系统，基于ASP.NET（CSharp）技术构建。
## 数据库引擎使用SQL Server 2016 Express实现。

## 主要功能：
- 支持首页多站点信息的管理/展示发布功能，同时支持站点隐私保护模式的激活设置。
- 提供前台用户留言支持，后台留言管理功能。全局AJAX异步操作，杜绝频繁的页面切换。
- 后台用户认证使用SSO技术，与之前开发的Passport统一身份认证平台实现用户数据的互通，一个账号到处登录。
- 前台板块数据/后台用户登录/站点数据的添加、删除、修改/留言的提交与管理均启用了全局AJAX处理。
- 网站背景音乐管理功能

## 核心文件：
- api.ashx : AJAX异步请求处理程序，统一返回JSON字符串。此模块控制整个程序的核心工作状态！
- manager.aspx : 后台管理界面GUI
- login.html : 后台登录页面
- app.js : 后台管理界面异步请求封装模型
- custom.js : 前台数据传输异步请求封装模型
- compat_login.js : 后台登录界面异步请求封装模型
- index.html : 首页主框架

## API请求规范：
这里简单介绍一些请求规范。api.ashx主要通过读取pathinfo来执行不同的操作！
- api.ashx/admin/* ：后台管理专用，此节点下的所有模型调用均受到权限检查模块的保护。部分接口强制要求使用POST方式请求！
- api.ashx/* : 前台专用，允许匿名请求。部分接口强制要求使用POST方式请求！

### &copy;2012-2017 <a href="http://www.dingstudio.cn" target="_blank">DingStudio</a> All Rights Reserved | 小丁工作室：<a href="https://954759397.qzone.qq.com" target="_blank">alone◎浅忆</a>