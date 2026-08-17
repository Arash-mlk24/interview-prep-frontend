import { RoadmapTopic } from "../../../models";

export const aspnetConfigurationOptionsSecretsTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-configuration-options-secrets",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-configuration-options-secrets",
  order: 4,
  title: "Configuration System, IOptions Pattern & Secrets Management",
  title_fa: "سیستم تنظیمات (Configuration)، الگوی IOptions و مدیریت Secrets",
  summary:
    "Master hierarchical appsettings.json configuration, environment variables, IOptions vs IOptionsSnapshot vs IOptionsMonitor, and User Secrets for development.",
  summary_fa:
    "تسلط بر خواندن تنظیمات چندلایه، متغیرهای محیطی، مقایسه طول عمرهای IOptions و IOptionsSnapshot و IOptionsMonitor، و نگهداری امن کلیدها با User Secrets.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Hierarchical Configuration Sources

ASP.NET Core combines configuration from multiple prioritized providers:
1. \`appsettings.json\`
2. \`appsettings.{Environment}.json\` (e.g. Development, Production)
3. User Secrets (in Development)
4. Environment Variables (e.g. \`PaymentGateway__ApiKey\` maps to \`PaymentGateway:ApiKey\`)
5. Command-line Arguments

---

## 2. The Options Pattern: IOptions vs IOptionsSnapshot vs IOptionsMonitor

\`\`\`csharp
public class JwtSettings
{
    public string Issuer { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public int ExpiryMinutes { get; set; }
}

// In Program.cs:
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
\`\`\`

| Interface | Service Lifetime | Reloads on File Change? | Primary Use Case |
| :--- | :--- | :--- | :--- |
| \`IOptions<T>\` | **Singleton** | ❌ No | Static configs that never change at runtime |
| \`IOptionsSnapshot<T>\` | **Scoped** | ✅ Yes (per HTTP request) | Web request scoped services needing updated configs |
| \`IOptionsMonitor<T>\` | **Singleton** | ✅ Yes (instant notifications) | Long-running Singleton services listening to changes |

---

## 3. Secret Management & Validation at Startup

\`\`\`csharp
builder.Services.AddOptions<JwtSettings>()
    .Bind(builder.Configuration.GetSection("JwtSettings"))
    .ValidateDataAnnotations()
    .Validate(settings => settings.ExpiryMinutes > 0, "ExpiryMinutes must be positive")
    .ValidateOnStart(); // Fail-fast on startup if config is invalid!
\`\`\``,
  content_fa: `## ۱. منابع پیکربندی چندلایه در ASP.NET Core

سیستم پیکربندی دات‌نت مقادیر را بر اساس اولویت از فایل‌ها، متغیرهای محیطی سیستم و کلیدها ادغام می‌کند:
1. \`appsettings.json\`
2. \`appsettings.{Environment}.json\`
3. متغیرهای محیطی سیستم (Environment Variables)
4. آرگومان‌های خط فرمان

---

## ۲. مقایسه انواع IOptions در دات‌نت

| اینترفیس | طول عمر در DI | ریلود شدن هنگام تغییر فایل | کاربرد اصلی |
| :--- | :--- | :--- | :--- |
| \`IOptions<T>\` | **Singleton** | ❌ خیر | تنظیمات ثابتی که در طول اجرا تغییر نمی‌کنند |
| \`IOptionsSnapshot<T>\` | **Scoped** | ✅ بله (در هر درخواست جدید) | سرویس‌های Scoped که نیاز به خواندن آخرین مقدار دارند |
| \`IOptionsMonitor<T>\` | **Singleton** | ✅ بله (آنی) | سرویس‌های ماندگار یا Singleton با رویداد \`OnChange\` |

---

## ۳. اعتبارسنجی تنظیمات در زمان بالا آمدن برنامه (ValidateOnStart)

با متد \`ValidateOnStart\`، اگر تنظیمات حیاتی یا کانکشن‌استرینگ‌ها در فایل کانفیگ مفقود یا نامعتبر باشند، برنامه فوراً در زمان استارت ارور داده و مانع از اجرای معیوب در پروداکشن می‌شود.`,
};
