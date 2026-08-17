import { RoadmapTopic } from "../../../models";

export const csharpGenericsCollectionsLinqTopic: RoadmapTopic = {
  id: "topic-dotnet-csharp-generics-collections-linq",
  stepId: "step-mid-csharp-fundamentals",
  slug: "csharp-generics-collections-linq",
  order: 2,
  title: "Generics, Collections Internals & LINQ Execution Model",
  title_fa: "جنریک‌ها، معماری داخلی کالکشن‌ها و مدل اجرای LINQ",
  summary:
    "Explore Generic type constraints, performance characteristics of List, Dictionary, and HashSet, and deferred execution mechanics in LINQ.",
  summary_fa:
    "بررسی محدودیت‌های Genericها، ساختار و پیچیدگی زمانی کالکشن‌های پرکاربرد (List, Dictionary, HashSet) و سازوکار اجرای به تعویق افتاده (Deferred Execution) در LINQ.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. Generics & Type Constraints

Generics enable type safety without boxing/unboxing overhead. Type constraints enforce contracts at compile time:

\`\`\`csharp
public interface IEntity
{
    Guid Id { get; }
}

public class Repository<T> where T : class, IEntity, new()
{
    public T Create() => new T();
}
\`\`\`

---

## 2. Collections Internals & Time Complexity

Understanding underlying data structures prevents latency bottlenecks:

| Collection | Internal Structure | Lookup Complexity | Insert / Append |
| :--- | :--- | :--- | :--- |
| \`List<T>\` | Contiguous dynamic array | \`O(1)\` by index, \`O(N)\` by value | Amortized \`O(1)\` |
| \`Dictionary<TKey, TValue>\` | Hash table with buckets & entry array | \`O(1)\` average | \`O(1)\` average |
| \`HashSet<T>\` | Hash set without values | \`O(1)\` average | \`O(1)\` average |
| \`Queue<T>\` / \`Stack<T>\` | Circular array / dynamic array | \`O(1)\` peek / pop | \`O(1)\` |

---

## 3. LINQ Deferred Execution vs Immediate Execution

LINQ methods return \`IEnumerable<T>\` queries that execute only upon enumeration (e.g. \`foreach\`, \`ToList()\`, \`Count()\`).

\`\`\`csharp
// Deferred query (not executed yet)
var query = users.Where(u => u.IsActive).Select(u => u.Email);

// Immediate execution happens here:
var list = query.ToList();
\`\`\``,
  content_fa: `## ۱. جنریک‌ها و محدودیت‌های نوعی (Generic Constraints)

جنریک‌ها امکان تعریف کلاس‌ها و متدهای با کارایی بالا و بدون هزینه Boxing/Unboxing را فراهم می‌کنند:

\`\`\`csharp
public interface IEntity
{
    Guid Id { get; }
}

public class Repository<T> where T : class, IEntity, new()
{
    public T Create() => new T();
}
\`\`\`

---

## ۲. معماری داخلی کالکشن‌ها و پیچیدگی زمانی

انتخاب کالکشن مناسب تاثیر مستقیمی بر کارایی و تاخیر سرویس‌های بک‌اند دارد:

| کالکشن | ساختار داده داخلی | پیچیدگی جستجو | پیچیدگی افزودن |
| :--- | :--- | :--- | :--- |
| \`List<T>\` | آرایه پویا و پیوسته | \`O(1)\` بر اساس اندیس، \`O(N)\` بر اساس مقدار | \`O(1)\` میانگین |
| \`Dictionary<TKey, TValue>\` | جدول هش با باکت‌ها و آرایه ورودی | \`O(1)\` میانگین | \`O(1)\` میانگین |
| \`HashSet<T>\` | جدول هش بدون مقدار | \`O(1)\` میانگین | \`O(1)\` میانگین |

---

## ۳. اجرای به تعویق افتاده (Deferred Execution) در LINQ

کوئری‌های LINQ تا زمانی که پیمایش نشوند (مانند فراخوانی \`foreach\`، \`ToList()\`، یا \`Any()\`) اجرا نمی‌شوند:

\`\`\`csharp
// کوئری تعریف شده اما هنوز اجرا نشده است
var query = users.Where(u => u.IsActive).Select(u => u.Email);

// اجرای واقعی در این خط رخ می‌دهد:
var list = query.ToList();
\`\`\``,
};
