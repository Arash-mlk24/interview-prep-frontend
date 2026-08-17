import { RoadmapTopic } from "../../../models";

export const opentelemetryTracingMetricsTopic: RoadmapTopic = {
  id: "topic-dotnet-opentelemetry-tracing-metrics",
  stepId: "step-observability-cloud-native",
  slug: "distributed-observability-opentelemetry-tracing-metrics",
  order: 1,
  title: "Distributed Observability: OpenTelemetry Tracing, Prometheus Metrics & Structured Logs",
  title_fa: "پایشگری توزیع‌شده (Observability): ردیابی بلادرنگ با OpenTelemetry، متریک‌های Prometheus و لاگ‌های ساخت‌یافته با Serilog",
  summary: "Instrument full-stack distributed telemetry with OpenTelemetry (OTel), W3C TraceContext propagation, Prometheus scraping, and Jaeger/Tempo.",
  summary_fa: "پیاده‌سازی ۳ ستون اصلی مانیتورینگ سیستم‌های توزیع‌شده: ردیابی توزیع‌شده با استاندارد W3C در OpenTelemetry، استخراج متریک‌ها با پرومتئوس و لاگ‌های غنی در گرافانا.",
  readingTimeMinutes: 24,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **The 3 Pillars of Observability in .NET**:
  - **Traces**: \`ActivitySource\` and W3C TraceContext propagation across HTTP and messaging brokers.
  - **Metrics**: \`Meter\`, Counters, Histograms exported to Prometheus and Grafana dashboards.
  - **Logs**: High-performance structured logging with Serilog / OTel Logging SDK.
- **Visualizing Traces**: Correlating distributed spans across 10+ services in Jaeger / Grafana Tempo.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **۳ ستون پایشگری (Observability) در دات‌نت**:
  - **ردیابی (Distributed Traces)**: انتشار TraceParent و هدرهای استاندارد W3C بین سرویس‌ها از طریق HTTP و صف‌های پیام.
  - **متریک‌ها (Metrics)**: شمارنده‌ها و هیستوگرام‌های زمان پاسخ‌دهی (Latency Histograms) متصل به Prometheus.
  - **لاگ‌ها (Structured Logs)**: لاگ‌گیری ساخت‌یافته و بدون هزینه آلیکیشن اضافی با Serilog.
- **تحلیل و ریشه‌یابی خطاها**: اتصال Spanها برای مشاهده جریان کامل یک تراکنش کاربر در داشبوردهای Jaeger و Grafana Tempo.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
