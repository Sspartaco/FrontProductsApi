using FrontProductsApi.Web.Common.Controllers;
using FrontProductsApi.Web.Models.Products;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;

namespace FrontProductsApi.Web.Controllers;

public class ProductsController(IHttpClientFactory httpClientFactory) : BaseController
{
    private HttpClient Api => httpClientFactory.CreateClient("ProductsApi");

    public IActionResult Index() => View();

    [HttpGet("/Products/GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var products = await Api.GetFromJsonAsync<List<ProductDto>>("/api/products");
        return JsonSuccess(products);
    }

    [HttpGet("/Products/GetById/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await Api.GetAsync($"/api/products/{id}");
        if (!response.IsSuccessStatusCode) return JsonError("Producto no encontrado");
        var product = await response.Content.ReadFromJsonAsync<ProductDto>();
        return JsonSuccess(product);
    }

    [HttpPost("/Products/Create")]
    public async Task<IActionResult> Create([FromBody] ProductFormDto dto)
    {
        var response = await Api.PostAsJsonAsync("/api/products", dto);
        if (!response.IsSuccessStatusCode) return JsonError("Error al crear el producto");
        var product = await response.Content.ReadFromJsonAsync<ProductDto>();
        return JsonSuccess(product, "Producto creado exitosamente");
    }

    [HttpPut("/Products/Update/{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductFormDto dto)
    {
        var response = await Api.PutAsJsonAsync($"/api/products/{id}", dto);
        if (!response.IsSuccessStatusCode) return JsonError("Error al actualizar el producto");
        var product = await response.Content.ReadFromJsonAsync<ProductDto>();
        return JsonSuccess(product, "Producto actualizado exitosamente");
    }

    [HttpDelete("/Products/Delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await Api.DeleteAsync($"/api/products/{id}");
        if (!response.IsSuccessStatusCode) return JsonError("Error al eliminar el producto");
        return JsonSuccess(true, "Producto eliminado exitosamente");
    }
}
