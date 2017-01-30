using System.Diagnostics;
using Castle.MicroKernel;
using NUnit.Framework;
using MyLogical.MyLogin.Services;
using MyLogical.MyLogin.Web.Controllers;
using MyLogical.Framework.IoC;
using MyLogical.Framework.Specifications;

namespace MyLogical.MyLogin.Specifications
{
    [TestFixture]
    public class When_CIS_is_started_for_the_first_time : Specification
    {
        public override void Given()
        {
        }

        public override void When()
        {
            Wrapper.GetContainer().Install(new ServicesInstaller());
            Wrapper.GetContainer().Install(new ControllerInstaller());
        }

        [Test]
        public void The_container_should_have_dependencies_available_to_use()
        {
            foreach (IHandler handler in Wrapper.GetContainer().Kernel.GetAssignableHandlers(typeof(object)))
            {
                Wrapper.GetContainer().Resolve(handler.ComponentModel.Service);
                Debug.WriteLine(handler.ComponentModel.Service);
            }
        }
    }
}