import { RoadmapTopic } from "../../../models";

export const acidIsolationTopic: RoadmapTopic = {
  id: "topic-dotnet-acid-isolation",
  stepId: "step-db-efcore-concurrency",
  slug: "acid-isolation-levels-concurrency",
  order: 1,
  title: "ACID Isolation Levels, Concurrency Anomalies & Write Skew",
  title_fa: "سطوح ایزولاسیون تراکنش‌های ACID، ناهنجاری‌های همزمانی و پدیده Write Skew",
  summary: "Deep dive into SQL isolation levels, Dirty Reads, Non-Repeatable Reads, Phantom Reads, MVCC Snapshot Isolation, and Write Skew mitigation.",
  summary_fa: "تحلیل عمیق سطوح ایزولاسیون دیتابیس، خطاهای Dirty Read، Phantom Read، مکانیزم Snapshot Isolation و راهکارهای مهار Write Skew.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. The ANSI SQL Isolation Levels & Concurrency Anomalies

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Write Skew |
| :--- | :---: | :---: | :---: | :---: |
| **Read Uncommitted** | ❌ Allowed | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Read Committed** (Default) | ✅ Prevented | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Repeatable Read** | ✅ Prevented | ✅ Prevented | ❌ Allowed | ❌ Allowed |
| **Snapshot Isolation (MVCC)**| ✅ Prevented | ✅ Prevented | ✅ Prevented | ❌ Allowed |
| **Serializable** | ✅ Prevented | ✅ Prevented | ✅ Prevented | ✅ Prevented |

---

### 2. Detailed Concurrency Anomalies

1. **Dirty Read:** Reading uncommitted mutations from another concurrent transaction that later rolls back.
2. **Non-Repeatable Read:** Re-reading the same row within a transaction and observing that another transaction modified and committed new values.
3. **Phantom Read:** Re-executing a range query (\`WHERE Status = 'Active'\`) and discovering that another transaction inserted or deleted matching rows.
4. **Write Skew:** Occurs under MVCC Snapshot Isolation when concurrent transactions read disjoint data sets, satisfy business constraints based on their snapshot, but commit updates that together violate a global invariant (e.g. two doctors simultaneously resign on-call shifts because each sees two active doctors in their snapshot).

---

### 3. Preventing Write Skew in EF Core

\`\`\`csharp
// Solution 1: Explicit Serializable Transaction
using var transaction = await dbContext.Database.BeginTransactionAsync(IsolationLevel.Serializable);

// Solution 2: Pessimistic Row Locking with UPDLOCK
var doctors = await dbContext.Doctors
    .FromSqlInterpolated($"SELECT * FROM Doctors WITH (UPDLOCK, HOLDLOCK) WHERE IsOnCall = 1")
    .ToListAsync();

if (doctors.Count >= 2) {
    currentDoctor.IsOnCall = false;
    await dbContext.SaveChangesAsync();
    await transaction.CommitAsync();
}
\`\`\``,
  content_fa: `### ۱. سطوح ایزولاسیون تراکنش‌ها و ماتریس ناهنجاری‌ها

- **Read Uncommitted:** آسیب‌پذیر در برابر تمام ناهنجاری‌ها.
- **Read Committed:** جلوگیری از Dirty Read؛ مناسب اکثر سناریوهای عمومی وب.
- **Repeatable Read:** جلوگیری از تغییر مقادیر سطرهای خوانده‌شده تا پایان تراکنش.
- **Snapshot Isolation (MVCC):** جلوگیری از Dirty Read، Non-Repeatable Read و Phantom Read با استفاده از نگهداری نسخه‌های رکورد در \`tempdb\`.
- **Serializable:** بالاترین سطح امنیت و ایزولاسیون کامل با قفل‌های بازه‌ای (Range Locks).

---

### ۲. پدیده Write Skew چیست و چگونه مهار می‌شود؟

در سطح Snapshot Isolation، خوانندگان نویسندگان را بلاک نمی‌کنند. بنابراین اگر دو پزشک آنکال همزمان درخواست مرخصی دهند، هر دو در اسنپ‌شات خود حضور پزشک دیگر را معتبر می‌بینند و هر دو مرخص می‌شوند که قانون بیزینس (حداقل یک پزشک آنکال) نقض می‌گردد.
**راهکار:** ارتقای سطح تراکنش به **Serializable** یا استفاده از قفل صریح **\`UPDLOCK\`** هنگام خواندن.`,
};
