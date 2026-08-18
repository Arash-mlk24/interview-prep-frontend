import { RoadmapTopic } from "../../../models";

export const csharpGenericsCollectionsLinqTopic: RoadmapTopic = {
  id: "topic-dotnet-csharp-generics-collections-linq",
  stepId: "step-mid-csharp-fundamentals",
  slug: "csharp-generics-collections-linq",
  order: 2,
  title: "Generics, Collections Internals & LINQ Execution Model",
  title_fa: "جنریک‌ها، معماری داخلی کالکشن‌ها و مدل اجرای LINQ",
  summary:
    "Master CLR Generics JIT specialization, internal data structures of List, Dictionary, and HashSet, modern .NET 8/9 Frozen collections, CollectionsMarshal, and the LINQ deferred execution state machine.",
  summary_fa:
    "تسلط عمیق بر مکانیزم‌های کامپایل و تخصص‌یافتگی JIT در جنریک‌ها، معماری داخلی و ساختار حافظه List، Dictionary و HashSet، کالکشن‌های مدرن Frozen در دات‌نت ۸ و ۹، بهینه‌سازی‌های CollectionsMarshal و مدل اجرای تنبل (Deferred Execution) در موتور LINQ.",
  readingTimeMinutes: 28,
  difficulty: "mid",
  content: `## 1. Evolution & The Historical Problem Statement

In the early days of .NET 1.0 and 1.1, the CLR lacked support for parametric polymorphism (Generics). Data structures resided in the \`System.Collections\` namespace and operated purely on \`System.Object\`:

\`\`\`csharp
// The Pre-Generics Era (.NET 1.1)
ArrayList numbers = new ArrayList();
numbers.Add(42);       // BOXING: int value copied from Stack to Managed Heap (Gen 0)
numbers.Add("invalid"); // Compiles successfully, but creates runtime type-safety hazards

int value = (int)numbers[0]; // UNBOXING + DOWNCASTING: Type verification at runtime
\`\`\`

This architecture suffered from two catastrophic shortcomings:
1. **Severe Memory & GC Penalties**: Every value type (\`int\`, \`DateTime\`, custom structs) added to an \`ArrayList\` or \`Hashtable\` triggered a heap allocation (Boxing). In high-throughput backend services handling tens of thousands of requests per second, this induced aggressive Gen 0 Garbage Collection churn and fragmented the managed heap.
2. **Lack of Compile-Time Type Safety**: Developers were forced to write defensive type-checking and explicit casts. Passing an incompatible object caused runtime \`InvalidCastException\` crashes in production.

C# 2.0 and the CLR 2.0 runtime introduced **Reified Generics**—preserving full type information at runtime without the type erasure seen in languages like Java.

---

## 2. CLR Runtime Generics Architecture & JIT Specialization

![Generics, Collections Memory Layout and LINQ Architecture](/images/roadmaps/csharp-generics-collections-linq.jpg)

### JIT Code Generation: Value Types vs. Reference Types

When the JIT (Just-In-Time) compiler compiles a generic type or method (e.g. \`List<T>\`), it uses two fundamentally different strategies depending on whether \`T\` is a **Value Type** or a **Reference Type**:

1. **Value Type Specialization (Exact Native Code Generation)**:
   - For every distinct value type parameter (\`int\`, \`double\`, \`Guid\`, \`DateTime\`, or custom \`struct\`), the JIT compiler produces a dedicated, distinct machine code method table.
   - Because value types differ in physical byte size and stack layout (\`int\` is 4 bytes, \`Guid\` is 16 bytes), the machine code operates directly on raw memory without pointer indirection, enabling CPU register caching, loop unrolling, and SIMD hardware acceleration.
2. **Reference Type Canonical Code Sharing (\`List<object>\`)**:
   - For all reference types (\`string\`, \`Customer\`, \`Order\`, \`HttpContext\`), the pointer size is identical (8 bytes on 64-bit architectures).
   - To prevent native code bloat, the JIT compiles a single, shared canonical machine code implementation. The specific \`MethodTable*\` pointer is passed as a hidden runtime parameter to differentiate types and enforce type boundaries.

\`\`\`csharp
// Runtime JIT behavior:
List<int> intList = new();       // Unique JIT specialized machine code (4 bytes per element)
List<Guid> guidList = new();     // Unique JIT specialized machine code (16 bytes per element)
List<string> strList = new();     // Shares canonical pointer code with List<object>
List<Customer> custList = new(); // Shares canonical pointer code with List<object>
\`\`\`

### Generic Type Constraints

Generic constraints enforce compile-time contracts on generic type arguments, allowing direct access to methods, constructors, and memory layouts without reflection:

\`\`\`csharp
public interface IEntity<TKey>
{
    TKey Id { get; }
}

public class BaseRepository<TEntity, TKey> 
    where TEntity : class, IEntity<TKey>, new() // Reference type, implements interface, parameterless constructor
    where TKey : struct, IEquatable<TKey>      // Value type, equatable
{
    public TEntity CreateInstance(TKey id)
    {
        var entity = new TEntity();
        return entity;
    }
}
\`\`\`

#### Modern Generic Math in .NET 7/8/9
Starting in .NET 7, C# introduced **Static Abstract Members in Interfaces**, enabling **Generic Math** (\`INumber<T>\`, \`IBinaryInteger<T>\`, \`IFloatingPoint<T>\`):

\`\`\`csharp
using System.Numerics;

public static class MathAlgorithms
{
    // High-performance generic algorithm working over int, double, decimal, Half, Int128
    public static T SumArray<T>(ReadOnlySpan<T> values) where T : INumber<T>
    {
        T sum = T.Zero;
        foreach (var value in values)
        {
            sum += value; // Resolved statically at compile-time with zero virtual dispatch!
        }
        return sum;
    }
}
\`\`\`

---

## 3. Generic Variance: Covariance, Contravariance & Invariance

Variance specifies how subtyping between more complex types relates to subtyping between their component types.

| Variance Mode | Keyword | Position | Definition | Supported Types |
| :--- | :--- | :--- | :--- | :--- |
| **Covariance** | \`out T\` | **Output / Return Only** | Preserves inheritance hierarchy: \`Base = Derived\` | Generic Interfaces & Delegates |
| **Contravariance** | \`in T\` | **Input / Parameter Only** | Reverses inheritance hierarchy: \`Derived = Base\` | Generic Interfaces & Delegates |
| **Invariance** | *(None)* | **Input and Output** | Exact type match required | Classes, Structs, Invariant Interfaces |

### 1. Covariance (\`out T\`):
Enables assigning a more derived generic instance to a less derived generic variable:

\`\`\`csharp
// IEnumerable<out T> is covariant
IEnumerable<string> strings = new List<string> { "Hello", "World" };
IEnumerable<object> objects = strings; // Valid because string IS-A object
\`\`\`

### 2. Contravariance (\`in T\`):
Enables assigning a less derived generic instance to a more derived generic variable:

\`\`\`csharp
// IComparer<in T> is contravariant
public class AnimalComparer : IComparer<Animal>
{
    public int Compare(Animal? x, Animal? y) => string.Compare(x?.Name, y?.Name, StringComparison.Ordinal);
}

IComparer<Dog> dogComparer = new AnimalComparer(); // Valid: can compare Dogs using Animal comparer!
\`\`\`

### 3. Why Classes Are Strictly Invariant:
If \`List<T>\` were covariant, runtime memory corruption would occur:

\`\`\`csharp
List<Dog> dogs = new List<Dog>();
// If List<T> allowed covariance:
// List<Animal> animals = dogs; 
// animals.Add(new Cat()); // DISASTER: A Cat is inserted into a List<Dog>!
\`\`\`

---

## 4. Internal Architecture of Core Collections

### 1. \`List<T>\` (Contiguous Dynamic Array)

Under the hood, \`List<T>\` is a thin wrapper over a contiguous managed array:

\`\`\`csharp
public class List<T>
{
    internal T[] _items;
    internal int _size;
    internal int _version;
}
\`\`\`

#### Key Mechanics:
- **Growth Policy**: Starts with capacity 0. Upon the first \`Add()\`, it allocates an array of capacity 4. When full, capacity **doubles** (4 -> 8 -> 16 -> 32 -> ...).
- **Resize Overhead**: Resizing allocates a brand new array on the Heap and invokes \`Array.Copy()\` / \`Buffer.Memmove()\` to copy all existing elements.
- **Enumeration Safety**: The \`_version\` counter increments on every mutating operation (\`Add\`, \`Remove\`, \`Clear\`, \`Sort\`). If a \`foreach\` loop detects a \`_version\` change during iteration, it throws \`InvalidOperationException: Collection was modified\`.

\`\`\`csharp
// BAD: Triggers multiple reallocations and GC Gen 0 churn
List<OrderDto> orders = new List<OrderDto>(); // Initial capacity = 0
for (int i = 0; i < 10_000; i++)
{
    orders.Add(FetchOrder(i)); // Reallocates array ~14 times!
}

// OPTIMIZED: Pre-allocate capacity when size is known
List<OrderDto> optimizedOrders = new List<OrderDto>(10_000); // 1 allocation, 0 copies
\`\`\`

---

### 2. \`Dictionary<TKey, TValue>\` & \`HashSet<T>\` (Hash Table with Chaining)

The .NET \`Dictionary<TKey, TValue>\` uses a high-performance **Separate Chaining with Flat Struct Arrays** architecture. It does NOT allocate individual node objects on the heap.

\`\`\`csharp
public class Dictionary<TKey, TValue>
{
    private int[] _buckets;      // Array of 1-based indices pointing into _entries
    private Entry[] _entries;    // Flat array of struct entries
    private int _count;
    private int _freeList;       // Head index of deleted slots for reuse
    private int _version;

    private struct Entry
    {
        public uint HashCode;
        public int Next;         // Index of next entry in collision chain (-1 if last)
        public TKey Key;
        public TValue Value;
    }
}
\`\`\`

#### Lookup Mechanics (\`O(1)\` Average):
1. **Hash Code Calculation**: Computes \`uint hashCode = (uint)comparer.GetHashCode(key)\`.
2. **Bucket Mapping**: Computes bucket index \`int bucket = (int)(hashCode % _buckets.Length)\`.
3. **Chain Traversal**: Traverses \`_entries\` starting from \`_buckets[bucket] - 1\`, following \`entry.Next\` pointers until an entry with identical \`HashCode\` and \`Key\` (via \`EqualityComparer<TKey>.Default.Equals\`) is found.
4. **Collision Handling**: Colliding entries are appended to the linked chain in the flat \`_entries\` array.
5. **Load Factor & Resize**: When \`_count == _entries.Length\`, the dictionary expands its arrays to the **next prime number** greater than 2 * capacity and re-hashes all entries.

---

## 5. High-Performance Collections in Modern .NET 8/9

### 1. \`FrozenDictionary<TKey, TValue>\` & \`FrozenSet<T>\` (\`System.Collections.Frozen\`)

For immutable lookup data configured at application startup (e.g. permission lookup tables, ISO country mappings, routing tables), standard \`Dictionary\` has lookup overhead.

.NET 8 introduced **Frozen Collections**, which analyze keys during construction to build **perfect hash functions**, specialized string hashers, and jump tables:

\`\`\`csharp
using System.Collections.Frozen;

public class SecurityPolicyService
{
    private static readonly FrozenDictionary<string, PermissionLevel> RolePermissions = 
        new Dictionary<string, PermissionLevel>
        {
            ["Admin"] = PermissionLevel.FullAccess,
            ["Moderator"] = PermissionLevel.Write,
            ["Viewer"] = PermissionLevel.Read
        }.ToFrozenDictionary(StringComparer.OrdinalIgnoreCase);

    public PermissionLevel GetPermission(string role)
    {
        // Up to 2x to 3x faster lookups with zero lock overhead and zero memory mutations
        return RolePermissions.GetValueOrDefault(role, PermissionLevel.None);
    }
}
\`\`\`

### 2. \`CollectionsMarshal\` for Zero-Copy Hot Paths (\`System.Runtime.InteropServices\`)

In ultra-low-latency backend code, standard dictionary access performs redundant lookups when updating values. \`CollectionsMarshal\` gives direct reference access:

\`\`\`csharp
using System.Runtime.InteropServices;

public class MetricsAggregator
{
    private readonly Dictionary<string, RequestMetrics> _metrics = new();

    public void RecordLatency(string endpoint, double latencyMs)
    {
        // Get ref to struct directly inside the dictionary's internal array!
        ref var entry = ref CollectionsMarshal.GetValueRefOrNullRef(_metrics, endpoint);
        
        if (System.Runtime.CompilerServices.Unsafe.IsNullRef(ref entry))
        {
            // Key does not exist; insert new
            _metrics[endpoint] = new RequestMetrics { TotalRequests = 1, TotalLatencyMs = latencyMs };
        }
        else
        {
            // Mutate in-place without double hash lookup or struct copying!
            entry.TotalRequests++;
            entry.TotalLatencyMs += latencyMs;
        }
    }
}
\`\`\`

---

## 6. LINQ Execution Model & The \`yield return\` State Machine

### Deferred Execution (Lazy Evaluation) vs. Immediate Execution

LINQ queries operate on \`IEnumerable<T>\` interfaces. LINQ methods do not execute when defined; they execute **pull-based** item-by-item when consumed:

\`\`\`csharp
List<int> numbers = new() { 1, 2, 3, 4, 5 };

// 1. Query Definition (Zero work done, 0 allocations)
var query = numbers
    .Where(n => n % 2 == 0) // Streaming operator (Deferred)
    .Select(n => n * 10);   // Streaming operator (Deferred)

// 2. Query Execution (Pulls items one at a time via MoveNext())
foreach (var item in query)
{
    Console.WriteLine(item);
}
\`\`\`

#### Operator Categories:
- **Deferred Streaming Operators**: \`Where\`, \`Select\`, \`Take\`, \`Skip\`, \`Cast\`, \`OfType\` (process items lazily one by one on-demand).
- **Deferred Buffering Operators**: \`OrderBy\`, \`OrderByDescending\`, \`GroupBy\`, \`Reverse\` (must consume all upstream elements into memory before yielding the first output).
- **Immediate Execution Operators**: \`ToList()\`, \`ToArray()\`, \`ToDictionary()\`, \`Count()\`, \`Sum()\`, \`First()\`, \`Any()\`, \`All()\` (consume the whole enumeration immediately and produce a materialized result).

### The Compiler \`yield return\` State Machine

When a method uses \`yield return\`, the Roslyn compiler synthesizes a private state machine class implementing \`IEnumerable<T>\`, \`IEnumerator<T>\`, and \`IDisposable\`:

\`\`\`csharp
public static IEnumerable<int> GenerateEvenNumbers(int max)
{
    for (int i = 0; i < max; i++)
    {
        if (i % 2 == 0)
            yield return i;
    }
}
\`\`\`

#### What the Roslyn Compiler Emits (Conceptual):
\`\`\`csharp
[CompilerGenerated]
private sealed class <GenerateEvenNumbers>d__0 : IEnumerable<int>, IEnumerator<int>
{
    private int <>1__state;
    private int <>2__current;
    public int max;
    private int <i>5__1;

    public bool MoveNext()
    {
        switch (<>1__state)
        {
            case 0:
                <>1__state = -1;
                <i>5__1 = 0;
                break;
            case 1:
                <>1__state = -1;
                <i>5__1++;
                break;
            default:
                return false;
        }

        while (<i>5__1 < max)
        {
            if (<i>5__1 % 2 == 0)
            {
                <>2__current = <i>5__1;
                <>1__state = 1; // Yield state: pause execution and return true
                return true;
            }
            <i>5__1++;
        }
        return false;
    }
}
\`\`\`

---

## 7. Common Anti-Patterns & Production Pitfalls

### Pitfall 1: Multiple Enumeration of Deferred Queries

\`\`\`csharp
// DANGEROUS: Executes the query (and potential DB/HTTP calls) multiple times
public async Task ProcessOrdersAsync(IEnumerable<Order> ordersQuery)
{
    if (!ordersQuery.Any()) // Enumeration #1
        return;

    var total = ordersQuery.Sum(o => o.TotalAmount); // Enumeration #2

    foreach (var order in ordersQuery) // Enumeration #3
    {
        await SendInvoiceAsync(order);
    }
}

// CORRECT: Materialize once if iterating multiple times
public async Task ProcessOrdersOptimizedAsync(IEnumerable<Order> ordersQuery)
{
    var ordersList = ordersQuery as IReadOnlyList<Order> ?? ordersQuery.ToList();
    
    if (ordersList.Count == 0)
        return;

    var total = ordersList.Sum(o => o.TotalAmount);
    foreach (var order in ordersList)
    {
        await SendInvoiceAsync(order);
    }
}
\`\`\`

### Pitfall 2: Mutable Keys in Dictionaries

\`\`\`csharp
public class UserKey
{
    public string Username { get; set; } // Mutable!
    public override int GetHashCode() => Username.GetHashCode();
}

var dict = new Dictionary<UserKey, UserData>();
var key = new UserKey { Username = "alice" };
dict[key] = new UserData();

// Mutating the key after insertion:
key.Username = "bob"; // HashCode changed!

// dict[key] now throws KeyNotFoundException because the bucket lookup targets the wrong index!
\`\`\`

**Rule**: Dictionary keys must ALWAYS be **immutable** (use \`string\`, \`Guid\`, \`int\`, or \`readonly record struct\`).

---

## 8. Master Decision Matrix for .NET Collections

| Collection Type | Internal Structure | Lookup Complexity | Append / Insert | Thread Safety | Optimal Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`T[]\` | Contiguous Array | \`O(1)\` by index | Immutable fixed size | Read-only thread safe | Fixed-size high-performance buffers |
| \`List<T>\` | Dynamic Array | \`O(1)\` by index | Amortized \`O(1)\` | No | General-purpose sequential lists |
| \`Dictionary<K, V>\` | Buckets + Entries | \`O(1)\` average | \`O(1)\` average | No | Fast key-value lookups & caches |
| \`HashSet<T>\` | Buckets + Slots | \`O(1)\` average | \`O(1)\` average | No | Uniqueness enforcement & set operations |
| \`FrozenDictionary<K, V>\` | Perfect Hash / Table | \`O(1)\` ultra-fast | Immutable | **Yes (Read-Only)** | Static lookups configured at startup |
| \`ImmutableArray<T>\` | Struct wrapping \`T[]\` | \`O(1)\` by index | \`O(N)\` on modification | **Yes (Lock-Free)** | Multi-threaded read-heavy datasets |
| \`ConcurrentDictionary<K, V>\` | Striped Fine-Grained Locks | \`O(1)\` average | \`O(1)\` average | **Yes (Thread-Safe)** | High-concurrency multi-threaded writes |`,
  content_fa: `## ۱. سیر تکامل و چرایی معرفی Generics

در نسخه‌های اولیه دات‌نت (۱.۰ و ۱.۱)، موتور رانتایم CLR فاقد قابلیت برنامه‌نویسی جنریک بود. تمامی ساختارهای داده در فضای نام \`System.Collections\` (نظیر \`ArrayList\` و \`Hashtable\`) صرفاً بر مبنای نوع عمومی \`System.Object\` کار می‌کردند:

\`\`\`csharp
// دوران پیش از Generics (.NET 1.1)
ArrayList numbers = new ArrayList();
numbers.Add(42);       // Boxing: کپی داده از Stack به Managed Heap در Gen 0
numbers.Add("invalid"); // بدون خطای کامپایل، اما خطرساز در زمان اجرا

int value = (int)numbers[0]; // Unboxing و Downcasting: بررسی نوع داده در زمان اجرا
\`\`\`

این معماری دو مشکل بزرگ ایجاد می‌کرد:
۱. **افت شدید کارایی و فشار بر Garbage Collector**: هر نوع مقداری (Value Type مانند \`int\` یا \`DateTime\`) در زمان افزودن به کالکشن به شیء روی Heap تبدیل می‌شد (Boxing). در سیستم‌های با بار ترافیکی بالا، این عمل باعث فعال شدن مکرر GC در نسل صفر (Gen 0) و تکه‌تکه شدن حافظه می‌شد.
۲. **نبود امنیت نوع داده در زمان کامپایل (Type Safety)**: کامپایلر نمی‌توانست نوع داده‌ها را بررسی کند و قرار گرفتن شیء نامعتبر در لیست باعث پرتاب خطای \`InvalidCastException\` در محیط پروداکشن می‌شد.

با معرفی C# 2.0، قابلیت **Reified Generics** به دات‌نت اضافه شد که بر خلاف Type Erasure در جاوا، اطلاعات نوع داده را به طور کامل در سطح IL و رانتایم حفظ می‌کند.

---

## ۲. معماری داخلی رانتایم CLR و تخصص‌یافتگی JIT (JIT Specialization)

![Generics, Collections Memory Layout and LINQ Architecture](/images/roadmaps/csharp-generics-collections-linq.jpg)

### سازوکار کامپایلر JIT: انواع مقداری در برابر انواع ارجاعی

کامپایلر JIT در زمان اجرای کدهای جنریک (مانند \`List<T>\`) از دو استراتژی مجزا استفاده می‌کند:

۱. **تخصص‌یافتگی کامل برای Value Typeها (Specialization)**:
   - برای هر نوع مقداری اختصاصی (\`int\`، \`Guid\`، \`DateTime\` یا استراکت‌های سفارشی)، کامپایلر JIT یک نسخه کد ماشین (Native Machine Code) کاملاً مجزا و بهینه‌سازی‌شده تولید می‌کند.
   - از آنجا که اندازه فیزیکی بایت‌ها در استراکت‌ها متفاوت است، کد ماشین مستقیماً روی بایت‌های حافظه بدون واسطه اشاره‌گر اجرا می‌شود و امکان استفاده از رجیسترهای CPU و دستورات برداری SIMD را فراهم می‌سازد.
۲. **کد ماشین اشتراکی برای Reference Typeها (Canonical Code Sharing)**:
   - برای تمامی انواع ارجاعی (\`string\`، \`Customer\`، \`Order\`)، اندازه اشاره‌گر در معماری ۶۴ بیتی ثابت و ۸ بایت است.
   - جهت جلوگیری از بزرگ شدن بیهوده حجم فایل باینری در رم، JIT صرفاً یک پیاده‌سازی اشتراکی (\`List<object>\`) کامپایل می‌کند و برای تفکیک انواع، یک اشاره‌گر به \`MethodTable*\` نوع مقصد را به عنوان پارامتر پنهان به متدها ارسال می‌نماید.

\`\`\`csharp
// رفتار کامپایلر JIT در زمان اجرا:
List<int> intList = new();       // تولید کد ماشین اختصاصی (۴ بایت به ازای هر عنصر)
List<Guid> guidList = new();     // تولید کد ماشین اختصاصی (۱۶ بایت به ازای هر عنصر)
List<string> strList = new();     // استفاده از کد ماشین اشتراکی با List<object>
List<Customer> custList = new(); // استفاده از کد ماشین اشتراکی با List<object>
\`\`\`

### محدودیت‌های نوعی (Generic Constraints)

محدودیت‌های نوعی به کامپایلر اجازه می‌دهند قراردادهای صریحی برای پارامترهای جنریک تعریف کرده و دسترسی مستقیم به متدها و سازنده‌ها را بدون استفاده از Reflection فراهم کنند:

\`\`\`csharp
public class BaseRepository<TEntity, TKey> 
    where TEntity : class, IEntity<TKey>, new() // نوع ارجاعی، پیاده‌ساز اینترفیس، دارای سازنده پیش‌فرض
    where TKey : struct, IEquatable<TKey>      // نوع مقداری و قابل مقایسه
{
    public TEntity CreateInstance(TKey id)
    {
        var entity = new TEntity();
        return entity;
    }
}
\`\`\`

#### محاسبات ریاضی جنریک در دات‌نت ۷ و ۸ (Generic Math)
با اضافه شدن اعضای استاتیک انتزاعی در اینترفیس‌ها (Static Abstract Interface Members)، کار با ساختارهای عددی به صورت کاملاً جنریک ممکن شده است:

\`\`\`csharp
using System.Numerics;

public static class MathAlgorithms
{
    // الگوریتم جنریک فوق‌سریع برای محاسبه مجموع با پشتیبانی از int, double, decimal, Int128
    public static T SumArray<T>(ReadOnlySpan<T> values) where T : INumber<T>
    {
        T sum = T.Zero;
        foreach (var value in values)
        {
            sum += value; // حل استاتیک در زمان کامپایل بدون Virtual Call Dispatch
        }
        return sum;
    }
}
\`\`\`

---

## ۳. واریانس در جنریک‌ها: Covariance، Contravariance و Invariance

واریانس مشخص می‌کند که چگونه رابطه ارث‌بری بین دو نوع، به کالکشن‌ها و اینترفیس‌های جنریک مشتق‌شده از آنها منتقل می‌شود.

| حالت واریانس | کلمه کلیدی | جایگاه در متد | تعریف | نوع پشتیبانی‌شده |
| :--- | :--- | :--- | :--- | :--- |
| **Covariance** | \`out T\` | **فقط خروجی / مقدار بازگشتی** | حفظ جهت ارث‌بری: \`Base = Derived\` | Interfaceها و Delegateها |
| **Contravariance** | \`in T\` | **فقط ورودی / پارامترها** | معکوس کردن جهت ارث‌بری: \`Derived = Base\` | Interfaceها و Delegateها |
| **Invariance** | *(ندارد)* | **هم ورودی و هم خروجی** | انطباق ۱۰۰٪ دقیق نوع داده | Classها، Structها، Interfaceهای عادی |

### ۱. هم‌وردایی یا Covariance (\`out T\`):
امکان انتساب نمونه با فرزند مشتق‌شده‌تر به متغیر با نوع پایه:

\`\`\`csharp
// IEnumerable<out T> دارای واریانس هم‌وردا است
IEnumerable<string> strings = new List<string> { "A", "B" };
IEnumerable<object> objects = strings; // معتبر است زیرا string فرزند object است
\`\`\`

### ۲. پادوردایی یا Contravariance (\`in T\`):
امکان انتساب نمونه با نوع والد به متغیر با نوع فرزند:

\`\`\`csharp
// IComparer<in T> دارای واریانس پادوردا است
public class AnimalComparer : IComparer<Animal>
{
    public int Compare(Animal? x, Animal? y) => string.Compare(x?.Name, y?.Name, StringComparison.Ordinal);
}

IComparer<Dog> dogComparer = new AnimalComparer(); // معتبر: مقایسه Dogها با مقایسه‌گر عمومی Animal
\`\`\`

### ۳. علت Invariant بودن کلاس‌ها:
اگر \`List<T>\` دارای Covariance بود، امنیت نوع داده در حافظه از بین می‌رفت:

\`\`\`csharp
List<Dog> dogs = new List<Dog>();
// اگر مجاز بود:
// List<Animal> animals = dogs;
// animals.Add(new Cat()); // فاجعه: اضافه شدن Cat به لیست سگ‌ها (List<Dog>)!
\`\`\`

---

## ۴. کالبدشکافی ساختار داده‌های اصلی در دات‌نت

### ۱. معماری داخلی \`List<T>\` (آرایه پویا و پیوسته)

کلاس \`List<T>\` در دات‌نت یک پوشش سبک روی یک آرایه ساده است:

\`\`\`csharp
public class List<T>
{
    internal T[] _items;   // آرایه پیوسته داده‌ها
    internal int _size;    // تعداد آیتم‌های فعلی
    internal int _version; // شمارنده تغییرات برای اعتبارسنجی Iterator
}
\`\`\`

#### نکات کلیدی:
- **سیاست رشد (Growth Policy)**: ظرفیت اولیه صفر است. با اولین \`Add\` ظرفیت ۴ تخصیص می‌یابد. هنگام پر شدن، ظرفیت **دو برابر** می‌شود (4 -> 8 -> 16 -> 32 ...).
- **هزینه تغییر اندازه (Resize Overhead)**: هر بار افزایش ظرفیت باعث ساخت یک آرایه جدید در Heap و کپی بایت‌ها با \`Buffer.Memmove\` می‌شود.
- **ایمنی پیمایش**: متغیر \`_version\` با هرگونه تغییر (\`Add\`, \`Remove\`, \`Clear\`) افزایش می‌یابد؛ در صورتی که در حین حلقه \`foreach\` مقدار آن تغییر کند، خطای \`InvalidOperationException\` پرتاب می‌شود.

\`\`\`csharp
// نادرست: تخصیص‌های مکرر و کپی‌های غیرضروری در حافظه
List<OrderDto> orders = new List<OrderDto>(); // ظرفیت اولیه ۰
for (int i = 0; i < 10_000; i++)
{
    orders.Add(FetchOrder(i)); // حدود ۱۴ بار آرایه جدید ساخته و کپی می‌شود!
}

// بهینه: تعیین ظرفیت اولیه در صورت مشخص بودن تعداد تقریبی
List<OrderDto> optimizedOrders = new List<OrderDto>(10_000); // فقط ۱ تخصیص بدون کپی
\`\`\`

---

### ۲. معماری داخلی \`Dictionary<TKey, TValue>\` و \`HashSet<T>\` (Hash Table با Chaining)

دیکشنری دات‌نت از معماری ترکیبی **Separate Chaining با آرایه‌های ساختاری تخت** بهره می‌برد و برخلاف جاوا، آبجکت‌های مجزا برای Nodeها روی Heap نمی‌سازد.

\`\`\`csharp
public class Dictionary<TKey, TValue>
{
    private int[] _buckets;      // آرایه باکت‌ها حاوی اندیس‌های ۱-پایه به آرایه entries
    private Entry[] _entries;    // آرایه تخت استراکت‌ها
    private int _count;
    private int _freeList;       // اندیس خانه‌های حذف‌شده جهت بازیافت
    private int _version;

    private struct Entry
    {
        public uint HashCode;
        public int Next;         // اندیس عنصر بعدی در زنجیره برخورد (-1 در صورت پایان زنجیره)
        public TKey Key;
        public TValue Value;
    }
}
\`\`\`

#### فرآیند جستجو (\`O(1)\` Average):
۱. **محاسبه هش**: هش کد کلید با \`GetHashCode()\` محاسبه می‌شود.
۲. **یافتن باکت**: اندیس باکت با فرمول \`hashCode % _buckets.Length\` به دست می‌آید.
۳. **پیمایش زنجیره**: از اندیس داخل باکت شروع کرده و با دنبال کردن فیلد \`Next\` در آرایه \`_entries\`، آیتم مورد نظر جستجو می‌شود.
۴. **تغییر اندازه (Resize)**: با پر شدن ظرفیت، اندازه آرایه‌ها به **اولین عدد اول بزرگتر از دو برابر ظرفیت فعلی** افزایش یافته و تمام عناصر Re-hash می‌شوند.

---

## ۵. کالکشن‌های با کارایی بسیار بالا در دات‌نت ۸ و ۹

### ۱. مجموعه \`FrozenDictionary<TKey, TValue>\` و \`FrozenSet<T>\`

برای داده‌های فقط‌خواندنی ثابت که در زمان Startup برنامه بارگذاری می‌شوند (مانند جدول دسترسی‌ها، کدهای ایزو، دیکشنری‌های روتینگ)، کلاس \`FrozenDictionary\` با آنالیز کلیدها در زمان ساخت، **تابع هش کامل (Perfect Hashing)** و جدول پرش مستقیم ایجاد می‌کند:

\`\`\`csharp
using System.Collections.Frozen;

public class SecurityPolicyService
{
    private static readonly FrozenDictionary<string, PermissionLevel> RolePermissions = 
        new Dictionary<string, PermissionLevel>
        {
            ["Admin"] = PermissionLevel.FullAccess,
            ["Moderator"] = PermissionLevel.Write,
            ["Viewer"] = PermissionLevel.Read
        }.ToFrozenDictionary(StringComparer.OrdinalIgnoreCase);

    public PermissionLevel GetPermission(string role)
    {
        // تا ۳ برابر سریع‌تر از دیکشنری معمولی با صفر درصد تغییر حافظه
        return RolePermissions.GetValueOrDefault(role, PermissionLevel.None);
    }
}
\`\`\`

### ۲. متدهای \`CollectionsMarshal\` برای بهینه‌سازی مسیرهای پرتردد (Hot Paths)

در پردازش‌های فوق‌العاده حساس، جستجوی کلید و آپدیت مقدار در دیکشنری معمولی دو بار هزینه هش و Lookup دارد. متد \`CollectionsMarshal.GetValueRefOrNullRef\` دسترسی با \`ref\` مستقیم به خانه آرایه داخلی دیکشنری را مهیا می‌سازد:

\`\`\`csharp
using System.Runtime.InteropServices;

public class MetricsAggregator
{
    private readonly Dictionary<string, RequestMetrics> _metrics = new();

    public void RecordLatency(string endpoint, double latencyMs)
    {
        // ارجاع مستقیم به استراکت بدون کپی داده و بدون دو بار جستجوی هش!
        ref var entry = ref CollectionsMarshal.GetValueRefOrNullRef(_metrics, endpoint);
        
        if (System.Runtime.CompilerServices.Unsafe.IsNullRef(ref entry))
        {
            _metrics[endpoint] = new RequestMetrics { TotalRequests = 1, TotalLatencyMs = latencyMs };
        }
        else
        {
            entry.TotalRequests++;
            entry.TotalLatencyMs += latencyMs;
        }
    }
}
\`\`\`

---

## ۶. موتور اجرای LINQ و ماشین حالت \`yield return\`

### اجرای به تعویق افتاده (Deferred Execution) در برابر اجرای فوری (Immediate Execution)

کوئری‌های LINQ مبتنی بر اینترفیس \`IEnumerable<T>\` هستند و تا زمانی که داده‌ها درخواست نشوند (Pull-based)، هیچ پردازشی انجام نمی‌شود:

\`\`\`csharp
List<int> numbers = new() { 1, 2, 3, 4, 5 };

// ۱. تعریف کوئری (هیچ پردازشی انجام نمی‌شود، صفر سربار)
var query = numbers
    .Where(n => n % 2 == 0) // Streaming Operator (Deferred)
    .Select(n => n * 10);   // Streaming Operator (Deferred)

// ۲. ارزیابی و اجرای واقعی کوئری (دریافت تک‌تک آیتم‌ها با MoveNext)
foreach (var item in query)
{
    Console.WriteLine(item);
}
\`\`\`

#### دسته‌بندی عملگرها:
- **عملگرهای جریانی تنبل (Deferred Streaming)**: مانند \`Where\`, \`Select\`, \`Take\`, \`Skip\` (عناصر را تک‌به‌تک و درجا پردازش می‌کنند).
- **عملگرهای بافرکننده تنبل (Deferred Buffering)**: مانند \`OrderBy\`, \`GroupBy\`, \`Reverse\` (برای تولید اولین خروجی، ابتدا باید تمام عناصر قبلی را در حافظه بافر کنند).
- **عملگرهای اجرای آنی (Immediate Execution)**: مانند \`ToList()\`, \`ToArray()\`, \`Count()\`, \`Sum()\`, \`Any()\` (کل کوئری را در همان لحظه اجرا کرده و خروجی را مادی‌سازی می‌کنند).

### ماشین حالت تولیدشده توسط Roslyn برای \`yield return\`

هنگام استفاده از \`yield return\`، کامپایلر Roslyn متد را به یک کلاس داخلی ماشین حالت با پیاده‌سازی \`IEnumerator<T>\` تبدیل می‌کند که وضعیت اجرای متد را در فیلد \`<>1__state\` ذخیره می‌نماید:

\`\`\`csharp
public static IEnumerable<int> GenerateEvenNumbers(int max)
{
    for (int i = 0; i < max; i++)
    {
        if (i % 2 == 0)
            yield return i;
    }
}
\`\`\`

---

## ۷. خطاهای رایج پروداکشن و الگوهای ضدکارایی (Anti-Patterns)

### خطای ۱: ارزیابی مکرر کوئری‌های با اجرای تنبل (Multiple Enumeration)

\`\`\`csharp
// خطرناک: اجرای چندباره کوئری دیتابیس یا محاسبات سنگین
public async Task ProcessOrdersAsync(IEnumerable<Order> ordersQuery)
{
    if (!ordersQuery.Any()) // اجرای کوئری برای بار اول
        return;

    var total = ordersQuery.Sum(o => o.TotalAmount); // اجرای کوئری برای بار دوم

    foreach (var order in ordersQuery) // اجرای کوئری برای بار سوم
    {
        await SendInvoiceAsync(order);
    }
}

// اصلاح‌شده: مادی‌سازی یک‌باره در صورت نیاز به پیمایش مکرر
public async Task ProcessOrdersOptimizedAsync(IEnumerable<Order> ordersQuery)
{
    var ordersList = ordersQuery as IReadOnlyList<Order> ?? ordersQuery.ToList();
    
    if (ordersList.Count == 0)
        return;

    var total = ordersList.Sum(o => o.TotalAmount);
    foreach (var order in ordersList)
    {
        await SendInvoiceAsync(order);
    }
}
\`\`\`

### خطای ۲: استفاده از کلیدهای تغییرپذیر (Mutable Keys) در دیکشنری

\`\`\`csharp
public class UserKey
{
    public string Username { get; set; } // تغییرپذیر!
    public override int GetHashCode() => Username.GetHashCode();
}

var dict = new Dictionary<UserKey, UserData>();
var key = new UserKey { Username = "alice" };
dict[key] = new UserData();

// تغییر کلید بعد از قرار گرفتن در دیکشنری:
key.Username = "bob"; // مقدار هش کد تغییر کرد!

// فراخوانی dict[key] باعث پرتاب KeyNotFoundException می‌شود چون در باکت دیگری جستجو می‌گردد!
\`\`\`

---

## ۸. ماتریس تصمیم‌گیری و مقایسه کالکشن‌ها در دات‌نت

| نوع کالکشن | ساختار داخلی | پیچیدگی جستجو | پیچیدگی درج | ایمنی نخ‌ها (Thread Safety) | بهترین سناریوی کاربرد |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`T[]\` | آرایه پیوسته حافظه | \`O(1)\` با اندیس | تغییرناپذیر با طول ثابت | ایمن برای خواندن | بافرهای با اندازه مشخص و کارایی حداکثری |
| \`List<T>\` | آرایه پویا | \`O(1)\` با اندیس | \`O(1)\` سرشکن‌شده | خیر | لیست‌های ترتیبی عمومی تک‌نخی |
| \`Dictionary<K, V>\` | باکت‌ها + استراکت آرایه | \`O(1)\` میانگین | \`O(1)\` میانگین | خیر | جستجوهای سریع کلید-مقدار و کش‌های محلی |
| \`HashSet<T>\` | باکت‌ها + اسلات‌ها | \`O(1)\` میانگین | \`O(1)\` میانگین | خیر | تضمین یکتایی عناصر و عملیات مجموعه‌ها |
| \`FrozenDictionary<K, V>\` | Perfect Hash Table | \`O(1)\` فوق‌سریع | تغییرناپذیر | **بله (فقط خواندنی)** | جداول ثابت پیکربندی و متادیتای سیستم |
| \`ImmutableArray<T>\` | استراکت حاوی آرایه | \`O(1)\` با اندیس | \`O(N)\` در تغییر | **بله (Lock-Free)** | داده‌های چندنخی با خواندن بسیار بالا |
| \`ConcurrentDictionary<K, V>\` | قفل‌های تفکیک‌شده (Striped) | \`O(1)\` میانگین | \`O(1)\` میانگین | **بله (Thread-Safe)** | دسترسی همزمان و چندنخی با نوشتن و خواندن بالا |`,
};
