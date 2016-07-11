using System;
using System.Web;

namespace Telogical.CISLogin.Web.Models
{
    public class SessionModel
    {
        private const int TIMEOUT_IN_MINUTES = 120;
        private readonly HttpRequestBase _httpRequestBase;
        private readonly HttpResponseBase _httpResponseBase;

        public SessionModel()
        {
            
        }

        public SessionModel(HttpContextBase httpContext)
        {
            _httpRequestBase = httpContext.Request;
            _httpResponseBase = httpContext.Response;
        }

        public virtual void Clear()
        {
            _httpRequestBase.Cookies.Clear();

        }

        public virtual void Create(string user)
        {
            _httpResponseBase.Cookies.Add(new HttpCookie("login", user)
                                              {
                                                  Expires = DateTime.Now.AddMinutes(TIMEOUT_IN_MINUTES)
                                              });
        }

        public virtual bool Has()
        {
            return _httpRequestBase.Cookies.Get("login").ExistsAndHasUserInformation();
        }

        public virtual string Get()
        {
            return Has()
                       ? _httpRequestBase.Cookies.Get("login").Value
                       : null;
        }
    }

    static class SessionModelHelper
    {
        public static bool ExistsAndHasUserInformation(this HttpCookie cookie)
        {
            return cookie != null && !string.IsNullOrEmpty(cookie.Value);
        }
    }
}