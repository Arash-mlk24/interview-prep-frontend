import { RoadmapTopic } from "../../../models";

export const concurrentRenderingTopic: RoadmapTopic = {
  id: "topic-react-concurrent-rendering",
  stepId: "step-react-core-fiber",
  slug: "concurrent-rendering-transitions",
  order: 2,
  title: "Concurrent Mode, useTransition & High-Frequency State Updates",
  title_fa: "مدهای همزمانی (Concurrent React)، هوک useTransition و مدیریت آپدیت‌های پرتکرار",
  summary: "Master interruptible rendering, transition lanes, startTransition, useDeferredValue, and preventing input latency during complex visual updates.",
  summary_fa: "تسلط بر اولویت‌بندی رندر در ری‌اکت ۱۸+، خطوط اولویت (Lanes)، هوک‌های startTransition و useDeferredValue و حذف لگ کیبورد در رندرهای سنگین.",
  readingTimeMinutes: 15,
  difficulty: "senior",
  content: `### 1. Concurrent Rendering & Priority Lanes

In React 18+, rendering is no longer an all-or-nothing synchronous operation. React assigns updates to **Priority Lanes**:
- **SyncLane / InputContinuousLane:** Discrete user interactions (typing, clicking, sliders) that demand immediate $<16\\text{ms}$ responsiveness.
- **TransitionLane:** Non-urgent background computations (data filtering, chart rendering, tab switching).

---

### 2. \`useTransition\` vs. \`useDeferredValue\`

\`\`\`tsx
// useTransition: Marks the state dispatch as low-priority
const [isPending, startTransition] = useTransition();

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. High-Priority (Immediate Input Echo)
    setInputValue(e.target.value);

    // 2. Low-Priority (Interruptible Filter Calculation)
    startTransition(() => {
        setSearchQuery(e.target.value);
    });
};
\`\`\`

\`\`\`tsx
// useDeferredValue: Defers an incoming value when props/state are immutable
const deferredQuery = useDeferredValue(searchQuery);
const isStale = deferredQuery !== searchQuery;

return (
    <div style={{ opacity: isStale ? 0.6 : 1 }}>
        <HeavySearchResults query={deferredQuery} />
    </div>
);
\`\`\``,
  content_fa: `### ۱. رندرینگ همگام در برابر اولویت‌بندی همزمانی (Concurrent React)

در ری‌اکت ۱۸ به بعد، رندرها بر اساس **خطوط اولویت (Lanes)** دسته‌بندی می‌شوند تا تایپ کردن کاربر یا کلیک‌ها هرگز قربانی رندرهای سنگین نمودارها یا لیست‌ها نشوند.

---

### ۲. هوک‌های \`useTransition\` و \`useDeferredValue\`

- **\`useTransition\`:** تبدیل آپدیت‌های سنگین State به اولویت پایین تا کاربر هنگام تایپ هیچ تاخیری احساس نکند.
- **\`useDeferredValue\`:** به تاخیر انداختن پردازش مقادیر ورودی تا زمان آزاد شدن نخ اصلی مرورگر همراه با نمایش حالت لودینگ مات.`,
};
