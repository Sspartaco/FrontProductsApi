using FrontProductsApi.Web.Common.Controllers;
using FrontProductsApi.Web.Models.GitHub;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;

namespace FrontProductsApi.Web.Controllers;

public class GitHubController(IHttpClientFactory httpClientFactory) : BaseController
{
    private HttpClient Api => httpClientFactory.CreateClient("ProductsApi");

    public IActionResult Index() => View();

    [HttpGet("/GitHub/GetUser/{username}")]
    public async Task<IActionResult> GetUser(string username)
    {
        var response = await Api.GetAsync($"/api/github/{username}");
        if (!response.IsSuccessStatusCode) return JsonError("Usuario no encontrado");
        var user = await response.Content.ReadFromJsonAsync<GitHubUserDto>();
        return JsonSuccess(user);
    }
}
