namespace Telogical.CISLogin.Services.Validation
{
    public class ValidatorModel
    {
        public virtual bool HasError { get; set; }
        public virtual string ErrorMessage { get; set; }
    }
}