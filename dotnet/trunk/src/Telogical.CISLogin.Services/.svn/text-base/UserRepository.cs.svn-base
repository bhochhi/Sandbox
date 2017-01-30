using System;
using System.Data;
using System.Data.SqlClient;

namespace Telogical.CISLogin.Services
{
    public interface IUserRepository
    {
        User GetUserFromUsername(string username);
    }

    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository()
        {
            
        }

        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public virtual User GetUserFromUsername(string username)
        {
            var user = new User(string.Empty, string.Empty, string.Empty, string.Empty);
            if(username==null) return user;
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameter = new SqlParameter()
                                    {
                                        ParameterName = "@userName",
                                        Value = username
                };
                var command = new SqlCommand("SELECT	UserName"
			                                +" ,[Password]"
			                                +" ,ActiveDirectoryName"
                                            +" ,GroupID"
	                                        +" FROM	[dbo].[Users]"
                                            + " WHERE	UserName = @userName;"
                                            , connection);
                command.Parameters.Add(parameter);
                using (command)
                {
                    connection.Open();
                    var reader = command.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        reader.Read();
                        user.Username = reader["UserName"].ToString();
                        user.Password = reader["Password"].ToString();
                        user.ActiveDirectoryName = @"telogical\" + reader["ActiveDirectoryName"].ToString();
                        user.GroupId = reader["GroupID"].ToString();
                    }
                    connection.Close();
                }
            }
            return user;
        }
    }
}