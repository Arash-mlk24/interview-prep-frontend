import { RoadmapTopic } from "../../../models";

export const concurrencyChannelsMemoryTopic: RoadmapTopic = {
  id: "topic-dotnet-concurrency-channels-memory",
  stepId: "step-lld-clean-ddd",
  slug: "csharp-concurrency-channels-memory",
  order: 1,
  title: "C# High-Throughput Primitives: Channels, ThreadPool & Low-Allocation Memory",
  title_fa: "همروندی پیشرفته در دات‌نت: System.Threading.Channels، مدیریت ThreadPool و تخصیص حافظه نزدیک به صفر",
  summary:
    "Master high-throughput producer-consumer pipelines with System.Threading.Channels, prevent catastrophic ThreadPool starvation, optimize async fast-paths with ValueTask, and eliminate GC pressure using Span<T> and ArrayPool<T>.",
  summary_fa:
    "تسلط بر پایپ‌لاین‌های با توان پردازشی بالا با Channels در سی‌شارپ، پیشگیری از قفل‌شدگی ThreadPool، بهینه‌سازی مسیرهای همگام سریع با ValueTask و حذف سربار Garbage Collector با استفاده از Span و ArrayPool.",
  readingTimeMinutes: 35,
  difficulty: "senior",
  content: `## 1. High-Throughput Concurrency in Modern .NET

In modern high-scale distributed backend systems (handling 50,000 to 200,000+ requests per second), traditional multithreading and locking primitives quickly become the primary performance bottleneck:

\`\`\`
[Naive Locking: lock(obj) / SemaphoreSlim]
 Thread 1 ──► [Locked Critical Section] ──► Thread 1 Exits
 Thread 2 ──► [BLOCKED / Context Switch] ──► High CPU Overhead
 Thread 3 ──► [BLOCKED / Context Switch] ──► Latency Spikes (Tail Latency)

[Lock-Free Async Channels: System.Threading.Channels]
 Producers ──► [Lock-Free Ring Buffer / Concurrent Queue] ──► Consumers
 (Non-blocking WriteAsync)                                (Non-blocking ReadAsync via ThreadPool)
\`\`\`

### The Flaws of Traditional Concurrency Primitives:
1. **\`lock\` / \`Monitor\`:** Synchronous blocking primitives that halt OS threads, causing expensive kernel context switches (~$1-2\\;\\mu s$ per switch) and preventing threads from returning to the ThreadPool.
2. **\`BlockingCollection<T>\`:** Built on synchronous blocking waits (\`Take()\` blocks the calling thread). Under heavy async loads, it quickly starves the .NET ThreadPool.
3. **\`ConcurrentQueue<T>\`:** While thread-safe and lock-free (using Compare-And-Swap CAS loops), it lacks **asynchronous signaling** (forcing consumers to busy-spin or use polling timers) and provides **no backpressure mechanisms**.

To solve these architectural challenges, .NET provides **\`System.Threading.Channels\`**, **\`ValueTask<T>\`**, and low-allocation memory types (**\`Span<T>\`**, **\`Memory<T>\`**, **\`ArrayPool<T>\`**).

---

## 2. Deep Dive: \`System.Threading.Channels\`

\`System.Threading.Channels\` is an asynchronous, high-performance, lock-free producer-consumer library designed specifically for asynchronous pipelines. It completely decouples data producers from data consumers.

![System.Threading.Channels Pipeline Architecture](/images/roadmaps/channels-concurrency-flow.jpg)

### 2.1 Channel Architecture & Separation of Concerns
A \`Channel<T>\` separates ingestion from consumption into two distinct abstract types:
- **\`ChannelWriter<T>\`:** Exposes methods to push data (\`WriteAsync\`, \`TryWrite\`, \`Complete\`).
- **\`ChannelReader<T>\`:** Exposes methods to consume data (\`ReadAsync\`, \`TryRead\`, \`WaitToReadAsync\`, \`ReadAllAsync\`).

This separation enforces clean architectural boundaries: you can inject \`ChannelWriter<T>\` into your API Controllers / Webhooks and inject \`ChannelReader<T>\` into background worker services (\`BackgroundService\`).

### 2.2 Bounded vs. Unbounded Channels & Backpressure

| Feature | Unbounded Channel | Bounded Channel |
| :--- | :--- | :--- |
| **Creation** | \`Channel.CreateUnbounded<T>()\` | \`Channel.CreateBounded<T>(capacity)\` |
| **Capacity** | Infinite (grows until system RAM is exhausted) | Fixed maximum item count (e.g., 5,000 items) |
| **Backpressure** | ❌ None (Dangerous under traffic spikes) | ✅ Full control via \`BoundedChannelFullMode\` |
| **Memory Safety** | ⚠️ High risk of \`OutOfMemoryException\` (OOM) | 🛡️ Protected against memory blowups |

#### Backpressure Strategies with \`BoundedChannelFullMode\`:

\`\`\`csharp
var options = new BoundedChannelOptions(capacity: 10_000)
{
    FullMode = BoundedChannelFullMode.Wait, // Strategy when buffer is full
    SingleWriter = false,                  // Multiple concurrent API requests producing
    SingleReader = true,                   // Single dedicated background consumer
    AllowSynchronousContinuations = false  // Prevents consumer from running on producer's thread
};

Channel<OrderEvent> channel = Channel.CreateBounded<OrderEvent>(options);
\`\`\`

1. **\`BoundedChannelFullMode.Wait\` (Recommended for Critical Data):**
   - When the channel reaches 10,000 items, \`await writer.WriteAsync(item)\` asynchronously pauses the producer without blocking any OS thread.
   - Once the consumer frees space, the producer resumes. This applies natural backpressure all the way up to HTTP clients (e.g., slowing down request ingestion or triggering HTTP 429 / 503).
2. **\`BoundedChannelFullMode.DropOldest\`:**
   - Discards the oldest queued item to make room for the newest. Ideal for real-time telemetry, IoT sensor feeds, or live financial ticker quotes where only the latest state matters.
3. **\`BoundedChannelFullMode.DropNewest\`:**
   - Discards the newest incoming item if the buffer is full.
4. **\`BoundedChannelFullMode.DropWrite\`:**
   - Drops the item currently being written and returns immediately.

### 2.3 SingleReader & SingleWriter Optimizations
When configuring channels, always benchmark your consumer/producer topology:
- **\`SingleWriter = true\`:** The runtime activates a specialized lock-free queue that avoids atomic interlocked operations on writes.
- **\`SingleReader = true\`:** Guarantees that only one thread reads at a time, eliminating CAS contention on the reader pointer and achieving up to **2.5x higher throughput**.

### 2.4 Consuming with \`IAsyncEnumerable\` and \`ReadAllAsync\`

\`\`\`csharp
public class OrderProcessingWorker : BackgroundService
{
    private readonly ChannelReader<OrderEvent> _reader;
    private readonly ILogger<OrderProcessingWorker> _logger;

    public OrderProcessingWorker(ChannelReader<OrderEvent> reader, ILogger<OrderProcessingWorker> logger)
    {
        _reader = reader;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // ReadAllAsync natively streams data via IAsyncEnumerable<T>
        // and gracefully exits when channel.Writer.Complete() is called
        await foreach (OrderEvent order in _reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessOrderAsync(order, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process order {OrderId}", order.Id);
            }
        }
    }

    private async Task ProcessOrderAsync(OrderEvent order, CancellationToken ct)
    {
        // Business logic
        await Task.Delay(10, ct);
    }
}
\`\`\`

---

## 3. The .NET ThreadPool & ThreadPool Starvation

The .NET ThreadPool manages a pool of worker threads to execute CPU-bound and asynchronous I/O completion callbacks efficiently without the massive overhead of creating and destroying OS threads ($1\text{ MB}$ stack allocation per thread).

![.NET ThreadPool Internals & Work-Stealing Architecture](/images/roadmaps/threadpool-architecture.jpg)

### 3.1 ThreadPool Internals: Work-Stealing & Hill Climbing
- **Global Queue vs. Local Queues:** Top-level work items go to the Global Queue (FIFO). Continuations scheduled by a running thread go to that thread's **Local Queue (LIFO)** for high CPU cache locality.
- **Work-Stealing Algorithm:** If a thread empties its local queue, it steals work from the tail of another thread's local queue (FIFO order), maximizing multi-core throughput.
- **Hill-Climbing Algorithm:** The CLR monitors throughput and CPU usage every few milliseconds. If throughput increases when adding a thread, it injects more threads; if throughput drops or context switching saturates CPU cores, it scales down.

---

### 3.2 ThreadPool Starvation: The "Silent Killer"

**ThreadPool Starvation** is a catastrophic condition where all available worker threads in the pool are synchronously blocked, leaving zero threads to process incoming requests or complete asynchronous I/O continuations.

\`\`\`
[Sync-Over-Async Trap]
Thread 1: var result = GetDataAsync().Result; // BLOCKS Thread 1 waiting for I/O
Thread 2: var user = GetUserAsync().Result;   // BLOCKS Thread 2 waiting for I/O
...
Thread N: All N threads in Pool are BLOCKED!

[I/O Completes in Kernel/Socket Driver]
-> Socket callback needs a ThreadPool thread to resume GetDataAsync continuation!
-> BUT NO THREADS ARE AVAILABLE!
-> Deadlock / Starvation Cascade!
\`\`\`

#### Why ThreadPool Starvation Destroys Throughput:
When the ThreadPool detects starvation, its injection rate drops to a conservative recovery mode: **it injects only ~1-2 new threads every 500 milliseconds (500ms injection penalty)**.

If your system receives 2,000 req/sec and 50 threads become blocked on \`.Result\` or \`Task.Wait()\`:
1. Request queue explodes from 50 to 5,000 items in 2.5 seconds.
2. HTTP requests time out (Gateway Timeout 504).
3. **The paradox:** The CPU utilization drops to ~5-15% while the application is completely unresponsive!

#### Root Causes of Starvation:
1. **Sync-over-Async:** Calling \`.Result\`, \`.Wait()\`, \`.GetAwaiter().GetResult()\`, or \`Task.WaitAll()\` on incomplete Tasks.
2. **Blocking Synchronous I/O in Handlers:** Calling \`Thread.Sleep()\`, synchronous \`File.ReadAllText()\`, or blocking ADO.NET/Dapper calls on ThreadPool threads.
3. **Excessive Long-Running Operations without \`TaskCreationOptions.LongRunning\`:** Long-running \`while(true)\` loops scheduled via \`Task.Run()\` occupying worker threads permanently.

#### Diagnosing Starvation in Production:
Use .NET CLI diagnostic tools to observe the ThreadPool under load:
\`\`\`bash
dotnet-counters monitor --process-id <PID> --counters System.Runtime
\`\`\`
Look for:
- \`ThreadPool Worker Thread Count\`: Ramping up continuously (e.g. 50 -> 100 -> 300).
- \`ThreadPool Queue Length\`: Non-zero and spiking into thousands.
- \`CPU Usage\`: Low despite massive latency.

---

## 4. Zero-Allocation Async with \`ValueTask<T>\`

Every time you instantiate a standard \`Task<T>\`, you allocate an object on the Managed Heap ($\approx 64-128\\text{ bytes}$ for object header, method table pointer, fields, plus the async state machine boxing). In high-frequency code paths (e.g., executing 1,000,000 cache lookups per minute), this creates enormous Garbage Collection (GC) Gen 0 churn.

\`\`\`mermaid
flowchart TD
    subgraph TaskAllocation["Task&lt;T&gt; (Heap Object)"]
        T1["Heap Object Header (16 bytes)"]
        T2["Method Table Pointer (8 bytes)"]
        T3["Result & Continuation Fields (40+ bytes)"]
        T4["GC Pressure: Gen 0 Collects Repeatedly"]
    end

    subgraph ValueTaskStruct["ValueTask&lt;T&gt; (Stack-Allocated Struct)"]
        V1["Discriminator / Result Field (T)"]
        V2["_obj: Null if synchronous, Task/IValueTaskSource if async"]
        V3["Zero Heap Allocation on Synchronous Fast Path!"]
    end
\`\`\`

### 4.1 When to Use \`ValueTask<T>\`
Use \`ValueTask<T>\` (or \`ValueTask\`) **only when a method completes synchronously in 90%+ of invocations**.

Classic scenario: **In-Memory Caching (Cache-Aside Fast-Path)**:

\`\`\`csharp
public class UserCacheService
{
    private readonly IMemoryCache _cache;
    private readonly IUserRepository _repository;

    public UserCacheService(IMemoryCache cache, IUserRepository repository)
    {
        _cache = cache;
        _repository = repository;
    }

    public ValueTask<UserProfile?> GetUserProfileAsync(int userId, CancellationToken ct = default)
    {
        // FAST PATH: Synchronous cache hit -> 0 Heap Allocations!
        if (_cache.TryGetValue(userId, out UserProfile? cachedProfile))
        {
            return new ValueTask<UserProfile?>(cachedProfile);
        }

        // SLOW PATH: Asynchronous DB / Network call -> Delegates to Task<T>
        return new ValueTask<UserProfile?>(LoadFromDbAndCacheAsync(userId, ct));
    }

    private async Task<UserProfile?> LoadFromDbAndCacheAsync(int userId, CancellationToken ct)
    {
        UserProfile? profile = await _repository.FindByIdAsync(userId, ct);
        if (profile != null)
        {
            _cache.Set(userId, profile, TimeSpan.FromMinutes(10));
        }
        return profile;
    }
}
\`\`\`

### 4.2 The Dangerous "Gotchas" of \`ValueTask\`
Because \`ValueTask\` can wrap a reusable \`IValueTaskSource\`, breaking its usage contracts results in memory corruption, race conditions, or runtime exceptions:

> [!CAUTION]
> **The 3 Golden Rules of ValueTask:**
> 1. **Never \`await\` a \`ValueTask\` more than once:** An \`IValueTaskSource\` can be returned to an internal object pool immediately upon completion of the first \`await\`. A second \`await\` will inspect recycled memory!
> 2. **Never run concurrent \`await\`s on a single \`ValueTask\`:** Do not use \`Task.WhenAll\` or \`Task.WhenAny\` directly with \`ValueTask\` (convert with \`.AsTask()\` first).
> 3. **Never call \`.GetAwaiter().GetResult()\` before it has completed:** Always \`await\` it or check \`.IsCompletedSuccessfully\`.

---

## 5. Low-Allocation Memory: \`Span<T>\`, \`Memory<T>\` & \`ArrayPool<T>\`

Managing heap memory is the difference between an application that pauses for 200ms every 10 seconds during GC Gen 2 collections and an application that maintains smooth 99.9th percentile latencies under 5ms.

\`\`\`
[Traditional String Substring -> Heap Allocation]
Original String: "ORDER_ID:948294;AMOUNT:450"
subStr = text.Substring(9, 6) ──► Allocates NEW string "948294" on Heap!

[Zero-Allocation Span<T> -> Stack Slice]
Original String: "ORDER_ID:948294;AMOUNT:450"
spanSlice = text.AsSpan(9, 6) ──► Pointer + Length pointing directly into original memory!
                                (0 Heap Allocations, 0 GC Pressure)
\`\`\`

### 5.1 \`Span<T>\` vs. \`Memory<T>\`

| Feature | \`Span<T>\` / \`ReadOnlySpan<T>\` | \`Memory<T>\` / \`ReadOnlyMemory<T>\` |
| :--- | :--- | :--- |
| **Type** | \`ref struct\` (Stack-only) | Normal \`struct\` (Can live on Heap) |
| **Heap Storage** | ❌ Forbidden (Cannot be in class fields or boxed) | ✅ Allowed (Can be stored in class fields) |
| **Async Methods** | ❌ Forbidden across \`await\` boundaries | ✅ Fully supported across \`await\` calls |
| **Performance** | Maximum speed (Direct pointer arithmetic via JIT) | Slight indirection, but highly optimized |

#### Why \`Span<T>\` cannot cross \`await\` points:
An \`async\` method is transformed by the Roslyn compiler into an **async state machine \`struct\`/\`class\`** that resides on the Managed Heap when paused across an \`await\`. Because \`Span<T>\` is a \`ref struct\` that must always reside on the Thread Stack, the compiler enforces a compile-time error (\`CS4007\`) if a \`Span<T>\` is held across an \`await\`.

**The Solution:** Use \`Memory<T>\` across \`await\` boundaries and convert to \`.Span\` inside synchronous execution blocks:

\`\`\`csharp
public async Task ProcessNetworkPayloadAsync(ReadOnlyMemory<byte> buffer)
{
    // Synchronous slicing with Span
    ReadOnlySpan<byte> header = buffer.Span.Slice(0, 16);
    int messageType = BinaryPrimitives.ReadInt32LittleEndian(header);

    // Asynchronous I/O using ReadOnlyMemory
    await SavePayloadToDiskAsync(buffer);
}
\`\`\`

---

### 5.2 \`ArrayPool<T>.Shared\` & Preventing Large Object Heap (LOH) Fragmentation
Any object larger than **85,000 bytes** is allocated directly on the **Large Object Heap (LOH)**. The LOH is not compacted by default during normal GC cycles; frequent allocations of large buffers cause fatal address space fragmentation and premature Gen 2 garbage collections.

\`\`\`csharp
public async Task ProcessLargeStreamAsync(Stream networkStream, int expectedSize)
{
    // Rent a reusable buffer from ArrayPool.Shared
    // Note: The rented buffer might be larger than 'expectedSize'!
    byte[] buffer = ArrayPool<byte>.Shared.Rent(expectedSize);

    try
    {
        int totalBytesRead = 0;
        while (totalBytesRead < expectedSize)
        {
            int read = await networkStream.ReadAsync(
                buffer.AsMemory(totalBytesRead, expectedSize - totalBytesRead)
            );
            if (read == 0) break;
            totalBytesRead += read;
        }

        // Process strictly the valid slice using Span
        ReadOnlySpan<byte> validData = buffer.AsSpan(0, totalBytesRead);
        ParseProtocolFrame(validData);
    }
    finally
    {
        // CRITICAL: Always return the buffer in a finally block!
        // clearArray: true wipes sensitive data (PII, tokens) from recycled memory
        ArrayPool<byte>.Shared.Return(buffer, clearArray: true);
    }
}
\`\`\`

---

## 6. End-to-End Architectural Example: High-Throughput Event Ingestion Engine

Below is a complete, production-ready ingestion pipeline processing 50,000 events/second using a bounded Channel, background consumer batching, and low-allocation memory pooling:

\`\`\`csharp
using System.Buffers;
using System.Threading.Channels;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public record TelemetryEvent(string DeviceId, long Timestamp, int MetricValue);

public interface ITelemetryIngestionService
{
    ValueTask<bool> TryIngestEventAsync(TelemetryEvent telemetry, CancellationToken ct = default);
}

public class ChannelTelemetryService : ITelemetryIngestionService
{
    private readonly Channel<TelemetryEvent> _channel;

    public ChannelTelemetryService(int capacity = 20_000)
    {
        var options = new BoundedChannelOptions(capacity)
        {
            FullMode = BoundedChannelFullMode.Wait,
            SingleWriter = false, // Concurrent HTTP ingest handlers
            SingleReader = true   // Single batching background worker
        };
        _channel = Channel.CreateBounded<TelemetryEvent>(options);
    }

    public ChannelReader<TelemetryEvent> Reader => _channel.Reader;

    public ValueTask<bool> TryIngestEventAsync(TelemetryEvent telemetry, CancellationToken ct = default)
    {
        // Fast path: Try non-blocking synchronous write first
        if (_channel.Writer.TryWrite(telemetry))
        {
            return new ValueTask<bool>(true);
        }

        // Slow path: Asynchronously wait for buffer space
        return WriteSlowAsync(telemetry, ct);
    }

    private async ValueTask<bool> WriteSlowAsync(TelemetryEvent telemetry, CancellationToken ct)
    {
        await _channel.Writer.WriteAsync(telemetry, ct);
        return true;
    }
}

public class TelemetryBatchProcessorWorker : BackgroundService
{
    private readonly ChannelTelemetryService _ingestionService;
    private readonly ILogger<TelemetryBatchProcessorWorker> _logger;
    private const int BatchSize = 500;

    public TelemetryBatchProcessorWorker(
        ChannelTelemetryService ingestionService, 
        ILogger<TelemetryBatchProcessorWorker> logger)
    {
        _ingestionService = ingestionService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Telemetry Batch Processor started.");
        var batch = new List<TelemetryEvent>(BatchSize);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Wait until data is available
                if (await _ingestionService.Reader.WaitToReadAsync(stoppingToken))
                {
                    // Drain up to BatchSize items from the channel
                    while (batch.Count < BatchSize && _ingestionService.Reader.TryRead(out var item))
                    {
                        batch.Add(item);
                    }

                    if (batch.Count > 0)
                    {
                        await FlushBatchToDatabaseAsync(batch, stoppingToken);
                        batch.Clear();
                    }
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing telemetry batch.");
            }
        }
    }

    private async Task FlushBatchToDatabaseAsync(List<TelemetryEvent> items, CancellationToken ct)
    {
        // Simulating batch write to database with zero allocation serialization
        byte[] buffer = ArrayPool<byte>.Shared.Rent(4096);
        try
        {
            // Serialize and flush to network / storage
            await Task.Delay(5, ct); // Simulated I/O
            _logger.LogDebug("Flushed {Count} telemetry events to DB.", items.Count);
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }
}
\`\`\`

---

## 7. Architectural Decision Matrix

| Scenario / Requirement | Recommended Primitive | Why? |
| :--- | :--- | :--- |
| **Asynchronous In-Memory Queue** | \`Channel<T>\` (Bounded) | Zero blocking, built-in backpressure, safe async producer-consumer. |
| **High-Frequency Read with Fast Cache** | \`ValueTask<T>\` | Zero heap allocation on synchronous cache hit path. |
| **String / Binary Parsing** | \`ReadOnlySpan<T>\` | Zero-copy sub-slicing without creating new heap strings/arrays. |
| **Buffers Across \`await\` Boundaries** | \`Memory<T>\` / \`ReadOnlyMemory<T>\` | Can safely live in the async state machine across await continuations. |
| **Large Short-Lived Byte Buffers (>85KB)** | \`ArrayPool<T>.Shared\` | Avoids Large Object Heap (LOH) Gen 2 fragmentation. |
| **Background Thread Dispatch** | \`ThreadPool.QueueUserWorkItem\` / \`Channel\` | Avoids creating manual \`Thread\` instances ($1\\text{ MB}$ stack overhead). |`,
  content_fa: `## ۱. چالش‌های همروندی در سیستم‌های با ترافیک بالا در دات‌نت

در سیستم‌های بک‌اند توزیع‌شده با مقیاس بالا (پردازش ۵۰,۰۰۰ تا بیش از ۲۰۰,۰۰۰ درخواست در ثانیه)، قفل‌ها و ساختارهای همروندی سنتی به سرعت به اصلی‌ترین گلوگاه عملکردی (Bottleneck) تبدیل می‌شوند:

\`\`\`
[قفل‌های سنتی: lock / SemaphoreSlim]
 Thread 1 ──► [ورود به بخش بحرانی] ──► اتمام و خروج
 Thread 2 ──► [مسدود / Context Switch] ──► سربار بالای CPU
 Thread 3 ──► [مسدود / Context Switch] ──► پرش ناگهانی Latency

[ساختارهای بدون قفل غیرهمگام: System.Threading.Channels]
 تولیدکننده‌ها ──► [Ring Buffer بدون قفل / صف همروند] ──► مصرف‌کننده‌ها
 (متد غیرمسدودکننده WriteAsync)                          (متد غیرمسدودکننده ReadAsync با ThreadPool)
\`\`\`

### معایب ساختارهای سنتی همروندی:
1. **دستور \`lock\` و کلاس \`Monitor\`:** این ابزارها نخ سیستم‌عامل (OS Thread) را به شکل سنکرون مسدود می‌کنند و باعث Context Switchهای سنگین در سطح هسته سیستم‌عامل ($1-2\\;\\mu s$) می‌شوند و نخ را تا زمان آزادسازی قفل معطل نگه می‌دارند.
2. **کلاس \`BlockingCollection<T>\`:** بر پایه متدهای مسدودکننده سنکرون (\`Take()\`) طراحی شده و تحت ترافیک‌های سنگین به سرعت باعث کمبود نخ در ThreadPool دات‌نت می‌شود.
3. **کلاس \`ConcurrentQueue<T>\`:** گرچه ذاتا Thread-Safe و بدون قفل است (با استفاده از حلقه‌های CAS)، اما فاقد مکانیزم ارسال سیگنال ناهمگام (Async Notification) بوده و هیچ قابلیتی برای اعمال **Backpressure** ندارد.

برای حل این مسائل بنیادین، دات‌نت مجموعه‌ای از ابزارهای سطح بالا شامل **\`System.Threading.Channels\`**، **\`ValueTask<T>\`** و ساختارهای حافظه بدون تخصیص اضافه (**\`Span<T>\`**، **\`Memory<T>\`** و **\`ArrayPool<T>\`**) را ارائه داده است.

---

## ۲. بررسی جامع: \`System.Threading.Channels\`

کتابخانه \`System.Threading.Channels\` یک ساختار داده ناهمگام، فوق‌سریع و بدون قفل (Lock-Free) برای سناریوهای Producer-Consumer است که فرآیند تولید داده را کاملاً از پردازش آن تفکیک می‌کند.

![معماری پایپ‌لاین System.Threading.Channels](/images/roadmaps/channels-concurrency-flow.jpg)

### ۲.۱ معماری کانال‌ها و تفکیک وظایف
هر \`Channel<T>\` از دو بخش کاملاً مجزا تشکیل شده است:
- **\`ChannelWriter<T>\`:** متدهایی مانند \`WriteAsync\`، \`TryWrite\` و \`Complete\` را برای نوشتن داده در صف فراهم می‌کند.
- **\`ChannelReader<T>\`:** متدهایی مانند \`ReadAsync\`، \`TryRead\`، \`WaitToReadAsync\` و \`ReadAllAsync\` را برای خواندن داده‌ها در اختیار مصرف‌کننده قرار می‌دهد.

این تفکیک اجازه می‌دهد \`ChannelWriter\` را به عنوان وابستگی درون کنترلرهای وب API تزریق کنید و \`ChannelReader\` را به ورکر سرویس‌های پس‌زمینه (\`BackgroundService\`) تحویل دهید.

### ۲.۲ مقایسه کانال‌های Bounded و Unbounded و مفهوم Backpressure

| ویژگی | کانال نامحدود (Unbounded) | کانال محدود (Bounded) |
| :--- | :--- | :--- |
| **نحوه ایجاد** | \`Channel.CreateUnbounded<T>()\` | \`Channel.CreateBounded<T>(capacity)\` |
| **ظرفیت** | نامحدود (تا جایی که رم سرور پر شود) | ظرفیت مشخص و ثابت (مثلاً ۵,۰۰۰ آیتم) |
| **مدیریت فشار (Backpressure)** | ❌ ندارد (خطرناک در ترافیک‌های جهشی) | ✅ کنترل کامل از طریق \`BoundedChannelFullMode\` |
| **امنیت حافظه** | ⚠️ احتمال بالای کرش سرور با خطای OOM | 🛡️ محافظت قطعی در برابر پر شدن حافظه |

#### استراتژی‌های مدیریت فشار با \`BoundedChannelFullMode\`:

\`\`\`csharp
var options = new BoundedChannelOptions(capacity: 10_000)
{
    FullMode = BoundedChannelFullMode.Wait, // استراتژی رفتار در زمان پر شدن بافر
    SingleWriter = false,                  // امکان نوشتن همزمان توسط ریکوئست‌های مختلف
    SingleReader = true,                   // مصرف داده توسط یک ورکر اختصاصی
    AllowSynchronousContinuations = false  // جلوگیری از اجرای مصرف‌کننده روی ترد تولیدکننده
};

Channel<OrderEvent> channel = Channel.CreateBounded<OrderEvent>(options);
\`\`\`

1. **استراتژی \`BoundedChannelFullMode.Wait\` (پیشنهاد استاندارد برای داده‌های مهم):**
   - وقتی تعداد آیتم‌های درون صف به ۱۰,۰۰۰ برسد، اجرای \`await writer.WriteAsync(item)\` بدون اشغال هیچ نخی در پس‌زمینه متوقف (Suspend) می‌شود.
   - به محض اینکه مصرف‌کننده فضایی خالی کند، تولیدکننده ادامه می‌دهد. این رفتار باعث اعمال فشار معکوس طبیعی تا سطح کلاینت وب (بازگرداندن خطای HTTP 429 یا 503 در صورت اشباع سرور) می‌شود.
2. **استراتژی \`BoundedChannelFullMode.DropOldest\`:**
   - قدیمی‌ترین آیتم صف را حذف می‌کند تا فضا برای آیتم جدید باز شود. بسیار مناسب برای داده‌های سنسورهای اینترنت اشیا (IoT) یا قیمت لحظه‌ای سهام و ارزها که فقط آخرین مقدار اهمیت دارد.
3. **استراتژی \`BoundedChannelFullMode.DropNewest\`:**
   - در صورت پر بودن ظرفیت، داده ورودی جدید را نادیده گرفته و رد می‌کند.
4. **استراتژی \`BoundedChannelFullMode.DropWrite\`:**
   - آیتمی که در حال تلاش برای نوشتن آن هستید را فوراً بدون ثبت در بافر دور می‌اندازد.

### ۲.۳ بهینه‌سازی‌های SingleReader و SingleWriter
هنگام ایجاد کانال، توپولوژی مصرف‌کننده و تولیدکننده را مشخص کنید:
- **\`SingleWriter = true\`:** دات‌نت از یک صف بدون قفل بهینه‌تر استفاده می‌کند که عملیات سنگین اتمیک بین پردازنده‌ها را کاهش می‌دهد.
- **\`SingleReader = true\`:** تضمین می‌کند که تنها یک نخ داده‌ها را می‌خواند؛ این کار تداخل رقابتی (CAS Contention) اشاره‌گر خواندن را حذف کرده و سرعت خواندن را تا **۲.۵ برابر** افزایش می‌دهد.

### ۲.۴ خواندن ساده و روان با \`ReadAllAsync\`

\`\`\`csharp
public class OrderProcessingWorker : BackgroundService
{
    private readonly ChannelReader<OrderEvent> _reader;
    private readonly ILogger<OrderProcessingWorker> _logger;

    public OrderProcessingWorker(ChannelReader<OrderEvent> reader, ILogger<OrderProcessingWorker> logger)
    {
        _reader = reader;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // מתد ReadAllAsync داده‌ها را به شکل IAsyncEnumerable استریم می‌کند
        // و با بسته شدن کانال به شکل خودکار و بدون پرتاب اکسپشن به کار خود پایان می‌دهد
        await foreach (OrderEvent order in _reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessOrderAsync(order, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در پردازش سفارش {OrderId}", order.Id);
            }
        }
    }

    private async Task ProcessOrderAsync(OrderEvent order, CancellationToken ct)
    {
        await Task.Delay(10, ct);
    }
}
\`\`\`

---

## ۳. معماری داخلی ThreadPool دات‌نت و پدیده ThreadPool Starvation

موتور ThreadPool در دات‌نت وظیفه مدیریت مجموعه‌ای از نخ‌های کارگر (Worker Threads) را برای اجرای تسک‌ها و بازخوانی‌های I/O ناهمگام بر عهده دارد تا از ساخت و نابودی مداوم نخ‌های سیستم‌عامل (که هر کدام ۱ مگابایت رم اشغال می‌کنند) جلوگیری شود.

![معماری داخلی ThreadPool و الگوریتم Work-Stealing](/images/roadmaps/threadpool-architecture.jpg)

### ۳.۱ سازوکار صف‌های محلی و الگوریتم Hill Climbing
- **صف سراسری (Global Queue) در برابر صف محلی (Local Queue):** تسک‌های سطح بالا وارد صف سراسری می‌شوند. اما وقتی یک نخ کارهای بعدی را زمان‌بندی می‌کند، آن‌ها را در **صف محلی خود (LIFO)** قرار می‌دهد تا داده‌ها در حافظه نهان CPU (Cache Locality) باقی بمانند.
- **الگوریتم دزدیدن کار (Work-Stealing):** اگر صف محلی یک نخ خالی شود، برای جلوگیری از بیکار ماندن پردازنده، تسک‌های انتهای صف نخ‌های دیگر را می‌دزدد و اجرا می‌کند.
- **الگوریتم Hill-Climbing:** موتور ران‌تایم هر چند میلی‌ثانیه توان عملیاتی کل برنامه را اندازه می‌گیرد. اگر با اضافه کردن یک نخ توان پردازش بالا برود، تعداد نخ‌ها را زیاد می‌کند؛ اما اگر اضافه کردن نخ باعث افزایش درگیری CPU برای تعویض نخ‌ها (Context Switching) شود، تعداد آن‌ها را کاهش می‌دهد.

---

### ۳.۲ معضل قفل‌شدگی و گرسنگی نخ‌ها (ThreadPool Starvation)

**ThreadPool Starvation** شرایط بحرانی و کشنده‌ای است که در آن تمام نخ‌های فعال ThreadPool به صورت مسدود (Blocked) در انتظار اتمام یک عملیات معطل می‌مانند و هیچ نخی برای پاسخ به درخواست‌های جدید یا پردازش ادامه‌ کارهای ناهمگام باقی نمی‌ماند.

\`\`\`
[تله مسدودسازی Sync-Over-Async]
Thread 1: var result = GetDataAsync().Result; // نخ اول قفل شده و منتظر نتیجه دیتابیس است
Thread 2: var user = GetUserAsync().Result;   // نخ دوم قفل شده و منتظر شبکه است
...
Thread N: تمام نخ‌های موجود در ThreadPool مسدود شده‌اند!

[پاسخ شبکه از درایور سوکت بازمی‌گردد]
-> سیستم برای اجرای ادامه کدهای بعد از await به یک نخ از ThreadPool نیاز دارد!
-> اما هیچ نخی در صف در دسترس نیست!
-> بن‌بست کامل (Deadlock) و سقوط سرور!
\`\`\`

#### چرا ThreadPool Starvation باعث سقوط توان پردازشی می‌شود؟
هنگامی که ران‌تایم وضعیت Starvation را تشخیص می‌دهد، الگوریتم تزریق نخ جدید بسیار محافظه‌کارانه عمل کرده و **تنها هر ۵۰۰ میلی‌ثانیه ۱ نخ جدید اضافه می‌کند**.

اگر در سیستمی با ترافیک ۲,۰۰۰ درخواست در ثانیه، ۵۰ نخ به خاطر استفاده از \`.Result\` یا \`Task.Wait()\` مسدود شوند:
1. طول صف درخواست‌ها ظرف ۲.۵ ثانیه به بیش از ۵,۰۰۰ درخواست سرریز می‌کند.
2. کلاینت‌ها با خطای تایم‌اوت ۵۰۴ روبرو می‌شوند.
3. **پارادوکس عجیب:** در حالی که مصرف CPU کمتر از ۱۵٪ است، سرور به طور کامل قفل شده و پاسخ نمی‌دهد!

#### دلایل اصلی ایجاد Starvation:
1. **الگوی اشتباه Sync-over-Async:** فراخوانی \`.Result\`، \`.Wait()\` یا \`.GetAwaiter().GetResult()\` بر روی Taskهایی که هنوز کامل نشده‌اند.
2. **عملیات ورودی/خروجی مسدودکننده در کنترلرها:** استفاده از \`Thread.Sleep()\`، توابع همگام خواندن فایل (\`File.ReadAllText\`) یا فراخوانی‌های سنکرون پایگاه داده در خط لوله ناهمگام.
3. **اجرای کارهای طولانی‌مدت با \`Task.Run\`:** اجرای حلقه‌های طولانی چندساعته بدون استفاده از فلگ \`TaskCreationOptions.LongRunning\`.

#### شناسایی و پایش Starvation در محیط پروداکشن:
\`\`\`bash
dotnet-counters monitor --process-id <PID> --counters System.Runtime
\`\`\`
به شاخص‌های زیر دقت کنید:
- \`ThreadPool Worker Thread Count\`: افزایش مداوم تعداد نخ‌ها (مثلاً ۵۰ به ۱۰۰ به ۳۰۰).
- \`ThreadPool Queue Length\`: مقدار غیرصفر و در حال افزایش تا چند هزار.
- \`CPU Usage\`: مصرف پایین پردازنده علیرغم تاخیر فوق‌العاده بالا.

---

## ۴. کاهش تخصیص حافظه با \`ValueTask<T>\`

هر بار که یک شیء استاندارد \`Task<T>\` ساخته می‌شود، فضایی بین ۶۴ تا ۱۲۸ بایت روی Heap (شامل هدر شیء، متد تیبل و فیلدهای وضعیت) آلیکیت می‌شود. در حلقه‌ها و توابع پرتکرار، این امر باعث فشار شدید به Garbage Collector در نسل Gen 0 می‌شود.

\`\`\`mermaid
flowchart TD
    subgraph TaskAllocation["Task&lt;T&gt; (آلیکیشن روی Heap)"]
        T1["هدر شیء روی Heap (۱۶ بایت)"]
        T2["اشاره‌گر Method Table (۸ بایت)"]
        T3["فیلدهای وضعیت و نتیجه (۴۰+ بایت)"]
        T4["فشار مداوم به GC و توقف موقت برنامه"]
    end

    subgraph ValueTaskStruct["ValueTask&lt;T&gt; (استراکت روی Stack)"]
        V1["فیلد نتیجه مستقیم در حافظه سریع Stack"]
        V2["عدم درگیر شدن Heap در مسیرهای همگام سریع"]
        V3["صفر بایت حافظه Heap در Cache Hit!"]
    end
\`\`\`

### ۴.۱ چه زمان باید از \`ValueTask<T>\` استفاده کرد؟
تنها در صورتی از \`ValueTask<T>\` استفاده کنید که متد مورد نظر **در بیش از ۹۰٪ سناریوها به صورت همگام (Synchronous) بدون رفتن به I/O به پایان برسد**.

مثال کلاسیک: **سیستم کش درون‌حافظه‌ای (Cache-Aside Fast Path)**:

\`\`\`csharp
public class UserCacheService
{
    private readonly IMemoryCache _cache;
    private readonly IUserRepository _repository;

    public UserCacheService(IMemoryCache cache, IUserRepository repository)
    {
        _cache = cache;
        _repository = repository;
    }

    public ValueTask<UserProfile?> GetUserProfileAsync(int userId, CancellationToken ct = default)
    {
        // مسیر سریع و بدون آلیکیشن حافظه در صورت وجود در کش (Cache Hit)
        if (_cache.TryGetValue(userId, out UserProfile? cachedProfile))
        {
            return new ValueTask<UserProfile?>(cachedProfile);
        }

        // مسیر کند: واکشی از دیتابیس در صورت نیاز به I/O
        return new ValueTask<UserProfile?>(LoadFromDbAndCacheAsync(userId, ct));
    }

    private async Task<UserProfile?> LoadFromDbAndCacheAsync(int userId, CancellationToken ct)
    {
        UserProfile? profile = await _repository.FindByIdAsync(userId, ct);
        if (profile != null)
        {
            _cache.Set(userId, profile, TimeSpan.FromMinutes(10));
        }
        return profile;
    }
}
\`\`\`

### ۴.۲ خطاهای مرگبار در استفاده از \`ValueTask\`
چون \`ValueTask\` ممکن است یک اینترفیس \`IValueTaskSource\` بازیافتی را در بر بگیرد، عدم رعایت قوانین استفاده از آن منجر به خطاهای غیرمنتظره و فساد حافظه می‌شود:

> [!CAUTION]
> **۳ قانون حیاتی استفاده از ValueTask:**
> 1. **هرگز یک \`ValueTask\` را بیش از یک بار \`await\` نکنید:** پس از اولین بار، شیء زیرین ممکن است به Pool بازگردانده شده باشد.
> 2. **هرگز روی یک \`ValueTask\` متدهای همزمان مانند \`Task.WhenAll\` را مستقیماً اجرا نکنید:** ابتدا آن را با متد \`.AsTask()\` به یک تسک معمولی تبدیل کنید.
> 3. **هرگز فیلدی با نوع \`ValueTask\` را در یک کلاس نگهداری نکنید:** این استراکت باید بلافاصله مصرف شود.

---

## ۵. مدیریت بهینه حافظه: \`Span<T>\`، \`Memory<T>\` و \`ArrayPool<T>\`

مدیریت تخصیص‌های حافظه تفاوت اصلی میان برنامه‌ای است که هر ۱۰ ثانیه ۲۰۰ میلی‌ثانیه برای پاکسازی Garbage Collection فریز می‌شود، با برنامه‌ای که تاخیر زمانی زیر ۵ میلی‌ثانیه را تضمین می‌کند.

\`\`\`
[توابع سنتی رشته: Substring -> آلیکیشن روی Heap]
رشته اصلی: "ORDER_ID:948294;AMOUNT:450"
subStr = text.Substring(9, 6) ──► ساخت شیء جدید "948294" روی Heap و فشار به GC!

[برش بدون تخصیص حافظه با Span<T> روی Stack]
رشته اصلی: "ORDER_ID:948294;AMOUNT:450"
spanSlice = text.AsSpan(9, 6) ──► اشاره‌گر به همان بایت‌های اصلی بدون ۱ بایت آلیکیشن جدید!
\`\`\`

### ۵.۱ تفاوت بنیادین \`Span<T>\` و \`Memory<T>\`

| ویژگی | ساختار \`Span<T>\` | ساختار \`Memory<T>\` |
| :--- | :--- | :--- |
| **ماهیت** | از نوع \`ref struct\` (فقط روی Stack) | استراکت معمولی (امکان ذخیره روی Heap) |
| **ذخیره در فیلدهای کلاس** | ❌ غیرمجاز (امکان قرارگیری روی Heap ندارد) | ✅ مجاز |
| **استفاده در متدهای Async** | ❌ در طول عبور از دستورات \`await\` ممنوع است | ✅ به صورت کامل پشتیبانی می‌شود |
| **سرعت پردازش** | حداکثر کارایی با دسترسی مستقیم اشاره‌گر JIT | بسیار سریع با سطح انتزاع اندک |

#### چرا نمی‌توان \`Span<T>\` را از روی \`await\` عبور داد؟
هنگام اجرای متدهای ناهمگام، کامپایلر سی‌شارپ کدهای متد را به یک کلاس/استراکت State Machine تبدیل می‌کند که وضعیت آن در زمان معلق شدن روی Heap ذخیره می‌شود. چون نوع \`ref struct\` قانوناً حق قرار گرفتن روی Heap را ندارد، کامپایلر اجازه نگهداری \`Span\` در طول \`await\` را نمی‌دهد.

**راهکار:** استفاده از \`Memory<T>\` در متدهای ناهمگام و تبدیل آن به \`.Span\` در متدهای پردازشی همگام:

\`\`\`csharp
public async Task ProcessNetworkPayloadAsync(ReadOnlyMemory<byte> buffer)
{
    // استفاده از Span برای پردازش‌های همگام سریع
    ReadOnlySpan<byte> header = buffer.Span.Slice(0, 16);
    int messageType = BinaryPrimitives.ReadInt32LittleEndian(header);

    // ارسال ReadOnlyMemory به عنوان بافر I/O ناهمگام
    await SavePayloadToDiskAsync(buffer);
}
\`\`\`

---

### ۵.۲ استفاده از \`ArrayPool<T>.Shared\` و جلوگیری از تکه‌تکه‌شدن حافظه LOH
هر شیء با حجم بالاتر از **۸۵,۰۰۰ بایت** مستقیماً روی ناحیه **Large Object Heap (LOH)** ساخته می‌شود. از آنجا که این ناحیه در فرآیندهای معمول GC یکپارچه‌سازی (Compact) نمی‌شود، تخصیص مداوم بافرهای بزرگ بایت باعث فرگمنتیشن شدید حافظه و اجرای مداوم پاکسازی‌های سنگین Gen 2 می‌شود.

\`\`\`csharp
public async Task ProcessLargeStreamAsync(Stream networkStream, int expectedSize)
{
    // قرض گرفتن بافر آماده از استخر به جای ساخت آرایه جدید
    byte[] buffer = ArrayPool<byte>.Shared.Rent(expectedSize);

    try
    {
        int totalBytesRead = 0;
        while (totalBytesRead < expectedSize)
        {
            int read = await networkStream.ReadAsync(
                buffer.AsMemory(totalBytesRead, expectedSize - totalBytesRead)
            );
            if (read == 0) break;
            totalBytesRead += read;
        }

        // پردازش دقیق بخش پرشده با استفاده از Span
        ReadOnlySpan<byte> validData = buffer.AsSpan(0, totalBytesRead);
        ParseProtocolFrame(validData);
    }
    finally
    {
        // بسیار مهم: همیشه بافر را در بلوک finally به استخر بازگردانید!
        ArrayPool<byte>.Shared.Return(buffer, clearArray: true);
    }
}
\`\`\`

---

## ۶. پروژه نمونه پروداکشن: پایپ‌لاین دریافت تلمتری با ۵۰,۰۰۰ رویداد بر ثانیه

نمونه کد زیر یک موتور کامل اینجکشن ایونت را نشان می‌دهد که با ترکیب Channels، ورکر پردازش دسته‌ای (Batching) و استخر حافظه ArrayPool، داده‌ها را بدون درگیر کردن GC مدیریت می‌کند:

\`\`\`csharp
using System.Buffers;
using System.Threading.Channels;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public record TelemetryEvent(string DeviceId, long Timestamp, int MetricValue);

public interface ITelemetryIngestionService
{
    ValueTask<bool> TryIngestEventAsync(TelemetryEvent telemetry, CancellationToken ct = default);
}

public class ChannelTelemetryService : ITelemetryIngestionService
{
    private readonly Channel<TelemetryEvent> _channel;

    public ChannelTelemetryService(int capacity = 20_000)
    {
        var options = new BoundedChannelOptions(capacity)
        {
            FullMode = BoundedChannelFullMode.Wait,
            SingleWriter = false, // فراخوانی همزمان از سمت چند کنترلر API
            SingleReader = true   // مصرف متمرکز توسط یک ورکر بچ‌ساز
        };
        _channel = Channel.CreateBounded<TelemetryEvent>(options);
    }

    public ChannelReader<TelemetryEvent> Reader => _channel.Reader;

    public ValueTask<bool> TryIngestEventAsync(TelemetryEvent telemetry, CancellationToken ct = default)
    {
        // مسیر سریع: نوشتن همگام بدون معطلی در بافر
        if (_channel.Writer.TryWrite(telemetry))
        {
            return new ValueTask<bool>(true);
        }

        // مسیر ناهمگام در صورت پر بودن موقت صف
        return WriteSlowAsync(telemetry, ct);
    }

    private async ValueTask<bool> WriteSlowAsync(TelemetryEvent telemetry, CancellationToken ct)
    {
        await _channel.Writer.WriteAsync(telemetry, ct);
        return true;
    }
}

public class TelemetryBatchProcessorWorker : BackgroundService
{
    private readonly ChannelTelemetryService _ingestionService;
    private readonly ILogger<TelemetryBatchProcessorWorker> _logger;
    private const int BatchSize = 500;

    public TelemetryBatchProcessorWorker(
        ChannelTelemetryService ingestionService, 
        ILogger<TelemetryBatchProcessorWorker> logger)
    {
        _ingestionService = ingestionService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("سرویس پردازش دسته‌ای تلمتری آغاز به کار کرد.");
        var batch = new List<TelemetryEvent>(BatchSize);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // انتظار ناهمگام برای رسیدن داده
                if (await _ingestionService.Reader.WaitToReadAsync(stoppingToken))
                {
                    // خالی کردن سریع آیتم‌ها تا سقف اندازه بچ
                    while (batch.Count < BatchSize && _ingestionService.Reader.TryRead(out var item))
                    {
                        batch.Add(item);
                    }

                    if (batch.Count > 0)
                    {
                        await FlushBatchToDatabaseAsync(batch, stoppingToken);
                        batch.Clear();
                    }
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در پردازش بچ تلمتری.");
            }
        }
    }

    private async Task FlushBatchToDatabaseAsync(List<TelemetryEvent> items, CancellationToken ct)
    {
        // شبیه‌سازی سریالایز سریع با بافر بازیافتی از استخر حافظه
        byte[] buffer = ArrayPool<byte>.Shared.Rent(4096);
        try
        {
            await Task.Delay(5, ct); // شبیه‌سازی فراخوانی دیتابیس
            _logger.LogDebug("تعداد {Count} رکورد با موفقیت در دیتابیس ذخیره شد.", items.Count);
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }
}
\`\`\`

---

## ۷. ماتریس تصمیم‌گیری در معماری سیستم‌های دات‌نت

| سناریو یا نیازمندی | ابزار و ساختار پیشنهادی | دلیل انتخاب |
| :--- | :--- | :--- |
| **صف درون‌حافظه‌ای ناهمگام** | \`Channel<T>\` (محدود / Bounded) | عدم مسدودسازی نخ‌ها، مدیریت فشار معکوس و حذف قفل‌ها. |
| **خواندن پرتکرار با کش در رم** | \`ValueTask<T>\` | صفر بایت آلیکیشن روی Heap در صورت موفقیت خواندن از کش. |
| **پارس کردن داده‌های متنی و باینری** | \`ReadOnlySpan<T>\` | دسترسی و برش رشته‌ها بدون کپی کردن بایت‌ها. |
| **انتقال بافر از میان توابع ناهمگام** | \`Memory<T>\` / \`ReadOnlyMemory<T>\` | امکان ذخیره‌سازی در State Machine کدهای ناهمگام. |
| **بافرهای بزرگ بایت (>۸۵ کیلوبایت)** | \`ArrayPool<T>.Shared\` | جلوگیری از فرگمنتیشن ناحیه Large Object Heap و کاهش فشار GC. |`,
};
