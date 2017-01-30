using System;
using System.Configuration;
using System.Web;
using System.Web.Mvc;
using MyLogical.MyLogin.Services;
using MyLogical.MyLogin.Services.Login;
using MyLogical.MyLogin.Services.UrlGeneration;
using MyLogical.MyLogin.Services.Validation;
using MyLogical.MyLogin.Web.Models;
using HttpCookie = MyLogical.MyLogin.Web.Models.HttpCookie;

namespace MyLogical.MyLogin.Web.Controllers
{

    [HandleError]
    public class LoginController : Controller
    {
        private readonly IValidation _validation;
        private readonly IUrlGeneration _urlGeneration;
        private readonly ILogin _login;

//        public LoginController()
//            : this(
//            new Validation(),
//            new UrlGeneration(
//                new UserRepository(
//                    ConfigurationManager.ConnectionStrings["UserRepository"].ConnectionString),
//                new TicketGeneration()),
//            new Login(
//                new UserRepository(
//                    ConfigurationManager.ConnectionStrings["UserRepository"].ConnectionString)
//                ))
//        {
//        }

        public LoginController(IValidation validation, IUrlGeneration urlGeneration, ILogin login)
        {
            _validation = validation;
            _urlGeneration = urlGeneration;
            _login = login;
        }

        private HttpRequestBase _httpRequestBase;
        public HttpRequestBase HttpRequestBase
        {
            get { return _httpRequestBase ?? (_httpRequestBase = Request); }
            set { _httpRequestBase = value; }
        }

        private SessionModel _sessionModel;
        public SessionModel SessionModel
        {
            get { return _sessionModel ?? (_sessionModel = new SessionModel(new CookieContext(new HttpCookie(HttpContext), new Encoder(), new Date(DateTime.Now)))); }
            set { _sessionModel = value; }
        }

        private string parseBrowserType()
        {
            return HttpRequestBase.Browser.Browser;
        }
        private string parseBitVersion()
        {
            return HttpRequestBase.UserAgent;
        }
        
        public ActionResult Login(string documentName, string bookmark, string client)
        {
            if (client.Equals(string.Empty)) client = "ajax";
            if (_validation.CanValidate(parseBrowserType(), parseBitVersion(), documentName, client))
            {
                if (SessionModel.Has()) return redirect(documentName, bookmark, SessionModel.Get(), client);
                return View("Login");
            }

            var error = _validation.GetValidatorError(parseBrowserType(), parseBitVersion(), documentName, client);
            var errorModel = new ErrorModel() {Message = error.ErrorMessage};
            return View("Error", errorModel);
        }

        [HttpPost]
        public ActionResult Login(string documentName, string bookmark, string client, LogOnModel loginModel)
        {
            SessionModel.Clear();
            if (_login.CanLogin(loginModel.UserName, loginModel.Password))
            {
                if(loginModel.RememberMe) SessionModel.Create(loginModel.UserName);
                return redirect(documentName, bookmark, loginModel.UserName, client);
            }

            loginModel.ErrorMessage = "Invalid Username or Password";
            return View("Login", loginModel);
        }

        private RedirectResult redirect(string documentName, string bookmark, string username, string client)
        {
            return Redirect(
                    _urlGeneration.GetUrlToRedirect(
                        username, documentName, bookmark, client
                        ));
        }
    }
}
