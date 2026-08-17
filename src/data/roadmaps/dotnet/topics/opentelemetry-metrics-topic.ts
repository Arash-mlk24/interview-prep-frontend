import { RoadmapTopic } from "../../../models";

export const opentelemetryMetricsTopic: RoadmapTopic = {
  id: "topic-dotnet-opentelemetry",
  stepId: "step-observability-resilience",
  slug: "opentelemetry-distributed-tracing-metrics-dotnet",
  order: 1,
  title: "Distributed Tracing & Metrics with OpenTelemetry in .NET Core",
  title_fa: "رهگیری توزیع‌شده و پردازش متریک‌ها با OpenTelemetry در دات‌نت کور",
  summary: "Master ActivitySource, System.Diagnostics.Metrics, W3C traceparent propagation, Prometheus exporters, and Serilog structured log enrichment.",
  summary_fa: "تسلط بر ActivitySource، استانداردهای W3C TraceContext، انتشار متریک‌ها برای Prometheus و غنی‌سازی لاگ‌های ساخت‌یافته Serilog.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. OpenTelemetry in Modern .NET

.NET includes native OpenTelemetry runtime primitives inside \`System.Diagnostics\`:
- **Traces:** Managed via \`ActivitySource\` and \`Activity\`.
- **Metrics:** Managed via \`Meter\` and \`Counter<T>\` / \`Histogram<T>\`.

\`\`\`csharp
// Defining an ActivitySource in domain layer
public static class TelemetryDiagnostics {
    public static readonly ActivitySource Source = new("Enterprise.PaymentService", "1.0.0");
    public static readonly Meter Meter = new("Enterprise.PaymentService", "1.0.0");
    public static readonly Counter<long> PaymentCounter = Meter.CreateCounter<long>("payments_processed_total");
}

// In Payment Handler:
using var activity = TelemetryDiagnostics.Source.StartActivity("ProcessPayment");
activity?.SetTag("payment.provider", "Stripe");
activity?.SetTag("payment.amount", 450.00);

TelemetryDiagnostics.PaymentCounter.Add(1, new KeyValuePair<string, object?>("status", "success"));
\`\`\``,
  content_fa: `### ۱. پیاده‌سازی بومی OpenTelemetry در دات‌نت

دات‌نت مدرن به صورت داخلی از کلاس‌های \`ActivitySource\` برای ثبت Spans و کلاس \`Meter\` برای متریک‌ها استفاده می‌کند. این اطلاعات با هدر استاندارد \`traceparent\` در بین تمام درخواست‌های HTTP و gRPC منتشر می‌شوند تا در ابزارهای Jaeger و Grafana قابل رصد باشند.`,
};
