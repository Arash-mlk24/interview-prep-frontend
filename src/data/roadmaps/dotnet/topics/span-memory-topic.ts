import { RoadmapTopic } from "../../../models";

export const spanMemoryTopic: RoadmapTopic = {
  id: "topic-dotnet-span-memory",
  stepId: "step-csharp-memory-concurrency",
  slug: "span-memory-ref-struct",
  order: 1,
  title: "Span<T>, Memory<T>, ref struct & Zero-Allocation Pipelines",
  title_fa: "مفاهیم Span<T>، Memory<T>، ساختار ref struct و پردازش بدون آلیکیشن",
  summary: "Master low-level memory slicing, stack allocation rules, interior pointers, and the reasons ref struct cannot escape to the managed heap.",
  summary_fa: "تسلط بر برش فوق سریع حافظه، قوانین تخصیص روی استک، اشاره‌گرهای داخلی و چرایی عدم امکان خروج ref struct به سمت Heap.",
  readingTimeMinutes: 15,
  difficulty: "senior",
  content: `### 1. Introduction to Zero-Allocation Memory Primitives

Traditional string and array manipulation in .NET creates transient heap allocations. Slicing a string (\`str.Substring(0, 10)\`) allocates a new string instance on the managed heap, triggering Garbage Collector (GC) pressure.

.NET Core introduced **\`Span<T>\`** and **\`ReadOnlySpan<T>\`** as uniform abstractions over contiguous memory blocks (managed arrays, native stack memory, or unmanaged heap pointers) without memory copying.

\`\`\`
Memory Representation of Span<T>:
[ Managed Heap Array / Stackalloc Buffer ]
   [0] [1] [2] [3] [4] [5] [6] [7] [8] [9]
           ^-------------------^
         Span<T> (Reference to [2], Length = 4)
\`\`\`

---

### 2. The Internal Architecture of \`ref struct\`

\`Span<T>\` is internally defined as a **\`ref struct\`**:
\`\`\`csharp
public readonly ref struct Span<T> {
    internal readonly ref T _reference; // Managed interior pointer (ByReference<T>)
    private readonly int _length;      // Element count
}
\`\`\`

#### Enforced CLR Stack-Only Invariants:
1. **No Boxing:** Cannot be cast to \`object\` or \`ValueType\`.
2. **No Class Fields:** Cannot be stored as a field in a reference type (\`class\`) or standard \`struct\`.
3. **No Lambda Closures:** Cannot be captured in lambda expressions or local functions.
4. **No Async Await Boundaries:** Cannot be held across \`await\` points in \`async\` methods.

---

### 3. Why \`Span<T>\` Cannot Cross \`await\` Boundaries

When compiling an \`async\` method, the C# compiler generates an **\`IAsyncStateMachine\`** struct/class that is hoisted to the **Managed Heap** when an asynchronous operation yields. Because a \`ref struct\` cannot exist on the heap, holding a \`Span<T>\` across \`await\` causes compile-time error **CS4007**.

#### The Solution: \`Memory<T>\` and \`ReadOnlyMemory<T>\`
\`Memory<T>\` is a normal, heap-safe value type that wraps an object reference, offset, and count. It survives across asynchronous suspension points:

\`\`\`csharp
public async Task ProcessDataStreamAsync(ReadOnlyMemory<byte> buffer) {
    // Memory<T> safely survives async I/O
    await Task.Delay(50);

    // Obtain a synchronous stack-allocated Span on demand
    ReadOnlySpan<byte> span = buffer.Span;
    int header = BitConverter.ToInt32(span[..4]);
}
\`\`\`

---

### 4. High-Performance Zero-Allocation String Parsing

\`\`\`csharp
// Parsing CSV line without string.Split() heap allocations:
public static void ParseCsvLine(ReadOnlySpan<char> line) {
    while (!line.IsEmpty) {
        int commaIndex = line.IndexOf(',');
        ReadOnlySpan<char> token = commaIndex == -1 ? line : line[..commaIndex];
        
        // Fast parsing using Span overloads:
        if (int.TryParse(token, out int value)) {
            ProcessValue(value);
        }

        if (commaIndex == -1) break;
        line = line[(commaIndex + 1)..];
    }
}
\`\`\`

#### Production Best Practices:
- Prefer \`ReadOnlySpan<char>\` over \`string\` for high-throughput string manipulation.
- Use \`Memory<T>\` for async signatures and convert to \`.Span\` inside synchronous blocks.
- Leverage \`stackalloc byte[256]\` for small temporary buffers, falling back to \`ArrayPool<byte>.Shared\` for larger buffers.`,
  content_fa: `### ۱. مقدمه‌ای بر پردازش حافظه با صفر آلیکیشن

عملیات سنتی روی رشته‌ها و آرایه‌ها در دات‌نت باعث تخصیص مکرر حافظه روی Heap می‌شود. متدهایی مانند \`str.Substring()\` یک شیء رشته جدید در حافظه Heap می‌سازند که موجب افزایش کارکرد و وقفه‌های Garbage Collector می‌شود.

ساختارهای **\`Span<T>\`** و **\`ReadOnlySpan<T>\`** به عنوان نمای یکپارچه بر روی بلوک‌های پیوسته حافظه (شامل آرایه‌های مدیریت‌شده، بافرهای استک و حافظه‌های Unmanaged) عمل کرده و امکان برش داده‌ها را با **صفر کپی و صفر آلیکیشن** فراهم می‌کنند.

---

### ۲. ساختار داخلی و قوانین \`ref struct\`

\`Span<T>\` به صورت یک **\`ref struct\`** پیاده‌سازی شده است:
\`\`\`csharp
public readonly ref struct Span<T> {
    internal readonly ref T _reference; // Direct managed interior pointer
    private readonly int _length;      // Element count
}
\`\`\`

#### قوانین سخت‌گیرانه CLR برای تضمین ماندگاری روی Stack:
۱. **عدم امکان Boxing:** تبدیل آن به \`object\` یا اینترفیس‌ها ناممکن است.
۲. **عدم قرارگیری در فیلدهای کلاس:** نمی‌تواند عضوی از یک کلاس باشد (زیرا به Heap فرار می‌کند).
۳. **عدم کپچر در لامبدا:** درون توابع ناشناس یا Closureها قابل استفاده نیست.
۴. **عدم عبور از مرز Async:** نمی‌تواند در محدوده عبارات \`await\` استفاده شود.

---

### ۳. چرا Span نمی‌تواند از مرز await عبور کند؟

کامپایلر دات‌نت متدهای حاوی \`async\` را به یک کلاس/استراکت ماشین وضعیت (\`IAsyncStateMachine\`) تبدیل می‌کند. هنگام رسیدن به \`await\`، نمونه این ماشین وضعیت روی **Managed Heap** ذخیره می‌شود تا پس از اتمام عملیات I/O بازخوانی گردد. چون \`ref struct\` حق قرار گرفتن روی Heap را ندارد، کامپایلر ارور **CS4007** می‌دهد.

#### راهکار: استفاده از \`Memory<T>\`
ساختار \`Memory<T>\` یک استراکت معمولی و ایمن برای ذخیره روی Heap است که در زمان نیاز با متد \`.Span\` روی استک خوانده می‌شود.

\`\`\`csharp
public async Task ProcessDataStreamAsync(ReadOnlyMemory<byte> buffer) {
    // Memory<T> safely survives across async suspension points
    await Task.Delay(50);

    // Obtain synchronous stack-allocated Span for high-speed slicing
    ReadOnlySpan<byte> span = buffer.Span;
    int header = BitConverter.ToInt32(span[..4]);
}
\`\`\``,
};
