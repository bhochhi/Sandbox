using System;
using System.Web.Mvc;
using System.Web.Routing;
using MyLogical.Framework.IoC;

namespace MyLogical.MyLogin.Web.Controllers
{
    public class CisControllerFactory : DefaultControllerFactory
    {
        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            return (IController)Wrapper.GetContainer().Resolve(controllerType);
        }
    }
}