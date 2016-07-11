using System;
using System.Web.Mvc;
using Telogical.CISLogin.Services;
using Telogical.CISLogin.Web.Models;

namespace Telogical.CISLogin.Web.Controllers
{
    public class ReportViewerController : Controller
    {
        private readonly IReportService _reportService;

        public ReportViewerController(IReportService reportService)
        {
            _reportService = reportService;
        }

        public ActionResult Get(int reportId)
        {
            // TODO: Future version will need to input GroupId based on credentials passed from the http request
            var report = _reportService.GetReportById(reportId, 3);
            //var testResult = new ActionResult()
            if (report.IsValid)
            {
                var result = (ActionResult)new FilePathResult(report.GetFilePath() + report.GetFileName(), report.GetFileType()){FileDownloadName = report.GetFileName()};
                return result;
            }

            var errorModel = new ErrorModel { Message = "We're sorry:  You have requested a report which does not exist or which you do not have permission to view." };
            return View("Error", errorModel);
        }
    }
}
