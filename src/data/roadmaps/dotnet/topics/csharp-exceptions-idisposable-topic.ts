import { RoadmapTopic } from "../../../models";

export const csharpExceptionsIdisposableTopic: RoadmapTopic = {
  id: "topic-dotnet-csharp-exceptions-idisposable",
  stepId: "step-mid-csharp-fundamentals",
  slug: "csharp-exceptions-idisposable",
  order: 4,
  title: "Exceptions, Resource Management & IDisposable/IAsyncDisposable Patterns",
  title_fa: "مدیریت استثناها، آزادسازی منابع سیستمی و الگوهای IDisposable و IAsyncDisposable",
  summary:
    "Master CLR two-pass exception handling, exception filters (when clause), stack unwinding, the Garbage Collector Finalizer queue, GC.SuppressFinalize, and the full asynchronous IAsyncDisposable pattern with SafeHandle.",
  summary_fa:
    "تسلط عمیق بر مدل دو فازی (Two-Pass) مدیریت استثناها در رانتایم CLR، فیلترهای استثنا (عبارت when)، سازوکار پشته‌زدایی (Stack Unwinding)، صف‌های Finalization و F-Reachable در Garbage Collector، متد GC.SuppressFinalize، و پیاده‌سازی کامل الگوی IDisposable و IAsyncDisposable به همراه SafeHandle.",
  readingTimeMinutes: 28,
  difficulty: "mid",
  content: `## 1. Evolution & The Problem Statement

In legacy C and C++ systems, error handling and resource cleanup relied on manual error codes (\`HRESULT\`, integer return statuses) and explicit destructor calls:

\`\`\`c
// Legacy C Error Handling & Resource Cleanup
FILE* file = fopen("data.bin", "rb");
if (file == NULL) {
    return ERR_FILE_NOT_FOUND; // Error code propagation
}

if (!ProcessHeader(file)) {
    fclose(file); // Manual cleanup required at every single exit point!
    return ERR_INVALID_HEADER;
}

fclose(file); // Easy to leak if early return or crash occurs
\`\`\`

This paradigm caused two catastrophic issues in enterprise software:
1. **Pervasive Resource Leaks**: If an error occurred between acquiring a resource (file handle, socket, database connection) and releasing it, the cleanup code was bypassed, exhausting operating system file descriptors and memory handles.
2. **Ignored Return Codes & Fragile Control Flow**: Developers frequently forgot to check return statuses, allowing invalid program state to silently propagate until causing unrecoverable segmentation faults.

.NET solved this with **Structured Exception Handling (SEH)** and the **IDisposable / IAsyncDisposable Pattern**, providing deterministic cleanup guarantees paired with automatic Garbage Collection.

---

## 2. CLR Exception Architecture: The Two-Pass Model

![CLR Exception Pipeline and IDisposable Lifecycle](/images/roadmaps/csharp-exceptions-idisposable.jpg)

Unlike simple try-catch blocks in languages like Java or Python, the .NET Common Language Runtime (CLR) implements a sophisticated **Two-Pass Exception Handling Engine**:

### Pass 1: The Search Phase (Inspection without Unwinding)
1. When a \`throw\` occurs, the CLR walks up the execution call stack looking for a matching \`catch\` block.
2. If a \`catch\` block has an **Exception Filter** (\`catch (...) when (...)\`), the CLR **executes the filter expression in-place without unwinding the stack**!
3. All local variables, CPU registers, and stack frames between the throw site and the catch site **remain 100% intact**.
4. If the filter returns \`false\`, the CLR continues searching up the stack.

### Pass 2: The Unwind Phase (Execution & Cleanup)
1. Once a matching handler is found, the CLR performs **Stack Unwinding**.
2. It walks back down the stack executing all intermediate **\`finally\` blocks** and **\`using\` disposals** in reverse order.
3. Finally, execution transfers to the body of the identified \`catch\` block.

### Why Exception Filters (\`when\`) Are a Game-Changer
In legacy C#, developers caught exceptions, checked conditions with \`if\`, and re-threw with \`throw;\`:

\`\`\`csharp
// BAD: Unwinds the stack BEFORE evaluating the condition!
try
{
    await httpClient.GetAsync(url);
}
catch (HttpRequestException ex)
{
    if (ex.StatusCode == HttpStatusCode.NotFound)
    {
        _logger.LogWarning("Resource not found");
    }
    else
    {
        throw; // Stack trace was already mutated/unwound!
    }
}

// MODERN C# (Zero Stack Mutation):
try
{
    await httpClient.GetAsync(url);
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    // Filter evaluated during Pass 1 while full stack state and crash dumps are intact!
    _logger.LogWarning("Resource not found");
}
\`\`\`

---

## 3. Exception Propagation Mechanics: \`throw\` vs. \`throw ex\` vs. \`ExceptionDispatchInfo\`

Preserving the call stack is essential for root-cause diagnosis in production services:

\`\`\`csharp
public async Task ProcessOrderAsync(Order order)
{
    try
    {
        await _paymentService.ChargeAsync(order);
    }
    catch (PaymentException ex)
    {
        // 1. DISASTER: 'throw ex' resets the StackTrace to THIS line, erasing origin frames!
        // throw ex;

        // 2. CORRECT: 'throw;' preserves the original throw site and full stack trace.
        // throw;

        // 3. ADVANCED: Capture exception for asynchronous or cross-thread re-throwing
        ExceptionDispatchInfo.Capture(ex).Throw();
    }
}
\`\`\`

| Mechanism | Stack Trace Preservation | Use Case |
| :--- | :--- | :--- |
| **\`throw;\`** | **Preserves 100% of origin stack** | Standard re-throw inside catch blocks |
| **\`throw ex;\`** | **Erases origin stack**, resets trace to current line | **Anti-Pattern (Never use in production)** |
| **\`throw new CustomException("...", ex);\`** | Wraps original exception in \`InnerException\` | Domain error translation & enrichment |
| **\`ExceptionDispatchInfo.Capture(ex).Throw()\`** | **Preserves original stack + appends re-throw marker** | Async task pipelines, Polly retries, thread pools |

---

## 4. Resource Management & The CLR Finalizer Queue

Memory in .NET is managed by the Garbage Collector (GC). However, the GC **only understands managed heap allocations**. It has zero knowledge of **Unmanaged Operating System Resources**:
- Operating system file handles (\`IntPtr\`, \`HANDLE\`)
- Sockets and raw TCP network streams
- Database connection pointers
- Unmanaged memory allocated via \`Marshal.AllocHGlobal\` or native C/C++ libraries

### The Finalizer Queue vs. F-Reachable Queue Problem

When a class defines a Finalizer (\`~MyClass()\`), the Garbage Collector treats it with a costly fallback mechanism:

\`\`\`csharp
public class LeakyResource
{
    private IntPtr _nativeBuffer;

    public LeakyResource()
    {
        _nativeBuffer = Marshal.AllocHGlobal(1024 * 1024); // 1 MB unmanaged heap
    }

    // Finalizer (Destructor in C#)
    ~LeakyResource()
    {
        Marshal.FreeHGlobal(_nativeBuffer); // Fallback cleanup
    }
}
\`\`\`

#### Why Finalizers Cripple GC Performance:
1. **Object Allocation**: The CLR places a pointer to the object into the **Finalization Queue**.
2. **Collection Trigger**: When Generation 0 GC runs, it discovers the object is unreferenced. However, because it has a finalizer, the GC **CANNOT free its memory immediately**.
3. **Queue Migration**: The GC moves the object from the *Finalization Queue* to the **F-Reachable Queue** (Finalization Reachable).
4. **Generational Promotion**: Because the object is now referenced by the *F-Reachable Queue*, it survives the Gen 0 collection and gets **promoted to Generation 1 (or Generation 2)**!
5. **Dedicated Thread Execution**: A single, low-priority background thread (the *Finalizer Thread*) drains the F-Reachable Queue and invokes \`~LeakyResource()\`.
6. **Delayed Memory Reclamation**: The object's memory is only freed on the *subsequent* Gen 1/Gen 2 collection cycles, increasing memory pressure and GC pauses!

### The Antidote: \`GC.SuppressFinalize(this)\`

When \`Dispose()\` is called deterministically by the developer, \`GC.SuppressFinalize(this)\` informs the CLR: *"This object has already freed its unmanaged resources. Remove it from the Finalization Queue."* The object is reclaimed immediately in Generation 0 with zero generational promotion penalty!

---

## 5. The Canonical Full Dispose Pattern (IDisposable + IAsyncDisposable)

Here is the production-grade implementation supporting both synchronous (\`using\`) and asynchronous (\`await using\`) disposal, inheritance, and \`SafeHandle\` safety:

\`\`\`csharp
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

public class HighPerformanceFileManager : IDisposable, IAsyncDisposable
{
    // 1. Managed disposable resources
    private MemoryStream? _bufferedStream;

    // 2. Safe unmanaged resource wrapper (Recommended over raw IntPtr)
    private SafeFileHandle? _safeHandle;

    // 3. Raw unmanaged pointers (if applicable)
    private IntPtr _unmanagedBuffer;

    // 4. Thread-safe disposal tracking flag
    private int _disposedState; // 0 = active, 1 = disposed

    public bool IsDisposed => Volatile.Read(ref _disposedState) != 0;

    public HighPerformanceFileManager(string path)
    {
        _bufferedStream = new MemoryStream();
        _unmanagedBuffer = Marshal.AllocHGlobal(4096);
        _safeHandle = File.OpenHandle(path, FileMode.OpenOrCreate, FileAccess.ReadWrite);
    }

    // ── Synchronous Disposal (IDisposable) ─────────────────────
    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this); // Remove from Finalization Queue!
    }

    protected virtual void Dispose(bool disposing)
    {
        // Atomic compare-exchange to guarantee idempotency across threads
        if (Interlocked.Exchange(ref _disposedState, 1) != 0)
            return;

        if (disposing)
        {
            // Clean up MANAGED disposable objects
            _bufferedStream?.Dispose();
            _bufferedStream = null;

            _safeHandle?.Dispose();
            _safeHandle = null;
        }

        // Clean up RAW UNMANAGED memory (always freed, even if disposing == false)
        if (_unmanagedBuffer != IntPtr.Zero)
        {
            Marshal.FreeHGlobal(_unmanagedBuffer);
            _unmanagedBuffer = IntPtr.Zero;
        }
    }

    // ── Asynchronous Disposal (IAsyncDisposable - .NET Core 3+) 
    public async ValueTask DisposeAsync()
    {
        await DisposeAsyncCore().ConfigureAwait(false);

        // Dispose unmanaged resources without disposing managed again
        Dispose(disposing: false);

        GC.SuppressFinalize(this);
    }

    protected virtual async ValueTask DisposeAsyncCore()
    {
        if (Interlocked.Exchange(ref _disposedState, 1) != 0)
            return;

        if (_bufferedStream != null)
        {
            await _bufferedStream.DisposeAsync().ConfigureAwait(false);
            _bufferedStream = null;
        }

        if (_safeHandle != null)
        {
            _safeHandle.Dispose();
            _safeHandle = null;
        }
    }

    // ── Finalizer (Only necessary if holding raw unmanaged IntPtr pointers)
    ~HighPerformanceFileManager()
    {
        Dispose(disposing: false);
    }
}
\`\`\`

---

## 6. Modern ASP.NET Core 8/9 Global Exception Handling (\`IExceptionHandler\`)

In modern ASP.NET Core 8 and 9, the legacy \`UseExceptionHandler\` middleware lambda is replaced with strongly-typed **\`IExceptionHandler\`** and standardized **RFC 7807 \`ProblemDetails\`**:

\`\`\`csharp
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

        var (statusCode, title, detail) = exception switch
        {
            DomainValidationException valEx => (StatusCodes.Status400BadRequest, "Validation Error", valEx.Message),
            EntityNotFoundException notFound => (StatusCodes.Status404NotFound, "Resource Not Found", notFound.Message),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized", "Access denied."),
            _ => (StatusCodes.Status500InternalServerError, "Internal Server Error", "An unexpected error occurred.")
        };

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path,
            Type = $"https://httpstatuses.com/{statusCode}"
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // Handled successfully!
    }
}
\`\`\`

#### Registration in \`Program.cs\`:
\`\`\`csharp
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler(); // Activates registered IExceptionHandler pipeline
\`\`\`

---

## 7. Common Anti-Patterns & Production Pitfalls

### Pitfall 1: Using Exceptions for Normal Business Control Flow
Exceptions are computationally expensive because the runtime captures the entire CPU stack frame, loads metadata symbols, and creates trace dictionaries.

\`\`\`csharp
// DISASTER: 100x-1000x slower due to stack frame capture!
public bool UserExists(string username)
{
    try
    {
        _database.GetUser(username); // Throws UserNotFoundException if missing
        return true;
    }
    catch (UserNotFoundException)
    {
        return false;
    }
}

// OPTIMIZED: Return Result or Option / Null
public bool UserExistsOptimized(string username)
{
    return _database.FindUser(username) != null;
}
\`\`\`

### Pitfall 2: \`async void\` Methods Swallowing Unhandled Exceptions
In C#, \`async void\` methods (unlike \`async Task\`) do not return a task object that can be observed. If an unhandled exception occurs inside an \`async void\` method, it is posted directly to the \`SynchronizationContext\` or ThreadPool, **crashing the entire ASP.NET Core process instantly**:

\`\`\`csharp
// CATASTROPHIC: Unhandled exception crashes the entire .NET process!
public async void FireAndForgetNotification()
{
    await _emailClient.SendAsync(); // If this throws, process terminates!
}

// CORRECT: Always return Task, or catch inside
public async Task FireAndForgetNotificationSafeAsync()
{
    try
    {
        await _emailClient.SendAsync();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Background notification failed.");
    }
}
\`\`\`

---

## 8. Master Comparison Matrix

| Mechanism | Cleanup Nature | Async Non-Blocking | GC Generation Impact | Primary Architectural Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **\`IDisposable\`** | Synchronous deterministic | No (Blocks thread) | Promotes to Gen 0 reclamation if suppressed | In-memory streams, timers, lock releases |
| **\`IAsyncDisposable\`** | Asynchronous deterministic | **Yes (\`ValueTask\`)** | Promotes to Gen 0 reclamation if suppressed | Network I/O, database transactions, gRPC |
| **\`SafeHandle\`** | OS handle wrapper | No (Deterministic OS close) | Managed wrapper reclaimed in Gen 0 | Native file/process OS kernel handles |
| **\`Finalizer (~Class)\`** | Non-deterministic fallback | No (Finalizer Thread) | **Demotes to Gen 1/2 (High GC penalty)** | Raw unmanaged \`IntPtr\` memory pointers |
| **\`Result<T, E>\`** | Functional error propagation | N/A | **Zero GC allocations (readonly struct)** | Domain validations, expected business errors |`,
  content_fa: `## ۱. سیر تکامل و چرایی مدیریت ساخت‌یافته منابع

در زبان‌های C و C++، مدیریت خطاها بر پایه کدهای بازگشتی عددی (\`HRESULT\` یا status codes) و آزادسازی دستی حافظه استوار بود:

\`\`\`c
// مدیریت سنتی خطاها و منابع در C
FILE* file = fopen("data.bin", "rb");
if (file == NULL) return ERR_NOT_FOUND;

if (!ProcessHeader(file)) {
    fclose(file); // نیاز به بستن دستی فایل در تک‌تک خروجی‌های متد!
    return ERR_INVALID_HEADER;
}
fclose(file);
\`\`\`

این رویکرد دو چالش بزرگ ایجاد می‌کرد:
۱. **نشت شدید منابع سیستم (Resource Leaks)**: در صورت بروز خطای پیش‌بینی نشده میان تخصیص و آزادسازی منبع (مانند Handle فایل، پورت سوکت یا ارتباط دیتابیس)، خطوط پاکسازی اجرا نشده و سیستم‌عامل دچار قفل منابع می‌شد.
۲. **نادیده گرفتن خطاها**: برنامه‌نویسان اغلب بررسی کدهای خطا را فراموش می‌کردند که منجر به ادامه اجرای برنامه در وضعیت خراب می‌شد.

دات‌نت با ترکیب **مدیریت ساخت‌یافته استثناها (SEH)** و **الگوی IDisposable / IAsyncDisposable**، پاکسازی قطعی منابع را در کنار Garbage Collector فراهم ساخت.

---

## ۲. معماری داخلی رانتایم CLR: مدل دو فازی مدیریت استثناها (Two-Pass Model)

![CLR Exception Pipeline and IDisposable Lifecycle](/images/roadmaps/csharp-exceptions-idisposable.jpg)

رانتایم CLR مدیریت خطاها را در دو مرحله مجزا انجام می‌دهد:

### فاز ۱: مرحله جستجو (Search Phase بدون پشته‌زدایی)
۱. با پرتاب استثنا (\`throw\`)، CLR پشته فراخوانی (Call Stack) را برای یافتن بلوک \`catch\` منطبق پیمایش می‌کند.
۲. در صورت وجود **فیلتر استثنا** (\`catch (...) when (...)\`)، کامپایلر شرط فیلتر را **دقیقاً در همان لحظه و بدون دستکاری یا باز کردن پشته (Stack Unwinding)** ارزیابی می‌کند!
۳. تمامی متغیرهای محلی و فریم‌های پشته در این مرحله ۱۰۰٪ دست‌نخورده باقی می‌مانند که امکان بررسی دقیق وضعیت در لاگ‌ها و Crash Dumpها را فراهم می‌سازد.

### فاز ۲: مرحله پشته‌زدایی (Unwind Phase)
۱. پس از پیدا شدن هندلر مناسب، پشته فراخوانی باز شده و تمامی بلوک‌های **\`finally\`** و **\`using\`** در طول مسیر به ترتیب معکوس اجرا می‌شوند.
۲. در پایان، کنترل اجرای برنامه به بدنه بلوک \`catch\` مقصد منتقل می‌گردد.

### مزیت کلیدی Exception Filters با عبارت \`when\`:
در نسخه‌های قدیمی C#، فیلتر کردن خطا داخل بلوک \`catch\` با شرط \`if\` انجام و با \`throw;\` مجدداً پرتاب می‌شد که باعث از بین رفتن اطلاعات پشته قبل از ارزیابی شرط می‌گردید. استفاده از \`when\` این مشکل را به کلی ریشه‌کن کرده است:

\`\`\`csharp
try
{
    await httpClient.GetAsync(url);
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    // ارزیابی در فاز اول در حالی که فریم پشته کاملاً دست‌نخورده است!
    _logger.LogWarning("آدرس مورد نظر یافت نشد.");
}
\`\`\`

---

## ۳. سازوکار انتشار خطا: مقایسه \`throw\`، \`throw ex\` و \`ExceptionDispatchInfo\`

حفظ دقیق ردپای پشته (Stack Trace) برای ریشه‌یابی باگ‌ها در محیط پروداکشن حیاتی است:

\`\`\`csharp
try
{
    await _paymentService.ChargeAsync(order);
}
catch (PaymentException ex)
{
    // ۱. فاجعه‌بار: throw ex تاریخچه StackTrace را پاک کرده و به این خط ریست می‌کند!
    // throw ex;

    // ۲. استاندارد: throw; تمام تاریخچه و خط وقوع خطای اصلی را حفظ می‌کند.
    // throw;

    // ۳. پیشرفته: ثبت استثنا جهت پرتاب مجدد در نخ‌ها یا پایپ‌لاین‌های دیگر
    ExceptionDispatchInfo.Capture(ex).Throw();
}
\`\`\`

---

## ۴. مدیریت منابع و صف‌های Finalizer در رانتایم CLR

حافظه در دات‌نت توسط Garbage Collector مدیریت می‌شود. با این حال GC صرفاً حافظه اشیای دات‌نت (Managed Heap) را می‌شناسد و اطلاعی از **منابع سیستمی غیرمدیریت‌شده (Unmanaged Resources)** ندارد:
- Handle فایل‌ها و پروسه‌ها در سیستم‌عامل
- سوکت‌ها و کانکشن‌های شبکه TCP
- ارتباطات دیتابیس
- حافظه‌های رزرو شده با \`Marshal.AllocHGlobal\`

### صف‌های Finalization Queue و F-Reachable Queue:
زمانی که کلاسی دارای Finalizer (\`~MyClass()\`) باشد:
۱. در زمان ساخت شیء، اشاره‌گر آن در **Finalization Queue** قرار می‌گیرد.
۲. در زمان اجرای GC در نسل صفر (Gen 0)، شیء به دلیل داشتن Finalizer **آزاد نمی‌شود**، بلکه به **F-Reachable Queue** منتقل می‌گردد.
۳. در نتیجه، شیء به **نسل‌های بالاتر (Gen 1 یا Gen 2)** ترفیع می‌یابد!
۴. یک نخ پس‌زمینه با اولویت پایین (Finalizer Thread) متد مخرب را صدا می‌زند و رم شیء در چرخه‌های بعدی GC آزاد می‌شود که فشار سنگینی بر رم و CPU وارد می‌کند.

### ضرورت متد \`GC.SuppressFinalize(this)\`:
هنگامی که متد \`Dispose()\` توسط برنامه‌نویس فراخوانی می‌شود، دستور \`GC.SuppressFinalize(this)\` شیء را بلافاصله از صف Finalization حذف می‌کند تا در همان نسل صفر (Gen 0) به طور کامل از رم آزاد شود و وارد نسل‌های بالاتر نشود.

---

## ۵. پیاده‌سازی کامل و مدرن الگوی Dispose Pattern (همگام و ناهمگام)

\`\`\`csharp
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

public class HighPerformanceFileManager : IDisposable, IAsyncDisposable
{
    private MemoryStream? _bufferedStream;
    private SafeFileHandle? _safeHandle;
    private IntPtr _unmanagedBuffer;
    private int _disposedState; // 0 = فعال، 1 = آزادشده

    public HighPerformanceFileManager(string path)
    {
        _bufferedStream = new MemoryStream();
        _unmanagedBuffer = Marshal.AllocHGlobal(4096);
        _safeHandle = File.OpenHandle(path, FileMode.OpenOrCreate, FileAccess.ReadWrite);
    }

    // پیاده‌سازی همگام (IDisposable)
    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this); // حذف از صف Finalizer!
    }

    protected virtual void Dispose(bool disposing)
    {
        if (Interlocked.Exchange(ref _disposedState, 1) != 0) return;

        if (disposing)
        {
            // آزادسازی اشیای Managed
            _bufferedStream?.Dispose();
            _safeHandle?.Dispose();
        }

        // آزادسازی حافظه Unmanaged (همیشه اجرا می‌شود)
        if (_unmanagedBuffer != IntPtr.Zero)
        {
            Marshal.FreeHGlobal(_unmanagedBuffer);
            _unmanagedBuffer = IntPtr.Zero;
        }
    }

    // پیاده‌سازی ناهمگام (IAsyncDisposable)
    public async ValueTask DisposeAsync()
    {
        await DisposeAsyncCore().ConfigureAwait(false);
        Dispose(disposing: false);
        GC.SuppressFinalize(this);
    }

    protected virtual async ValueTask DisposeAsyncCore()
    {
        if (Interlocked.Exchange(ref _disposedState, 1) != 0) return;

        if (_bufferedStream != null)
        {
            await _bufferedStream.DisposeAsync().ConfigureAwait(false);
            _bufferedStream = null;
        }
    }

    ~HighPerformanceFileManager()
    {
        Dispose(disposing: false);
    }
}
\`\`\`

---

## ۶. مدیریت یکپارچه خطاها در ASP.NET Core 8/9 با \`IExceptionHandler\`

در دات‌نت ۸ و ۹، اینترفیس رسمی **\`IExceptionHandler\`** به همراه استاندارد RFC 7807 (\`ProblemDetails\`) معرفی شده است:

\`\`\`csharp
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) => _logger = logger;

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "خطای رخ‌داده: {Message}", exception.Message);

        var (statusCode, title) = exception switch
        {
            KeyNotFoundException => (StatusCodes.Status404NotFound, "یافت نشد"),
            ArgumentException => (StatusCodes.Status400BadRequest, "پارامتر نامعتبر"),
            _ => (StatusCodes.Status500InternalServerError, "خطای داخلی سرور")
        };

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = exception.Message,
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}
\`\`\`

---

## ۷. خطاهای رایج پروداکشن و الگوهای ضدکارایی (Anti-Patterns)

### ۱. استفاده از Exception برای کنترل جریان عادی بیزینس (Control Flow):
پرتاب استثنا به دلیل ثبت فریم‌های CPU و متادیتای سیستم، بین ۱۰۰ تا ۱۰۰۰ برابر کندتر از بازگرداندن مقادیر عادی است. برای جریان‌های نرمال از الگوی **Result Pattern** استفاده کنید.

### ۲. متدهای \`async void\` و کرش ناگهانی پروسس:
اگر در یک متد \`async void\` استثنا پرتاب شود، کدهای فراخواننده نمی‌توانند آن را با \`try-catch\` مدیریت کنند و کل پروسس وب‌سرویس بلافاصله Crash می‌کند. همواره از \`async Task\` استفاده نمایید.

---

## ۸. ماتریس مقایسه سازوکارهای مدیریت منابع و خطاها

| سازوکار | ماهیت آزادسازی | عملکرد ناهمگام (Async) | تاثیر بر نسل‌های GC | سناریوی کاربرد اصلی |
| :--- | :--- | :--- | :--- | :--- |
| **\`IDisposable\`** | قطعی و همگام | خیر (Thread مسدود می‌شود) | آزادسازی مستقیم در Gen 0 با Suppress | استریم‌های حافظه، تایمرها، قفل‌ها |
| **\`IAsyncDisposable\`** | قطعی و ناهمگام | **بله با \`ValueTask\`** | آزادسازی مستقیم در Gen 0 با Suppress | کانکشن‌های دیتابیس، سوکت‌ها، gRPC |
| **\`SafeHandle\`** | کپسوله Handle سیستم‌عامل | خیر (بستن قطعی OS Handle) | آزادسازی مستقیم در Gen 0 | پوینترهای فایل، پروسس و رم سیستم‌عامل |
| **\`Finalizer (~Class)\`** | غیرقطعی و با تاخیر | خیر (روی Finalizer Thread) | **ترفیع مخرب به Gen 1/2 و تاخیر GC** | اشاره‌گرهای خام \`IntPtr\` غیرمدیریت‌شده |
| **\`Result<T, E>\`** | بازگرداندن وضعیت خطا | غیرقابل کاربرد | **صفر تخصیص حافظه (struct)** | اعتبارسنجی‌های دامین و خطاهای نرمال بیزینس |`,
};
