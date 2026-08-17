import { RoadmapTopic } from "../../../models";

export const testingIntegrationWebapplicationfactoryTopic: RoadmapTopic = {
  id: "topic-dotnet-testing-integration-webapplicationfactory",
  stepId: "step-mid-testing-quality",
  slug: "testing-integration-webapplicationfactory",
  order: 2,
  title: "Integration Testing with WebApplicationFactory & Testcontainers",
  title_fa: "تست یکپارچگی (Integration Testing) با WebApplicationFactory و Testcontainers",
  summary:
    "Test complete HTTP request pipelines in-memory with WebApplicationFactory<Program>, mock external HTTP services with WireMock, and run real databases in Docker with Testcontainers.NET.",
  summary_fa:
    "تست کامل خط لوله درخواست‌های HTTP در حافظه با WebApplicationFactory، شبیه‌سازی وب‌سرویس‌های بیرونی و استفاده از دیتابیس واقعی در داکر با Testcontainers.NET.",
  readingTimeMinutes: 24,
  difficulty: "mid",
  content: `## 1. In-Memory API Integration Testing

\`WebApplicationFactory<TEntryPoint>\` bootstraps the entire ASP.NET Core application in-memory:

\`\`\`csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            // Replace external services with test mocks if needed
        });
    }
}

public class ProductsApiIntegrationTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task GetProducts_ReturnsSuccessAndJsonList()
    {
        var response = await _client.GetAsync("/api/products");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var products = await response.Content.ReadFromJsonAsync<List<ProductDto>>();
        products.Should().NotBeNull();
    }
}
\`\`\`

---

## 2. Testcontainers.NET for Real Production Database Testing

Avoid In-Memory EF Core databases because they lack relational constraint enforcement (e.g. foreign keys, transactions). Instead, use real PostgreSQL / SQL Server Docker containers:

\`\`\`csharp
public class PostgreSqlTestFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .Build();

    public async Task InitializeAsync() => await _container.StartAsync();
    public async Task DisposeAsync() => await _container.DisposeAsync();

    public string ConnectionString => _container.GetConnectionString();
}
\`\`\``,
  content_fa: `## ۱. تست یکپارچگی APIها در حافظه با WebApplicationFactory

کلاس \`WebApplicationFactory<Program>\` کل وب‌سرویس ASP.NET Core را در حافظه اجرا کرده و یک \`HttpClient\` مستقیم برای تست واقعی اندپوینت‌ها ارائه می‌دهد:

\`\`\`csharp
public class ProductsApiIntegrationTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task GetProducts_ReturnsSuccessAndJsonList()
    {
        var response = await _client.GetAsync("/api/products");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
\`\`\`

---

## ۲. استفاده از Testcontainers.NET برای تست با دیتابیس واقعی

اجتناب از دیتابیس‌های In-Memory به دلیل عدم بررسی کلیدهای خارجی و تراکنش‌ها، و راه‌اندازی خودکار کانتینر داکر دیتابیس واقعی در زمان اجرای تست‌ها.`,
};
