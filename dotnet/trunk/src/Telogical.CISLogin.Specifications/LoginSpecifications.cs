using System;
using System.Web;
using System.Web.Mvc;
using Moq;
using NUnit.Framework;
using MyLogical.MyLogin.Services;
using MyLogical.MyLogin.Services.Login;
using MyLogical.MyLogin.Services.UrlGeneration;
using MyLogical.MyLogin.Services.Validation;
using MyLogical.MyLogin.Services.Validation.Validators;
using MyLogical.MyLogin.Web.Controllers;
using MyLogical.MyLogin.Web.Models;
using MyLogical.Framework.Specifications;
using HttpCookie = System.Web.HttpCookie;

namespace MyLogical.MyLogin.Specifications
{

    public class When_navigating_to_the_login_page
        : Specification
    {
        protected LoginController loginController;
        protected ViewResult viewResult;

        protected Mock<IValidation> ValidationService;
        protected Mock<ILogin> LoginServices;
        protected Mock<IUrlGeneration> UrlGenerationService;
        protected static Mock<HttpRequestBase> HttpRequestBase;
        protected static Mock<SessionModel> LoginSession;

        public override void Given()
        {
            ValidationService = new Mock<IValidation>();
            LoginServices = new Mock<ILogin>();
            UrlGenerationService = new Mock<IUrlGeneration>();
            HttpRequestBase = new Mock<HttpRequestBase>();
            LoginSession = new Mock<SessionModel>();
        }

        public override void When()
        {
        }
    }

    public class User_had_not_already_successfully_logged_in
        : When_navigating_to_the_login_page
    {
        public override void Given()
        {
            base.Given();
            LoginSession.Setup(l => l.Has()).Returns(false);
        }
    }

    [TestFixture]
    public class With_an_acceptable_browser_and_a_valid_document_name_but_not_attempted_to_login
        : User_had_not_already_successfully_logged_in
    {

        public override void Given()
        {
            base.Given();

            var validatorModel = new Mock<ValidatorModel>();
            validatorModel.Setup(e => e.HasError).Returns(false);
            validatorModel.Setup(e => e.ErrorMessage).Returns(string.Empty);

            ValidationService.Setup(c => c.CanValidate("ValidBrowser", "ValidBitVersion", "ValidDocumentName","ValidClient")).Returns(true);
            ValidationService.Setup(d => d.GetValidatorError("ValidBrowser", "ValidBitVersion", "ValidDocumentName", "ValidClient")).Returns(validatorModel.Object);

            HttpRequestBase.Setup(h => h.Browser.Browser).Returns("ValidBrowser");
            HttpRequestBase.Setup(h => h.UserAgent).Returns("ValidBitVersion");

            loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
            loginController.HttpRequestBase = HttpRequestBase.Object;
            loginController.SessionModel = LoginSession.Object;
        }

        public override void When()
        {
            viewResult = loginController.Login("ValidDocumentName", "Bookmark", "ValidClient") as ViewResult;
        }

        [Test]
        public virtual void It_will_display_the_login_page()
        {
            viewResult.ViewName.ShouldEqual("Login");
        }
    }

    [TestFixture]
    public class Without_an_acceptable_browser_before_previously_logging_in
        : User_had_not_already_successfully_logged_in
    {
        public override void Given()
        {
            base.Given();

            var validatorModel = new Mock<ValidatorModel>();
            validatorModel.Setup(e => e.HasError).Returns(true);
            validatorModel.Setup(e => e.ErrorMessage).Returns("Unacceptable Browser");

            ValidationService.Setup(c => c.CanValidate("InvalidBrowser", "BitVersion", "DocumentName", "ValidClient")).Returns(false);
            ValidationService.Setup(d => d.GetValidatorError("InvalidBrowser", "BitVersion", "DocumentName", "ValidClient")).Returns(validatorModel.Object);

            HttpRequestBase.Setup(h => h.Browser.Browser).Returns("InvalidBrowser");
            HttpRequestBase.Setup(h => h.UserAgent).Returns("BitVersion");

            loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
            loginController.HttpRequestBase = HttpRequestBase.Object;
            loginController.SessionModel = LoginSession.Object;
        }

        public override void When()
        {
            viewResult = loginController.Login("DocumentName", "Bookmark", "ValidClient") as ViewResult;
        }

        [Test]
        public void It_will_display_the_error_page()
        {
            viewResult.ViewName.ShouldEqual("Error");
        }

        [Test]
        public void It_will_display_unacceptable_browser_error_message()
        {
            (viewResult.ViewData.Model as ErrorModel).Message.ShouldEqual("Unacceptable Browser");
        }
    }

    [TestFixture]
    public class Without_a_valid_document_name_before_previously_logging_in
        : User_had_not_already_successfully_logged_in
    {
        public override void Given()
        {
            base.Given();

            var validatorModel = new Mock<ValidatorModel>();
            validatorModel.Setup(e => e.HasError).Returns(true);
            validatorModel.Setup(e => e.ErrorMessage).Returns("Invalid Document");

            ValidationService.Setup(c => c.CanValidate("Browser", "BitVersion", "InvalidDocumentName", "ValidClient")).Returns(false);
            ValidationService.Setup(d => d.GetValidatorError("Browser", "BitVersion", "InvalidDocumentName", "ValidClient")).Returns(validatorModel.Object);

            HttpRequestBase.Setup(h => h.Browser.Browser).Returns("Browser");
            HttpRequestBase.Setup(h => h.UserAgent).Returns("BitVersion");

            loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
            loginController.HttpRequestBase = HttpRequestBase.Object;
            loginController.SessionModel = LoginSession.Object;
        }

        public override void When()
        {
            viewResult = loginController.Login("InvalidDocumentName", "Bookmark", "ValidClient") as ViewResult;
        }

        [Test]
        public void It_will_display_the_error_page()
        {
            viewResult.ViewName.ShouldEqual("Error");
        }

        [Test]
        public void It_will_display_invalid_document_name_message()
        {
            (viewResult.ViewData.Model as ErrorModel).Message.ShouldEqual("Invalid Document");
        }
    }

    public class With_an_acceptable_browser_and_a_valid_document_name_and_has_attempted_to_login
        : User_had_not_already_successfully_logged_in
    {

        public override void Given()
        {
            base.Given();

            var validatorModel = new Mock<ValidatorModel>();
            validatorModel.Setup(e => e.HasError).Returns(false);
            validatorModel.Setup(e => e.ErrorMessage).Returns(string.Empty);

            ValidationService.Setup(c => c.CanValidate("ValidBrowser", "ValidBitVersion", "ValidDocumentName", "ValidClient")).Returns(true);
            ValidationService.Setup(d => d.GetValidatorError("ValidBrowser", "ValidBitVersion", "ValidDocumentName", "ValidClient")).Returns(validatorModel.Object);

            HttpRequestBase.Setup(h => h.Browser.Browser).Returns("ValidBrowser");
            HttpRequestBase.Setup(h => h.UserAgent).Returns("ValidBitVersion");

            loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
            loginController.HttpRequestBase = HttpRequestBase.Object;
            loginController.SessionModel = LoginSession.Object;
        }

        public override void When()
        {
            viewResult = loginController.Login("ValidDocumentName", "Bookmark", "ValidClient") as ViewResult;
        }
    }

    [TestFixture]
    public class When_user_submits_invalid_login_info
        : With_an_acceptable_browser_and_a_valid_document_name_and_has_attempted_to_login
    {
        private LogOnModel logonModel;
        public override void Given()
        {
            base.Given();
            logonModel = new LogOnModel();
            logonModel.UserName = "user";
            logonModel.Password = "password";
            LoginServices.Setup(d => d.CanLogin("InvalidUser", "InvalidPassword")).Returns(false);
        }

        public override void When()
        {
            viewResult = loginController.Login("ValidDocumentName", "Bookmark", "ValidClient", logonModel) as ViewResult;
        }

        [Test]
        public void It_shows_the_login_page()
        {
            viewResult.ViewName.ShouldEqual("Login");
        }

        [Test]
        public void It_shows_failed_login_error_message()
        {
            (viewResult.ViewData.Model as LogOnModel).ErrorMessage.ShouldEqual("Invalid Username or Password");
        }
    }

    [TestFixture]
    public class When_user_submits_empty_login_info
        : With_an_acceptable_browser_and_a_valid_document_name_and_has_attempted_to_login
    {
        private LogOnModel logonModel;
        public override void Given()
        {
            base.Given();
            logonModel = new LogOnModel();
            logonModel.UserName = null;
            logonModel.Password = null;
            LoginServices.Setup(d => d.CanLogin(null, null)).Returns(false);
        }

        public override void When()
        {
            viewResult = loginController.Login("ValidDocumentName", "Bookmark", "ValidClient", logonModel) as ViewResult;
        }

        [Test]
        public void It_shows_the_login_page()
        {
            viewResult.ViewName.ShouldEqual("Login");
        }

        [Test]
        public void It_shows_failed_login_error_message()
        {
            (viewResult.ViewData.Model as LogOnModel).ErrorMessage.ShouldEqual("Invalid Username or Password");
        }
    }

    [TestFixture]
    public class When_user_submits_valid_login_info_and_does_not_check_remember_me
        : With_an_acceptable_browser_and_a_valid_document_name_and_has_attempted_to_login
    {
        LogOnModel logonModel;
        private RedirectResult redirectResult;

        public override void Given()
        {
            base.Given();
            logonModel = new LogOnModel();
            logonModel.UserName = "ValidUsername";
            logonModel.Password = "ValidPassword";
            logonModel.RememberMe = false;

            LoginServices.Setup(d => d.CanLogin("ValidUsername", "ValidPassword")).Returns(true);
            UrlGenerationService.Setup(d => d.GetUrlToRedirect("ValidUsername", "ValidDocumentName", "Bookmark", "ValidClient")).Returns("ValidUrl");
        }

        public override void When()
        {
            redirectResult = loginController.Login("ValidDocumentName", "Bookmark", "ValidClient", logonModel) as RedirectResult;
        }

        [Test]
        public void It_should_redirect_to_qlikview()
        {
            redirectResult.Url.ShouldContain("ValidUrl");
        }

        [Test]
        public void It_should_not_remember_the_session()
        {
            loginController.SessionModel.Has().ShouldBeFalse();
        }
    }

    public class User_had_already_successfully_logged_in : When_navigating_to_the_login_page
    {
        public override void Given()
        {
            base.Given();
            LoginSession.Setup(l => l.Has()).Returns(true);
            LoginSession.Setup(l => l.Get()).Returns("ValidUsername");
        }
    }

    [TestFixture]
    public class With_an_acceptable_browser_and_a_valid_document_name
        : User_had_already_successfully_logged_in
    {
        private RedirectResult redirectResult;

        public override void Given()
        {
            base.Given();

            var validatorModel = new Mock<ValidatorModel>();
            validatorModel.Setup(e => e.HasError).Returns(false);
            validatorModel.Setup(e => e.ErrorMessage).Returns(string.Empty);

            ValidationService.Setup(c => c.CanValidate("ValidBrowser", "ValidBitVersion", "ValidDocumentName", "ValidClient")).Returns(true);
            ValidationService.Setup(d => d.GetValidatorError("ValidBrowser", "ValidBitVersion", "ValidDocumentName", "ValidClient")).Returns(validatorModel.Object);

            HttpRequestBase.Setup(h => h.Browser.Browser).Returns("ValidBrowser");
            HttpRequestBase.Setup(h => h.UserAgent).Returns("ValidBitVersion");

            loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
            loginController.HttpRequestBase = HttpRequestBase.Object;
            loginController.SessionModel = LoginSession.Object;

            LoginServices.Setup(d => d.CanLogin("ValidUsername", "ValidPassword")).Returns(true);
            UrlGenerationService.Setup(d => d.GetUrlToRedirect("ValidUsername", "ValidDocumentName", "Bookmark", "ValidClient")).Returns("ValidUrl");
        }

        public override void When()
        {
            redirectResult = loginController.Login("ValidDocumentName", "Bookmark", "ValidClient") as RedirectResult;
        }

        [Test]
        public void It_should_redirect_to_qlikview()
        {
            redirectResult.Url.ShouldContain("ValidUrl");
        }
    }

    [TestFixture]
    public class Without_an_acceptable_browser_after_previously_logging_in
        : User_had_already_successfully_logged_in
    {
        public override void Given()
        {
            base.Given();

            var validatorModel = new Mock<ValidatorModel>();
            validatorModel.Setup(e => e.HasError).Returns(true);
            validatorModel.Setup(e => e.ErrorMessage).Returns("Unacceptable Browser");

            ValidationService.Setup(c => c.CanValidate("InvalidBrowser", "BitVersion", "DocumentName", "ValidClient")).Returns(false);
            ValidationService.Setup(d => d.GetValidatorError("InvalidBrowser", "BitVersion", "DocumentName", "ValidClient")).Returns(validatorModel.Object);

            HttpRequestBase.Setup(h => h.Browser.Browser).Returns("InvalidBrowser");
            HttpRequestBase.Setup(h => h.UserAgent).Returns("BitVersion");

            loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
            loginController.HttpRequestBase = HttpRequestBase.Object;
            loginController.SessionModel = LoginSession.Object;
        }

        public override void When()
        {
            viewResult = loginController.Login("DocumentName", "Bookmark", "ValidClient") as ViewResult;
        }

        [Test]
        public void It_will_display_the_error_page()
        {
            viewResult.ViewName.ShouldEqual("Error");
        }

        [Test]
        public void It_will_display_unacceptable_browser_error_message()
        {
            (viewResult.ViewData.Model as ErrorModel).Message.ShouldEqual("Unacceptable Browser");
        }
    }

    [TestFixture]
    public class Without_a_valid_document_name_after_previously_logging_in
        : User_had_already_successfully_logged_in
    {
        public override void Given()
        {
            base.Given();

            var validatorModel = new Mock<ValidatorModel>();
            validatorModel.Setup(e => e.HasError).Returns(true);
            validatorModel.Setup(e => e.ErrorMessage).Returns("Invalid Document");

            ValidationService.Setup(c => c.CanValidate("Browser", "BitVersion", "InvalidDocumentName", "ValidClient")).Returns(false);
            ValidationService.Setup(d => d.GetValidatorError("Browser", "BitVersion", "InvalidDocumentName", "ValidClient")).Returns(validatorModel.Object);

            HttpRequestBase.Setup(h => h.Browser.Browser).Returns("Browser");
            HttpRequestBase.Setup(h => h.UserAgent).Returns("BitVersion");

            loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
            loginController.HttpRequestBase = HttpRequestBase.Object;
            loginController.SessionModel = LoginSession.Object;
        }

        public override void When()
        {
            viewResult = loginController.Login("InvalidDocumentName", "Bookmark", "ValidClient") as ViewResult;
        }

        [Test]
        public void It_will_display_the_error_page()
        {
            viewResult.ViewName.ShouldEqual("Error");
        }

        [Test]
        public void It_will_display_invalid_document_name_message()
        {
            (viewResult.ViewData.Model as ErrorModel).Message.ShouldEqual("Invalid Document");
        }
    }




    public class When_a_user_logs_in
        : Specification
    {
        protected Login Login;
        protected bool CanLogin;
        protected User User;
        protected User AuthenticatedUser;
        protected Mock<UserRepository> MockUserRepository;
        public override void Given()
        {
            MockUserRepository = new Mock<UserRepository>();
            User = new User();
            Login = new Login(MockUserRepository.Object);
        }

        public override void When()
        {
            MockUserRepository.Setup(u => u.GetUserFromUsername("ValidUsername")).Returns(User);
        }
    }

    [TestFixture]
    public class With_a_valid_username_and_password
        : When_a_user_logs_in
    {
        public override void Given()
        {
            base.Given();
            User = new User("ValidUsername", "ValidPassword", "ValidADName", "ValidGroupId");
        }

        public override void When()
        {
            base.When();
            CanLogin = Login.CanLogin("ValidUsername", "ValidPassword");
            AuthenticatedUser = Login.GetAuthenticatedUser("ValidUsername", "ValidPassword");
        }

        [Test]
        public void The_user_can_log_in()
        {
            CanLogin.ShouldBeTrue();
        }

        [Test]
        public void A_valid_active_directory_name_will_be_returned()
        {
            AuthenticatedUser.ActiveDirectoryName.ShouldNotBeEmpty();
        }
    }

    [TestFixture]
    public class With_a_valid_username_and_invalid_password 
        : When_a_user_logs_in
    {
        public override void When()
        {
            base.When();
            CanLogin = Login.CanLogin("ValidUsername", "InvalidPassword");
            AuthenticatedUser = Login.GetAuthenticatedUser("ValidUsername", "InvalidPassword");
        }

        [Test]
        public void The_user_can_not_log_in()
        {
            CanLogin.ShouldBeFalse();
        }

        [Test]
        public void A_valid_active_directory_name_will_not_be_returned()
        {
            AuthenticatedUser.ActiveDirectoryName.ShouldBeEmpty();
        }
    }

    [TestFixture]
    public class With_an_invalid_username_and_valid_password 
        : When_a_user_logs_in
    {
        public override void When()
        {
            base.When();
            CanLogin = Login.CanLogin("InvalidUsername", "ValidPassword");
            AuthenticatedUser = Login.GetAuthenticatedUser("ValidUsername", "InvalidPassword");
        }

        [Test]
        public void The_user_can_not_log_in()
        {
            CanLogin.ShouldBeFalse();
        }

        [Test]
        public void A_valid_active_directory_name_will_not_be_returned()
        {
            AuthenticatedUser.ActiveDirectoryName.ShouldBeEmpty();
        }
    }

    [TestFixture]
    public class With_an_invalid_username_and_invalid_password 
        : When_a_user_logs_in
    {
        public override void When()
        {
            base.When();
            CanLogin = Login.CanLogin("InvalidUsername", "InvalidPassword");
            AuthenticatedUser = Login.GetAuthenticatedUser("ValidUsername", "InvalidPassword");
        }

        [Test]
        public void The_user_can_not_log_in()
        {
            CanLogin.ShouldBeFalse();
        }

        [Test]
        public void A_valid_active_directory_name_will_not_be_returned()
        {
            AuthenticatedUser.ActiveDirectoryName.ShouldBeEmpty();
        }
    }




    public class When_detecting_a_browser
    : Specification
    {
        protected BrowserDetection BrowserDetection;
        protected bool IsUnacceptableBrowser;

        public override void Given()
        {
        }

        public override void When()
        {
            IsUnacceptableBrowser = BrowserDetection.HasError();
        }
    }

    [TestFixture]
    public class With_an_acceptable_web_browser_type_and_bit_version
        : When_detecting_a_browser
    {
        public override void Given()
        {
            base.Given();
            BrowserDetection = new BrowserDetection("IE", "Browser");
        }

        [Test]
        public void The_browser_is_accepted()
        {
            IsUnacceptableBrowser.ShouldBeFalse();
        }

        [Test]
        public void The_error_message_is_available_to_be_shown()
        {
            BrowserDetection.HasError().ShouldBeFalse();
        }
    }

    [TestFixture]
    public class With_an_acceptable_web_browser_type_and_unacceptable_bit_version
        : When_detecting_a_browser
    {
        public override void Given()
        {
            base.Given();
            BrowserDetection = new BrowserDetection("IE", "browser x64");
        }

        [Test]
        public void The_browser_is_not_acceptable()
        {
            IsUnacceptableBrowser.ShouldBeTrue();
        }

        [Test]
        public void The_error_message_is_available_to_be_shown()
        {
            BrowserDetection.HasError().ShouldBeTrue();
            BrowserDetection.GetError().ShouldNotBeNull();
            BrowserDetection.GetError().ErrorMessage.ShouldContain("This application requires a 32-bit version of Microsoft Internet Explorer.");
        }
    }

    [TestFixture]
    public class With_an_unacceptable_web_browser_type_and_acceptable_bit_version
        : When_detecting_a_browser
    {
        public override void Given()
        {
            base.Given();
            BrowserDetection = new BrowserDetection("Firefox", "browser");
        }

        [Test]
        public void The_browser_is_not_acceptable()
        {
            IsUnacceptableBrowser.ShouldBeTrue();
        }

        [Test]
        public void The_error_message_is_available_to_be_shown()
        {
            BrowserDetection.HasError().ShouldBeTrue();
            BrowserDetection.GetError().ShouldNotBeNull();
            BrowserDetection.GetError().ErrorMessage.ShouldContain("This application requires a 32-bit version of Microsoft Internet Explorer.");
        }
    }

    [TestFixture]
    public class With_an_unacceptable_web_browser_type_and_unacceptable_bit_version
        : When_detecting_a_browser
    {
        public override void Given()
        {
            base.Given();
            BrowserDetection = new BrowserDetection("Safari", "browser x64");
        }

        [Test]
        public void The_browser_is_not_acceptable()
        {
            IsUnacceptableBrowser.ShouldBeTrue();
        }

        [Test]
        public void The_error_message_is_available_to_be_shown()
        {
            BrowserDetection.HasError().ShouldBeTrue();
            BrowserDetection.GetError().ShouldNotBeNull();
            BrowserDetection.GetError().ErrorMessage.ShouldContain("This application requires a 32-bit version of Microsoft Internet Explorer.");
        }
    }




    public class When_requesting_to_load_a_QV_document
    : Specification
    {
        protected ValidatorModel ValidatorModel;
        protected DocumentVerification DocumentVerification;
        protected Mock<DocumentRepository> DocumentRepository;
        public override void Given()
        {
            DocumentRepository = new Mock<DocumentRepository>();
        }

        public override void When()
        {
            ValidatorModel = DocumentVerification.GetError();
        }
    }

    [TestFixture]
    public class With_a_valid_document
        : When_requesting_to_load_a_QV_document
    {
        public override void Given()
        {
            base.Given();
            DocumentRepository.Setup(d => d.GetDocumentByName("ValidDocumentName")).Returns("ValidDocument");
            DocumentVerification = new DocumentVerification(DocumentRepository.Object, "ValidDocumentName");
        }

        [Test]
        public void An_error_will_not_occur()
        {
            ValidatorModel.HasError.ShouldBeFalse();
        }

        [Test]
        public void An_error_message_will_not_generate()
        {
            ValidatorModel.ErrorMessage.ShouldBeEmpty();
        }
    }

    [TestFixture]
    public class Without_a_valid_document
        : When_requesting_to_load_a_QV_document
    {
        public override void Given()
        {
            base.Given();
            DocumentRepository.Setup(d => d.GetDocumentByName("InvalidDocumentName")).Returns(string.Empty);
            DocumentVerification = new DocumentVerification(DocumentRepository.Object, "InvalidDocumentName");
        }

        [Test]
        public void An_error_will_occur()
        {
            ValidatorModel.HasError.ShouldBeTrue();
        }

        [Test]
        public void An_error_message_will_generate()
        {
            ValidatorModel.ErrorMessage.ShouldNotBeEmpty();
        }
    }




    public class When_requesting_a_ticket
    : Specification
    {
        protected TicketGeneration TicketGeneration;
        protected string Ticket;

        public override void Given()
        {
            Ticket = string.Empty;
        }

        public override void When()
        {

        }

    }

    [TestFixture]
    public class A_valid_ticket_request_will_be_sent_to_the_QlikView_server
        : When_requesting_a_ticket
    {
        public override void When()
        {
            var validUser = new User("Valid", "Valid", @"MyLogical\VBalasubramanian", "ValidGroupId");
            Ticket = TicketGeneration.GetTicket(validUser);
        }

        public override void Given()
        {
            base.Given();
            TicketGeneration = new TicketGeneration();
        }

        [Test]
        public void A_ticket_will_be_returned()
        {
            Ticket.ShouldNotBeEmpty();
        }
    }

    [TestFixture]
    public class An_invalid_ticket_request_will_be_sent_to_the_QlikView_server
        : When_requesting_a_ticket
    {
        public override void When()
        {
            var inValidUser = new User("Valid", "Valid", "", "ValidGroupId");
            Ticket = TicketGeneration.GetTicket(inValidUser);
        }

        public override void Given()
        {
            base.Given();
            TicketGeneration = new TicketGeneration();
        }

        [Test]
        public void A_ticket_will_not_be_returned()
        {
            Ticket.ShouldBeEmpty();
        }
    }



    public class When_requesting_a_url
    : Specification
    {
        protected string Url;
        protected UrlGeneration UrlGeneration;
        protected Mock<UserRepository> UserRepository;
        protected Mock<TicketGeneration> TicketGeneration;
        public override void Given()
        {
            Url = string.Empty;
            UserRepository = new Mock<UserRepository>();
            TicketGeneration = new Mock<TicketGeneration>();
            UrlGeneration = new UrlGeneration(UserRepository.Object, TicketGeneration.Object);
        }

        public override void When()
        {

        }
    }

    [TestFixture]
    public class A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present
        : When_requesting_a_url
    {
        public override void Given()
        {
            base.Given();
            var user = new User("ValidUserName", "ValidPassword", string.Empty, "ValidGroupId");
            UserRepository.Setup(u => u.GetUserFromUsername("ValidUserName")).Returns(user);
            TicketGeneration.Setup(t => t.GetTicket(user)).Returns("Ticket");
        }

        public override void When()
        {
            Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", string.Empty, "plugin");
        }

        [Test]
        public void A_valid_url_will_be_returned()
        {
            Url.ShouldContain("http://qlikview.MyLogical.com/qvplugin/opendoc2.htm?document=");
        }

        [Test]
        public void The_right_document_will_be_loaded_by_the_url()
        {
            Url.ShouldContain("document=ValidDocumentName");
        }
    }

    [TestFixture]
    public class With_bookmark_not_present
        : A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present
    {

        public override void When()
        {
            Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", string.Empty, "plugin");
        }

        [Test]
        public void The_bookmark_will_not_be_within_the_url_parameter()
        {
            Url.ShouldNotContain("?bookmark");
        }
    }

    [TestFixture]
    public class With_bookmark_present
        : A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present
    {
        public override void When()
        {
            Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", "Bookmark", "plugin");
        }

        [Test]
        public void The_bookmark_will_be_within_the_url_parameter()
        {
            Url.ShouldContain(@"?bookmark=Document\Bookmark");
        }
    }





    class When_loading_session_model:Specification
    {
        protected Mock<IPersistenceContext> Context = new Mock<IPersistenceContext>();
        protected SessionModel SessionModel;

        public override void Given()
        {
        }

        public override void When()
        {
            SessionModel = new SessionModel(Context.Object);
        }

    }

    class With_valid_session : When_loading_session_model
    {
        public override void Given()
        {
            base.Given();
            Context.Setup(c => c.Get("login")).Returns("value");
            Context.Setup(c => c.Has("login")).Returns(true);
            Context.Setup(c => c.Create("login", "user", 120)).Verifiable();
            Context.Setup(c => c.Clear()).Verifiable();
        }

        public override void When()
        {
            base.When();

            SessionModel.Clear();
            SessionModel.Create("user");
        }

        [Test]
        public void It_can_return_session()
        {
            SessionModel.Get().ShouldEqual("value");
        }

        [Test]
        public void It_knows_session_exists()
        {
            SessionModel.Has().ShouldEqual(true);
        }

        [Test]
        public void It_can_create_a_session()
        {
            Context.Verify(m => m.Create("login", "user", 120));
        }

        [Test]
        public void It_can_clear_session()
        {
            Context.Verify(m => m.Clear());
        }
    }

    class With_not_valid_session : When_loading_session_model
    {
        public override void Given()
        {
            base.Given();
            Context.Setup(c => c.Get("login")).Returns("");
            Context.Setup(c => c.Has("login")).Returns(false);
        }

        [Test]
        public void It_does_not_return_session_value()
        {
            SessionModel.Get().ShouldEqual(string.Empty);
        }

        [Test]
        public void It_does_not_show_session_value_exists()
        {
            SessionModel.Has().ShouldEqual(false);
        }
    }

    class When_loading_cookie_context:Specification
    {
        protected Mock<IHttpCookie> HttpCookie = new Mock<IHttpCookie>();
        protected Mock<IEncoder> Encoder = new Mock<IEncoder>();
        protected Mock<IDate> CustomDate = new Mock<IDate>();
        protected CookieContext CookieContext { get; set; }

        protected const string CookieName = "name";
        protected const string CookieValue = "value";
        protected const string CookieValueEncoded = "valueEncoded";
        protected const int CookieTimeout = 120;
        protected DateTime CookieExpiration = new DateTime(2000, 1, 1);

        private HttpCookie Cookie;

        public override void Given()
        {
            Cookie = new HttpCookie(CookieName, CookieValueEncoded) { Expires = CookieExpiration };
            CustomDate.Setup(c => c.AddMinutes(CookieTimeout)).Returns(CookieExpiration);
            Encoder.Setup(c => c.Encrypt(CookieValue)).Returns(CookieValueEncoded);
            Encoder.Setup(c => c.Decrypt(CookieValueEncoded)).Returns(CookieValue);
            Encoder.Setup(c => c.CanDecrypt(CookieValueEncoded)).Returns(true);
            HttpCookie.Setup(h => h.Clear()).Verifiable();
            HttpCookie.Setup(c => c.Get(CookieName)).Returns(Cookie);
            HttpCookie.Setup(m => m.Add(Cookie)).Verifiable();
        }

        public override void When()
        {
            CookieContext = new CookieContext(HttpCookie.Object, Encoder.Object, CustomDate.Object);

            CookieContext.Clear();
            CookieContext.Create(CookieName, CookieValue, CookieTimeout);
        }

        [Test]
        public void It_can_clear_cookie()
        {
            HttpCookie.Verify(h=>h.Clear());
        }

        [Test]
        public void It_can_return_cookie()
        {
            CookieContext.Get(CookieName).ShouldEqual(CookieValue);
        }

        [Test]
        public void It_knows_cookie_exists()
        {
            CookieContext.Has(CookieName).ShouldEqual(true);
        }

        [Ignore("TODO: It does not seem to verify")]
        [Test]
        public void It_can_create_a_cookie()
        {
            HttpCookie.Verify(m => m.Add(Cookie));
        }

    }

    class When_loading_encoder:Specification
    {
        private IEncoder Encoder;

        public override void Given()
        {
        }

        public override void When()
        {
            Encoder = new Encoder();
        }

        [Test]
        public void It_can_encrypt_text()
        {
            Encoder.CanDecrypt("Me").ShouldBeTrue();
            Encoder.Encrypt("Me").ShouldEqual("TQBlAA==");
        }

        [Test]
        public void It_can_decrypt_text()
        {
            Encoder.Decrypt("TQBlAA==").ShouldEqual("Me");
        }
    }

    class When_loading_date:Specification
    {
        protected Date Date;

        public override void Given()
        {
            
        }

        public override void When()
        {
            Date = new Date(new DateTime(2010, 12, 4, 5, 15, 30, 300));
        }

        [Test]
        public void It_can_add_minutes()
        {
            Date.AddMinutes(3).ShouldEqual(new DateTime(2010, 12, 4, 5, 15 + 3, 30, 300));
        }
    }

}
