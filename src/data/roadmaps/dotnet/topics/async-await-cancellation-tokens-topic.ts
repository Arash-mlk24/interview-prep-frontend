import { RoadmapTopic } from "../../../models";

export const asyncAwaitCancellationTokensTopic: RoadmapTopic = {
  id: "topic-dotnet-async-await-cancellation-tokens",
  stepId: "step-mid-async-caching-jobs",
  slug: "async-await-cancellation-tokens",
  order: 1,
  title: "Async/Await Best Practices & CancellationToken Propagation",
  title_fa: "اصول و استانداردهای برنامه‌نویسی ناهمگام و انتشار CancellationToken",
  summary:
    "Master async/await patterns, avoid sync-over-async thread pool deadlocks, understand Task.WhenAll vs Task.WhenAny, and propagate CancellationTokens throughout the backend pipeline.",
  summary_fa:
    "تسلط بر الگوهای async/await، پرهیز از ددلاک‌های ThreadPool به دلیل sync-over-async، استفاده از Task.WhenAll و انتشار مستمر CancellationToken در تمامی لایه‌های بک‌اند.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. Golden Rules of Asynchronous Programming in C#

1. **Async All the Way**: Never block on asynchronous code using \`.Result\` or \`.Wait()\` as it leads to ThreadPool starvation and deadlocks.
2. **Always Return Task / ValueTask**: Avoid \`async void\` (except for UI event handlers) because exceptions cannot be caught by callers.
3. **Propagate CancellationToken**: Pass \`CancellationToken\` down through controllers, services, and database queries to abort abandoned HTTP requests.

\`\`\`csharp
[HttpGet("{id:guid}")]
public async Task<IActionResult> GetOrder(Guid id, CancellationToken cancellationToken)
{
    // Pass cancellationToken directly to database query
    var order = await dbContext.Orders
        .AsNoTracking()
        .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

    return order is not null ? Ok(order) : NotFound();
}
\`\`\`

---

## 2. Parallel Coordination: Task.WhenAll vs Task.WhenAny

\`\`\`csharp
// Execute independent async I/O operations concurrently:
var userTask = userService.GetProfileAsync(userId, ct);
var ordersTask = orderService.GetRecentOrdersAsync(userId, ct);
var notificationsTask = notificationService.GetUnreadCountAsync(userId, ct);

// Wait for all 3 tasks to complete in parallel:
await Task.WhenAll(userTask, ordersTask, notificationsTask);

var dashboard = new UserDashboardDto(
    await userTask,
    await ordersTask,
    await notificationsTask
);
\`\`\`

---

## 3. Graceful Timeout Handling with CancellationTokenSource

\`\`\`csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
try
{
    var response = await httpClient.GetAsync(externalApiUrl, cts.Token);
}
catch (OperationCanceledException) when (cts.IsCancellationRequested)
{
    logger.LogWarning("Request timed out after 5 seconds");
}
\`\`\``,
  content_fa: `## ۱. قوانین طلایی برنامه‌نویسی ناهمگام (Async/Await)

۱. **ناهمگام از ابتدا تا انتها (Async All the Way)**: هرگز از \`.Result\` یا \`.Wait()\` استفاده نکنید چون باعث قفل شدن ThreadPool و ددلاک می‌شود.
۲. **انتشار همیشگی CancellationToken**: ارسال توکن کنسلی در تمام متدها باعث می‌شود به محض بستن صفحه توسط کاربر، کوئری‌های سنگین دیتابیس بلافاصله متوقف شوند.
۳. **پرهیز از async void**: متدهای ناهمگام همیشه باید \`Task\` یا \`ValueTask\` برگردانند تا خطاهای احتمالی قابل رهگیری باشند.

---

## ۲. هماهنگی موازی با Task.WhenAll

اجرای همزمان چندین درخواست مستقل I/O برای کاهش تاخیر کلی پاسخ به کاربر:

\`\`\`csharp
var userTask = userService.GetProfileAsync(userId, ct);
var ordersTask = orderService.GetRecentOrdersAsync(userId, ct);

await Task.WhenAll(userTask, ordersTask);
\`\`\`

---

## ۳. مدیریت Timeout با CancellationTokenSource

تعیین سقف زمانی برای فراخوانی سرویس‌های بیرونی با \`CancellationTokenSource\`.`,
};
