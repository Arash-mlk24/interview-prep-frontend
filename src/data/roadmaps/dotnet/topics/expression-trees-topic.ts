import { RoadmapTopic } from "../../../models";

export const expressionTreesTopic: RoadmapTopic = {
  id: "topic-dotnet-expression-trees",
  stepId: "step-csharp-memory-concurrency",
  slug: "expression-trees-linq",
  order: 2,
  title: "Expression Trees, AST Nodes & LINQ Query Translation",
  title_fa: "درخت عبارات (Expression Trees)، ساختار AST و نحوه ترجمه کوئری‌های LINQ به SQL",
  summary: "Understand Code-as-Data representations, IQueryable vs IEnumerable, IQueryProvider internals, and how EF Core translates AST nodes to SQL.",
  summary_fa: "درک مفهوم کد به عنوان ساختار داده (AST)، تفاوت IQueryable با IEnumerable، نحوه کارکرد موتور IQueryProvider و ترجمه عبارات به کدهای SQL در EF Core.",
  readingTimeMinutes: 18,
  difficulty: "senior",
  content: `### 1. What is an Expression Tree (Code as Data)?

In .NET, an **Expression Tree** represents code not as compiled executable Intermediate Language (IL) bytecode, but as an in-memory **Abstract Syntax Tree (AST)** composed of nodes derived from \`System.Linq.Expressions.Expression\`.

\`\`\`
Lambda Expression: x => x.Price > 100

           LambdaExpression (x => ...)
                       |
             BinaryExpression (GreaterThan)
               /               \\
    MemberExpression         ConstantExpression
        (x.Price)                  (100)
\`\`\`

---

### 2. \`Func<T, bool>\` vs. \`Expression<Func<T, bool>>\`

| Dimension | \`Func<T, bool>\` (Delegate) | \`Expression<Func<T, bool>>\` (Expression Tree) |
| :--- | :--- | :--- |
| **Representation** | Compiled executable IL bytecode | In-memory Abstract Syntax Tree data structure |
| **Inspection** | Black-box pointer (cannot inspect logic) | Fully inspectable and traversable at runtime |
| **Execution** | Directly invoked by the CPU/CLR | Must be compiled via \`.Compile()\` or translated |
| **Target Interface** | \`IEnumerable<T>\` (In-Memory LINQ to Objects) | \`IQueryable<T>\` (Database LINQ Providers / EF Core) |
| **Execution Location**| Application RAM | Database Engine (Translated to native SQL) |

---

### 3. How EF Core Translates Expression Trees into SQL

When executing \`dbContext.Products.Where(p => p.Price > 100).ToList()\`:
1. \`Where()\` packages the lambda into an Expression Tree without executing it.
2. When materialization is requested (\`.ToList()\`), EF Core passes the AST to \`EntityQueryProvider\`.
3. \`RelationalQueryableMethodTranslatingExpressionVisitor\` walks the AST recursively:
   - \`MemberExpression (p.Price)\` $\to$ maps to column \`[p].[Price]\`.
   - \`BinaryExpression (GreaterThan)\` $\to$ maps to SQL operator \`>\`.
   - \`ConstantExpression (100)\` $\to$ generates parameterized variable \`@__p_0\`.
4. The SQL generator produces: \`SELECT [p].[Id], [p].[Price] FROM [Products] AS [p] WHERE [p].[Price] > @__p_0\`.

#### Why Translation Failures Occur:
If an Expression includes an unmapped C# method (e.g. \`p => MyCustomHasher(p.Code)\`), EF Core throws **\`InvalidOperationException\`** (Client Evaluation Disabled) to prevent loading millions of records into memory.

---

### 4. Dynamic Expression Tree Generation at Runtime

\`\`\`csharp
public static class ExpressionHelper {
    // Generates: (T entity) => entity.PropertyName == constantValue
    public static Expression<Func<T, bool>> BuildEquality<T>(string propertyName, object value) {
        var param = Expression.Parameter(typeof(T), "entity");
        var member = Expression.PropertyOrField(param, propertyName);
        var constant = Expression.Constant(Convert.ChangeType(value, member.Type), member.Type);
        var body = Expression.Equal(member, constant);

        return Expression.Lambda<Func<T, bool>>(body, param);
    }
}
\`\`\``,
  content_fa: `### ۱. مفهوم درخت عبارات (Code as Data)

**درخت عبارات (Expression Tree)** ساختاری است که کدهای سی‌شارپ را نه به عنوان بایت‌کد کامپایل‌شده IL، بلکه به عنوان یک درخت ساختار داده انتزاعی (**Abstract Syntax Tree**) در حافظه نگهداری می‌کند.

\`\`\`
عبارت لامبدا: x => x.Price > 100

           LambdaExpression (x => ...)
                       |
             BinaryExpression (GreaterThan)
               /               \\
    MemberExpression         ConstantExpression
        (x.Price)                  (100)
\`\`\`

---

### ۲. مقایسه تخصصی \`Func\` و \`Expression\`

- **\`Func<T, bool>\`:** مستقیماً به کدهای ماشین کامپایل شده و درون حافظه RAM اپلیکیشن روی کالکشن‌های \`IEnumerable\` اجرا می‌شود.
- **\`Expression<Func<T, bool>>\`:** کدهای شرط را به صورت یک ساختار درختی شفاف نگهداری می‌کند تا موتور ORM بتواند آن را به کوئری‌های بهینه SQL ترجمه کند.

---

### ۳. نحوه ترجمه به SQL در Entity Framework Core

۱. متد \`Where\` درخت عبارات را بدون اجرا تحویل \`IQueryProvider\` می‌دهد.
۲. کلاس‌های \`ExpressionVisitor\` گره‌های درخت را پیمایش کرده، نام ستون‌ها و عملگرهای مقایسه‌ای را شناسایی می‌کنند و مقادیر را به صورت پارامترهای امن (\`@__p_0\`) تبدیل می‌نمایند.
۳. رشته نهایی SQL تولید شده و توسط درایور ADO.NET به دیتابیس فرستاده می‌شود.`,
};
