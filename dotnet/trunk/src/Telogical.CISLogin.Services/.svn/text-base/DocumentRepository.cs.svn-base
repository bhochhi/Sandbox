using System;
using System.Data.SqlClient;

namespace Telogical.CISLogin.Services
{
    public class DocumentRepository
    {
        private readonly string _connectionString;

        public DocumentRepository()
        {
            
        }

        public DocumentRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public virtual string GetDocumentByName(string documentName)
        {
            var document = string.Empty;
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameter = new SqlParameter()
                                    {
                                        ParameterName = "@documentName",
                                        Value = documentName
                                    };
                var command = new SqlCommand("select [id], [name]"
                                             + " from [Documents]"
                                             + " where [name] like @documentName;",
                                             connection);
                command.Parameters.Add(parameter);
                using (command)
                {
                    connection.Open();
                    var reader = command.ExecuteReader();
                    if(reader!=null && reader.HasRows)
                    {
                        reader.Read();
                        document = reader["name"].ToString();
                    }
                    connection.Close();
                }
            }
            return document;
        }
    }
}