using System.Collections.Generic;

namespace MyLogical.MyLogin.Services
{
    public interface IReportService
    {
        Report GetReportById(int reportId, int groupId);
    }
}