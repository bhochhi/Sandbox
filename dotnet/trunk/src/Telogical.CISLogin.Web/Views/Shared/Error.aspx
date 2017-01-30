<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<MyLogical.MyLogin.Web.Models.ErrorModel>" %>

<asp:Content ID="errorTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Error
</asp:Content>


<asp:Content ID="errorContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2>
        <% =Model.Message.Replace(
            "#IE32BitDownloadLink#", 
            "You can download it <a href='http://www.microsoft.com/windows/internet-explorer/worldwide-sites.aspx'>here</a>.")%>
    </h2>
</asp:Content>
