import { RoadmapTopic } from "../../../models";

export const aspnetConfigurationOptionsSecretsTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-configuration-options-secrets",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-configuration-options-secrets",
  order: 4,
  title: "Configuration System, IOptions Pattern & Secrets Management",
  title_fa: "سیستم تنظیمات (Configuration)، الگوی IOptions و مدیریت امن اسرار",
  summary:
    "Master hierarchical configuration precedence, environment variable double-underscore mapping, the Options Pattern trio (IOptions vs IOptionsSnapshot vs IOptionsMonitor), Fail-Fast startup validation with ValidateOnStart, and User Secrets.",
  summary_fa:
    "تسلط عمیق بر اولویت‌بندی ارائه‌دهندگان کانفیگ، مپینگ متغیرهای محیطی با Double Underscore، مقایسه سه‌گانه الگوی Options (شامل IOptions و IOptionsSnapshot و IOptionsMonitor)، اعتبارسنجی Fail-Fast در زمان استارتاپ با ValidateOnStart، و مدیریت کلیدها با User Secrets.",
  readingTimeMinutes: 28,
  difficulty: "mid",
  content: `## 1. Evolution: From XML \`web.config\` to Extensible Hierarchical Configuration

In legacy .NET Framework architectures, configuration was tightly coupled to a static, monomorphic XML file (\`web.config\`):

\`\`\`xml
<!-- Legacy ASP.NET XML Configuration (2002-2015) -->
<configuration>
  <appSettings>
    <add key="PaymentGatewayUrl" value="https://api.stripe.com/v1" />
    <add key="MaxRetryCount" value="3" />
  </appSettings>
</configuration>
\`\`\`

\`\`\`csharp
// ANTI-PATTERN: Untyped runtime string lookups
string url = ConfigurationManager.AppSettings["PaymentGatewayUrl"] 
    ?? throw new InvalidOperationException();
int retries = int.Parse(ConfigurationManager.AppSettings["MaxRetryCount"] ?? "0");
\`\`\`

### Architectural Flaws of Legacy \`ConfigurationManager\`:
1. **Flat Key-Value Store**: No native support for nested hierarchies, arrays, or strongly-typed object graphs.
2. **Fragile Runtime Parsing**: Relied on magic string keys and manual \`int.Parse()\` calls scattered across the entire codebase.
3. **Zero Extensibility**: Could not easily merge dynamic cloud secret managers (Azure Key Vault, AWS Secrets Manager, Kubernetes ConfigMaps, Docker Environment Variables).

ASP.NET Core replaced this with **\`Microsoft.Extensions.Configuration\`**, an extensible multi-provider pipeline that merges disparate configuration streams into a unified, hierarchical dictionary.

---

## 2. Configuration Provider Pipeline & Precedence Hierarchy

When an application starts with \`WebApplication.CreateBuilder(args)\`, the framework automatically registers configuration providers in the following **strictly prioritized order (Last Provider Wins)**:

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│ 1. appsettings.json (Base Defaults)                         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼ Overridden by
┌─────────────────────────────────────────────────────────────┐
│ 2. appsettings.{Environment}.json (e.g. Development/Staging)│
└──────────────────────────────┬──────────────────────────────┘
                               ▼ Overridden by
┌─────────────────────────────────────────────────────────────┐
│ 3. User Secrets (secrets.json - ONLY in Development)        │
└──────────────────────────────┬──────────────────────────────┘
                               ▼ Overridden by
┌─────────────────────────────────────────────────────────────┐
│ 4. Environment Variables (e.g. Docker / Kubernetes Secrets) │
└──────────────────────────────┬──────────────────────────────┘
                               ▼ Overridden by
┌─────────────────────────────────────────────────────────────┐
│ 5. Command-Line Arguments (--Key=Value)                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

### Environment Variable Hierarchy Mapping (The Double-Underscore Rule)
In JSON, configuration is hierarchical:
\`\`\`json
{
  "DatabaseSettings": {
    "Postgres": {
      "ConnectionString": "Host=localhost;Database=DevDb;",
      "MaxConnections": 50
    }
  }
}
\`\`\`

Operating system shells (Linux, Bash, Docker, Kubernetes) do not allow colons (\`:\`) in environment variable names. ASP.NET Core maps the **double underscore (\`__\`)** directly to hierarchical colons:

\`\`\`bash
# In Dockerfile or Kubernetes Pod manifest:
export DatabaseSettings__Postgres__ConnectionString="Host=db.prod.internal;Database=ProdDb;"
export DatabaseSettings__Postgres__MaxConnections="200"
\`\`\`

When the application boots, \`DatabaseSettings__Postgres__ConnectionString\` seamlessly overrides \`DatabaseSettings:Postgres:ConnectionString\` without changing a single line of C# code!

---

## 3. The Options Pattern: \`IOptions\` vs \`IOptionsSnapshot\` vs \`IOptionsMonitor\`

Instead of injecting the untyped \`IConfiguration\` interface directly, ASP.NET Core enforces the **Options Pattern** to bind configuration sections into strongly-typed POCO classes.

\`\`\`csharp
public class PaymentGatewayOptions
{
    public const string SectionName = "PaymentGateway";

    public string ApiKey { get; init; } = string.Empty;
    public string BaseUrl { get; init; } = string.Empty;
    public int TimeoutSeconds { get; init; } = 30;
}
\`\`\`

---

### Deep Comparison of the Options Pattern Trio:

| Feature | \`IOptions<T>\` | \`IOptionsSnapshot<T>\` | \`IOptionsMonitor<T>\` |
| :--- | :--- | :--- | :--- |
| **DI Lifetime** | **Singleton** | **Scoped** | **Singleton** |
| **Instantiation Cost** | Evaluated once at first resolution | Recomputed **once per \`IServiceScope\`** | Evaluated once, updated via event |
| **Live Reloading** | ❌ No (Immutable for app lifetime) | ✅ Yes (Reflects file updates on next HTTP request) | ✅ Yes (Instant live updates at runtime) |
| **Named Options** | ❌ No | ✅ Yes (\`snapshot.Get("Stripe")\`) | ✅ Yes (\`monitor.Get("Stripe")\`) |
| **Change Notifications**| ❌ No | ❌ No | ✅ Yes (\`monitor.OnChange(callback)\`) |
| **Safe in Singletons?** | ✅ Yes | ❌ **NO (Throws Captive Dependency!)** | ✅ Yes (Ideal for Singletons & Workers) |
| **Optimal Use Case** | Fixed settings that never change at runtime | Scoped web request services needing fresh configs | Long-running BackgroundServices & Caches |

---

### Code Demonstration:

\`\`\`csharp
// 1. IOptions<T> (Singleton, Immutable)
public class StaticPaymentClient(IOptions<PaymentGatewayOptions> options)
{
    private readonly PaymentGatewayOptions _options = options.Value;
}

// 2. IOptionsSnapshot<T> (Scoped, Reloads per HTTP Request)
// MUST only be injected into Scoped or Transient services!
public class ScopedOrderProcessor(IOptionsSnapshot<PaymentGatewayOptions> optionsSnapshot)
{
    // Evaluates the latest configuration for THIS specific HTTP request
    public void Process()
    {
        var currentTimeout = optionsSnapshot.Value.TimeoutSeconds;
    }
}

// 3. IOptionsMonitor<T> (Singleton, Real-Time Live Reloading with OnChange)
public class ResilientPaymentWorker : BackgroundService
{
    private readonly IOptionsMonitor<PaymentGatewayOptions> _monitor;
    private readonly IDisposable? _changeListener;

    public ResilientPaymentWorker(IOptionsMonitor<PaymentGatewayOptions> monitor, ILogger<ResilientPaymentWorker> logger)
    {
        _monitor = monitor;

        // Listen for runtime updates when appsettings.json is modified on disk:
        _changeListener = _monitor.OnChange((newOptions, namedOption) =>
        {
            logger.LogWarning("Payment options reloaded at runtime! New Timeout: {Timeout}s", newOptions.TimeoutSeconds);
        });
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // _monitor.CurrentValue always returns the latest state without creating a scope!
            var activeTimeout = _monitor.CurrentValue.TimeoutSeconds;
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }

    public override void Dispose()
    {
        _changeListener?.Dispose();
        base.Dispose();
    }
}
\`\`\`

---

## 4. Fail-Fast Startup Validation with \`ValidateOnStart\` (.NET 8/9)

One of the most dangerous production hazards is a missing connection string or API key that only crashes hours later when a customer hits a specific endpoint.

ASP.NET Core provides **Fail-Fast Startup Validation**:

\`\`\`csharp
using System.ComponentModel.DataAnnotations;

public class SecurityTokenOptions
{
    public const string SectionName = "SecurityTokens";

    [Required(ErrorMessage = "Issuer is mandatory")]
    public string Issuer { get; init; } = string.Empty;

    [Required]
    [MinLength(32, ErrorMessage = "SecretKey must be at least 32 characters for HMAC-SHA256")]
    public string SecretKey { get; init; } = string.Empty;

    [Range(1, 1440, ErrorMessage = "Token expiry must be between 1 minute and 24 hours")]
    public int ExpiryMinutes { get; init; }
}

// In Program.cs:
builder.Services.AddOptions<SecurityTokenOptions>()
    .Bind(builder.Configuration.GetSection(SecurityTokenOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => !options.SecretKey.Contains("PLACEHOLDER"), "Secret key cannot be a placeholder default!")
    .ValidateOnStart(); // CRITICAL: Crashes at 'builder.Build()' if invalid, BEFORE web server opens TCP ports!
\`\`\`

---

## 5. Development Secret Management with User Secrets

During local development, API keys, database credentials, and certificates must **never be committed to Git repositories**.

### How User Secrets Work:
1. Initialize user secrets in the project directory:
   \`\`\`bash
   dotnet user-secrets init
   \`\`\`
   This adds a \`<UserSecretsId>\` GUID to your \`.csproj\` file.
2. Set secrets from the command line:
   \`\`\`bash
   dotnet user-secrets set "PaymentGateway:ApiKey" "sk_test_51Mz..."
   \`\`\`
3. **Storage Location**: The secrets are stored **outside the Git repository** in your local user profile:
   - **Windows**: \`%APPDATA%\\Microsoft\\UserSecrets\\<UserSecretsId>\\secrets.json\`
   - **Linux/macOS**: \`~/.microsoft/usersecrets/<UserSecretsId>/secrets.json\`

When running in \`Development\` mode, ASP.NET Core automatically merges \`secrets.json\` into the configuration tree.

---

## 6. Common Anti-Patterns & Production Pitfalls

### Pitfall 1: Injecting \`IConfiguration\` Directly (Magic Strings Everywhere)
\`\`\`csharp
// BAD: Prone to typo bugs, no compiler checks, hard to mock in unit tests
public class CustomerService(IConfiguration configuration)
{
    public void Charge()
    {
        var key = configuration["Payment:SecretKey"]; // Returns null if misspelled, no error until runtime!
    }
}

// BEST PRACTICE: Strongly-typed Options Injection
public class CustomerService(IOptions<PaymentOptions> paymentOptions)
{
    public void Charge()
    {
        var key = paymentOptions.Value.SecretKey; // Compile-time safe and 100% mockable!
    }
}
\`\`\`

### Pitfall 2: Injecting \`IOptionsSnapshot<T>\` into a Singleton
Because \`IOptionsSnapshot<T>\` is registered as a **Scoped service**, injecting it into a Singleton (like a \`BackgroundService\` or a singleton cache) causes a **Captive Dependency runtime crash** when scope validation is active! Always use \`IOptionsMonitor<T>\` inside Singletons.

---

## 7. Master Comparison Matrix: Configuration & Options Mechanisms

| Dimension | Direct \`IConfiguration\` | \`IOptions<T>\` | \`IOptionsSnapshot<T>\` | \`IOptionsMonitor<T>\` |
| :--- | :--- | :--- | :--- | :--- |
| **Type Safety** | ❌ None (Untyped Strings) | **✅ 100% Compile-Time Safe** | **✅ 100% Compile-Time Safe** | **✅ 100% Compile-Time Safe** |
| **Startup Validation**| ❌ Manual | ✅ Supported (\`ValidateOnStart\`) | ✅ Supported (\`ValidateOnStart\`) | ✅ Supported (\`ValidateOnStart\`) |
| **Unit Testability** | Hard (Must build in-memory config) | **Trivial (\`Options.Create(new T())\`)** | **Trivial (Mock \`IOptionsSnapshot\`)** | **Trivial (Mock \`IOptionsMonitor\`)** |
| **Runtime Reload** | Manual token listener | ❌ No | ✅ Per HTTP Request | **✅ Instant Push Notification** |
| **Memory Allocation** | Medium (String parsing on lookup)| **Near Zero (Single instance)** | Low (Instantiated per request) | **Near Zero (Single monitored instance)** |`,
  content_fa: `## ۱. سیر تکامل: از فایل‌های استاتیک web.config تا سیستم چندلایه Configuration

در نسخه‌های سنتی دات‌نت، تنظیمات برنامه در یک فایل XML بسته و یکنواخت به نام \`web.config\` نگهداری می‌شد:

\`\`\`xml
<!-- پیکربندی سنتی دات‌نت (۲۰۰۲ تا ۲۰۱۵) -->
<configuration>
  <appSettings>
    <add key="PaymentGatewayUrl" value="https://api.stripe.com/v1" />
  </appSettings>
</configuration>
\`\`\`

### معایب پیکربندی سنتی:
۱. **فقدان ساختار درختی و اشیاء تودرتو**: ذخیره‌سازی داده‌ها فقط به صورت کلید و مقدار متنی ساده امکان‌پذیر بود.
۲. **شکنندگی در زمان اجرا**: برنامه‌نویسان مجبور بودند رشته‌های متنی (Magic Strings) را در کدها پخش کرده و با متدهایی مانند \`int.Parse\` دستی پارس کنند.
۳. **عدم پشتیبانی از محیط‌های ابری**: امکان ادغام آسان متغیرهای محیطی کانتینرها (Docker/K8s) و سرویس‌های امنیتی مانند Azure Key Vault وجود نداشت.

فریم‌ورک ASP.NET Core پکیج مدرن **\`Microsoft.Extensions.Configuration\`** را معرفی کرد که سیستم چندمنبعی با قابلیت ادغام اولویت‌بندی‌شده فراهم می‌سازد.

---

## ۲. پایپ‌لاین ارائه‌دهندگان کانفیگ و اولویت‌بندی (Precedence Order)

هنگام راه‌اندازی برنامه با \`WebApplication.CreateBuilder\`، ارائه‌دهندگان پیکربندی به ترتیب زیر بارگذاری می‌شوند (**هر لایه پایینی مقادیر لایه‌های بالایی را Overwrite می‌کند**):

۱. **\`appsettings.json\`**: مقادیر پیش‌فرض پایه.
۲. **\`appsettings.{Environment}.json\`**: مقادیر اختصاصی محیط (مانند Development یا Production).
۳. **User Secrets (\`secrets.json\`)**: کلیدهای محلی توسعه‌دهنده (تنها در حالت Development).
۴. **متغیرهای محیطی سیستم (Environment Variables)**: مقادیر ارسال‌شده توسط Docker یا Kubernetes.
۵. **آرگومان‌های خط فرمان (Command-Line Arguments)**: بالاترین اولویت برای بازنویسی لحظه‌ای.

---

### قانون Double Underscore (\`__\`) در متغیرهای محیطی:
از آنجا که سیستم‌عامل‌های لینوکس و کانتینرهای داکر اجازه استفاده از علامت دو نقطه (\`:\`) در نام متغیرهای محیطی را نمی‌دهند، دات‌نت به صورت خودکار علامت **\`__\`** را به ساختار درختی تبدیل می‌کند:

\`\`\`bash
# در محیط داکر یا سرور لینوکس:
export DatabaseSettings__Postgres__ConnectionString="Host=db.prod.internal;Database=ProdDb;"
\`\`\`
این مقدار به صورت خودکار جایگزین بخش \`DatabaseSettings:Postgres:ConnectionString\` در فایل JSON می‌شود.

---

## ۳. الگوی Options: مقایسه سه‌گانه IOptions، IOptionsSnapshot و IOptionsMonitor

به جای تزریق مستقیم و پر از خطای \`IConfiguration\`، دات‌نت برنامه‌نویسان را ملزم به استفاده از **الگوی Options** برای بایند کردن تنظیمات به کلاس‌های strongly-typed می‌کند:

| بعد مقایسه | اینترفیس \`IOptions<T>\` | اینترفیس \`IOptionsSnapshot<T>\` | اینترفیس \`IOptionsMonitor<T>\` |
| :--- | :--- | :--- | :--- |
| **طول عمر در DI** | **Singleton** | **Scoped** | **Singleton** |
| **هزینه ساخت** | تنها یک‌بار در اولین درخواست | به ازای هر درخواست HTTP بازخوانی می‌شود | یک‌بار ساخته شده و با Event آپدیت می‌شود |
| **پشتیبانی از Hot-Reload** | ❌ خیر (ثابت تا پایان برنامه) | ✅ بله (در درخواست وب بعدی) | **✅ بله (آنی و در لحظه تغییر فایل)** |
| **پشتیبانی از Named Options** | ❌ خیر | ✅ بله (\`snapshot.Get("Key")\`) | ✅ بله (\`monitor.Get("Key")\`) |
| **رویداد تغییر (\`OnChange\`)** | ❌ خیر | ❌ خیر | **✅ بله (دارای کالبک \`OnChange\`)** |
| **امنیت در سرویس‌های Singleton** | ✅ بله | ❌ **خیر (خطای Captive Dependency!)** | **✅ بله (ایده‌آل برای BackgroundService)** |
| **بهترین سناریوی کاربردی** | تنظیمات ثابت سیستم | سرویس‌های Scoped وب‌سرویس | سرویس‌های پس‌زمینه و کش‌های ماندگار |

---

## ۴. اعتبارسنجی زودهنگام در استارتاپ با \`ValidateOnStart\` در دات‌نت ۸ و ۹

یکی از بدترین اتفاقات در پروداکشن، ناقص بودن کانکشن استرینگ یا اشتباه بودن کلید API است که ساعت‌ها بعد از بالا آمدن سرور با ورود اولین کاربر باعث کرش می‌شود. دات‌نت با قابلیت **Fail-Fast** این مشکل را در همان لحظه اجرای \`builder.Build()\` مهار می‌کند:

\`\`\`csharp
builder.Services.AddOptions<SecurityTokenOptions>()
    .Bind(builder.Configuration.GetSection(SecurityTokenOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(opts => !opts.SecretKey.Contains("DEFAULT"), "کلید امنیتی نباید مقدار پیش‌فرض باشد!")
    .ValidateOnStart(); // پرتاب خطا در زمان استارتاپ قبل از باز شدن پورت‌های سرور!
\`\`\`

---

## ۵. مدیریت امن کلیدها در محیط لوکال با User Secrets

کلیدهای محرمانه (API Keys، پسوردهای دیتابیس) **هرگز نباید در ریپازیتوری Git کامیت شوند**. ابزار User Secrets این مقادیر را خارج از پوشه سورس‌کد و در پروفایل کاربری سیستم‌عامل ذخیره می‌کند:
- **مسیر در ویندوز**: \`%APPDATA%\\Microsoft\\UserSecrets\\<ID>\\secrets.json\`
- **دستور مقداردهی**: \`dotnet user-secrets set "Stripe:ApiKey" "sk_test_..."\`

---

## ۶. ماتریس مقایسه جامع مکانیزم‌های خواندن تنظیمات

| ویژگی | تزریق مستقیم \`IConfiguration\` | اینترفیس \`IOptions<T>\` | اینترفیس \`IOptionsSnapshot<T>\` | اینترفیس \`IOptionsMonitor<T>\` |
| :--- | :--- | :--- | :--- | :--- |
| **ایمنی نوع داده (Type Safety)**| ❌ رشته‌های متنی بی‌استراکچر | **✅ ۱۰۰٪ تایپ سیف** | **✅ ۱۰۰٪ تایپ سیف** | **✅ ۱۰۰٪ تایپ سیف** |
| **اعتبارسنجی در استارتاپ** | ❌ دستی و زمان اجرا | ✅ با \`ValidateOnStart\` | ✅ با \`ValidateOnStart\` | ✅ با \`ValidateOnStart\` |
| **سادگی تست واحد** | دشوار (نیازمند ساخت Mock کانفیگ)| **بسیار آسان با \`Options.Create\`** | آسان با Mock اینترفیس | آسان با Mock اینترفیس |
| **به‌روزرسانی خودکار** | دستی با توکن | ❌ خیر | ✅ در هر Request | **✅ بلادرنگ و با رویداد OnChange** |`,
};
