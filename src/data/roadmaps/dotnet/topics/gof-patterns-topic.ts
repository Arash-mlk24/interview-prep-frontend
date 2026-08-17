import { RoadmapTopic } from "../../../models";

export const gofPatternsTopic: RoadmapTopic = {
  id: "topic-dotnet-gof-patterns",
  stepId: "step-patterns-clean-arch",
  slug: "gof-design-patterns-dotnet",
  order: 1,
  title: "GoF Structural & Behavioral Patterns in Modern C#",
  title_fa: "الگوهای طراحی ساختاری و رفتاری GoF در سی‌شارپ مدرن",
  summary: "Comprehensive comparison of Adapter, Decorator, Facade, Proxy, Strategy, and Observer with real-world enterprise C# examples.",
  summary_fa: "مقایسه جامع الگوهای ساختاری و رفتاری شامل Adapter، Decorator، Facade، Proxy، Strategy و Observer با کاربردهای عملی در سی‌شارپ.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. Structural Patterns Comparison

| Pattern | Primary Intent | Interface Change | Practical Use Case in .NET |
| :--- | :--- | :--- | :--- |
| **Adapter** | Converts incompatible 3rd-party interface to domain contract | **Changes Interface** | Wrapping a legacy SOAP bank client to match internal \`IPaymentService\`. |
| **Decorator** | Dynamically wraps additional behaviors (Caching, Telemetry) | **Keeps Same Interface** | Wrapping \`IOrderRepository\` with \`CachedOrderRepository\` via Scrutor. |
| **Facade** | Provides a unified high-level entrypoint to complex subsystems | **Creates New Interface** | \`CheckoutFacade\` coordinating inventory reservation, payment, and invoices. |
| **Proxy** | Controls access, security, or lazy-loading | **Keeps Same Interface** | Virtual Proxy for lazy loading expensive remote resources. |

---

### 2. Behavioral Patterns: Strategy vs. Template Method

- **Strategy Pattern (Composition):** Injects interchangeable algorithms implementing a shared interface (\`IDiscountStrategy\`). Highly extensible and conforms to Open/Closed Principle.
- **Template Method (Inheritance):** Base class locks algorithm skeleton and delegates primitive step implementations to subclasses via \`abstract\` methods.

---

### 3. Decorator Pattern with Scrutor in ASP.NET Core

\`\`\`csharp
public class CachedUserRepository : IUserRepository {
    private readonly IUserRepository _inner;
    private readonly IDistributedCache _cache;
    public CachedUserRepository(IUserRepository inner, IDistributedCache cache) {
        _inner = inner;
        _cache = cache;
    }
    public async Task<User?> GetByIdAsync(Guid id) {
        // Check cache -> fallback to _inner -> populate cache
        return await _inner.GetByIdAsync(id);
    }
}

// Clean DI Registration:
services.Decorate<IUserRepository, CachedUserRepository>();
\`\`\``,
  content_fa: `### ۱. مقایسه الگوهای ساختاری

- **الگوی Adapter:** تبدیل اینترفیس ناسازگار سرویس‌های خارجی به ساختار داخلی پروژه.
- **الگوی Decorator:** افزودن قابلیت‌های جانبی (مانند کشینگ یا لاگینگ) به اشیا بدون دستکاری کدهای اصلی با پکیج Scrutor.
- **الگوی Facade:** ایجاد یک ورودی ساده برای مدیریت چندین زیرسیستم پیچیده.
- **الگوی Proxy:** کنترل دسترسی، لود تنبل و بررسی سطوح دسترسی امنیتی.

---

### ۲. الگوهای رفتاری: Strategy در برابر Template Method

الگوی **Strategy** با اصل Composition الگوریتم‌ها را تعویض‌پذیر می‌کند، در حالی که **Template Method** با ارث‌بری اسکلت کلی مراحل را ثابت نگه می‌دارد.`,
};
