import { Concept } from "../models";

export const typescriptConcepts: Concept[] = [
  {
    id: "concept-ts-1",
    stackId: "typescript",
    title: "Branded Types (Nominal Typing) in Structural TypeScript",
    title_fa: "تایپ‌های برچسب‌دار (Branded Types / Nominal Typing) در تایپ‌اسکریپت",
    content: `### Why Branded Types?

TypeScript's type system is **structural** (duck-typed). Sometimes, two identical structural types must not be assigned to each other for domain safety (e.g., \`UserId\` vs \`OrderId\` or \`RawHtml\` vs \`SanitizedHtml\`).

\`\`\`typescript
// Brand Symbol declaration
declare const brand: unique symbol;

type Brand<T, TBrand> = T & { readonly [brand]: TBrand };

export type UserId = Brand<string, "UserId">;
export type OrderId = Brand<string, "OrderId">;

// Constructor helper functions
export function toUserId(id: string): UserId {
  return id as UserId;
}

export function toOrderId(id: string): OrderId {
  return id as OrderId;
}

let userId = toUserId("usr_123");
let orderId = toOrderId("ord_456");

// Compile Error: Type 'OrderId' is not assignable to type 'UserId'
// userId = orderId;
\`\`\``,
    content_fa: `### چرا Branded Types؟

سیستم تایپ تایپ‌اسکریپت **ساختاری (Structural)** است. گاهی اوقات دو نوع داده از لحاظ ساختار دقیقاً رشته (\`string\`) هستند، اما منطق دامنه نمی‌پذیرد که مثلاً یک \`UserId\` به جای \`OrderId\` قرار بگیرد.

\`\`\`typescript
declare const brand: unique symbol;

type Brand<T, TBrand> = T & { readonly [brand]: TBrand };

export type UserId = Brand<string, "UserId">;
export type OrderId = Brand<string, "OrderId">;

export function toUserId(id: string): UserId {
  return id as UserId;
}

export function toOrderId(id: string): OrderId {
  return id as OrderId;
}

let userId = toUserId("usr_123");
let orderId = toOrderId("ord_456");

// خطای زمان کامپایل: متغیر OrderId به UserId قابل انتساب نیست!
// userId = orderId;
\`\`\``,
  },
  {
    id: "concept-ts-2",
    stackId: "typescript",
    title: "Covariance, Contravariance, and Invariance in Generics & Functions",
    title_fa: "مفاهیم Covariance، Contravariance و Invariance در تایپ‌ها و جنریک‌ها",
    content: `### Variance in TypeScript

- **Covariance:** Subtype relationship is preserved. \`Dog\` extends \`Animal\`, therefore \`Array<Dog>\` is assignable to \`Array<Animal>\` (function return types are covariant).
- **Contravariance:** Subtype relationship is reversed. Function parameters under \`strictFunctionTypes\` are contravariant: \`(animal: Animal) => void\` is assignable to \`(dog: Dog) => void\`.
- **Invariance:** Only exact type matching allowed (mutable read-write properties).`,
    content_fa: `### مبحث واریانس (Variance) در تایپ‌اسکریپت

- **Covariance (هم‌واریانسی):** رابطه زیرنوعی حفظ می‌شود. اگر \`Dog\` زیرنوع \`Animal\` باشد، \`Array<Dog>\` نیز به \`Array<Animal>\` قابل انتساب است (تایپ‌های بازگشتی توابع هم‌واریا هستند).
- **Contravariance (پاد‌واریا):** رابطه زیرنوعی معکوس می‌شود. پارامترهای ورودی توابع تحت پرچم \`strictFunctionTypes\` پادواریا هستند: تابع با پارامتر عمومی‌تر \`(animal: Animal) => void\` می‌تواند به جای تابع با پارامتر اختصاصی‌تر \`(dog: Dog) => void\` قرار گیرد.
- **Invariance (ناواریا):** تنها تطابق دقیق تایپ مجاز است.`,
  },
];
