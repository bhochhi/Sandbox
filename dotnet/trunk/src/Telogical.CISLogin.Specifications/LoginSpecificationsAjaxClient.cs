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
    class LoginSpecificationsAjaxClient
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
        public class With_an_acceptable_client_and_a_valid_document_name_but_not_attempted_to_login
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
            public  void It_will_display_the_login_page()
            {
                viewResult.ViewName.ShouldEqual("Login");
            }
        }

        [TestFixture]
        public class Without_a_valid_browser_before_previously_logging_in
            : User_had_not_already_successfully_logged_in
        {
            public override void Given()
            {
                base.Given();

                var validatorModel = new Mock<ValidatorModel>();
                validatorModel.Setup(e => e.HasError).Returns(false);
                validatorModel.Setup(e => e.ErrorMessage).Returns(string.Empty);

                ValidationService.Setup(c => c.CanValidate("InvalidBrowser", "ValidBitVersion", "ValidDocumentName", "ValidClient")).Returns(true);
                ValidationService.Setup(d => d.GetValidatorError("InvalidBrowser", "ValidBitVersion", "ValidDocumentName", "ValidClient")).Returns(validatorModel.Object);

                HttpRequestBase.Setup(h => h.Browser.Browser).Returns("InvalidBrowser");
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
        public class Without_a_valid_client_before_previously_logging_in
            : User_had_not_already_successfully_logged_in
        {
            public override void Given()
            {
                base.Given();

                var validatorModel = new Mock<ValidatorModel>();
                validatorModel.Setup(e => e.HasError).Returns(true);
                validatorModel.Setup(e => e.ErrorMessage).Returns("Unacceptable Client");

                ValidationService.Setup(c => c.CanValidate("ValidBrowser", "BitVersion", "DocumentName", "InvalidClient")).Returns(false);
                ValidationService.Setup(d => d.GetValidatorError("ValidBrowser", "BitVersion", "DocumentName", "InvalidClient")).Returns(validatorModel.Object);

                HttpRequestBase.Setup(h => h.Browser.Browser).Returns("ValidBrowser");
                HttpRequestBase.Setup(h => h.UserAgent).Returns("BitVersion");

                loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
                loginController.HttpRequestBase = HttpRequestBase.Object;
                loginController.SessionModel = LoginSession.Object;
            }

            public override void When()
            {
                viewResult = loginController.Login("DocumentName", "Bookmark","InvalidClient") as ViewResult;
            }

            [Test]
            public void It_will_display_the_error_page()
            {
                viewResult.ViewName.ShouldEqual("Error");
            }

            [Test]
            public void It_will_display_unacceptable_browser_error_message()
            {
                (viewResult.ViewData.Model as ErrorModel).Message.ShouldEqual("Unacceptable Client");
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
            : With_an_acceptable_client_and_a_valid_document_name_but_not_attempted_to_login
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
            : With_an_acceptable_client_and_a_valid_document_name_but_not_attempted_to_login
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
            private RedirectResult redirectResult;
            public override void Given()
            {
                base.Given();

                var validatorModel = new Mock<ValidatorModel>();
                validatorModel.Setup(e => e.HasError).Returns(false);
                validatorModel.Setup(e => e.ErrorMessage).Returns(string.Empty);

                ValidationService.Setup(c => c.CanValidate("InvalidBrowser", "BitVersion", "ValidDocumentName", "ValidClient")).Returns(true);
                ValidationService.Setup(d => d.GetValidatorError("InvalidBrowser", "BitVersion", "ValidDocumentName", "ValidClient")).Returns(validatorModel.Object);

                HttpRequestBase.Setup(h => h.Browser.Browser).Returns("InvalidBrowser");
                HttpRequestBase.Setup(h => h.UserAgent).Returns("BitVersion");

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
        public class Without_an_acceptable_client_after_previously_logging_in
            : User_had_already_successfully_logged_in
        {
            public override void Given()
            {
                base.Given();

                var validatorModel = new Mock<ValidatorModel>();
                validatorModel.Setup(e => e.HasError).Returns(true);
                validatorModel.Setup(e => e.ErrorMessage).Returns("Unacceptable Client");

                ValidationService.Setup(c => c.CanValidate("ValidBrowser", "BitVersion", "DocumentName", "InvalidClient")).Returns(false);
                ValidationService.Setup(d => d.GetValidatorError("ValidBrowser", "BitVersion", "DocumentName", "InvalidClient")).Returns(validatorModel.Object);

                HttpRequestBase.Setup(h => h.Browser.Browser).Returns("ValidBrowser");
                HttpRequestBase.Setup(h => h.UserAgent).Returns("BitVersion");

                loginController = new LoginController(ValidationService.Object, UrlGenerationService.Object, LoginServices.Object);
                loginController.HttpRequestBase = HttpRequestBase.Object;
                loginController.SessionModel = LoginSession.Object;
            }

            public override void When()
            {
                viewResult = loginController.Login("DocumentName", "Bookmark", "InvalidClient") as ViewResult;
            }

            [Test]
            public void It_will_display_the_error_page()
            {
                viewResult.ViewName.ShouldEqual("Error");
            }

            [Test]
            public void It_will_display_unacceptable_browser_error_message()
            {
                (viewResult.ViewData.Model as ErrorModel).Message.ShouldEqual("Unacceptable Client");
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




        public class When_detecting_a_client
        : Specification
        {
            protected ClientVerification ClientVerification;
            protected bool IsUnacceptableClient;

            public override void Given()
            {
            }

            public override void When()
            {
                IsUnacceptableClient = ClientVerification.HasError();
            }
        }

        [TestFixture]
        public class With_an_acceptable_client
            : When_detecting_a_client
        {
            public override void Given()
            {
                base.Given();
                ClientVerification = new ClientVerification("ajax");
            }

            [Test]
            public void The_client_is_accepted()
            {
                IsUnacceptableClient.ShouldBeFalse();
            }

            [Test]
            public void The_error_message_is_available_to_be_shown()
            {
                ClientVerification.HasError().ShouldBeFalse();
            }
        }

        [TestFixture]
        public class With_an_unacceptable_client
            : When_detecting_a_client
        {
            public override void Given()
            {
                base.Given();
                ClientVerification = new ClientVerification("java");
            }

            [Test]
            public void The_browser_is_not_acceptable()
            {
                IsUnacceptableClient.ShouldBeTrue();
            }

            [Test]
            public void The_error_message_is_available_to_be_shown()
            {
                ClientVerification.HasError().ShouldBeTrue();
                ClientVerification.GetError().ShouldNotBeNull();
                ClientVerification.GetError().ErrorMessage.ShouldContain("Unsupported client type requested");
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
        public class A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present_for_ie_plugin_client
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
                Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", string.Empty,"plugin");
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
        public class A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present_for_ajax_client
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
                Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", string.Empty, "ajax");
            }

            [Test]
            public void A_valid_url_will_be_returned()
            {
                Url.ShouldContain("http://qlikview.MyLogical.com/QvAJAXZfc/opendoc.htm?document=");
            }

            [Test]
            public void The_right_document_will_be_loaded_by_the_url()
            {
                Url.ShouldContain("document=ValidDocumentName");
            }
        }

        [TestFixture]
        public class With_bookmark_not_present_for_ie_plugin_client
            : A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present_for_ie_plugin_client
        {

            public override void When()
            {
                Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", string.Empty,"plugin");
            }

            [Test]
            public void The_bookmark_will_not_be_within_the_url_parameter()
            {
                Url.ShouldNotContain("?bookmark");
            }
        }

        [TestFixture]
        public class With_bookmark_present_for_ie_plugin_client
            : A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present_for_ie_plugin_client
        {
            public override void When()
            {
                Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", "Bookmark","plugin");
            }

            [Test]
            public void The_bookmark_will_be_within_the_url_parameter()
            {
                Url.ShouldContain(@"?bookmark=Document\Bookmark");
            }
        }

        [TestFixture]
        public class With_bookmark_not_present_for_ajax_client
            : A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present_for_ajax_client
        {

            public override void When()
            {
                Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", string.Empty, "ajax");
            }

            [Test]
            public void The_bookmark_will_not_be_within_the_url_parameter()
            {
                Url.ShouldNotContain("&bookmark");
            }
        }
        [TestFixture]
        public class With_bookmark_present_for_ajax_client
            : A_valid_url_will_be_generated_when_a_valid_username_and_documentname_are_present_for_ajax_client
        {
            public override void When()
            {
                Url = UrlGeneration.GetUrlToRedirect("ValidUserName", "ValidDocumentName", "Bookmark", "ajax");
            }

            [Test]
            public void The_bookmark_will_be_within_the_url_parameter()
            {
                Url.ShouldContain(@"&bookmark=Document\Bookmark");
            }
        }
    }
}
