namespace MyLogical.MyLogin.Services.Validation
{
    public interface IValidator
    {
        bool HasError();
        ValidatorModel GetError();
    }
}