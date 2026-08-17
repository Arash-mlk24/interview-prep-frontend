import { RoadmapTopic } from "../../../models";

export const caseStudyTinyurlDotnetTopic: RoadmapTopic = {
  id: "topic-dotnet-case-study-tinyurl",
  stepId: "step-dotnet-case-studies",
  slug: "system-design-case-study-tinyurl-dotnet",
  order: 1,
  title: "Case Study: Designing a High-Throughput URL Shortener with ASP.NET Core & Redis",
  title_fa: "کیس‌استادی: طراحی سامانه کوتاه‌کننده لینک در مقیاس ۱۰۰ میلیون کلیک با ASP.NET Core و Redis",
  summary: "Architect a global URL shortener: Base62 encoding, distributed ID generation (Snowflake), Redis caching layer, and database sharding.",
  summary_fa: "طراحی کامل سیستم کوتاه‌کننده آدرس: الگوریتم Base62، ایجاد شناسه‌های یکتا با اسنوفلیک، معماری کشینگ دو لایه و بهینه‌سازی ریدایرکت با تاخیر زیر ۱۰ میلی‌ثانیه.",
  readingTimeMinutes: 28,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **System Requirements & Back-of-the-envelope Estimations**:
  - Read:Write ratio of 100:1 (Read-heavy architecture).
  - Storage calculations for 500M URLs per year.
- **Key Generation Strategies**:
  - MD5/SHA-256 truncation vs. Auto-incrementing distributed Snowflake IDs + Base62 conversion.
- **Read Latency Optimization Pipeline**:
  - L1 MemoryCache + L2 Redis Cluster for 99% cache hit ratio on hot URLs.
  - HTTP 301 (Permanent) vs 302/307 (Temporary for analytics) redirect trade-offs.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **تخمین‌های سیستم و محاسبات سرانگشتی**:
  - معماری با خواندن بسیار بالا (نسبت ۱۰۰ به ۱) و محاسبه فضای ذخیره‌سازی برای صدها میلیون لینک.
- **استراتژی‌های تولید شناسه کوتاه**:
  - هشینگ در برابر تولید شناسه توزیع‌شده با الگوریتم Snowflake و تبدیل به رشته با انکودینگ Base62.
- **بهینه‌سازی تاخیر ریدایرکت (Redirect Latency)**:
  - استفاده از کش دو لایه برای پاسخ‌دهی به ۹۹٪ درخواست‌ها بدون مراجعه به دیتابیس.
  - مقایسه تریدآف‌های کدهای وضعیت HTTP 301 و 302/307 در ثبت آمار کلیک‌ها.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
