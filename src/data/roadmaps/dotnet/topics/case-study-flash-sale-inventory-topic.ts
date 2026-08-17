import { RoadmapTopic } from "../../../models";

export const caseStudyFlashSaleInventoryTopic: RoadmapTopic = {
  id: "topic-dotnet-case-study-flash-sale-inventory",
  stepId: "step-dotnet-case-studies",
  slug: "system-design-case-study-flash-sale-inventory",
  order: 2,
  title: "Case Study: High-Concurrency Flash Sale & Stock Reservation System in .NET",
  title_fa: "کیس‌استادی: طراحی سیستم حراج لحظه‌ای (Flash Sale) و کنترل موجودی انبار با ترافیک فوق‌سنگین در دات‌نت",
  summary: "Prevent overselling under 100k req/sec surges using Redis atomic Lua scripts, Optimistic Concurrency in EF Core, and RabbitMQ buffering.",
  summary_fa: "جلوگیری قطعی از فروش موجودی منفی (Overselling) تحت هجوم ترافیک صدهزار ریکوئست بر ثانیه با اسکریپت‌های اتمیک ردیس، صف‌بندی ناهمگام و قفل‌های بهینه‌بینانه.",
  readingTimeMinutes: 30,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **The Problem: Race Conditions & Negative Inventory**:
  - Why standard database transactions lock and crash under simultaneous click storms.
- **Multi-Stage Inventory Reservation Pipeline**:
  - **Stage 1 (Edge Gate)**: Rate limiting & CAPTCHA validation.
  - **Stage 2 (In-Memory Stock Check & Deduct)**: Atomic Redis Lua scripts for non-blocking stock decrements.
  - **Stage 3 (Asynchronous Order Creation)**: Pushing reserved tokens to RabbitMQ.
  - **Stage 4 (Durable Settlement)**: Background worker saving order in PostgreSQL with Optimistic Concurrency and Outbox.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **چالش اصلی: شرایط مسابقه (Race Condition) و اتمام موجودی**:
  - چرا تراکنش‌های دیتابیس رابطه‌ای سنتی تحت فشار درخواست‌های همزمان دچار Deadlock و قفل‌شدگی سرور می‌شوند.
- **پایپ‌لاین ۴ مرحله‌ای رزرو کالا**:
  - **مرحله ۱**: فیلتر ترافیک مخرب و ریت لیمیت در لایه گیت‌وی.
  - **مرحله ۲**: کسر اتمیک و بدون قفل موجودی کالا در رم با اسکریپت‌های Lua ردیس.
  - **مرحله ۳**: ارسال توکن رزرو به صف‌های بافر RabbitMQ.
  - **مرحله ۴**: ثبت نهایی سفارش در پایگاه داده اصلی توسط ورکر دات‌نت همراه با مدیریت Concurrency Token.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
