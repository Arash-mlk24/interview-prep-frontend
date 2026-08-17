import { RoadmapTopic } from "../../../models";

export const brandTypesVarianceTopic: RoadmapTopic = {
  id: "topic-ts-brand-types-variance",
  stepId: "step-ts-invariants-soundness",
  slug: "branded-types-type-variance",
  order: 1,
  title: "Nominal Typing via Branded Types & Type Variance (Covariance/Contravariance)",
  title_fa: "تایپ‌های نامی (Branded Types) و مباحث واریانس (Covariance و Contravariance)",
  summary: "Simulate nominal typing in TypeScript's structural type system with Brands/Flavors and master function argument contravariance vs return type covariance.",
  summary_fa: "شبیه‌سازی تایپ‌های اسمی در سیستم ساختاری تایپ‌اسکریپت با Branded Types و تسلط بر واریانس ورودی و خروجی توابع.",
  readingTimeMinutes: 16,
  difficulty: "senior",
  content: `### 1. Nominal Typing vs. Structural Typing in TypeScript

TypeScript utilizes a **Structural Type System (Duck Typing)**: two types with identical properties are fully interchangeable.

#### The Problem in Domain-Driven Design:
\`\`\`typescript
type UserId = string;
type OrderId = string;

function cancelOrder(userId: UserId, orderId: OrderId) {}
const u: UserId = "user-123";
const o: OrderId = "order-456";

// BUG: Swapped parameters compile without warning because both are strings!
cancelOrder(o, u);
\`\`\`

---

### 2. The Solution: Branded (Opaque) Types

By attaching a unique \`unique symbol\` or phantom property that cannot exist at runtime, we enforce strict nominal identity at compile time with **zero runtime overhead**:

\`\`\`typescript
declare const __brand: unique symbol;
type Brand<B> = { readonly [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

export type UserId = Branded<string, "UserId">;
export type OrderId = Branded<string, "OrderId">;

// Constructor functions with validation:
export function makeUserId(raw: string): UserId {
    if (!raw.startsWith("usr_")) throw new Error("Invalid User ID format");
    return raw as UserId;
}

const user = makeUserId("usr_123");
const order = "ord_456" as OrderId;

// Type Error: Type 'OrderId' is not assignable to type 'UserId'!
cancelOrder(order, user);
\`\`\`

---

### 3. Understanding Type Variance in TypeScript

- **Covariance (Output Position):** If \`Dog\` extends \`Animal\`, then \`() => Dog\` can be assigned to \`() => Animal\`.
- **Contravariance (Input/Parameter Position):** Under \`strictFunctionTypes: true\`, if \`Dog\` extends \`Animal\`, a function expecting an \`Animal\` (\`(a: Animal) => void\`) can safely be passed where \`(d: Dog) => void\` is required!`,
  content_fa: `### ۱. سیستم تایپ ساختاری در برابر تایپ اسمی (Nominal)

تایپ‌اسکریپت به طور پیش‌فرض بر اساس ساختار فیلدها بررسی می‌شود نه نام تایپ (Structural Typing). این موضوع ممکن است باعث جابجا فرستادن \`UserId\` با \`OrderId\` در توابع بدون خطای کامپایلر شود.

---

### ۲. تکنیک Branded Types

با افزودن یک فیلد نامرئی (\`unique symbol\`) به تایپ‌های اولیه (مانند string یا number)، کامپایلر تایپ‌ها را متمایز دانسته و از خطاهای جابجایی شناسه در دامین جلوگیری می‌کند بدون اینکه هیچ کدی در خروجی JS ایجاد شود.

---

### ۳. مفهوم واریانس (Variance) در توابع

- **Covariance (خروجی توابع):** مقادیر خروجی در جهت مستقیم سلسله‌مراتب کلاس‌ها سازگار هستند.
- **Contravariance (ورودی توابع):** پارامترهای ورودی توابع در جهت معکوس سازگار هستند تا امنیت نوع داده‌ها حفظ شود.`,
};
