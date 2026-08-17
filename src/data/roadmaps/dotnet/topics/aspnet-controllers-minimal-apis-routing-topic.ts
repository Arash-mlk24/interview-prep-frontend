import { RoadmapTopic } from "../../../models";

export const aspnetControllersMinimalApisRoutingTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-controllers-minimal-apis-routing",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-controllers-minimal-apis-routing",
  order: 1,
  title: "Controllers, Minimal APIs, Routing & Model Binding",
  title_fa: "کنترلرها، Minimal APIs، مسیریابی و اعتبارسنجی ورودی‌ها (Model Binding)",
  summary:
    "Compare Controller-based architecture with lightweight Minimal APIs, route parameter constraints, model validation with FluentValidation, and OpenAPI/Swagger.",
  summary_fa:
    "مقایسه معماری مبتنی بر Controller با Minimal APIs با کارایی بالا، محدودیت‌های مسیریابی (Route Constraints)، و اعتبارسنجی با FluentValidation.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. Controllers vs Minimal APIs

ASP.NET Core supports both Controller-based and Minimal API endpoint definitions:

\`\`\`csharp
// Minimal API (High Performance, Reduced Overhead)
app.MapGet("/api/users/{id:guid}", async (Guid id, IUserService userService) =>
{
    var user = await userService.GetByIdAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
})
.WithName("GetUserById")
.Produces<UserDto>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);
\`\`\`

---

## 2. Model Binding Sources

ASP.NET Core binds incoming HTTP requests to C# DTOs from multiple sources:
- \`[FromBody]\`: JSON payload deserialization.
- \`[FromRoute]\`: URL segment values (e.g. \`/api/orders/{id}\`).
- \`[FromQuery]\`: URL query string parameters (e.g. \`?page=1&limit=10\`).
- \`[FromHeader]\`: HTTP request headers.
- \`[FromServices]\`: Injected directly from DI container.

---

## 3. Input Validation with FluentValidation

Decoupling validation rules from domain models into dedicated validators:

\`\`\`csharp
public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
        RuleFor(x => x.Age).InclusiveBetween(18, 120);
    }
}
\`\`\``,
  content_fa: `## ۱. مقایسه Controllers با Minimal APIs

دات‌نت مدرن امکان ایجاد اندپوینت‌ها به دو صورت Controller و Minimal API را ارائه می‌دهد:

\`\`\`csharp
// تعریف اندپوینت با Minimal API (سریع‌تر و با Memory Overhead کمتر)
app.MapGet("/api/users/{id:guid}", async (Guid id, IUserService userService) =>
{
    var user = await userService.GetByIdAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
})
.WithName("GetUserById")
.Produces<UserDto>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);
\`\`\`

---

## ۲. منابع Model Binding در ASP.NET Core

موتور بایندینگ دات‌نت پارامترها را از بخش‌های مختلف درخواست استخراج می‌کند:
- \`[FromBody]\`: دیکد کردن JSON بدنه درخواست.
- \`[FromRoute]\`: مقادیر بخش‌های مختلف آدرس URL.
- \`[FromQuery]\`: پارامترهای Query String (مانند \`?page=1\`).
- \`[FromHeader]\`: مقادیر هدرهای ارسالی.
- \`[FromServices]\`: تزریق مستقیم سرویس از کانتینر DI.

---

## ۳. اعتبارسنجی ورودی‌ها با FluentValidation

جداسازی قوانین اعتبارسنجی از DTOها با ایجاد ولیدیتورهای قدرتمند و تمیز:

\`\`\`csharp
public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
        RuleFor(x => x.Age).InclusiveBetween(18, 120);
    }
}
\`\`\``,
};
