using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Telogical.CISLogin.Web.Models
{
    #region Models

    public class LogOnModel
    {
        [Required]
        [DisplayName("Username:")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [DisplayName("Password:")]
        public string Password { get; set; }

        [DisplayName("Keep me logged in")]
        public bool RememberMe { get; set; }

        public string ErrorMessage { get; set; }
    }

    #endregion
}
