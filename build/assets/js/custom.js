/*
	Template Kernel JavaScript Controller by DingStudio
	dingstudio.cn | @alone◎浅忆
	Copyright 2012-2017 DingStudio All Rights Reserved
*/

var init = function(){
    getFrameWork();
    BGMInit();
};

init();

/**
 * 网站主框架数据拉取过程
 */
function getFrameWork() {
	$.ajax({
		url: './api.ashx/getSiteList',
		type: 'post',
		dataType: 'json',
		async: false,
		success: function (data) {
            if (data.code != 200) {
                alert("系统忙碌，请稍后重试。错误代码：" + data.code);
                return;
            }
            var html = "";
            var oid = 1;
            for (var i = 0; i < data.Table.length; i++) {
                html += "<article id=\"website_" + oid + "\"><span class=\"image\"><img src=\"" + data.Table[i].siteimg + "\" alt=\"" + data.Table[i].sitedesc + "\" /></span><header class=\"major\"><h3><a href=\"" + data.Table[i].siteurl + "\" class=\"link\">" + data.Table[i].sitename + "</a></h3><p>" + data.Table[i].sitedesc + "</p></header></article>";
                oid++;
            }
            $("#one").html(html);
		},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
	});
}

/**
 * 网站背景音乐数据拉取
 */
function BGMInit() {
    $.ajax({
        url: "./bgm.json",
        type: "get",
        dataType: "json",
        async: true,
        success: function (result) {
            if (result.status === 0) {
                return false;
            }
            else {
                $("#bgmusic").append("<audio src=\"" + result.musicUrl + "\" controls=\"controls\" autoplay=\"autoplay\" loop=\"loop\" height=\"100\" width=\"100\" type=\"audio/mp3\"><embed height=\"100\" width=\"100\" src=\"" + result.musicUrl + "\"></audio>");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("背景音乐JSON数据拉取失败，已自动跳过音频播放加载过程！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
    });
}

/**
 * 留言信息异步提交过程
 */
function sendMessage() {
    if ($("#name").val() == "" || $("#contactInfo").val() == "" || $("#message").val() == "") {
        alert("抱歉，请确保完成了所有必填项后再次尝试提交留言。");
        return false;
    }
    if (!confirm("您好：" + $("#name").val() + "，您确认要继续提交留言吗？继续操作将无法撤销。")) {
        return false;
    }
    $.ajax({
        url: "./api.ashx/postMessage",
        type: 'post',
        dataType: 'json',
        data: {
            name: $("#name").val(),
            contactInfo: $("#contactInfo").val(),
            message: $("#message").val()
        },
        async: false,
        success: function (result) {
            if (result && result.code === 200) {
                alert("留言投递成功！站点管理员将在5个工作日内答复您的留言。关闭此对话框后系统将自动为您重新载入网页！");
                location.reload();
            }
            else {
                alert("留言投递失败，远程服务器返回错误代码：" + result.code + "，错误信息：" + result.message + "。");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("AJAX请求发生错误，远程服务器积极拒绝本次操作。请刷新页面后再次尝试！错误代码：" + XMLHttpRequest.status + "，错误状态：" + XMLHttpRequest.readyState + "。错误描述：" + textStatus);
        }
    });
    return false;
}
