using System;
using System.Configuration;

namespace Telogical.CISLogin.Services.Login
{
    public interface ILogin
    {
        bool CanLogin(string username, string password);
        User GetAuthenticatedUser(string username, string password);
    }

    public class Login : ILogin
    {
        private readonly IUserRepository _userRepository;

        public Login()
            : this(
            new UserRepository(
                ConfigurationManager.ConnectionStrings["UserRepository"].ConnectionString
                ))
        {
        }

        public Login(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public virtual bool CanLogin(string username, string password)
        {
            var user = _userRepository.GetUserFromUsername(username);
            if (user == null) return false;
            if (user.Username == null || user.Password == null) return false;
            if(user.Username.Equals(username) && user.Password.Equals(password)) return true;
            return false;
        }

        public virtual User GetAuthenticatedUser(string username, string password)
        {
            return _userRepository.GetUserFromUsername(username);
        }
    }
}