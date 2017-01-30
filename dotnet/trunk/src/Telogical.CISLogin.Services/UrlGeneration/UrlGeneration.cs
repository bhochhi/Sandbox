using System.Configuration;

namespace MyLogical.MyLogin.Services.UrlGeneration
{
    public interface IUrlGeneration
    {
        string GetUrlToRedirect(string _username, string documentName, string bookmark, string client);
    }

    public class UrlGeneration : IUrlGeneration
    {
        private readonly IUserRepository _userRepository;
        private readonly ITicketGeneration _ticketGeneration;

        public UrlGeneration()
            : this(new UserRepository(ConfigurationManager.ConnectionStrings["UserRepository"].ConnectionString), new TicketGeneration())
        {
           
        }

        public UrlGeneration(IUserRepository userRepository, ITicketGeneration ticketGeneration)
        {
            _userRepository = userRepository;
            _ticketGeneration = ticketGeneration;
        }

        public virtual string GetUrlToRedirect(string _username, string documentName, string bookmark, string client)
        {
            var user = _userRepository.GetUserFromUsername(_username);
            var ticket = _ticketGeneration.GetTicket(user);
            string url;
            if (client.ToLower().Equals("plugin"))
            {
                url = "http://qlikview.MyLogical.com/qvplugin/opendoc2.htm?document=" + documentName;
                if (!string.IsNullOrEmpty(bookmark)) url += @"?bookmark=Document\" + bookmark;
            }
            else
            {
                url = "http://qlikview.MyLogical.com/QvAJAXZfc/opendoc.htm?document=" + documentName;
                if (!string.IsNullOrEmpty(bookmark)) url += @"&bookmark=Document\" + bookmark;
            }
            
            url += "&ticket=" + ticket;
            return url;
        }
    }
}