import { RoadmapTopic } from "../../../models";

export const expressionTreesTopic: RoadmapTopic = {
  id: "topic-dotnet-expression-trees",
  stepId: "step-csharp-memory-concurrency",
  slug: "expression-trees-linq",
  order: 4,
  title: "Metaprogramming in C#: Expression Trees, Dynamic Code Generation & Source Generators",
  title_fa: "متاپروگرمینگ در سی‌شارپ: درخت عبارات (Expression Trees)، تولید کد پویا و Roslyn Source Generators",
  summary:
    "Master advanced C# metaprogramming: Code-as-Data representations with Expression Trees, IQueryable AST translation in EF Core, dynamic predicate builders, Reflection.Emit, and compile-time Roslyn Incremental Source Generators for Native AOT.",
  summary_fa:
    "تسلط بر متاپروگرمینگ پیشرفته در سی‌شارپ: مفهوم کد به عنوان داده در Expression Trees، ترجمه درخت گره‌های AST به SQL در EF Core، ساخت کوئری‌های داینامیک، تولید بایت‌کد با Reflection.Emit و سورس جنریتورهای Roslyn برای Native AOT.",
  readingTimeMinutes: 35,
  difficulty: "senior",
  content: `## 1. The Concept of Code-as-Data & Abstract Syntax Trees (AST)

In traditional C# execution, code is compiled into **Intermediate Language (IL) bytecode**, which is an opaque black box to your application at runtime. You can invoke it, but you cannot inspect what operations it performs.

**Expression Trees** change this paradigm by treating **Code as Data**. Instead of emitting executable instructions, the C# compiler constructs an in-memory **Abstract Syntax Tree (AST)** composed of nodes derived from \`System.Linq.Expressions.Expression\`.

\`\`\`
Lambda Expression: p => p.Price > 100 && p.IsActive

                     BinaryExpression (AndAlso)
                            /          \\
         BinaryExpression (GreaterThan)  MemberExpression (p.IsActive)
                /             \\
      MemberExpression     ConstantExpression
          (p.Price)              (100)
\`\`\`

---

## 2. \`Func<T, bool>\` vs. \`Expression<Func<T, bool>>\`

Understanding the architectural distinction between delegates and expression trees is essential for designing high-performance data access layers:

| Dimension | \`Func<T, bool>\` (Compiled Delegate) | \`Expression<Func<T, bool>>\` (Expression Tree) |
| :--- | :--- | :--- |
| **Representation** | Executable IL bytecode pointer | In-memory Abstract Syntax Tree data structure |
| **Inspectability** | ❌ Black box (logic cannot be parsed) | ✅ Fully inspectable and traversable at runtime |
| **Execution** | Directly executed by the CPU / CLR | Must be compiled via \`.Compile()\` or translated |
| **Target Interface** | \`IEnumerable<T>\` (LINQ to Objects) | \`IQueryable<T>\` (Database ORMs / EF Core) |
| **Execution Location**| Application RAM (In-Memory) | Database Engine (Translated to native SQL) |

---

## 3. How EF Core Translates Expression Trees into SQL

When you query an Entity Framework Core \`DbSet<T>\`:
\`\`\`csharp
var results = await dbContext.Products
    .Where(p => p.Price > 100 && p.IsActive)
    .ToListAsync();
\`\`\`

The query does **not** execute in C# memory. Instead, EF Core translates the Expression Tree AST into optimized, parameterized SQL:

![Expression Tree AST Node Hierarchy & SQL Translation Pipeline](/images/roadmaps/expression-tree-ast-pipeline.jpg)

### 3.1 The Translation Pipeline:
1. **Packaging:** The \`.Where()\` extension method takes an \`Expression<Func<Product, bool>>\` and wraps it inside an **\`IQueryable<Product>\`**.
2. **AST Traversal with \`ExpressionVisitor\`:** When \`.ToListAsync()\` is called, EF Core's \`RelationalQueryableMethodTranslatingExpressionVisitor\` walks the AST recursively:
   - **\`MemberExpression (p.Price)\`** $\to$ Maps to column \`[p].[Price]\`.
   - **\`BinaryExpression (GreaterThan)\`** $\to$ Maps to relational operator \`>\`.
   - **\`ConstantExpression (100)\`** $\to$ Generates a parameterized variable \`@__p_0\` to prevent SQL injection and enable SQL Server execution plan caching.
   - **\`BinaryExpression (AndAlso)\`** $\to$ Maps to SQL \`AND\`.
3. **SQL Emission:** The SQL generator emits:
   \`\`\`sql
   SELECT [p].[Id], [p].[Name], [p].[Price], [p].[IsActive]
   FROM [Products] AS [p]
   WHERE ([p].[Price] > @__p_0) AND ([p].[IsActive] = 1)
   \`\`\`

### 3.2 The Client Evaluation Safeguard (EF Core 3.0+):
If an expression contains unmapped custom C# functions (e.g. \`p => MySecurityHelper.Hash(p.Code) == "abc"\`), EF Core **throws \`InvalidOperationException\`** at runtime rather than silently streaming millions of database records into RAM for client-side evaluation.

---

## 4. Dynamic Expression Trees & Predicate Builders

In enterprise applications with dynamic search filters (e.g., e-commerce product catalogs with 15 optional filter criteria), concatenating raw SQL strings is dangerous and unmaintainable.

Using **Dynamic Expression Trees**, you can construct strongly-typed LINQ predicates at runtime:

\`\`\`csharp
public static class PredicateBuilder
{
    // Combines two expressions with AND logic, rebinding parameters
    public static Expression<Func<T, bool>> And<T>(
        this Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2)
    {
        var parameter = Expression.Parameter(typeof(T), "x");

        var leftVisitor = new ReplaceParameterVisitor(expr1.Parameters[0], parameter);
        var left = leftVisitor.Visit(expr1.Body);

        var rightVisitor = new ReplaceParameterVisitor(expr2.Parameters[0], parameter);
        var right = rightVisitor.Visit(expr2.Body);

        return Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(left!, right!), parameter);
    }

    private class ReplaceParameterVisitor : ExpressionVisitor
    {
        private readonly ParameterExpression _oldParam;
        private readonly ParameterExpression _newParam;

        public ReplaceParameterVisitor(ParameterExpression oldParam, ParameterExpression newParam)
        {
            _oldParam = oldParam;
            _newParam = newParam;
        }

        protected override Expression VisitParameter(ParameterExpression node)
            => node == _oldParam ? _newParam : base.VisitParameter(node);
    }
}
\`\`\`

### 4.1 Dynamic Sorting by String Column Name
\`\`\`csharp
public static IQueryable<T> OrderByProperty<T>(this IQueryable<T> source, string propertyName, bool ascending)
{
    var parameter = Expression.Parameter(typeof(T), "p");
    var propertyAccess = Expression.PropertyOrField(parameter, propertyName);
    var orderByLambda = Expression.Lambda(propertyAccess, parameter);

    string methodName = ascending ? "OrderBy" : "OrderByDescending";
    var resultExpression = Expression.Call(
        typeof(Queryable),
        methodName,
        new Type[] { typeof(T), propertyAccess.Type },
        source.Expression,
        Expression.Quote(orderByLambda));

    return source.Provider.CreateQuery<T>(resultExpression);
}
\`\`\`

---

## 5. Dynamic IL Generation (\`Reflection.Emit\`) & Expression Compilation

When you call \`expression.Compile()\`, the CLR's \`LambdaCompiler\` emits dynamic CIL bytecode into a lightweight method using **\`Reflection.Emit\`**.

### 5.1 The Cost of \`.Compile()\`
- Compiling an Expression Tree is **CPU-heavy (taking $\\sim 200\\mu s - 500\\mu s$)** because it invokes the JIT compiler.
- **Rule:** Never call \`.Compile()\` inside high-frequency loops or per-request hot paths! Always **cache the compiled delegate** in a \`ConcurrentDictionary<string, Delegate>\`.

### 5.2 \`Reflection.Emit\` in Micro-ORMs (Dapper Mechanics)
High-performance libraries like **Dapper** use \`Reflection.Emit\` (\`DynamicMethod\`) to generate specialized IL code at runtime that directly assigns database reader columns to C# object properties, completely bypassing slow runtime reflection:

\`\`\`csharp
// How Dapper emits custom IL row mappers on the fly:
DynamicMethod dm = new DynamicMethod(
    "MapCustomer",
    typeof(Customer),
    new[] { typeof(IDataRecord) },
    typeof(Customer).Module,
    skipVisibility: true);

ILGenerator il = dm.GetILGenerator();
il.Emit(OpCodes.Newobj, typeof(Customer).GetConstructor(Type.EmptyTypes)!);
il.Emit(OpCodes.Dup);
il.Emit(OpCodes.Ldarg_0); // Load IDataRecord
il.Emit(OpCodes.Ldc_I4_0); // Column index 0
il.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("GetInt32")!);
il.Emit(OpCodes.Callvirt, typeof(Customer).GetProperty("Id")!.GetSetMethod()!);
il.Emit(OpCodes.Ret);

Func<IDataRecord, Customer> mapper = (Func<IDataRecord, Customer>)dm.CreateDelegate(typeof(Func<IDataRecord, Customer>));
\`\`\`

---

## 6. Modern Compile-Time Metaprogramming: Roslyn Incremental Source Generators

While Expression Trees and \`Reflection.Emit\` generate code *at runtime in RAM*, modern .NET 8/9 emphasizes **Roslyn Source Generators** that generate code *at compile-time*.

![Runtime Reflection vs Roslyn Incremental Source Generators](/images/roadmaps/source-generators-vs-reflection.jpg)

### 6.1 The Paradigm Shift: Runtime Reflection vs. Source Generators
- **Runtime Reflection / Reflection.Emit:**
  - Incurs startup latency and GC memory overhead.
  - **Incompatible with Native AOT (Ahead-of-Time compilation)** because reflection metadata and dynamic code generation cannot be pre-compiled into static machine binaries.
- **Incremental Source Generators (\`IIncrementalGenerator\`):**
  - Execute directly inside the Roslyn C# compiler pipeline.
  - Inspect syntax trees at build time and emit pure C# source files (\`*.g.cs\`).
  - **$0\\text{ runtime overhead}$**, 100% type-safe, and fully Native AOT compatible!

### 6.2 Key Source Generators in Modern .NET 8/9:
1. **\`System.Text.Json\` Source Generator (\`[JsonSerializable]\`):**
   - Eliminates runtime reflection during JSON serialization, making API serialization $3\\times$ faster with zero heap allocations.
2. **Regular Expressions (\`[GeneratedRegex]\`):**
   - Compiles Regex patterns into custom C# state-matching loops at build time.
3. **Structured High-Performance Logging (\`[LoggerMessage]\`):**
   - Generates zero-allocation logging methods without boxing value types.

\`\`\`csharp
// Zero-allocation JSON serialization with Native AOT support:
[JsonSerializable(typeof(Order))]
[JsonSerializable(typeof(List<Order>))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

// Zero-allocation compile-time Regex:
public static partial class ValidationRules
{
    [GeneratedRegex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", RegexOptions.Compiled)]
    public static partial Regex EmailRegex();
}
\`\`\`

---

## 7. Master Decision & Comparison Matrix

| Metaprogramming Technique | Execution Time | Native AOT Compatible? | Performance Overhead | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Expression Trees** | Runtime (AST) | ⚠️ Partial (Translation only) | High if \`.Compile()\` is uncached | EF Core query translation, Dynamic filtering |
| **Reflection.Emit (\`DynamicMethod\`)**| Runtime (IL) | ❌ Incompatible | Low once compiled (Emits raw IL) | Micro-ORMs (Dapper), dynamic proxies |
| **Runtime Reflection** | Runtime | ❌ Incompatible (Trim-unsafe) | High (Metadata lookups, boxing) | Legacy plugins, simple DI containers |
| **Roslyn Source Generators** | **Compile-Time** | ✅ **$100\\%$ Compatible** | **Zero ($0\\text{ runtime cost}$)** | Modern JSON serialization, Regex, Logging |`,
  content_fa: `## ۱. مفهوم کد به عنوان ساختار داده (Code as Data) و درخت عبارات

در برنامه‌نویسی سنتی، کدهای سی‌شارپ به **بایت‌کدهای واسط (IL)** کامپایل می‌شوند که برای برنامه در زمان اجرا مانند یک جعبه سیاه غیرقابل بازرسی هستند.

**درخت عبارات (Expression Tree)** این معادله را تغییر می‌دهد: به جای تولید دستورات اجرایی، کامپایلر یک ساختار داده درختی در حافظه RAM به نام **Abstract Syntax Tree (AST)** بر پایه کلاس \`System.Linq.Expressions.Expression\` می‌سازد.

\`\`\`
عبارت لامبدا: p => p.Price > 100 && p.IsActive

                     BinaryExpression (AndAlso)
                            /          \\
         BinaryExpression (GreaterThan)  MemberExpression (p.IsActive)
                /             \\
      MemberExpression     ConstantExpression
          (p.Price)              (100)
\`\`\`

---

## ۲. مقایسه تخصصی \`Func<T, bool>\` و \`Expression<Func<T, bool>>\`

| بعد فنی | \`Func<T, bool>\` (دلیگیت کامپایل‌شده) | \`Expression<Func<T, bool>>\` (درخت عبارات) |
| :--- | :--- | :--- |
| **نوع ساختار** | اشاره‌گر به بایت‌کد اجرایی ماشین | ساختار داده درختی قابل تحلیل در رم |
| **قابلیت بازرسی** | ❌ جعبه سیاه (کدها قابل خواندن نیستند) | ✅ کاملاً شفاف و قابل پیمایش در زمان اجرا |
| **نحوه اجرا** | مستقیماً توسط CPU / CLR اجرا می‌شود | باید کامپایل (\`.Compile\`) یا ترجمه شود |
| **اینترفیس مقصد** | \`IEnumerable<T>\` (مجموعه‌های درون حافظه) | \`IQueryable<T>\` (دیتابیس‌ها و ORMها) |
| **محل اجرا** | حافظه RAM اپلیکیشن | سرور دیتابیس (ترجمه به کدهای SQL) |

---

## ۳. نحوه ترجمه درخت عبارات به SQL در Entity Framework Core

وقتی یک کوئری مانند زیر می‌نویسید:
\`\`\`csharp
var results = await dbContext.Products
    .Where(p => p.Price > 100 && p.IsActive)
    .ToListAsync();
\`\`\`

کدهای C# در حافظه برنامه اجرا نمی‌شوند، بلکه موتور ترجمه EF Core ساختار درختی AST را به کدهای پارامتریزه SQL ترجمه می‌کند:

![فرآیند ترجمه درخت عبارات به کوئری SQL](/images/roadmaps/expression-tree-ast-pipeline.jpg)

### ۳.۱ مراحل فرآیند ترجمه کوئری:
۱. **بسته‌بندی عبارت:** متد \`.Where()\` عبارت لامبدا را درون شیء \`IQueryable<Product>\` قرار می‌دهد.
۲. **پیمایش درخت با الگوی \`ExpressionVisitor\`:** موتور داخلی EF Core گره‌ها را به صورت بازگشتی پیمایش می‌کند:
   - گره **\`MemberExpression (p.Price)\`** $\to$ به ستون \`[p].[Price]\` نگاشت می‌شود.
   - گره **\`BinaryExpression (GreaterThan)\`** $\to$ به عملگر رابطه \`>\` تبدیل می‌شود.
   - گره **\`ConstantExpression (100)\`** $\to$ برای جلوگیری از SQL Injection و بهینه‌سازی کش دیتابیس به متغیر پارامتریزه \`@__p_0\` تبدیل می‌شود.
   - گره **\`BinaryExpression (AndAlso)\`** $\to$ به عملگر \`AND\` تبدیل می‌شود.
۳. **تولید خروجی SQL:** کوئری بهینه زیر برای دیتابیس ارسال می‌شود:
   \`\`\`sql
   SELECT [p].[Id], [p].[Name], [p].[Price], [p].[IsActive]
   FROM [Products] AS [p]
   WHERE ([p].[Price] > @__p_0) AND ([p].[IsActive] = 1)
   \`\`\`

---

## ۴. ساخت کوئری‌های پویا با Dynamic Expression Trees

در پروژه‌های تجاری با فرم‌های جستجوی فیلتردار (مانند فیلترهای چندگانه قیمت، دسته‌بندی و وضعیت)، ترکیب رشته‌های SQL ناامن و غیراصولی است. با استفاده از ساخت پویای درخت عبارات می‌توان فیلترهای امن و Strongly-Typed تولید کرد:

\`\`\`csharp
public static class PredicateBuilder
{
    public static Expression<Func<T, bool>> And<T>(
        this Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2)
    {
        var parameter = Expression.Parameter(typeof(T), "x");

        var leftVisitor = new ReplaceParameterVisitor(expr1.Parameters[0], parameter);
        var left = leftVisitor.Visit(expr1.Body);

        var rightVisitor = new ReplaceParameterVisitor(expr2.Parameters[0], parameter);
        var right = rightVisitor.Visit(expr2.Body);

        return Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(left!, right!), parameter);
    }

    private class ReplaceParameterVisitor : ExpressionVisitor
    {
        private readonly ParameterExpression _oldParam;
        private readonly ParameterExpression _newParam;

        public ReplaceParameterVisitor(ParameterExpression oldParam, ParameterExpression newParam)
        {
            _oldParam = oldParam;
            _newParam = newParam;
        }

        protected override Expression VisitParameter(ParameterExpression node)
            => node == _oldParam ? _newParam : base.VisitParameter(node);
    }
}
\`\`\`

---

## ۵. تولید بایت‌کد با \`Reflection.Emit\` در میکرواورم‌ها (نحوه کارکرد Dapper)

کتابخانه‌های فوق‌سریع مانند **Dapper** برای پرهیز از افت سرعت ناشی از رفلکشن سنتی، با استفاده از کلاس \`Reflection.Emit.DynamicMethod\` در زمان اجرای برنامه مستقیماً کدهای CIL بهینه‌ای تولید می‌کنند که مقادیر ستون‌های دیتابیس را بدون Boxing به فیلدهای کلاس C# منتسب می‌کند.

---

## ۶. متاپروگرمینگ مدرن: سورس جنریتورهای Roslyn در دات‌نت ۸ و ۹

در معماری‌های Cloud-Native و کامپایل **Native AOT**، استفاده از رفلکشن در زمان اجرا و \`Reflection.Emit\` با محدودیت جدی مواجه است؛ به همین دلیل در دات‌نت مدرن از **Incremental Source Generators** استفاده می‌شود.

![مقایسه رفلکشن در زمان اجرا با سورس جنریتورهای زمان کامپایل](/images/roadmaps/source-generators-vs-reflection.jpg)

### ۶.۱ تفاوت بنیادین رفلکشن با سورس جنریتورها:
- **رفلکشن سنتی:** در زمان اجرای برنامه در رم اسکن‌های سنگین متادیتا انجام می‌دهد، باعث مصرف رم شده و با Native AOT ناسازگار است.
- **سورس جنریتورها (\`IIncrementalGenerator\`):** مستقیماً در حین کامپایل پروژه توسط کامپایلر Roslyn اجرا شده و فایل‌های منبع تمیز C# تولید می‌کنند (**با هزینه اجرای صفر در زمان اجرا و سازگاری ۱۰۰٪ با Native AOT**).

### ۶.۲ سورس جنریتورهای کلیدی در دات‌نت ۸ و ۹:
۱. **سورس جنریتور \`System.Text.Json\` با اتریبیوت \`[JsonSerializable]\`:** سریالایز و دیسریالایز JSON را ۳ برابر سریع‌تر و با صفر تخصیص حافظه انجام می‌دهد.
۲. **سورس جنریتور عبارت منظم با \`[GeneratedRegex]\`:** پترن‌های Regex را در زمان بیلد به کدهای لوپ بهینه سی‌شارپ تبدیل می‌کند.
۳. **لاگینگ فوق‌سریع با \`[LoggerMessage]\`:** ساخت لاگ‌های استراکچرد با صفر بایت آلیکیشن.

---

## ۷. جدول ماتریس مقایسه تکنیک‌های متاپروگرمینگ

| تکنیک متاپروگرمینگ | زمان اجرا | سازگاری با Native AOT | سربار کارایی در ران‌تایم | کاربرد اصلی |
| :--- | :--- | :--- | :--- | :--- |
| **Expression Trees** | زمان اجرا (AST) | ⚠️ نسبی (فقط ترجمه) | در صورت عدم کش \`.Compile\` بالاست | ترجمه کوئری در EF Core، فیلترهای پویا |
| **Reflection.Emit** | زمان اجرا (IL) | ❌ ناسازگار | پس از کامپایل بسیار پایین است | میکرواورم‌ها (Dapper)، پراکسی‌های داینامیک |
| **رفلکشن سنتی** | زمان اجرا | ❌ ناسازگار (Trim-unsafe) | بسیار بالا (Boxing و متادیتا) | پلاگین‌های قدیمی، کانتینرهای ساده DI |
| **سورس جنریتورهای Roslyn**| **زمان کامپایل** | ✅ **۱۰۰٪ سازگار** | **کاملاً صفر ($0\\text{ runtime cost}$)** | سریالایزرهای مدرن JSON، Regex و لاگینگ |`,
};
