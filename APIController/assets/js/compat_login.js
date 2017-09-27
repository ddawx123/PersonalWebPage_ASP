// Introduction: Compat Login JS Controller
function doLoginAction() {
    if (document.getElementById('username').value == '') {
        alert('亲，请确认用户帐号填写完毕后再试！');
        document.getElementById('username').focus();
        return false;
    } else if (document.getElementById('password').value == '') {
        alert('亲，请确认帐号密码填写完毕后再试！');
        document.getElementById('password').focus();
        return false;
    } else {
        document.getElementById('btnlogin').value = "正在请求登录";
        document.getElementById('btnlogin').disabled = true;
        var account = document.getElementById('username').value;
        var passwd = document.getElementById('password').value;
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = eval("(" + xhr.responseText + ")");
                authcode = data.code;
                message = data.message;
                switch (authcode) {
                    case 200:
                        location.href = "manager.aspx";
                        break;
                    case 403:
                        document.getElementById('password').value = "";
                        alert(message);
                        document.getElementById('btnlogin').value = "登录";
                        document.getElementById('btnlogin').disabled = false;
                        document.getElementById('password').focus();
                        break;
                    case 405:
                        document.getElementById('password').value = "";
                        alert(message);
                        document.getElementById('btnlogin').value = "登录";
                        document.getElementById('btnlogin').disabled = false;
                        document.getElementById('password').focus();
                        break;
                    default:
                        document.getElementById('password').value = "";
                        alert("系统忙碌或出现异常，暂时无法处理您的请求。请联系站点管理员解决此问题！");
                        document.getElementById('btnlogin').value = "登录";
                        document.getElementById('btnlogin').disabled = false;
                        document.getElementById('password').focus();
                        break;
                }
            }
        }
        xhr.withCredentials = true;
        xhr.open("POST", "./api.ashx/login", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send('username=' + account + '&password=' + passwd + '&cors_domain=' + window.location.protocol + '//' + window.location.host);
        return false;
    }
}

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	/*
	// 由于本实例中url参数将用于重定向，而某些情况下url参数会以null形式返回导致出现404问题
	// 所以这里特别修改了空值时的返回模型
	if (r != null) return unescape(r[2]); return null; //返回参数值
	*/
	if (r != null) {
		return unescape(r[2]); //返回参数值
	}
	else {
		return "/";
	}
}