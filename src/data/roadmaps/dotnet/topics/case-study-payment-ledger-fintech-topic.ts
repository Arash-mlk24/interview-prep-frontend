import { RoadmapTopic } from "../../../models";

export const caseStudyPaymentLedgerFintechTopic: RoadmapTopic = {
  id: "topic-dotnet-case-study-payment-ledger-fintech",
  stepId: "step-dotnet-case-studies",
  slug: "system-design-case-study-payment-ledger-fintech",
  order: 4,
  title: "Case Study: FinTech Payment Gateway & Double-Entry Accounting Ledger",
  title_fa: "کیس‌استادی: درگاه پرداخت مالی (FinTech) و سیستم دفترکل دوبل (Double-Entry Ledger) در دات‌نت",
  summary: "Architect a mission-critical financial ledger: Immutable audit logs, strict idempotency, 2-phase settlement, and zero-loss reconciliation.",
  summary_fa: "طراحی سامانه پرداختی فوق‌امن فین‌تک: دفترکل حسابداری دوطرفه تغییرناپذیر، کلیدهای تکرارپذیری، تسویه دومرحله‌ای و سیستم مغایرت‌گیری بلادرنگ.",
  readingTimeMinutes: 32,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **Core Financial Invariants**:
  - Double-entry accounting principles: Every debit must equal an exact credit ($Sum(Debits) == Sum(Credits)$).
  - Immutable append-only transaction logs.
- **Idempotent Payment Ingestion**:
  - Deterministic idempotency keys passed from clients to prevent double charges on network timeouts.
  - State machine workflow: Initiated -> Authorized -> Captured / Refunded.
- **Reconciliation & Auditing**:
  - Daily reconciliation jobs comparing bank settlement statements against internal ledger records.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **قوانین تغییرناپذیر سیستم‌های مالی (Financial Invariants)**:
  - قاعده دفترکل دوبل (Double-Entry): هر برداشت حساب باید دقیقا برابر با یک واریز باشد و رکوردهای مالی هرگز آپدیت یا حذف فیزیکی نمی‌شوند (Append-Only).
- **دریافت امن و بدون تکرار تراکنش‌ها (Idempotency)**:
  - استفاده از کلیدهای یکتا جهت ممانعت از کسر وجه تکراری در قطعی شبکه کلاینت.
  - ماشین وضعیت پرداخت با مراحل مجزای احراز، مسدودی و تسویه نهایی (Auth-Capture).
- **مغایرت‌گیری خودکار (Reconciliation)**:
  - جاب‌های دوره‌ای مقایسه فایل‌های تسویه بانکی با تراکنش‌های ثبت‌شده در پایگاه داده.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
