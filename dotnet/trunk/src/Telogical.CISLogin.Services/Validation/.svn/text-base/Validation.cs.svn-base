using System.Collections.Generic;
using System.Configuration;
using Telogical.CISLogin.Services.Validation.Validators;

namespace Telogical.CISLogin.Services.Validation
{
    public interface IValidation
    {
        bool CanValidate(string browserType, string bitVersion, string documentName, string client);
        ValidatorModel GetValidatorError(string browserType, string bitVersion, string documentName, string client);
    }

    public class Validation : IValidation
    {
        public Validation()
        {
        }

        private List<IValidator> getValidators(string browserType, string bitVersion, string documentName, string client)
        {
            //TODO: Use IoC to handle these dependencies
            if (client.ToLower().Equals("ajax"))
                return new List<IValidator>()
                           {
                               new ClientVerification(client),
                               new DocumentVerification(new DocumentRepository(ConfigurationManager.ConnectionStrings["DocumentRepository"].ConnectionString),documentName)
                           };
            return new List<IValidator>()
                       {
                           new ClientVerification(client),
                           new BrowserDetection(browserType, bitVersion),
                           new DocumentVerification(new DocumentRepository(ConfigurationManager.ConnectionStrings["DocumentRepository"].ConnectionString),documentName)
                       };
        }

        public virtual bool CanValidate(string browserType, string bitVersion, string documentName, string client)
        {
            var validators = getValidators(browserType, bitVersion, documentName, client);
            foreach(var validator in validators)
                if(validator.HasError()) return false;
            return true;
        }

        public virtual ValidatorModel GetValidatorError(string browserType, string bitVersion, string documentName, string client)
        {
            var validators = getValidators(browserType, bitVersion, documentName, client);
            foreach (var validator in validators)
            {
                if (validator.HasError()) return validator.GetError();
            }
            return new ValidatorModel() {ErrorMessage = string.Empty, HasError = false};
        }

    }
}