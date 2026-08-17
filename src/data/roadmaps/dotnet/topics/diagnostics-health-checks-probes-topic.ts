import { RoadmapTopic } from "../../../models";

export const diagnosticsHealthChecksProbesTopic: RoadmapTopic = {
  id: "topic-dotnet-diagnostics-health-checks-probes",
  stepId: "step-mid-diagnostics-docker",
  slug: "diagnostics-health-checks-probes",
  order: 2,
  title: "ASP.NET Core Health Checks, Liveness & Readiness Probes",
  title_fa: "بررسی سلامت سرویس‌ها (Health Checks)، پروب‌های Liveness و Readiness",
  summary:
    "Implement production health check endpoints in ASP.NET Core, database / cache probes, and separate Kubernetes liveness vs readiness signals.",
  summary_fa:
    "پیاده‌سازی اندپوینت‌های بررسی سلامت سرویس، تست اتصال دیتابیس و ردیس، و تفکیک سیگنال‌های پروب Liveness و Readiness در محیط‌های ابری و Kubernetes.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Health Checks in ASP.NET Core

Health checks report the operational status of the service and its external dependencies:

\`\`\`csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")!, name: "sqlserver", tags: new[] { "ready" })
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!, name: "redis", tags: new[] { "ready" });
\`\`\`

---

## 2. Kubernetes Probes: Liveness vs Readiness

- **Liveness Probe (\`/health/live\`)**: Checks if the container process is alive. If this fails, Kubernetes kills and restarts the pod. Should ONLY check internal process health (zero external dependency checks!).
- **Readiness Probe (\`/health/ready\`)**: Checks if the app is ready to accept user traffic (DB connected, cache warm). If this fails, Kubernetes temporarily routes traffic away from the pod without killing it.

\`\`\`csharp
// Liveness endpoint (no external dependency checks)
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false
});

// Readiness endpoint (checks SQL & Redis)
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
\`\`\``,
  content_fa: `## ۱. سیستم Health Check در ASP.NET Core

اندپوینت‌های Health Check وضعیت سلامت برنامه و اتصالات دیتابیسی و ردیس را گزارش می‌دهند:

\`\`\`csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")!, name: "sqlserver", tags: new[] { "ready" })
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!, name: "redis", tags: new[] { "ready" });
\`\`\`

---

## ۲. تفاوت پروب‌های Liveness و Readiness در کوبرنتیز

- **پروب Liveness (\`/health/live\`)**: تنها زنده بودن پردازش داخلی برنامه را بررسی می‌کند و نباید به دیتابیس متصل شود تا از ریستارت‌های بی‌مورد کانتینر در زمان قطعی دیتابیس جلوگیری شود.
- **پروب Readiness (\`/health/ready\`)**: بررسی می‌کند که آیا سرویس آماده دریافت ترافیک کاربر است یا خیر (شامل تست دیتابیس و ردیس).`,
};
