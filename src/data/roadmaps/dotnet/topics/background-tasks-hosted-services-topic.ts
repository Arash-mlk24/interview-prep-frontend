import { RoadmapTopic } from "../../../models";

export const backgroundTasksHostedServicesTopic: RoadmapTopic = {
  id: "topic-dotnet-background-tasks-hosted-services",
  stepId: "step-mid-async-caching-jobs",
  slug: "background-tasks-hosted-services",
  order: 3,
  title: "BackgroundService, IHostedService & Worker Queues",
  title_fa: "پردازش‌های پس‌زمینه با BackgroundService، IHostedService و صف‌های کاری",
  summary:
    "Master long-running background workers in ASP.NET Core, periodic timer jobs, executing scoped services safely inside singletons, and graceful shutdown.",
  summary_fa:
    "تسلط بر اجرای جاب‌های پس‌زمینه و نامتقارن با BackgroundService، اجرای سرویس‌های دوره‌ای (PeriodicTimer)، تزریق امن سرویس‌های Scoped و خاموشی ایمن (Graceful Shutdown).",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. BackgroundService Architecture in .NET

\`BackgroundService\` is a base class implementing \`IHostedService\` for long-running asynchronous background workers:

\`\`\`csharp
public class OrderProcessingWorker(
    IServiceScopeFactory scopeFactory,
    ILogger<OrderProcessingWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Order Processing Worker started.");

        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(30));

        while (!stoppingToken.IsCancellationRequested &&
               await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                // SAFELY RESOLVE SCOPED SERVICES:
                using var scope = scopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var pendingOrders = await dbContext.Orders
                    .Where(o => o.Status == OrderStatus.Pending)
                    .ToListAsync(stoppingToken);

                // Process pending orders...
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "Error processing orders in background worker");
            }
        }
    }
}
\`\`\`

---

## 2. In-Process Queued Background Work

For offloading fire-and-forget tasks (e.g. sending emails or processing image uploads) without blocking HTTP requests:

\`\`\`csharp
// Register as Hosted Service:
builder.Services.AddHostedService<OrderProcessingWorker>();
builder.Services.AddSingleton<IBackgroundTaskQueue, DefaultBackgroundTaskQueue>();
\`\`\``,
  content_fa: `## ۱. معماری پردازش پس‌زمینه با BackgroundService

کلاس \`BackgroundService\` به عنوان یک سرویس پس‌زمینه طولانی‌مدت همزمان با استارت اپلیکیشن آغاز شده و تا زمان خاموش شدن سرور وظایف پس‌زمینه را انجام می‌دهد:

\`\`\`csharp
public class OrderProcessingWorker(
    IServiceScopeFactory scopeFactory,
    ILogger<OrderProcessingWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(30));

        while (!stoppingToken.IsCancellationRequested &&
               await timer.WaitForNextTickAsync(stoppingToken))
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            // پردازش کارهای پس‌زمینه...
        }
    }
}
\`\`\`

---

## ۲. استفاده از PeriodicTimer در دات‌نت ۶+

جایگزین مدرن و بدون آلیکیشن برای تایمرهای قدیمی و \`Task.Delay\` با پشتیبانی داخلی از کنسلی.`,
};
