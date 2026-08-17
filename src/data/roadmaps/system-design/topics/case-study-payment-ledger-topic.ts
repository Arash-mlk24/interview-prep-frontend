import { RoadmapTopic } from "../../../models";

export const caseStudyPaymentLedgerTopic: RoadmapTopic = {
  id: "topic-sys-case-payment-ledger",
  stepId: "step-sys-case-studies-complex",
  slug: "designing-distributed-payment-system-double-entry",
  order: 2,
  title: "Case Study: Designing a Distributed Payment & Wallet System (Double-Entry Ledger & Zero Data Loss)",
  title_fa: "کیس‌استادی: طراحی سیستم پرداخت و والت مالی توزیع‌شده (سیستم دوبل حسابداری و تضمین صفر درصد خطای داده)",
  summary: "Mission-critical financial engineering: Double-entry bookkeeping, strict ACID invariants, idempotent payment gateways, reconciliation engines, and distributed transaction boundaries.",
  summary_fa: "معماری سیستم‌های مالی حساس: الگوهای حسابداری دوبل (بدهکار/بستانکار)، انطباق سخت‌گیرانه با ACID، کلیدهای یکتایی پرداخت، موتورهای مغایرت‌گیری و مرزبندی تراکنش‌ها.",
  readingTimeMinutes: 24,
  difficulty: "lead",
  content: `### 1. The Golden Rule of FinTech: Double-Entry Bookkeeping

In a financial system, money is **never created or destroyed out of thin air**; it only moves from one account to another. Every transaction consists of at least two entries:

$$\\sum \\text{Debits} = \\sum \\text{Credits}$$

#### Core Ledger Schema (PostgreSQL):
\`\`\`sql
CREATE TABLE ledger_entries (
    entry_id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL,
    account_id UUID NOT NULL,
    amount DECIMAL(18, 4) NOT NULL, -- Positive for Credit, Negative for Debit
    currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invariant Trigger: Sum of amounts for any transaction_id MUST EQUAL ZERO:
-- SUM(amount) WHERE transaction_id = X == 0
\`\`\`

---

### 2. High-Level Payment State Machine

\`\`\`
[ User Checkout ]
       |
       v (Idempotency Key: "order_uuid_101")
[ Payment Service ] 
  ├── 1. Reserve Funds in Wallet (Ledger: Debit User, Credit Pending Account)
  ├── 2. Dispatch to External PSP (Stripe / Adyen / Bank Gateway)
  │      ├── Timeout / Network Drop? -> Query PSP Status Endpoint
  │      ├── Success? -> Finalize Ledger (Debit Pending, Credit Merchant)
  │      └── Failure? -> Compensating Transaction (Refund User)
\`\`\`

---

### 3. Asynchronous Nightly Reconciliation Engine

Financial systems can never trust 100% of network calls. Every night:
1. Download settlement CSV files from external payment gateways/banks.
2. The **Reconciliation Engine** matches internal database ledger entries against external bank statements.
3. Automatically flags unmatched or delayed transactions for human/automated settlement adjustment.`,
  content_fa: `### ۱. اصل بنیادین سیستم‌های مالی: حسابداری دوبل (Double-Entry)

در سیستم‌های مالی پول هرگز «تغییر مستقیم موجودی با \`balance = balance + X\`» پیدا نمی‌کند؛ بلکه در قالب یک رکورد تراکنش با دو ورودی بدهکار (Debit) و بستانکار (Credit) ثبت می‌شود که مجموع جبری آن‌ها همواره باید **دقیقاً صفر** باشد.

---

### ۲. مدیریت ارتباط با درگاه‌های بانکی و قطعی شبکه

- **Idempotency Key:** جلوگیری از کسر دوباره پول هنگام دو بار کلیک کردن کاربر یا تلاش مجدد شبکه.
- **استعلام وضعیت (Polling/Webhook):** در صورت قطع شدن اینترنت حین تراکنش، سرویس به جای فرض شکست، وضعیت تراکنش را از درگاه بانکی استعلام می‌کند.

---

### ۳. موتور مغایرت‌گیری شبانه (Reconciliation)

سیستم مالی هر شب فایل صورت‌حساب شاپرک یا بانک را دریافت کرده و با تمام رکوردهای لجر داخلی مقایسه می‌کند تا حتی یک ریال مغایرت نیز شناسایی و ثبت شود.`,
};
