using System.Configuration;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Telogical.CISLogin.Services.Login;
using Telogical.CISLogin.Services.UrlGeneration;
using Telogical.CISLogin.Services.Validation;

namespace Telogical.CISLogin.Services
{
    public class ServicesInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["UserRepository"].ConnectionString;
            var cpm7ConnectionString = ConfigurationManager.ConnectionStrings["ReportRepository"].ConnectionString;
            var filePath = ConfigurationManager.AppSettings["ReportFilePath"] ?? string.Empty;

            container.Register(
                Component.For(typeof(ITicketGeneration)).ImplementedBy<TicketGeneration>().Named(
                    "TicketGeneration")
                    ,
                Component.For(typeof(IUserRepository)).ImplementedBy<UserRepository>().Named(
                    "UserRepository")
                    .DependsOn(Property.ForKey("connectionString")
                                   .Eq(connectionString))
                ,
                Component.For(typeof(IUrlGeneration)).ImplementedBy<UrlGeneration.UrlGeneration>().Named("UrlGeneration")
                    .ServiceOverrides(ServiceOverride.ForKey("userRepository").Eq("UserRepository"))
                    .ServiceOverrides(ServiceOverride.ForKey("ticketGeneration").Eq("TicketGeneration"))
                ,
                Component.For(typeof(ILogin)).ImplementedBy<Login.Login>().Named("Login")
                    .ServiceOverrides(ServiceOverride.ForKey("userRepository").Eq("UserRepository"))
                ,
                Component.For(typeof(IValidation)).ImplementedBy<Validation.Validation>().Named(
                    "Validation")
                    
                , Component.For(typeof (IReportRepository)).ImplementedBy<ReportRepository>().Named("ReportRepository")
                      .DependsOn(Property.ForKey("connectionString").Eq(cpm7ConnectionString))
                      
                ,
                  Component.For(typeof (IReportService)).ImplementedBy<ReportService>().Named(
                    "ReportService")
                    .ServiceOverrides(ServiceOverride.ForKey("reportRepository").Eq("ReportRepository"))
                    .DependsOn(Property.ForKey("filePath").Eq(filePath)));
        }
    }
}