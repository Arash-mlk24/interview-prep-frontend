import { RoadmapTopic } from "../../../models";

export const fiberReconciliationTopic: RoadmapTopic = {
  id: "topic-react-fiber-reconciliation",
  stepId: "step-react-core-fiber",
  slug: "fiber-reconciliation-diffing",
  order: 1,
  title: "React Fiber Architecture & Reconciliation Internals",
  title_fa: "معماری React Fiber و مکانیزم داخلی فرآیند تطبیق (Reconciliation)",
  summary: "Understand the Fiber node tree structure, two-phase rendering (Render/Commit), double-buffering (current vs workInProgress), and heuristic diffing algorithms.",
  summary_fa: "درک ساختار درختی نودهای Fiber، تفکیک فازهای Render و Commit، الگوی Double-Buffering (درخت current در برابر workInProgress) و الگوریتم‌های ابتکاری Diffing.",
  readingTimeMinutes: 16,
  difficulty: "senior",
  content: `### 1. The Need for React Fiber (Stack vs. Fiber Reconciler)

In React 15 (Stack Reconciler), reconciliation was synchronous and recursive. Re-rendering large component trees blocked the browser main thread, causing frame drops and unresponsiveness (UI jank).

**React 16+ Fiber Architecture** restructured the call stack into an in-memory linked list of **Fiber Units of Work** that can be paused, prioritized, and resumed.

\`\`\`
Fiber Linked-List Structure:
[ Fiber Node: App ]
     | child
[ Fiber Node: Header ] ---> [ Fiber Node: Main ] (sibling)
     ^                          |
     +-- return (parent) -------+
\`\`\`

---

### 2. Double-Buffering Architecture (\`current\` vs. \`workInProgress\`)

Similar to high-performance graphic rendering pipelines, React Fiber maintains two trees:
1. **\`current\` Tree:** Represents the nodes currently rendered on the screen.
2. **\`workInProgress\` (WIP) Tree:** Created asynchronously in memory during the Render phase.

When computation completes in the Render phase, React performs a single atomic pointer swap (\`root.current = workInProgress\`) during the synchronous **Commit Phase**.

---

### 3. The Two Phases of Fiber Execution

- **Phase 1: Render / Reconciliation (Interruptible & Asynchronous):**
  - Traverses the Fiber tree using \`performUnitOfWork()\`.
  - Computes state updates, resolves hooks, and tags Fibers with mutation flags (\`Placement\`, \`Update\`, \`Deletion\`).
  - Can be aborted or paused if higher-priority user events (keystrokes, clicks) arrive.
- **Phase 2: Commit (Synchronous & Non-Interruptible):**
  - Executes in three sub-phases: \`BeforeMutation\`, \`Mutation\` (DOM manipulation), and \`Layout\` (\`useLayoutEffect\`).
  - Swaps pointers and fires \`useEffect\` callbacks asynchronously on the next frame.`,
  content_fa: `### ۱. چرایی معماری React Fiber

در نسخه‌های قبل از ۱۶ ری‌اکت (Stack Reconciler)، رندر کامپوننت‌ها به صورت بازگشتی و همگام انجام می‌شد که باعث مسدود شدن نخ اصلی مرورگر (Main Thread) و افت فریم می‌شد.
معماری **Fiber** فرآیند رندر را به یک لیست پیوندی از واحدهای کاری ریز تبدیل کرد که قابلیت **توقف، اولویت‌بندی و از سرگیری** دارند.

---

### ۲. الگوی Double-Buffering در ری‌اکت

ری‌اکت همیشه دو درخت فایبر را در حافظه نگهداری می‌کند:
۱. **درخت \`current\`:** وضعیت فعلی که کاربر روی مانیتور مشاهده می‌کند.
۲. **درخت \`workInProgress\`:** درختی که در پشت صحنه (فاز Render) محاسبه می‌شود و پس از تکمیل، اشاره‌گر ریشه در یک مرحله اتمیک سوئیچ می‌شود.

---

### ۳. دو فاز اصلی اجرای Fiber

- **فاز Render (غیرمسدودکننده و قابل لغو):** محاسبه تغییرات و تگ‌گذاری فایبرها جهت اعمال در DOM.
- **فاز Commit (سریع و اتمیک):** اعمال قطعی تغییرات روی DOM مرورگر و اجرای هوک‌های چرخه حیات.`,
};
