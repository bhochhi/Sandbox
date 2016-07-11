using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Telogical.CISLogin.Services
{
    public interface IReportRepository
    {
        string GetReportNameByReportId(int reportId, int groupId);
    }

    public class ReportRepository:IReportRepository
    {
        private readonly string _connectionString;

        public ReportRepository()
        {
            
        }

        public ReportRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public virtual string GetReportNameByReportId(int reportId, int groupId)
        {
            var reportName = string.Empty;
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameter = new SqlParameter()
                                    {
                                        ParameterName = "@ReportId",
                                        Value = reportId
                                    };
                var parameter2 = new SqlParameter()
                                    {
                                        ParameterName = "@GroupId",
                                        Value = groupId
                                    };
                var command = new SqlCommand("GetReportNameByReportId", connection)
                                  {CommandType = CommandType.StoredProcedure};
                command.Parameters.Add(parameter);
                command.Parameters.Add(parameter2);

                using (command)
                {
                    connection.Open();
                    var reader = command.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        reader.Read();
                        reportName = reader["ReportName"].ToString();
                    }
                    connection.Close();
                }
            }
            return reportName;
        }
    }
}
