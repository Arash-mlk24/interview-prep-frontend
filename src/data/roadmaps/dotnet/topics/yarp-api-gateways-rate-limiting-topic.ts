import { RoadmapTopic } from "../../../models";

export const yarpApiGatewaysRateLimitingTopic: RoadmapTopic = {
  id: "topic-dotnet-yarp-api-gateways-rate-limiting",
  stepId: "step-traffic-gateways-protocols",
  slug: "traffic-management-yarp-api-gateways-rate-limiting",
  order: 3,
  title: "Traffic Management: Microsoft YARP, API Gateways & Distributed Rate Limiting",
  title_fa: "مدیریت ترافیک کلان: درگاه‌های API با مایکروسافت YARP و الگوریتم‌های توزیع‌شده Rate Limiting",
  summary: "Design scalable edge gateways with Microsoft YARP (Yet Another Reverse Proxy), Backend for Frontend (BFF), and ASP.NET Core Token Bucket rate limiters.",
  summary_fa: "معماری درگاه‌های لایه Edge با ریورس پروکسی رسمی مایکروسافت (YARP)، الگوی BFF، لود بالانسینگ و پیاده‌سازی محدودسازی نرخ با ردیس.",
  readingTimeMinutes: 26,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **Microsoft YARP Architecture**:
  - High-performance reverse proxy built on ASP.NET Core pipelines.
  - Route configurations, clusters, dynamic configuration reload, and custom transforms.
- **Backend-for-Frontend (BFF) Pattern**:
  - Optimizing payloads and authentication per client platform (Mobile vs Web vs 3rd Party).
- **Distributed Rate Limiting Algorithms**:
  - Fixed Window, Sliding Window Log, Token Bucket, and Leaky Bucket.
  - ASP.NET Core built-in RateLimiting middleware with Redis-backed distributed counters.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **معماری Microsoft YARP**:
  - ریورس پروکسی سریع و ماژولار مایکروسافت بر بستر Kestrel و خط لوله ASP.NET Core.
  - تنظیم داینامیک Routeها، Clusterها، ترانسفورم‌ها و تعادل بار ترافیک.
- **الگوی Backend-for-Frontend (BFF)**:
  - بهینه‌سازی پاسخ‌ها و تجمیع داده‌ها به تفکیک کلاینت‌های وب، موبایل و سرویس‌های بیرونی.
  - متمرکزسازی احراز هویت در لایه گیت‌وی.
- **الگوریتم‌های توزیع‌شده Rate Limiting**:
  - بررسی Token Bucket، Sliding Window و Leaky Bucket.
  - پیاده‌سازی میدل‌ویر RateLimiter در دات‌نت متصل به کلاسترهای Redis جهت مقابله با حملات DoS و سوءاستفاده از API.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
