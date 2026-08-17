import { RoadmapTopic } from "../../../models";

export const pollyV8ResiliencePipelinesTopic: RoadmapTopic = {
  id: "topic-dotnet-polly-v8-resilience-pipelines",
  stepId: "step-resilience-actors-workflows",
  slug: "fault-tolerance-polly-v8-resilience-pipelines",
  order: 1,
  title: "Fault Tolerance: Polly v8 Resilience Pipelines (Retry, Circuit Breaker, Bulkhead)",
  title_fa: "تاب‌آوری و پایداری سیستم با Polly v8: زنجیره پایپ‌لاین‌های تاب‌آوری، قطع‌کننده مدار (Circuit Breaker) و جداسازی Bulkhead",
  summary: "Architect zero-downtime distributed communications using Microsoft.Extensions.Resilience, exponential backoff with jitter, and bulkhead isolation.",
  summary_fa: "طراحی خطوط لوله پایداری در دات‌نت با نسخه مدرن Polly v8 و پکیج‌های رسمی مایکروسافت، مدیریت تکرار هوشمند با Jitter و جلوگیری از Cascading Failures.",
  readingTimeMinutes: 24,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **Modern Polly v8 Architecture**:
  - \`ResiliencePipeline\` and \`ResiliencePipelineBuilder\` in .NET 8+.
  - Integration with \`Microsoft.Extensions.Http.Resilience\` on \`IHttpClientFactory\`.
- **Core Resilience Strategies**:
  - **Retry with Exponential Backoff + Jitter**: Preventing server hammering upon recovery.
  - **Circuit Breaker**: Closed, Open, and Half-Open state machine transitions based on error rates.
  - **Bulkhead Isolation & Rate Limiter**: Limiting concurrent resource usage to isolate degraded services.
  - **Hedging & Fallback**: Speculatively issuing backup requests for tail-latency reduction.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **معماری بازطراحی‌شده Polly v8 در دات‌نت**:
  - ساخت پایپ‌لاین‌ها با \`ResiliencePipelineBuilder\` و یکپارچگی پیش‌فرض در \`IHttpClientFactory\`.
- **استراتژی‌های بنیادین تاب‌آوری**:
  - **تکرار با تاخیر نمایی همراه با Jitter**: جلوگیری از هجوم همزمان هزاران ریکوئست پس از بالا آمدن مجدد سرور.
  - **الگوی Circuit Breaker**: رفتارهای خودکار وضعیت‌های Closed، Open و Half-Open در مواجهه با خطاهای متوالی.
  - **الگوی Bulkhead**: ایزوله‌سازی ظرفیت پردازشی سرویس‌ها برای ممانعت از کرش کلی اپلیکیشن در اثر افت یک سرویس خاص.
  - **استراتژی Hedging و Fallback**: ارسال درخواست موازی جایگزین برای کاهش تاخیر دنباله (Tail Latency).

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
