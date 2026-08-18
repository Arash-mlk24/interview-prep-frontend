import { RoadmapTopic } from "../../../models";

export const csharpDelegatesLambdasEventsTopic: RoadmapTopic = {
  id: "topic-dotnet-csharp-delegates-lambdas-events",
  stepId: "step-mid-csharp-fundamentals",
  slug: "csharp-delegates-lambdas-events",
  order: 3,
  title: "Delegates, Lambda Expressions, Events & Functional C# Patterns",
  title_fa: "دلیگیت‌ها، توابع لامبدا، رخدادها و الگوهای فانکشنال در سی‌شارپ",
  summary:
    "Master the CLR MulticastDelegate architecture, Roslyn closure display class allocations, thread-safe event patterns, the Lapsed Listener memory leak, and Expression Trees vs Delegates.",
  summary_fa:
    "تسلط عمیق بر معماری داخلی MulticastDelegate در رانتایم CLR، سازوکار تخصیص حافظه DisplayClass در Closureها، پیاده‌سازی رویدادهای ایمن در برابر چندنخی، رفع نشت حافظه Lapsed Listener و مقایسه بنیادین Expression Treeها با Delegates.",
  readingTimeMinutes: 26,
  difficulty: "mid",
  content: `## 1. Evolution: From Unsafe Pointers to Modern Functional C#

In procedural languages like C and C++, callbacks are implemented using raw function pointers. While blazing fast, raw function pointers lack type safety, cannot capture instance context (\`this\`), and risk fatal segmentation faults if pointers point to invalid memory.

C# evolved type-safe function invocations across major releases:

\`\`\`csharp
// 1. C# 1.0: Explicit Named Delegate
public delegate int CalculationHandler(int a, int b);
CalculationHandler calc = new CalculationHandler(AddNumbers);

// 2. C# 2.0: Anonymous Methods (Inline code)
CalculationHandler calcAnon = delegate(int a, int b) { return a + b; };

// 3. C# 3.0: Lambda Expressions & Built-in Generic Delegates
Func<int, int, int> calcLambda = (a, b) => a + b;
Action<string> logMessage = msg => Console.WriteLine(msg);
Predicate<int> isPositive = n => n > 0;

// 4. C# 9.0+: Static Lambdas (Guaranteed Zero-Allocation Closures)
Func<int, int, int> staticCalc = static (a, b) => a + b;
\`\`\`

---

## 2. CLR MulticastDelegate Internal Architecture

![Delegates, Lambda Closures and Events Architecture](/images/roadmaps/csharp-delegates-lambdas-events.jpg)

In .NET, all delegates implicitly derive from \`System.MulticastDelegate\`, which in turn inherits from \`System.Delegate\`. A delegate instance is a reference type allocated on the **Managed Heap** containing three critical internal fields:

\`\`\`csharp
public abstract class Delegate
{
    internal object _target;         // Reference to class instance (null for static methods)
    internal IntPtr _methodPtr;      // Native function pointer to the JIT-compiled method
    internal IntPtr _methodPtrAux;   // Auxiliary pointer for virtual/interface stub calls
}

public abstract class MulticastDelegate : Delegate
{
    internal object _invocationList; // Array of Delegate instances when combined via +=
}
\`\`\`

### Single-Cast vs. Multicast Mechanics
- **Single-Cast**: When a delegate references a single method, \`_invocationList\` is \`null\`. The delegate invokes \`_methodPtr\` directly on \`_target\`.
- **Multicast**: When combining delegates using \`+=\` or \`Delegate.Combine()\`, the CLR allocates a new \`MulticastDelegate\` instance whose \`_invocationList\` holds an array of delegates (\`object[]\`).

\`\`\`csharp
Action actionA = () => Console.WriteLine("A");
Action actionB = () => Console.WriteLine("B");

// Multicast combination (Allocates a new Delegate object on the Heap)
Action multicast = actionA + actionB;
\`\`\`

### Exception Propagation Hazard in Multicast Delegates
When invoking a multicast delegate, the delegates are called sequentially in invocation order. **If any handler throws an unhandled exception, execution immediately halts, and subsequent handlers in the chain are NEVER executed**:

\`\`\`csharp
// HAZARDOUS: If handler 1 throws, handler 2 is skipped!
public void NotifyAll(Action notify) => notify?.Invoke();

// RESILIENT: Manually traverse the invocation list
public void NotifyAllSafely(Action notify)
{
    if (notify == null) return;

    foreach (var handler in notify.GetInvocationList().Cast<Action>())
    {
        try
        {
            handler();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing delegate handler.");
        }
    }
}
\`\`\`

---

## 3. Closures, Scope Captures & The Roslyn Display Class

A **Closure** is created when a lambda expression references variables defined outside its parameter list (outer local variables or \`this\`).

### What Roslyn Synthesizes Under the Hood

When a lambda captures an outer variable, the Roslyn compiler synthesizes a hidden, compiler-generated class called a **Display Class**:

\`\`\`csharp
public Func<int, int> CreateMultiplier(int factor)
{
    // 'factor' is captured by the lambda closure
    return x => x * factor;
}
\`\`\`

#### Decompiled Code Synthesized by Roslyn:
\`\`\`csharp
[CompilerGenerated]
private sealed class <>c__DisplayClass0_0
{
    public int factor; // Captured local variable lifted to a heap field!

    internal int <CreateMultiplier>b__0(int x)
    {
        return x * this.factor;
    }
}

public Func<int, int> CreateMultiplier(int factor)
{
    // Heap allocation on every method invocation!
    var displayClass = new <>c__DisplayClass0_0();
    displayClass.factor = factor;
    return new Func<int, int>(displayClass.<CreateMultiplier>b__0);
}
\`\`\`

### The High-Throughput Allocation Trap
In backend loops handling tens of thousands of requests per second, accidental closures cause continuous Gen 0 garbage collections:

\`\`\`csharp
// BAD: Allocates DisplayClass and Delegate instance on every call!
public void ProcessItems(IEnumerable<Item> items, int threshold)
{
    var filtered = items.Where(i => i.Price > threshold); // Heap allocation per call
}

// OPTIMIZED: Use C# 9+ static lambdas to guarantee zero closure capture at compile time
public void ProcessItemsStatic(IEnumerable<Item> items, int threshold)
{
    // The compiler will throw an error if you try to access 'threshold' directly!
    // Forces passing state explicitly or avoiding allocations
}
\`\`\`

### State-Passing Overloads in High-Performance APIs
Modern .NET APIs provide state-passing delegate overloads to eliminate closure allocations:

\`\`\`csharp
// TRAP: Closures on 'tenantId' allocate DisplayClass
var value = _cache.GetOrAdd(key, k => LoadDataForTenant(k, tenantId));

// OPTIMIZED: Pass 'tenantId' as state argument (Zero allocations)
var valueOpt = _cache.GetOrAdd(
    key, 
    static (k, state) => LoadDataForTenant(k, state), 
    tenantId
);
\`\`\`

---

## 4. Events vs. Raw Delegates: Encapsulation & Thread Safety

An \`event\` is NOT a type; it is a **language modifier** that encapsulates a delegate field, providing compiler-generated \`add\` and \`remove\` accessors (similar to how properties encapsulate private fields).

### The Key Differences:
1. **Encapsulation**: External callers can ONLY subscribe (\`+=\`) or unsubscribe (\`-=\`). They CANNOT invoke (\`MyEvent()\`) or overwrite (\`MyEvent = null\`) the event from outside the declaring class.
2. **Thread Safety**: The Roslyn compiler generates thread-safe \`add\` and \`remove\` accessors utilizing \`Interlocked.CompareExchange\` to prevent race conditions during concurrent subscriptions.

\`\`\`csharp
public class PaymentGateway
{
    // Raw Delegate (DANGEROUS): Anyone can overwrite or invoke directly
    public Action<decimal>? OnPaymentProcessedUnsafe;

    // Encapsulated Event (SAFE): External classes can only subscribe/unsubscribe
    public event Action<decimal>? OnPaymentProcessed;

    public void Process(decimal amount)
    {
        // Thread-safe invocation using Null-conditional operator
        OnPaymentProcessed?.Invoke(amount);
    }
}
\`\`\`

---

## 5. The Lapsed Listener Problem (Event Memory Leaks)

The **Lapsed Listener Problem** is one of the most common and pernicious memory leaks in .NET applications.

### Root Cause Mechanics:
When a short-lived object (e.g. Scoped Service, UI View, Component) subscribes to an event on a long-lived object (e.g. Singleton Cache, System Monitor):

\`\`\`csharp
public class OrderProcessingService // Scoped Lifetime (Short-lived)
{
    public OrderProcessingService(GlobalEventBus globalBus) // Singleton Lifetime (Long-lived)
    {
        // BUG: globalBus._invocationList now holds a strong reference to THIS instance!
        globalBus.SystemAlert += HandleAlert;
    }

    private void HandleAlert(string message) { /* ... */ }
}
\`\`\`

Because \`globalBus\` holds a strong reference to \`OrderProcessingService\` via the delegate's \`_target\` field, the **Garbage Collector can NEVER reclaim \`OrderProcessingService\`**, causing memory leaks until the entire application terminates!

### Prevention Strategies:
1. **Explicit Unsubscription via \`IDisposable\`**:
   \`\`\`csharp
   public void Dispose()
   {
       _globalBus.SystemAlert -= HandleAlert;
   }
   \`\`\`
2. **In-Process Decoupled Event Buses (MediatR)**:
   Replace direct C# event subscriptions with MediatR \`INotification\` and \`INotificationHandler<T>\`.

---

## 6. Delegates (\`Func<T, bool>\`) vs. Expression Trees (\`Expression<Func<T, bool>>\`)

Understanding this distinction is vital for mastering Entity Framework Core:

| Dimension | Delegate (\`Func<T, bool>\`) | Expression Tree (\`Expression<Func<T, bool>>\`) |
| :--- | :--- | :--- |
| **Data Representation** | Compiled IL Machine Code | Abstract Syntax Tree (AST) Data Structure |
| **Inspection** | Black box (cannot inspect code) | Inspectable at runtime (Nodes, Properties, Operators) |
| **Execution** | Direct invocation in RAM | Translated into SQL or compiled dynamically at runtime |
| **Use Case** | LINQ-to-Objects (In-Memory) | EF Core LINQ Provider (Database Translation) |

\`\`\`csharp
// 1. Compiled Delegate: In-Memory execution
Func<User, bool> inMemoryFilter = u => u.Age > 18;
var adults = usersList.Where(inMemoryFilter); // Evaluated in C# memory

// 2. Expression Tree: Analyzed by EF Core to generate SQL "WHERE [Age] > 18"
Expression<Func<User, bool>> dbFilter = u => u.Age > 18;
var adultsDb = dbContext.Users.Where(dbFilter); // Executed in SQL Server
\`\`\`

---

## 7. Functional C# Architectural Patterns: The Result Pattern

Modern C# enterprise architectures embrace functional error handling to replace expensive exception throwing:

\`\`\`csharp
public readonly record struct Result<TValue, TError>
{
    public bool IsSuccess { get; }
    public TValue Value { get; }
    public TError Error { get; }

    private Result(TValue value) => (IsSuccess, Value, Error) = (true, value, default!);
    private Result(TError error) => (IsSuccess, Value, Error) = (false, default!, error);

    public static Result<TValue, TError> Success(TValue value) => new(value);
    public static Result<TValue, TError> Failure(TError error) => new(error);

    // Monadic Bind / FlatMap
    public Result<TOut, TError> Bind<TOut>(Func<TValue, Result<TOut, TError>> next) =>
        IsSuccess ? next(Value) : Result<TOut, TError>.Failure(Error);
}
\`\`\`

---

## 8. Master Comparison Matrix for Callbacks in .NET

| Mechanism | Allocation Cost | Performance | Type Safety | Encapsulation | Best Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`Action<T>\` / \`Func<T>\` | Heap allocation for delegate | Fast direct call | High | Open (No encapsulation) | Method arguments, strategies, pipelines |
| \`static (x) => ...\` | **Zero allocations** | Blazing fast | High | Open | Hot paths, concurrent caches, timers |
| \`event Action<T>\` | Heap allocation | Fast sequential | High | **Strict (\`+=\` / \`-=\` only)** | Publisher-subscriber, domain notifications |
| \`delegate*<T, R>\` (C# 9) | **Zero allocations** | Native pointer speed | Unmanaged | None | Interop, low-level game/engine hot paths |
| \`Expression<Func<T>>\` | Heap AST allocations | Slow (Parsing AST) | High | Open | EF Core database query translation |`,
  content_fa: `## ۱. سیر تکامل: از اشاره‌گرهای ناامن تا سی‌شارپ مدرن

در زبان‌هایی مانند C و C++، توابع فراخوان (Callback) از طریق اشاره‌گرهای خام به توابع (Function Pointers) پیاده‌سازی می‌شدند. با وجود سرعت بالا، این اشاره‌گرها فاقد Type Safety بودند و قادر به نگهداری کانتکست شیء (\`this\`) نبودند.

سی‌شارپ این ساختار را در طول نسخه‌های مختلف تکامل داد:

\`\`\`csharp
// ۱. دات‌نت ۱.۰: دلیگیت صریح و نام‌دار
public delegate int CalculationHandler(int a, int b);
CalculationHandler calc = new CalculationHandler(AddNumbers);

// ۲. دات‌نت ۲.۰: متدهای بی‌نام (Anonymous Methods)
CalculationHandler calcAnon = delegate(int a, int b) { return a + b; };

// ۳. دات‌نت ۳.۰: توابع لامبدا و دلیگیت‌های جنریک استاندارد
Func<int, int, int> calcLambda = (a, b) => a + b;
Action<string> logMessage = msg => Console.WriteLine(msg);
Predicate<int> isPositive = n => n > 0;

// ۴. دات‌نت ۹.۰ به بعد: لامبداهای استاتیک (بدون تخصیص حافظه در Closure)
Func<int, int, int> staticCalc = static (a, b) => a + b;
\`\`\`

---

## ۲. معماری داخلی MulticastDelegate در رانتایم CLR

![Delegates, Lambda Closures and Events Architecture](/images/roadmaps/csharp-delegates-lambdas-events.jpg)

در دات‌نت تمامی دلیگیت‌ها از کلاس \`System.MulticastDelegate\` و آن هم از \`System.Delegate\` ارث‌بری می‌کنند. هر شیء دلیگیت یک Reference Type است که روی **Managed Heap** ساخته شده و شامل سه فیلد اساسی است:

\`\`\`csharp
public abstract class Delegate
{
    internal object _target;         // ارجاع به نمونه شیء (null برای متدهای استاتیک)
    internal IntPtr _methodPtr;      // اشاره‌گر کد ماشین JIT به متد
}

public abstract class MulticastDelegate : Delegate
{
    internal object _invocationList; // آرایه‌ای از دلیگیت‌ها در زمان ترکیب با +=
}
\`\`\`

### سازوکار Single-Cast در برابر Multicast:
- **Single-Cast**: زمانی که دلیگیت به یک متد اشاره دارد، مقدار \`_invocationList\` برابر \`null\` است و متد مستقیماً روی \`_target\` فراخوانی می‌شود.
- **Multicast**: با اضافه کردن متدها از طریق \`+=\` یا \`Delegate.Combine\`، یک شیء جدید روی Heap ساخته شده و فیلد \`_invocationList\` آرایه‌ای از دلیگیت‌ها را نگهداری می‌کند.

### خطای انتشار Exception در دلیگیت‌های چندگانه:
در صورت فراخوانی دلیگیت Multicast، متدها به ترتیب اجرا می‌شوند. **اگر یکی از متدها با Exception روبرو شود، اجرای زنجیره بلافاصله متوقف شده و متدهای بعدی اجرا نخواهند شد**:

\`\`\`csharp
// اجرای امن با پیمایش دستی InvocationList
public void NotifyAllSafely(Action notify)
{
    if (notify == null) return;

    foreach (var handler in notify.GetInvocationList().Cast<Action>())
    {
        try
        {
            handler();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "خطا در اجرای هندلر رویداد.");
        }
    }
}
\`\`\`

---

## ۳. بررسی Closureها و ساختار کلاس DisplayClass در کامپایلر Roslyn

یک **Closure** زمانی شکل می‌گیرد که یک تابع لامبدا از متغیرهای خارج از حوزه پارامترهای خود (متغیرهای محلی یا \`this\`) استفاده کند.

### کدهای تولیدشده توسط Roslyn در پشت صحنه

هنگام استفاده از متغیر محلی در لامبدا، کامپایلر Roslyn یک کلاس مخفی با عنوان **Display Class** تولید می‌کند:

\`\`\`csharp
public Func<int, int> CreateMultiplier(int factor)
{
    // متغیر factor توسط لامبدا Capture شده است
    return x => x * factor;
}
\`\`\`

#### کد تبدیل‌شده توسط کامپایلر:
\`\`\`csharp
[CompilerGenerated]
private sealed class <>c__DisplayClass0_0
{
    public int factor; // متغیر محلی به یک فیلد روی Heap تبدیل می‌شود!

    internal int <CreateMultiplier>b__0(int x) => x * this.factor;
}

public Func<int, int> CreateMultiplier(int factor)
{
    var displayClass = new <>c__DisplayClass0_0(); // تخصیص شیء روی Heap در هر بار اجرا!
    displayClass.factor = factor;
    return new Func<int, int>(displayClass.<CreateMultiplier>b__0);
}
\`\`\`

### بهینه‌سازی در پردازش‌های پرترافیک:
برای جلوگیری از تخصیص بیهوده شیء DisplayClass در حلقه‌ها و Hot Pathها:
۱. از **Static Lambda** (\`static (a, b) => ...\`) استفاده کنید تا کامپایلر اجازه دسترسی به متغیرهای بیرونی را ندهد.
۲. از متدهای دارای پارامتر State (مانند \`ConcurrentDictionary.GetOrAdd\`) استفاده کنید.

\`\`\`csharp
// بدون تخصیص حافظه با ارسال وضعیت (State):
var value = _cache.GetOrAdd(
    key, 
    static (k, state) => LoadDataForTenant(k, state), 
    tenantId
);
\`\`\`

---

## ۴. مقایسه رویدادها (Events) با دلیگیت‌های خام: کپسوله‌سازی و ایمنی نخ‌ها

کلمه کلیدی \`event\` یک نوع داده نیست، بلکه یک **پیراینده (Modifier)** است که فیلد دلیگیت را کپسوله کرده و اکسسورهای \`add\` و \`remove\` مشابه Propertyها می‌سازد.

### تفاوت‌های بنیادین:
۱. **کپسوله‌سازی کامل**: کدهای خارجی صرفاً مجاز به ثبت اشتراک (\`+=\`) یا لغو آن (\`-=\`) هستند. آنها نمی‌توانند رویداد را از بیرون \`null\` کرده یا صدا بزنند (\`Invoke\`).
۲. **ایمنی در برابر چندنخی (Thread Safety)**: کامپایلر اکسسورهای رویداد را با \`Interlocked.CompareExchange\` پیاده‌سازی می‌کند تا ثبت و لغو اشتراک همزمان بدون قفل‌گذاری سنگین ایمن باشد.

\`\`\`csharp
public class PaymentGateway
{
    // رویداد کپسوله‌شده ایمن
    public event Action<decimal>? OnPaymentProcessed;

    public void Process(decimal amount)
    {
        // فراخوانی ایمن با عملگر Null-conditional
        OnPaymentProcessed?.Invoke(amount);
    }
}
\`\`\`

---

## ۵. چالش نشت حافظه در رویدادها (Lapsed Listener Problem)

مشکل **Lapsed Listener** یکی از شایع‌ترین علل نشت حافظه در سیستم‌های دات‌نت است.

### ریشه مشکل:
هنگامی که یک شیء با طول عمر کوتاه (مانند Scoped Service یا کنترلر) به رویداد یک شیء با طول عمر طولانی (مانند Singleton Service یا EventBus عمومی) متصل می‌شود:

\`\`\`csharp
public class OrderService // Scoped Lifetime (کوتاه مدت)
{
    public OrderService(GlobalEventBus globalBus) // Singleton Lifetime (طولانی مدت)
    {
        // شیء globalBus اکنون یک رفرنس قوی به این کنترلر نگه می‌دارد!
        globalBus.SystemAlert += HandleAlert;
    }
}
\`\`\`

از آنجا که فیلد \`_target\` دلیگیت در شیء Singleton به نمونه \`OrderService\` اشاره دارد، **Garbage Collector هرگز نمی‌تواند آن را جمع‌آوری کند** و در رم باقی می‌ماند!

### راهکارهای پیشگیری:
۱. پیاده‌سازی اینترفیس \`IDisposable\` و لغو صریح اشتراک با \`-=\`.
۲. جایگزینی رویدادهای سنتی C# با سیستم‌های پیام‌رسانی درون‌برنامه‌ای نامتمرکز مانند **MediatR** (\`INotification\`).

---

## ۶. دلیگیت‌ها (\`Func<T, bool>\`) در برابر درخت‌های عبارت (\`Expression<Func<T, bool>>\`)

| بعد مقایسه | دلیگیت (\`Func<T, bool>\`) | درخت عبارت (\`Expression<Func<T, bool>>\`) |
| :--- | :--- | :--- |
| **نمایش داده** | کد باینری کامپایل‌شده IL | ساختار داده درختی انتزاعی (AST) |
| **بررسی‌پذیری** | جعبه سیاه (غیرقابل آنالیز کد) | کاملاً قابل پیمایش و بررسی نودها در زمان اجرا |
| **محل اجرا** | اجرای مستقیم در حافظه رم (RAM) | ترجمه به کوئری‌های SQL در EF Core یا کامپایل پویا |
| **کاربرد اصلی** | پردازش‌های درون حافظه (LINQ to Objects) | پرووایدرهای دیتابیس (LINQ to Entities) |

---

## ۷. ماتریس مقایسه سازوکارهای Callback در دات‌نت

| سازوکار | هزینه تخصیص حافظه | کارایی | امنیت نوع (Type Safety) | کپسوله‌سازی | بهترین سناریو |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`Action<T>\` / \`Func<T>\` | تخصیص شیء دلیگیت روی Heap | سریع | بالا | آزاد (فاقد کپسوله‌سازی) | پارامترهای متد، پایپ‌لاین‌ها، Strategy |
| \`static (x) => ...\` | **صفر تخصیص حافظه** | فوق‌سریع | بالا | آزاد | مسیرهای پرتردد (Hot Paths)، کش‌ها |
| \`event Action<T>\` | تخصیص شیء دلیگیت | سریع ترتیبی | بالا | **کامل (فقط \`+=\` و \`-=\`)** | الگوهای ناشر-مشترک، نوتیفیکیشن‌ها |
| \`Expression<Func<T>>\` | تخصیص نودهای درخت در رم | سنگین‌تر (نیاز به تحلیل) | بالا | آزاد | تبدیل کدهای C# به SQL در EF Core |`,
};
