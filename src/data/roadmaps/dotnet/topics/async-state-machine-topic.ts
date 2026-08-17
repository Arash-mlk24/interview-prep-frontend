import { RoadmapTopic } from "../../../models";

export const asyncStateMachineTopic: RoadmapTopic = {
  id: "topic-dotnet-async-state-machine",
  stepId: "step-csharp-memory-concurrency",
  slug: "async-state-machine-threadpool",
  order: 3,
  title: "Async/Await State Machine, ThreadPool & Synchronization",
  title_fa: "کالبدشکافی ماشین وضعیت Async/Await، ترندپول و مدیریت همزمانی",
  summary: "Explore compiler lowering of async methods into IAsyncStateMachine structs, AsyncTaskMethodBuilder, and thread suspension/resumption mechanics.",
  summary_fa: "بررسی عمیق تبدیل متدهای async به ساختارهای IAsyncStateMachine توسط کامپایلر، نقش AsyncTaskMethodBuilder و نحوه آزادسازی و بازخوانی نخ‌های پردازشی.",
  readingTimeMinutes: 16,
  difficulty: "senior",
  content: `### 1. The Compiler Lowering of \`async/await\`

When you write an \`async Task<T>\` method, the C# compiler transforms it behind the scenes into a state machine struct implementing **\`IAsyncStateMachine\`**.

\`\`\`csharp
// Source code:
public async Task<int> FetchDataAsync(string url) {
    var response = await _client.GetStringAsync(url);
    return response.Length;
}
\`\`\`

#### Generated State Machine Structure:
\`\`\`csharp
[CompilerGenerated]
private struct <FetchDataAsync>d__1 : IAsyncStateMachine {
    public int <>1__state;
    public AsyncTaskMethodBuilder<int> <>t__builder;
    public string url;
    private string <response>5__2;
    private TaskAwaiter<string> <>u__1;

    public void MoveNext() {
        // Switch-based state dispatcher
        try {
            if (<>1__state != 0) {
                <>u__1 = _client.GetStringAsync(url).GetAwaiter();
                if (!<>u__1.IsCompleted) {
                    <>1__state = 0;
                    // Hook completion without blocking thread!
                    <>t__builder.AwaitUnsafeOnCompleted(ref <>u__1, ref this);
                    return; // Thread is freed back to ThreadPool!
                }
            }
            <response>5__2 = <>u__1.GetResult();
            <>t__builder.SetResult(<response>5__2.Length);
        } catch (Exception ex) {
            <>t__builder.SetException(ex);
        }
    }
}
\`\`\`

---

### 2. Thread Suspension vs. Thread Blocking

- **Blocking (\`Task.Wait()\` / \`.Result\`):** Blocks the OS thread completely. Under heavy load, exhausts the ThreadPool (**Thread Starvation**) and leads to high latency or deadlocks.
- **Asynchronous Await (\`await\`):** Registers a callback via I/O Completion Ports (IOCP). The calling thread is immediately returned to the ThreadPool. When the I/O finishes, an available thread picks up \`MoveNext()\` and resumes execution.

---

### 3. SynchronizationContext & \`ConfigureAwait(false)\`

- **ASP.NET Core:** Has **no SynchronizationContext**. Continuations run on any available ThreadPool thread.
- **Library Best Practice:** Always use \`.ConfigureAwait(false)\` in non-UI class libraries to eliminate unnecessary context capture overhead and prevent deadlocks when consumed by legacy UI or legacy ASP.NET applications.`,
  content_fa: `### ۱. فرآیند تبدیل کد توسط کامپایلر (Async Lowering)

هنگامی که یک متد \`async\` می‌نویسید، کامپایلر C# آن را به یک ساختار ماشین وضعیت با اینترفیس **\`IAsyncStateMachine\`** تبدیل می‌کند:
- تمام متغیرهای محلی و پارامترها به فیلدهای این ساختار تبدیل می‌شوند.
- متد \`MoveNext()\` با یک بلوک \`switch-case\` بزرگ وضعیت اجرای متد را مدیریت می‌کند.

---

### ۲. تفاوت مسدود شدن نخ (Blocking) با تعلیق ناهمگام (Awaiting)

- **روش مسدودکننده (\`.Result\` یا \`.Wait()\`):** نخ پردازشی را تا زمان دریافت پاسخ قفل می‌کند و در ترافیک‌های بالا باعث **Thread Starvation** و از کار افتادن سرور می‌شود.
- **روش غیرمسدودکننده (\`await\`):** نخ جاری را فوراً به **ThreadPool** بازمی‌گرداند تا به سایر درخواست‌ها پاسخ دهد. پس از پایان عملیات I/O دیتابیس یا شبکه، یک نخ آزاد ادامه متد را از نقطه توقف اجرا می‌کند.`,
};
