import { RoadmapTopic } from "../../../models";

export const caseStudyUrlShortenerTopic: RoadmapTopic = {
  id: "topic-sys-case-url-shortener",
  stepId: "step-sys-case-studies-core",
  slug: "designing-url-shortener-tinyurl-scale",
  order: 1,
  title: "Case Study: Designing a High-Throughput URL Shortener (TinyURL) & Distributed ID Generation (Snowflake)",
  title_fa: "کیس‌استادی: طراحی سرویس کوتاه‌کننده لینک (TinyURL) و تولید شناسه‌های یکتای توزیع‌شده (Snowflake ID)",
  summary: "End-to-end architecture: Base62 encoding, Twitter Snowflake 64-bit ID generation, Redis caching, 301 vs 302 redirects, and database capacity estimation.",
  summary_fa: "طراحی کامل معماری: انکودینگ در مبنای ۶۲، الگوریتم تولید شناسه توزیع‌شده Snowflake، کشینگ با ردیس، تفاوت ریدایرکت‌های ۳۰۱ و ۳۰۲ و محاسبات ظرفیت دیتابیس.",
  readingTimeMinutes: 21,
  difficulty: "mid",
  content: `### 1. Requirements & Back-of-the-Envelope Estimation

- **Traffic:** 100 Million new URLs created/month ($~40\\text{ writes/sec}$), 10 Billion redirections/month ($~4,000\\text{ reads/sec}$).
- **Storage:** 100M URLs $\\times 500\\text{ bytes} \\approx 50\\text{ GB/month} \\rightarrow 3\\text{ TB}$ over 5 years.
- **Short URL Length:** Base62 (\`[a-z, A-Z, 0-9]\`). With 7 characters:
  $$62^7 \\approx 3.52 \\times 10^{12} \\text{ unique URLs (3.5 Trillion URLs)}$$

---

### 2. Distributed ID Generation: Twitter Snowflake Algorithm

Instead of relying on a centralized database auto-incrementing ID (a single point of failure and bottleneck), generate unique 64-bit integers across distributed nodes:

\`\`\`
+-----------------------------------------------------------------------+
| 1-bit | 41-bit Timestamp (Epoch ms) | 10-bit Node ID | 12-bit Sequence |
+-----------------------------------------------------------------------+
\`\`\`
- Generates up to **4,096 unique IDs per millisecond per node** with chronological sorting.

---

### 3. Architecture & Redirection Flow (301 vs. 302)

- **HTTP 301 (Moved Permanently):** Browser caches redirection locally. Zero subsequent load on our servers, but **loses click analytics/metrics**.
- **HTTP 302 (Found / Temporary):** Every click hits our server first, allowing exact real-time click counting, referer tracking, and geo-analytics.

\`\`\`
User -> [CDN / Load Balancer]
     -> [API Gateway]
     -> [Redis Cache (Cache-Aside)] -> Hit: Return 302 Redirect
     -> [PostgreSQL / NoSQL Database] -> Read and backfill Redis
\`\`\``,
  content_fa: `### ۱. تخمین نیازمندی‌ها و محاسبات ظرفیت

- برای تولید ۳.۵ تریلیون لینک یکتا، از رشته‌های ۷ کاراکتری در مبنای ۶۲ (Base62 شامل حروف کوچک، بزرگ و اعداد) استفاده می‌کنیم: $62^7 \\approx 3.52 \\text{ Trillion}$.

---

### ۲. تولید شناسه توزیع‌شده با الگوریتم Twitter Snowflake

به جای تکیه بر \`Auto-Increment\` دیتابیس که گلوگاه سیستم است، شناسه‌های ۶۴ بیتی مستقل شامل **زمان میلی‌ثانیه‌ای + شناسه سرور + شمارنده داخلی** تولید می‌شوند که تا ۴۰۹۶ شناسه در میلی‌ثانیه برای هر نود تولید می‌کند.

---

### ۳. انتخاب نوع ریدایرکت: ۳۰۱ در برابر ۳۰۲

- **کد ۳۰۱ (دائمی):** مرورگر لینک مقصد را کش می‌کند و ترافیک سرور کم می‌شود، اما ثبت آمار کلیک‌ها از دست می‌رود.
- **کد ۳۰۲ (موقتی):** هر کلیک به سرور ما می‌آید و امکان ثبت آمار دقیق، موقعیت جغرافیایی و دستگاه کاربر را فراهم می‌سازد.`,
};
