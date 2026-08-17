import { RoadmapTopic } from "../../../models";

export const conditionalTypesInferTopic: RoadmapTopic = {
  id: "topic-ts-conditional-types-infer",
  stepId: "step-ts-type-level",
  slug: "conditional-types-infer-pattern",
  order: 1,
  title: "Conditional Types, Distributive Laws & the 'infer' Keyword",
  title_fa: "تایپ‌های شرطی (Conditional Types)، قوانین توزیع‌پذیری و کلیدواژه infer",
  summary: "Master type-level branching (T extends U ? X : Y), union distribution mechanics, bare type parameters, and type pattern matching with infer.",
  summary_fa: "تسلط بر شروط در سطح تایپ، مکانیزم توزیع خودکار یونیون‌ها، تفاوت تایپ‌های برهنه (Bare Type) و استخراج تایپ با کلیدواژه infer.",
  readingTimeMinutes: 17,
  difficulty: "senior",
  content: `### 1. Conditional Types Syntax & Distributive Behavior

A conditional type selects one of two possible types based on a subtyping relationship test:
\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

#### Distributive Conditional Types:
When a conditional type operates on a **generic bare type parameter** \`T\`, passing a union type distributes the condition across each union member:

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArray = ToArray<string | number>; // Evaluates to string[] | number[]

// Preventing union distribution with tuple wrapping [T]:
type NonDistributiveToArray<T> = [T] extends [any] ? T[] : never;
type CombinedArray = NonDistributiveToArray<string | number>; // Evaluates to (string | number)[]
\`\`\`

---

### 2. Type Pattern Matching with the \`infer\` Keyword

The \`infer\` keyword introduces an in-place generic type variable whose type is deduced by the compiler via structural pattern matching:

\`\`\`typescript
// Unwrapping Promise inner return type:
type AwaitedType<T> = T extends Promise<infer R> ? AwaitedType<R> : T;

// Extracting function return type:
type CustomReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extracting array element type:
type ElementOf<T> = T extends (infer E)[] ? E : never;
\`\`\`

---

### 3. Advanced Example: Deep Immutable Recursive Readonly

\`\`\`typescript
type DeepReadonly<T> = T extends Function | boolean | number | string | null | undefined
    ? T
    : T extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : { readonly [P in keyof T]: DeepReadonly<T[P]> };
\`\`\``,
  content_fa: `### ۱. تایپ‌های شرطی و خاصیت توزیع‌پذیری (Distributivity)

تایپ‌های شرطی امکان انشعاب منطقی را در زمان کامپایل فراهم می‌کنند. در صورتی که تایپ ورودی یک Union Type باشد، شرط روی تک‌تک اعضا اعمال و نتیجه به صورت توزیع‌شده ترکیب می‌شود. با قرار دادن \`[T]\` درون براکت می‌توان این توزیع‌پذیری را متوقف کرد.

---

### ۲. استخراج تایپ با کلیدواژه \`infer\`

کلیدواژه **\`infer\`** به عنوان یک الگو برای استخراج خودکار بخش‌های درونی تایپ‌های پیچیده (مانند خروجی پرامیس‌ها یا المان‌های آرایه) در حین بررسی شرط استفاده می‌شود.`,
};
