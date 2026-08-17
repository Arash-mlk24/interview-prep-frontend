import { RoadmapTopic } from "../../../models";

export const pollyResilienceTopic: RoadmapTopic = {
  id: "topic-dotnet-polly-resilience",
  stepId: "step-observability-resilience",
  slug: "polly-resilience-circuit-breaker-rate-limiter",
  order: 2,
  title: "Fault Tolerance with Polly v8: Circuit Breaker, Hedging, Retries & Bulkheads",
  title_fa: "تاب‌آوری و کنترل خطا با Polly v8: قطع‌کننده مدار (Circuit Breaker)، تلاش مجدد و Bulkhead",
  summary: "Master modern Microsoft.Extensions.Resilience pipelines, exponential backoff with decorrelated jitter, circuit breaker state transitions, and hedging strategies.",
  summary_fa: "تسلط بر پایپ‌لاین‌های تاب‌آوری مدرن در دات‌نت ۸ و ۹ با پکیج Microsoft.Extensions.Resilience، الگوهای تلاش مجدد با Jitter، استیت‌های قطع‌کننده مدار و ارسال موازی درخواست‌ها (Hedging).",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. Resilience Pipelines with Polly v8 (.NET 8+)

\`\`\`csharp
// Configure resilient pipeline using Microsoft.Extensions.Resilience
builder.Services.AddResiliencePipeline("default-http-pipeline", pipelineBuilder => {
    pipelineBuilder
        .AddRetry(new RetryStrategyOptions {
            MaxRetryAttempts = 3,
            BackoffType = DelayBackoffType.Exponential,
            UseJitter = true,
            Delay = TimeSpan.FromMilliseconds(200)
        })
        .AddCircuitBreaker(new CircuitBreakerStrategyOptions {
            FailureRatio = 0.5, // Trip if 50% fail
            SamplingDuration = TimeSpan.FromSeconds(10),
            MinimumThroughput = 8,
            BreakDuration = TimeSpan.FromSeconds(30)
        })
        .AddTimeout(TimeSpan.FromSeconds(3));
});
\`\`\`

---

### 2. Circuit Breaker State Transitions

1. **Closed (Normal):** All requests pass through. Failures are counted.
2. **Open (Tripped):** When failure threshold is exceeded, all incoming calls fail immediately without touching the downstream dependency.
3. **Half-Open (Testing):** After \`BreakDuration\` expires, allow 1 test request. If it succeeds $\\rightarrow$ transition to **Closed**; if it fails $\\rightarrow$ reset back to **Open**.`,
  content_fa: `### ۱. پایپ‌لاین‌های تاب‌آوری در Polly v8

با استفاده از کتابخانه استاندارد \`Microsoft.Extensions.Resilience\` در دات‌نت، الگوهای تلاش مجدد با تاخیر نمایی و انحراف تصادفی (Jitter)، قطع‌کننده مدار (Circuit Breaker) و تایم‌اوت در قالب یک پایپ‌لاین یکپارچه اعمال می‌شوند.

---

### ۲. وضعیت‌های سه‌گانه Circuit Breaker

- **بسته (Closed - حالت عادی):** درخواست‌ها با موفقیت عبور می‌کنند.
- **باز (Open - حالت قطع):** در صورت بالا رفتن آمار خطا از ۵۰٪، مدار باز شده و درخواست‌ها بلافاصله رد می‌شوند تا سرویس مقصد زیر بار نسوزد.
- **نیمه‌باز (Half-Open - آزمایش):** پس از گذشت زمان تنفس (مثلاً ۳۰ ثانیه)، چند درخواست آزمایشی عبور می‌کنند تا در صورت بازگشت سرویس، سیستم به حالت عادی برگردد.`,
};
