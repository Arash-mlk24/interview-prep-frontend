import { RoadmapTopic } from "../../../models";

export const asyncStateMachineTopic: RoadmapTopic = {
  id: "topic-dotnet-async-state-machine",
  stepId: "step-csharp-memory-concurrency",
  slug: "async-state-machine-execution-context-valuetask",
  order: 2,
  title: "Async Internals: Async State Machine, ExecutionContext, SynchronizationContext & ValueTask",
  title_fa: "کالبدشکافی متدهای ناهمگام: Async State Machine، ExecutionContext، SynchronizationContext و استراکت ValueTask",
  summary:
    "Master the CLR asynchronous execution pipeline: Compiler lowering to IAsyncStateMachine structs, ambient ExecutionContext flow, SynchronizationContext mechanics, and zero-allocation fast paths with ValueTask<T> and IValueTaskSource<T>.",
  summary_fa:
    "تسلط بر پایپ‌لاین اجرای ناهمگام در CLR: نحوه تبدیل کد به ساختارهای IAsyncStateMachine توسط کامپایلر، انتقال کانتکست با ExecutionContext، بررسی SynchronizationContext و بهینه‌سازی مسیرهای سریع با ValueTask<T> و IValueTaskSource<T>.",
  readingTimeMinutes: 35,
  difficulty: "senior",
  content: `## 1. The True Purpose of Asynchronous Programming in .NET

A common misconception among developers is that \`async/await\` makes individual operations run "faster". In reality, **asynchrony is about throughput and scalability, not raw execution speed**:

\`\`\`
[Synchronous I/O: Thread Blocking (Wasteful)]
Request ──► Thread 1 (OS Thread) ──► Waits for DB (100ms) ──► Memory: 1 MB Stack Locked
            [Thread 1 sits IDLE in kernel wait, burning resources and blocking ThreadPool]

[Asynchronous Non-Blocking I/O: Thread Suspension (Scalable)]
Request ──► Thread 1 ──► Issues Non-blocking Socket I/O (IOCP)
                     ──► Thread 1 is FREED back to ThreadPool to handle other requests!
                     ──► 100ms later: OS Kernel signals completion via I/O Completion Port
                     ──► Thread 4 (Any available worker) resumes execution where it paused
\`\`\`

By releasing the executing thread back to the **ThreadPool** while waiting for asynchronous I/O (database queries, HTTP calls, disk reads), a single .NET server with 8 CPU cores can easily sustain **$100,000+$ concurrent connections** using only a few dozen threads.

---

## 2. Compiler Lowering & The \`IAsyncStateMachine\` Engine

When you write an \`async Task<T>\` method, the C# Roslyn compiler rewrites your linear code into a state machine struct implementing **\`IAsyncStateMachine\`**.

![C# Async State Machine Lowering & Execution Lifecycle](/images/roadmaps/async-state-machine-flow.jpg)

### 2.1 The Deconstructed State Machine
Consider this straightforward asynchronous method:
\`\`\`csharp
public async Task<int> FetchOrderTotalAsync(int orderId)
{
    var order = await _db.GetOrderAsync(orderId);
    var discount = await _discountService.CalculateDiscountAsync(order);
    return order.Total - discount;
}
\`\`\`

The Roslyn compiler generates the following lowered C# / IL code:
\`\`\`csharp
[AsyncStateMachine(typeof(<FetchOrderTotalAsync>d__0))]
public Task<int> FetchOrderTotalAsync(int orderId)
{
    <FetchOrderTotalAsync>d__0 stateMachine = default;
    stateMachine.<>t__builder = AsyncTaskMethodBuilder<int>.Create();
    stateMachine.<>4__this = this;
    stateMachine.orderId = orderId;
    stateMachine.<>1__state = -1; // Initial state: not started

    // Starts state machine synchronously on current thread
    stateMachine.<>t__builder.Start(ref stateMachine);
    return stateMachine.<>t__builder.Task;
}

[CompilerGenerated]
private struct <FetchOrderTotalAsync>d__0 : IAsyncStateMachine
{
    public int <>1__state;
    public AsyncTaskMethodBuilder<int> <>t__builder;
    public FetchService <>4__this;
    public int orderId;

    // Hoisted local variables
    private Order <order>5__1;
    private int <discount>5__2;

    // Awaiters for each asynchronous point
    private TaskAwaiter<Order> <>u__1;
    private TaskAwaiter<int> <>u__2;

    public void MoveNext()
    {
        int num = <>1__state;
        int result;
        try
        {
            TaskAwaiter<Order> awaiter1;
            if (num != 0)
            {
                if (num == 1)
                {
                    // Resuming from second await point
                    awaiter1 = <>u__2;
                    <>u__2 = default;
                    <>1__state = -1;
                    goto Label_SecondAwaitComplete;
                }

                // 1. First Await Point: _db.GetOrderAsync(orderId)
                awaiter1 = <>4__this._db.GetOrderAsync(orderId).GetAwaiter();
                if (!awaiter1.IsCompleted)
                {
                    // SUSPENSION PATH:
                    <>1__state = 0;
                    <>u__1 = awaiter1;
                    // Boxes state machine to Heap and hooks continuation callback!
                    <>t__builder.AwaitUnsafeOnCompleted(ref awaiter1, ref this);
                    return; // CURRENT THREAD RETURNS IMMEDIATELY!
                }
            }
            else
            {
                awaiter1 = <>u__1;
                <>u__1 = default;
                <>1__state = -1;
            }

            <order>5__1 = awaiter1.GetResult();

            // 2. Second Await Point: _discountService.CalculateDiscountAsync(order)
            var awaiter2 = <>4__this._discountService.CalculateDiscountAsync(<order>5__1).GetAwaiter();
            if (!awaiter2.IsCompleted)
            {
                <>1__state = 1;
                <>u__2 = awaiter2;
                <>t__builder.AwaitUnsafeOnCompleted(ref awaiter2, ref this);
                return;
            }

        Label_SecondAwaitComplete:
            <discount>5__2 = awaiter2.GetResult();
            result = <order>5__1.Total - <discount>5__2;
        }
        catch (Exception ex)
        {
            <>1__state = -2;
            <>t__builder.SetException(ex);
            return;
        }

        <>1__state = -2;
        <>t__builder.SetResult(result);
    }

    public void SetStateMachine(IAsyncStateMachine stateMachine) { }
}
\`\`\`

### 2.2 Critical Execution Paths: Fast Path vs. Suspension Path
1. **The Fast Path (\`awaiter.IsCompleted == true\`):**
   - If the task is already completed (e.g. data returned from cache or in-memory completed Task), \`MoveNext()\` executes the code synchronously from top to bottom.
   - **Zero Heap Boxing:** The state machine remains a stack struct and is never copied to the heap!
2. **The Suspension Path (\`awaiter.IsCompleted == false\`):**
   - When an incomplete I/O operation is awaited, \`<>t__builder.AwaitUnsafeOnCompleted\` is invoked.
   - The state machine struct on the stack is **boxed to the Managed Heap** so its state and hoisted variables survive.
   - The thread is immediately released back to the ThreadPool.

---

## 3. \`ExecutionContext\` vs. \`SynchronizationContext\`

Understanding the difference between these two contexts is one of the most critical requirements for senior backend engineers.

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXECUTIONCONTEXT VS SYNCHRONIZATIONCONTEXT               │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ Concept                           │ Architectural Role                      │
├───────────────────────────────────┼─────────────────────────────────────────┤
│ ExecutionContext (The "Ambient")  │ Flows security identity, AsyncLocal<T>, │
│                                   │ Activity/TraceId across thread hops.    │
├───────────────────────────────────┼─────────────────────────────────────────┤
│ SynchronizationContext (The "Target")| Marshals execution back to a specific│
│                                   │ thread (e.g., UI thread in WPF/WinForms)│
└───────────────────────────────────┴─────────────────────────────────────────┘
\`\`\`

### 3.1 \`ExecutionContext\` & \`AsyncLocal<T>\`
\`ExecutionContext\` represents the ambient environmental state of a logical execution flow.
- **Context Flow:** Whenever an asynchronous method yields and resumes on a different ThreadPool thread, the CLR automatically captures the \`ExecutionContext\` and restores it on the new thread.
- **\`AsyncLocal<T>\`:** Enables ambient data (such as HTTP Request IDs, Correlation IDs, and Tenant Contexts) to flow seamlessly across asynchronous cascades:

\`\`\`csharp
public static class CorrelationContext
{
    private static readonly AsyncLocal<string> _correlationId = new();

    public static string CurrentId
    {
        get => _correlationId.Value ?? string.Empty;
        set => _correlationId.Value = value;
    }
}
\`\`\`

#### Performance Optimization: \`ExecutionContext.SuppressFlow()\`
Capturing and restoring \`ExecutionContext\` incurs small CPU and allocation overhead. In ultra-hot infrastructure paths (e.g., inside high-throughput queue dispatchers) where \`AsyncLocal\` is not needed, you can suppress context flow:

\`\`\`csharp
// Suppress context capture for high-frequency internal worker loops
using (ExecutionContext.SuppressFlow())
{
    ThreadPool.QueueUserWorkItem(static state => {
        // Runs without ambient context overhead
    });
}
\`\`\`

### 3.2 \`SynchronizationContext\` & The Truth About \`ConfigureAwait(false)\`
In legacy UI frameworks (WPF, Windows Forms) and legacy ASP.NET (System.Web), a **\`SynchronizationContext\`** was used to force task continuations back onto the single UI Thread or HTTP request thread.

#### ASP.NET Core Has NO SynchronizationContext:
- In **ASP.NET Core (.NET 6/7/8/9)**, \`SynchronizationContext.Current\` is **\`null\`**.
- Every continuation after an \`await\` automatically resumes on whatever ThreadPool worker is available.
- **Why \`ConfigureAwait(false)\` is still recommended in reusable NuGet libraries:**
  - If your library is ever consumed by a legacy desktop UI application (WPF/MAUI), omitting \`ConfigureAwait(false)\` can cause a deadly **Deadlock** if the consumer synchronously calls \`.Result\` on the UI thread.
  - In application-level ASP.NET Core controllers and endpoints, \`ConfigureAwait(false)\` is unnecessary.

---

## 4. High-Performance \`ValueTask<T>\` & \`IValueTaskSource<T>\`

Every instantiation of a standard \`Task<T>\` allocates a **$64+\\text{ byte}$ reference object** on the Managed Heap. In services processing 50,000 requests/sec, returning \`Task<T>\` from synchronous or cached paths creates millions of transient objects, saturating GC Gen 0.

![Task<T> vs ValueTask<T> Architecture & Memory Layout](/images/roadmaps/task-vs-valuetask-internals.jpg)

### 4.1 \`ValueTask<T>\` Internal Memory Layout
\`ValueTask<T>\` is a discriminated union struct (16 bytes on 64-bit architectures):
\`\`\`csharp
public readonly struct ValueTask<TResult>
{
    internal readonly object? _obj;       // Can be Task<TResult> OR IValueTaskSource<TResult>
    internal readonly TResult _result;    // Synchronous result value
    internal readonly short _token;       // Version token to prevent double-awaiting
}
\`\`\`

- **Synchronous Fast Path:** If the value is ready immediately (e.g. cache hit), \`_obj\` is \`null\` and \`_result\` holds the data directly on the stack. **Zero heap allocation!**
- **Asynchronous Slow Path:** If the operation must wait for I/O, \`_obj\` wraps a \`Task<TResult>\` or an \`IValueTaskSource<TResult>\`.

\`\`\`csharp
public class UserRepository
{
    private readonly MemoryCache _cache;
    private readonly AppDbContext _db;

    public ValueTask<User?> GetUserByIdAsync(int userId)
    {
        // 1. FAST PATH: Cache hit -> Zero heap allocation!
        if (_cache.TryGetValue(userId, out User? cachedUser))
        {
            return new ValueTask<User?>(cachedUser);
        }

        // 2. SLOW PATH: Database fetch -> Falls back to async Task
        return new ValueTask<User?>(FetchFromDatabaseAsync(userId));
    }

    private async Task<User?> FetchFromDatabaseAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        _cache.Set(userId, user, TimeSpan.FromMinutes(10));
        return user;
    }
}
\`\`\`

### 4.2 Zero-Allocation Reusable Async Operations with \`IValueTaskSource<T>\`
For operations that are *always asynchronous* (e.g. reading from a network socket in Kestrel or reading from \`Channel<T>\`), standard \`Task<T>\` would still allocate on every read.

Using **\`IValueTaskSource<T>\`** (via \`ManualResetValueTaskSourceCore<T>\`), the same underlying state object is reset and reused repeatedly for millions of reads with **0 heap allocations**:

\`\`\`csharp
public sealed class ReusableSocketAwaiter : IValueTaskSource<int>
{
    private ManualResetValueTaskSourceCore<int> _core;

    public ValueTask<int> ReceiveAsync(Socket socket, Memory<byte> buffer)
    {
        _core.Reset(); // Reset state for reuse
        // Issue async socket receive...
        return new ValueTask<int>(this, _core.Version);
    }

    public int GetResult(short token) => _core.GetResult(token);
    public ValueTaskSourceStatus GetStatus(short token) => _core.GetStatus(token);
    public void OnCompleted(Action<object?> continuation, object? state, short token, ValueTaskSourceOnCompletedFlags flags)
        => _core.OnCompleted(continuation, state, token, flags);
}
\`\`\`

### 4.3 The 4 Deadly Sins / Anti-Patterns of \`ValueTask\`

\`\`\`csharp
ValueTask<int> vt = CalculateAsync();

// ❌ SIN 1: Awaiting a ValueTask multiple times (Undefined Behavior / Crash)
int res1 = await vt;
int res2 = await vt; // CRASH! IValueTaskSource may already be reset/reused!

// ❌ SIN 2: Calling .GetAwaiter().GetResult() synchronously on incomplete ValueTask
int res = vt.GetAwaiter().GetResult(); // Blocks and may corrupt pool state!

// ❌ SIN 3: Concurrent awaits on the same ValueTask
var t1 = Task.Run(async () => await vt);
var t2 = Task.Run(async () => await vt); // FATAL RACE CONDITION!

// ❌ SIN 4: Using Task.WhenAll or Task.WhenAny directly with ValueTask
// Solution: Convert to Task first using .AsTask()
await Task.WhenAll(vt1.AsTask(), vt2.AsTask());
\`\`\`

---

## 5. ThreadPool Starvation & The Sync-Over-Async Trap

**ThreadPool Starvation** is the most notorious production killer in .NET enterprise backends. It occurs when threads are synchronously blocked waiting for asynchronous operations to complete:

\`\`\`
[The Catastrophic Sync-Over-Async Cascade]
Request 1: var data = service.GetDataAsync().Result; // Thread 1 BLOCKED!
Request 2: var user = service.GetUserAsync().Result; // Thread 2 BLOCKED!
...
Request 50: All 50 ThreadPool worker threads are blocked waiting for DB!
Incoming I/O Callback arrives from Socket Driver ──► Needs a thread to resume!
                                                 ──► Zero threads available!
                                                 ──► DEADLOCK / Server Timeout 504!
\`\`\`

### 5.1 Why the CLR Hill-Climbing Algorithm Cannot Save You in Real-Time
When the ThreadPool detects starvation, its Hill-Climbing algorithm injects new threads at a rate of **only 1 thread every 500 milliseconds**.

If a traffic burst sends 1,000 requests/sec and 50 threads are blocked by \`.Result\`:
- It takes the ThreadPool **25 seconds** to spawn 50 replacement threads!
- During those 25 seconds, incoming requests queue up, socket buffers overflow, and the entire cluster crashes.

### 5.2 Production Diagnostics with \`dotnet-counters\` & \`dotnet-dump\`

\`\`\`bash
# 1. Monitor ThreadPool thread injection and queue backlog in real-time:
dotnet-counters monitor --process-id <PID> --counters System.Runtime

# Key metrics to watch:
# - ThreadPool Thread Count: Spiking upward
# - ThreadPool Queue Length: Accumulating thousands of unhandled work items!
# - CPU Usage: Remaining LOW (e.g. 5%) despite massive latency (classic starvation symptom!)

# 2. Capture memory dump to inspect blocked thread callstacks:
dotnet-dump collect --process-id <PID>
dotnet-dump analyze <dump_file>

# In dump analyzer:
> clrstack -all
# Look for: System.Threading.Tasks.Task.Wait or Task.GetResult in stack frames!
\`\`\`

---

## 6. Master Decision & Comparison Matrix

| Architectural Dimension | \`Task\` / \`Task<T>\` | \`ValueTask\` / \`ValueTask<T>\` | \`IValueTaskSource<T>\` |
| :--- | :--- | :--- | :--- |
| **Type Kind** | Reference Type (\`class\`) | Value Type (\`struct\`) | Interface / Reusable Object |
| **Heap Allocation on Sync Completion** | **$64\\text{ B}+$ per call** | **Zero ($0\\text{ B}$)** | **Zero ($0\\text{ B}$)** |
| **Heap Allocation on Async Completion**| $64\\text{ B}+$ per call | $64\\text{ B}+$ (Wraps Task) | **Zero ($0\\text{ B}$)** (Reused) |
| **Can be Awaited Multiple Times?** | ✅ Yes (Safe) | ❌ No (Undefined Behavior)| ❌ Strictly No |
| **Compatible with \`Task.WhenAll\`?** | ✅ Yes (Directly) | ⚠️ Requires \`.AsTask()\` | ⚠️ Requires \`.AsTask()\` |
| **Primary Use Case** | Default general async APIs | APIs with $>70\\%$ cache hits | Continuous socket/channel loops |`,
  content_fa: `## ۱. هدف بنیادین برنامه‌نویسی ناهمگام (Async/Await) در دات‌نت

یک باور اشتباه میان توسعه‌دهندگان این است که استفاده از \`async/await\` سرعت اجرای یک عملیات را بیشتر می‌کند. در واقعیت، **برنامه‌نویسی ناهمگام برای افزایش مقیاس‌پذیری و توان عملیاتی (Throughput) سرور است نه سرعت پردازش خام**:

\`\`\`
[پردازش همگام و مسدودکننده: اتلاف شدید منابع]
درخواست ──► نخ ۱ (نخ سیستم‌عامل) ──► انتظار برای دیتابیس (۱۰۰ میلی‌ثانیه) ──► ۱ مگابایت رم قفل‌شده
            [نخ ۱ در حالت بیکار معطل مانده و ظرفیت ThreadPool را اشغال می‌کند]

[پردازش ناهمگام غیرمسدودکننده: تعلیق هوشمندانه]
درخواست ──► نخ ۱ ──► صدور درخواست ناهمگام به درایور سوکت شبکه (IOCP)
                 ──► نخ ۱ فوراً به ThreadPool بازمی‌گردد تا به درخواست‌های دیگر پاسخ دهد!
                 ──► ۱۰۰ میلی‌ثانیه بعد: سیستم‌عامل اتمام کار را اطلاع می‌دهد
                 ──► نخ ۴ (هر نخی که در ThreadPool آزاد باشد) ادامه کد را اجرا می‌کند
\`\`\`

با آزادسازی نخ در طول زمان انتظار I/O، یک سرور دات‌نت با ۸ هسته پردازنده می‌تواند به راحتی بیش از **۱۰۰,۰۰۰ درخواست همزمان** را تنها با چند ده نخ مدیریت کند.

---

## ۲. فرآیند تبدیل کد توسط کامپایلر و موتور \`IAsyncStateMachine\`

هنگامی که یک متد حاوی \`async Task<T>\` می‌نویسید، کامپایلر Roslyn دات‌نت ساختار خطی کد را شکسته و آن را به یک ساختار ماشین وضعیت با اینترفیس **\`IAsyncStateMachine\`** تبدیل می‌کند.

![چرخه حیات و ماشین وضعیت Async](/images/roadmaps/async-state-machine-flow.jpg)

### ۲.۱ کالبدشکافی ماشین وضعیت تولیدشده
متد ساده زیر را در نظر بگیرید:
\`\`\`csharp
public async Task<int> FetchOrderTotalAsync(int orderId)
{
    var order = await _db.GetOrderAsync(orderId);
    var discount = await _discountService.CalculateDiscountAsync(order);
    return order.Total - discount;
}
\`\`\`

کامپایلر آن را به ساختار زیر تبدیل می‌کند:
\`\`\`csharp
[CompilerGenerated]
private struct <FetchOrderTotalAsync>d__0 : IAsyncStateMachine
{
    public int <>1__state;                    // شماره مرحله اجرای متد (-1 شروع، 0 و 1 توقفگاه‌ها)
    public AsyncTaskMethodBuilder<int> <>t__builder; // سازنده تسک و مدیریت‌کننده حالت
    public int orderId;

    // متغیرهای محلی که به فیلد استراکت تبدیل شده‌اند
    private Order <order>5__1;
    private int <discount>5__2;

    // Awaiterهای اختصاصی هر دستور await
    private TaskAwaiter<Order> <>u__1;
    private TaskAwaiter<int> <>u__2;

    public void MoveNext()
    {
        int num = <>1__state;
        try
        {
            TaskAwaiter<Order> awaiter1;
            if (num != 0)
            {
                // ۱. نقطه توقف اول: دریافت اطلاعات سفارش
                awaiter1 = _db.GetOrderAsync(orderId).GetAwaiter();
                if (!awaiter1.IsCompleted)
                {
                    // مسیر تعلیق (Suspension Path):
                    <>1__state = 0;
                    <>u__1 = awaiter1;
                    // انتقال ماشین وضعیت به Heap و ثبت هوک بازخوانی!
                    <>t__builder.AwaitUnsafeOnCompleted(ref awaiter1, ref this);
                    return; // نخ جاری فوراً به ThreadPool بازگردانده می‌شود!
                }
            }
            else
            {
                awaiter1 = <>u__1;
                <>u__1 = default;
                <>1__state = -1;
            }

            <order>5__1 = awaiter1.GetResult();

            // ۲. نقطه توقف دوم: محاسبه تخفیف
            var awaiter2 = _discountService.CalculateDiscountAsync(<order>5__1).GetAwaiter();
            if (!awaiter2.IsCompleted)
            {
                <>1__state = 1;
                <>u__2 = awaiter2;
                <>t__builder.AwaitUnsafeOnCompleted(ref awaiter2, ref this);
                return;
            }

            <discount>5__2 = awaiter2.GetResult();
            int result = <order>5__1.Total - <discount>5__2;
            <>t__builder.SetResult(result);
        }
        catch (Exception ex)
        {
            <>t__builder.SetException(ex);
        }
    }
}
\`\`\`

### ۲.۲ دو مسیر اصلی اجرا: مسیر سریع در برابر مسیر تعلیق
۱. **مسیر سریع (Fast Path - \`awaiter.IsCompleted == true\`):**
   - اگر نتیجه عملیات از قبل آماده باشد (مثلاً داده درون کش موجود باشد)، متد \`MoveNext\` به صورت خطی و همگام اجرا می‌شود.
   - **عدم انتقال به Heap:** ماشین وضعیت به عنوان یک استراکت روی استک باقی می‌ماند و **هیچ شیئی روی Heap ساخته نمی‌شود**.
۲. **مسیر تعلیق (Suspension Path - \`awaiter.IsCompleted == false\`):**
   - وقتی عملیات هنوز تمام نشده، متد \`AwaitUnsafeOnCompleted\` فراخوانی می‌شود.
   - استراکت ماشین وضعیت روی **Managed Heap کپی (Box)** می‌شود تا متغیرهای محلی حفظ شوند.
   - نخ سیستم فوراً آزاد می‌شود.

---

## ۳. تفاوت بنیادین \`ExecutionContext\` و \`SynchronizationContext\`

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                   مقایسه کانتکست‌های اجرایی در دات‌نت                       │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ مفهوم                             │ نقش معمارانه                            │
├───────────────────────────────────┼─────────────────────────────────────────┤
│ ExecutionContext (کانتکست محیطی)  │ انتقال هویت امنیتی، AsyncLocal و        │
│                                   │ TraceId بین پرش‌های نخی ناهمگام.         │
├───────────────────────────────────┼─────────────────────────────────────────┤
│ SynchronizationContext (مقصد اجرا)│ هدایت اجرای ادامه کد به یک نخ خاص       │
│                                   │ (مانند نخ رابط کاربری UI در WPF/WinForms)│
└───────────────────────────────────┴─────────────────────────────────────────┘
\`\`\`

### ۳.۱ مفهوم \`ExecutionContext\` و کلاس \`AsyncLocal<T>\`
کانتکست اجرایی محیط منطقی برنامه را نشان می‌دهد. با تعلیق و از سرگیری متد روی یک نخ جدید، CLR کانتکست محیطی را به نخ جدید منتقل می‌کند تا فیلدهای **\`AsyncLocal<T>\`** (مانند Correlation ID، شناسه کاربر و Tenant Id) به درستی در دسترس باشند:

\`\`\`csharp
public static class CorrelationContext
{
    private static readonly AsyncLocal<string> _correlationId = new();

    public static string CurrentId
    {
        get => _correlationId.Value ?? string.Empty;
        set => _correlationId.Value = value;
    }
}
\`\`\`

### ۳.۲ بررسی \`SynchronizationContext\` و کاربرد \`ConfigureAwait(false)\`
در فریم‌ورک‌های رابط کاربری قدیمی (مانند WinForms و WPF)، کانتکست همگام‌سازی ادامه اجرای کد را مجبور می‌کرد که به نخ اصلی UI بازگردد.

#### در ASP.NET Core کانتکست SynchronizationContext وجود ندارد:
- در **ASP.NET Core مدرن**، مقدار \`SynchronizationContext.Current\` همواره **\`null\`** است.
- پس از اتمام هر دستور \`await\`، ادامه کد به اولین نخ آزاد در ThreadPool واگذار می‌شود.
- **چرا \`ConfigureAwait(false)\` در کتابخانه‌های عمومی NuGet همچنان پیشنهاد می‌شود؟**
  - اگر کتابخانه شما توسط برنامه‌های دسکتاپ (WPF یا MAUI) استفاده شود، عدم استفاده از \`ConfigureAwait(false)\` در صورت فراخوانی همگام (\`.Result\`) توسط کلاینت می‌تواند باعث **Deadlock** شود.
  - در کدهای تجاری وب اپلیکیشن‌های ASP.NET Core، نوشتن \`ConfigureAwait(false)\` ضرورت فنی ندارد.

---

## ۴. بررسی عمیق \`ValueTask<T>\` و \`IValueTaskSource<T>\`

هر شیء \`Task<T>\` یک شیء رفرنس روی Heap است که حداقل **۶۴ بایت حافظه** اشغال می‌کند. در سرویس‌های پرترافیک، ساخت مداوم تسک‌ها باعث پر شدن سریع Gen 0 می‌شود.

![معماری Task و ValueTask در حافظه](/images/roadmaps/task-vs-valuetask-internals.jpg)

### ۴.۱ ساختار حافظه \`ValueTask<T>\`
ساختار \`ValueTask<T>\` یک استراکت ۱۶ بایتی است:
- **در مسیر سریع همگام:** نتیجه مستقیماً درون فیلد استراکت روی Stack قرار دارد (**صفر بایت آلیکیشن در Heap**).
- **در مسیر ناهمگام:** به یک شیء Task یا اینترفیس بازیافتی \`IValueTaskSource<T>\` ارجاع می‌دهد.

\`\`\`csharp
public class UserRepository
{
    private readonly IMemoryCache _cache;
    private readonly AppDbContext _db;

    public ValueTask<User?> GetUserByIdAsync(int userId)
    {
        // مسیر سریع: داده در کش وجود دارد -> صفر بایت تخصیص حافظه!
        if (_cache.TryGetValue(userId, out User? cachedUser))
        {
            return new ValueTask<User?>(cachedUser);
        }

        // مسیر کند: لود از دیتابیس با بازگشت تسک ناهمگام
        return new ValueTask<User?>(FetchFromDbAsync(userId));
    }

    private async Task<User?> FetchFromDbAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        _cache.Set(userId, user, TimeSpan.FromMinutes(5));
        return user;
    }
}
\`\`\`

### ۴.۲ ۴ خطای مرگبار در استفاده از \`ValueTask\`

\`\`\`csharp
ValueTask<int> vt = CalculateAsync();

// ❌ خطای ۱: اعمال چندباره await روی یک شیء ValueTask
int r1 = await vt;
int r2 = await vt; // خطای کشنده! ممکن است بافر بازیافت شده باشد!

// ❌ خطای ۲: فراخوانی همگام GetResult روی ValueTask تکمیل‌نشده
int r = vt.GetAwaiter().GetResult(); // بن‌بست و خرابی وضعیت داخلی استخر

// ❌ خطای ۳: ارسال مستقیم به Task.WhenAll
// راهکار: ابتدا با .AsTask() به تسک معمولی تبدیل کنید:
await Task.WhenAll(vt1.AsTask(), vt2.AsTask());
\`\`\`

---

## ۵. معضل ThreadPool Starvation و تله Sync-Over-Async

**ThreadPool Starvation** زمانی رخ می‌دهد که نخ‌های پردازشی سرور با کدهای همگام مانند \`.Result\`، \`.Wait()\` یا \`.GetAwaiter().GetResult()\` مسدود (Block) شوند:

\`\`\`
[فروپاشی دومینووار ناشی از Sync-Over-Async]
درخواست ۱: var data = GetDataAsync().Result; // نخ ۱ قفل شد!
درخواست ۲: var user = GetUserAsync().Result; // نخ ۲ قفل شد!
...
درخواست ۵۰: تمام ۵۰ نخ کارگر ThreadPool مسدود شدند!
پاسخ دیتابیس از درایور سوکت می‌رسد ──► برای پردازش ادامه کد به یک نخ نیاز دارد!
                                   ──► هیچ نخی در دسترس نیست!
                                   ──► قفل کامل سرور و خطای تایم‌اوت 504!
\`\`\`

### ۵.۱ چرا الگوریتم Hill-Climbing ران‌تایم سرور را نجات نمی‌دهد؟
موتور ران‌تایم هنگام تشخیص Starvation، **تنها هر ۵۰۰ میلی‌ثانیه ۱ نخ جدید تزریق می‌کند**. اگر ۵۰ نخ مسدود شوند، ۲۵ ثانیه طول می‌کشد تا نخ‌های جدید جایگزین شوند؛ در این ۲۵ ثانیه صف درخواست‌ها سرریز کرده و سرور کرش می‌کند.

---

## ۶. جدول مقایسه جامع ساختارهای ناهمگام

| بعد فنی | \`Task\` / \`Task<T>\` | \`ValueTask\` / \`ValueTask<T>\` | \`IValueTaskSource<T>\` |
| :--- | :--- | :--- | :--- |
| **نوع ساختار** | کلاس (\`class\`) | استراکت (\`struct\`) | اینترفیس / شیء بازیافتی |
| **تخصیص حافظه در مسیر سریع** | **حداقل ۶۴ بایت در هر فراخوانی** | **صفر ($0\\text{ B}$)** | **صفر ($0\\text{ B}$)** |
| **تخصیص حافظه در مسیر ناهمگام**| ۶۴ بایت به ازای هر تسک | ۶۴ بایت (ارجاع به تسک) | **صفر ($0\\text{ B}$)** (استفاده مجدد) |
| **امکان Await چندباره؟** | ✅ بله (کاملاً امن) | ❌ خیر (رفتار تعریف‌نشده) | ❌ مطلقاً خیر |
| **سازگاری مستقیم با \`Task.WhenAll\`**| ✅ بله | ⚠️ نیازمند \`.AsTask()\` | ⚠️ نیازمند \`.AsTask()\` |
| **کاربرد ایده‌آل** | متدهای ناهمگام استاندارد | متدهایی با درصد کش بالای ۷۰٪ | حلقه‌های I/O مداوم مانند سوکت‌ها |`,
};
