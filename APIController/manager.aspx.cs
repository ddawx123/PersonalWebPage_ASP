using System;
using System.Collections.Generic;

using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace APIController
{
    public partial class manager : System.Web.UI.Page
    {
        string session_token; //创建会话ID变量

        protected string MyNowYear = DateTime.Now.Year.ToString();

        protected void Page_Load(object sender, EventArgs e)
        {
            
            switch (Request.PathInfo)
            {
                case "/index":
                    if (Request.Cookies["token"] == null)
                    {
                        Response.Redirect("../login.html?hostname=" + Request.UserHostName);
                        return;
                    }
                    session_token = Request.Cookies["token"].ToString();
                    break;
                case "/logout":
                    if (Request.Cookies["token"] != null)
                    {
                        HttpCookie token = Request.Cookies["token"];
                        TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                        token.Expires = DateTime.Now.Add(ts);
                        Response.AppendCookie(token);
                        Response.Redirect("../login.html?hostname=" + Request.UserHostName);
                    }
                    else
                    {
                        Response.Redirect("./manager.aspx/index");
                    }
                    break;
                default:
                    Response.Redirect("./manager.aspx/index");
                    break;
            }
        }
    }
}