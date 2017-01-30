using System;
using System.Web.Mvc;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using MyLogical.Framework.IoC;

namespace MyLogical.MyLogin.Web.Controllers
{
    public class ControllerInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            Wrapper.GetContainer().Register(
            AllTypes
                .FromAssembly(System.Reflection.Assembly.GetExecutingAssembly())
                .BasedOn<IController>()
                .Configure(c => c.Named(
                    c.Implementation.Name.ToLowerInvariant()).LifeStyle.Transient));

        }
    }
}