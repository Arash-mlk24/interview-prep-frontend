import { RoadmapTopic } from "../../../models";

export const dbConcurrencyLocksTopic: RoadmapTopic = {
  id: "topic-dotnet-db-concurrency-locks",
  stepId: "step-db-efcore-concurrency",
  slug: "optimistic-pessimistic-deadlocks",
  order: 3,
  title: "Optimistic vs Pessimistic Locking & Deadlock Elimination",
  title_fa: "کنترل همزمانی خوش‌بینانه و بدبینانه و راهکارهای قطعی حذف Deadlock",
  summary: "Implement RowVersion concurrency tokens in EF Core, analyze XML Deadlock Graphs, and enforce deterministic lock ordering.",
  summary_fa: "پیاده‌سازی توکن‌های همزمانی RowVersion در EF Core، تحلیل فایل‌های XML Deadlock Graph و اعمال ترتیب قطعی در قفل‌گذاری جداول.",
  readingTimeMinutes: 17,
  difficulty: "senior",
  content: `### 1. Optimistic Concurrency Control in EF Core

Optimistic concurrency assumes collisions are rare and does not acquire locks during reads.

\`\`\`csharp
public class Product {
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public int Stock { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = default!;
}

// Handling Concurrency Conflicts:
try {
    product.Stock -= 1;
    await dbContext.SaveChangesAsync();
} catch (DbUpdateConcurrencyException ex) {
    // Reload latest database values and re-evaluate business logic
    var entry = ex.Entries.Single();
    await entry.ReloadAsync();
}
\`\`\`

---

### 2. Pessimistic Concurrency Locking

Acquires explicit database locks immediately upon reading to block concurrent modifiers:
\`\`\`csharp
var product = await dbContext.Products
    .FromSqlInterpolated($"SELECT * FROM Products WITH (UPDLOCK, ROWLOCK) WHERE Id = {id}")
    .SingleOrDefaultAsync();
\`\`\`

---

### 3. Deadlock Root Causes & Elimination Strategies

A deadlock occurs when two transactions form a cyclic dependency waiting on resources locked by each other:

\`\`\`
Tx 1: Locks Table A -> Requests Lock on Table B
Tx 2: Locks Table B -> Requests Lock on Table A
Result: Deadlock! Engine terminates transaction with lower rollback cost (Victim).
\`\`\`

#### Deadlock Elimination Rules:
1. **Deterministic Lock Ordering:** Always access and modify tables in the exact same sequence across the entire application codebase.
2. **Keep Transactions Short:** Never perform HTTP calls, email sending, or heavy processing inside a database transaction block.
3. **Enable RCSI:** Read Committed Snapshot Isolation eliminates read-write lock blocking.`,
  content_fa: `### ۱. همزمانی خوش‌بینانه با RowVersion

با تعریف فیلد \`[Timestamp] byte[] RowVersion\` در EF Core، بدون قفل کردن سطر، در صورت ویرایش همزمان داده توسط کاربری دیگر خطای **\`DbUpdateConcurrencyException\`** صادر شده و امکان بازخوانی و اعمال مجدد فراهم می‌شود.

---

### ۲. همزمانی بدبینانه (Pessimistic)

برای سناریوهای حساس فین‌تک با دستوراتی مانند \`UPDLOCK\` سطرها به محض خواندن قفل می‌شوند تا هیچ درخواست دیگری تا پایان تراکنش دسترسی نداشته باشد.

---

### ۳. پیشگیری از Deadlock

- **ترتیب یکنواخت دسترسی:** همیشه جداول با یک ترتیب مشخص (مثلاً همیشه اول جدول سفارش و سپس پرداخت) تغییر یابند.
- **کوتاه بودن تراکنش:** هرگز فراخوانی‌های کند وب‌سرویس را درون بلاک تراکنش دیتابیس قرار ندهید.`,
};
