import { RoadmapTopic } from "../../../models";

export const kestrelPipelineTopic: RoadmapTopic = {
  id: "topic-dotnet-kestrel-pipeline",
  stepId: "step-aspnet-internals-http",
  slug: "kestrel-internals-middleware-pipeline",
  order: 1,
  title: "ASP.NET Core Internals: Kestrel Threading, SocketsHttpHandler & Middleware Pipeline",
  title_fa: "معماری داخلی ASP.NET Core: موتور Kestrel، استخر سوکت‌ها و پایپ‌لاین Middleware",
  summary: "Master low-level ASP.NET Core request lifecycle, Socket Transport, Libuv vs Socket abstractions, IHttpClientFactory connection pooling, and custom terminal middlewares.",
  summary_fa: "تسلط بر چرخه حیات درخواست در ASP.NET Core، نحوه پردازش سوکت در Kestrel، مدیریت کانکشن‌ها با IHttpClientFactory و طراحی میدل‌ویرهای سفارشی با کمترین آلیکیشن حافظه.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. Kestrel Server Request Lifecycle

\`\`\`
OS Kernel Network Stack (TCP SYN/ACK)
             |
             v
[ Kestrel Socket Transport Layer (System.IO.Pipelines) ]
             |
             v
[ HttpConnection & HttpProtocol Parser ]
             | (Allocates transient HttpContext)
             v
[ ASP.NET Core Middleware Pipeline ]
   ├── ExceptionHandlerMiddleware
   ├── Hsts / HttpsRedirectionMiddleware
   ├── RoutingMiddleware (Endpoint Routing)
   ├── CorsMiddleware
   ├── Authentication & AuthorizationMiddleware
   └── EndpointMiddleware (Controller / Minimal API Endpoint)
\`\`\`

---

### 2. Connection Pooling & \`IHttpClientFactory\` Socket Exhaustion

Creating \`new HttpClient()\` per request leads to **Socket Exhaustion** (thousands of sockets stuck in \`TIME_WAIT\` state).

\`\`\`csharp
// Best Practice: Register typed HttpClient in Program.cs
builder.Services.AddHttpClient<IOrderServiceClient, OrderServiceClient>(client => {
    client.BaseAddress = new Uri("https://api.orders.internal");
    client.Timeout = TimeSpan.FromSeconds(5);
})
.ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler {
    PooledConnectionLifetime = TimeSpan.FromMinutes(5), // Respects DNS changes
    MaxConnectionsPerServer = 200
});
\`\`\``,
  content_fa: `### ۱. چرخه پردازش درخواست در سرور Kestrel

درخواست از سطح لایه سوکت سیستم‌عامل وارد پایپ‌لاین \`System.IO.Pipelines\` شده و شیء \`HttpContext\` با استفاده از استخر شیء (Object Pool) ساخته می‌شود تا حداقل بار حافظه به GC وارد شود. سپس درخواست از زنجیره میدل‌ویرها عبور می‌کند.

---

### ۲. مدیریت صحیح اتصالات با \`IHttpClientFactory\`

ایجاد مستقیم نمونه \`new HttpClient()\` باعث پر شدن پورت‌های TCP و خطای **Socket Exhaustion** می‌شود. با استفاده از \`AddHttpClient\` و تنظیم \`SocketsHttpHandler.PooledConnectionLifetime\`، علاوه بر استفاده مجدد از کانکشن‌ها، تغییرات رکوردهای DNS نیز پشتیبانی می‌شوند.`,
};
