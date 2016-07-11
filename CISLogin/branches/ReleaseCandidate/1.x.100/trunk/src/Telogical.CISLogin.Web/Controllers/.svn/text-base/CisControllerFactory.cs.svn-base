using System;
using System.Web.Mvc;
using System.Web.Routing;
using Telogical.Framework.IoC;

namespace Telogical.CISLogin.Web.Controllers
{
    public class CisControllerFactory : DefaultControllerFactory
    {
        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            return (IController)Wrapper.GetContainer().Resolve(controllerType);
        }
    }
}