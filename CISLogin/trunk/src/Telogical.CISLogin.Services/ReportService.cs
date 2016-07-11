using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Telogical.CISLogin.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly string _filePath;

        public static Dictionary<string, string> SupportedContentTypes = new Dictionary<string, string>
                                                                            {
                                                                                {".xls", "application/vnd.ms-excel"},
                                                                                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                                                                                {".ppt", "application/vnd.ms-powerpoint"},
                                                                                {".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"},
                                                                                {".pdf", "application/pdf"}
                                                                            };

        public ReportService(IReportRepository reportRepository, string filePath)
        {
            _reportRepository = reportRepository;
            _filePath = filePath;
        }

        public Report GetReportById(int reportId, int groupId)
        {
            var reportName = _reportRepository.GetReportNameByReportId(reportId, groupId);
            
            if(!reportName.Equals(string.Empty))
                return new Report(){IsValid = true}
                    .AddFileName(reportName)
                    .SetContentType(LookupMimeType(reportName))
                    .SetFilePath(_filePath);

            return new Report();
        }

        private static string LookupMimeType(string reportName)
        {
            foreach (var contentType in SupportedContentTypes)
            {
                if (reportName.EndsWith(contentType.Key)) return contentType.Value;
            }

            return "";
        }
    }
}
