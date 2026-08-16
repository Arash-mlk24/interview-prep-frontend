import { Question } from "../models";

export const reactQuestions: Question[] = [
  {
    id: "react-q1",
    stackId: "react",
    categoryId: "react-fundamentals",
    levelId: "junior",
    questionTitle: "What is the Virtual DOM and how does React reconciliation (Diffing) work?",
    questionTitle_fa: "Virtual DOM چیست و فرآیند تطبیق (Reconciliation / Diffing) در ری‌اکت چگونه کار می‌کند؟",
    answerContent: `### Virtual DOM & Reconciliation

The **Virtual DOM (VDOM)** is an in-memory representation of real DOM elements produced by React component render functions.

#### The Reconciliation Process:
1. When state or props change, React calls the component function to generate a new VDOM tree.
2. React diffs the new VDOM tree against the previous snapshot (heuristic $O(n)$ diffing algorithm).
3. The diffing heuristics assume:
   - Elements with different types produce completely different trees.
   - Keys must be stable, predictable, and unique among siblings.
4. React computes the minimal batch of real DOM mutations (Commit Phase) and applies them via the browser DOM API.

\`\`\`jsx
// Stable Keys prevent re-mounting sibling DOM nodes
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
\`\`\``,
    answerContent_fa: `### Virtual DOM و فرآیند تطبیق (Reconciliation)

**دام مجازی (Virtual DOM)** نمایشی ساختاریافته در حافظه جاوااسکریپت از عناصر واقعی DOM مرورگر است.

#### مراحل فرآیند Reconciliation:
۱. با تغییر State یا Props، توابع رندر کامپوننت فراخوانی شده و یک درخت جدید VDOM تولید می‌شود.
۲. الگوریتم ابتکاری ری‌اکت با پیچیدگی زمانی $O(n)$ درخت جدید را با نسخه پیشین مقایسه (Diff) می‌کند.
۳. اصول کلیدی مقایسه:
   - تغییر نوع تگ (Element Type) کل زیردرخت را بازسازی می‌کند.
   - ویژگی \`key\` برای تشخیص آیتم‌های جابجا شده در میان المان‌های هم‌رده استفاده می‌شود.
۴. در مرحله Commit، تنها حداقل تغییرات لازم به صورت دسته‌ای (Batch) روی DOM واقعی مرورگر اعمال می‌شوند.`,
  },
  {
    id: "react-q2",
    stackId: "react",
    categoryId: "react-performance",
    levelId: "mid",
    questionTitle: "When should you use useMemo, useCallback, and React.memo?",
    questionTitle_fa: "چه زمانی باید از useMemo، useCallback و React.memo استفاده کرد؟",
    answerContent: `### Optimization Tools in React

#### 1. \`React.memo\` (Higher-Order Component)
- Prevents re-rendering of a child component if its props have not shallowly changed.
- **Best for:** Heavy components that re-render often with identical props.

#### 2. \`useCallback(fn, deps)\`
- Memoizes a function reference between renders.
- **Best for:** Passing callback props to \`React.memo\` wrapped children, or dependencies in \`useEffect\`.

\`\`\`tsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
\`\`\`

#### 3. \`useMemo(() => compute(), deps)\`
- Memoizes the calculated result of an expensive computation.
- **Best for:** Filtering/sorting large lists (e.g., > 1,000 items) or maintaining stable object references passed to context.

> **Rule of thumb:** Do not prematurely optimize every function or object literal. Memoization has a memory and comparison cost overhead.`,
    answerContent_fa: `### ابزارهای بهینه‌سازی کارایی در ری‌اکت

#### ۱. \`React.memo\`
- از رندر مجدد کامپوننت فرزند در صورتی که Props آن دچار تغییر سطحی (Shallow Change) نشده باشند جلوگیری می‌کند.
- **مناسب برای:** کامپوننت‌های سنگین با Props ثابت.

#### ۲. \`useCallback\`
- مرجع (Reference) یک تابع را بین رندرهای متوالی حفظ و کش می‌کند.
- **مناسب برای:** ارسال توابع به عنوان Prop به کامپوننت‌های بهینه‌شده با \`React.memo\` یا استفاده در آرایه وابستگی \`useEffect\`.

\`\`\`tsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
\`\`\`

#### ۳. \`useMemo\`
- نتیجه یک محاسبه سنگین محاسباتی را کش می‌کند.
- **مناسب برای:** فیلتر یا مرتب‌سازی آرایه‌های حجیم داده یا ایجاد آبجکت‌های کانتکست با مرجع پایدار.`,
  },
  {
    id: "react-q3",
    stackId: "react",
    categoryId: "nextjs-app-router",
    levelId: "senior",
    questionTitle: "What are React Server Components (RSC) vs Client Components in Next.js App Router?",
    questionTitle_fa: "تفاوت کامپوننت‌های سروری ری‌اکت (RSC) با کامپوننت‌های کلاینت در Next.js App Router چیست؟",
    answerContent: `### React Server Components (RSC) vs. Client Components

#### React Server Components (Default in App Router)
- **Execution:** Execute **exclusively on the server** during build time or request time.
- **Bundle Size:** Zero impact on JavaScript bundle sent to the client.
- **Capabilities:** Direct database/filesystem access, secure API keys usage without leaking secrets.
- **Limitations:** Cannot use browser APIs, event listeners (\`onClick\`), or React state/effects (\`useState\`, \`useEffect\`).

#### Client Components (\`'use client'\`)
- **Execution:** Prerendered on the server (SSR) and hydrated on the client.
- **Capabilities:** Interactive state, browser APIs, custom hooks, event listeners.

\`\`\`tsx
// Server Component (Default)
import db from '@/lib/db';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return (
    <div>
      <h1>{product.name}</h1>
      {/* Client Component for interactivity */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}
\`\`\``,
    answerContent_fa: `### مقایسه کامپوننت‌های سروری (RSC) و کلاینتی

#### کامپوننت‌های سمت سرور (پیش‌فرض در App Router)
- **محل اجرا:** صرفاً روی سرور (هنگام Build یا زمان دریافت ریکوئست).
- **حجم باندل:** صفر درصد کد به باندل جاوااسکریپت کاربر اضافه می‌شود.
- **مزایا:** دسترسی مستقیم و ایمن به دیتابیس، فایل‌سیستم و کلیدهای محرمانه API بدون لو رفتن در مرورگر.
- **محدودیت:** عدم امکان استفاده از State، Effect و Event Handlerهای مرورگر.

#### کامپوننت‌های سمت کلاینت (\`'use client'\`)
- **محل اجرا:** رندر اولیه روی سرور (SSR) و سپس هایدریشن (Hydration) روی مرورگر کاربر.
- **امکانات:** تعاملات کاربر، هوک‌های تعاملی (\`useState\`, \`useEffect\`) و رویدادها.`,
  },
  {
    id: "react-q4",
    stackId: "react",
    categoryId: "state-management",
    levelId: "senior",
    questionTitle: "How does React 18/19 Concurrent Rendering and useTransition improve UX?",
    questionTitle_fa: "رندرینگ همروند (Concurrent Rendering) و هوک useTransition چگونه تجربه کاربری را بهبود می‌دهند؟",
    answerContent: `### Concurrent Rendering & \`useTransition\`

In classic React, rendering is synchronous and blocking. If a large state update causes a slow render, the browser freezes and user input (typing, clicking) lags.

#### \`useTransition\` Hook
Allows marking state updates as **non-urgent transitions**, keeping user interaction urgent and responsive.

\`\`\`tsx
const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
  // Urgent: updates the input box immediately
  setInputValue(query);

  // Non-urgent: can be interrupted by new keystrokes
  startTransition(() => {
    setFilteredResults(expensiveFilter(query));
  });
}
\`\`\`

- If the user types a new character before the transition completes, React interrupts and discards the stale work to render the latest input immediately.`,
    answerContent_fa: `### رندرینگ همروند و هوک \`useTransition\`

در نسخه‌های سنتی ری‌اکت، رندرینگ به صورت همگام و بلاک‌کننده انجام می‌شد. اگر رندر یک لیست طولانی طول می‌کشید، مرورگر فریز شده و تایپ کاربر با لگ همراه بود.

#### هوک \`useTransition\`
امکان اولویت‌بندی به‌روزرسانی‌های State را فراهم می‌کند تا موارد کم‌اهمیت (غیرفوری) باعث قفل شدن رابط کاربری نشوند:

\`\`\`tsx
const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
  // فوری: اینپوت بلافاصله تایپ کاربر را نشان می‌دهد
  setInputValue(query);

  // غیرفوری: در صورت تایپ حرف بعدی، متوقف و مجدداً اجرا می‌شود
  startTransition(() => {
    setFilteredResults(expensiveFilter(query));
  });
}
\`\`\`

- در صورتی که کاربر قبل از اتمام رندر، حرف جدیدی تایپ کند، ری‌اکت رندر قبلی را دور ریخته و فوراً پاسخگوی ورودی جدید خواهد بود.`,
  },
];
