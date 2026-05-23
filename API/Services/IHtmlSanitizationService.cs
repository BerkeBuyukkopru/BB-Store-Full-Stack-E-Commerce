namespace API.Services
{
    public interface IHtmlSanitizationService
    {
        string Sanitize(string? html);
    }
}
