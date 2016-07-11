namespace Telogical.CISLogin.Services.Validation.Validators
{
    public class DocumentVerification: IValidator
    {
        private readonly DocumentRepository _documentRepository;
        private readonly string _documentName;

        public virtual bool HasError()
        {
            var document= _documentRepository.GetDocumentByName(_documentName);
            if (string.IsNullOrEmpty(document)) return true;
            return false;
        }
        public virtual ValidatorModel GetError()
        {
            if (HasError()) return new ValidatorModel() { HasError = true, ErrorMessage = "An invalid document was requested. Please use a proper document name." };
            return new ValidatorModel() { HasError = false, ErrorMessage = string.Empty };
        }
        public DocumentVerification(DocumentRepository documentRepository, string documentName)
        {
            _documentRepository = documentRepository;
            _documentName = documentName;
        }
    }
}