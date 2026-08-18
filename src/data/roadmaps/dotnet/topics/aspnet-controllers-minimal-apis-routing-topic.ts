import { RoadmapTopic } from "../../../models";

export const aspnetControllersMinimalApisRoutingTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-controllers-minimal-apis-routing",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-controllers-minimal-apis-routing",
  order: 1,
  title: "Controllers, Minimal APIs & Modern Routing Patterns",
  title_fa: "کنترلرها، Minimal APIs و الگوهای نوین مسیریابی و بایندینگ",
  summary:
    "Master the internal request pipelines of Controller-based vs Minimal APIs in .NET 8/9, RequestDelegateFactory source generation, Route Groups, custom BindAsync/TryParse model binding, Endpoint Filters, and FastEndpoints.",
  summary_fa:
    "تسلط عمیق بر پایپ‌لاین داخلی پردازش درخواست‌ها در Controllers در برابر Minimal APIs در دات‌نت ۸ و ۹، سورس جنریتور RequestDelegateFactory، گروه‌بندی مسیرها با MapGroup، بایندینگ پیشرفته با BindAsync و TryParse، فیلترهای IEndpointFilter و الگوی REPR در FastEndpoints.",
  readingTimeMinutes: 28,
  difficulty: "mid",
  content: `## 1. Evolution: From Monolithic MVC to Lightweight Cloud-Native APIs

In the early days of .NET Core (1.0 to 3.1) and legacy .NET Framework, building HTTP REST APIs required the heavy **ASP.NET Core MVC Controller Framework**:

\`\`\`csharp
// Legacy Controller Architecture (MVC 2009 Era)
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;
    private readonly IPaymentGateway _paymentGateway;
    private readonly IMapper _mapper;

    // Fat constructor anti-pattern: Injects dependencies needed by ANY action in this class
    public OrdersController(
        IOrderService orderService,
        ILogger<OrdersController> logger,
        IPaymentGateway paymentGateway,
        IMapper mapper)
    {
        _orderService = orderService;
        _logger = logger;
        _paymentGateway = paymentGateway;
        _mapper = mapper;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _orderService.GetByIdAsync(id);
        return order is not null ? Ok(_mapper.Map<OrderDto>(order)) : NotFound();
    }
}
\`\`\`

### The Architectural Pain Points of Controllers:
1. **High Reflection & Allocation Overhead**: Every incoming HTTP request must instantiate the entire controller class, resolve all constructor dependencies from the DI container (even if the specific action only needs one), run the 5-stage MVC Filter pipeline, and perform reflection-based Model Binding.
2. **Violates Single Responsibility Principle (SRP)**: Controllers frequently balloon into multi-thousand-line "God classes" with dozens of actions sharing bloated constructor dependencies.
3. **Incompatible with Native AOT (Ahead-of-Time Compilation)**: Controller discovery uses runtime reflection (\`AddControllers()\`), requiring heavy reflection metadata that breaks Native AOT optimization in .NET 8/9.

.NET 6 introduced **Minimal APIs**, completely overhauled in .NET 8 and 9 with **Source-Generated \`RequestDelegateFactory\`**, **\`IEndpointFilter\`**, and **Route Groups**.

---

## 2. Deep Architectural Breakdown: Controller vs. Minimal API Pipelines

![ASP.NET Core Request Routing Pipelines](/images/roadmaps/aspnet-controllers-minimal-apis-routing.jpg)

### 1. The Controller Request Pipeline (Heavy Reflection Engine)
When an HTTP request arrives at a controller endpoint:
1. **Endpoint Routing Matching**: \`EndpointRoutingMiddleware\` matches the URL to a \`ControllerActionDescriptor\`.
2. **Controller Activation**: \`IControllerFactory\` and \`IControllerActivator\` allocate the controller class on the Heap and resolve all constructor dependencies.
3. **MVC Filter Pipeline**: Sequentially executes **Authorization Filters** -> **Resource Filters** -> **Action Filters** -> **Exception Filters** -> **Result Filters**.
4. **Model Binding & Validation**: Uses runtime reflection over \`ActionDescriptor.Parameters\` to bind and validate \`ModelState\`.
5. **Action Invocation**: Invokes the method via \`IActionInvoker\` and renders \`IActionResult\` to the response stream.

---

### 2. The Minimal API Request Pipeline (.NET 8/9 Zero-Reflection Engine)
When an HTTP request arrives at a Minimal API endpoint:
1. **Route Table Lookup**: Matches the route directly in a high-speed radix tree.
2. **RequestDelegate Execution**: In .NET 8/9, the Roslyn compiler generates a strongly-typed **\`RequestDelegate\`** at compile-time via the **\`RequestDelegateFactory\`**. **Zero reflection is used during request processing.**
3. **Endpoint Filter Chain**: Executes lightweight **\`IEndpointFilter\`** instances registered directly on the endpoint.
4. **Typed Results Output**: Executes **\`IResult\`** (e.g. \`TypedResults.Ok(dto)\`) directly writing serialized JSON to the output pipe with zero boxing!

---

## 3. Advanced Model Binding & Zero-Allocation Patterns

Minimal APIs inspect parameter types and attributes at compile time:

| Source Attribute | Meaning | Example |
| :--- | :--- | :--- |
| **\`[FromRoute]\`** | Extracted from URL path parameters | \`app.MapGet("/users/{id:guid}", ([FromRoute] Guid id) => ...)\` |
| **\`[FromQuery]\`** | Extracted from URL query string | \`app.MapGet("/search", ([FromQuery] string q, [FromQuery] int page) => ...)\` |
| **\`[FromBody]\`** | Deserialized from HTTP JSON body | \`app.MapPost("/orders", ([FromBody] CreateOrderRequest dto) => ...)\` |
| **\`[FromHeader]\`** | Extracted from HTTP request header | \`app.MapGet("/secure", ([FromHeader(Name = "X-Tenant-ID")] string tenantId) => ...)\` |
| **\`[FromServices]\`** | Injected directly from DI container | \`app.MapDelete("/items/{id}", (int id, [FromServices] IItemService svc) => ...)\` |
| **\`[AsParameters]\`** | Aggregates multiple sources into a single struct | \`app.MapGet("/products", ([AsParameters] ProductFilter filter) => ...)\` |

### Zero-Allocation Custom Parameter Binding with \`BindAsync\` and \`TryParse\`

You can create custom domain types that automatically bind from HTTP requests without reflection or manual parsing:

\`\`\`csharp
public readonly record struct PagingParameters(int Page, int PageSize)
{
    // Custom TryParse enables automatic query string binding: "?page=2&pageSize=50"
    public static bool TryParse(string? value, IFormatProvider? provider, out PagingParameters result)
    {
        result = new PagingParameters(1, 20); // Defaults
        if (string.IsNullOrWhiteSpace(value)) return false;

        var parts = value.Split('-');
        if (parts.Length == 2 && int.TryParse(parts[0], out int p) && int.TryParse(parts[1], out int s))
        {
            result = new PagingParameters(p, s);
            return true;
        }
        return false;
    }

    // Custom BindAsync gives full access to HttpContext for complex multi-source binding
    public static ValueTask<PagingParameters> BindAsync(HttpContext context, ParameterInfo parameter)
    {
        int page = int.TryParse(context.Request.Query["page"], out int p) ? Math.Max(1, p) : 1;
        int pageSize = int.TryParse(context.Request.Query["pageSize"], out int ps) ? Math.Clamp(ps, 1, 100) : 20;

        return ValueTask.FromResult(new PagingParameters(page, pageSize));
    }
}

// Endpoint usage is completely clean and strongly typed:
app.MapGet("/api/v1/catalog", (PagingParameters paging, ICatalogService catalog) =>
{
    return TypedResults.Ok(catalog.GetProducts(paging.Page, paging.PageSize));
});
\`\`\`

---

## 4. Route Groups & Endpoint Filters (\`IEndpointFilter\`)

In real-world enterprise architectures, you must group related endpoints and apply cross-cutting policies (validation, authentication, rate limiting, logging) consistently.

### Route Groups with \`MapGroup\`
\`\`\`csharp
public static class OrderEndpoints
{
    public static RouteGroupBuilder MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/orders")
            .RequireAuthorization("RequireAdminRole")
            .RequireRateLimiting("FixedWindowPolicy")
            .WithTags("Orders Management");

        group.MapGet("/", GetAllOrders);
        group.MapGet("/{id:guid}", GetOrderById).WithName("GetOrderById");
        group.MapPost("/", CreateOrder).AddEndpointFilter<ValidationFilter<CreateOrderRequest>>();

        return group;
    }
}
\`\`\`

### Writing Reusable Endpoint Filters (\`IEndpointFilter\`)
\`\`\`csharp
public class ValidationFilter<T> : IEndpointFilter where T : class
{
    private readonly IValidator<T>? _validator;

    public ValidationFilter(IValidator<T>? validator = null)
    {
        _validator = validator;
    }

    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context, 
        EndpointFilterDelegate next)
    {
        if (_validator is not null)
        {
            var argument = context.Arguments.OfType<T>().FirstOrDefault();
            if (argument is not null)
            {
                var validationResult = await _validator.ValidateAsync(argument, context.HttpContext.RequestAborted);
                if (!validationResult.IsValid)
                {
                    // Short-circuit the request pipeline with RFC 7807 ValidationProblem!
                    return TypedResults.ValidationProblem(validationResult.ToDictionary());
                }
            }
        }

        // Proceed to next filter or endpoint handler
        return await next(context);
    }
}
\`\`\`

---

## 5. Vertical Slice Architecture: The REPR Pattern & FastEndpoints

Modern high-scale .NET applications are shifting away from giant controllers to **Vertical Slice Architecture** using the **REPR (Request-Endpoint-Response) Pattern**:

\`\`\`csharp
using FastEndpoints;

// One class = One Endpoint = Single Responsibility
public class CreateCustomerEndpoint : Endpoint<CreateCustomerRequest, CustomerResponse>
{
    private readonly ICustomerRepository _repository;

    public CreateCustomerEndpoint(ICustomerRepository repository)
    {
        _repository = repository;
    }

    public override void Configure()
    {
        Post("/api/v1/customers");
        AllowAnonymous();
        Description(b => b
            .Produces<CustomerResponse>(StatusCodes.Status201Created)
            .ProducesProblemDetails(StatusCodes.Status400BadRequest));
    }

    public override async Task HandleAsync(CreateCustomerRequest req, CancellationToken ct)
    {
        var customer = new Customer(req.FullName, req.Email);
        await _repository.SaveAsync(customer, ct);

        await SendCreatedAtAsync<GetCustomerByIdEndpoint>(
            new { id = customer.Id }, 
            new CustomerResponse(customer.Id, customer.FullName, customer.Email), 
            cancellation: ct);
    }
}
\`\`\`

---

## 6. Common Anti-Patterns & Production Pitfalls

### Pitfall 1: Returning Untyped \`IResult\` Instead of \`TypedResults\`
\`\`\`csharp
// BAD: Returns untyped IResult. OpenAPI/Swagger cannot infer response types automatically!
app.MapGet("/api/items/{id}", async (int id, IItemService service) =>
{
    var item = await service.GetAsync(id);
    return item != null ? Results.Ok(item) : Results.NotFound(); // Boxed object allocation!
});

// BEST PRACTICE: Use Results<Ok<T>, NotFound> union return types
app.MapGet("/api/items/{id}", async (int id, IItemService service) => 
    Results<Ok<ItemDto>, NotFound> async () =>
{
    var item = await service.GetAsync(id);
    return item != null ? TypedResults.Ok(item) : TypedResults.NotFound();
});
\`\`\`

### Pitfall 2: Fat Route Handlers in \`Program.cs\`
Putting hundreds of lambda implementations directly in \`Program.cs\` creates unmaintainable spaghettified code. Always organize endpoints into static extension classes using \`MapGroup\`.

---

## 7. Master Comparison Matrix: Controllers vs. Minimal APIs vs. FastEndpoints

| Dimension | Controller Architecture | Minimal APIs (.NET 8/9) | FastEndpoints (REPR Pattern) |
| :--- | :--- | :--- | :--- |
| **Request Allocation** | High (Instantiates controller per request) | **Ultra-Low (Compiled delegates)** | **Ultra-Low (Lightweight handlers)** |
| **Throughput (req/sec)** | Baseline (1x) | **~35% Faster (1.35x)** | **~30% Faster (1.30x)** |
| **Native AOT Ready** | No (Relies heavily on Reflection) | **100% Native AOT Compatible** | **100% Native AOT Compatible** |
| **Code Organization** | Grouped by Resource (Controller) | Functional Lambdas / Extensions | **Vertical Slice (1 Class = 1 Endpoint)** |
| **Filter Pipeline** | 5-stage MVC Action Filters | \`IEndpointFilter\` chain | Pre/Post Processors + FastEndpoints Filters |
| **OpenAPI / Swagger** | \`[ProducesResponseType]\` | \`TypedResults\` or \`.Produces<T>()\` | Built-in Fluent Swagger Specs |
| **Best Use Case** | Legacy migrations, large UI apps | High-throughput Microservices, Serverless | Complex Enterprise APIs, DDD Vertical Slices |`,
  content_fa: `## ۱. سیر تکامل: از کنترلرهای سنگین MVC تا اندپوینت‌های سبک و ابری

در نسخه‌های اولیه دات‌نت، ساخت APIهای وب متکی بر معماری سنتی **ASP.NET Core MVC Controllers** بود:

\`\`\`csharp
// معماری سنتی کنترلرها (میراث ۲۰۰۹)
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    // تزریق وابستگی‌های متعدد در سازنده (Fat Constructor Anti-Pattern)
    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger, IPaymentGateway paymentGateway)
    {
        // ...
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id) { /* ... */ }
}
\`\`\`

### چالش‌های معماری Controllerها:
۱. **سربار بالای Reflection و تخصیص حافظه**: به ازای هر درخواست HTTP، نمونه جدیدی از کلاس کنترلر روی Heap ساخته شده و تمام وابستگی‌های سازنده آن در کانتینر DI تحلیل می‌شوند.
۲. **نقض اصل تک‌مسئولیتی (SRP)**: کنترلرها به مرور زمان به کلاس‌های غول‌پیکر با صدها خط کد تبدیل می‌شوند.
۳. **ناسازگاری با Native AOT**: سیستم کشف کنترلرها متکی بر Reflection در زمان اجرا است که امکان کامپایل بدون JIT (Native AOT) در دات‌نت ۸ و ۹ را مختل می‌سازد.

دات‌نت با معرفی **Minimal APIs** و سورس جنریتور **\`RequestDelegateFactory\`**، معماری بسیار سریعی با حذف کامل Reflection ارائه داده است.

---

## ۲. کالبدشکافی پایپ‌لاین داخلی: مقایسه Controller و Minimal API

![ASP.NET Core Request Routing Pipelines](/images/roadmaps/aspnet-controllers-minimal-apis-routing.jpg)

### ۱. پایپ‌لاین Controller (مبتنی بر Reflection و فیلترهای MVC):
۱. مسیریابی درخواست با \`EndpointRoutingMiddleware\`.
۲. ساخت شیء کنترلر توسط \`IControllerFactory\` و تزریق وابستگی‌ها با Reflection.
۳. اجرای خط لوله فیلترهای پنج‌گانه MVC (شامل Authorization, Resource, Action, Exception, Result).
۴. استخراج پارامترها با \`IModelBinder\` و بررسی \`ModelState\`.
۵. اجرای اکشن و نوشتن نتیجه در استریم پاسخ.

### ۲. پایپ‌لاین Minimal API در دات‌نت ۸ و ۹ (بدون Reflection):
۱. تطبیق مستقیم روت در جدول Radix Tree با بالاترین سرعت.
۲. اجرای دلیگیت کامپایل‌شده \`RequestDelegate\` تولیدشده توسط Roslyn Source Generator در زمان بیلد.
۳. اجرای زنجیره سبک **\`IEndpointFilter\`**.
۴. نوشتن مستقیم داده‌ها با **\`TypedResults\`** بدون نیاز به Boxing یا سربار حافظه.

---

## ۳. منابع Model Binding و الگوهای پیشرفته Zero-Allocation

| ویژگی ورودی | منبع استخراج داده | مثال |
| :--- | :--- | :--- |
| **\`[FromRoute]\`** | از بخش‌های آدرس URL | \`app.MapGet("/users/{id:guid}", ([FromRoute] Guid id) => ...)\` |
| **\`[FromQuery]\`** | از رشته Query String | \`app.MapGet("/search", ([FromQuery] string q) => ...)\` |
| **\`[FromBody]\`** | بدنه JSON درخواست | \`app.MapPost("/orders", ([FromBody] CreateOrderRequest dto) => ...)\` |
| **\`[FromHeader]\`** | از هدرهای ارسالی HTTP | \`app.MapGet("/tenant", ([FromHeader(Name = "X-Tenant-ID")] string id) => ...)\` |
| **\`[FromServices]\`** | تزریق مستقیم از کانتینر DI | \`app.MapDelete("/items/{id}", (int id, [FromServices] IItemService svc) => ...)\` |
| **\`[AsParameters]\`** | تجمیع چندین منبع در یک استراکت | \`app.MapGet("/filter", ([AsParameters] SearchFilter filter) => ...)\` |

### بایندینگ سفارشی بدون سربار با \`BindAsync\` و \`TryParse\`:

\`\`\`csharp
public readonly record struct PagingParameters(int Page, int PageSize)
{
    // متد TryParse برای بایندینگ خودکار از رشته Query String
    public static bool TryParse(string? value, IFormatProvider? provider, out PagingParameters result)
    {
        result = new PagingParameters(1, 20);
        if (string.IsNullOrWhiteSpace(value)) return false;
        var parts = value.Split('-');
        if (parts.Length == 2 && int.TryParse(parts[0], out int p) && int.TryParse(parts[1], out int s))
        {
            result = new PagingParameters(p, s);
            return true;
        }
        return false;
    }

    // متد BindAsync برای دسترسی کامل به HttpContext
    public static ValueTask<PagingParameters> BindAsync(HttpContext context, ParameterInfo parameter)
    {
        int page = int.TryParse(context.Request.Query["page"], out int p) ? Math.Max(1, p) : 1;
        int pageSize = int.TryParse(context.Request.Query["pageSize"], out int ps) ? Math.Clamp(ps, 1, 100) : 20;
        return ValueTask.FromResult(new PagingParameters(page, pageSize));
    }
}
\`\`\`

---

## ۴. گروه‌بندی مسیرها با \`MapGroup\` و فیلترهای \`IEndpointFilter\`

برای سازماندهی اندپوینت‌های بزرگ سازمانی از قابلیت \`MapGroup\` و فیلترهای اعتبارسنجی استفاده می‌شود:

\`\`\`csharp
public static class OrderEndpoints
{
    public static RouteGroupBuilder MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/orders")
            .RequireAuthorization("RequireAdminRole")
            .WithTags("Orders");

        group.MapGet("/", GetAllOrders);
        group.MapPost("/", CreateOrder).AddEndpointFilter<ValidationFilter<CreateOrderRequest>>();
        return group;
    }
}
\`\`\`

---

## ۵. معماری Vertical Slice و الگوی REPR در FastEndpoints

الگوی **REPR (Request-Endpoint-Response)** کنترلرهای حجیم را به کلاس‌های مستقل با تفکیک وظایف کامل تبدیل می‌کند:

\`\`\`csharp
using FastEndpoints;

public class CreateCustomerEndpoint : Endpoint<CreateCustomerRequest, CustomerResponse>
{
    private readonly ICustomerRepository _repository;
    public CreateCustomerEndpoint(ICustomerRepository repository) => _repository = repository;

    public override void Configure()
    {
        Post("/api/v1/customers");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateCustomerRequest req, CancellationToken ct)
    {
        var customer = new Customer(req.FullName, req.Email);
        await _repository.SaveAsync(customer, ct);
        await SendOkAsync(new CustomerResponse(customer.Id, customer.FullName, customer.Email), ct);
    }
}
\`\`\`

---

## ۶. ماتریس مقایسه جامع: Controllers در برابر Minimal APIs و FastEndpoints

| بعد مقایسه | معماری Controllers | معماری Minimal APIs (.NET 8/9) | کتابخانه FastEndpoints |
| :--- | :--- | :--- | :--- |
| **تخصیص حافظه (Memory)** | بالا (ساخت شیء کنترلر در هر Request) | **بسیار اندک (کدهای کامپایل‌شده دلیگیت)** | **بسیار اندک (هندلرهای سبک)** |
| **نرخ Throughput** | پایه (1x) | **~۳۵٪ سریع‌تر (1.35x)** | **~۳۰٪ سریع‌تر (1.30x)** |
| **پشتیبانی از Native AOT** | ضعیف (وابسته به Reflection) | **۱۰۰٪ سازگار با Native AOT** | **۱۰۰٪ سازگار با Native AOT** |
| **سازماندهی کدها** | دسته‌بندی بر اساس Resource | توابع لامبدا و Extension Methods | **Vertical Slice (یک کلاس = یک اندپوینت)** |
| **پایپ‌لاین فیلترها** | فیلترهای ۵ مرحله‌ای MVC | فیلترهای سبک \`IEndpointFilter\` | فیلترهای اختصاصی FastEndpoints |
| **مستندسازی OpenAPI** | اتریبیوت‌های \`[ProducesResponseType]\` | ساختار \`TypedResults\` | تعریف Fluent مستندات Swagger |`,
};
