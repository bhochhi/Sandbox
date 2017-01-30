using System;

namespace Telogical.CISLogin.Services
{
    public class User
    {
        public virtual string Username { get; set; }
        public virtual string Password { get; set; }
        public virtual string ActiveDirectoryName { get; set; }
        public virtual string GroupId {get; set; }

        public User():this(string.Empty, string.Empty, string.Empty, string.Empty)
        {
        }

        public User(string username, string password, string activeDirectoryName, string groupId)
        {
            Username = username;
            Password = password;
            ActiveDirectoryName = activeDirectoryName;
            GroupId = groupId;
        }
    }
}
