namespace MyLogical.MyLogin.Services.Validation.Validators
{
    public class ClientVerification : IValidator
    {
        private readonly string _clientType;

        private bool doesSupport()
        {
            return _clientType.ToLower().Equals("ajax") || _clientType.ToLower().Equals("plugin");
        }

        public virtual bool HasError()
        {
            return !doesSupport();
        }
        public virtual ValidatorModel GetError()
        {
            if (HasError()) return new ValidatorModel() { HasError = true, ErrorMessage = "Unsupported client type requested" };
            return new ValidatorModel() { HasError = false, ErrorMessage = string.Empty };
        }
        public ClientVerification(string clientType)
        {
            _clientType = clientType;
        }
    }
}
