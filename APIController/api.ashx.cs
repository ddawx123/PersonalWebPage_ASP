using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace APIController
{
    /// <summary>
    /// API 摘要说明
    /// 本模型用于接收外部AJAX请求
    /// </summary>
    public class api : IHttpHandler
    {

        static string sqlconfig = ConfigurationManager.AppSettings["connString"]; //从Web.Config读取数据库连接字符串
        SqlConnection sqlcon = new SqlConnection(sqlconfig); //创建一个新的数据库连接会话
        SqlCommand sqlcmd; //构造一个空的数据库语句模型
        SqlDataAdapter sqlda; //构造一个全新的数据库适配器用于后期处理数据
        DataSet ds; //构造一个数据对象存储用于后期拉取数据
        int result; //构造数据库查询结果特征标识

        /// <summary>
        /// ASHX一般处理程序请求处理器
        /// </summary>
        /// <param name="context">HTTP会话句柄</param>
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json"; //设置全局JSON字符串输出
            context.Response.Charset = "utf-8"; //设置全局输出编码为UTF-8模式
            RequestHandler(context); //激活请求接管模型
        }

        /// <summary>
        /// 用户权限检查模型的构造
        /// </summary>
        /// <param name="context">HTTP会话句柄</param>
        public void CheckPermission(HttpContext context)
        {
            if (context.Request.Cookies["token"] == null)
            {
                context.Response.Write("{\"code\":403,\"message\":\"没有操作权限，请先登录。\"}");
                context.Response.End();
                return;
            }
        }

        /// <summary>
        /// 强制要求使用POST方式请求
        /// </summary>
        /// <param name="context">HTTP会话句柄</param>
        public void ForceUsePost(HttpContext context)
        {
            if (context.Request.RequestType != "POST")
            {
                context.Response.Write("{\"code\":405,\"message\":\"此接口只允许通过POST方式请求！\"}");
                context.Response.End();
                return;
            }
        }

        /// <summary>
        /// 请求接管模型，用于接管CSharp默认的ProcessRequest模块
        /// </summary>
        /// <param name="context">HTTP会话句柄</param>
        public void RequestHandler(HttpContext context)
        {
            switch (context.Request.PathInfo)
            {
                case "/login": //异步登录请求处理过程
                    ForceUsePost(context);
                    string username = context.Request["username"];
                    string password = context.Request["password"];
                    doLogin(username, password, context);
                    break;
                case "/admin/getSiteList": //后台站点列表数据的拉取过程
                    CheckPermission(context);
                    sqlda = new SqlDataAdapter("select * from siteform", sqlcon);
                    ds = new DataSet();
                    sqlda.Fill(ds);
                    context.Response.Write(GetJsonByDataset(ds));
                    break;
                case "/getSiteList": //前台站点列表数据的拉取过程
                    ForceUsePost(context);
                    sqlda = new SqlDataAdapter("select * from siteform where status = 200", sqlcon);
                    ds = new DataSet();
                    sqlda.Fill(ds);
                    context.Response.Write(GetJsonByDataset(ds));
                    break;
                case "/admin/addSite": //站点添加逻辑的实现
                    ForceUsePost(context);
                    CheckPermission(context);
                    if (String.IsNullOrEmpty(context.Request.Form["sitename"].ToString()) || String.IsNullOrEmpty(context.Request.Form["sitedesc"].ToString()) || String.IsNullOrEmpty(context.Request.Form["siteurl"].ToString()) || String.IsNullOrEmpty(context.Request.Form["siteimg"].ToString()))
                    {
                        context.Response.Write("{\"code\":405,\"message\":\"非法操作，参数不正确！\"}");
                        return;
                    }
                    sqlcmd = new SqlCommand("insert into siteform ([sitename],[sitedesc],[siteurl],[siteimg],[status]) values('"+ context.Request.Form["sitename"].ToString() +"','" + context.Request.Form["sitedesc"].ToString() + "','" + context.Request.Form["siteurl"].ToString() + "','" + context.Request["siteimg"].ToString() + "',200)",sqlcon);
                    sqlcon.Open();
                    result = sqlcmd.ExecuteNonQuery();
                    if(result == -1)
                    {
                        context.Response.Write("{\"code\":500,\"message\":\"数据库操作失败，没有成功写入。建议稍后再次尝试或联系站点管理员！\"}");
                    }
                    else
                    {
                        context.Response.Write("{\"code\":200,\"message\":\"操作成功结束，受影响的记录：" + result.ToString() + "\"}");
                    }
                    break;
                case "/admin/truncate": //数据库初始化的逻辑实现
                    ForceUsePost(context);
                    CheckPermission(context);
                    string truncate_type = context.Request.Form["form_name"].ToString();
                    if (String.IsNullOrEmpty(truncate_type))
                    {
                        context.Response.Write("{\"code\":500,\"message\":\"无效的数据表对象，操作已被系统阻断。\"}");
                        return;
                    }
                    sqlcmd = new SqlCommand("truncate table " + truncate_type, sqlcon);
                    sqlcon.Open();
                    result = sqlcmd.ExecuteNonQuery();
                    if(result != -1)
                    {
                        context.Response.Write("{\"code\":500,\"message\":\"数据库操作失败，没有成功写入。建议稍后再次尝试或联系站点管理员！\"}");
                    }
                    else
                    {
                        context.Response.Write("{\"code\":200,\"message\":\"操作成功结束，受影响的记录：" + result.ToString() + "\"}");
                    }
                    break;
                case "/admin/setSite": //站点隐私设置模型实现
                    ForceUsePost(context);
                    CheckPermission(context);
                    string site_id = context.Request.Form["id"].ToString();
                    string site_opcode = context.Request.Form["opcode"].ToString();
                    if(String.IsNullOrEmpty(site_id) && String.IsNullOrEmpty(site_opcode))
                    {
                        context.Response.Write("{\"code\":405,\"message\":\"没有传入站点ID或操作特征码，请核实后再次尝试。\"}");
                        return;
                    }
                    sqlcmd = new SqlCommand("update siteform set [status] = " + site_opcode + " where [id] = " + site_id, sqlcon);
                    sqlcon.Open();
                    result = sqlcmd.ExecuteNonQuery();
                    if (result != 1)
                    {
                        context.Response.Write("{\"code\":500,\"message\":\"数据库操作失败，没有成功写入。建议稍后再次尝试或联系站点管理员！" + result.ToString() + "\"}");
                    }
                    else
                    {
                        context.Response.Write("{\"code\":200,\"message\":\"操作成功结束，受影响的记录：" + result.ToString() + "\"}");
                    }
                    break;
                case "/admin/delSite": //站点信息的删除过程实现
                    ForceUsePost(context);
                    CheckPermission(context);
                    string oldsite_id = context.Request.Form["id"].ToString();
                    if(String.IsNullOrEmpty(oldsite_id))
                    {
                        context.Response.Write("{\"code\":405,\"message\":\"没有传入站点ID，请核实后再次尝试。\"}");
                        return;
                    }
                    sqlcmd = new SqlCommand("delete from siteform where [id] = " + oldsite_id, sqlcon);
                    sqlcon.Open();
                    result = sqlcmd.ExecuteNonQuery();
                    if (result != 1)
                    {
                        context.Response.Write("{\"code\":500,\"message\":\"数据库操作失败，没有成功写入。建议稍后再次尝试或联系站点管理员！" + result.ToString() + "\"}");
                    }
                    else
                    {
                        context.Response.Write("{\"code\":200,\"message\":\"操作成功结束，受影响的记录：" + result.ToString() + "\"}");
                    }
                    break;
                case "/postMessage": //前台留言墙信息投递处理模型
                    ForceUsePost(context);
                    string name = context.Request.Form["name"].ToString();
                    string contact = context.Request.Form["contactInfo"].ToString();
                    string message = context.Request.Form["message"].ToString();
                    if(String.IsNullOrEmpty(name) || String.IsNullOrEmpty(contact) || String.IsNullOrEmpty(message))
                    {
                        context.Response.Write("{\"code\":405,\"message\":\"留言内容必填项不能为空，请核实并更正后再次尝试留言提交！\"}");
                        return;
                    }
                    sqlcmd = new SqlCommand("insert into msgform ([name],[calling],[message]) values('" + name + "','" + contact + "','" + message + "')", sqlcon);
                    sqlcon.Open();
                    result = sqlcmd.ExecuteNonQuery();
                    if (result == -1)
                    {
                        context.Response.Write("{\"code\":500,\"message\":\"数据库操作失败，没有成功写入。建议稍后再次尝试或联系站点管理员！\"}");
                    }
                    else
                    {
                        context.Response.Write("{\"code\":200,\"message\":\"操作成功结束，受影响的记录：" + result.ToString() + "\"}");
                    }
                    break;
                case "/admin/getMessage": //留言墙信息的后台拉取过程
                    CheckPermission(context);
                    sqlda = new SqlDataAdapter("select * from msgform", sqlcon);
                    ds = new DataSet();
                    sqlda.Fill(ds);
                    context.Response.Write(GetJsonByDataset(ds));
                    break;
                case "/admin/delMessage": //留言墙信息的移除过程设计
                    ForceUsePost(context);
                    CheckPermission(context);
                    string msg_id = context.Request.Form["id"].ToString();
                    if (String.IsNullOrEmpty(msg_id))
                    {
                        context.Response.Write("{\"code\":405,\"message\":\"没有传入留言ID，请核实后再次尝试。\"}");
                        return;
                    }
                    sqlcmd = new SqlCommand("delete from msgform where [id] = " + msg_id, sqlcon);
                    sqlcon.Open();
                    result = sqlcmd.ExecuteNonQuery();
                    if (result != 1)
                    {
                        context.Response.Write("{\"code\":500,\"message\":\"数据库操作失败，没有成功写入。建议稍后再次尝试或联系站点管理员！" + result.ToString() + "\"}");
                    }
                    else
                    {
                        context.Response.Write("{\"code\":200,\"message\":\"操作成功结束，受影响的记录：" + result.ToString() + "\"}");
                    }
                    break;
                case "/admin/setBGM": //网站背景音乐的设置
                    ForceUsePost(context);
                    CheckPermission(context);
                    string runlevel = context.Request.Form["runlevel"].ToString();
                    string audioName = context.Request.Form["audioName"].ToString();
                    string audioAuthor = context.Request.Form["audioAuthor"].ToString();
                    string audioReferer = context.Request.Form["audioReferer"].ToString();
                    string audioUrl = context.Request.Form["audioUrl"].ToString();
                    if(String.IsNullOrEmpty(runlevel))
                    {
                        context.Response.Write("{\"code\":405,\"message\":\"没有传入操作特征码，操作阻断成功。\"}");
                        return;
                    }
                    string json_bgm_configure_text;
                    switch (runlevel)
                    {
                        case "1":
                            json_bgm_configure_text = "{\"status\":1,\"musicName\":\"" + audioName + "\",\"musicAuthor\":\"" + audioAuthor + "\",\"musicReferer\":\"" + audioReferer + "\",\"musicUrl\":\"" + audioUrl + "\"}";
                            File.WriteAllText(GetRootPath() + "bgm.json", json_bgm_configure_text); //写入配置文件
                            context.Response.Write("{\"code\":200,\"message\":\"操作成功\"}");
                            break;
                        case "0":
                            json_bgm_configure_text = "{\"status\":0,\"musicName\":\"" + audioName + "\",\"musicAuthor\":\"" + audioAuthor + "\",\"musicReferer\":\"" + audioReferer + "\",\"musicUrl\":\"" + audioUrl + "\"}";
                            File.WriteAllText(GetRootPath() + "bgm.json", json_bgm_configure_text); //写入配置文件
                            context.Response.Write("{\"code\":200,\"message\":\"操作成功\"}");
                            break;
                        default:
                            context.Response.Write("{\"code\":405,\"message\":\"无效的操作特征码，操作阻断成功。\"}");
                            break;
                    }
                    break;
                case "/content": //预留用于后期pjax的设计需求
                    context.Response.Write("{\"code\":200,\"message\":\"内容加载正常\"}");
                    break;
                default: //无法匹配任何预定义的pathinfo时实现请求拦截
                    CheckPermission(context);
                    context.Response.Write("{\"code\":500,\"message\":\"无效的接口请求方法：" + context.Request.PathInfo + "\"}");
                    break;
            }
            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        //  <summary>
        /// 小丁工作室统一身份认证平台登录模型构造
        /// </summary>
        /// <param name="username">用户账号</param>
        /// <param name="password">用户密码</param>
        /// <param name="context">会话句柄</param>
        /// <returns>json格式的字符串</returns>
        public void doLogin(string username, string password, HttpContext context)
        {
            if (String.IsNullOrEmpty(username) || String.IsNullOrEmpty(password))
            {
                context.Response.Write("{\"code\":405,\"message\":\"用户名或密码不能为空！\"}");
            }
            else
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://passport.dingstudio.cn/sso/api?format=ajaxlogin");
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = Encoding.UTF8.GetByteCount("username=" + username + "&userpwd=" + password + "&cors_domain=localapp");
                request.KeepAlive = false;
                request.ProtocolVersion = HttpVersion.Version10;
                String post_data = "username=" + username + "&userpwd=" + password + "&cors_domain=localapp";
                using (StreamWriter dataStream = new StreamWriter(request.GetRequestStream()))
                {
                    dataStream.Write(post_data);
                    dataStream.Close();
                }
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                string encoding = response.ContentEncoding;
                if (encoding == null || encoding.Length < 1)
                {
                    encoding = "UTF-8"; //设置UTF-8为默认编码  
                }
                StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.GetEncoding(encoding));
                string retString = reader.ReadToEnd();
                JObject jo = (JObject)JsonConvert.DeserializeObject(retString);
                string login_result = jo["data"]["authcode"].ToString();
                string requestId = jo["requestID"].ToString();
                if (login_result.Equals("1"))
                {
                    HttpCookie token = new HttpCookie("token");
                    token.Value = requestId;
                    context.Response.SetCookie(token);
                    context.Response.Write("{\"code\":200,\"message\":\"登录成功！身份验证通过。\"}");
                }
                else
                {
                    context.Response.Write("{\"code\":403,\"message\":\"用户名或密码不正确，请重试。\"}");
                }
            }
        }

        //  <summary>
        /// 把dataset数据转换成json的格式
        /// </summary>
        /// <param name="ds">dataset数据集</param>
        /// <returns>json格式的字符串</returns>
        public static string GetJsonByDataset(DataSet ds)
        {
            if (ds == null || ds.Tables.Count <= 0 || ds.Tables[0].Rows.Count <= 0)
            {
                //如果查询到的数据为空则返回标记code=503
                return "{\"code\":503,\"message\":\"数据接口异常，请联系站点管理员。\"}";
            }
            StringBuilder sb = new StringBuilder();
            sb.Append("{\"code\":200,\"message\":\"数据拉取完毕，操作成功结束。\",");
            foreach (DataTable dt in ds.Tables)
            {
                sb.Append(string.Format("\"{0}\":[", dt.TableName));

                foreach (DataRow dr in dt.Rows)
                {
                    sb.Append("{");
                    for (int i = 0; i < dr.Table.Columns.Count; i++)
                    {
                        sb.AppendFormat("\"{0}\":\"{1}\",", dr.Table.Columns[i].ColumnName.Replace("\"", "\\\"").Replace("\'", "\\\'"), ObjToStr(dr[i]).Replace("\"", "\\\"").Replace("\'", "\\\'")).Replace(Convert.ToString((char)13), "\\r\\n").Replace(Convert.ToString((char)10), "\\r\\n");
                    }
                    sb.Remove(sb.ToString().LastIndexOf(','), 1);
                    sb.Append("},");
                }

                sb.Remove(sb.ToString().LastIndexOf(','), 1);
                sb.Append("],");
            }
            sb.Remove(sb.ToString().LastIndexOf(','), 1);
            sb.Append("}");
            return sb.ToString();
        }

        /// <summary>
        /// 将object转换成为string
        /// </summary>
        /// <param name="ob">obj对象</param>
        /// <returns></returns>
        public static string ObjToStr(object ob)
        {
            if (ob == null)
            {
                return string.Empty;
            }
            else
                return ob.ToString();
        }
        //相应的jQuery读取json方式

        /// <summary>
        /// 取得网站根目录的物理路径
        /// </summary>
        /// <returns></returns>
        public static string GetRootPath()
        {
            string AppPath = "";
            HttpContext HttpCurrent = HttpContext.Current;
            if (HttpCurrent != null)
            {
                AppPath = HttpCurrent.Server.MapPath("~");
            }
            else
            {
                AppPath = AppDomain.CurrentDomain.BaseDirectory;
                if (Regex.Match(AppPath, @"\\$", RegexOptions.Compiled).Success)
                    AppPath = AppPath.Substring(0, AppPath.Length - 1);
            }
            return AppPath;
        }
    }
}