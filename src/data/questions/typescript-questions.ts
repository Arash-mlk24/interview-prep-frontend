import { Question } from "../models";

export const typescriptQuestions: Question[] = [
  {
    id: "ts-q1",
    stackId: "typescript",
    categoryId: "ts-type-system",
    levelId: "junior",
    questionTitle: "What is the difference between `type` and `interface` in TypeScript?",
    questionTitle_fa: "تفاوت بین type و interface در زبان تایپ‌اسکریپت چیست؟",
    answerContent: `### \`type\` vs. \`interface\`

Both define object shapes, but have distinct characteristics:

| Feature | \`interface\` | \`type\` Alias |
| :--- | :--- | :--- |
| **Declaration Merging** | ✅ Yes (same name auto-merges) | ❌ No (duplicate name causes error) |
| **Primitives / Unions / Tuples** | ❌ Cannot represent unions directly | ✅ Can alias unions, primitives, tuples |
| **Extending / Inheritance** | \`interface B extends A\` | Intersection (\`type B = A & { ... }\`) |
| **Object Shape Performance** | Slightly faster compiler caching | Slightly higher compiler resolution cost |

\`\`\`typescript
// Interface Declaration Merging Example
interface Window {
  analytics: CustomAnalyticsTracker;
}

// Type Union & Tuple Example
type Status = "idle" | "loading" | "success" | "error";
type Coordinate = [number, number];
\`\`\``,
    answerContent_fa: `### مقایسه \`type\` و \`interface\`

هر دو ابزار برای تعریف ساختار اشیاء به کار می‌روند، اما تفاوت‌های مشخصی دارند:

| ویژگی | \`interface\` | \`type\` Alias |
| :--- | :--- | :--- |
| **ادغام تعاریف (Declaration Merging)** | ✅ دارد (تعریف مجدد با همان نام ادغام می‌شود) | ❌ ندارد (خطای تکرار نام می‌دهد) |
| **پشتیبانی از Unions و Tuples** | ❌ مستقیماً برای تایپ‌های ترکیبی قابل استفاده نیست | ✅ به طور کامل پشتیبانی می‌کند |
| **توسعه‌پذیری (Inheritance)** | \`interface B extends A\` | با Intersection (\`type B = A & ...\`) |
| **سرعت کش کامپایلر** | سرعت بالاتر در کامپایل ساختارهای شیء | هزینه پردازش اندکی بیشتر در تایپ‌های پیچیده |`,
  },
  {
    id: "ts-q2",
    stackId: "typescript",
    categoryId: "ts-advanced",
    levelId: "senior",
    topicIds: ["topic-ts-conditional-types-infer"],
    questionTitle: "How do Conditional Types, `infer`, and Template Literal Types work?",
    questionTitle_fa: "تایپ‌های شرطی (Conditional Types)، کلیدواژه infer و تمپلیت لیترال‌ها در تایپ‌اسکریپت چگونه کار می‌کنند؟",
    answerContent: `### Advanced TypeScript Type Gymnastics

#### 1. Conditional Types
Follow ternary syntax: \`T extends U ? TrueType : FalseType\`

#### 2. The \`infer\` Keyword
Introduces a generic type variable to be extracted during pattern matching.

\`\`\`typescript
// Extract the return type of a function:
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract Promise resolved value (Awaited):
type UnboxPromise<T> = T extends Promise<infer U> ? U : T;
\`\`\`

#### 3. Template Literal Types
Create dynamic string patterns:

\`\`\`typescript
type EventName = "click" | "hover";
type EventHandler = \`on\${Capitalize<EventName>}\`; // "onClick" | "onHover"

type Getter<T extends string> = \`get\${Capitalize<T>}\`;
\`\`\``,
    answerContent_fa: `### مباحث پیشرفته سیستم تایپ در تایپ‌اسکریپت

#### ۱. تایپ‌های شرطی (Conditional Types)
Follow ternary syntax in JavaScript: \`T extends U ? TrueType : FalseType\`

#### ۲. کلیدواژه \`infer\`
Used for dynamic extraction and pattern matching from nested types:

\`\`\`typescript
// Extract the return type of a function:
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract Promise resolved value:
type UnboxPromise<T> = T extends Promise<infer U> ? U : T;
\`\`\`

#### ۳. Template Literal Types
Generate dynamic string types based on literal values:

\`\`\`typescript
type EventName = "click" | "hover";
type EventHandler = \`on\${Capitalize<EventName>}\`; // "onClick" | "onHover"
\`\`\``,
  },
  {
    id: "ts-q3",
    stackId: "typescript",
    categoryId: "ts-advanced",
    levelId: "mid",
    topicIds: ["topic-ts-brand-types-variance"],
    questionTitle: "What are Discriminated Unions and how do they ensure exhaustive type safety?",
    questionTitle_fa: "مفهوم Discriminated Unions چیست و چگونه ایمنی کامل نوع داده (Exhaustiveness Check) را تضمین می‌کند؟",
    answerContent: `### Discriminated Unions (Tagged Unions)

A pattern where multiple types share a common literal discriminant property (\`type\`, \`kind\`, or \`status\`).

\`\`\`typescript
type NetworkState =
  | { state: "loading" }
  | { state: "success"; response: { title: string; duration: number } }
  | { state: "failed"; code: number; message: string };

function renderState(state: NetworkState): string {
  switch (state.state) {
    case "loading":
      return "Downloading...";
    case "success":
      return \`Title: \${state.response.title}\`;
    case "failed":
      return \`Error \${state.code}: \${state.message}\`;
    default:
      // Exhaustiveness check
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
  }
}
\`\`\`

> If a new state (e.g., \`state: 'idle'\`) is added to \`NetworkState\`, the TypeScript compiler will immediately fail at compile time in \`default\` until handled.`,
    answerContent_fa: `### مفهوم Discriminated Unions (اتحادهای برچسب‌دار)

الگویی که در آن چندین تایپ شیء مختلف، دارای یک فیلد مشترک با مقدار ثابت (Literal) مانند \`state\` یا \`type\` هستند.

\`\`\`typescript
type NetworkState =
  | { state: "loading" }
  | { state: "success"; response: { title: string; duration: number } }
  | { state: "failed"; code: number; message: string };

function renderState(state: NetworkState): string {
  switch (state.state) {
    case "loading":
      return "در حال بارگذاری...";
    case "success":
      return \`عنوان: \${state.response.title}\`;
    case "failed":
      return \`خطا \${state.code}: \${state.message}\`;
    default:
      // Exhaustiveness check
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
  }
}
\`\`\`

> اگر در آینده وضعیت جدیدی مانند \`state: 'idle'\` اضافه شود، کامپایلر تایپ‌اسکریپت بلافاصله در خط بررسی \`never\` خطا صادر می‌کند تا مانع از بروز باگ‌های هندل‌نشده در زمان اجرا شود.`,
  },
];
