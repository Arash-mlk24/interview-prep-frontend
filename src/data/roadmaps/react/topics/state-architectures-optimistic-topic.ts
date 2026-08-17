import { RoadmapTopic } from "../../../models";

export const stateArchitecturesOptimisticTopic: RoadmapTopic = {
  id: "topic-react-state-architectures",
  stepId: "step-react-state-realtime",
  slug: "modern-state-architectures-optimistic-ui",
  order: 1,
  title: "Modern State Architectures: Atomic (Jotai) vs. Proxy (Zustand) & Optimistic UI (useOptimistic)",
  title_fa: "معماری‌های مدرن مدیریت وضعیت: مقایسه Atomic (Jotai) با Proxy (Zustand) و رابط کاربری آپتیمیستیک",
  summary: "Master state update granularity, selector-based memoization, tearing prevention with useSyncExternalStore, and instant feedback with React 19 useOptimistic.",
  summary_fa: "تسلط بر ریزدانگی به‌روزرسانی استیت، هوک useSyncExternalStore برای جلوگیری از Tearing، و به‌روزرسانی آنی رابط کاربری با هوک useOptimistic در ری‌اکت ۱۹.",
  readingTimeMinutes: 18,
  difficulty: "senior",
  content: `### 1. State Paradigms in Modern React

| Paradigm | Exemplar Libraries | Mechanics | Re-render Granularity |
| :--- | :--- | :--- | :--- |
| **Context API** | Native React | Top-down tree propagation | Coarse-grained; all consumers re-render unless memoized |
| **Proxy / External Store** | Zustand, Valtio | Mutable proxy tracking or external subscriptions with \`useSyncExternalStore\` | Fine-grained selector subscriptions (\`useStore(s => s.count)\`) |
| **Atomic State** | Jotai, Recoil | Bottom-up independent state atoms | Ultra fine-grained; only components reading the specific atom re-render |

---

### 2. Optimistic UI Mutations with React 19 \`useOptimistic\`

\`\`\`tsx
// Instant optimistic feedback pattern
function MessageThread({ initialMessages, sendMessageAction }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newText: string) => [
      ...state,
      { id: "temp-" + Date.now(), text: newText, sending: true }
    ]
  );

  async function handleSend(formData: FormData) {
    const text = formData.get("message") as string;
    addOptimisticMessage(text); // Updates UI immediately with zero delay
    const savedMessage = await sendMessageAction(text);
    setMessages(prev => [...prev, savedMessage]);
  }

  return (
    <form action={handleSend}>
      {optimisticMessages.map(m => (
        <div key={m.id} style={{ opacity: m.sending ? 0.6 : 1 }}>
          {m.text}
        </div>
      ))}
    </form>
  );
}
\`\`\``,
  content_fa: `### ۱. پارادایم‌های مدرن مدیریت وضعیت در ری‌اکت

- **Context API بومی:** تغییر در Context موجب ری‌رندر شدن تمام کامپوننت‌های مصرف‌کننده می‌شود.
- **Zustand (Proxy Store):** با استفاده از هوک \`useSyncExternalStore\` تنها زمانی کامپوننت را ری‌رندر می‌کند که مقدار برگشتی سلکتور تغییر کرده باشد.
- **Jotai (Atomic):** استیت به اتم‌های مستقل تفکیک شده و حداقل ری‌رندر را در کل درخت به همراه دارد.

---

### ۲. رابط کاربری آپتیمیستیک با هوک \`useOptimistic\` در ری‌اکت ۱۹

با استفاده از این هوک، پیام بلافاصله در صفحه کاربر نمایش داده می‌شود و در پس‌زمینه درخواست سرور اجرا می‌گردد. در صورت بروز خطا، وضعیت به صورت خودکار به حالت قبل برمی‌گردد.`,
};
