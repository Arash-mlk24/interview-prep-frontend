import { RoadmapTopic } from "../../../models";

export const dddAggregatesBoundedContextsTopic: RoadmapTopic = {
  id: "topic-dotnet-ddd-aggregates-bounded-contexts",
  stepId: "step-lld-clean-ddd",
  slug: "domain-driven-design-aggregates-bounded-contexts",
  order: 3,
  title: "Domain-Driven Design (DDD): Aggregates, Domain Events & Bounded Contexts",
  title_fa: "طراحی دامنه-محور (DDD): اگرگیت‌ها، رویدادهای دامنه و مرزبندی Bounded Contexts",
  summary: "Design rich domain models in C# with Aggregate Roots, immutable Value Objects, Domain Events, and clear Context Maps.",
  summary_fa: "طراحی مدل‌های دامنه غنی (Rich Domain Models) در سی‌شارپ، اعتبارسنجی بیزینس رول‌ها در ریشه اگرگیت و مدیریت رخدادهای دامنه.",
  readingTimeMinutes: 25,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **Tactical DDD in C#**:
  - Aggregate Roots and consistency boundaries.
  - Value Objects vs Entities (C# \`record\` vs \`class\`, immutability).
  - Domain Events dispatching (Pre-commit vs Post-commit EF Core interceptors).
- **Strategic DDD**:
  - Discovering Bounded Contexts with Event Storming.
  - Context Mapping patterns (Shared Kernel, Customer/Supplier, Anti-Corruption Layer - ACL).

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **الگوهای تاکتیکی DDD در سی‌شارپ**:
  - ریشه اگرگیت (Aggregate Root) و مرزهای سازگاری تراکنش.
  - تفکیک انتیتی‌ها و Value Objectها با قابلیت‌های \`record\` در C#.
  - نحوه انتشار Domain Events (اینترسپتورهای EF Core قبل و بعد از SaveChanges).
- **الگوهای استراتژیک DDD**:
  - کشف Bounded Contextها با ایونت‌استورمینگ.
  - نقشه‌های تعامل کانتکست‌ها (Shared Kernel، لایه ضدفساد یا ACL و Open Host Service).

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
