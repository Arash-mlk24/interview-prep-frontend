import { RoadmapTopic } from "../../../models";

export const securityRolePolicyAuthorizationTopic: RoadmapTopic = {
  id: "topic-dotnet-security-role-policy-authorization",
  stepId: "step-mid-security-auth",
  slug: "security-role-policy-authorization",
  order: 2,
  title: "Role-Based, Policy-Based & Resource-Based Authorization Handlers",
  title_fa: "مجوزدهی مبتنی بر نقش (RBAC)، مبتنی بر پالیسی و اعتبارسنجی منبع‌محور",
  summary:
    "Master ASP.NET Core authorization: RBAC vs ABAC vs ReBAC, IAuthorizationRequirement, AuthorizationHandler<TRequirement, TResource>, dynamic policies via IAuthorizationPolicyProvider, and FallbackPolicy enforcement in .NET 8/9.",
  summary_fa:
    "تسلط عمیق بر لایه مجوزدهی ASP.NET Core: مقایسه RBAC و ABAC و ReBAC، پیاده‌سازی IAuthorizationRequirement و هندلرهای منبع‌محور (Resource-Based)، تولید داینامیک پالیسی‌ها با IAuthorizationPolicyProvider و امنیت سرتاسری با FallbackPolicy در دات‌نت ۸ و ۹.",
  readingTimeMinutes: 32,
  difficulty: "mid",
  content: `## 1. Evolution: From Rigid RBAC to Decoupled Policy & Resource-Based Authorization

In legacy web applications, authorization was tightly coupled to hardcoded string roles:

\`\`\`csharp
// ANTI-PATTERN: Rigid, brittle, leads to "Role Explosion"
[Authorize(Roles = "Admin,SuperUser,BillingManager,RegionalDirector")]
public IActionResult DeleteInvoice(Guid id)
{
    // If a new 'Auditor' role is added next month, developer must edit C# attributes across 50 controllers!
}
\`\`\`

### The Evolution of Access Control Models:
1. **RBAC (Role-Based Access Control)**: Assigns coarse permissions to named roles (\`Admin\`, \`User\`). Rapidly degrades into "Role Explosion" as business rules grow.
2. **Claims-Based Authorization**: Checks specific assertions in the user's token (\`RequireClaim("department", "finance")\`).
3. **ABAC / Policy-Based Authorization**: Evaluates rich business requirements (user attributes, time of day, environment, multi-claim logic) encapsulated into named **Policies**.
4. **ReBAC / Resource-Based Authorization**: Evaluates permissions **against a specific runtime entity instance** (e.g. "Can User #102 edit Invoice #9081?").

---

## 2. The Core ASP.NET Core Authorization Engine

The authorization subsystem in ASP.NET Core is built upon three decoupled abstractions:

\`\`\`text
┌───────────────────────────────────────────────┐
│     IAuthorizationRequirement (Data)          │  e.g. MinimumSeniorityRequirement(5 Years)
└───────────────────────┬───────────────────────┘
                        ▼ Evaluated by
┌───────────────────────────────────────────────┐
│     AuthorizationHandler<TRequirement>        │  e.g. MinimumSeniorityHandler : AuthorizationHandler<...>
│  - Inspects context.User                      │
│  - Calls context.Succeed(requirement)         │
└───────────────────────┬───────────────────────┘
                        ▼ Executed via
┌───────────────────────────────────────────────┐
│     IAuthorizationService                     │  e.g. await authService.AuthorizeAsync(user, resource, "Policy")
└───────────────────────────────────────────────┘
\`\`\`

---

### Understanding \`AuthorizationHandlerContext\` Lifecycle:
Inside an \`AuthorizationHandler\`, you interact with \`AuthorizationHandlerContext\`:
- **\`context.Succeed(requirement)\`**: Marks this specific requirement as satisfied.
- **\`context.Fail()\`**: **Explicit, irreversible failure!** Even if other handlers succeed, calling \`Fail()\` forces the entire evaluation to fail (Fail-Closed principle).
- **Return without calling Succeed or Fail (Abstain)**: Allows other handlers registered for the same requirement to evaluate the user.

---

## 3. Creating Custom Requirements & Authorization Handlers

Let's build a policy enforcing that only employees with a **Security Clearance Level** higher than the classification of a document can access it.

### Step 1: Define the Requirement
\`\`\`csharp
public record ClearanceRequirement(int MinimumClearanceLevel) : IAuthorizationRequirement;
\`\`\`

### Step 2: Implement the Handler
\`\`\`csharp
public class ClearanceAuthorizationHandler : AuthorizationHandler<ClearanceRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ClearanceRequirement requirement)
    {
        var clearanceClaim = context.User.FindFirst("clearance_level");
        if (clearanceClaim == null)
        {
            // User does not have a clearance claim; abstain and do not succeed
            return Task.CompletedTask;
        }

        if (int.TryParse(clearanceClaim.Value, out var userLevel) && 
            userLevel >= requirement.MinimumClearanceLevel)
        {
            // Mark requirement as satisfied!
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
\`\`\`

### Step 3: Register in \`Program.cs\`
\`\`\`csharp
builder.Services.AddSingleton<IAuthorizationHandler, ClearanceAuthorizationHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TopSecretClearance", policy =>
        policy.Requirements.Add(new ClearanceRequirement(5)));
});
\`\`\`

---

## 4. Resource-Based Authorization (Imperative Evaluation)

Declarative \`[Authorize(Policy = "...")]\` attributes evaluate permissions **before** the action method executes. However, they cannot inspect the actual database entity because the entity has not been fetched yet!

**Resource-Based Authorization** uses \`IAuthorizationService\` imperatively after loading the record.

---

### Step 1: Define Resource-Based Requirement & Handler
\`\`\`csharp
public class DocumentEditRequirement : IAuthorizationRequirement;

public class DocumentAuthorizationHandler : AuthorizationHandler<DocumentEditRequirement, Document>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        DocumentEditRequirement requirement,
        Document resource)
    {
        var userIdString = context.User.FindFirst("sub")?.Value;
        if (!Guid.TryParse(userIdString, out var currentUserId))
            return Task.CompletedTask;

        // Rule 1: The document author can always edit
        if (resource.AuthorId == currentUserId)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Rule 2: System Administrators can edit any document
        if (context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        return Task.CompletedTask;
    }
}
\`\`\`

---

### Step 2: Imperative Evaluation in Controllers or Minimal APIs

\`\`\`csharp
app.MapPut("/api/documents/{id:guid}", async (
    Guid id,
    UpdateDocumentDto dto,
    AppDbContext db,
    IAuthorizationService authService,
    ClaimsPrincipal user) =>
{
    var document = await db.Documents.FindAsync(id);
    if (document == null)
        return Results.NotFound();

    // Imperatively evaluate resource authorization:
    var authResult = await authService.AuthorizeAsync(user, document, new DocumentEditRequirement());

    if (!authResult.Succeeded)
    {
        // Return 403 Forbidden (Authenticated, but unauthorized for this specific resource!)
        return Results.Forbid();
    }

    document.UpdateContent(dto.Title, dto.Body);
    await db.SaveChangesAsync();

    return Results.Ok(document);
}).RequireAuthorization();
\`\`\`

---

## 5. Dynamic Permission Policies with \`IAuthorizationPolicyProvider\`

In large enterprise systems with hundreds of granular permissions (\`Permissions.Users.Create\`, \`Permissions.Reports.Export\`), manually registering 500 named policies in \`Program.cs\` is unmaintainable.

### The Solution: Custom \`IAuthorizationPolicyProvider\`

\`\`\`csharp
// Custom declarative attribute
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public class HasPermissionAttribute(string permission) : AuthorizeAttribute(policy: $"Permission:{permission}");

// Dynamic Policy Provider
public class PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : IAuthorizationPolicyProvider
{
    private readonly DefaultAuthorizationPolicyProvider _fallbackProvider = new(options);

    public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (policyName.StartsWith("Permission:", StringComparison.OrdinalIgnoreCase))
        {
            var permission = policyName["Permission:".Length..];
            var policy = new AuthorizationPolicyBuilder()
                .AddRequirements(new PermissionRequirement(permission))
                .Build();

            return Task.FromResult<AuthorizationPolicy?>(policy);
        }

        // Fallback to standard named policies registered in Program.cs
        return _fallbackProvider.GetPolicyAsync(policyName);
    }

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => 
        _fallbackProvider.GetDefaultPolicyAsync();

    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => 
        _fallbackProvider.GetFallbackPolicyAsync();
}
\`\`\`

---

## 6. Enterprise Global Protection: \`FallbackPolicy\` (Secure by Default)

In a microservice with dozens of endpoints, a developer might accidentally forget to add \`[Authorize]\` or \`.RequireAuthorization()\` on a newly created route, exposing sensitive business logic to the public internet.

**The Solution: Configure a Global Fallback Policy**:

\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    // FallbackPolicy applies to EVERY endpoint in the entire API that lacks explicit metadata!
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});
\`\`\`

- With \`FallbackPolicy\`, every single endpoint requires authentication by default.
- To make a public endpoint (e.g. \`/api/auth/login\` or \`/health\`), developers must **explicitly opt-out** using \`[AllowAnonymous]\` or \`.AllowAnonymous()\`.

---

## 7. Master Comparison Matrix: Access Control Paradigms

| Paradigm | Configuration | Granularity | Evaluation Timing | Best Production Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **RBAC** | \`[Authorize(Roles = "...")]\` | Coarse | Pre-Action (Declarative) | Simple internal administrative portals |
| **Claims-Based** | \`policy.RequireClaim(...)\` | Medium | Pre-Action (Declarative) | Static multi-department enterprise apps |
| **Policy (ABAC)** | \`IAuthorizationRequirement\` | High | Pre-Action (Declarative) | Complex business rules (Seniority, Tenant) |
| **Resource (ReBAC)** | \`IAuthorizationService\` | **Ultra-Fine (Per Instance)**| **Post-Load (Imperative)** | **Document ownership, Multi-tenant Isolation** |`,
  content_fa: `## ۱. سیر تکامل: از بررسی‌های سنتی نقش (RBAC) تا مجوزدهی پالیسی‌محور و منبع‌محور

در معماری‌های قدیمی، کنترل دسترسی با چک کردن نام نقش‌ها به صورت متنی (\`[Authorize(Roles = "Admin")]\`) انجام می‌شد که معایب بزرگی به همراه داشت:
- **پدیده Role Explosion (انفجار نقش‌ها)**: با رشد منطق تجاری، تعداد نقش‌ها بی‌رویه افزایش یافته و نگهداری کدهای کنترلر غیرممکن می‌شود.
- **وابستگی شدید به دیتابیس**: تغییر یک قانون دسترسی نیازمند تغییر اتریبیوت‌های C# در ده‌ها کنترلر مختلف بود.

### سیر تحول مدل‌های دسترسی:
۱. **مدل RBAC (مبتنی بر نقش)**: اعطای دسترسی بر اساس نقش‌های کلی (\`Admin\`، \`User\`).
۲. **مدل Claims-Based**: اعطای دسترسی بر اساس کلیم‌های کاربر (\`Department == "HR"\`).
۳. **مدل ABAC / Policy-Based**: تجمیع قوانین پیچیده کسب‌وکار (ساعات کاری، سطح ارشدیت، چند کلیم مختلف) در قالب یک **پالیسی** مستقل.
۴. **مدل ReBAC / Resource-Based**: بررسی دسترسی کاربر **نسبت به یک نمونه مشخص از داده در زمان اجرا** (مانند "آیا کاربر X مالک فاکتور شماره Y است؟").

---

## ۲. موتور داخلی مجوزدهی (Authorization Engine) در ASP.NET Core

سیستم مجوزدهی دات‌نت بر پایه سه مفهوم تفکیک‌شده طراحی شده است:

۱. **شرط مجوز (\`IAuthorizationRequirement\`)**: کلاسی که داده‌ها و معیارهای شرط دسترسی را نگهداری می‌کند (مثال: \`ClearanceRequirement\`).
۲. **هندلر اعتبارسنجی (\`AuthorizationHandler<T>\`)**: کلاسی که منطق بررسی کلیم‌های کاربر و شروط را اجرا می‌کند.
۳. **سرویس مجوزدهی (\`IAuthorizationService\`)**: سرویسی که برای اجرای بررسی‌ها در کنترلرها یا اندپوینت‌ها استفاده می‌شود.

---

### چرخه حیات متدها در \`AuthorizationHandlerContext\`:
- **\`context.Succeed(requirement)\`**: اعلام برقراری موفقیت‌آمیز شرط دسترسی.
- **\`context.Fail()\`**: **شکست قطعی و غیرقابل بازگشت!** حتی اگر هندلرهای دیگر شرط را تایید کنند، فراخوانی Fail باعث رد شدن قطعی کل درخواست می‌شود (اصل Fail-Closed).
- **عدم فراخوانی متدها (ممتنع)**: به سایر هندلرها اجازه ارزیابی داده می‌شود.

---

## ۳. پیاده‌سازی هندلرهای اختصاصی (Custom Authorization Handlers)

\`\`\`csharp
public record ClearanceRequirement(int Level) : IAuthorizationRequirement;

public class ClearanceHandler : AuthorizationHandler<ClearanceRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ClearanceRequirement requirement)
    {
        var levelClaim = context.User.FindFirst("clearance_level")?.Value;
        if (int.TryParse(levelClaim, out var userLevel) && userLevel >= requirement.Level)
        {
            context.Succeed(requirement); // تایید دسترسی
        }

        return Task.CompletedTask;
    }
}
\`\`\`

---

## ۴. کنترل دسترسی بر اساس منبع داده (Resource-Based Authorization)

اتریبیوت‌های سنتی \`[Authorize]\` قبل از ورود به متد اجرا می‌شوند و نمی‌توانند موجودیت دیتابیس را که هنوز واکشی نشده بررسی کنند. با **Resource-Based Authorization**، پس از واکشی رکورد از دیتابیس، دسترسی کاربر نسبت به آن رکورد سنجیده می‌شود:

\`\`\`csharp
app.MapPut("/api/documents/{id:guid}", async (
    Guid id,
    AppDbContext db,
    IAuthorizationService authService,
    ClaimsPrincipal user) =>
{
    var doc = await db.Documents.FindAsync(id);
    if (doc == null) return Results.NotFound();

    // بررسی دسترسی کاربر نسبت به این سند خاص:
    var result = await authService.AuthorizeAsync(user, doc, new DocumentEditRequirement());

    if (!result.Succeeded)
    {
        return Results.Forbid(); // بازگرداندن کد 403 Forbidden
    }

    return Results.Ok();
}).RequireAuthorization();
\`\`\`

---

## ۵. تولید داینامیک پالیسی‌ها با \`IAuthorizationPolicyProvider\`

در سیستم‌های بزرگ سازمانی با صدها سطح دسترسی ریزدانه (\`Permission.Users.Create\`، \`Permission.Reports.View\`)، ثبت دستی صدها پالیسی در \`Program.cs\` غیرممکن است. با پیاده‌سازی اینترفیس **\`IAuthorizationPolicyProvider\`**، دات‌نت پالیسی‌های سفارشی را در لحظه فراخوانی به صورت پویا می‌سازد.

---

## ۶. امنیت سرتاسری با \`FallbackPolicy\` (امنیت در حالت پیش‌فرض)

برای جلوگیری از خطای انسانی برنامه‌نویسان در فراموش کردن اتریبیوت \`[Authorize]\` روی اندپوینت‌های جدید، از **\`FallbackPolicy\`** استفاده می‌شود:

\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    // تمامی اندپوینت‌های برنامه به صورت پیش‌فرض نیازمند لاگین خواهند بود!
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});
\`\`\`
با این کار، تمام اندپوینت‌ها قفل شده و تنها اندپوینت‌هایی که صراحتاً اتریبیوت \`[AllowAnonymous]\` دارند بدون لاگین قابل دسترسی خواهند بود.

---

## ۷. ماتریس مقایسه جامع الگوهای مجوزدهی

| الگوی دسترسی | نحوه پیکربندی | میزان دقت (Granularity) | زمان ارزیابی | سناریوی کاربردی |
| :--- | :--- | :--- | :--- | :--- |
| **RBAC (نقش‌محور)** | \`[Authorize(Roles = "...")]\` | درشت‌دانه | قبل از اکشن (اعلامی) | پنل‌های ساده ادمین |
| **Claims-Based** | \`policy.RequireClaim(...)\` | متوسط | قبل از اکشن (اعلامی) | تفکیک داده بر اساس دپارتمان |
| **Policy (ABAC)** | \`IAuthorizationRequirement\` | ریزدانه | قبل از اکشن (اعلامی) | قوانین پیچیده تجاری و ارشدیت |
| **Resource (ReBAC)** | \`IAuthorizationService\` | **بسیار دقیق (به ازای هر رکورد)**| **پس از واکشی داده (امری)** | **مالکیت اسناد و ایزولاسیون داده‌ها** |`,
};
