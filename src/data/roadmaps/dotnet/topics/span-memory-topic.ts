import { RoadmapTopic } from "../../../models";

export const spanMemoryTopic: RoadmapTopic = {
  id: "topic-dotnet-span-memory",
  stepId: "step-csharp-memory-concurrency",
  slug: "span-memory-ref-struct",
  order: 1,
  title: "Span<T>, Memory<T>, ArrayPool<T> & Zero-Allocation Memory Engineering",
  title_fa: "ساختارهای صفر-تخصیص در سی‌شارپ: Span<T>، Memory<T>، ArrayPool<T> و قواعد ref struct",
  summary:
    "Master low-level zero-allocation memory primitives: Interior pointers, ref struct stack invariants, async boundary crossing with Memory<T>, SIMD SearchValues, and high-throughput ArrayPool buffer reuse.",
  summary_fa:
    "تسلط بر ساختارهای حافظه با تخصیص صفر: اشاره‌گرهای داخلی، قوانین ماندگاری ref struct روی استک، عبور امن از مرزهای Async با Memory<T>، پردازش وکتوری SIMD با SearchValues و استفاده مجدد از بافرها با ArrayPool.",
  readingTimeMinutes: 35,
  difficulty: "senior",
  content: `## 1. The Allocation Bottleneck in High-Throughput .NET Services

In high-throughput enterprise systems processing tens of thousands of requests per second ($50,000+\\text{ req/sec}$), traditional object and string allocations are the number one cause of latency spikes and CPU degradation:

\`\`\`
[Traditional Pipeline: Massive Transient Allocations]
Incoming Payload (10 KB) ──► string.Substring() ──► Allocates string 1 (Heap Gen 0)
                         ──► string.Split(',')  ──► Allocates string[] + 20 substrings (Heap Gen 0)
                         ──► byte[] buffer      ──► Allocates 10 KB array (Heap Gen 0 / LOH)
                                                 │
                                                 ▼
[Result: GC Pressure -> Stop-The-World Pauses -> P99 Latency Spikes (150ms+)]
\`\`\`

### 1.1 The Anatomy of Garbage Collection Overhead
1. **Gen 0 Budget Saturation:** Frequent small allocations rapidly exhaust the Generation 0 memory budget, forcing the CLR to trigger frequent Garbage Collection cycles.
2. **Stop-The-World (STW) Pauses:** During GC phases, application execution threads are suspended while the CLR traverses root references, sweeps unreachable memory, and compacts fragmented pages.
3. **LOH (Large Object Heap) Fragmentation:** Any byte array or object $\\ge 85,000\\text{ bytes}$ is allocated directly on the Large Object Heap. LOH is not compacted by default in standard GC runs, leading to severe virtual address space fragmentation and Out-Of-Memory (OOM) crashes.
4. **CPU Cache Thrashing:** Constantly allocating new objects pollutes CPU L1/L2/L3 caches with pointer chasing overhead rather than processing contiguous, cache-hot memory blocks.

To solve this, modern .NET introduced a unified, low-allocation memory hierarchy: **\`Span<T>\`**, **\`ReadOnlySpan<T>\`**, **\`Memory<T>\`**, and **\`ArrayPool<T>\`**.

---

## 2. Deep Dive: \`Span<T>\` & \`ReadOnlySpan<T>\`

\`Span<T>\` is a contiguous representation of arbitrary memory. It provides safe, bounds-checked, indexed access to memory without copying data or allocating heap objects.

![Span<T> vs Memory<T> Memory Layout and Execution Models](/images/roadmaps/span-memory-layout.jpg)

### 2.1 The Internal Layout of \`Span<T>\`
On 64-bit architectures, \`Span<T>\` is a 16-byte value type containing exactly two fields:
\`\`\`csharp
public readonly ref struct Span<T>
{
    internal readonly ref T _reference; // Managed interior pointer (ByReference<T>)
    private readonly int _length;       // Number of elements in the contiguous block
}
\`\`\`

- **Managed Interior Pointer (\`ref T\`):** Unlike raw unmanaged C/C++ pointers (\`T*\`), a managed interior pointer can point directly to the *interior* of a managed array, a field inside an object, an unmanaged memory block, or a stack-allocated buffer. The CLR Garbage Collector understands interior pointers and updates them automatically if a managed array is relocated during memory compaction.
- **Length (\`int\`):** Enables zero-cost bounds checking. The .NET JIT compiler recognizes span loops and frequently eliminates bounds checks entirely using induction variable analysis.

### 2.2 Unifying Three Distinct Memory Types
\`Span<T>\` acts as a single, uniform interface over three completely different memory sources:

\`\`\`csharp
// 1. Stack Memory (stackalloc) - Zero Heap Allocation, Instant Cleanup
Span<byte> stackBuffer = stackalloc byte[128];
stackBuffer[0] = 0xAA;

// 2. Managed Heap (Array or String) - Slicing without new string/array allocation
byte[] heapArray = new byte[1024];
Span<byte> arraySpan = heapArray.AsSpan(100, 256); // Slices index 100 to 356

string text = "Order-98214-Priority";
ReadOnlySpan<char> textSpan = text.AsSpan(6, 5); // Represents "98214" with ZERO allocation

// 3. Unmanaged / Native Heap (NativeMemory.Alloc or P/Invoke)
unsafe
{
    byte* nativePtr = (byte*)NativeMemory.Alloc(512);
    Span<byte> nativeSpan = new Span<byte>(nativePtr, 512);
    nativeSpan.Fill(0xFF);
    NativeMemory.Free(nativePtr);
}
\`\`\`

---

## 3. The \`ref struct\` Invariant Engine & Stack Confinement

To ensure absolute safety, \`Span<T>\` and \`ReadOnlySpan<T>\` are declared with the **\`ref struct\`** modifier.

### 3.1 Why Stack-Only Confinement is Mandatory
If a \`Span<T>\` points to stack memory created with \`stackalloc\`, and that \`Span<T>\` were allowed to escape to the Managed Heap, the stack frame would unwind while the heap reference still pointed to invalid, overwritten stack memory. This would cause catastrophic memory corruption and security vulnerabilities.

Therefore, the CLR runtime and the C# compiler enforce strict **Stack-Only Invariants**:

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STRICT CLR REF STRUCT INVARIANTS                         │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ Rule                              │ Compiler Enforcement & Architectural Reason│
├───────────────────────────────────┼─────────────────────────────────────────┤
│ 1. No Boxing                      │ Cannot be cast to object or ValueType   │
│ 2. No Class or Normal Struct Field│ Cannot be a field inside any heap type  │
│ 3. No Lambda Closures             │ Cannot be captured in anonymous methods │
│ 4. No Async / Await Boundaries    │ Cannot be held across an await keyword  │
│ 5. No Yield Return (Iterators)    │ Cannot be used in IEnumerable iterators │
└───────────────────────────────────┴─────────────────────────────────────────┘
\`\`\`

### 3.2 C# 13 Evolution: \`allows ref struct\`
Prior to C# 13, generic methods and classes could never accept a \`ref struct\` because generics assumed standard heap-compatible types (\`T : object\`).

C# 13 introduced the **anti-constraint** \`where T : allows ref struct\`:

\`\`\`csharp
// In C# 13 / .NET 9: Enables generic algorithms over Spans!
public interface IBufferProcessor<T> where T : allows ref struct
{
    void Process(T buffer);
}

public class SpanConsumer : IBufferProcessor<ReadOnlySpan<char>>
{
    public void Process(ReadOnlySpan<char> buffer)
    {
        // High-speed processing directly over Span
    }
}
\`\`\`

---

## 4. Bridging Synchronous Spans and Async Workflows: \`Memory<T>\`

Because \`ref struct\` cannot cross \`await\` boundaries (compiler error **CS4007**), how do we handle asynchronous I/O streams and background worker pipelines?

The solution is **\`Memory<T>\`** and **\`ReadOnlyMemory<T>\`**.

\`\`\`csharp
public readonly struct Memory<T>
{
    private readonly object? _object; // Can be T[], string, or MemoryManager<T>
    private readonly int _index;
    private readonly int _length;
}
\`\`\`

### 4.1 How \`Memory<T>\` Works Across Async Suspension Points
- \`Memory<T>\` is a standard value type (struct), not a \`ref struct\`.
- It can live on the Managed Heap, be stored inside class fields, captured in async state machines, and passed across asynchronous methods.
- When you are ready to perform synchronous operations on the data, you call the **\`.Span\`** property to obtain an instantaneous, zero-allocation \`Span<T>\` on the current thread's stack.

\`\`\`csharp
public class OrderStreamProcessor
{
    private readonly ChannelReader<ReadOnlyMemory<byte>> _reader;

    public OrderStreamProcessor(ChannelReader<ReadOnlyMemory<byte>> reader) => _reader = reader;

    public async Task ProcessOrdersAsync(CancellationToken ct)
    {
        await foreach (ReadOnlyMemory<byte> memoryChunk in _reader.ReadAllAsync(ct))
        {
            // 1. Memory<T> safely survives across async boundaries
            await Task.Yield();

            // 2. Project into synchronous Span on current thread stack
            ReadOnlySpan<byte> span = memoryChunk.Span;

            // 3. Fast synchronous parsing without any heap allocations
            if (span.Length >= 4 && BinaryPrimitives.ReadInt32LittleEndian(span[..4]) == 0x7F)
            {
                ExecuteOrder(span[4..]);
            }
        }
    }

    private void ExecuteOrder(ReadOnlySpan<byte> payload) { /* synchronous logic */ }
}
\`\`\`

---

## 5. High-Throughput Buffer Pooling with \`ArrayPool<T>\`

When processing payloads that exceed the stack allocation threshold ($> 1\\text{ KB}$), allocating new \`byte[]\` arrays on the heap is wasteful. **\`ArrayPool<T>.Shared\`** provides a thread-safe, high-performance pool of reusable arrays.

![ArrayPool<T>.Shared Bucket Architecture & Lifetime Cycle](/images/roadmaps/arraypool-architecture.jpg)

### 5.1 Internal Architecture of \`ArrayPool<T>.Shared\`
The default implementation is \`TlsOverPerCoreLockedStacksArrayPool\`:
1. **Per-Core Locked Stacks (L1):** Each CPU core has a dedicated local cache of arrays. Threads running on that core rent and return arrays without acquiring global locks, eliminating thread contention.
2. **Global Buckets (L2):** If a local core stack is empty, it borrows an array from the global bucket system. Arrays are categorized into power-of-two size buckets ($16, 32, 64, 128, \\dots, 1\\text{ MB}+$).

### 5.2 The 4 Fatal Pitfalls of \`ArrayPool<T>\` in Production

\`\`\`csharp
// ❌ PITFALL 1: Assuming Rented Array Length Equals Requested Size
byte[] rented = ArrayPool<byte>.Shared.Rent(100);
// rented.Length may be 128, 256, or larger (power-of-two bucket)!
// Never use rented.Length directly! Always slice to the actual requested count:
Span<byte> exactBuffer = rented.AsSpan(0, 100);

// ❌ PITFALL 2: Double-Returning an Array (Corrupts Pool Internals)
ArrayPool<byte>.Shared.Return(rented);
ArrayPool<byte>.Shared.Return(rented); // CRASH / Corrupted memory state!

// ❌ PITFALL 3: Forgetting to Return in Catch Blocks (Memory Leak)
// ALWAYS use try/finally or a custom IDisposable wrapper:
byte[] buffer = ArrayPool<byte>.Shared.Rent(4096);
try
{
    ProcessBuffer(buffer.AsSpan(0, 4096));
}
finally
{
    ArrayPool<byte>.Shared.Return(buffer, clearArray: false);
}

// ❌ PITFALL 4: Leaking Sensitive Data (Security Vulnerability)
// When handling passwords, cryptographic keys, or PII:
ArrayPool<byte>.Shared.Return(sensitiveBuffer, clearArray: true); // Clears memory to zeros!
\`\`\`

---

## 6. SIMD-Accelerated Text Parsing with \`SearchValues<T>\` (.NET 8/9)

Searching for delimiters in strings or byte arrays (e.g., parsing HTTP headers, CSV lines, or JSON tokens) traditionally used scalar loops or \`IndexOfAny()\`.

.NET 8 and .NET 9 introduced **\`SearchValues<T>\`**, which compiles target characters into **SIMD vector instructions (AVX2, AVX-512, ARM Neon)**:

\`\`\`csharp
using System.Buffers;

public static class FastCsvParser
{
    // SearchValues pre-computes optimal SIMD bitmasks at startup
    private static readonly SearchValues<char> Delimiters = SearchValues.Create(",;\t\r\n");

    public static void ParseTokens(ReadOnlySpan<char> input)
    {
        while (!input.IsEmpty)
        {
            // Vectorized search across 32 or 64 characters simultaneously
            int index = input.IndexOfAny(Delimiters);
            if (index == -1)
            {
                ProcessToken(input);
                break;
            }

            ReadOnlySpan<char> token = input[..index];
            ProcessToken(token);

            input = input[(index + 1)..];
        }
    }

    private static void ProcessToken(ReadOnlySpan<char> token) { /* zero allocation processing */ }
}
\`\`\`

---

## 7. The Production Hybrid Allocation Pattern

For real-world high-performance endpoints, use the **Hybrid Stackalloc / ArrayPool Pattern**:
- If payload $\\le 256\\text{ bytes}$: Allocate on the CPU stack with \`stackalloc\` (0ns overhead, zero GC).
- If payload $> 256\\text{ bytes}$: Rent a buffer from \`ArrayPool<T>.Shared\`.

\`\`\`csharp
public static void ProcessRequestPayload(ReadOnlySpan<byte> input)
{
    const int StackAllocThreshold = 256;
    byte[]? rentedArray = null;

    // Determine allocation strategy based on size
    Span<byte> workingBuffer = input.Length <= StackAllocThreshold
        ? stackalloc byte[StackAllocThreshold]
        : (rentedArray = ArrayPool<byte>.Shared.Rent(input.Length));

    try
    {
        // Slice working buffer to exact input length
        Span<byte> activeSpan = workingBuffer[..input.Length];
        input.CopyTo(activeSpan);

        // Perform in-place cryptographic hashing or transformation
        TransformData(activeSpan);
    }
    finally
    {
        if (rentedArray != null)
        {
            ArrayPool<byte>.Shared.Return(rentedArray);
        }
    }
}
\`\`\`

---

## 8. Master Comparison & Decision Matrix

| Dimension | \`Span<T>\` | \`ReadOnlySpan<T>\` | \`Memory<T>\` | \`ArrayPool<T>\` | \`T[]\` (Standard Heap Array) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Type Kind** | \`ref struct\` | \`ref struct\` | Standard \`struct\` | Class / Static Pool | Reference Type (\`class\`) |
| **Storage Location** | Stack Only | Stack Only | Stack or Heap | Heap (Reusable) | Heap (Gen 0 / LOH) |
| **GC Overhead** | **Zero (0 bytes)** | **Zero (0 bytes)** | **Zero (0 bytes)** | **Near-Zero** | High (Allocates per instance) |
| **Async / Await Safe**| ❌ No (Compile Error) | ❌ No (Compile Error) | ✅ Yes | ✅ Yes (Across steps) | ✅ Yes |
| **Slicing Overhead** | **0ns (Pointer Shift)** | **0ns (Pointer Shift)** | **0ns (Pointer Shift)** | N/A | Slicing creates new array |
| **Primary Use Case** | Synchronous hot paths | Read-only text / parsing | Async I/O pipelines | Large temporary buffers | Long-lived domain collections |`,
  content_fa: `## ۱. معضل تخصیص حافظه (Allocation Bottleneck) در سرویس‌های پرترافیک دات‌نت

در سیستم‌های توزیع‌شده با ترافیک بالا (بیش از ۵۰,۰۰۰ درخواست در ثانیه)، تخصیص مداوم اشیاء و رشته‌ها روی حافظه Heap، عامل اصلی ایجاد نوسان در زمان پاسخ‌دهی (Latency Spikes) و اشغال بیهوده CPU است:

\`\`\`
[جریان سنتی: تخصیص سرسام‌آور حافظه گذرا روی Heap]
دریافت داده (10 KB) ──► string.Substring() ──► ساخت رشته جدید (حافظه Heap - نسل ۰)
                    ──► string.Split(',')  ──► ساخت آرایه جدید + ۲۰ رشته مجزا
                    ──► byte[] buffer      ──► ساخت بافر جدید روی Gen 0 یا LOH
                                            │
                                            ▼
[نتیجه: فشار شدید به GC -> وقفه‌های Stop-The-World -> جهش تأخیر P99 تا ۱۵۰ میلی‌ثانیه]
\`\`\`

### ۱.۱ کالبدشکافی سربار Garbage Collection
۱. **اشباع سریع بودجه نسل صفر (Gen 0):** تخصیص‌های مکرر و کوتاه‌مدت، بودجه حافظه Gen 0 را پر کرده و ران‌تایم را وادار به اجرای مداوم فرآیند Garbage Collection می‌کند.
۲. **وقفه‌های توقف کل برنامه (Stop-The-World Pauses):** در زمان اجرای فازهای پاکسازی GC، تمام نخ‌های پردازشی برنامه متوقف می‌شوند تا رفرنس‌های ریشه بررسی و حافظه‌ها مرتب شوند.
۳. **پدیده تکه‌تکه‌شدگی حافظه اشیای بزرگ (LOH Fragmentation):** هر آرایه بایت یا شیء با حجم ۸۵,۰۰۰ بایت یا بیشتر، مستقیماً وارد Large Object Heap می‌شود. LOH در حالت عادی فشرده‌سازی نمی‌شود و به مرور زمان باعث خطای عدم فضای حافظه (Out Of Memory) می‌گردد.
۴. **تخریب کش پردازنده (CPU Cache Thrashing):** جابجایی مداوم اشاره‌گرهای اشیای پراکنده در رم، کش‌های سریع L1/L2/L3 پردازنده را بی‌اثر می‌کند.

برای غلبه بر این چالش‌ها، دات‌نت پشته مدرن کار با حافظه با تخصیص صفر را ارائه داده است: **\`Span<T>\`**، **\`ReadOnlySpan<T>\`**، **\`Memory<T>\`** و **\`ArrayPool<T>\`**.

---

## ۲. بررسی عمیق: \`Span<T>\` و \`ReadOnlySpan<T>\`

ساختار \`Span<T>\` یک نمای پیوسته بر روی هر نوع حافظه فیزیکی است که امکان دسترسی ایمن، دارای بررسی محدوده (Bounds-Checked) و بدون کپی داده‌ها را فراهم می‌سازد.

![معماری چیدمان حافظه Span و Memory](/images/roadmaps/span-memory-layout.jpg)

### ۲.۱ ساختار داخلی \`Span<T>\`
در معماری‌های ۶۴ بیتی، \`Span<T>\` یک ساختار ۱۶ بایتی بسیار سبک با دو فیلد اصلی است:
\`\`\`csharp
public readonly ref struct Span<T>
{
    internal readonly ref T _reference; // اشاره‌گر مدیریت‌شده داخلی (Managed Interior Pointer)
    private readonly int _length;       // تعداد عناصر موجود در بلوک پیوسته
}
\`\`\`

- **اشاره‌گر مدیریت‌شده داخلی (\`ref T\`):** برخلاف اشاره‌گرهای خام زبان‌های C و C++، این اشاره‌گر توسط GC شناخته می‌شود؛ اگر آرایه جابجا شود، ران‌تایم آدرس اشاره‌گر درون Span را به صورت خودکار به‌روزرسانی می‌کند.
- **طول (\`int\`):** بررسی مرزها را بدون هیچ هزینه‌ای تضمین می‌کند و کامپایلر JIT در حلقه‌های پردازشی، بررسی محدوده را حذف (Elide) می‌کند.

### ۲.۲ یکپارچه‌سازی ۳ نوع مختلف حافظه
ساختار \`Span<T>\` امکان دسترسی یکسان به سه منبع حافظه کاملاً متفاوت را بدون تغییر در کد فراهم می‌سازد:

\`\`\`csharp
// ۱. حافظه استک (stackalloc) - صفر درصد آلیکیشن در رم و پاکسازی آنی
Span<byte> stackBuffer = stackalloc byte[128];
stackBuffer[0] = 0xAA;

// ۲. حافظه Heap (آرایه یا رشته) - برش بدون ساخت شیء جدید
byte[] heapArray = new byte[1024];
Span<byte> arraySpan = heapArray.AsSpan(100, 256); // برشی از اندیس ۱۰۰ تا ۳۵۶

string text = "Order-98214-Priority";
ReadOnlySpan<char> textSpan = text.AsSpan(6, 5); // نمایش بخش "98214" بدون ساخت حتی یک بایت رشته جدید!

// ۳. حافظه Native و Unmanaged
unsafe
{
    byte* nativePtr = (byte*)NativeMemory.Alloc(512);
    Span<byte> nativeSpan = new Span<byte>(nativePtr, 512);
    nativeSpan.Fill(0xFF);
    NativeMemory.Free(nativePtr);
}
\`\`\`

---

## ۳. موتور قوانین \`ref struct\` و حبس روی Stack

برای جلوگیری از خطاهای کشنده حافظه، \`Span<T>\` به عنوان یک **\`ref struct\`** تعریف شده است.

### ۳.۱ چرا حبس روی Stack ضروری است؟
اگر یک \`Span<T>\` به حافظه موقت Stack اشاره کند و اجازه داشته باشد به حافظه Heap برود، پس از اتمام متد، فریم استک نابود شده و اشاره‌گر باقی‌مانده روی Heap به یک حافظه نامعتبر و بازنویسی‌شده اشاره خواهد کرد که منجر به تخریب حافظه و رخنه‌های امنیتی فاجعه‌بار می‌شود.

به همین دلیل ران‌تایم و کامپایلر دات‌نت قوانین سخت‌گیرانه زیر را اعمال می‌کنند:

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                       قوانین شکست‌ناپذیر REF STRUCT                          │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ قانون                             │ دلیل فنی و معمارانه                     │
├───────────────────────────────────┼─────────────────────────────────────────┤
│ ۱. عدم امکان Boxing               │ تبدیل به object باعث فرار به Heap می‌شود│
│ ۲. عدم عضویت در کلاس یا استراکت عادی│ فیلد کلاس همیشه روی Heap ذخیره می‌شود   │
│ ۳. عدم استفاده در توابع لامبدا    │ متغیرهای کپچرشده به یک شیء تبدیل می‌شوند│
│ ۴. عدم عبور از مرزهای await       │ ماشین وضعیت Async به Heap منتقل می‌شود  │
│ ۵. عدم استفاده در Yield Return    │ کلاس ایتراتور روی Heap ساخته می‌شود     │
└───────────────────────────────────┴─────────────────────────────────────────┘
\`\`\`

### ۳.۲ تحول بزرگ در C# 13: معرفی \`allows ref struct\`
در C# 13 قید منفی \`where T : allows ref struct\` معرفی شد که امکان استفاده از \`Span<T>\` در متدها و اینترفیس‌های ژنریک را فراهم کرد:

\`\`\`csharp
public interface IBufferProcessor<T> where T : allows ref struct
{
    void Process(T buffer);
}
\`\`\`

---

## ۴. پل ارتباطی میان Span و متدهای ناهمگام: \`Memory<T>\`

چون \`ref struct\` نمی‌تواند از مرزهای \`await\` عبور کند، برای پایپ‌لاین‌های ناهمگام و I/Oهای سرور از **\`Memory<T>\`** و **\`ReadOnlyMemory<T>\`** استفاده می‌کنیم:

\`\`\`csharp
public readonly struct Memory<T>
{
    private readonly object? _object; // اشاره به آرایه یا MemoryManager
    private readonly int _index;
    private readonly int _length;
}
\`\`\`

### ۴.۱ مکانیزم عملکرد \`Memory<T>\` در جریان‌های Async
- ساختار \`Memory<T>\` یک استراکت عادی است و \`ref struct\` نیست؛ بنابراین به راحتی روی Heap ذخیره شده و از دستورات \`await\` عبور می‌کند.
- هر زمان که در متدهای همگام به داده‌ها نیاز داشته باشید، پروپرتی **\`.Span\`** را صدا می‌زنید تا یک \`Span<T>\` سریع روی استک جاری تولید شود.

\`\`\`csharp
public async Task ProcessOrdersAsync(ChannelReader<ReadOnlyMemory<byte>> reader, CancellationToken ct)
{
    await foreach (ReadOnlyMemory<byte> memoryChunk in reader.ReadAllAsync(ct))
    {
        // ۱. ساختار Memory به صورت امن در مرزهای Async نگهداری می‌شود
        await Task.Yield();

        // ۲. تبدیل به Span همگام روی استک جهت پردازش بدون کپی
        ReadOnlySpan<byte> span = memoryChunk.Span;

        // ۳. خواندن باینری بدون تخصیص حافظه
        int header = BinaryPrimitives.ReadInt32LittleEndian(span[..4]);
    }
}
\`\`\`

---

## ۵. استخر بافر با کارایی بالا: \`ArrayPool<T>\`

برای بافرهایی با حجم بالا ($> 1\\text{ KB}$)، ساخت آرایه‌های جدید \`byte[]\` باعث اشغال حافظه می‌شود. کلاس **\`ArrayPool<T>.Shared\`** مجموعه‌ای از بافرهای از پیش ساخته‌شده را برای استفاده مجدد فراهم می‌کند.

![معماری باکت‌های ArrayPool و چرخه حیات بافرها](/images/roadmaps/arraypool-architecture.jpg)

### ۵.۱ ۴ اشتباه کشنده در استفاده از \`ArrayPool<T>\` در محیط‌های واقعی

\`\`\`csharp
// ❌ اشتباه ۱: فرض بر اینکه طول آرایه اجاره‌شده دقیقاً برابر با عدد درخواستی است!
byte[] rented = ArrayPool<byte>.Shared.Rent(100);
// طول rented ممکن است ۱۲۸ یا ۲۵۶ باشد (به خاطر دسته‌بندی مضارب ۲ در باکت‌ها)
// همیشه باید به اندازه داده واقعی اسلایس کنید:
Span<byte> exactBuffer = rented.AsSpan(0, 100);

// ❌ اشتباه ۲: بازگرداندن دوباره یک آرایه (Double Return) که باعث خرابی کلاستر استخر می‌شود!
ArrayPool<byte>.Shared.Return(rented);
ArrayPool<byte>.Shared.Return(rented); // رخنه و کرش وضعیت داخلی استخر!

// ❌ اشتباه ۳: فراموش کردن Return در بلوک‌های خطا
byte[] buffer = ArrayPool<byte>.Shared.Rent(4096);
try
{
    ProcessBuffer(buffer.AsSpan(0, 4096));
}
finally
{
    // همیشه در finally بازگردانید تا دچار Memory Leak نشوید
    ArrayPool<byte>.Shared.Return(buffer, clearArray: false);
}

// ❌ اشتباه ۴: نشت اطلاعات محرمانه
// در زمان کار با پسوردها و داده‌های هویتی، حتماً مقدار clearArray را true بگذارید:
ArrayPool<byte>.Shared.Return(sensitiveBuffer, clearArray: true); // حافظه را با صفر پر می‌کند
\`\`\`

---

## ۶. پردازش وکتوری متون با \`SearchValues<T>\` (دات‌نت ۸ و ۹)

در دات‌نت ۸ و ۹، کلاس **\`SearchValues<T>\`** جستجوی کاراکترها و جداکننده‌ها را با استفاده از **دستورات SIMD پردازنده (AVX2 و AVX-512)** پردازش می‌کند که سرعتی تا **۵ برابر بیشتر** از \`IndexOfAny\` دارد:

\`\`\`csharp
using System.Buffers;

public static class FastCsvParser
{
    // ساخت ماسک‌های وکتوری بهینه در زمان اجرای اولیه
    private static readonly SearchValues<char> Delimiters = SearchValues.Create(",;\t\r\n");

    public static void ParseTokens(ReadOnlySpan<char> input)
    {
        while (!input.IsEmpty)
        {
            // پردازش همزمان ۳۲ یا ۶۴ کاراکتر در رجیسترهای پردازنده
            int index = input.IndexOfAny(Delimiters);
            if (index == -1)
            {
                ProcessToken(input);
                break;
            }

            ReadOnlySpan<char> token = input[..index];
            ProcessToken(token);

            input = input[(index + 1)..];
        }
    }

    private static void ProcessToken(ReadOnlySpan<char> token) { }
}
\`\`\`

---

## ۷. الگوی ترکیبی پروداکشن (Hybrid Allocation Pattern)

در اندپوینت‌های پرترافیک، از الگوی ترکیبی زیر استفاده می‌شود:
- اگر حجم داده $\\le 256\\text{ بایت}$ باشد: روی استک با \`stackalloc\` ساخته می‌شود (بدون هزینه GC).
- اگر بیشتر از ۲۵۶ بایت باشد: از استخر \`ArrayPool<T>.Shared\` اجاره گرفته می‌شود.

\`\`\`csharp
public static void ProcessRequestPayload(ReadOnlySpan<byte> input)
{
    const int StackAllocThreshold = 256;
    byte[]? rentedArray = null;

    Span<byte> workingBuffer = input.Length <= StackAllocThreshold
        ? stackalloc byte[StackAllocThreshold]
        : (rentedArray = ArrayPool<byte>.Shared.Rent(input.Length));

    try
    {
        Span<byte> activeSpan = workingBuffer[..input.Length];
        input.CopyTo(activeSpan);
        TransformData(activeSpan);
    }
    finally
    {
        if (rentedArray != null)
        {
            ArrayPool<byte>.Shared.Return(rentedArray);
        }
    }
}
\`\`\`

---

## ۸. جدول مقایسه جامع ساختارهای حافظه

| بعد فنی | \`Span<T>\` | \`ReadOnlySpan<T>\` | \`Memory<T>\` | \`ArrayPool<T>\` | \`T[]\` (آرایه معمولی) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **نوع ساختار** | \`ref struct\` | \`ref struct\` | \`struct\` معمولی | کلاس / استخر سراسری | رفرنس‌تایپ (\`class\`) |
| **محل استقرار** | فقط روی Stack | فقط روی Stack | روی Stack یا Heap | روی Heap (بازیافتی) | روی Heap (Gen 0 یا LOH) |
| **سربار برای GC** | **صفر (0 بایت)** | **صفر (0 بایت)** | **صفر (0 بایت)** | **بسیار ناچیز** | بالا (به ازای هر شیء) |
| **امنیت در متدهای Async**| ❌ خطای کامپایلر | ❌ خطای کامپایلر | ✅ کاملاً ایمن | ✅ ایمن با بازگردانی | ✅ ایمن |
| **هزینه برش داده (Slice)** | **۰ نانوثانیه (تغییر آدرس)** | **۰ نانوثانیه (تغییر آدرس)** | **۰ نانوثانیه** | نامربوط | کپی داده و ساخت آرایه جدید |
| **کاربرد اصلی** | مسیرهای همگام سریع | پارس رشته و داده‌های ثابت | پایپ‌لاین‌های ناهمگام I/O | بافرهای موقت بزرگ | کالکشن‌های با ماندگاری بالا |`,
};
