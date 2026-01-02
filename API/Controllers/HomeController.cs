using Microsoft.AspNetCore.Mvc;

[ApiController] 
public class HomeController : ControllerBase
{
    [HttpGet("/")] 
    public IActionResult GetRoot()
    {
        return Ok("Hello ASP.NET Core (Root)"); 
    }

    [HttpGet("/api")] 
    public IActionResult GetApiRoute()
    {
        return Ok("This is API Route (API)");
    }
}