﻿using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Moq;
using NUnit.Framework;
using Telogical.CISLogin.Services;
using Telogical.CISLogin.Web;
using Telogical.CISLogin.Web.Controllers;
using Telogical.CISLogin.Web.Models;
using Telogical.Framework.IoC;
using Telogical.Framework.Specifications;

namespace Telogical.CISLogin.Specifications
{
    public static class ReportViewerSpecifications
    {
        public static Mock<IReportService> MockTheReportService()
        {
            return new Mock<IReportService>();
        }

        public static IReportService ToReturnValidReport(this Mock<IReportService> mockedService, int reportId, string reportName)
        {
            var report = new Report().AddFileName(reportName).SetContentType("application/vnd.ms-excel").SetFilePath(@"c:\someFolder\");
            report.IsValid = true;
            mockedService.Setup(m => m.GetReportById(reportId, 3)).Returns(report);
            return mockedService.Object;
        }

        public static IReportService ToReturnInvalidReport(this Mock<IReportService> mockedService, int reportId, string reportName)
        {
            var report = new Report().AddFileName(reportName).SetContentType("").SetFilePath(@"c:\someFolder\");
            report.IsValid = false;
            mockedService.Setup(m => m.GetReportById(reportId, 3)).Returns(report);
            return mockedService.Object;
        }

        public static ReportViewerController InitializeReportRequestHandler(IReportService reportService)
        {
            return new ReportViewerController(reportService);
        }

        public static Mock<IReportRepository> MockTheReportRepository()
        {
            return new Mock<IReportRepository>();
        }

        public static IReportRepository ToReturnReport(this Mock<IReportRepository> mockedRepository, int reportId, string reportName)
        {
            mockedRepository.Setup(m => m.GetReportNameByReportId(reportId, 3)).Returns(reportName);
            return mockedRepository.Object;
        }

        public static ReportService InitializeReportService(IReportRepository reportRepository, string filePath)
        {
            return new ReportService(reportRepository, filePath);
        }

        public static CisControllerFactory StartServices()
        {
            Wrapper.GetContainer().Install(new ServicesInstaller());
            Wrapper.GetContainer().Install(new ControllerInstaller());

            return new CisControllerFactory();
        }

        public static RouteCollection StartApplication()
        {
            var routes = new RouteCollection();
            MvcApplication.RegisterRoutes(routes);

            return routes;
        }

        public static RouteData NavigateTo(this RouteCollection routes, string url)
        {
            var contextMock = new Mock<HttpContextBase>();
            contextMock.Setup(c => c.Request.AppRelativeCurrentExecutionFilePath).Returns(url);

            return routes.GetRouteData(contextMock.Object);
        }

        public static string ReadErrorMessage(this ViewDataDictionary viewData)
        {
            var errorModel = viewData.Model as ErrorModel;
            return errorModel.Message;
        }
    }

    [Subject(typeof(MvcApplication))]
    public class When_a_user_requests_a_report : Specification
    {
        protected int TheReportId;
        protected string TheReportName;
        protected string TheFilePath;

        protected IReportService TheReportService;
        protected RouteCollection StartedApplication;
        protected RouteData CurrentUserAction;

        public override void Given()
        {
            StartedApplication = ReportViewerSpecifications.StartApplication();
            TheReportId = 1;
        }

        public override void When()
        {
            CurrentUserAction = StartedApplication.NavigateTo("~/Reports/" + TheReportId);
        }

        [Test]
        public void It_should_route_to_the_report_viewer()
        {
            CurrentUserAction.Values["controller"].ShouldEqual("ReportViewer");
        }

        [Test]
        public void It_should_get_the_report()
        {
            CurrentUserAction.Values["action"].ShouldEqual("Get");
        }

        [Test]
        public void It_should_request_a_specific_report()
        {
            CurrentUserAction.Values["reportId"].ShouldEqual(TheReportId.ToString());
        }
    }

    [Subject(typeof(ReportViewerController))]
    public class When_the_requested_report_is_valid : When_a_user_requests_a_report
    {
        protected ReportViewerController TheReportRequestController;
        protected FilePathResult TheFile;

        public override void Given()
        {
            base.Given();

            TheReportName = "someFile.xls";
            TheFilePath = @"c:\someFolder\";

            TheReportService = ReportViewerSpecifications
                .MockTheReportService()
                .ToReturnValidReport(TheReportId, TheReportName);
        }

        public override void When()
        {
            base.When();

            TheReportRequestController = ReportViewerSpecifications
                .InitializeReportRequestHandler(TheReportService);

            TheFile = TheReportRequestController.Get(TheReportId) as FilePathResult;
        }

        [Test]
        public void It_should_display_file_download_dialog()
        {
            TheFile.ShouldNotBeNull();
        }
    }

    [Subject(typeof(ReportViewerController))]
    public class When_the_report_is_retrieved_from_the_server : When_the_requested_report_is_valid
    {
        // This test was pulled out of the "When_the_requested_report_is_valid" context because
        // the NUnit runner was not correctly handling the inheritance when running this test
        // for later contexts.

        [Test]
        public void It_should_retrieve_the_report_from_the_correct_location()
        {
            TheFile.FileName.ShouldEqual(TheFilePath + TheReportName);
        }
    }

    [Subject(typeof(ReportService))]
    public class When_the_report_is_retrieved_from_the_database : When_the_requested_report_is_valid
    {
        protected IReportRepository TheDatabase;
        protected Report TheReport;

        public override void Given()
        {
            base.Given();
            
            TheDatabase = ReportViewerSpecifications
                .MockTheReportRepository()
                .ToReturnReport(TheReportId, TheReportName);
        }

        public override void When()
        {
            base.When();

            TheReportService = ReportViewerSpecifications
                .InitializeReportService(TheDatabase, TheFilePath);

            TheReport = TheReportService.GetReportById(TheReportId, 3);
        }

        [Test]
        public void The_report_should_be_valid()
        {
            TheReport.IsValid.ShouldBeTrue();
        }

        [Test]
        public void The_report_should_know_the_file_name()
        {
            TheReport.GetFileName().ShouldEqual(TheReportName);
        }

        [Test]
        public void The_report_should_know_the_file_path()
        {
            TheReport.GetFilePath().ShouldEqual(TheFilePath);
        }
    }

    [Subject(typeof(ReportService))]
    public class When_the_requested_report_is_an_xls_file : When_the_report_is_retrieved_from_the_database
    {
        [Test]
        public void The_report_should_know_the_content_type()
        {
            TheReport.GetFileType().ShouldEqual("application/vnd.ms-excel");
        }
    }

    [Subject(typeof(ReportService))]
    public class When_the_requested_report_is_an_xlsx_file : When_the_report_is_retrieved_from_the_database
    {
        public override void Given()
        {
            base.Given();

            TheReportName = "test.xlsx";

            TheDatabase = ReportViewerSpecifications
                .MockTheReportRepository()
                .ToReturnReport(TheReportId, TheReportName);
        }

        [Test]
        public void The_report_should_know_the_content_type()
        {
            TheReport.GetFileType().ShouldEqual("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
    }

    [Subject(typeof(ReportService))]
    public class When_the_requested_report_is_an_ppt_file : When_the_report_is_retrieved_from_the_database
    {
        public override void Given()
        {
            base.Given();
            TheReportName = "test.ppt";

            TheDatabase = ReportViewerSpecifications
                .MockTheReportRepository()
                .ToReturnReport(TheReportId, TheReportName);
        }

        [Test]
        public void The_report_should_know_the_content_type()
        {
            TheReport.GetFileType().ShouldEqual("application/vnd.ms-powerpoint");
        }
    }

    [Subject(typeof(ReportService))]
    public class When_the_requested_report_is_an_pptx_file : When_the_report_is_retrieved_from_the_database
    {
        public override void Given()
        {
            base.Given();
            TheReportName = "test.pptx";

            TheDatabase = ReportViewerSpecifications
                .MockTheReportRepository()
                .ToReturnReport(TheReportId, TheReportName);
        }

        [Test]
        public void The_report_should_know_the_content_type()
        {
            TheReport.GetFileType().ShouldEqual("application/vnd.openxmlformats-officedocument.presentationml.presentation");
        }
    }

    [Subject(typeof(ReportService))]
    public class When_the_requested_report_is_an_pdf_file : When_the_report_is_retrieved_from_the_database
    {
        public override void Given()
        {
            base.Given();
            TheReportName = "test.pdf";

            TheDatabase = ReportViewerSpecifications
                .MockTheReportRepository()
                .ToReturnReport(TheReportId, TheReportName);
        }

        [Test]
        public void The_report_should_know_the_content_type()
        {
            TheReport.GetFileType().ShouldEqual("application/pdf");
        }
    }

    [Subject(typeof(ReportViewerController))]
    public class When_the_requested_report_is_invalid : When_a_user_requests_a_report
    {
        protected ReportViewerController TheReportRequestController;
        protected ViewResult TheErrorScreen;

        public override void Given()
        {
            base.Given();

            TheReportName = "";
            TheFilePath = @"c:\someFolder\";

            TheReportService = ReportViewerSpecifications
                .MockTheReportService()
                .ToReturnInvalidReport(TheReportId, TheReportName);
        }

        public override void When()
        {
            base.When();

            TheReportRequestController = ReportViewerSpecifications
                .InitializeReportRequestHandler(TheReportService);

            TheErrorScreen = TheReportRequestController.Get(TheReportId) as ViewResult;
        }

        [Test]
        public void It_should_display_the_error_screen()
        {
            TheErrorScreen.ViewName.ShouldEqual("Error");
        }

        [Test]
        public void It_should_display_the_error_message()
        {
            TheErrorScreen.ViewData.ReadErrorMessage().ShouldEqual("We're sorry:  You have requested a report which does not exist or which you do not have permission to view.");
        }
    }

    [Subject(typeof(ReportService))]
    public class When_the_requested_report_with_unknown_file_format : When_the_report_is_retrieved_from_the_database
    {
        public override void Given()
        {
            base.Given();
            TheReportName = "test.ukn";

            TheDatabase = ReportViewerSpecifications
                .MockTheReportRepository()
                .ToReturnReport(TheReportId, TheReportName);
        }

        [Test]
        public void The_report_should_know_the_content_type()
        {
            TheReport.GetFileType().ShouldEqual("");
        }
    }

    [Subject(typeof(ReportService))]
    public class When_no_report_is_retrieved_from_the_database : When_the_requested_report_is_invalid
    {
        protected IReportRepository TheDatabase;
        protected Report TheReport;

        public override void Given()
        {
            base.Given();
            TheDatabase = ReportViewerSpecifications
                .MockTheReportRepository()
                .ToReturnReport(TheReportId, TheReportName);
        }

        public override void When()
        {
            base.When();

            TheReportService = ReportViewerSpecifications
                .InitializeReportService(TheDatabase, TheFilePath);

            TheReport = TheReportService.GetReportById(TheReportId, 3);
        }

        [Test]
        public void The_report_should_be_invalid()
        {
            TheReport.IsValid.ShouldBeFalse();
        }
    }

}
