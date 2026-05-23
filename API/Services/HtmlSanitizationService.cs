using Ganss.Xss;

namespace API.Services
{
    public class HtmlSanitizationService : IHtmlSanitizationService
    {
        private readonly HtmlSanitizer _sanitizer;

        public HtmlSanitizationService()
        {
            _sanitizer = new HtmlSanitizer();
            _sanitizer.AllowedSchemes.Add("data");
        }

        public string Sanitize(string? html)
        {
            return string.IsNullOrWhiteSpace(html) ? string.Empty : _sanitizer.Sanitize(html);
        }
    }
}
