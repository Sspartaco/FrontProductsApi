# FrontProductsApi

ASP.NET Core MVC frontend that consumes [ProductsApi](../ProductsApi).

## Stack

- .NET 10 / ASP.NET Core MVC
- Bootstrap 5
- Fetch API (vanilla JS)

## Views

| Route | Description |
|-------|-------------|
| `/Products` | Products CRUD — list, create, edit, delete via Bootstrap modals |
| `/GitHub` | GitHub public profile lookup by username |

## Setup

1. Make sure **ProductsApi** is running on `https://localhost:7247`
2. Run this project:

```bash
dotnet run --project src/FrontProductsApi.Web
```
