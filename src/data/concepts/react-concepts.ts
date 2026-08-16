import { Concept } from "../models";

export const reactConcepts: Concept[] = [
  {
    id: "concept-react-1",
    stackId: "react",
    title: "React 19 Actions, `useActionState`, and `useOptimistic`",
    title_fa: "امکانات جدید React 19: هوک‌های useActionState و useOptimistic برای فرم‌ها و به‌روزرسانی آنی",
    content: `### React 19 Form Actions & Optimistic Updates

React 19 introduces native support for asynchronous transitions and actions:

#### 1. \`useActionState\`
Manages pending state, returned action results, and errors automatically:

\`\`\`tsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    const error = await updateName(formData.get("name"));
    if (error) return { error };
    return { success: true };
  },
  initialState
);
\`\`\`

#### 2. \`useOptimistic\`
Provides instant visual feedback while an async server action is in flight:

\`\`\`tsx
const [optimisticLikes, setOptimisticLikes] = useOptimistic(
  currentLikes,
  (state, update: number) => state + update
);
\`\`\``,
    content_fa: `### اکشن‌های فرم و به‌روزرسانی خوش‌بینانه (Optimistic) در ری‌اکت ۱۹

نسخه ۱۹ ری‌اکت پشتیبانی بومی از اکشن‌های ناهمگام را معرفی کرده است:

#### ۱. هوک \`useActionState\`
مدیریت خودکار وضعیت لودینگ، نتیجه بازگشتی و خطاهای اکشن را فراهم می‌کند:

\`\`\`tsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    const error = await updateName(formData.get("name"));
    if (error) return { error };
    return { success: true };
  },
  initialState
);
\`\`\`

#### ۲. هوک \`useOptimistic\`
نمایش لحظه‌ای نتیجه به کاربر قبل از دریافت پاسخ از سمت سرور:

\`\`\`tsx
const [optimisticLikes, setOptimisticLikes] = useOptimistic(
  currentLikes,
  (state, update: number) => state + update
);
\`\`\``,
  },
  {
    id: "concept-react-2",
    stackId: "react",
    title: "Understanding React Fiber: Cooperative Scheduling & Work Loops",
    title_fa: "درک معماری React Fiber: زمان‌بندی تعاملی و چرخه کار (Work Loop)",
    content: `### What is a Fiber?

A **Fiber** is a plain JavaScript object representing a unit of work with references to child, sibling, and return (parent) fibers.

#### Key Aspects:
- **Time-Slicing:** Breaks rendering into small work chunks that can yield execution back to the browser event loop (\`requestIdleCallback\` / scheduler).
- **Phases of React Fiber:**
  1. **Render / Reconciliation Phase:** Asynchronous, interruptible. Calculates changes.
  2. **Commit Phase:** Synchronous, non-interruptible. Applies DOM mutations and runs layout effects.`,
    content_fa: `### ساختار React Fiber چیست؟

یک **Fiber** یک شیء ساده جاوااسکریپتی است که نمایانگر یک واحد کار (Unit of Work) به همراه ارجاع به فرزند، المان هم‌رده (Sibling) و والد (Return) است.

#### ویژگی‌های حیاتی:
- **تسهیم زمان (Time-Slicing):** کار رندر به قطعات کوچک زمانی تقسیم می‌شود تا ترد اصلی مرورگر جهت پاسخگویی به تعاملات کاربر آزاد بماند.
- **فازهای دوگانه پردازش:**
  ۱. **فاز رندر (Render / Reconciliation):** ناهمگام و قابل وقفه. تغییرات محاسبه می‌شوند.
  ۲. **فاز ثبت (Commit):** همگام و غیرقابل توقف. تغییرات واقعی بر روی DOM مرورگر اعمال می‌گردند.`,
  },
];
