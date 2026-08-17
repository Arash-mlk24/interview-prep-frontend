import { RoadmapTopic } from "../../../models";

export const caseStudyApiGatewayTopic: RoadmapTopic = {
  id: "topic-sys-case-api-gateway",
  stepId: "step-sys-case-studies-core",
  slug: "designing-distributed-api-gateway-rate-limiter",
  order: 2,
  title: "Case Study: Designing a High-Throughput Distributed API Gateway",
  title_fa: "کیس‌استادی: طراحی درگاه یکپارچه (API Gateway) و سیستم کنترل ترافیک توزیع‌شده",
  summary: "Architecting a unified edge entry point: TLS termination, JWT validation, rate limiting, dynamic upstream routing, circuit breaking, and response aggregation (BFF).",
  summary_fa: "معماری نقطه ورود یکپارچه سیستم: خاتمه TLS، اعتبارسنجی JWT، اعمال سهمیه مصرف، مسیریابی پویا به مایکروسرویس‌ها، قطع‌کننده مدار (Circuit Breaker) و الگوی BFF.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. Responsibilities of an Enterprise API Gateway

\`\`\`
Client (Web / Mobile)
       | (HTTPS / gRPC-Web)
       v
[ API GATEWAY (Kong / Envoy / YARP / Ocelot) ]
  ├── 1. TLS Termination & HTTP/2 Multiplexing
  ├── 2. JWT Authentication & Claims Transformation
  ├── 3. Distributed Rate Limiting (Redis Token Bucket)
  ├── 4. Circuit Breaker & Retries (Polly / Envoy mesh)
  ├── 5. Distributed Tracing Injection (W3C traceparent)
  └── 6. Dynamic Upstream Service Discovery (Consul / K8s DNS)
       |
       +----> [ User Service ]
       +----> [ Order Service ]
       +----> [ Payment Service ]
\`\`\`

---

### 2. The Backend-for-Frontend (BFF) Pattern

Rather than a single monolithic gateway for all devices:
- **Mobile BFF:** Aggregates multiple downstream microservice calls into a single compact JSON payload to save mobile cellular bandwidth.
- **Web BFF:** Streams rich data via HTTP/2 Server-Sent Events or WebSockets.

---

### 3. Performance Best Practices

1. **Non-Blocking Asynchronous I/O:** Built on asynchronous event loops (Netty, Envoy, ASP.NET Core Kestrel).
2. **Stateless Clustering:** Place behind an L4 Network Load Balancer (NLB) for horizontal scaling.
3. **Local JWT Verification:** Verify asymmetric RSA/ECDSA public keys in-memory without calling the Auth Service for every single request.`,
  content_fa: `### ۱. وظایف اصلی یک API Gateway سازمانی

- **خاتمه TLS:** دریافت ارتباط امن HTTPS و ارسال درخواست‌های داخلی با پروتکل‌های سبک و سریع به مایکروسرویس‌ها.
- **احراز هویت غیرمتمرکز:** اعتبارسنجی توکن‌های JWT با کلید عمومی در حافظه Gateway بدون ارسال درخواست به سرور Auth در هر ریکوئست.
- **الگوی BFF (Backend For Frontend):** ارائه درگاه‌های اختصاصی متناسب با نیازهای موبایل و وب جهت کاهش تعداد ریکوئست‌های کلاینت.
- **مدیریت خطا و تاب‌آوری:** مجهز به فیوز مدار (Circuit Breaker) برای جلوگیری از مسدود شدن سیستم در اثر قطعی یکی از سرویس‌ها.`,
};
