import { RoadmapTopic } from "../../../models";

export const caseStudyDistributedTracingTopic: RoadmapTopic = {
  id: "topic-sys-case-distributed-tracing",
  stepId: "step-sys-case-studies-complex",
  slug: "designing-distributed-tracing-observability-pipeline",
  order: 3,
  title: "Case Study: Designing a High-Throughput Distributed Tracing & Metrics Pipeline (OpenTelemetry / Jaeger)",
  title_fa: "کیس‌استادی: طراحی پایپ‌لاین رهگیری توزیع‌شده و پردازش متریک‌ها (مشابه OpenTelemetry و Jaeger)",
  summary: "Architecting telemetry at scale: W3C TraceContext propagation, adaptive tail-sampling, Kafka buffering, and ClickHouse/OpenSearch analytical storage.",
  summary_fa: "معماری مانیتورینگ و لاگینگ در مقیاس میلیاردها ریکوئست: انتشار هدرهای TraceContext، نمونه‌برداری هوشمند (Tail Sampling)، بافرینگ با کافکا و ذخیره‌سازی در ClickHouse.",
  readingTimeMinutes: 21,
  difficulty: "lead",
  content: `### 1. The Core Anatomy of a Distributed Trace

\`\`\`
[ Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736 ]
  ├── Span 1 (Root): HTTP GET /checkout [API Gateway] (150ms)
  │     ├── Span 2: JWT Auth Check [Auth Service] (12ms)
  │     ├── Span 3: Reserve Inventory [Inventory Service] (45ms)
  │     │     └── Span 4: PostgreSQL SELECT FOR UPDATE (18ms)
  │     └── Span 5: Charge Credit Card [Payment Service] (85ms)
\`\`\`

---

### 2. High-Throughput Telemetry Ingestion Architecture

\`\`\`
Microservices (Go / .NET / Node.js / Java)
   | (OTLP / gRPC: Batched Traces & Metrics)
   v
[ OpenTelemetry Collectors (Agent DaemonSet) ]
   |
   v (Head & Tail-Sampling: 100% of Errors, 1% of 200 OKs)
[ Kafka Buffer Topic: "telemetry-traces" ]
   |
[ Ingestion Stream Processors (Flink / Vector) ]
   |
[ Analytical Columnar Database: ClickHouse / OpenSearch ]
   ^
   | (Fast Sub-Second Analytical Queries)
[ Jaeger UI / Grafana Dashboards ]
\`\`\`

---

### 3. Tail-Based Sampling vs. Head-Based Sampling

- **Head-Based Sampling:** Decides whether to record a trace at the very beginning (e.g., at the API Gateway randomly choosing $5\\%$ of requests).
  - *Problem:* Completely misses critical rare $500$ Internal Server Errors that occur deep inside downstream microservices.
- **Tail-Based Sampling:** Buffers all spans of a trace in memory until the entire trace completes.
  - *Guarantee:* Automatically samples and retains **$100\\%$ of traces with HTTP $5\\text{xx}$ errors or high latency ($> 2\\text{s}$)**, while saving storage by keeping only $0.5\\%$ of fast successful requests.`,
  content_fa: `### ۱. ساختار یک رهگیری توزیع‌شده (Distributed Trace)

هر درخواست ورودی از کلاینت یک **Trace ID** یکتا دریافت کرده و با عبور از هر میکروسرویس یک **Span ID** زیرمجموعه تولید می‌کند که هدر \`traceparent\` استاندارد W3C را در تمام درخواست‌های HTTP و gRPC با خود حمل می‌کند.

---

### ۲. پایپ‌لاین بلادرنگ دریافت داده‌های مانیتورینگ

۱. کتابخانه‌های OpenTelemetry درون کدها متریک‌ها و Spans را به صورت دسته‌ای (Batch) به ایجنت OTel ارسال می‌کنند.
۲. داده‌ها برای جلوگیری از افت کارایی سیستم، درون صف‌های پرسرعت کافکا ریخته می‌شوند.
۳. در نهایت داده‌ها در دیتابیس‌های تحلیلی ستونی بسیار سریع مانند **ClickHouse** ذخیره شده و در داشبوردهای Grafana و Jaeger قابل مشاهده می‌شوند.

---

### ۳. نمونه‌برداری هوشمند بر اساس خروجی (Tail-Based Sampling)

به جای نمونه‌برداری تصادفی در ورودی، با این روش سیستم تمام رکوردهای با ارور ۵۰۰ یا تاخیر بالای ۲ ثانیه را ۱۰۰٪ ذخیره می‌کند و برای ریکوئست‌های موفق، تنها درصد کمی را جهت صرفه‌جویی در حجم هارد نگه می‌دارد.`,
};
