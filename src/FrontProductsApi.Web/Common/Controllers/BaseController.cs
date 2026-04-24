using FrontProductsApi.Web.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace FrontProductsApi.Web.Common.Controllers;

public abstract class BaseController : Controller
{
    protected IActionResult JsonSuccess<T>(T data, string? message = null) =>
        Json(new ApiResponse<T> { Success = true, Data = data, Message = message });

    protected IActionResult JsonError(string message) =>
        Json(new ApiResponse<object> { Success = false, Message = message });
}
