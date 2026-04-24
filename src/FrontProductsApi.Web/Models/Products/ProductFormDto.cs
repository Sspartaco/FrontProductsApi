namespace FrontProductsApi.Web.Models.Products;

public class ProductFormDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
}
