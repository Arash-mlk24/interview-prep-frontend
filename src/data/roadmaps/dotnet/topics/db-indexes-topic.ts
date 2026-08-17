import { RoadmapTopic } from "../../../models";

export const dbIndexesTopic: RoadmapTopic = {
  id: "topic-dotnet-db-indexes",
  stepId: "step-db-efcore-concurrency",
  slug: "database-indexing-b-trees",
  order: 2,
  title: "Database Indexing Architecture (B+ Trees, Covering Indexes & Fragmentation)",
  title_fa: "معماری ایندکس‌های پایگاه داده (درخت B+ Tree، ایندکس پوششی و چندپارگی)",
  summary: "Master internal index structures, Clustered vs Non-Clustered indexes, eliminating Key Lookups with INCLUDE, and Page Split mitigation.",
  summary_fa: "تسلط بر ساختار داخلی ایندکس‌ها، تفاوت ایندکس خوشه‌ای و غیرخوشه‌ای، حذف کامل Key Lookup با فیلدهای INCLUDE و مدیریت Page Split.",
  readingTimeMinutes: 18,
  difficulty: "senior",
  content: `### 1. B+ Tree Internal Architecture

Relational database engines (SQL Server, PostgreSQL, MySQL InnoDB) store index data in **Balanced Trees (B+ Trees)** composed of 8KB memory/disk pages.

\`\`\`
                     [ Root Page ]
                     /           \\
           [ Intermediate ]    [ Intermediate ]
             /          \\        /          \\
      [ Leaf Page 1 ] <----------> [ Leaf Page 2 ] (Doubly-Linked)
\`\`\`

#### Key Architectural Components:
1. **Root & Intermediate Pages:** Contain search keys and child page pointers for rapid $O(\\log N)$ navigation.
2. **Leaf Pages:** Doubly-linked pages allowing sequential range scans.
3. **Clustered Index:** The leaf pages ARE the physical data rows of the table. A table can have only **1** clustered index.
4. **Non-Clustered Index:** Leaf pages store indexed columns + a **Row Locator** (Clustered Key or Heap RID).

---

### 2. Key Lookups & The Power of Covering Indexes

When a query filters on a non-clustered index but selects additional unindexed columns:
\`\`\`sql
SELECT FullName, Email FROM Users WHERE NationalCode = '0012345678';
\`\`\`
The engine uses the index to find the record, but must perform an expensive **Key/Bookmark Lookup** jump to the clustered table page for every row ($O(N)$ random I/O).

#### The Solution: Covering Index via \`INCLUDE\`
\`\`\`sql
CREATE NONCLUSTERED INDEX IX_Users_NationalCode 
ON Users (NationalCode) 
INCLUDE (FullName, Email);
\`\`\`
- Puts \`FullName\` and \`Email\` directly in the non-clustered leaf pages without inflating intermediate node sizes.
- **Completely eliminates Key Lookups**, turning query execution into a lightning-fast single index seek!`,
  content_fa: `### ۱. معماری داخلی ایندکس‌های B+ Tree

- **سطح ریشه و میانی:** شامل کلیدهای جستجو و آدرس صفحات فرزند جهت پیمایش سریع $O(\\log N)$.
- **سطح برگ (Leaf):** صفحات حاوی داده‌های نهایی متصل به صورت لیست پیوندی دوطرفه.
- **ایندکس خوشه‌ای (Clustered):** خود رکوردهای جدول در سطح برگ ذخیره می‌شوند.
- **ایندکس غیرخوشه‌ای (Non-Clustered):** سطح برگ شامل کلید ایندکس و اشاره‌گر به کلید اصلی است.

---

### ۲. حذف هزینه Key Lookup با Covering Index

اگر کوئری ستون‌هایی را بخواند که در ایندکس نیستند، دیتابیس به ازای هر سطر یک پرش اضافه (Key Lookup) به جدول اصلی انجام می‌دهد.
با تعریف ایندکس پوششی همراه با **\`INCLUDE (Col1, Col2)\`**، تمام داده‌های مورد نیاز کوئری از همان برگ ایندکس تامین شده و این پرش پرهزینه به صفر می‌رسد.`,
};
