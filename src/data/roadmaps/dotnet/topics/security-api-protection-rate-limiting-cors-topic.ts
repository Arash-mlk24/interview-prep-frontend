import { RoadmapTopic } from "../../../models";

export const securityApiProtectionRateLimitingCorsTopic: RoadmapTopic = {
  id: "topic-dotnet-security-api-protection-rate-limiting-cors",
  stepId: "step-mid-security-auth",
  slug: "security-api-protection-rate-limiting-cors",
  order: 3,
  title: "API Protection: Rate Limiting, CORS Policies & Data Protection",
  title_fa: "امنیت API: محدودسازی نرخ درخواست (Rate Limiting)، CORS و Data Protection",
  summary:
    "Master ASP.NET Core API protection: built-in Rate Limiting algorithms (Token Bucket, Sliding Window, Concurrency), PartitionedRateLimiter by IP/User, secure CORS policies, Data Protection API key ring persistence, and Argon2/PBKDF2 password hashing in .NET 8/9.",
  summary_fa:
    "تسلط عمیق بر لایه‌های امنیتی وب‌سرویس‌ها: الگوریتم‌های چهارگانه Rate Limiting، پارتیشن‌بندی بر اساس IP و کاربر، پیکربندی امنیتی CORS، رمزنگاری با Data Protection API و ذخیره‌سازی کلیدها در Redis/KeyVault، و هشینگ مدرن پسورد با PBKDF2 و Argon2 در دات‌نت ۸ و ۹.",
  readingTimeMinutes: 34,
  difficulty: "mid",
  content: `## 1. Evolution: The Threat Landscape of Public Web APIs

Modern backend Web APIs face automated adversarial traffic:
1. **Denial of Service (DoS) & Brute-Force**: Automated bots bombarding authentication and OTP endpoints with millions of requests.
2. **Cross-Origin Data Exfiltration**: Malicious third-party web applications exploiting permissive CORS policies to steal customer data.
3. **Data Tampering & State Forgery**: Attackers manipulating URL query parameters, password reset tokens, or anti-tamper state.
4. **Credential Cracking**: Fast cryptographic hash algorithms (MD5, SHA-256) cracked in seconds by GPU and ASIC rigs using Rainbow Tables.

ASP.NET Core provides a comprehensive defense-in-depth security subsystem to mitigate these threats natively.

---

## 2. Built-in Rate Limiting Subsystem in ASP.NET Core (.NET 7/8/9)

The \`Microsoft.AspNetCore.RateLimiting\` middleware provides native, high-performance request throttling without requiring external third-party packages.

---

### The Four Core Rate Limiting Algorithms:

\`\`\`text
1. Fixed Window:
   [Window 1: Max 100 Req] | [Window 2: Max 100 Req]  <-- Risk of 200 req burst at boundary!

2. Sliding Window:
   [Segment 1] [Segment 2] [Segment 3] [Segment 4]    <-- Smooth rolling window; no boundary spikes!

3. Token Bucket:
   [Bucket: Max 20 Tokens] ── Refills 5 tokens every 10s ──> Allows controlled bursts!

4. Concurrency:
   [Active Executing Threads: Max 5 Concurrent]       <-- Restricts simultaneous CPU/DB load!
\`\`\`

---

### Comparison of Rate Limiting Algorithms:

| Algorithm | Mechanism | Burst Handling | Memory Overhead | Best Production Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Fixed Window** | Resets counter at static time intervals | ❌ Vulnerable to 2x boundary spikes | **Minimal** | Simple public documentation / health routes |
| **Sliding Window** | Divides window into rolling segments | **Smooth (No boundary spikes)** | Low | General public API endpoints & REST routes |
| **Token Bucket** | Tokens refill at constant rate | **✅ Controlled Burst Allowance** | Low | Payment APIs, Checkout, Mobile Client APIs |
| **Concurrency** | Limits simultaneous active requests | ❌ Queues or rejects | **Minimal** | Heavy report generation, PDF exports, AI models |

---

### Advanced Configuration: Partitioned Rate Limiting by IP & User

In production APIs, a global rate limit is insufficient: one abusive user could exhaust the limit for all other customers. **Partitioning** isolates limits per Client IP address or Authenticated User ID:

\`\`\`csharp
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // 1. Partitioned Policy by User ID (Authenticated) or IP Address (Anonymous):
    options.AddPolicy("ApiGatewayPolicy", httpContext =>
    {
        var userId = httpContext.User.FindFirst("sub")?.Value;
        var partitionKey = !string.IsNullOrEmpty(userId) 
            ? $"user_{userId}" 
            : $"ip_{httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";

        return RateLimitPartition.GetTokenBucketLimiter(partitionKey, _ => new TokenBucketRateLimiterOptions
        {
            TokenLimit = 50,
            QueueLimit = 5,
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            ReplenishmentPeriod = TimeSpan.FromSeconds(10),
            TokensPerPeriod = 10,
            AutoReplenishment = true
        });
    });

    // 2. Custom OnRejected Callback to emit standard RFC Retry-After headers:
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
        }

        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            Status = 429,
            Title = "Too Many Requests",
            Detail = "Rate limit quota exceeded. Please retry after the specified window."
        }, cancellationToken: token);
    };
});

var app = builder.Build();

app.UseRateLimiter(); // Place AFTER UseRouting and BEFORE Endpoints!

app.MapGet("/api/products", () => Results.Ok(new[] { "Product A", "Product B" }))
    .RequireRateLimiting("ApiGatewayPolicy");
\`\`\`

---

## 3. Cross-Origin Resource Sharing (CORS) Security Architecture

By default, web browsers enforce the **Same-Origin Policy (SOP)**, blocking web pages on \`https://app.example.com\` from making AJAX/Fetch requests to \`https://api.example.com\`.

CORS is the W3C mechanism allowing servers to explicitly declare which origins are authorized to interact with their endpoints.

---

### Anatomy of a CORS Preflight Request:
When a frontend client initiates a request with custom headers (\`Authorization\`) or non-simple HTTP verbs (\`PUT\`, \`DELETE\`, \`PATCH\`), the browser sends an automatic preflight **\`OPTIONS\`** request:

\`\`\`http
OPTIONS /api/orders HTTP/1.1
Host: api.example.com
Origin: https://app.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Authorization, Content-Type
\`\`\`

---

### The Fatal CORS Misconfiguration Trap:
\`\`\`csharp
// CRITICAL VULNERABILITY: Never use in Production!
builder.Services.AddCors(options =>
{
    options.AddPolicy("InsecurePolicy", p =>
        p.AllowAnyOrigin()      // Allows ALL malicious domains on the internet
         .AllowAnyHeader()
         .AllowAnyMethod());
});
\`\`\`

> [!WARNING]
> Combining \`AllowAnyOrigin()\` with \`AllowCredentials()\` is explicitly forbidden by modern browsers. If misconfigured, any malicious website on the internet can execute authenticated API requests on behalf of a logged-in user!

---

### Secure Enterprise CORS Configuration:

\`\`\`csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("SpaProductionPolicy", policy =>
    {
        policy.WithOrigins(
                "https://admin.enterprise.com",
                "https://app.enterprise.com"
              )
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .WithHeaders("Content-Type", "Authorization", "X-Requested-With")
              .WithExposedHeaders("X-Pagination", "Retry-After")
              .AllowCredentials() // Safe because origins are explicitly locked down!
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Caches preflight OPTIONS in browser
    });
});

// Middleware Pipeline Order (MANDATORY):
app.UseRouting();
app.UseCors("SpaProductionPolicy"); // Must be AFTER UseRouting and BEFORE UseAuthentication/UseAuthorization!
app.UseAuthentication();
app.UseAuthorization();
\`\`\`

---

## 4. ASP.NET Core Data Protection API

The **Data Protection API (\`IDataProtector\`)** is an enterprise cryptography subsystem designed to generate symmetric, authenticated, tamper-proof ciphertexts for temporary application state (password reset tokens, email verification links, session cookies).

---

### 1. Using \`IDataProtector\` with Purpose Strings:

\`\`\`csharp
public class PasswordResetService
{
    private readonly IDataProtector _protector;

    public PasswordResetService(IDataProtectionProvider dataProtectionProvider)
    {
        // Purpose Strings create cryptographic isolation:
        // A token encrypted with "PasswordReset.v1" CANNOT be decrypted by an "EmailVerification.v1" protector!
        _protector = dataProtectionProvider.CreateProtector("Identity.PasswordReset.v1");
    }

    public string GenerateResetToken(Guid userId)
    {
        var payload = $"{userId}:{DateTimeOffset.UtcNow.AddHours(2).ToUnixTimeSeconds()}";
        return _protector.Protect(payload); // Cryptographically signed & encrypted!
    }

    public bool ValidateResetToken(string encryptedToken, out Guid userId)
    {
        userId = Guid.Empty;
        try
        {
            var decrypted = _protector.Unprotect(encryptedToken);
            var parts = decrypted.Split(':');
            userId = Guid.Parse(parts[0]);
            var expiry = long.Parse(parts[1]);

            return DateTimeOffset.UtcNow.ToUnixTimeSeconds() <= expiry;
        }
        catch (CryptographicException)
        {
            // Token was tampered with, expired, or invalid!
            return false;
        }
    }
}
\`\`\`

---

### 2. Distributed Key Ring Persistence in Production Clusters:
By default, Data Protection stores cryptographic keys in the local machine's user folder. In a multi-pod Kubernetes cluster, Pod A will fail to decrypt tokens encrypted by Pod B!

\`\`\`csharp
// In Program.cs for Distributed Clusters:
builder.Services.AddDataProtection()
    .SetApplicationName("EnterpriseBackendApp")
    .PersistKeysToStackExchangeRedis(redisConnectionMultiplexer, "DataProtection-Keys")
    .ProtectKeysWithCertificate(x509Certificate2); // Encrypts keys at rest using certificate!
\`\`\`

---

## 5. Modern Password Hashing & Key Derivation (PBKDF2 vs. Argon2id)

Fast cryptographic hashing algorithms (like raw SHA-256 or MD5) are designed to be computed in nanoseconds. This makes them fatal for passwords because a modern GPU can test **over 100 billion SHA-256 hashes per second**.

Password hashing requires **Adaptive Key Derivation Functions (KDFs)** that are computationally expensive and memory-hard.

---

### 1. ASP.NET Core Default: \`PasswordHasher<TUser>\` (PBKDF2-HMAC-SHA512)
ASP.NET Core Identity uses **PBKDF2** with a unique per-user cryptographically random salt (128-bit) and **100,000+ iterations**:

\`\`\`csharp
var hasher = new PasswordHasher<User>();

// 1. Generate secure hash (Outputs: format marker + salt + subkey)
string passwordHash = hasher.HashPassword(user, "SecureUserPassword123!");

// 2. Verify password (Resistant to timing attacks):
var verificationResult = hasher.VerifyHashedPassword(user, passwordHash, enteredPassword);
if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
{
    // Iteration count upgraded in newer .NET version: rehash and update DB!
    user.PasswordHash = hasher.HashPassword(user, enteredPassword);
}
\`\`\`

---

### 2. Next-Gen Memory-Hard Hashing: \`Argon2id\`
For top-tier security specifications, **Argon2id** (winner of the Password Hashing Competition) requires significant RAM memory allocations per hash calculation, rendering GPU and ASIC hardware brute-force attacks mathematically infeasible.

---

## 6. Master Decision & Comparison Matrix: API Protection Strategies

| Security Mechanism | Primary Threat Mitigated | Performance Overhead | Distributed Safe? | Configuration Location |
| :--- | :--- | :--- | :--- | :--- |
| **Token Bucket Limiter** | DoS, API abuse, Bot Scraping | Near Zero (In-memory/Redis) | Yes (with Redis Backplane) | Middleware (\`UseRateLimiter\`) |
| **Strict CORS Policy** | Cross-Origin CSRF, Data Theft | Zero (Handled by browser SOP)| Yes | Middleware (\`UseCors\`) |
| **Data Protection API** | Parameter Tampering, Token Forgery | Low (Symmetric AES-256-GCM) | Yes (with Redis/KeyVault) | Services (\`IDataProtector\`) |
| **PBKDF2 / Argon2id** | Credential Theft, Rainbow Tables | Intentionally Slow (100ms/hash)| Yes (Stateless) | User Service / Auth Flow |`,
  content_fa: `## ۱. سیر تکامل و خطرات امنیتی وب‌سرویس‌های عمومی (Public APIs)

وب‌سرویس‌های مدرن بک‌اند با تهدیدات سایبری متعددی روبرو هستند:
۱. **حملات منع سرویس (DoS) و Brute-Force**: ارسال میلیون‌ها درخواست توسط بات‌ها جهت از کار انداختن سرور یا حدس زدن رمزهای عبور و کدهای یکبارمصرف (OTP).
۲. **سرقت داده‌های مرورگر از طریق CORS**: وب‌سایت‌های مخرب با سوءاستفاده از تنظیمات باز CORS تلاش می‌کنند داده‌های کاربران را از مرورگر استخراج نمایند.
۳. **دستکاری پارامترها و توکن‌های موقت**: تغییر شناسه‌ها در URLها یا دستکاری توکن‌های بازیابی رمز عبور.
۴. **کرک کردن پسوردها با کارت‌های گرافیک (GPU)**: الگوریتم‌های سریع هش (مانند SHA-256 و MD5) در چند ثانیه توسط ریگ‌های ماینینگ کرک می‌شوند.

فریم‌ورک ASP.NET Core یک لایه دفاعی جامع و توکار برای مقابله با تمامی این تهدیدات ارائه می‌دهد.

---

## ۲. سیستم درونی محدودسازی نرخ درخواست (Rate Limiting) در دات‌نت ۸ و ۹

پکیج توکار \`Microsoft.AspNetCore.RateLimiting\` قابلیت‌های پیشرفته‌ای برای کنترل ترافیک فراهم می‌سازد:

### الگوریتم‌های چهارگانه Rate Limiting:
۱. **Fixed Window**: بازه زمانی ثابت (مانند ۱۰۰ درخواست در هر دقیقه). دارای ریسک هجوم ترافیک در مرز دو پنجره.
۲. **Sliding Window (پنجره لغزان)**: تقسیم بازه به بخش‌های کوچک‌تر جهت محاسبه میانگین متحرک؛ کاملاً یکنواخت و بدون شوک در مرزها.
۳. **Token Bucket (سطل توکن)**: پر شدن مداوم سطل با توکن‌ها بر اساس نرخ مشخص؛ بهترین گزینه برای APIهای عمومی با قابلیت اجازه به جهش‌های کوتاه‌مدت (Bursts).
۴. **Concurrency Limiter**: محدودسازی تعداد درخواست‌های همزمان در حال اجرا (جهت جلوگیری از قفل شدن CPU و دیتابیس در گزارش‌های سنگین).

---

### پارتیشن‌بندی نرخ درخواست بر اساس کاربر و IP:

\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("ApiGatewayPolicy", context =>
    {
        var userId = context.User.FindFirst("sub")?.Value;
        var key = !string.IsNullOrEmpty(userId) ? $"user_{userId}" : $"ip_{context.Connection.RemoteIpAddress}";

        return RateLimitPartition.GetTokenBucketLimiter(key, _ => new TokenBucketRateLimiterOptions
        {
            TokenLimit = 50,
            ReplenishmentPeriod = TimeSpan.FromSeconds(10),
            TokensPerPeriod = 10
        });
    });

    options.OnRejected = async (ctx, token) =>
    {
        ctx.HttpContext.Response.StatusCode = 429;
        await ctx.HttpContext.Response.WriteAsJsonAsync(new { Error = "تعداد درخواست‌های شما بیش از حد مجاز است." }, token);
    };
});
\`\`\`

---

## ۳. معماری امنیتی CORS (اشتراک منابع میان‌مبدایی)

مرورگرها با قانون **Same-Origin Policy (SOP)** مانع ارسال درخواست‌های مشکوک میان دامنه‌های مختلف می‌شوند. استاندارد CORS به سرور اجازه می‌دهد دامنه‌های مجاز را تعیین کند:

### تله امنیتی مهلک در CORS:
استفاده از \`AllowAnyOrigin()\` همراه با \`AllowCredentials()\` یک حفره امنیتی بزرگ ایجاد کرده و توسط مرورگرهای مدرن مسدود می‌شود.

### پیکربندی امن CORS در پروداکشن:
\`\`\`csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        policy.WithOrigins("https://app.mydomain.com")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .WithHeaders("Content-Type", "Authorization")
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});
\`\`\`
> **ترتیب الزامی در پایپ‌لاین:** میدل‌ویر \`UseCors\` باید حتماً **بعد از \`UseRouting\`** و **قبل از \`UseAuthentication\` و \`UseAuthorization\`** قرار گیرد.

---

## ۴. سیستم حفاظت از داده‌ها (ASP.NET Core Data Protection API)

اینترفیس **\`IDataProtector\`** برای رمزنگاری متقارن، امضای دیجیتال و ضد دستکاری کردن توکن‌های موقت (مانند لینک بازنشانی پسورد) استفاده می‌شود:

\`\`\`csharp
// ساخت Protector با رشته هدف اختصاصی (Purpose String) جهت ایزولاسیون کلیدها:
var protector = dataProtectionProvider.CreateProtector("PasswordReset.v1");

string encryptedToken = protector.Protect("user_123");
string decryptedUserId = protector.Unprotect(encryptedToken);
\`\`\`

### ذخیره‌سازی کلیدها در کلاسترهای چند سروری (Redis):
در محیط‌های چند پادی داکر/کوبرنتیز، کلیدهای Data Protection باید در یک حافظه مشترک مانند **Redis** ذخیره شوند تا پاد شماره یک بتواند توکن‌های تولیدشده توسط پاد شماره دو را رمزگشایی کند.

---

## ۵. روش‌های مدرن هشینگ پسورد: مقایسه PBKDF2 با Argon2id

هش‌های سریع متداول مانند SHA-256 یا MD5 برای پسوردها به شدت ناامن هستند؛ زیرا کارت‌های گرافیک مدرن بیش از ۱۰۰ میلیارد هش SHA-256 را در هر ثانیه محاسبه می‌کنند. برای پسوردها باید از توابع مشتق‌سازی کلید با Salt اختصاصی و مصرف سنگین رم استفاده شود:
- **\`PasswordHasher<T>\` در دات‌نت**: پیاده‌سازی استاندارد PBKDF2-HMAC-SHA512 با بیش از ۱۰۰,۰۰۰ بار تکرار حلقه (Iteration).
- **الگوریتم Argon2id**: مقاوم‌ترین الگوریتم در برابر حملات سخت‌افزاری و ASIC به دلیل الزام به تخصیص رم در زمان محاسبه هش.

---

## ۶. ماتریس مقایسه جامع مکانیزم‌های حفاظت از API

| ابزار امنیتی | تهدید اصلی تحت پوشش | سربار پردازشی | امنیت در محیط توزیع‌شده |
| :--- | :--- | :--- | :--- |
| **Token Bucket Limiter** | حملات DoS و Brute-Force | بسیار ناچیز | بله (با کلاستر ردیس) |
| **سیاست‌های امن CORS** | سرقت اطلاعات در مرورگر و CSRF | صفر (مدیریت توسط مرورگر) | کاملاً ایمن |
| **Data Protection API** | دستکاری پارامترها و توکن‌های موقت | اندک (رمزنگاری متقارن AES) | بله (با ذخیره کلید در Redis) |
| **PBKDF2 / Argon2id** | کرک پسورد و جداول Rainbow | کنترل‌شده و کُند (۱۰۰ میلی‌ثانیه)| کاملاً بدون وضعیت و ایمن |`,
};
