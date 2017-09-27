// JavaScript Document
// Charset: UTF-8

/**
 * 页面全局JS入口，通过JQuery侦测页面状态
 * @version 2017.7.23.Release
 * @return mixed
 * @author alone◎浅忆
 * @copyright 2017 DingStudio All Rights Reserved
 */
$(document).ready(function() {
    //var background_id = parseInt(Math.random()*(9-1+1)+1);
	//var mainframe = document.getElementById("application");
    //mainframe.style.background="url(static/img/" + background_id + ".jpg)";
    initialization(); //启动应用程序事件绑定与初始化
    loadSiteList(); //载入站点数据
    loadMsgList(); //载入留言数据
    var usertoken = getCookie("token"); //获取Cookie并存入变量
});



/**
 * 前端应用代码实现主体入口
 * @version 2017.8.3.V2
 * @return mixed
 * @author alone◎浅忆
 * @copyright 2017 DingStudio All Rights Reserved
 */
function initialization() {
    $("#btnAddSite").click(function () {
        checkSiteAddSubmit();
    });
    $("#btnReset").click(function () {
        $("#sitename").val("");
        $("#sitedesc").val("");
        $("#siteurl").val("");
        $("#siteimg").val("");
        return false;
    });
    $("#reinit_cmd").click(function () {
        truncateDB();
    });
    $("#btnSetBGM").click(function () {
        setBGM(1);
    });
    $("#btnCloseBGM").click(function () {
        setBGM(0);
    });
}

/**
 * 后台站点列表拉取过程
 */
function loadSiteList() {
    $.ajax({
        url: "../api.ashx/admin/getSiteList",
        method: "get",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.code != 200) {
                //alert("系统忙碌，请稍后重试。错误代码：" + data.code);
                $("#sites_num").html("未知");
                $("#siteListBox").html("<strong><span style=\"color: red\">温馨提示：数据库返回记录为空，发生此情况的可能是因为数据库刚刚完成了初始化或系统处于全新安装后的状态。</span></strong>");
                return;
            }
            var html;
            var table = "<tr><th bgcolor=\"#EBEBEB\">ID</th><th bgcolor=\"#EBEBEB\">站点名称</th><th bgcolor=\"#EBEBEB\">站点介绍</th><th bgcolor=\"#EBEBEB\">站点网址</th><th bgcolor=\"#EBEBEB\">站点缩略图</th><th bgcolor=\"#EBEBEB\">状态</th><th bgcolor=\"#EBEBEB\">操作</th></tr>";
            var oid = 1;
            for (var i = 0; i < data.Table.length; i++) {
                //alert(data.Table[i].sitename);
                if (data.Table[i].status == 200) {
                    var status = "正常";
                    var operate = "隐藏";
                    var opcode = 503;
                }
                else {
                    var status = "隐藏";
                    var operate = "公开";
                    var opcode = 200;
                }
                html += "<tr><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + oid + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].sitename + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].sitedesc + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].siteurl + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].siteimg + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + status + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><a href=\"javascript:void(0);\" onclick=\"changeDisplayMode(" + data.Table[i].id + "," + opcode + ")\" style=\"color: green\">" + operate + "</a> <a href=\"javascript:void(0);\" onclick=\"delSite(" + data.Table[i].id + ")\" style=\"color: red\">删除</a></td></tr>";
                oid++;
            }
            $("#sites_num").html(data.Table.length);
            $("#siteListBox").html(table + html);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
    });
}

/**
 * 后台站点列表拉取过程
 */
function loadMsgList() {
    $.ajax({
        url: "../api.ashx/admin/getMessage",
        method: "get",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.code != 200) {
                //alert("系统忙碌，请稍后重试。错误代码：" + data.code);
                $("#msg_num").html("未知");
                $("#msgListBox").html("<strong><span style=\"color: red\">温馨提示：数据库返回记录为空，发生此情况的可能是因为数据库刚刚完成了初始化或系统处于全新安装后的状态。</span></strong>");
                return;
            }
            var html;
            var table = "<tr><th bgcolor=\"#EBEBEB\">ID</th><th bgcolor=\"#EBEBEB\">用户昵称</th><th bgcolor=\"#EBEBEB\">联系方式</th><th bgcolor=\"#EBEBEB\">留言内容</th><th bgcolor=\"#EBEBEB\">留言时间</th><th bgcolor=\"#EBEBEB\">操作</th></tr>";
            var oid = 1;
            for (var i = 0; i < data.Table.length; i++) {
                html += "<tr><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + oid + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].name + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].calling + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].message + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><font color=\"MediumSeaGreen\">" + data.Table[i].time + "</font></td><td align=\"left\" bgcolor=\"#FFFFFF\"><a href=\"javascript:void(0);\" onclick=\"delMsg(" + data.Table[i].id + ")\" style=\"color: red\">删除</a></td></tr>";
                oid++;
            }
            $("#msg_num").html(data.Table.length);
            $("#msgListBox").html(table + html);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
    });
}

/**
 * 站点移除的实现过程
 * @param {int} site_id
 */
function delSite(site_id) {
    if (!confirm("您确认要删除站点ID为：" + site_id + "的所有信息吗？此操作不可逆哦。")) {
        return false;
    }
    $.ajax({
        url: "../api.ashx/admin/delSite",
        method: "post",
        dataType: "json",
        data: {
            id: site_id
        },
        async: false,
        success: function (result) {
            if (result && result.code === 200) {
                alert("站点ID为" + site_id + "的信息已从数据库中被永久删除！");
                loadSiteList();
            }
            else {
                alert("站点删除失败，数据无法正常应用到数据库。错误响应代码：" + result.code + "，错误信息：" + result.message + "。");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
    });
}

/**
 * 用户留言移除的实现过程
 * @param {int} msg_id
 */
function delMsg(msg_id) {
    if (!confirm("您确认要删除ID为：" + msg_id + "的留言信息吗？此操作不可逆哦。")) {
        return false;
    }
    $.ajax({
        url: "../api.ashx/admin/delMessage",
        method: "post",
        dataType: "json",
        data: {
            id: msg_id
        },
        async: false,
        success: function (result) {
            if (result && result.code === 200) {
                alert("ID为" + msg_id + "的留言信息已从数据库中被永久删除！");
                loadMsgList();
            }
            else {
                alert("站点删除失败，数据无法正常应用到数据库。错误响应代码：" + result.code + "，错误信息：" + result.message + "。");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
    });
}

/**
 * 更改站点数据隐私设置的实现过程
 * @param {int} site_id 站点ID
 * @param {int} operate_code 操作特征码
 */
function changeDisplayMode(site_id, operate_code) {
    switch (operate_code) {
        case 200:
            if (!confirm("您确认要继续操作？当前类型为：隐藏站点，继续操作将会对站点ID为：" + site_id + "的信息进行前台隐藏处理哦！")) {
                return false;
            }
            $.ajax({
                url: "../api.ashx/admin/setSite",
                method: "post",
                dataType: "json",
                data: {
                    id: site_id,
                    opcode: operate_code,
                    token: getCookie("token")
                },
                async: false,
                success: function (result) {
                    if (result && result.code === 200) {
                        alert("站点隐私设置已被成功修改，当前状态为：隐藏。此状态下，用户前台将无法看到此站点。");
                        loadSiteList();
                    }
                    else {
                        alert("站点隐私设置修改失败，数据无法正常应用到数据库。错误响应代码：" + result.code + "，错误信息：" + result.message + "。");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
                }
            });
            break;
        case 503:
            if (!confirm("您确认要继续操作？当前类型为：公开站点，继续操作将会对站点ID为：" + site_id + "的信息进行前台恢复公开显示哦！")) {
                return false;
            }
            $.ajax({
                url: "../api.ashx/admin/setSite",
                method: "post",
                dataType: "json",
                data: {
                    id: site_id,
                    opcode: operate_code,
                    token: getCookie("token")
                },
                async: false,
                success: function (result) {
                    if (result && result.code === 200) {
                        alert("站点隐私设置已被成功修改，当前状态为：公开。此状态下，用户前台将可以直接看到此站点。");
                        loadSiteList();
                    }
                    else {
                        alert("站点隐私设置修改失败，数据无法正常应用到数据库。\n错误响应代码：" + result.code + "\n错误信息：" + result.message + "。");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
                }
            });
            break;
        default:
            alert("内部错误，操作已被终止。");
            break;
    }
}

/**
 * 网站背景音乐异步控制模型
 * @param {int} level
 */
function setBGM(level) {
    switch (level) {
        case 1:
            var info = "修改并重新开启";
            break;
        case 0:
            var info = "关闭";
            break;
        default:
            alert("无效的调用方法，操作已被系统阻断。");
            return false;
            break;
    }
    if ($("#audioName").val() == '' || $("#audioAuthor").val() == '' || $("#audioReferer").val() == '' || $("#audioUrl") == '') {
        alert("抱歉，请完成所有必填项目后再次尝试。");
        return false;
    }
    if (!confirm("确认" + info + "网站背景音乐？")) {
        return false;
    }
    $.ajax({
        url: "../api.ashx/admin/setBGM",
        type: "post",
        dataType: "json",
        data: {
            runlevel: level,
            audioName: $("#audioName").val(),
            audioAuthor: $("#audioAuthor").val(),
            audioReferer: $("#audioReferer").val(),
            audioUrl: $("#audioUrl").val()
        },
        success: function (result) {
            if (result && result.code === 200) {
                alert("背景音乐属性修改操作成功结束！稍后为您重新加载页面。");
                location.reload();
            }
            else {
                alert("背景音乐属性修改操作失败，数据无法正常应用到数据库。\n错误响应代码：" + result.code + "\n错误信息：" + result.message + "。");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
    });
}

/**
 * 数据库初始化前端异步调用
 */
function truncateDB() {
    if (!confirm("您确认要初始化数据库？继续操作需要再次确认用户名和密码。")) {
        return false;
    }
    var username = prompt("请键入有效的用户账号，系统需要二次验证您的身份。");
    var password = prompt("请键入有效的用户密码，系统需要二次验证您的身份。");
    if (username == "" || password == "") {
        alert("用户名或密码不能为空，操作已被系统取消。");
        return false;
    }
    else {
        $.ajax({
            url: "../api.ashx/login",
            type: "post",
            dataType: "json",
            data: {
                username: username,
                password: password
            },
            async: false,
            success: function (res) {
                if (res.code != 200) {
                    alert("用户名或密码不正确，请检查。");
                    return false;
                }
                else {
                    alert("二次身份验证校验通过！");
                    var form_name = prompt("现在，请键入有效的数据表名称。");
                    if (form_name == "") {
                        alert("数据表名不能为空，请重试。");
                        return false;
                    }
                    $.ajax({
                        url: "../api.ashx/admin/truncate",
                        type: "post",
                        dataType: "json",
                        data: {
                            form_name: form_name,
                            token: getCookie("token")
                        },
                        success: function (res) {
                            if (res.code === 200) {
                                alert("操作成功结束。");
                                location.reload();
                            }
                            else {
                                alert("操作失败");
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
                        }
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
            }
        });
    }
}

/**
 * 用户信息前端的检查与提交
 * @version 3.0
 * @param string sitename 站点名称
 * @param string sitedesc 站点介绍
 * @param string siteurl 站点网址
 * @param string siteimg 站点缩略图
 * @return mixed
 * @author alone◎浅忆
 * @copyright 2017 DingStudio All Rights Reserved
 */
function checkSiteAddSubmit() {
    if ($("#sitename").val() == '' || $("#sitedesc").val() == '' || $("#siteurl").val() == '' || $("#siteimg").val() == '') {
        alert("抱歉，请完成所有必填项目后再次尝试。");
        return false;
    }
    else {
        $.ajax({
            url: "../api.ashx/admin/addSite",
            type: "post",
            dataType: "json",
            data: {
                sitename: $("#sitename").val(),
                cors_domain: window.location.protocol + '//' + window.location.host,
                sitedesc: $("#sitedesc").val(),
                siteurl: $("#siteurl").val(),
                siteimg: $("#siteimg").val()
            },
            async: false,
            success: function (res) {
                if (res.code === 200) {
                    $("#sitename").val("");
                    $("#sitedesc").val("");
                    $("#siteurl").val("");
                    $("#siteimg").val("");
                    loadSiteList();
                    alert(res.message);
                    return true;
                }
                else {
                    alert(res.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
            }
        });
        return false;
    }
}

//Cookie Controller
/**
 * Cookie 的创建过程
 * @param string c_name cookie名
 * @param string value cookie值
 * @param string expiredays 过期时间
 * @return null
 */
function setCookie(c_name,value,expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}
/**
 * Cookie 的读取过程
 * @param string c_name cookie名
 * @return string
 */
function getCookie(cname) {
	if (document.cookie.length>0) {
		c_start=document.cookie.indexOf(cname + "=");
		if (c_start!=-1) {
			c_start=c_start + cname.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) {
				c_end=document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}
/**
 * Cookie 的查验过程
 * @param string cookie_name cookie名
 * @return boolean
 */
function checkCookie(cookie_name) {
	username=getCookie(cookie_name);
	if (username!=null && username!="") {
		return true;
	}
	else {
		/*username=prompt('Please enter your name:',"");
		if (username!=null && username!="") {
			setCookie(cookie_name,username,365);
		}*/
		return false;
	}
}

function helpform() {
    window.open('help.htm','_blank','menubar=no,toolbar=no,status=yes,scrollbars=yes');
}

function Redirect(url) {
	document.location=url;
}
