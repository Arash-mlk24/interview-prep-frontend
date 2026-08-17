import { RoadmapTopic } from "../../../models";

export const distributedLocksIdempotencyTopic: RoadmapTopic = {
  id: "topic-dotnet-distributed-locks-idempotency",
  stepId: "step-distributed-transactions",
  slug: "distributed-locks-idempotency-keys",
  order: 3,
  title: "Distributed Locks (Redis Redlock) & Idempotency Keys",
  title_fa: "قفل‌های توزیع‌شده (الگوی Redlock در Redis) و کلیدهای Idempotency در فین‌تک",
  summary: "Prevent double-charge race conditions across clustered APIs with Redis Redlock, sliding leases, and idempotent request deduplication.",
  summary_fa: "جلوگیری از خطاهای پرداخت تکراری و Race Condition در کلاسترهای API با قفل‌های توزیع‌شده Redis Redlock و کلیدهای Idempotency.",
  readingTimeMinutes: 19,
  difficulty: "lead",
  content: `### 1. The Double-Charge & Concurrency Problem in FinTech

When users double-click a "Pay Now" button or network retries resend payment requests, concurrent API instances can process simultaneous withdrawal requests, causing financial discrepancies.

---

### 2. Idempotency Keys Architecture

1. Client sends a unique \`Idempotency-Key: <UUID>\` in the HTTP header.
2. The API Gateway / Middleware checks Redis: \`SET idempotency:uuid "PROCESSING" NX EX 120\`.
   - If key already exists $\to$ Return cached HTTP response or 409 Conflict.
   - If key is new $\to$ Proceed with payment transaction.
3. Database enforces a **Unique Constraint** on the \`IdempotencyKey\` column as a secondary ACID barrier.

---

### 3. Distributed Locking with Redis Redlock

\`\`\`csharp
// Using Medallion.Threading / RedLock.net:
await using (var handle = await distributedLockProvider.AcquireLockAsync($"lock:account:{accountId}", TimeSpan.FromSeconds(5))) {
    if (handle != null) {
        // Critical Section: Only ONE server in the entire cluster can execute this!
        await ProcessFinancialTransactionAsync(accountId, amount);
    }
}
\`\`\``,
  content_fa: `### ۱. مشکل تراکنش تکراری و Race Condition

در برنامه‌های فین‌تک برای جلوگیری از برداشت یا پرداخت تکراری در اثر دابل کلیک یا Retryهای شبکه، از دو لایه محافظتی استفاده می‌شود:
۱. **هدر Idempotency-Key:** شناسایی و رد کردن درخواست‌های تکراری با بررسی وضعیت کلید در Redis.
۲. **قفل توزیع‌شده (Distributed Lock):** با الگوی Redlock در Redis اطمینان حاصل می‌شود که فقط یک سرور در کل کلاستر در هر لحظه اجازه دسترسی به منابع حساب را دارد.`,
};
