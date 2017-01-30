using System.Configuration;
using NUnit.Framework;
using Telogical.CISLogin.Services;
using Telogical.Framework.Specifications;

namespace Telogical.CISLogin.IntegrationTests
{
    public class When_requesting_a_document: Specification
    {
        protected DocumentRepository DocumentRepository;
        protected string DocumentName;

        public override void Given()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["DocumentRepository"].ConnectionString;
            DocumentRepository = new DocumentRepository(connectionString);
        }

        public override void When()
        {
        }

    }

    [TestFixture]
    public class With_valid_document_name : When_requesting_a_document
    {
        public override void When()
        {
            base.When();
            DocumentName = DocumentRepository.GetDocumentByName("ValidDocumentName");
        }
        [Test]
        public void It_should_return_a_valid_document()
        {
            DocumentName.ShouldNotBeNull();
            DocumentName.ShouldEqual("ValidDocumentName");
        }
    }

    [TestFixture]
    public class With_invalid_document_name : When_requesting_a_document
    {
        public override void When()
        {
            base.When();
            DocumentName = DocumentRepository.GetDocumentByName("InvalidDocumentName");
        }

        [Test]
        public void It_should_not_return_a_valid_document()
        {
            DocumentName.ShouldBeEmpty();
        }
    }
}
