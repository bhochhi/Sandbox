using System.Web;
using System.Web.Routing;
using Moq;
using NUnit.Framework;
using MyLogical.MyLogin.Web;
using MyLogical.Framework.Specifications;

namespace MyLogical.MyLogin.Specifications
{
    public class RouteSpecifications : Specification
    {
        protected static Mock<HttpRequestBase> RequestMock;
        protected static Mock<HttpContextBase> ContextMock;
        protected static RouteCollection Routes;
        protected static string NavigationPath;
        protected static RouteData RouteDetail;

        public override void Given()
        {
            Routes = new RouteCollection();
            MvcApplication.RegisterRoutes(Routes);
            NavigationPath = "~/";
        }

        public override void When()
        {
            RequestMock = new Mock<HttpRequestBase>();
            RequestMock.Setup(r => r.AppRelativeCurrentExecutionFilePath).Returns(NavigationPath);

            ContextMock = new Mock<HttpContextBase>();
            ContextMock.Setup(c => c.Request).Returns(RequestMock.Object);

            RouteDetail = Routes.GetRouteData(ContextMock.Object);
        }
    }

    [TestFixture]
    public class When_requesting_the_error_page : RouteSpecifications
    {
        public override void Given()
        {
            base.Given();
            NavigationPath = "~/Error";
        }
        [Test]
        public static void It_will_call_the_error_controller()
        {
            RouteDetail.Values["controller"].ShouldEqual("Error");
        }

    }

    [TestFixture]
    public class When_requesting_the_login_page_with_document_and_bookmark_and_client : RouteSpecifications
    {
        public override void Given()
        {
            base.Given();
            NavigationPath = "~/Login/DocumentName/bookmark/Bookmark/client/Client";
        }
        [Test]
        public static void It_will_call_the_login_controller()
        {
            RouteDetail.Values["controller"].ShouldEqual("Login");
        }

        [Test]
        public static void It_will_call_the_log_on_action()
        {
            RouteDetail.Values["action"].ShouldEqual("Login");
        }
    }

    [TestFixture]
    public class When_requesting_the_login_page_with_document_and_client_and_no_bookmark : RouteSpecifications
    {
        public override void Given()
        {
            base.Given();
            NavigationPath = "~/Login/DocumentName/client/Client";
        }
        [Test]
        public static void It_will_call_the_login_controller()
        {
            RouteDetail.Values["controller"].ShouldEqual("Login");
        }

        [Test]
        public static void It_will_call_the_log_on_action()
        {
            RouteDetail.Values["action"].ShouldEqual("Login");
        }
    }

    [TestFixture]
    public class When_requesting_the_login_page_with_document_and_bookmark_and_no_client : RouteSpecifications
    {
        public override void Given()
        {
            base.Given();
            NavigationPath = "~/Login/DocumentName/bookmark/Bookmark";
        }
        [Test]
        public static void It_will_call_the_login_controller()
        {
            RouteDetail.Values["controller"].ShouldEqual("Login");
        }

        [Test]
        public static void It_will_call_the_log_on_action()
        {
            RouteDetail.Values["action"].ShouldEqual("Login");
        }
    }

    [TestFixture]
    public class When_requesting_the_login_page_with_document_and_no_bookmark_and_no_client : RouteSpecifications
    {
        public override void Given()
        {
            base.Given();
            NavigationPath = "~/Login/DocumentName";
        }
        [Test]
        public static void It_will_call_the_login_controller()
        {
            RouteDetail.Values["controller"].ShouldEqual("Login");
        }

        [Test]
        public static void It_will_call_the_log_on_action()
        {
            RouteDetail.Values["action"].ShouldEqual("Login");
        }
    }
}