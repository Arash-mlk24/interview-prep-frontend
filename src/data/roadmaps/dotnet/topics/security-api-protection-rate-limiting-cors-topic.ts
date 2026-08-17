import { RoadmapTopic } from "../../../models";

export const securityApiProtectionRateLimitingCorsTopic: RoadmapTopic = {
  id: "topic-dotnet-security-api-protection-rate-limiting-cors",
  stepId: "step-mid-security-auth",
  slug: "security-api-protection-rate-limiting-cors",
  order: 3,
  title: "API Protection: Rate Limiting, CORS, Hashing & Input Sanitization",
  title_fa: "امنیت API: محدودسازی نرخ درخواست (Rate Limiting)، CORS، هشینگ و اعتبارسنجی",
  summary:
    "Protect Web APIs with .NET 7/8 built-in Rate Limiting algorithms (Token Bucket, Fixed Window), CORS origin policies, password hashing with PBKDF2/Argon2, and SQLi prevention.",
  summary_fa:
    "حفاظت از وب سرویس‌ها با سیستم درونی Rate Limiting در دات‌نت، سیاست‌های امنیتی CORS، روش‌های مدرن هش پسورد با PBKDF2 و جلوگیری از حملات تزریق SQL و XSS.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. Built-in Rate Limiting in .NET 7/8

Rate limiting prevents abuse and Denial of Service (DoS) attacks:

\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Fixed Window Limiter: 100 requests per 1 minute
    options.AddFixedWindowLimiter("PublicApiPolicy", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 10;
    });

    // Token Bucket Limiter: Smooth traffic with burst allowance
    options.AddTokenBucketLimiter("AuthPolicy", opt =>
    {
        opt.TokenLimit = 20;
        opt.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
        opt.TokensPerPeriod = 5;
    });
});

app.UseRateLimiter();
\`\`\`

---

## 2. Cross-Origin Resource Sharing (CORS) Best Practices

Never use \`AllowAnyOrigin()\` with \`AllowCredentials()\` in production!

\`\`\`csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendSpaPolicy", policy =>
    {
        policy.WithOrigins("https://app.mydomain.com")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .WithHeaders("Content-Type", "Authorization")
              .AllowCredentials();
    });
});

app.UseCors("FrontendSpaPolicy");
\`\`\`

---

## 3. Password Hashing & Key Derivation

Use industry-standard password hashers with automatic salt generation:

\`\`\`csharp
// Built-in PBKDF2-based password hasher
var hasher = new PasswordHasher<User>();
string hash = hasher.HashPassword(user, plainPassword);

PasswordVerificationResult result = hasher.VerifyHashedPassword(user, hash, plainPassword);
\`\`\``,
  content_fa: `## ۱. سیستم توکار محدودسازی نرخ درخواست (Rate Limiting)

دات‌نت به صورت توکار الگوریتم‌های مختلف Rate Limiting مانند Fixed Window، Sliding Window و Token Bucket را برای جلوگیری از حملات DoS و Brute-Force ارائه می‌دهد:

\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddFixedWindowLimiter("PublicApiPolicy", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 10;
    });
});
\`\`\`

---

## ۲. استانداردهای امنیتی CORS در پروداکشن

تعریف صریح دامنه‌های مجاز (Origins)، متدها و هدرها برای جلوگیری از دسترسی‌های غیرمجاز مرورگر.

---

## ۳. هشینگ امن پسوردها

استفاده از توابع استاندارد مشتق‌سازی کلید با Salt اختصاصی برای هر کاربر مانند PBKDF2 و Argon2.`,
};
