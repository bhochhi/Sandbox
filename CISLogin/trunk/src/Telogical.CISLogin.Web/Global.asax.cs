using System.Web.Mvc;
using System.Web.Routing;
using Telogical.CISLogin.Services;
using Telogical.CISLogin.Web.Controllers;
using Telogical.Framework.IoC;

namespace Telogical.CISLogin.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "ReportViewer",
                "Reports/{reportAndGroupId}", //Format: 5 random digits + 4 digit report ID + 5 random digits + 3 digit group ID + X random digits
                new {controller = "ReportViewer", action = "Get"}
                );

            routes.MapRoute(
                "LoginWithBookmarkAndClient", // Route name
                "Login/{documentName}/bookmark/{bookmark}/client/{client}", // URL with parameters
                new {controller = "Login", action = "Login", documentName = "", bookmark = "", client = ""}
                // Parameter defaults
                );

            routes.MapRoute(
                "LoginWithBookmarkAndDefaultClient", // Route name
                "Login/{documentName}/bookmark/{bookmark}/client", // URL with parameters
                new {controller = "Login", action = "Login", documentName = "", bookmark = "", client = "ajax"}
                // Parameter defaults
                );

            routes.MapRoute(
                "LoginWithClient", // Route name
                "Login/{documentName}/client/{client}", // URL with parameters
                new {controller = "Login", action = "Login", documentName = "", bookmark = ""} // Parameter defaults
                );

            routes.MapRoute(
                "LoginWithDefaultClient", // Route name
                "Login/{documentName}/client", // URL with parameters
                new { controller = "Login", action = "Login", documentName = "", client = "ajax" } // Parameter defaults
                );

            routes.MapRoute(
                "LoginWithBookmark", // Route name
                "Login/{documentName}/bookmark/{bookmark}", // URL with parameters
                new {controller = "Login", action = "Login", documentName = "", bookmark = "", client = "ajax"}
                // Parameter defaults
                );
            routes.MapRoute(
                "LoginNoDocumentWithClient", // Route name
                "Login/client/{client}", // URL with parameters
                new {controller = "Login", action = "Login", documentName = "", client = ""} // Parameter defaults
                );
            routes.MapRoute(
                "LoginNoDocumentWithDefaultClient", // Route name
                "Login/client", // URL with parameters
                new { controller = "Login", action = "Login", documentName = "", client = "ajax" } // Parameter defaults
                );
            routes.MapRoute(
                "Login", // Route name
                "Login/{documentName}", // URL with parameters
                new {controller = "Login", action = "Login", documentName = "", client = "ajax"} // Parameter defaults
                );
            routes.MapRoute(
                "Error",
                "Error",
                new {controller = "Error"}
                );
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterRoutes(RouteTable.Routes);

            Wrapper.GetContainer().Install(new ServicesInstaller());
            Wrapper.GetContainer().Install(new ControllerInstaller());

            ControllerBuilder.Current.SetControllerFactory(typeof(CisControllerFactory));

        }
    }
}