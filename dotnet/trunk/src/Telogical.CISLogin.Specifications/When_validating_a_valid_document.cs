using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using MyLogical.MyLogin.Services;
using MyLogical.Framework.Specifications;

namespace MyLogical.MyLogin.Specifications
{
    [Subject(typeof(ReportValidationService))]
    class When_validating_a_valid_document: Specification
    {
        protected int DocumentId;
        protected ReportValidationService ReportValidationService;
        protected ValidationReport validationReport;
        public override void Given()
        {
            DocumentId = 1;
        }

        public override void When()
        {
            ReportValidationService = new ReportValidationService();
            validationReport =  ReportValidationService.Verify(DocumentId);
        }

        [Test]
        public void The_validation_report_should_verify_the_document_to_be_valid()
        {
            validationReport.IsValid.ShouldEqual(true);
        }

        [Test]
        public void The_validation_report_should_contain_a_report_name()
        {
            validationReport.GetReportName().ShouldEqual("Test.xls");
        }
    }
}
