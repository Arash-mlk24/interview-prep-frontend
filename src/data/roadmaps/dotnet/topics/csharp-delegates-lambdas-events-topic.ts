import { RoadmapTopic } from "../../../models";

export const csharpDelegatesLambdasEventsTopic: RoadmapTopic = {
  id: "topic-dotnet-csharp-delegates-lambdas-events",
  stepId: "step-mid-csharp-fundamentals",
  slug: "csharp-delegates-lambdas-events",
  order: 3,
  title: "Delegates, Lambda Expressions, Events & Functional C#",
  title_fa: "دلیگیت‌ها، توابع لامبدا، رخدادها و الگوهای فانکشنال در سی‌شارپ",
  summary:
    "Master type-safe function pointers, Action and Func delegates, closure scope captures, and publisher-subscriber event models.",
  summary_fa:
    "تسلط بر اشاره‌گرهای امن به توابع با Delegate، دلیگیت‌های آماده Action و Func، رفتار Closureها و مدل انتشار-اشتراک با رخدادها (Events).",
  readingTimeMinutes: 18,
  difficulty: "mid",
  content: `## 1. Delegates & Generic Function Pointers

A delegate is a type-safe object that holds references to one or more methods:

\`\`\`csharp
public delegate bool FilterCriteria<T>(T item);

// Built-in modern generic delegates:
Action<string> logAction = message => Console.WriteLine(message);
Func<int, int, int> addFunc = (a, b) => a + b;
Predicate<int> isEven = x => x % 2 == 0;
\`\`\`

---

## 2. Closures & Variable Scope Capture

When a lambda captures an outer variable, the compiler generates a hidden display class:

\`\`\`csharp
int threshold = 100;
Func<int, bool> isAbove = x => x > threshold; // Captures 'threshold' by reference
\`\`\`

---

## 3. Events & Publisher-Subscriber Pattern

Events encapsulate delegates to prevent external subscribers from overwriting the invocation list:

\`\`\`csharp
public class OrderService
{
    public event EventHandler<OrderCreatedEventArgs>? OrderCreated;

    public void CreateOrder(Order order)
    {
        // Business logic...
        OrderCreated?.Invoke(this, new OrderCreatedEventArgs(order.Id));
    }
}
\`\`\``,
  content_fa: `## ۱. دلیگیت‌ها و اشاره‌گرهای امن به متدها

دلیگیت نوعی داده در سی‌شارپ است که ارجاع به یک یا چند متد را به صورت کاملاً Type-Safe نگهداری می‌کند:

\`\`\`csharp
public delegate bool FilterCriteria<T>(T item);

// دلیگیت‌های استاندارد دات‌نت:
Action<string> logAction = message => Console.WriteLine(message);
Func<int, int, int> addFunc = (a, b) => a + b;
Predicate<int> isEven = x => x % 2 == 0;
\`\`\`

---

## ۲. رفتار Closure و گرفتن متغیرهای بیرونی (Capture)

زمانی که یک تابع لامبدا متغیری خارج از حوزه خود را استفاده می‌کند، کامپایلر یک کلاس مخفی برای ذخیره مقدار آن تولید می‌کند:

\`\`\`csharp
int threshold = 100;
Func<int, bool> isAbove = x => x > threshold; // گرفتن متغیر به صورت ارجاعی
\`\`\`

---

## ۳. رخدادها (Events) و الگوی Publisher-Subscriber

رخدادها لایه‌ای امنیتی روی دلیگیت‌ها ایجاد می‌کنند تا کدهای بیرونی نتوانند لیست مشترکین را بازنویسی یا مستقیماً Invoke کنند:

\`\`\`csharp
public class OrderService
{
    public event EventHandler<OrderCreatedEventArgs>? OrderCreated;

    public void CreateOrder(Order order)
    {
        // منطق ایجاد سفارش...
        OrderCreated?.Invoke(this, new OrderCreatedEventArgs(order.Id));
    }
}
\`\`\``,
};
