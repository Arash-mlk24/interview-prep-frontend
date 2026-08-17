import { RoadmapTopic } from "../../../models";

export const securityRolePolicyAuthorizationTopic: RoadmapTopic = {
  id: "topic-dotnet-security-role-policy-authorization",
  stepId: "step-mid-security-auth",
  slug: "security-role-policy-authorization",
  order: 2,
  title: "Role-Based & Policy-Based Authorization Handlers",
  title_fa: "مجوزدهی مبتنی بر نقش (RBAC) و مبتنی بر پالیسی (Policy-Based Authorization)",
  summary:
    "Master declarative [Authorize] attributes, role checks, custom policy requirements, IAuthorizationHandler implementations, and resource-based authorization.",
  summary_fa:
    "تسلط بر ویژگی‌های [Authorize]، بررسی نقش‌ها، ساخت پالیسی‌های سفارشی با IAuthorizationRequirement و IAuthorizationHandler و کنترل دسترسی به منابع (Resource-Based).",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Role-Based vs Policy-Based Authorization

- **Role-Based (Simple)**: \`[Authorize(Roles = "Admin,Manager")]\`
- **Policy-Based (Flexible & Decoupled)**: Encapsulates complex business rules into named policies.

\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("MustBeSeniorEmployee", policy =>
        policy.RequireClaim("Department", "Engineering")
              .RequireClaim("ExperienceYears", "3", "4", "5+"));

    options.AddPolicy("MinimumAge21", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(21)));
});
\`\`\`

---

## 2. Custom Authorization Handlers

\`\`\`csharp
public record MinimumAgeRequirement(int MinimumAge) : IAuthorizationRequirement;

public class MinimumAgeHandler : AuthorizationHandler<MinimumAgeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        MinimumAgeRequirement requirement)
    {
        var dateOfBirthClaim = context.User.FindFirst(ClaimTypes.DateOfBirth);
        if (dateOfBirthClaim is null) return Task.CompletedTask;

        var dob = DateTime.Parse(dateOfBirthClaim.Value);
        var age = DateTime.Today.Year - dob.Year;

        if (age >= requirement.MinimumAge)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
\`\`\`

---

## 3. Resource-Based Authorization

Authorizing whether a user owns or has edit permissions for a specific entity instance:

\`\`\`csharp
var authorizationResult = await authorizationService.AuthorizeAsync(User, document, "DocumentOwnerPolicy");
if (!authorizationResult.Succeeded)
{
    return Forbid();
}
\`\`\``,
  content_fa: `## ۱. مقایسه Role-Based با Policy-Based Authorization

در حالی که بررسی نقش به صورت ساده و با نام نقش انجام می‌شود، پالیسی‌ها به شما اجازه می‌دهند منطق تجاری دسترسی را کاملاً مجزا و تمیز پیاده‌سازی کنید:

\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("MustBeSeniorEmployee", policy =>
        policy.RequireClaim("Department", "Engineering"));

    options.AddPolicy("MinimumAge21", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(21)));
});
\`\`\`

---

## ۲. پیاده‌سازی Custom Authorization Handler

پیاده‌سازی اینترفیس‌های \`IAuthorizationRequirement\` و کلاس \`AuthorizationHandler\` برای اعتبارسنجی شرایط پویا.

---

## ۳. کنترل دسترسی بر اساس منبع (Resource-Based Authorization)

بررسی دسترسی کاربر به یک رکورد یا سند مشخص در زمان اجرا با \`IAuthorizationService\`.`,
};
