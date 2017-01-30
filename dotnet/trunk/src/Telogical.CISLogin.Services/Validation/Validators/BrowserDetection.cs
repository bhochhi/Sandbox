namespace MyLogical.MyLogin.Services.Validation.Validators
{
    public class BrowserDetection: IValidator
    {
        private readonly string _browserType;
        private readonly string _bitVersion;

        private bool doesSupport()
        {
            return _browserType.Equals("IE") && !_bitVersion.Contains("x64");
        }

        public virtual bool HasError()
        {
            return !doesSupport();
        }
        public virtual ValidatorModel GetError()
        {
            if (HasError()) return new ValidatorModel() { HasError = true, ErrorMessage = "This application requires a 32-bit version of Microsoft Internet Explorer. #IE32BitDownloadLink#" };
            return new ValidatorModel() { HasError = false, ErrorMessage = string.Empty };
        }
        public BrowserDetection(string browserType, string bitVersion)
        {
            _browserType = browserType;
            _bitVersion = bitVersion;
        }
    }
}
