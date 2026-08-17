import { RoadmapTopic } from "../../../models";

export const clrGcInternalsTopic: RoadmapTopic = {
  id: "topic-dotnet-clr-gc-internals",
  stepId: "step-csharp-memory-concurrency",
  slug: "clr-garbage-collection-jit-internals",
  order: 3,
  title: "CLR Internals: Generational GC (Gen 0/1/2, LOH, POH), Server vs Workstation GC & JIT Compilation",
  title_fa: "معماری داخلی CLR: نحوه کارکرد Garbage Collector نسل‌بندی‌شده، تفاوت Server/Workstation GC و کامپایل Tiered JIT",
  summary:
    "Master the CLR runtime engine: Generational memory layout (Gen 0/1/2, LOH, POH), Mark/Sweep/Compact phases, multi-core Server GC parallelism, Tiered JIT compilation, and Dynamic PGO optimization.",
  summary_fa:
    "کالبدشکافی موتور اجرای CLR: ساختار حافظه نسل‌بندی‌شده (Gen 0/1/2، LOH، POH)، فازهای سه‌گانه Mark/Sweep/Compact، موازی‌سازی Server GC روی پردازنده‌های چند‌هسته‌ای، کامپایلر چند‌سطحی Tiered JIT و بهینه‌سازی Dynamic PGO.",
  readingTimeMinutes: 35,
  difficulty: "senior",
  content: `## 1. The Architecture of the .NET CLR Execution Engine

The Common Language Runtime (CoreCLR) is a high-performance execution engine that manages memory, executes IL bytecode via Just-In-Time (JIT) compilation, enforces type safety, and handles multi-threaded concurrency:

\`\`\`
[C# Source Code] ──► Roslyn Compiler ──► [Intermediate Language (IL) + Metadata]
                                                        │
                                                        ▼
[CoreCLR Execution Engine]
 ├── 1. Class Loader & Type System (MethodTables, EEClasses)
 ├── 2. Tiered JIT Compiler (Tier 0 Quick JIT ──► Dynamic PGO ──► Tier 1 Optimized Native Code)
 ├── 3. Generational Garbage Collector (SOH: Gen 0/1/2 | LOH | POH)
 └── 4. ThreadPool & I/O Engine (Work-Stealing Scheduler, IOCP Sockets)
\`\`\`

Understanding how the CLR allocates and reclaims memory is the foundational skill required to scale .NET applications to hundreds of thousands of requests per second.

---

## 2. The Managed Heap Architecture & Generations

The CLR organizes heap memory into distinct logical regions based on the **Generational Hypothesis**: *newly created objects have a very short lifespan, while older objects tend to live for a long time*.

![.NET CLR Managed Heap Architecture & Generations](/images/roadmaps/clr-managed-heap-generations.jpg)

### 2.1 The Small Object Heap (SOH) Generations
Any object smaller than $85,000\\text{ bytes}$ is allocated in the Small Object Heap (SOH):

1. **Generation 0 (Gen 0 - Ephemeral):**
   - Contains newly allocated, short-lived objects (e.g. temporary variables, local DTOs, string slices, HTTP request contexts).
   - **Performance:** Gen 0 collections are extremely fast (sub-millisecond, typically $< 1\\text{ ms}$) because most objects are already dead when collection begins.
   - When Gen 0 budget is exhausted, a Gen 0 collection triggers. Surviving objects are **promoted to Gen 1**.
2. **Generation 1 (Gen 1 - Buffer Zone):**
   - Serves as a buffer between short-lived and long-lived objects.
   - If an object survives a Gen 0 collection because it was temporarily in flight during an active request, Gen 1 gives it a second chance to die before being promoted to Gen 2.
   - Surviving Gen 1 objects are **promoted to Gen 2**.
3. **Generation 2 (Gen 2 - Tenured):**
   - Contains long-lived objects (e.g. static variables, singleton services, in-memory caches, database connection pools).
   - Collections in Gen 2 are known as **Full GC** collections. They scan the entire heap (Gen 0 + Gen 1 + Gen 2 + LOH) and are significantly more CPU-intensive.

---

### 2.2 The Large Object Heap (LOH)
Any object or array $\\ge 85,000\\text{ bytes}$ (e.g. \`new byte[85000]\` or large strings $> 42,500\\text{ chars}$) is allocated directly on the **Large Object Heap (LOH)**:
- **Why LOH Exists:** Copying megabytes of contiguous memory during compaction would freeze the CPU for hundreds of milliseconds.
- **The LOH Trap (Fragmentation):** Because LOH is **swept rather than compacted** by default, allocating and releasing large arrays leaves gaps of unused memory ("swiss cheese"). Eventually, an allocation fails with an \`OutOfMemoryException\` (OOM) even if total free RAM appears sufficient!
- **On-Demand Compaction (.NET 6/7/8/9):**
\`\`\`csharp
// Instruct CLR to compact LOH during the next full GC collection:
GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect();
\`\`\`

---

### 2.3 The Pinned Object Heap (POH)
Introduced in .NET 5 to solve the "Pinning" bottleneck:
- **The Problem:** When interacting with native C/C++ libraries, sockets, or GPU DMA transfers via P/Invoke, buffers must be **Pinned** (locked at a fixed memory address so the GC cannot relocate them). Pinning objects in the SOH creates "islands" that block the GC from compacting memory around them, causing severe fragmentation.
- **The Solution (POH):** The **Pinned Object Heap** is a dedicated heap region exclusively for pinned objects. Objects allocated on POH are guaranteed never to move, allowing the Small Object Heap to remain completely free of pinning obstructions.

\`\`\`csharp
// Allocate pinned byte buffer directly on POH:
byte[] pinnedBuffer = GC.AllocateArray<byte>(length: 4096, pinned: true);
\`\`\`

---

## 3. The 3 Execution Phases of Garbage Collection

When a GC cycle triggers, the engine executes three discrete phases:

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE 3 PHASES OF GARBAGE COLLECTION                       │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ Phase             │ Action & Runtime Mechanics                              │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ 1. Mark Phase     │ Traverses active GC Roots (CPU registers, Stack slots,  │
│                   │ static fields, GC Handles) and marks live objects.      │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ 2. Plan / Sweep   │ Simulates compaction to calculate efficiency. If holes  │
│                   │ exist, sweeps dead objects into free-memory lists.      │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ 3. Compact Phase  │ Slides surviving objects together to form contiguous    │
│                   │ memory and updates all live references (Relocation).    │
└───────────────────┴─────────────────────────────────────────────────────────┘
\`\`\`

---

## 4. Server GC vs. Workstation GC & High-Density Container Tuning

The CLR provides two fundamentally different Garbage Collection engines optimized for distinct workload topologies:

![Server GC vs Workstation GC Architecture & Thread Allocation](/images/roadmaps/server-vs-workstation-gc.jpg)

### 4.1 Workstation GC (Low Latency / Desktop / Mobile)
- **Architecture:** Operates on a **single shared Managed Heap** and runs GC either on the requesting user thread or a single background GC thread.
- **Goal:** Minimize latency and memory footprint for interactive UI applications (WPF, WinForms, MAUI) so that UI rendering never stutters.

### 4.2 Server GC (High Throughput / Multi-Core Backend)
- **Architecture:** Allocates a **dedicated Managed Heap and a dedicated high-priority GC worker thread per logical CPU core** (e.g., on a 32-core server, there are 32 distinct heaps and 32 GC threads).
- **Goal:** Maximum throughput. Multiple CPU cores allocate and collect memory concurrently without acquiring global locks or contending with other threads.
- **Default:** Server GC is enabled by default in all ASP.NET Core web applications.

### 4.3 Container Tuning & DATAP in .NET 8/9
In Kubernetes clusters with high-density container packing (e.g. Pods with 1 CPU or 512 MB RAM limits), traditional Server GC would allocate too many heaps, consuming excessive memory:
- **Dynamic Adaptation to Application Sizes (DATAP):** .NET 8 and .NET 9 dynamically adjust the number of Server GC heaps and memory budgets in real-time based on container cgroup limits.

\`\`\`xml
<!-- Runtime configuration in .csproj or runtimeconfig.json -->
<PropertyGroup>
  <ServerGarbageCollection>true</ServerGarbageCollection>
  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>
  <!-- Limit heap count in constrained container pods -->
  <GCHeapCount>4</GCHeapCount>
</PropertyGroup>
\`\`\`

---

## 5. Tiered JIT Compilation & Dynamic PGO in .NET 8/9

The .NET JIT compiler translates IL bytecode into native machine instructions using a **multi-tiered strategy**:

\`\`\`
[Method Called 1st Time]
       │
       ▼
[Tier 0: Quick JIT] ──► Generates unoptimized machine code in < 1ms (Fast Startup)
       │                 Instruments execution counters (Call count, branch weights)
       ▼
[Invoked > 30 times]
       │
       ▼
[Dynamic PGO (Profile-Guided Optimization)] ──► Analyzes actual runtime data types
       │
       ▼
[Tier 1: Optimized JIT] ──► Full optimization: Loop unrolling, SIMD vectorization,
                            Devirtualization of interfaces, and aggressive inlining!
\`\`\`

### 5.1 Dynamic PGO & Devirtualization
In object-oriented code, calling an interface method (\`IProcessor.Process()\`) requires a virtual table (vtable) dispatch lookup.
- **Dynamic PGO** monitors which concrete class is actually invoked at runtime.
- If $99\\%$ of calls go to \`FastOrderProcessor\`, the Tier 1 JIT **devirtualizes and inlines** the call directly, transforming an indirect pointer jump into raw native instructions!

---

## 6. Production Diagnostics & Performance Monitoring

\`\`\`bash
# 1. Monitor real-time GC metrics:
dotnet-counters monitor --process-id <PID> --counters System.Runtime

# Critical Metrics to Inspect:
# - % Time in GC: Must remain < 5% under normal load. If > 10%, allocations are excessive!
# - Gen 0 / Gen 1 / Gen 2 GC Count: Ratio should ideally be ~ 100 : 10 : 1
# - LOH Size: Watch for uncollected memory growth

# 2. Capture a fast memory snapshot without full process pausing:
dotnet-gcdump collect --process-id <PID>

# 3. Analyze heap allocations with PerfView or Visual Studio:
# Inspect object promotion trees and identify allocation hot spots
\`\`\`

---

## 7. Master Comparison Matrix

| Architectural Dimension | Gen 0 / Gen 1 (Ephemeral) | Gen 2 (Tenured) | Large Object Heap (LOH) | Pinned Object Heap (POH) |
| :--- | :--- | :--- | :--- | :--- |
| **Object Size Threshold**| $< 85,000\\text{ bytes}$ | $< 85,000\\text{ bytes}$ | $\\ge 85,000\\text{ bytes}$ | Any size (Explicit pinned) |
| **Expected Lifespan** | Milliseconds (Transient) | Long-lived / Lifetime | Long-lived / Large buffers | Duration of I/O operation |
| **Collection Frequency** | Thousands of times/minute| Infrequent (Minutes/Hours)| Tied to Gen 2 collections | Tied to Gen 2 collections |
| **Collection Mechanism** | Mark $\\rightarrow$ Compact | Mark $\\rightarrow$ Compact | Mark $\\rightarrow$ **Sweep (No Compact)**| Mark $\\rightarrow$ **Sweep (No Move)** |
| **Typical Pause Time** | $< 1\\text{ ms}$ (Sub-millisecond)| $10\\text{ ms} - 100\\text{ ms}+$| $10\\text{ ms} - 100\\text{ ms}+$| $10\\text{ ms} - 100\\text{ ms}+$ |
| **Primary Danger** | Allocation saturation | Stop-the-World pauses | Memory fragmentation / OOM | Unreleased pinned handles |`,
  content_fa: `## ۱. معماری موتور اجرای CLR در دات‌نت

موتور زمان اجرای مشترک (CoreCLR) یک پلتفرم پیشرفته و چندمنظوره است که مدیریت حافظه، کامپایل کدهای واسط (IL) به کدهای ماشین از طریق JIT، تضمین امنیت نوع‌ها و هماهنگی نخ‌های پردازشی را بر عهده دارد:

\`\`\`
[کد منبع C#] ──► کامپایلر Roslyn ──► [کدهای واسط IL + متادیتا]
                                                    │
                                                    ▼
[موتور اجرای CoreCLR]
 ├── ۱. سیستم تایپ‌ها و متد تیبل‌ها (MethodTable)
 ├── ۲. کامپایلر چندسطحی Tiered JIT (فاز سریع Tier 0 ──► تحلیل PGO ──► فاز بهینه Tier 1)
 ├── ۳. موتور مدیریت حافظه و Garbage Collector (نسل‌های Gen 0/1/2 | LOH | POH)
 └── ۴. موتور زمان‌بندی ThreadPool و سوکت‌های ناهمگام (IOCP)
\`\`\`

---

## ۲. معماری حافظه Managed Heap و نسل‌های Garbage Collector

موتور GC حافظه Heap را بر اساس **فرضیه نسل‌ها (Generational Hypothesis)** دسته‌بندی می‌کند: *بیشتر اشیاء طول عمر بسیار کوتاهی دارند و اشیایی که زنده می‌مانند، برای مدتی طولانی به حیات خود ادامه خواهند داد*.

![معماری نسل‌های حافظه دات‌نت](/images/roadmaps/clr-managed-heap-generations.jpg)

### ۲.۱ نسل‌های سه‌گانه در Small Object Heap (SOH)
هر شیء کوچکتر از ۸۵,۰۰۰ بایت در این بخش قرار می‌گیرد:

۱. **نسل صفر (Gen 0 - موقت و گذرا):**
   - محل تخصیص اولیه اشیای جدید (مانند متغیرهای محلی، DTOها، هدرهای ریکوئست و رشته‌های موقت).
   - **سرعت اجرا:** فرآیند پاکسازی Gen 0 فوق‌العاده سریع (کمتر از ۱ میلی‌ثانیه) است چون اکثر اشیاء تا زمان اجرای GC مرده‌اند.
   - اشیایی که زنده بمانند به **نسل ۱ (Gen 1)** ارتقا می‌یابند.
۲. **نسل یک (Gen 1 - منطقه بافر):**
   - به عنوان یک لایه ضربه‌گیر میان اشیای کوتاه‌مدت و بلندمدت عمل می‌کند.
   - اشیایی که حین پردازش یک درخواست به طور موقت زنده مانده‌اند در این نسل شانس نابودی پیدا می‌کنند تا بیهوده وارد نسل ۲ نشوند.
   - بازماندگان نسل ۱ به **نسل ۲ (Gen 2)** منتقل می‌شوند.
۳. **نسل دو (Gen 2 - اشیای دائمی):**
   - اشیای بلندمدت مانند سرویس‌های Singleton، کش‌های درون حافظه، متغیرهای Static و استخرهای اتصال به دیتابیس در این نسل قرار دارند.
   - پاکسازی این نسل به عنوان **Full GC** شناخته می‌شود که کل حافظه را اسکن کرده و نیازمند زمان و مصرف CPU بالایی است.

---

### ۲.۲ حافظه اشیای بزرگ (Large Object Heap - LOH)
اشیایی با حجم ۸۵,۰۰۰ بایت یا بیشتر (مانند آرایه‌های بزرگ بایت یا رشته‌های طولانی) مستقیماً وارد LOH می‌شوند:
- **دلیل وجود LOH:** کپی کردن مگابایت‌ها حافظه در فرآیند فشرده‌سازی باعث وقفه چندصد میلی‌ثانیه‌ای سرور می‌شود؛ بنابراین LOH در حالت عادی فشرده‌سازی نمی‌شود.
- **معضل تکه‌تکه‌شدگی (Fragmentation):** چون LOH فقط جاروب (Sweep) می‌شود، حذف اشیاء باعث ایجاد حفره‌های خالی پراکنده در حافظه می‌شود و در نهایت خطای Out Of Memory رخ می‌دهد.
- **فشرده‌سازی دستی در دات‌نت:**
\`\`\`csharp
GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect();
\`\`\`

---

### ۲.۳ حافظه اشیای ثابت (Pinned Object Heap - POH)
این ناحیه از دات‌نت ۵ برای حل مشکل اشیای قفل‌شده در رم اضافه شد:
- **مشکل قدیمی:** هنگام کار با کتابخانه‌های C++ یا سوکت‌ها، بافرها باید در رم قفل (Pin) می‌شدند. این قفل‌ها مانند سنگی در مسیر فشرده‌سازی SOH عمل کرده و حافظه را تکه‌تکه می‌کردند.
- **راهکار مدرن:** بافرها مستقیماً در ناحیه POH ساخته می‌شوند که هیچ‌گاه جابجا نمی‌شود؛ در نتیجه حافظه SOH کاملاً تمیز و یکپارچه باقی می‌ماند.

\`\`\`csharp
byte[] pinnedBuffer = GC.AllocateArray<byte>(length: 4096, pinned: true);
\`\`\`

---

## ۳. فازهای سه‌گانه اجرای Garbage Collection

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                       فازهای سه‌گانه GARBAGE COLLECTION                      │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ فاز               │ عملکرد موتور در ران‌تایم                                │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ ۱. فاز Mark       │ اسکن ریشه‌ها (رجیسترها، استک نخ‌ها و متغیرهای Static)    │
│                   │ و نشانه‌گذاری اشیای زنده در قالب یک درخت گراف.          │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ ۲. فاز Plan/Sweep │ محاسبه سودمندی فشرده‌سازی و انتقال بلوک‌های مرده به لیست │
│                   │ حافظه‌های آزاد (Free List).                              │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ ۳. فاز Compact    │ جابجایی اشیای زنده به ابتدای حافظه و به‌روزرسانی تمام   │
│                   │ اشاره‌گرها و رفرنس‌ها در سراسر برنامه.                   │
└───────────────────┴─────────────────────────────────────────────────────────┘
\`\`\`

---

## ۴. مقایسه Server GC و Workstation GC و تنظیمات کانتینر

![معماری Server GC در برابر Workstation GC](/images/roadmaps/server-vs-workstation-gc.jpg)

### ۴.۱ مدل Workstation GC (مخصوص برنامه‌های دسکتاپ و تعاملی)
- دارای **یک Managed Heap واحد** است و فرآیند GC روی نخ کاربر یا یک نخ پس‌زمینه اجرا می‌شود تا رابط کاربری هرگز دچار لگ نشود.

### ۴.۲ مدل Server GC (مخصوص بک‌اند و وب‌سرورهای پرترافیک)
- به ازای **هر هسته پردازنده (CPU Core)، یک Managed Heap اختصاصی و یک نخ GC با اولویت بالا** ایجاد می‌کند.
- نخ‌های مختلف برنامه بدون قفل‌شدگی روی هسته‌های مختلف رم تخصیص می‌دهند و پاکسازی‌ها به صورت موازی انجام می‌شود.
- در تمام پروژه‌های ASP.NET Core به صورت پیش‌فرض فعال است.

### ۴.۳ قابلیت DATAP در دات‌نت ۸ و ۹ برای پادهای کوبرنتیز
در پادهای با محدودیت رم و CPU (مثلاً ۵۱۲ مگابایت)، قابلیت **DATAP** تعداد هیپ‌های Server GC را به شکل داینامیک با محدودیت کانتینر تطبیق می‌دهد تا از کرش OOM جلوگیری شود.

---

## ۵. کامپایلر چندسطحی Tiered JIT و بهینه‌سازی Dynamic PGO

کامپایلر JIT دات‌نت کدهای واسط IL را با استراتژی چندسطحی به کد ماشین تبدیل می‌کند:

۱. **سطح صفر (Tier 0 Quick JIT):** در زمان استارت‌آپ کدها را در کمتر از ۱ میلی‌ثانیه و بدون بهینه‌سازی کامپایل می‌کند تا برنامه فوراً بالا بیاید. همزمان شمارنده‌های آماری نحوه اجرای کد را ثبت می‌کنند.
۲. **سطح بهینه‌سازی با PGO پویا (Dynamic PGO):** اگر متدی بیش از ۳۰ بار فراخوانی شود، تحلیل پروفایل اجرای واقعی انجام شده و فراخوانی اینترفیس‌ها (Virtual Calls) به دستورات مستقیم و فوق‌سریع تبدیل (Devirtualize) می‌شوند.
۳. **سطح یک (Tier 1 Optimized JIT):** کدها با باز کردن حلقه‌ها (Loop Unrolling)، وکتوری‌سازی SIMD و Inlining به بالاترین سرعت ممکن کد بومی ماشین می‌رسند.

---

## ۶. پایش سلامت GC در پروداکشن

\`\`\`bash
# پایش بلادرنگ متریک‌های GC:
dotnet-counters monitor --process-id <PID> --counters System.Runtime

# شاخص‌های کلیدی:
# - درصد زمان سپری شده در GC (% Time in GC): باید همواره زیر ۵٪ باشد.
# - نسبت تعداد پاکسازی‌ها: نسبت ایده‌آل Gen 0 به Gen 1 به Gen 2 حدود ۱۰۰ به ۱۰ به ۱ است.
\`\`\`

---

## ۷. جدول مقایسه جامع نسل‌های حافظه

| بعد فنی | نسل‌های Gen 0 و Gen 1 | نسل Gen 2 | ناحیه LOH | ناحیه POH |
| :--- | :--- | :--- | :--- | :--- |
| **آستانه اندازه اشیاء**| کوچکتر از ۸۵,۰۰۰ بایت | کوچکتر از ۸۵,۰۰۰ بایت | ۸۵,۰۰۰ بایت یا بیشتر | هر اندازه‌ای (با قفل ثابت) |
| **طول عمر پیش‌بینی‌شده**| میلی‌ثانیه (بسیار کوتاه) | بلندمدت | بلندمدت / بافرهای سنگین | مدت زمان عملیات سخت‌افزاری |
| **تکرار دوره‌های GC** | هزاران بار در دقیقه | به ندرت (ساعتی) | همزمان با دوره‌های Gen 2 | همزمان با دوره‌های Gen 2 |
| **نحوه مدیریت فضا** | فشرده‌سازی (Compact) | فشرده‌سازی (Compact) | فقط جاروب (Sweep) | فقط جاروب (عدم جابجایی) |
| **مدت زمان وقفه** | کمتر از ۱ میلی‌ثانیه | ۱۰ تا ۱۰۰ میلی‌ثانیه+ | ۱۰ تا ۱۰۰ میلی‌ثانیه+ | ۱۰ تا ۱۰۰ میلی‌ثانیه+ |
| **ریسک اصلی پروداکشن** | اشباع نرخ تخصیص | وقفه‌های طولانی Stop-World | تکه‌تکه‌شدگی حافظه / OOM | نشت هندل‌های Pinned |`,
};
