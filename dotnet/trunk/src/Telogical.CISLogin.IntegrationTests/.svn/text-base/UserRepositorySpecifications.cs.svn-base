using System.Configuration;
using NUnit.Framework;
using Telogical.CISLogin.Services;
using Telogical.Framework.Specifications;

namespace Telogical.CISLogin.IntegrationTests
{
    class When_requesting_a_user:Specification
    {
        protected User User;
        protected UserRepository UserRepository;
        public override void Given()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["UserRepository"].ConnectionString;
            UserRepository = new UserRepository(connectionString);
        }
        public override void When()
        {
            
        }

    }

    [TestFixture]
    class When_requesting_for_an_existing_user_ : When_requesting_a_user
    {
        public override void When()
        {
            User = UserRepository.GetUserFromUsername("ExistingUser");
        }

        [Test]
        public void It_will_return_user_details()
        {
            User.Username.ShouldEqual("ExistingUser");
            User.Password.ShouldEqual("ExistingUserPassword");
            User.ActiveDirectoryName.ShouldEqual("ExistingUserActiveDirectoryName");
            User.GroupId.ShouldEqual("ExistingGroupId");
        }
    }

    [TestFixture]
    class When_requesting_for_a_non_existing_user_ : When_requesting_a_user
    {
        public override void When()
        {
            User = UserRepository.GetUserFromUsername("NonExistingUser");
        }

        [Test]
        public void It_will_not_return_user_details()
        {
            User.Username.ShouldBeEmpty();
            User.Password.ShouldBeEmpty();
            User.ActiveDirectoryName.ShouldBeEmpty();
            User.GroupId.ShouldBeEmpty();
        }
        [Test]
        public void It_should_not_be_null()
        {
            User.ShouldNotBeNull();
        }
    }
}
