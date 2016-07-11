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
                "Reports/{reportId}",
                new {controller = "ReportViewer", action = "Get"}
                );

            routes.MapRoute(
                "LoginWithBookmark", // Route name
                "Login/{documentName}/{bookmark}", // URL with parameters
                new { controller = "Login", action = "Login", documentName = "", bookmark=""} // Parameter defaults
                );
            routes.MapRoute(
                "Login", // Route name
                "Login/{documentName}", // URL with parameters
                new { controller = "Login", action = "Login",documentName="" } // Parameter defaults
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