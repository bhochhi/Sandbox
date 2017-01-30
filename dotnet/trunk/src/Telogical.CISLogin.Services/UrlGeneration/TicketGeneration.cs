using System.IO;
using System.Net;
using System.Xml.Linq;

namespace MyLogical.MyLogin.Services.UrlGeneration
{
    public interface ITicketGeneration
    {
        string GetTicket(User user);
    }

    public class TicketGeneration : ITicketGeneration
    {
        public virtual string GetTicket(User user)
        {
            var requestUrl = @"http://qlikview.MyLogical.com/QvAJAXZfc/GetTicket.aspx"
                             + "?cmd=%3CGlobal%20method=%22GetTicket%22%3E%3CUserId%3E"
                             + user.ActiveDirectoryName
                             + "%3C/UserId%3E%3C/Global%3E";
            var request = (HttpWebRequest) WebRequest.Create(requestUrl);
            request.KeepAlive = false;
            request.Credentials = new NetworkCredential(@"qlikview", "Oceans11");

            var response = (HttpWebResponse) request.GetResponse();
            var receiveStream = response.GetResponseStream();

            var encode = System.Text.Encoding.GetEncoding("utf-8");

            // Pipes the stream to a higher level stream reader with the required encoding format. 
            var readStream = new StreamReader(receiveStream, encode);

            var ticket = string.Empty;
            while (!readStream.EndOfStream)
            {
                ticket = readStream.ReadLine();
            }
            ticket = XElement.Parse(ticket).Value;

            readStream.Close();
            response.Close();

            return ticket;
        }
    }
}
