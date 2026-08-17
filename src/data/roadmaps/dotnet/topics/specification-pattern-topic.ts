import { RoadmapTopic } from "../../../models";

export const specificationPatternTopic: RoadmapTopic = {
  id: "topic-dotnet-specification-pattern",
  stepId: "step-patterns-clean-arch",
  slug: "specification-pattern-expression-trees",
  order: 2,
  title: "Specification Pattern with Expression Trees in Domain-Driven Design",
  title_fa: "الگوی طراحی Specification با Expression Trees در معماری Domain-Driven Design",
  summary: "Encapsulate business predicates into composable specifications, combine expressions with custom ParameterReplacer visitors, and translate directly to SQL.",
  summary_fa: "کپسوله‌سازی قوانین بیزینسی در کلاس‌های Specification، ترکیب عبارات شرطی با ExpressionVisitor اختصاصی و ترجمه مستقیم به SQL با EF Core.",
  readingTimeMinutes: 18,
  difficulty: "senior",
  content: `### 1. The Specification Pattern in Clean Architecture

The **Specification Pattern** encapsulates business query rules into reusable, testable objects that can be combined with boolean logic (AND, OR, NOT) and translated directly into SQL queries via EF Core.

---

### 2. Solving the Expression Parameter Mismatch Problem

Combining two lambda expressions (\`u => u.Age > 18\` and \`x => x.IsActive\`) directly throws runtime errors because they have different parameter instances.

\`\`\`csharp
public class ParameterReplacer : ExpressionVisitor {
    private readonly ParameterExpression _source;
    private readonly ParameterExpression _target;
    public ParameterReplacer(ParameterExpression source, ParameterExpression target) {
        _source = source;
        _target = target;
    }
    protected override Expression VisitParameter(ParameterExpression node) =>
        node == _source ? _target : base.VisitParameter(node);
}

public abstract class Specification<T> {
    public abstract Expression<Func<T, bool>> ToExpression();
    public bool IsSatisfiedBy(T entity) => ToExpression().Compile()(entity);

    public Specification<T> And(Specification<T> other) {
        var left = ToExpression();
        var right = other.ToExpression();
        var param = Expression.Parameter(typeof(T), "entity");

        var leftBody = new ParameterReplacer(left.Parameters[0], param).Visit(left.Body);
        var rightBody = new ParameterReplacer(right.Parameters[0], param).Visit(right.Body);

        return new DirectSpecification<T>(Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(leftBody!, rightBody!), param));
    }
}
\`\`\`

---

### 3. Usage with EF Core Repository

\`\`\`csharp
var spec = new ActiveUserSpecification()
    .And(new PremiumCustomerSpecification())
    .And(new RegisteredInYearSpecification(2026));

// Translated directly to SQL WHERE clause!
var users = await dbContext.Users.Where(spec.ToExpression()).ToListAsync();
\`\`\``,
  content_fa: `### ۱. الگوی Specification در معماری تمیز

الگوی **Specification** شروط بیزینسی دامین را درون کلاس‌های مستقل قرار می‌دهد تا بتوان آن‌ها را با عملگرهای منطقی (AND, OR, NOT) ترکیب کرد و به صورت مستقیم به دستورات SQL در EF Core تبدیل نمود.

---

### ۲. حل مشکل تداخل پارامترها با ParameterReplacer

با پیاده‌سازی کلاس \`ParameterReplacer\`، پارامترهای مختلف لامبدا به یک پارامتر واحد نگاشت می‌شوند تا ترکیب عبارات شرطی بدون خطای زمان اجرا انجام پذیرد.`,
};
