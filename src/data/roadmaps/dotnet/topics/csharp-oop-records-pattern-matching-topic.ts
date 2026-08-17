import { RoadmapTopic } from "../../../models";

export const csharpOopRecordsPatternMatchingTopic: RoadmapTopic = {
  id: "topic-dotnet-csharp-oop-records-pattern-matching",
  stepId: "step-mid-csharp-fundamentals",
  slug: "csharp-oop-records-pattern-matching",
  order: 1,
  title: "C# OOP, Records, Structs vs Classes & Pattern Matching",
  title_fa: "مفاهیم پیشرفته OOP، مقایسه Struct با Class، ساختار Records و Pattern Matching",
  summary:
    "Master object-oriented design in modern C#, value vs reference types, immutable records, switch expressions, and positional/property pattern matching.",
  summary_fa:
    "تسلط بر اصول شی‌گرایی در سی‌شارپ مدرن، تفاوت مقداری و ارجاعی Struct و Class، ساختارهای غیرقابل تغییر Record و تطبیق الگو با Switch Expressions.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Value Types (Struct) vs Reference Types (Class)

In .NET, understanding memory allocation between the Stack and the Managed Heap is essential for writing efficient backend code:

- **Classes (Reference Types)**: Allocated on the Managed Heap. Variables hold a reference (pointer) to the object location. Managed and collected by the Garbage Collector (GC).
- **Structs (Value Types)**: Allocated inline wherever declared (on the thread execution stack for local variables, or inside the containing class on the heap). Copies the full value upon assignment.

\`\`\`csharp
public class OrderClass
{
    public int Id { get; set; }
    public decimal Total { get; set; }
}

public readonly struct PointStruct
{
    public double X { get; }
    public double Y { get; }

    public PointStruct(double x, double y) => (X, Y) = (x, y);
}
\`\`\`

---

## 2. Immutability & C# Records

Introduced in C# 9, \`record class\` and \`record struct\` provide value-based equality semantics and non-destructive mutation via the \`with\` expression.

\`\`\`csharp
public record UserDto(Guid Id, string FullName, string Email);

// Value-based equality
var user1 = new UserDto(Guid.Parse("..."), "Ali Reza", "ali@example.com");
var user2 = new UserDto(Guid.Parse("..."), "Ali Reza", "ali@example.com");
bool areEqual = user1 == user2; // True!

// Non-destructive mutation
var updatedUser = user1 with { FullName = "Ali Rezaei" };
\`\`\`

---

## 3. Modern Pattern Matching & Switch Expressions

C# 8+ pattern matching enhances readability and removes verbose \`if/else\` and \`switch\` statements:

\`\`\`csharp
public decimal CalculateDiscount(Order order) => order switch
{
    { IsVip: true, Total: > 1000m } => 0.20m,
    { IsVip: true }                => 0.10m,
    { Total: > 500m }              => 0.05m,
    null                           => throw new ArgumentNullException(nameof(order)),
    _                              => 0.0m
};
\`\`\``,
  content_fa: `## ۱. تفاوت مقداری (Struct) و ارجاعی (Class)

در دات‌نت، درک تخصیص حافظه بین Stack و Managed Heap برای توسعه‌دهندگان بک‌اند بسیار حیاتی است:

- **کلاس‌ها (Reference Types)**: روی Managed Heap تخصیص داده می‌شوند. متغیرها تنها آدرس (اشاره‌گر) به شیء را ذخیره می‌کنند و توسط Garbage Collector مدیریت می‌شوند.
- **استراکت‌ها (Value Types)**: به صورت درون‌خطی در همان محل تعریف (روی Stack برای متغیرهای محلی یا درون کلاس والد روی Heap) ذخیره می‌شوند.

\`\`\`csharp
public class OrderClass
{
    public int Id { get; set; }
    public decimal Total { get; set; }
}

public readonly struct PointStruct
{
    public double X { get; }
    public double Y { get; }

    public PointStruct(double x, double y) => (X, Y) = (x, y);
}
\`\`\`

---

## ۲. رکوردهای مدرن و Immutability

از سی‌شارپ ۹ به بعد، \`record class\` و \`record struct\` برابری بر اساس مقدار (Value-based Equality) و امکان ایجاد نسخه‌های جدید با عبارت \`with\` را فراهم می‌کنند.

\`\`\`csharp
public record UserDto(Guid Id, string FullName, string Email);

// بررسی برابری بر پایه مقادیر
var user1 = new UserDto(Guid.Parse("..."), "Ali Reza", "ali@example.com");
var user2 = new UserDto(Guid.Parse("..."), "Ali Reza", "ali@example.com");
bool areEqual = user1 == user2; // True

// تغییر مقادیر بدون تغییر شیء اصلی
var updatedUser = user1 with { FullName = "Ali Rezaei" };
\`\`\`

---

## ۳. عبارت‌های مدرن Pattern Matching و Switch Expressions

امکانات تطبیق الگو در سی‌شارپ مدرن کدهای تو در تو و طولانی شرطی را حذف کرده و خوانایی را به شدت افزایش می‌دهند:

\`\`\`csharp
public decimal CalculateDiscount(Order order) => order switch
{
    { IsVip: true, Total: > 1000m } => 0.20m,
    { IsVip: true }                => 0.10m,
    { Total: > 500m }              => 0.05m,
    null                           => throw new ArgumentNullException(nameof(order)),
    _                              => 0.0m
};
\`\`\``,
};
