<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="manager.aspx.cs" Inherits="APIController.manager" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <!-- set auto resize mode -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>后台管理系统</title>
    <meta name="theme-color" content="#3979B9">
    <link rel="shortcut icon" href="http://www.dingstudio.cn/favicon.ico">
    <link rel="Bookmark" href="http://www.dingstudio.cn/favicon.ico" />
    <!-- include bootstrap support css -->
    <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
    <!-- Include JS File -->
    <!-- Include JQuery Support -->
    <script src="../assets/js/jquery.min.js"></script>
    <!-- Include BootStrap JS Support -->
    <script src="../assets/js/bootstrap.min.js"></script>
    <!-- Include DingStudio Application -->
    <script src="../assets/js/app.js"></script>
</head>
<body>
    <div style="max-width:80%;width:auto;margin-left: auto;margin-right: auto;padding:5px;">
        <div class="table-responsive">
            <nav class="navbar navbar-default" role="navigation">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#example-navbar-collapse">
                            <span class="sr-only">导航</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="/">后台管理</a>
                    </div>
                    <div class="collapse navbar-collapse" id="example-navbar-collapse">
                        <ul class="nav navbar-nav">
                            <li><a href="#addsiteBox">信息发布</a></li>
                            <li><a href="#msgListBox">留言管理</a></li>
                            <li><a href="javascript:void(0);" onclick="alert('用户中心已由站群通行证平台统一管理，请转到统一身份认证平台继续操作。');">用户中心</a></li>
                            <li><a href="./logout">退出</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <table align="left" width="100%" height="20" border="0" align="left" cellpadding="5" cellspacing="1" bgcolor="#B3B3B3" class='table table-striped table-bordered'>
                <tr>
                    <td align="left" bgcolor="#EBEBEB"><font id="tongji">欢迎回来，当前共有 <font color="MediumSeaGreen" id="sites_num"> 0</font> 条站点记录和 <font color="MediumSeaGreen" id="msg_num"> 0</font> 条前台用户留言待处理。</td>
                </tr>
            </table>

            <table align="left" width="100%" border="0" cellpadding="5" cellspacing="1" bgcolor="#B3B3B3" class="table table-striped table-bordered">
                <tr>
                    <td bgcolor="#EBEBEB"><font color="red">站点管理</font></td>
                </tr>
            </table>

             <table id="siteListBox" width='100%' border='0' align='left' cellpadding='5' cellspacing='1' bgcolor='#B3B3B3' class='table table-striped table-bordered'>
                <!--<tr>
                    <th bgcolor='#EBEBEB'>站点ID</th>
                    <th bgcolor='#EBEBEB'>站点名称</th>
                    <th bgcolor='#EBEBEB'>站点介绍</th>
                    <th bgcolor='#EBEBEB'>站点网址</th>
                    <th bgcolor='#EBEBEB'>站点缩略图</th>
                    <th bgcolor='#EBEBEB'>状态</th>
                    <th bgcolor='#EBEBEB'>操作</th>
                    </tr>
                    <tr>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">1</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">测试</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">测试介绍</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">example.org</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">example.jpg</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">正常</font></td>
                    <td align="left" bgcolor="#FFFFFF"><a href="javascript:void(0);" style="color:green">更改状态</a> <a href="javascript:void(0);" style="color:red">删除</a></td>
                    </tr>-->
            </table>	
            <div id="addsiteBox" align="left" style="max-width:100%;padding:5px;">
                <table align="left" border="0" cellpadding="5" cellspacing="1" bgcolor="#B3B3B3" style="max-width:50%;padding:5px;" class="table table-striped table-bordered">
                    <tr>
                        <td bgcolor="#EBEBEB"><font color="red">新增网站</font></td>
                    </tr>
                    <tr>
                        <td bgcolor="#EBEBEB">
                            <font color="MediumSeaGreen">站点名称：</font>
                            <input name="sitename" type="text" id="sitename" value="" size="15" />
                            <font color="MediumSeaGreen">站点介绍：</font>
                            <input name="sitedesc" type="text" id="sitedesc" value="" size="15" />
                            <input type="button" name="btnAddSite" id="btnAddSite" class="btn btn-primary" value="添加" />
                            <br />
                            <font color="MediumSeaGreen">站点网址：</font>
                            <input name="siteurl" type="text" id="siteurl" value="" size="15" />
                            <font color="MediumSeaGreen">站点图片：</font>
                            <input name="siteimg" type="text" id="siteimg" value="" size="15" />
                            <input type="button" name="btnReset" id="btnReset" class="btn btn-warning" value="重置" />
                        </td>
                    </tr>
                </table>

                <table align="left" border="0" cellpadding="5" cellspacing="1" bgcolor="#B3B3B3" style="max-width:50%;padding:5px;" class="table table-striped table-bordered">
                    <tr>
                        <td bgcolor="#EBEBEB"><font color="red">网站背景音乐设置</font></td>
                    </tr>
                    <tr>
                        <td bgcolor="#EBEBEB">
                            <font color="MediumSeaGreen">名称：</font>
                            <input name="audioName" type="text" id="audioName" value="" size="15" />
                            <font color="MediumSeaGreen">作者：</font>
                            <input name="audioAuthor" type="text" id="audioAuthor" value="" size="15" />
                            <input type="button" name="btnSetBGM" id="btnSetBGM" class="btn btn-success" value="设置" />
                            <br />
                            <font color="MediumSeaGreen">来源：</font>
                            <input name="audioReferer" type="text" id="audioReferer" value="" size="15" />
                            <font color="MediumSeaGreen">路径：</font>
                            <input name="audioUrl" type="text" id="audioUrl" value="" size="15" />
                            <input type="button" name="btnCloseBGM" id="btnCloseBGM" class="btn btn-danger" value="禁用" />
                        </td>
                    </tr>
                </table>
            </div>


            <table align="left" width="100%" border="0" cellpadding="5" cellspacing="1" bgcolor="#B3B3B3" class="table table-striped table-bordered">
                <tr>
                    <td bgcolor="#EBEBEB"><font color="red">留言管理</font></td>
                </tr>
            </table>

            <table id="msgListBox" width='100%' border='0' align='left' cellpadding='5' cellspacing='1' bgcolor='#B3B3B3' class='table table-striped table-bordered'>
                <!--<tr>
                    <th bgcolor='#EBEBEB'>留言序号</th>
                    <th bgcolor='#EBEBEB'>用户昵称</th>
                    <th bgcolor='#EBEBEB'>联系方式</th>
                    <th bgcolor='#EBEBEB'>留言内容</th>
                    <th bgcolor='#EBEBEB'>留言时间</th>
                    <th bgcolor='#EBEBEB'>操作</th>
                    </tr>
                    <tr>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">1</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">user</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">user@example.org</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">article content</font></td>
                    <td align="left" bgcolor="#FFFFFF"><font color="MediumSeaGreen">datetime</font></td>
                    <td align="left" bgcolor="#FFFFFF"><a href="javascript:void(0);" style="color:red">删除</a></td>
                    </tr>-->
            </table>

            <table align="center" width="100%" height="20" border="0" align="center" cellpadding="5" cellspacing="1" bgcolor="#B3B3B3" class='table table-striped table-bordered'>
                <tr>
                    <td align="center" bgcolor="#EBEBEB">高级功能：<a id="reinit_cmd" href="javascript:void(0);" class="btn btn-danger">重新初始化数据库（高级）</a></td>
                </tr>
                <tr>
                    <td align="center" bgcolor="#EBEBEB">欢迎使用后台管理系统 | &copy;2012-<%=MyNowYear %> <a href="http://www.dingstudio.cn">DingStudio</a> All Rights Reserved</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
