using System.Collections.Generic;
using System.Configuration;
using Telogical.CISLogin.Services.Validation.Validators;

namespace Telogical.CISLogin.Services.Validation
{
    public interface IValidation
    {
        bool CanValidate(string browserType, string bitVersion, string documentName);
        ValidatorModel GetValidatorError(string browserType, string bitVersion, string documentName);
    }

    public class Validation : IValidation
    {
        public Validation()
        {
        }

        private List<IValidator> getValidators(string browserType, string bitVersion, string documentName)
        {
            //TODO: Use IoC to handle these dependencies
            return new List<IValidator>()
                       {
                           new BrowserDetection(browserType, bitVersion),
                           new DocumentVerification(new DocumentRepository(ConfigurationManager.ConnectionStrings["DocumentRepository"].ConnectionString),documentName)
                       };
        }

        public virtual bool CanValidate(string browserType, string bitVersion, string documentName)
        {
            var validators = getValidators(browserType, bitVersion, documentName);
            foreach(var validator in validators)
                if(validator.HasError()) return false;
            return true;
        }

        public virtual ValidatorModel GetValidatorError(string browserType, string bitVersion, string documentName)
        {
            var validators = getValidators(browserType, bitVersion, documentName);
            foreach (var validator in validators)
            {
                if (validator.HasError()) return validator.GetError();
            }
            return new ValidatorModel() {ErrorMessage = string.Empty, HasError = false};
        }

    }
}