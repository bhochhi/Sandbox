using System;
using System.Web;

namespace Telogical.CISLogin.Web.Models
{
    public class SessionModel
    {
        private readonly IPersistenceContext _context;
        private const int TIMEOUT_IN_MINUTES = 120;

        public SessionModel()
        {
            
        }

        public SessionModel(IPersistenceContext context)
        {
            _context = context;
        }

        public virtual void Clear()
        {
            _context.Clear();
        }

        public virtual void Create(string user)
        {
            _context.Create("login", user, TIMEOUT_IN_MINUTES);
        }

        public virtual bool Has()
        {
            return _context.Has("login");
        }

        public virtual string Get()
        {
            return _context.Get("login");
        }
    }

    public interface IPersistenceContext
    {
        void Clear();
        void Create(string name, string value, int timeoutMinutes);
        bool Has(string name);
        string Get(string name);
    }

    public class CookieContext : IPersistenceContext
    {
        private readonly IHttpCookie _httpCookie;
        private readonly IEncoder _encoder;
        private readonly IDate _date;

        public CookieContext()
        {
            
        }

        public CookieContext(IHttpCookie httpCookie, IEncoder encoder, IDate date)
        {
            _httpCookie = httpCookie;
            _encoder = encoder;
            _date = date;
        }

        public void Clear()
        {
            _httpCookie.Clear();
        }

        public void Create(string name, string value, int timeoutMinutes)
        {
            var encryptedValue = _encoder.Encrypt(value);
            var cookieToAdd = new System.Web.HttpCookie(name, encryptedValue)
                                  {
                                      Expires = _date.AddMinutes(timeoutMinutes)
                                  };
            _httpCookie.Add(cookieToAdd);
        }

        public bool Has(string name)
        {
            var cookie = _httpCookie.Get(name);
            return ExistsAndHasUserInformation(cookie) && _encoder.CanDecrypt(cookie.Value);
        }

        private static bool ExistsAndHasUserInformation(System.Web.HttpCookie cookie)
        {
            return cookie != null && !string.IsNullOrEmpty(cookie.Value);
        }

        public string Get(string name)
        {
            var cookie = _httpCookie.Get(name);
            return Has(name)
                       ? _encoder.Decrypt(cookie.Value)
                       : string.Empty;
        }
    }

    public interface IEncoder
    {
        string Encrypt(string textToEncrypt);
        bool CanDecrypt(string textToDecrypt);
        string Decrypt(string textToDecrypt);
    }

    public class Encoder : IEncoder
    {
        public string Encrypt(string textToEncrypt)
        {
            return Convert.ToBase64String(System.Text.Encoding.Unicode.GetBytes((textToEncrypt)));
        }
        public bool CanDecrypt(string textToDecrypt)
        {
            return true;
        }
        public string Decrypt(string textToDecrypt)
        {
            return System.Text.Encoding.Unicode.GetString(Convert.FromBase64String(textToDecrypt));
        }
    }

    public interface IHttpCookie
    {
        void Clear();
        void Add(System.Web.HttpCookie cookie);
        System.Web.HttpCookie Get(string name);
    }

    public class HttpCookie : IHttpCookie
    {
        private readonly HttpContextBase _httpContextBase;

        public HttpCookie(){}

        public HttpCookie(HttpContextBase httpContextBase)
        {
            _httpContextBase = httpContextBase;
        }

        public void Clear()
        {
            _httpContextBase.Request.Cookies.Clear();
        }

        public void Add(System.Web.HttpCookie cookie)
        {
            _httpContextBase.Response.Cookies.Add(cookie);
        }

        public System.Web.HttpCookie Get(string name)
        {
            return _httpContextBase.Request.Cookies.Get(name);
        }
    }

    public interface IDate
    {
        DateTime AddMinutes(int minutes);
    }

    public class Date:IDate
    {
        private DateTime _date;

        public Date(DateTime date)
        {
            _date = date;
        }

        public DateTime AddMinutes(int minutes)
        {
            _date = _date.AddMinutes(minutes);
            return _date;
        }
    }
}