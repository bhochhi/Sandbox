using System;
using System.Web.Mvc;
using MyLogical.MyLogin.Services;
using MyLogical.MyLogin.Web.Models;

namespace MyLogical.MyLogin.Web.Controllers
{
    public class ReportViewerController : Controller
    {
        private readonly IReportService _reportService;

        public ReportViewerController(IReportService reportService)
        {
            _reportService = reportService;
        }

        public ActionResult Get(string reportAndGroupId)
        {
            var report = _reportService.GetReportById(GetReportId(reportAndGroupId), GetGroupId(reportAndGroupId));
            //var testResult = new ActionResult()
            if (report.IsValid)
            {
                var result = (ActionResult)new FilePathResult(report.GetFilePath() + report.GetFileName(), report.GetFileType()){FileDownloadName = report.GetFileName()};
                return result;
            }

            var errorModel = new ErrorModel { Message = "We're sorry:  You have requested a report which does not exist or which you do not have permission to view." };
            return View("Error", errorModel);
        }

        public int GetReportId(string reportAndGroupId)
        {
            if (string.IsNullOrEmpty(reportAndGroupId))
                return -1;
            return Convert.ToInt32(reportAndGroupId.Substring(5, 4));
        }

        public int GetGroupId(string reportAndGroupId)
        {
            if (string.IsNullOrEmpty(reportAndGroupId))
                return -1;
            return Convert.ToInt32(reportAndGroupId.Substring(14, 3));
        }
    }
}
