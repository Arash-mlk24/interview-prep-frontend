import { RoadmapTopic } from "../../../models";

export const rscServerComponentsTopic: RoadmapTopic = {
  id: "topic-react-rsc-server-components",
  stepId: "step-react-state-ssr",
  slug: "react-server-components-ssr",
  order: 1,
  title: "React Server Components (RSC), Streaming SSR & Selective Hydration",
  title_fa: "کامپوننت‌های سمت سرور (RSC)، استریمینگ SSR و هایدریشن انتخابی",
  summary: "Understand the architectural split between Client and Server components, the RSC Flight payload protocol, and progressive HTML streaming with Suspense.",
  summary_fa: "تحلیل معماری مرز بین کامپوننت‌های کلاینت و سرور، پروتکل ارسال داده RSC Payload و استریمینگ تدریجی HTML با تگ‌های Suspense.",
  readingTimeMinutes: 18,
  difficulty: "senior",
  content: `### 1. Traditional SSR vs. React Server Components (RSC)

| Dimension | Traditional SSR (Pages Router) | React Server Components (App Router) |
| :--- | :--- | :--- |
| **Execution Environment**| Executes on server to produce HTML, then **re-executes on client** during Hydration | Executes **only on the server**; zero client JavaScript bundle size |
| **State & Effects** | Supports \`useState\` / \`useEffect\` | No hooks, no state, no browser DOM events |
| **Direct Backend Access**| Needs intermediate API routes (\`/api/data\`) | Direct database/microservice calls inside the component |
| **Re-rendering** | Re-renders on client upon user interactions | Never re-executes on client; updates via RSC payload stream |

---

### 2. The RSC Flight Protocol Payload

Server Components do NOT serialize to raw HTML alone; they stream a compact JSON-like structure (RSC Payload) representing:
- The rendered virtual node tree
- Props passed across the \`"use client"\` boundary
- Module references to Client Component chunks that must be loaded on the browser.

---

### 3. Progressive Streaming SSR with Suspense

\`\`\`tsx
// Instant shell rendering + out-of-order streaming
export default function DashboardPage() {
    return (
        <main>
            <HeaderShell /> {/* Rendered instantly in initial HTML */}
            <Suspense fallback={<AnalyticsSkeleton />}>
                <HeavyAnalyticsWidget /> {/* Streamed over the wire when DB query finishes */}
            </Suspense>
        </main>
    );
}
\`\`\``,
  content_fa: `### ۱. تفاوت رندرینگ سنتی SSR با کامپوننت‌های سمت سرور (RSC)

- **رندرینگ سنتی SSR:** کدهای جاوااسکریپت هم در سرور و هم در کلاینت برای فرآیند Hydration دانلود و اجرا می‌شدند.
- **کامپوننت‌های RSC:** حجم جاوااسکریپت ارسالی برای کلاینت **صفر بایت** است و مستقیماً می‌توانند به دیتابیس یا فایل سیستم متصل شوند.

---

### ۲. هایدریشن تدریجی و استریمینگ با Suspense

با قرار دادن بخش‌های کند دیتابیس درون تگ \`Suspense\`، اسکلت کلی صفحه فوراً به کاربر نمایش داده شده و دیتای بخش‌های سنگین به صورت تدریجی (Streaming HTML) ارسال می‌شود.`,
};
