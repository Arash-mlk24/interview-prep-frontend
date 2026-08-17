import { Question } from "../../models";

export const dotnetSeniorQuestions: Question[] = [
  // ── System Architecture & Advanced Microservices (Q201 - Q212) ──
  {
    id: "dotnet-senior-q201",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How would you design a high-throughput Insurance Comparison and Aggregation platform (like Azki)?",
    questionTitle_fa: "معماری کلی سیستم مقایسه و خرید آنلاین بیمه برای ترافیک بالا چگونه است؟",
    answerContent: `### High-Throughput Insurance Aggregator Architecture

1. **API Gateway (YARP / Envoy):** SSL termination, rate limiting, and JWT authentication at the perimeter.
2. **Comparison & Quote Engine:**
   - Asynchronous fan-out architecture querying multiple insurance company providers via **Channels / MassTransit**.
   - Aggregates results in a Redis cache with short TTL ($2-5$ minutes) to prevent overloading slow third-party insurer APIs.
3. **Checkout & Payment Bounded Context:**
   - Implements **Idempotency Keys** and **Saga Pattern** for payment verification, policy issuance, and financial ledger accounting.
4. **Resiliency:**
   - **Anti-Corruption Layers (ACL)** isolating unstable third-party legacy SOAP/REST insurance APIs.
   - **Circuit Breakers** and Fallback policies to ensure quote generation never blocks completely.`,
    answerContent_fa: `### معماری سیستم مقایسه و خرید آنلاین بیمه

۱. **API Gateway:** احراز هویت، مدیریت نرخ درخواست‌ها و لودبالانسینگ در لبه شبکه.
۲. **موتور استعلام و مقایسه قیمت:** استفاده از الگوی Fan-out و فراخوانی موازی وب‌سرویس‌های بیمه‌گران با کتابخانه Channels، به همراه کش هوشمند در Redis برای جلوگیری از فشار به وب‌سرویس‌های کند خارجی.
۳. **کانتکست پرداخت و صدور:** استفاده از توکن‌های Idempotency و الگوی Saga برای هماهنگی بین درگاه بانکی، بیمه‌گر و سیستم تسویه‌حساب.
۴. **لایه‌های ضدفساد (ACL) و Circuit Breaker** برای عایق‌سازی سیستم از خطاهای احتمالی وب‌سرویس‌های قدیمی شرکت‌های بیمه.`,
  },
  {
    id: "dotnet-senior-q202",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you migrate from a Monolith to Microservices using the Strangler Fig Pattern?",
    questionTitle_fa: "استراتژی‌های مهاجرت از سیستم‌های Monolith به Microservices (الگوی Strangler Fig) چیست؟",
    answerContent: `### The Strangler Fig Migration Pattern

Instead of a high-risk "Big Bang" rewrite, incrementally replace specific monolithic features with microservices:

1. **Put an API Gateway / Reverse Proxy** in front of the existing Monolith.
2. **Identify a Vertical Slice:** Select a decoupled domain (e.g. Notifications or Pricing).
3. **Build the Microservice:** Develop and test the new microservice independently.
4. **Reroute Traffic:** Update the API Gateway to route requests for that specific domain to the new microservice while sending other traffic to the Monolith.
5. **Repeat** until the Monolith is completely decommissioned.`,
    answerContent_fa: `### الگوی مهاجرت Strangler Fig

به جای بازنویسی پرخطر کل سیستم به یک‌باره، یک API Gateway جلوی سامانه Monolith قرار می‌گیرد. سپس بخش‌های مستقل بیزینس (مانند سرویس نوتیفیکیشن یا محاسبه قیمت) تک‌به‌تک به شکل میکروسرویس توسعه داده شده و مسیر ترافیک آنها در Gateway تغییر می‌یابد تا به مرور زمان سامانه قدیمی بدون قطعی کنار گذاشته شود.`,
  },
  {
    id: "dotnet-senior-q203",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "What are the biggest Data Consistency challenges in microservices and how are they addressed?",
    questionTitle_fa: "بزرگترین چالش‌های Data Consistency در معماری میکروسرویس چیست؟",
    answerContent: `### Data Consistency in Microservices

- **Challenge:** In a "Database-per-Service" architecture, traditional ACID database transactions cannot span across network boundaries.
- **Solution:** Embraze **Eventual Consistency** using:
  - **Saga Pattern** for multi-step distributed transactions.
  - **Transactional Outbox Pattern** to ensure domain events are published reliably.
  - **Idempotent Consumers** to safely handle duplicate message deliveries.`,
    answerContent_fa: `### چالش‌های یکپارچگی داده در میکروسرویس‌ها

به دلیل جداسازی دیتابیس هر سرویس، تراکنش‌های سراسری ACID وجود ندارند. راه حل پذیرش اصل **سازگاری نهایی (Eventual Consistency)** با استفاده از الگوی Saga، الگوی Transactional Outbox و مصرف‌کننده‌های Idempotent است.`,
  },
  {
    id: "dotnet-senior-q204",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "Explain the Saga Pattern: Choreography vs. Orchestration.",
    questionTitle_fa: "الگوی Saga را توضیح دهید؛ تفاوت Choreography و Orchestration در ساگا چیست؟",
    answerContent: `### Saga Pattern: Choreography vs. Orchestration

A Saga is a sequence of local transactions updating individual databases and publishing events.

- **Choreography (Decentralized):**
  - Services listen to domain events and execute their local transactions independently without a central coordinator.
  - Best for simple workflows (2-4 steps).
- **Orchestration (Centralized):**
  - A central **Saga Orchestrator** (e.g. MassTransit State Machine) explicitly commands each participant what step to execute.
  - Easier to monitor, manage complex compensations, and reason about state.`,
    answerContent_fa: `### مقایسه Choreography و Orchestration در الگوی Saga

- **Choreography:** هر سرویس پس از اتمام کار، رویدادی منتشر می‌کند و سرویس‌های دیگر بدون نیاز به مدیر مرکزی واکنش نشان می‌دهند (مناسب فرآیندهای ساده).
- **Orchestration:** یک هماهنگ‌کننده مرکزی (State Machine) مستقیماً دستور اجرای هر مرحله و تراکنش‌های جبران‌کننده (Compensations) را صادر می‌کند (مناسب فرآیندهای پیچیده مالی).`,
  },
  {
    id: "dotnet-senior-q205",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "What is the Transactional Outbox Pattern and how does it prevent message loss?",
    questionTitle_fa: "الگوی Outbox Pattern چیست و چگونه مشکل از دست رفتن پیام‌ها را در RabbitMQ حل می‌کند?",
    answerContent: `### Transactional Outbox Pattern

#### Problem:
Saving to a database and publishing a message to RabbitMQ are two separate operations. If the message broker is down right after the DB commit, the event is permanently lost (**Dual-Write Problem**).

#### Solution:
1. Save the entity change AND an Outbox Message record into the **same local database transaction**.
2. A background worker (or CDC / Debezium) polls the \`Outbox\` table and publishes events to RabbitMQ with guaranteed at-least-once delivery.`,
    answerContent_fa: `### الگوی Transactional Outbox

برای حل مشکل Dual-Write (ثبت در دیتابیس اما عدم موفقیت در ارسال به RabbitMQ)، پیام رویداد در همان تراکنش محلی دیتابیس درون جدول \`Outbox\` ذخیره می‌شود. سپس یک پروسس پس‌زمینه پیام‌های ثبت‌شده در جدول Outbox را به صف ارسال کرده و وضعیت را آپدیت می‌کند تا هیچ پیامی از دست نرود.`,
  },
  {
    id: "dotnet-senior-q206",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "What is Event Sourcing and when should you avoid it?",
    questionTitle_fa: "الگوی Event Sourcing چیست و چه زمانی نباید از آن استفاده کرد؟",
    answerContent: `### Event Sourcing

Instead of storing current state, Event Sourcing stores the full **sequence of append-only domain events** that occurred over time. Current state is reconstructed by replaying all historical events.

#### When to Use:
- Auditing and compliance (FinTech ledgers, trading, insurance claim lifecycle).
#### When to Avoid:
- Standard CRUD applications.
- Systems requiring frequent complex ad-hoc relational queries without CQRS read models.`,
    answerContent_fa: `### الگوی Event Sourcing و زمان عدم استفاده

به جای ذخیره وضعیت فعلی، کلیه رخدادهای تغییر وضعیت به صورت فقط-افزودنی (Append-only) ذخیره شده و وضعیت فعلی با بازخوانی رویدادها بازسازی می‌شود. در سیستم‌های ساده CRUD و برنامه‌هایی که نیاز به تاریخچه دقیق تغییرات ندارند به دلیل پیچیدگی بالا نباید استفاده شود.`,
  },
  {
    id: "dotnet-senior-q207",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you implement Snapshotting in Event Sourcing?",
    questionTitle_fa: "نحوه پیاده‌سازی Snapshotting در Event Sourcing برای جلوگیری از طولانی شدن بازخوانی رویدادها؟",
    answerContent: `### Snapshotting in Event Sourcing

As aggregates accumulate thousands of events, replaying the full history becomes slow.

**Snapshotting:** Periodically (e.g. every $100$ events or nightly), serialize the aggregate's current state into a snapshot store. When loading the aggregate, restore state from the latest snapshot and only replay subsequent events.`,
    answerContent_fa: `### تکنیک Snapshotting در Event Sourcing

با گذشت زمان و افزایش رویدادها به هزاران عدد، بازخوانی کند می‌شود. با گرفتن دوره‌ای اسنپ‌شات از وضعیت نهایی موجودیت (مثلاً هر ۱۰۰ رویداد یک‌بار)، بارگذاری از روی آخرین اسنپ‌شات شروع شده و صرفاً رویدادهای بعد از آن بازخوانی می‌شوند.`,
  },
  {
    id: "dotnet-senior-q208",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you handle Event Schema Versioning in Event-Driven Systems?",
    questionTitle_fa: "چالش‌های مربوط به Event Versioning در سیستم‌های Event-Driven را چگونه حل می‌کنید؟",
    answerContent: `### Event Schema Evolution & Versioning

1. **Non-breaking Additions:** Add new optional fields with default fallback values.
2. **Upcasters (In-Flight Migration):** Transform old event payloads (e.g. \`OrderCreatedV1\`) to the current schema (\`OrderCreatedV2\`) on read before passing to the domain aggregate.
3. **Explicit Version Namespaces:** \`OrderCreatedV2\` published alongside \`OrderCreatedV1\` during transition phases.`,
    answerContent_fa: `### مدیریت تکامل و تغییر نسخه رویدادها (Event Versioning)

استفاده از فیلدهای اختیاری جدید، پیاده‌سازی **Upcaster**ها برای تبدیل خودکار رویدادهای قدیمی (V1) به ساختار جدید (V2) در زمان خواندن از دیتابیس، و پشتیبانی موازی از هر دو نسخه در زمان دیپلوی.`,
  },
  {
    id: "dotnet-senior-q209",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "How do you manage distributed transactions without Two-Phase Commit (2PC)?",
    questionTitle_fa: "چگونه Distributed Transactions را بدون استفاده از Two-Phase Commit مدیریت می‌کنید؟",
    answerContent: `### Managing Distributed Transactions without 2PC

1. **Saga Pattern:** Sequence of local transactions with automated compensating transactions.
2. **Idempotent Handlers:** Guarantee safe at-least-once message processing.
3. **Reconciliation Cron Jobs:** Periodic background reconciliation workers that detect orphaned transactions and issue automated rollbacks or alerting.`,
    answerContent_fa: `### جایگزین‌های 2PC در تراکنش‌های توزیع‌شده

استفاده از الگوی **Saga با تراکنش‌های جبران‌کننده**، پیاده‌سازی متدهای پردازش **Idempotent** در سمت مصرف‌کننده و ایجاد جاب‌های دوره‌ای مغایرت‌گیری (Reconciliation) جهت رسیدگی به رکوردهای معلق.`,
  },
  {
    id: "dotnet-senior-q210",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you manage Eventual Consistency user experience in the UI with large-scale CQRS?",
    questionTitle_fa: "در معماری CQRS در مقیاس بزرگ، مشکل Eventual Consistency را با کاربر نهایی چگونه مدیریت می‌کنید؟",
    answerContent: `### Eventual Consistency UX Strategies

1. **Optimistic UI Updates:** Update the client UI immediately assuming the command succeeds.
2. **Server-Sent Events / SignalR:** Push a notification to the client as soon as the read projection updates.
3. **Polling / Correlated Query:** The client polls \`/api/orders/{id}?minVersion=2\` until the read model catches up.`,
    answerContent_fa: `### مدیریت تجربه کاربری در سازگاری نهایی (Eventual Consistency)

- **Optimistic UI:** نمایش پیش‌فرض ثبت موفق در فرانت‌اند.
- **ارسال نوتیفیکیشن با SignalR/WebSockets:** اعلام لحظه‌ای آپدیت شدن دیتامدل به مرورگر کاربر.
- **Polling با نسخه داده:** ارسال شناسه نسخه برای اطمینان از اعمال تغییرات در مدل خواندن.`,
  },
  {
    id: "dotnet-senior-q211",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How do you guarantee API Idempotency for online payments at the database and client layers?",
    questionTitle_fa: "در طراحی API برای پرداخت آنلاین، چگونه Idempotency را در سطح دیتابیس و کلاینت تضمین می‌کنید؟",
    answerContent: `### End-to-End Payment Idempotency

1. **Client Layer:** Generates a unique \`Idempotency-Key\` UUID before dispatching the payment request.
2. **API Gateway / Middleware:** Checks Redis with \`SET key value NX EX 120\` to lock against simultaneous duplicate clicks.
3. **Database Layer:** Store the \`IdempotencyKey\` with a **UNIQUE Constraint** in the \`Payments\` table. Duplicate attempts return the cached original transaction response.`,
    answerContent_fa: `### تضمین Idempotency در درگاه پرداخت آنلاین

ارسال هدر \`Idempotency-Key\` از سمت کلاینت، قفل‌گذاری روی کلید با Redis برای جلوگیری از دابل کلیک، و ایجاد **Unique Index** روی فیلد کلید در جدول دیتابیس پرداخت‌ها تا هیچ تراکنش تکراری ثبت نشود.`,
  },
  {
    id: "dotnet-senior-q212",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How do you prevent Race Conditions when multiple users attempt to purchase the same inventory simultaneously?",
    questionTitle_fa: "برای جلوگیری از Race Conditions هنگام خرید همزمان یک کالا/بیمه خاص توسط دو کاربر، چه استراتژی‌ای پیاده می‌کنید؟",
    answerContent: `### Preventing Concurrency Race Conditions

1. **Distributed Locks (Redis Redlock):** Acquire an in-memory lock on the specific resource ID (\`insurance_policy_id\`) for 3 seconds.
2. **Pessimistic Database Lock:** \`SELECT * FROM Policies WITH (UPDLOCK, ROWLOCK) WHERE Id = @Id\`.
3. **Atomic Decrement Queries:**
   \`\`\`sql
   UPDATE Inventory SET AvailableCount = AvailableCount - 1
   WHERE Id = @Id AND AvailableCount > 0;
   \`\`\`
   Check rows affected ($=1$ success, $=0$ out of stock).`,
    answerContent_fa: `### جلوگیری از Race Condition در خریدهای همزمان

استفاده از قفل توزیع‌شده با **Redis Redlock**، استفاده از قفل ردیفی در دیتابیس (\`UPDLOCK\`) یا اجرای **آپدیت اتمیک شرطی** (\`WHERE Available > 0\`) و بررسی تعداد سطرهای تحت تاثیر (Rows Affected).`,
  },

  // ── Performance, Scalability & Advanced Caching (Q213 - Q223) ────
  {
    id: "dotnet-senior-q213",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "What is the difference between Horizontal and Vertical Scaling in .NET backend systems?",
    questionTitle_fa: "تفاوت Horizontal Scaling و Vertical Scaling چیست؟",
    answerContent: `### Horizontal vs. Vertical Scaling

- **Vertical Scaling (Scale-Up):** Adding more CPU cores, RAM, or faster NVMe disks to a single server. Limited by physical hardware boundaries and expensive.
- **Horizontal Scaling (Scale-Out):** Adding more stateless web server container instances behind a load balancer. **Standard for .NET microservices**. Requires externalizing session state and in-memory caches to Redis.`,
    answerContent_fa: `### مقایسه مقیاس‌پذیری عمودی و افقی

- **Vertical (Scale-Up):** ارتقای سخت‌افزار سرور فعلی (محدود و پرهزینه).
- **Horizontal (Scale-Out):** افزایش تعداد کانتینرهای بدون وضعیت اپلیکیشن پشت Load Balancer که با معماری دات‌نت مدرن و کلاستر کوبرنتیز همخوانی کامل دارد.`,
  },
  {
    id: "dotnet-senior-q214",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "What load balancing strategies do you use for sudden traffic spikes?",
    questionTitle_fa: "استراتژی‌های Load Balancing برای مدیریت ترافیک‌های ناگهانی چیست؟",
    answerContent: `### Traffic Spike Load Balancing Strategies

1. **Layer 4 vs. Layer 7 Load Balancing:** Use L4 (HAProxy/Network Load Balancer) for ultra-low latency TCP routing; L7 (Nginx/Envoy) for intelligent URL/Header routing.
2. **Algorithms:** **Least Outstanding Requests (Least Connections)** and **Weighted Round Robin**.
3. **Queue-Based Decoupling:** Buffer spike surges into RabbitMQ/Kafka queues to prevent database saturation.`,
    answerContent_fa: `### استراتژی‌های لودبالانسینگ در پیک ترافیک

ترکیب لودبالانسرهای L4 و L7 با الگوریتم **Least Connections**، فعال‌سازی Auto-scaling در کوبرنتیز بر اساس متریک‌های ترافیک، و استفاده از صف‌های پیام به عنوان بافر جذب ترافیک ناگهانی.`,
  },
  {
    id: "dotnet-senior-q215",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    questionTitle: "How do you design Database Partitioning and Sharding for massive financial transaction tables?",
    questionTitle_fa: "برای جداول بسیار بزرگ (مثل لاگ تراکنش‌های مالی)، چه استراتژی‌هایی برای Partitioning یا Sharding پیشنهاد می‌دهید؟",
    answerContent: `### Database Partitioning & Sharding

1. **Table Partitioning (Single DB):** Partition large tables by date ranges (e.g. Monthly partitions on \`TransactionDate\`). Enables fast Partition Pruning and instant archiving via Partition Switching.
2. **Database Sharding (Multiple DBs):** Distribute rows across database servers using a consistent Hash of \`TenantId\` or \`CustomerId\`.`,
    answerContent_fa: `### پارتیشن‌بندی و شاردینگ جداول بسیار بزرگ

- **Table Partitioning:** تقسیم فیزیکی جدول در سطح دیسک بر اساس بازه‌های زمانی (مثلاً ماهانه بر اساس \`TransactionDate\`) برای سرعت بخشیدن به کوئری‌ها.
- **Database Sharding:** تقسیم رکوردها روی چند دیتابیس مجزا بر اساس هش فیلدهای کلیدی مانند \`CustomerId\`.`,
  },
  {
    id: "dotnet-senior-q216",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    questionTitle: "Explain Read Replica architecture (Master-Slave) and configuring it in EF Core.",
    questionTitle_fa: "معماری Read Replica در دیتابیس و پیکربندی آن برای تفکیک عملیات خواندن/نوشتن چگونه است؟",
    answerContent: `### Read Replicas with EF Core

- **Primary (Master):** Handles all write operations (\`INSERT\`, \`UPDATE\`, \`DELETE\`).
- **Read Replicas (Slaves):** Replicate data asynchronously and handle all read queries.

#### In EF Core:
Register two \`DbContext\` instances: \`WriteDbContext\` pointing to the Master database, and \`ReadDbContext\` (with \`AsNoTracking()\`) pointing to the load-balanced Read Replicas connection string.`,
    answerContent_fa: `### معماری Read Replica و تفکیک خواندن/نوشتن در EF Core

سرویس‌های Write به سرور Primary متصل شده و تمامی کوئری‌های واکشی و گزارش‌گیری از طریق یک \`ReadDbContext\` مجزا به رپلیکاهای فقط-خواندنی (Read Replicas) هدایت می‌شوند تا بار کوئری‌های سنگین از دیتابیس اصلی برداشته شود.`,
  },
  {
    id: "dotnet-senior-q217",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "How does Redis Clustering work and what challenges exist with distributed keys?",
    questionTitle_fa: "راه‌اندازی Redis Cluster و چالش‌های مدیریت دیتا بین نودهای مختلف ردیس چیست؟",
    answerContent: `### Redis Cluster & Hash Slots

Redis Cluster automatically shards data across multiple nodes using **16,384 Hash Slots**.
- A key's slot is determined by \`CRC16(key) % 16384\`.

#### Multi-Key Operations Challenge:
Commands touching multiple keys (transactions, \`MGET\`, multi-key scripts) fail if the keys reside on different nodes.
**Solution: Hash Tags:** Force keys to the same slot using curly braces: \`{user:100}:profile\` and \`{user:100}:orders\`.`,
    answerContent_fa: `### معماری Redis Cluster و Hash Tags

ردیس کلاستر داده‌ها را روی ۱۶,۳۸۴ اسلات تقسیم می‌کند. در عملیات‌های چندکلیدی، اگر کلیدها روی نودهای متفاوتی قرار گیرند خطا رخ می‌دهد. برای حل آن از **Hash Tagها** (مانند \`{user_100}:cart\`) استفاده می‌شود تا تمام کلیدهای یک کاربر روی یک نود مشخص قرار گیرند.`,
  },
  {
    id: "dotnet-senior-q218",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "What is the Cache-Aside pattern and how do you guarantee database-cache synchronization?",
    questionTitle_fa: "استراتژی Cache Invalidation چیست و چگونه داده تغییریافته را در کش آپدیت می‌کنید؟",
    answerContent: `### Cache-Aside & Invalidation Strategies

1. **Read Path:** Check Redis. If found, return. If missed, load from DB, write to Redis with TTL, return.
2. **Write Path:** Update DB first, then **invalidate (delete) the cache key** rather than updating it.
3. **Change Data Capture (CDC):** Use tools like Debezium or PostgreSQL logical replication to listen to DB WAL logs and invalidate cache keys asynchronously.`,
    answerContent_fa: `### الگوی Cache-Aside و همگام‌سازی کش

در زمان خواندن، ابتدا کش بررسی شده و در صورت نبود، از دیتابیس لود و در کش ذخیره می‌شود. در زمان ویرایش داده، ابتدا دیتابیس آپدیت شده و سپس کلید کش **حذف (Invalidate)** می‌شود. همچنین می‌توان از تغییرات لاگ تراکنش‌های دیتابیس (CDC) برای ابطال دقیق کش استفاده کرد.`,
  },
  {
    id: "dotnet-senior-q219",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-concurrency-channels-memory"],
    questionTitle: "What architectural and coding techniques do you use to reduce GC Memory Allocations in high-traffic .NET services?",
    questionTitle_fa: "برای کاهش پایدار Memory Allocation و سربار Garbage Collector در اپلیکیشن‌های پرترافیک دات‌نت چه تکنیک‌هایی به کار می‌برید؟",
    answerContent: `### High-Performance Memory Optimization in .NET Services

To sustain high throughput ($50,000+$ req/sec) without GC Gen 0/1/2 pause spikes, senior engineers apply a multi-layered allocation minimization strategy:

#### 1. Zero-Allocation String Parsing with \`ReadOnlySpan<char>\`
Standard string operations like \`text.Split()\`, \`text.Substring()\`, and \`text.Trim()\` allocate new heap objects for every fragment.
- **Solution:** Use \`ReadOnlySpan<char>\` with \`MemoryExtensions\` (e.g. \`text.AsSpan().Slice()\`, \`int.Parse(span)\`) which creates zero heap allocations:
\`\`\`csharp
// 0 Heap Allocations parsing "ORDER:104958"
ReadOnlySpan<char> span = rawHeader.AsSpan();
if (span.StartsWith("ORDER:"))
{
    int orderId = int.Parse(span.Slice(6));
}
\`\`\`

#### 2. Reusing Heavy Byte Buffers with \`ArrayPool<T>.Shared\`
Allocating large arrays ($>85\\text{ KB}$) places objects on the **Large Object Heap (LOH)**, leading to fragmentation and full Gen 2 GC sweeps.
- **Solution:** Rent buffers from \`ArrayPool<byte>.Shared\` and return them in a \`finally\` block with \`clearArray: true\` if sensitive data was processed.

#### 3. Optimizing Async Fast Paths with \`ValueTask<T>\`
When a method frequently returns cached data or completes synchronously, returning \`Task<T>\` still allocates a \`Task\` heap object.
- **Solution:** Return \`ValueTask<T>\` which stores the result directly in a stack struct when completing synchronously.

#### 4. Avoiding Boxing and Closure Allocations
- Use \`struct\` based enumerators and static lambda expressions with state overloads (e.g., \`concurrentDictionary.GetOrAdd(key, static (k, arg) => ..., factoryArgument)\`) to prevent compiler-generated closure classes on the heap.

#### 5. Lock-Free Background Offloading with \`System.Threading.Channels\`
- Offload non-critical side effects (audit logs, metrics, notifications) to a bounded \`Channel<T>\` with a \`BackgroundService\` consumer to keep the hot request path ultra-lean.`,
    answerContent_fa: `### استراتژی‌های کاهش سربار Garbage Collector در سیستم‌های پرترافیک دات‌نت

برای مدیریت ترافیک‌های سنگین (بیش از ۵۰,۰۰۰ ریکوئست در ثانیه) بدون مواجهه با مکث‌های (GC Pauses) نسل‌های Gen 1 و Gen 2، از راهکارهای چندلایه زیر استفاده می‌شود:

#### ۱. پارس داده‌ها بدون آلیکیشن با \`ReadOnlySpan<char>\`:
توابع سنتی مانند \`text.Substring\` یا \`text.Split\` برای هر بخش از رشته یک شیء جدید روی Heap می‌سازند. با استفاده از \`ReadOnlySpan<char>\` و متدهای برشی \`.Slice()\`، عملیات با اشاره‌گر مستقیم روی استک و **با صفر بایت تخصیص حافظه** انجام می‌شود.

#### ۲. استفاده از استخر آرایه‌ها (\`ArrayPool<T>.Shared\`):
ساخت آرایه‌های بزرگ بایت (بزرگتر از ۸۵ کیلوبایت) باعث ورود داده به ناحیه **Large Object Heap (LOH)** و فرگمنتیشن حافظه می‌شود. با قرض گرفتن آرایه از \`ArrayPool<byte>.Shared.Rent()\` و پس دادن آن در بلوک \`finally\`، این بافرها بارها بازیافت می‌شوند.

#### ۳. استفاده از \`ValueTask<T>\` در مسیرهای سریع همگام:
در متدهایی که در اکثر مواقع نتیجه را از کش درون حافظه (MemoryCache) برمی‌گردانند، استفاده از \`ValueTask<T>\` به جای \`Task<T>\` مانع از ساخته شدن شیء تسک روی Heap در مسیرهای Fast-Path می‌شود.

#### ۴. جلوگیری از Boxing و Closure در توابع لامبدا:
استفاده از توابع \`static\` در متدهایی مانند \`ConcurrentDictionary.GetOrAdd\` به همراه ارسال فکتوری آرگومان برای جلوگیری از ایجاد کلاس‌های Closure کامپایلر روی Heap.

#### ۵. انتقال کارهای جانبی به صف‌های بدون قفل با \`System.Threading.Channels\`:
انتقال ثبت لاگ‌ها و متریک‌ها به کانال‌های صف‌بندی‌شده Bounded برای آزادسازی سریع نخ‌های پاسخ‌دهی به کاربر.`,
  },
  {
    id: "dotnet-senior-q220",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-concurrency-channels-memory"],
    questionTitle: "How do you use ArrayPool, MemoryPool, and Span<T> in C# for high-performance data processing?",
    questionTitle_fa: "نحوه استفاده از ArrayPool، MemoryPool و Span<T> برای پردازش داده‌های بزرگ در C# با حداقل تخصیص حافظه چگونه است؟",
    answerContent: `### Zero-Allocation Buffer Pooling & Memory Management in C#

In high-throughput I/O pipelines (e.g. gRPC streaming, file uploads, network socket parsing), creating \`byte[]\` buffers per request quickly triggers Gen 2 GC collections.

\`\`\`csharp
public async Task ProcessLargeStreamAsync(Stream stream, int payloadSize, CancellationToken ct)
{
    // 1. Rent reusable buffer from the shared ArrayPool
    byte[] buffer = ArrayPool<byte>.Shared.Rent(payloadSize);
    
    try
    {
        int bytesRead = 0;
        while (bytesRead < payloadSize)
        {
            // 2. Read asynchronously into rented buffer using Memory<T>
            int read = await stream.ReadAsync(buffer.AsMemory(bytesRead, payloadSize - bytesRead), ct);
            if (read == 0) break;
            bytesRead += read;
        }

        // 3. Process payload using Span<T> slice with ZERO heap allocations
        ReadOnlySpan<byte> validData = buffer.AsSpan(0, bytesRead);
        ParseProtocolFrame(validData);
    }
    finally
    {
        // 4. CRITICAL: Always return the buffer to prevent pool depletion
        // clearArray: true wipes sensitive data (tokens, PII) before reuse
        ArrayPool<byte>.Shared.Return(buffer, clearArray: true);
    }
}

private void ParseProtocolFrame(ReadOnlySpan<byte> frame)
{
    // Direct zero-copy binary primitives reading
    int messageType = BinaryPrimitives.ReadInt32LittleEndian(frame.Slice(0, 4));
    long timestamp = BinaryPrimitives.ReadInt64LittleEndian(frame.Slice(4, 8));
}
\`\`\`

#### Key Architecture Rules for ArrayPool & Span:
1. **Rented Buffer Size Invariant:** \`ArrayPool.Rent(minSize)\` returns an array that is **at least** \`minSize\`, but often larger (rounded up to powers of 2). Always use the exact \`bytesRead\` slice (\`buffer.AsSpan(0, bytesRead)\`) rather than \`buffer.Length\`.
2. **Guaranteed Return Lifecycle:** Always return buffers inside a \`finally\` block. Failing to return leads to pool starvation and subsequent new heap allocations.
3. **Memory Safety:** Once returned, never touch the buffer reference again.`,
    answerContent_fa: `### پردازش داده‌های پرترافیک با استفاده از ArrayPool، Memory و Span در سی‌شارپ

در خطوط لوله ورودی/خروجی حجیم، ساخت مداوم بافرهای بایت (\`new byte[]\`) به سرعت باعث اشباع حافظه و توقف سیستم به دلیل GC می‌شود.

#### الگوی استاندارد پیاده‌سازی:
\`\`\`csharp
public async Task ProcessLargeStreamAsync(Stream stream, int payloadSize, CancellationToken ct)
{
    // ۱. قرض گرفتن بافر اشتراکی از استخر حافظه
    byte[] buffer = ArrayPool<byte>.Shared.Rent(payloadSize);
    
    try
    {
        int bytesRead = 0;
        while (bytesRead < payloadSize)
        {
            // ۲. خواندن داده‌های ناهمگام با استفاده از Memory<T>
            int read = await stream.ReadAsync(buffer.AsMemory(bytesRead, payloadSize - bytesRead), ct);
            if (read == 0) break;
            bytesRead += read;
        }

        // ۳. پردازش برش داده‌ها با ساختار فوق‌سریع Span<T> بدون ۱ بایت آلیکیشن جدید
        ReadOnlySpan<byte> validData = buffer.AsSpan(0, bytesRead);
        ParseProtocolFrame(validData);
    }
    finally
    {
        // ۴. بازگرداندن حتمی بافر به استخر در بلوک finally
        ArrayPool<byte>.Shared.Return(buffer, clearArray: true);
    }
}
\`\`\`

#### نکات حیاتی در مصاحبه:
۱. **طول بافر:** متد \`Rent(size)\` آرایه‌ای با طول **حداقل** \`size\` (معمولاً توانی از ۲) بازمی‌گرداند. همیشه باید از تکه واقعی خوانده‌شده (\`buffer.AsSpan(0, bytesRead)\`) استفاده کرد نه \`buffer.Length\`.
۲. **پاکسازی بایت‌ها:** با تنظیم \`clearArray: true\` در زمان بازگرداندن، داده‌های حساس امنیتی برای درخواست‌های بعدی پاک می‌شوند.`,
  },
  {
    id: "dotnet-senior-q221",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "How do you identify and analyze a Memory Leak in a production Linux .NET Core container using dotnet-dump?",
    questionTitle_fa: "چگونه یک Memory Leak را در محیط پروداکشن (Linux) در اپلیکیشن .NET Core با dotnet-dump شناسایی می‌کنی؟",
    answerContent: `### Diagnosing Memory Leaks with dotnet-dump

1. **Capture Dump in Container:**
   \`\`\`bash
   dotnet-dump collect -p <PID> -o /dumps/memory.dmp
   \`\`\`
2. **Analyze Dump:**
   \`\`\`bash
   dotnet-dump analyze /dumps/memory.dmp
   \`\`\`
3. **Key Commands:**
   - \`dumpheap -stat\`: Displays memory allocation counts grouped by type.
   - \`dumpheap -mt <MethodTable>\`: Lists all instances of leaking classes.
   - \`gcroot <ObjectAddress>\`: Displays the chain of references holding the object alive in memory (e.g. static event subscriptions or un-disposed handlers).`,
    answerContent_fa: `### تحلیل Memory Leak در لینوکس با dotnet-dump

گرفتن Dump از پروسس کانتینر با دستور \`dotnet-dump collect\` و تحلیل با \`dotnet-dump analyze\`. سپس با دستور \`dumpheap -stat\` اشیایی که بیشترین حافظه را گرفته‌اند پیدا کرده و با دستور **\`gcroot\`** ریشه ارجاعاتی که مانع از پاک‌سازی شیء توسط GC شده‌اند (مانند مشترکین رویدادهای استاتیک) مشخص می‌شود.`,
  },
  {
    id: "dotnet-senior-q222",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "What is your experience with profiling .NET applications using dotMemory and dotTrace?",
    questionTitle_fa: "تجربه پروفایلینگ اپلیکیشن با ابزارهایی مثل dotMemory و dotTrace را چگونه به کار می‌بری؟",
    answerContent: `### Profiling with dotMemory & dotTrace

- **dotMemory:** Takes snapshots over time and performs **Comparison Analyses** to identify object retention and allocation hotspots.
- **dotTrace:** Identifies CPU bottlenecks and flame graphs showing which specific methods consume the highest execution time.`,
    answerContent_fa: `### پروفایلینگ با ابزارهای JetBrains

- **dotMemory:** مقایسه اسنپ‌شات‌های حافظه قبل و بعد از ارسال بار جهت شناسایی نشتی حافظه و اشیای در حال رشد.
- **dotTrace:** تحلیل عملکرد CPU و نمودارهای Flame Graph جهت پیدا کردن متدهایی که بیشترین زمان پردازش را مصرف می‌کنند.`,
  },
  {
    id: "dotnet-senior-q223",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "What is ThreadPool Starvation in .NET and how is it prevented?",
    questionTitle_fa: "مشکل Thread Pool Starvation در دات‌نت چیست و چگونه از آن جلوگیری می‌کنی؟",
    answerContent: `### ThreadPool Starvation

Occurs when synchronous blocking calls (e.g. \`.Result\`, \`.Wait()\`, \`Thread.Sleep()\`) exhaust all available worker threads in the ThreadPool.
- New incoming HTTP requests queue up, response latencies skyrocket, and the server appears completely unresponsive while CPU usage remains low.

#### Prevention:
- Use purely asynchronous code throughout.
- Avoid calling \`Task.Run\` for short synchronous methods.`,
    answerContent_fa: `### پدیده ThreadPool Starvation

زمانی رخ می‌دهد که کدهای مسدودکننده همگام (مانند \`.Result\` یا \`Thread.Sleep\`) تمام تردهای ThreadPool را مشغول کنند. با پر شدن ظرفیت تردها، درخواست‌های جدید در صف معطل مانده و زمان پاسخ‌دهی به شدت بالا می‌رود. راه حل، استفاده کامل از \`async/await\` در تمامی لایه‌ها است.`,
  },

  // ── Elasticsearch, DevOps & Infrastructure (Q224 - Q233) ────────
  {
    id: "dotnet-senior-q224",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "Explain Elasticsearch internal architecture: Indices, Shards, and Nodes.",
    questionTitle_fa: "معماری داخلی Elasticsearch را توضیح دهید. مفاهیم Index، Shard و Node چیستند؟",
    answerContent: `### Elasticsearch Architecture

- **Index:** A logical collection of documents (similar to a database table).
- **Primary Shard:** A self-contained Apache Lucene inverted index instance. Documents are hashed to primary shards for horizontal scaling.
- **Replica Shard:** A live copy of a primary shard for high availability and read throughput.
- **Node:** A running Elasticsearch instance (Master-eligible, Data, or Ingest node).`,
    answerContent_fa: `### ساختار داخلی Elasticsearch

- **Index:** کالکشن منطقی اسناد و معادل جدول در دیتابیس.
- **Primary Shard:** هر ایندکس به چندین شارد (نمونه مجزای موتور Lucene) تقسیم می‌شود تا داده‌ها روی سرورهای مختلف توزیع شوند.
- **Replica Shard:** نسخه کپی برای افزایش دسترسی‌پذیری و سرعت خواندن.
- **Node:** یک سرور در کلاستر الستیک‌سرچ.`,
  },
  {
    id: "dotnet-senior-q225",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "How do you synchronize a primary database (PostgreSQL/SQL Server) with Elasticsearch in real time?",
    questionTitle_fa: "چگونه دیتابیس اصلی را به صورت بلادرنگ با Elasticsearch سینک می‌کنی؟",
    answerContent: `### Real-time Database-to-Elasticsearch Sync

1. **Change Data Capture (CDC) with Debezium & Kafka (Best Practice):**
   - Captures low-level database WAL (Write-Ahead Log) mutations with zero performance impact on the transactional database and pushes documents to Elasticsearch.
2. **Dual-Write via Outbox Pattern:**
   - Write to DB and emit domain events to RabbitMQ where consumer workers update Elasticsearch.`,
    answerContent_fa: `### همگام‌سازی بلادرنگ دیتابیس با الستیک‌سرچ

بهترین روش استفاده از **Change Data Capture (CDC)** با ابزار Debezium و Kafka است که مستقیماً تغییرات لاگ تراکنش‌های دیتابیس (WAL) را خوانده و اسناد را در الستیک‌سرچ به‌روزرسانی می‌کند، بدون آنکه بار اضافی به دیتابیس اصلی تحمیل شود.`,
  },
  {
    id: "dotnet-senior-q226",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What is the difference between Term Query and Match Query in Elasticsearch?",
    questionTitle_fa: "در Elasticsearch، تفاوت Term Query و Match Query چیست؟",
    answerContent: `### Term vs. Match Query in Elasticsearch

- **\`term\` Query:** Exact match on unanalyzed raw keyword fields (e.g. Product IDs, Status codes, Enums). Case-sensitive.
- **\`match\` Query:** Full-text search that runs the search string through the **Analyzer** (tokenization, lowercase, stemming) before querying inverted indices.`,
    answerContent_fa: `### تفاوت Term Query و Match Query

- **Term Query:** جستجوی دقیق بدون تحلیل متنی (Case-sensitive) مخصوص فیلدهای دقیق مانند ID، وضعیت و فیلدهای Keyword.
- **Match Query:** جستجوی تمام‌متنی (Full-Text Search) که متن ورودی را از فیلترهای Analyzer (توکنایز و ریشه‌یابی) عبور می‌دهد.`,
  },
  {
    id: "dotnet-senior-q227",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "How do you configure Analyzers for fast Persian text search in Elasticsearch?",
    questionTitle_fa: "برای جستجوی سریع در متون فارسی در Elasticsearch چه تنظیماتی روی Analyzerها انجام می‌دهی؟",
    answerContent: `### Persian Full-Text Search in Elasticsearch

1. **Persian Normalizer Filter:** Unifies Persian/Arabic letters (ی/ي and ک/ك) and strips zero-width non-joiners (نیم‌فاصله).
2. **Persian Stemmer:** Strips common Persian prefixes and plural suffixes (\`ها\`, \`ان\`, \`می\`).
3. **Persian Stopwords Filter:** Removes common non-informative words.`,
    answerContent_fa: `### تنظیمات Analyzer برای جستجوی متون فارسی

استفاده از نرمالایزر فارسی برای یکدست‌سازی حروف عربی/فارسی (ک/ك و ی/ي)، حذف نیم‌فاصله‌ها، استفاده از استمر فارسی (Persian Stemmer) برای حذف پسوندهای جمع و فیلتر کلمات ایست (Stopwords).`,
  },
  {
    id: "dotnet-senior-q228",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What tools and commands do you use to troubleshoot sudden Linux server CPU and Memory spikes?",
    questionTitle_fa: "عیب‌یابی مشکلات سرور لینوکسی (مانند Spike ناگهانی CPU یا Memory) را با چه ابزارهایی انجام می‌دهی؟",
    answerContent: `### Linux Server Performance Troubleshooting

- **\`htop\` / \`top\`:** Real-time per-core CPU and process inspection.
- **\`vmstat 1\`:** Virtual memory, context switching, and I/O wait statistics.
- **\`iostat -xz 1\`:** Disk saturation and storage bottleneck analysis.
- **\`ss -tulpn\` / \`netstat\`:** Socket connections and open listening ports.
- **\`dmesg -T | grep -i oom\`:** Checks if the Linux Out-Of-Memory killer terminated processes.`,
    answerContent_fa: `### دستورات عیب‌یابی سرور لینوکسی

استفاده از \`htop\` برای بررسی وضعیت پردازش‌ها، \`vmstat 1\` برای ارزیابی حافظه و Context Switch، \`iostat\` برای گلوگاه‌های دیسک و بررسی لاگ‌های کرنل با \`dmesg\` جهت بررسی کشتن پروسس‌ها توسط OOM Killer.`,
  },
  {
    id: "dotnet-senior-q229",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "How do you configure advanced Nginx rules for Rate Limiting, Caching, and Load Balancing?",
    questionTitle_fa: "کانفیگ‌های پیشرفته Nginx برای Rate Limiting، Caching و Load balancing چگونه است؟",
    answerContent: `### Advanced Nginx Configuration

\`\`\`nginx
# 1. Rate Limiting Zone (10 req/sec per IP)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# 2. Upstream Load Balancing
upstream backend_cluster {
    least_conn;
    server 10.0.0.1:8080 max_fails=3 fail_timeout=10s;
    server 10.0.0.2:8080 max_fails=3 fail_timeout=10s;
}

server {
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend_cluster;
    }
}
\`\`\``,
    answerContent_fa: `### کانفیگ پیشرفته Nginx

تعریف محدوده \`limit_req_zone\` برای محدودسازی تعداد درخواست‌های هر IP با قابلیت \`burst\`، به همراه تعریف کلاستر سرورها در بلوک \`upstream\` با الگوریتم \`least_conn\` و مکانیزم Health Check.`,
  },
  {
    id: "dotnet-senior-q230",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What is Zero Downtime Deployment? Compare Blue-Green vs. Canary deployments.",
    questionTitle_fa: "مفهوم Zero Downtime Deployment چیست؟ تکنیک‌های Blue-Green و Canary را توضیح دهید.",
    answerContent: `### Zero Downtime Deployments

- **Blue-Green Deployment:**
  - Maintains two identical production environments (Blue = Active, Green = Idle).
  - Deploys new version to Green, runs health checks, then switches router/balancer traffic instantly.
- **Canary Deployment:**
  - Gradually routes a small percentage of real user traffic ($5\% \\to 25\% \\to 100\%$) to the new version while monitoring error rates and latency metrics.`,
    answerContent_fa: `### مقایسه استقرار Blue-Green و Canary

- **Blue-Green:** داشتن دو محیط کامل؛ استقرار روی محیط دوم و سوئیچ آنی ترافیک پس از تست.
- **Canary:** هدایت تدریجی درصد کمی از ترافیک واقعی کاربران (مثلاً ۵٪) به سمت نسخه جدید و پایش متریک‌ها قبل از ارتقای کامل.`,
  },
  {
    id: "dotnet-senior-q231",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "senior",
    questionTitle: "How do you manage enterprise secrets using HashiCorp Vault?",
    questionTitle_fa: "مدیریت Secretها و اطلاعات حساس دیتابیس در ابعاد Enterprise با ابزارهایی مثل HashiCorp Vault؟",
    answerContent: `### Enterprise Secret Management with Vault

1. **Dynamic Secrets:** Generates short-lived, automated database credentials per microservice instance with automatic lease revocation.
2. **Transit Secrets Engine:** Performs encryption-as-a-service without storing the cryptographic keys in application memory.
3. **AppRole / Kubernetes Authentication:** Container workloads authenticate securely via service accounts.`,
    answerContent_fa: `### مدیریت سکرت‌های سازمانی با HashiCorp Vault

تولید رمزهای عبور داینامیک و موقت برای دیتابیس، استفاده از سرویس رمزنگاری داده‌ها (Transit Engine) بدون ذخیره کلید در کد برنامه، و احراز هویت خودکار پادهای کوبرنتیز از طریق Service Accountها.`,
  },
  {
    id: "dotnet-senior-q232",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What are the challenges of running Stateful Workloads (Databases) in Docker / Kubernetes?",
    questionTitle_fa: "چالش‌های اجرای دیتابیس‌ها داخل کانتینرهای Docker یا Kubernetes چیست؟",
    answerContent: `### Stateful Workloads in Kubernetes

- **Challenges:** Pod restarts cause loss of ephemeral storage, node failovers disrupt persistent connections, and distributed storage latency (Ceph/EBS) impacts I/O performance.
- **Solutions:** Use **StatefulSets**, **PersistentVolumeClaims (PVC)** backed by high-IOPS storage, and database operators (e.g. CloudNativePG, Zalando Postgres Operator).`,
    answerContent_fa: `### چالش‌های دیتابیس در کوبرنتیز

ناپایدار بودن کانتینرها، تاخیر در اتصال استوریج‌های شبکه‌ای هنگام جابجایی پادها بین نودها، و ریسک مفقودی داده. راهکار استفاده از **StatefulSet**ها، والیوم‌های با سرعت بالا (High-IOPS) و Operatorهای اختصاصی دیتابیس است.`,
  },
  {
    id: "dotnet-senior-q233",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "How does Distributed Tracing track requests across microservices (TraceId & SpanId)?",
    questionTitle_fa: "در Distributed Tracing، چگونه یک ریکوئست را بین ۱۰ میکروسرویس Track می‌کنید؟",
    answerContent: `### Distributed Tracing & W3C Trace Context

1. **TraceId:** A unique 128-bit identifier representing the entire end-to-end user transaction.
2. **SpanId:** Represents a single unit of contiguous work within one microservice.
3. **Propagation:** Propagated across HTTP and messaging boundaries via the **W3C \`traceparent\`** header (\`00-{TraceId}-{SpanId}-01\`).`,
    answerContent_fa: `### ساختار Distributed Tracing

استفاده از استاندارد **W3C Trace Context** که در آن یک **\`TraceId\`** واحد در سراسر زنجیره ریکوئست بین سرویس‌ها از طریق هدر \`traceparent\` منتقل می‌شود و هر مرحله کاری درون یک سرویس دارای یک **\`SpanId\`** اختصاصی است.`,
  },

  // ── FinTech Domain & Production Experience (Q234 - Q240) ─────────
  {
    id: "dotnet-senior-q234",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "In direct settlement systems, what is the biggest challenge in transaction aggregation?",
    questionTitle_fa: "در سیستم‌های تسویه‌حساب مستقیم، بزرگترین چالش تجمیع تراکنش‌ها چیست؟",
    answerContent: `### Settlement Transaction Aggregation Challenges

1. **Handling In-Flight Transactions:** Transactions settling right at the cutoff time window boundary.
2. **Refunds & Chargebacks:** Deducting refunded items from aggregate merchant balances without negative balance violations.
3. **High Volume Lock Contention:** Batch aggregation must run without locking real-time online checkout processing.`,
    answerContent_fa: `### چالش‌های تجمیع تراکنش‌های تسویه‌حساب (Settlement)

مدیریت تراکنش‌های معلقی که در مرز ساعت تسویه (Cutoff) ثبت می‌شوند، اعمال مرجوعی‌ها و استرداد وجه در تجمیع حساب‌ها، و جلوگیری از قفل شدن جداول مالی اصلی در زمان محاسبات سنگین تجمیع.`,
  },
  {
    id: "dotnet-senior-q235",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How do you automate financial reconciliation between payment gateways and internal databases?",
    questionTitle_fa: "چگونه فرآیند مغایرت‌گیری بین لاگ‌های درگاه پرداخت و دیتابیس داخلی را اتوماتیک کردی؟",
    answerContent: `### Automated Financial Reconciliation

1. **Download Gateway Bank Logs (EOD Files):** Automated daily ingestion via SFTP / API.
2. **3-Way Matching Engine:**
   - Matches Bank Statement $\\leftrightarrow$ Payment Gateway Log $\\leftrightarrow$ Internal Ledger.
3. **Discrepancy Bucket:** Automatically tags mismatched records (missing callback, duplicate debit) and triggers automated reversal or alerts finance operations.`,
    answerContent_fa: `### اتوماسیون فرآیند مغایرت‌گیری بانکی

دریافت فایل‌های صورت‌حساب پایان روز (EOD) از درگاه‌های بانکی، تطبیق سه‌طرفه (بانک، درگاه و دیتابیس داخلی)، و جداسازی خودکار رکوردهای دارای مغایرت جهت اصلاح سیستمی یا ارسال هشدار به تیم مالی.`,
  },
  {
    id: "dotnet-senior-q236",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you model complex financial transaction lifecycles using the State Machine Pattern?",
    questionTitle_fa: "مدیریت Stateهای پیچیده یک تراکنش مالی را چگونه با الگوی State Machine پیاده کردی؟",
    answerContent: `### State Machine for Financial Workflows

States: \`Created\` $\\to$ \`PendingPayment\` $\\to$ \`Verified\` $\\to$ \`Settled\` (or \`Failed\`, \`Refunded\`).

#### Implementation:
Use libraries like **Stateless** in C# or **MassTransit State Machine**. Enforces that invalid state transitions (e.g. going directly from \`Failed\` to \`Settled\`) throw domain exceptions and are impossible.`,
    answerContent_fa: `### مدیریت وضعیت مالی با State Machine

تعریف صریح وضعیت‌ها و انتقال‌های مجاز با کتابخانه **Stateless** تا انتقال‌های غیرمجاز (مانند انتقال از وضعیت \`Failed\` به \`Settled\`) در سطح کد غیرممکن شده و لاگ تاریخچه کلیه تغییر وضعیت‌ها ثبت گردد.`,
  },
  {
    id: "dotnet-senior-q237",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How do you handle long timeouts from third-party insurance/banking APIs without exhausting server threads?",
    questionTitle_fa: "در ارتباط با APIهای کند بیمه‌ها یا بانک‌ها، چگونه مشکل Timeoutهای طولانی را هندل می‌کنی؟",
    answerContent: `### Handling Slow Third-Party APIs

1. **Strict CancellationToken Timeouts:** Configure HTTP timeouts (e.g. 5 seconds) to fail fast.
2. **Polly Bulkhead Isolation:** Limit concurrent outbound requests to slow partners to prevent taking down your main threadpool.
3. **Asynchronous Polling / Webhook Pattern:** Trigger request and accept async webhook callbacks rather than keeping HTTP connections open for minutes.`,
    answerContent_fa: `### مدیریت ارتباط با وب‌سرویس‌های کند خارجی

تنظیم زمان Timeout دقیق با \`CancellationToken\`، استفاده از الگوی **Bulkhead** در Polly برای محدود کردن تعداد درخواست‌های همزمان به سرویس مربوطه، و تغییر رویکرد به وب‌هوک‌های ناهمگام به جای باز نگه داشتن اتصال.`,
  },
  {
    id: "dotnet-senior-q238",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "senior",
    questionTitle: "How do you secure B2B Merchant APIs (mTLS, API Keys, HMAC signatures)?",
    questionTitle_fa: "روش‌های امن‌سازی APIهای B2B را برای ادغام با سیستم‌های Merchant توضیح دهید.",
    answerContent: `### B2B API Security Strategies

- **Mutual TLS (mTLS):** Client and server authenticate each other using x509 certificates.
- **HMAC Signatures:** Merchant hashes the request body + timestamp with a shared secret (\`HMAC-SHA256\`), preventing tampering and replay attacks.
- **IP Whitelisting & Scoped API Keys**.`,
    answerContent_fa: `### امن‌سازی APIهای B2B

استفاده از **Mutual TLS (mTLS)** برای احراز هویت دوطرفه سرور و کلاینت، امضای دیجیتال بدنه درخواست با الگوریتم **HMAC-SHA256** به همراه Timestamp جهت جلوگیری از حملات Replay Attack و محدودسازی به IPهای معتبر.`,
  },
  {
    id: "dotnet-senior-q239",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "What breaking changes and performance improvements occur when migrating from .NET 5 to .NET 8?",
    questionTitle_fa: "در فرآیند مهاجرت از .NET 5 به .NET 8 با چه بهبودها و تغییراتی مواجه شدید؟",
    answerContent: `### .NET 5 to .NET 8 Migration

#### Improvements:
- **Dynamic PGO (Profile-Guided Optimization):** Up to 20-30% automatic throughput increase.
- **Arm64 & AVX-512 Vectorization**.
- Native JSON serializer performance enhancements and Native AOT support.
- New C# features (Required properties, Primary Constructors, Collection Expressions).`,
    answerContent_fa: `### مهاجرت از .NET 5 به .NET 8

بهره‌مندی از بهینه‌سازی کامپایلر **Dynamic PGO** با افزایش ۲۰ تا ۳۰ درصدی سرعت، کاهش چشمگیر مصرف حافظه در JSON Serialization، پشتیبانی از Native AOT و ویژگی‌های مدرن C# 12 مانند Primary Constructors.`,
  },
  {
    id: "dotnet-senior-q240",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    questionTitle: "How do you optimize heavy Admin Reporting queries and panels?",
    questionTitle_fa: "برای بهینه‌سازی سیستم‌های ریپورتینگ و داشبورد ادمین چه معماری‌ای پیشنهاد می‌دهی؟",
    answerContent: `### Optimizing Admin Reporting Panels

1. **Separate Read Model / Replica:** Direct heavy aggregations to read replicas.
2. **Pre-aggregated Summary Tables (Materialized Views):** Compute hourly/daily stats asynchronously with background workers instead of running \`COUNT()\` / \`SUM()\` across millions of live transactional rows.
3. **Columnar Store (ClickHouse / DuckDB):** For multi-gigabyte analytical reporting.`,
    answerContent_fa: `### بهینه‌سازی گزارش‌گیری‌های سنگین پنل ادمین

هدایت کوئری‌های تحلیلی به Read Replica، استفاده از جداول تجمیعی پیش‌محاسبه‌شده (Materialized Views) توسط سرویس‌های پس‌زمینه به جای محاسبه زنده روی جداول تراکنشی، و استفاده از دیتابیس‌های ستونی (مانند ClickHouse).`,
  },

  // ── Advanced C#, Design Patterns & Architecture (Q241 - Q250) ────
  {
    id: "dotnet-senior-q241",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "What are C# Source Generators and how do they compare to Reflection?",
    questionTitle_fa: "نحوه نوشتن Source Generators در دات‌نت و مزیت آن نسبت به Reflection چیست؟",
    answerContent: `### C# Source Generators

Source Generators run during **compilation** to inspect source code and generate additional C# source files on the fly.

- **Reflection (Runtime):** Slow, allocates memory, breaks AOT compilation, runtime failures.
- **Source Generators (Compile-time):** Blazingly fast, zero runtime allocation, full compile-time safety (e.g. \`System.Text.Json\` source generator).`,
    answerContent_fa: `### مزایای Source Generator نسبت به Reflection

سورس جنریتورها کدهای جدید را در زمان کامپایل تولید و اضافه می‌کنند. این کار نیاز به Reflection در زمان اجرا را حذف کرده، سرعت برنامه را فوق‌العاده افزایش داده و خطاهای احتمالی را در همان زمان کامپایل مشخص می‌کند.`,
  },
  {
    id: "dotnet-senior-q242",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "How and when do you use SemaphoreSlim and ReaderWriterLockSlim in C#?",
    questionTitle_fa: "مفاهیم پیشرفته Threading مثل SemaphoreSlim و ReaderWriterLock کجا کاربرد دارند؟",
    answerContent: `### SemaphoreSlim vs. ReaderWriterLockSlim

- **\`SemaphoreSlim\`:**
  - Asynchronous throttling (\`await WaitAsync()\`).
  - Limits concurrent access to a resource (e.g. max 5 concurrent external HTTP requests).
- **\`ReaderWriterLockSlim\`:**
  - Optimizes read-heavy data structures by allowing multiple simultaneous concurrent readers while granting exclusive access to single writers.`,
    answerContent_fa: `### کاربرد SemaphoreSlim و ReaderWriterLockSlim

- **\`SemaphoreSlim\`:** برای کنترل همزمانی ناهمگام (\`await WaitAsync\`) و محدود کردن تعداد عملیات‌های همزمان (مانند محدود کردن درخواست‌های همزمان به درگاه بانکی).
- **\`ReaderWriterLockSlim\`:** اجازه خواندن همزمان به چندین ترد و اختصاص قفل انحصاری به ترد نویسنده.`,
  },
  {
    id: "dotnet-senior-q243",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "How do you use System.Threading.Channels for high-throughput Producer-Consumer workflows?",
    questionTitle_fa: "استفاده از System.Threading.Channels برای پردازش‌های Producer-Consumer با ترافیک بالا؟",
    answerContent: `### System.Threading.Channels

A Channel is a high-performance, low-allocation in-memory queue designed for Producer-Consumer patterns.

\`\`\`csharp
var channel = Channel.CreateBounded<LogMessage>(new BoundedChannelOptions(10000)
{
    FullMode = BoundedChannelFullMode.Wait
});

// Producer
await channel.Writer.WriteAsync(new LogMessage("User logged in"));

// Consumer Worker
await foreach (var msg in channel.Reader.ReadAllAsync())
{
    await SaveLogAsync(msg);
}
\`\`\``,
    answerContent_fa: `### پردازش با ترافیک بالا با System.Threading.Channels

کتابخانه Channels یک صف درون حافظه‌ای بسیار سریع با کمترین میزان Allocation است که الگوی Producer-Consumer را به شکل کاملاً ناهمگام و بدون نیاز به قفل‌های سنگین پیاده‌سازی می‌کند.`,
  },
  {
    id: "dotnet-senior-q244",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "What is the Actor Model pattern (e.g. Microsoft Orleans / Akka.NET)?",
    questionTitle_fa: "الگوی Actor Model (مثل فریم‌ورک‌های Orleans یا Akka.NET) چیست؟",
    answerContent: `### Actor Model (Microsoft Orleans / Akka.NET)

The Actor model encapsulates state and behavior into independent, single-threaded computing units called **Actors (Grains)**.
- Communication occurs exclusively through asynchronous message passing.
- **Zero Locks Needed:** Because each Actor processes one message at a time, its internal state is inherently thread-safe without locks or race conditions.`,
    answerContent_fa: `### الگوی Actor Model در دات‌نت

در این الگو، هر موجودیت (مانند سبد خرید یک کاربر) یک Actor مستقل با وضعیت ایزوله است. تمام ارتباطات از طریق ارسال پیام است و از آنجا که هر Actor در هر لحظه فقط یک پیام را پردازش می‌کند، هیچ نیازی به قفل‌گذاری و نگرانی از Race Condition وجود ندارد.`,
  },
  {
    id: "dotnet-senior-q245",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "Compare Shared Database vs. Separate Database approaches in Multi-Tenant Architecture.",
    questionTitle_fa: "معماری Multi-tenant: رویکرد Shared Database در مقابل Separate Database را چگونه مقایسه می‌کنی؟",
    answerContent: `### Multi-Tenancy Approaches

| Strategy | Shared Database (Shared Schema) | Database-per-Tenant |
| :--- | :--- | :--- |
| **Cost** | Lowest infrastructure cost | High infrastructure cost |
| **Isolation** | Logical isolation via \`TenantId\` filters | Strong physical and security isolation |
| **Maintenance** | Easy migrations (single DB) | Complex migrations across hundreds of DBs |
| **Best For** | Standard B2B SaaS | Enterprise clients with strict regulatory compliance |`,
    answerContent_fa: `### مقایسه استراتژی‌های معماری Multi-Tenant

- **Shared Database:** همه مستاجران در یک دیتابیس مشترک با تفکیک \`TenantId\` قرار دارند (هزینه پایین و نگهداری آسان).
- **Database-per-Tenant:** هر مستاجر دیتابیس مجزای خود را دارد (امنیت و ایزولاسیون کامل مناسب مشتریان سازمانی بزرگ).`,
  },
  {
    id: "dotnet-senior-q246",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    questionTitle: "How do you securely isolate tenant data in EF Core in a Multi-Tenant application?",
    questionTitle_fa: "نحوه ایزوله کردن ایمن داده‌های هر Tenant در EF Core را چگونه پیاده می‌کنی؟",
    answerContent: `### Tenant Data Isolation in EF Core

1. Resolve current \`TenantId\` from the HTTP request (subdomain, header, or JWT claim) in a scoped \`ICurrentTenantService\`.
2. Apply **Global Query Filters** in \`DbContext.OnModelCreating\`:
   \`\`\`csharp
   modelBuilder.Entity<Order>().HasQueryFilter(o => o.TenantId == _currentTenantService.TenantId);
   \`\`\`
3. Override \`SaveChangesAsync\` to automatically populate \`entity.TenantId\` on newly created records.`,
    answerContent_fa: `### ایزولاسیون داده‌های Tenant در EF Core

استخراج شناسه مستاجر از توکن یا ساب‌دامین، اعمال **Global Query Filter** روی تمام موجودیت‌ها در \`DbContext\` و تنظیم خودکار فیلد \`TenantId\` در متد \`SaveChangesAsync\` قبل از ذخیره در دیتابیس.`,
  },
  {
    id: "dotnet-senior-q247",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "Explain Disaster Recovery planning and RPO / RTO metrics in financial systems.",
    questionTitle_fa: "استراتژی‌های Disaster Recovery و شاخص‌های RPO و RTO در سیستم‌های مالی چیست؟",
    answerContent: `### Disaster Recovery: RPO & RTO

- **RPO (Recovery Point Objective):** Maximum acceptable data loss duration measured in time (e.g. $\\le 1$ minute of financial transactions).
- **RTO (Recovery Time Objective):** Maximum acceptable downtime duration to restore service operations (e.g. $\\le 15$ minutes).

#### Strategies:
Automated point-in-time database WAL backups, geo-redundant storage replication, and automated failover runbooks.`,
    answerContent_fa: `### مفاهیم RPO و RTO در مدیریت بحران (Disaster Recovery)

- **RPO:** حداکثر زمان قابل قبول از دست رفتن داده‌ها (مثلاً حداکثر ۱ دقیقه از تراکنش‌ها).
- **RTO:** حداکثر زمان قابل قبول برای بالا آمدن مجدد سیستم و رفع قطعی (مثلاً ۱۵ دقیقه).`,
  },
  {
    id: "dotnet-senior-q248",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "What is the CAP Theorem and how does it apply to distributed databases?",
    questionTitle_fa: "قضیه CAP در سیستم‌های توزیع‌شده چیست و در دیتابیس‌های مختلف چگونه تفسیر می‌شود؟",
    answerContent: `### The CAP Theorem

A distributed system can guarantee at most **two** of the following three properties during a network partition:
1. **Consistency (C):** Every read receives the most recent write.
2. **Availability (A):** Every request receives a non-error response.
3. **Partition Tolerance (P):** The system continues to operate despite network drops between nodes.

In distributed networks, **Partition Tolerance is mandatory**, forcing a trade-off between **CP** (e.g. MongoDB, Redis, Spanner) and **AP** (e.g. Cassandra, DynamoDB).`,
    answerContent_fa: `### قضیه CAP در سیستم‌های توزیع‌شده

در زمان بروز اختلال شبکه بین نودها (Partition Tolerance که اجتناب‌ناپذیر است)، سیستم فقط می‌تواند یکی از دو ویژگی **سازگاری قطعی (Consistency)** یا **دسترسی‌پذیری بالا (Availability)** را انتخاب کند.`,
  },
  {
    id: "dotnet-senior-q249",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "What is the PACELC Theorem and how does it extend the CAP theorem?",
    questionTitle_fa: "قضیه PACELC چیست و چگونه CAP را تکمیل می‌کند؟",
    answerContent: `### PACELC Theorem

Extends CAP by describing system trade-offs during normal operations:
- If there is a **Partition (P)**, trade off **Availability (A)** vs **Consistency (C)**;
- **Else (E)**, trade off **Latency (L)** vs **Consistency (C)**.

Explains why high-consistency databases incur higher latency even when network connectivity is healthy.`,
    answerContent_fa: `### قضیه PACELC

قضیه CAP را تکمیل می‌کند: اگر شبکه قطع شود (P) بین دسترسی (A) و سازگاری (C) انتخاب کن؛ در غیر این صورت (E) بین **تاخیر زمانی (Latency)** و **سازگاری (Consistency)** تعادل برقرار کن.`,
  },
  {
    id: "dotnet-senior-q250",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "senior",
    questionTitle: "What software and infrastructure strategies do you implement to mitigate DDoS attacks?",
    questionTitle_fa: "راهکارهای نرم‌افزاری و زیرساختی برای مقابله با حملات DDoS چیست؟",
    answerContent: `### DDoS Mitigation Strategies

1. **Edge CDN / Cloud Protection (Cloudflare / ArvanCloud):** Anycast DNS routing and Web Application Firewall (WAF) scrubbing centers.
2. **API Gateway Rate Limiting:** IP-based and token-based sliding window rate limits.
3. **Connection Draining:** Drop unauthenticated slow HTTP connections (Slowloris attacks).`,
    answerContent_fa: `### راهکارهای مقابله با حملات DDoS

استفاده از لایه‌های محافظتی CDN و WAF ابری برای تصفیه ترافیک مخرب، اعمال Rate Limiting در سطح Gateway و بستن اتصالات معلق مشکوک.`,
  },

  // ── Technical Leadership & High-Level Scenarios (Q251 - Q300) ───
  {
    id: "dotnet-senior-q251",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "GraphQL vs. REST: Is GraphQL justified for dynamic insurance comparison data in Azki?",
    questionTitle_fa: "تفاوت GraphQL با REST چیست و آیا استفاده از آن در ازکی توجیه دارد؟",
    answerContent: `### GraphQL vs. REST in Comparison Platforms

- **GraphQL Advantage:** Eliminates Over-fetching/Under-fetching; frontend clients query exact custom fields across insurance coverages.
- **Trade-offs:** Harder to cache at HTTP/CDN layer compared to REST URLs, and risk of unbounded nested queries impacting backend performance.`,
    answerContent_fa: `### مقایسه GraphQL و REST در پلتفرم‌های مقایسه‌ای

GraphQL به کلاینت فرانت‌اند اجازه می‌دهد دقیقاً فیلدهای مورد نیازش را درخواست کند که برای جداول مقایسه‌ای مناسب است. اما کشینگ آن در CDN پیچیده‌تر است و کوئری‌های تودرتو می‌توانند به دیتابیس فشار وارد کنند.`,
  },
  {
    id: "dotnet-senior-q252",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How do you design a reliable WebHook notification system for B2B merchant clients?",
    questionTitle_fa: "نحوه طراحی و پیاده‌سازی سیستم WebHooks برای اطلاع‌رسانی به کلاینت‌های B2B؟",
    answerContent: `### Enterprise Webhook Architecture

1. **Queueing:** Outbound webhook payloads are enqueued to a RabbitMQ dead-letter exchange.
2. **Signed Payloads:** Sign requests using \`X-Signature: HMAC-SHA256(payload, secret)\`.
3. **Exponential Backoff Retries:** Retry delivery across 5 attempts over 24 hours. Disable failing endpoints automatically.`,
    answerContent_fa: `### طراحی سیستم وب‌هوک مطمئن برای کسب‌وکارها

ارسال ناهمگام از طریق صف، امضای محتوا با هدر HMAC برای امنیت و تایید اصالت، و تلاش مجدد با بازه‌های تصاعدی در صورت پاسخ ندادن سرور مشتری.`,
  },
  {
    id: "dotnet-senior-q253",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    questionTitle: "How do you perform zero-downtime database schema evolution (Expand & Contract pattern)?",
    questionTitle_fa: "استراتژی‌های Schema Evolution؛ چگونه ساختار دیتابیس را بدون Downtime تغییر می‌دهید؟",
    answerContent: `### Expand and Contract (Parallel Run) Pattern

1. **Expand:** Add new column/table without modifying or dropping old columns.
2. **Dual-Write / Read Transition:** Deploy application version that writes to both old and new columns, and reads from the new column.
3. **Backfill:** Run background script backfilling existing historical data.
4. **Contract:** Remove the old unused column in a subsequent release.`,
    answerContent_fa: `### تغییر ساختار دیتابیس بدون قطعی (Expand & Contract)

۱. اضافه کردن ستون جدید بدون حذف ستون قبلی (Expand).
۲. استقرار کدی که در هر دو ستون می‌نویسد و از ستون جدید می‌خواند.
۳. اجرای اسکریپت بک‌فیل برای داده‌های قدیمی.
۴. حذف ستون قدیمی در ریلیزهای بعدی (Contract).`,
  },
  {
    id: "dotnet-senior-q254",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "How do you manage Technical Debt and negotiate refactoring time with Product Managers?",
    questionTitle_fa: "رویکرد شما در قبال بدهی فنی (Technical Debt) و مذاکره با مدیر محصول چیست؟",
    answerContent: `### Managing Technical Debt

- Translate technical debt into **business impact** (e.g. system instability, slower time-to-market for new features, increased cloud hosting costs).
- Allocate a fixed percentage ($15-20\%$) of every sprint capacity specifically for refactoring and platform engineering.`,
    answerContent_fa: `### مدیریت بدهی فنی (Technical Debt)

ترجمه بدهی فنی به زبان بیزینس (مانند ریسک قطعی، کاهش سرعت توسعه فیچرهای آینده و افزایش هزینه‌های سرور) و اختصاص سهم ثابت (۱۵ تا ۲۰ درصد) از هر اسپرینت به ریفکتور و کارهای زیرساختی.`,
  },
  {
    id: "dotnet-senior-q255",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you document macro system architecture using the C4 Model?",
    questionTitle_fa: "چگونه معماری کلان سیستم را مستندسازی می‌کنید (مدل C4)؟",
    answerContent: `### The C4 Architecture Model

Hierarchical map of software architecture:
1. **Context Diagram:** System boundaries and external user/system actors.
2. **Container Diagram:** Applications, databases, microservices, and message brokers.
3. **Component Diagram:** Internal structural components within a single container.
4. **Code Diagram:** Class diagrams for complex domain patterns.`,
    answerContent_fa: `### مستندسازی معماری با مدل C4

مدل ۴ لایه C4 شامل:
۱. **Context:** مرزهای سیستم و ارتباط با کاربران و سرویس‌های بیرونی.
۲. **Container:** سرویس‌ها، دیتابیس‌ها و صف‌های پیام.
۳. **Component:** ماژول‌ها و لایه‌های داخلی هر سرویس.
۴. **Code:** دیاگرام‌های کلاس برای بخش‌های پیچیده دامین.`,
  },
  {
    id: "dotnet-senior-q256",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "What are Architecture Decision Records (ADRs) and why are they valuable?",
    questionTitle_fa: "ثبت تصمیمات معماری (ADR - Architecture Decision Records) چیست؟",
    answerContent: `### Architecture Decision Records (ADRs)

Short markdown documents capturing important architectural choices, including **Context, Decision, and Consequences/Trade-offs**.

**Value:** Preserves organizational memory so future engineers understand why decisions were made instead of second-guessing past designs.`,
    answerContent_fa: `### اسناد تصمیمات معماری (ADR)

مستندات متنی کوتاهی در مخزن گیت که چرایی یک تصمیم فنی، گزینه‌های بررسی‌شده و Trade-offهای پذیرفته‌شده را ثبت می‌کنند تا به عنوان حافظه تاریخی تیم حفظ شوند.`,
  },
  {
    id: "dotnet-senior-q257",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What is the difference between SLI, SLO, and SLA in service reliability monitoring?",
    questionTitle_fa: "شاخص‌های SLI، SLO و SLA در مانیتورینگ چه تفاوتی با هم دارند؟",
    answerContent: `### SLI vs. SLO vs. SLA

- **SLI (Service Level Indicator):** A quantifiable metric of performance (e.g. \`99.5% of payment requests finish <200ms\`).
- **SLO (Service Level Objective):** Internal target agreed upon by the engineering team (e.g. \`SLI >= 99.9% over 30 days\`).
- **SLA (Service Level Agreement):** Legally binding contract with external clients including financial penalties if breached.`,
    answerContent_fa: `### تفاوت SLI، SLO و SLA

- **SLI:** متریک اندازه‌گیری‌شده واقعی (مثلاً زمان پاسخ‌دهی).
- **SLO:** هدف‌گذاری داخلی تیم فنی برای کیفیت سرویس (مثلاً آپ‌تایم ۹۹.۹٪).
- **SLA:** قرارداد حقوقی با مشتری که عدم تعهد به آن جریمه مالی دارد.`,
  },
  {
    id: "dotnet-senior-q258",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you handle and eliminate Cyclic Dependencies between layers or microservices?",
    questionTitle_fa: "نحوه برخورد با وابستگی‌های چرخه‌ای (Cyclic Dependencies) بین لایه‌ها یا میکروسرویس‌ها؟",
    answerContent: `### Eliminating Cyclic Dependencies

1. **Dependency Inversion:** Introduce an intermediate interface in the core layer.
2. **Event-Driven Pub/Sub:** Replace direct synchronous RPC call cycles with domain event publishing.
3. **Extract Shared Domain:** Move mutually dependent logic to a shared standalone module.`,
    answerContent_fa: `### رفع وابستگی‌های چرخه‌ای (Cyclic Dependencies)

استفاده از اصل وارونگی وابستگی (DIP) و تعریف اینترفیس، استفاده از معماری رویدادمحور و پیام‌رسانی به جای فراخوانی مستقیم متقابل، یا استخراج بخش‌های مشترک به یک سرویس مجزا.`,
  },
  {
    id: "dotnet-senior-q259",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How would you design a system to handle 10 million requests per hour during an Azki sales campaign?",
    questionTitle_fa: "اگر قرار باشد سیستمی برای ۱۰ میلیون درخواست در ساعت طراحی کنید، چه معماری پیشنهاد می‌دهید؟",
    answerContent: `### High-Scale Campaign Architecture (10M req/hr $\\approx$ 3,000 req/sec)

1. **CDN Edge Caching:** Cache static assets and public quote lookups at the edge.
2. **Stateless Autoscaling:** Scale ASP.NET Core pods horizontally across Kubernetes nodes.
3. **Asynchronous Order Processing:** Enqueue purchase intents into RabbitMQ/Kafka; workers process orders at a controlled rate without DB locking.
4. **Read/Write DB Splitting:** Heavy read queries run against clustered read replicas and Redis.`,
    answerContent_fa: `### معماری پاسخگویی به ۱۰ میلیون درخواست در ساعت

استفاده از کشینگ لبه در CDN، اجرای پادهای Stateless در کوبرنتیز با قابلیت HPA، قرار دادن درخواست‌های ثبت سفارش در صف‌های پرسرعت برای پردازش ناهمگام و تفکیک کوئری‌های خواندن روی Read Replicaها.`,
  },
  {
    id: "dotnet-senior-q260",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "What is a Bloom Filter and where is it beneficial in distributed caching?",
    questionTitle_fa: "استفاده از ساختار داده Bloom Filter در کشینگ چه مزیتی دارد؟",
    answerContent: `### Bloom Filters in Caching

A **Bloom Filter** is a space-efficient probabilistic data structure used to test whether an element is a member of a set.
- Returns either **"Possibly in set"** or **"Definitely not in set"**.

**Use Case:** Prevents **Cache Penetration** by verifying if a requested ID exists in the dataset before executing an expensive database lookup.`,
    answerContent_fa: `### ساختار داده Bloom Filter

ساختار داده‌ای احتمالی و بسیار کم‌حجم است که با قطعیت اعلام می‌کند یک کلید **قطعاً در دیتابیس وجود ندارد**. قرار دادن آن قبل از کش مانع از حملات Cache Penetration و هدررفت منابع دیتابیس می‌شود.`,
  },
  {
    id: "dotnet-senior-q261",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "Why use MessagePack or Protobuf instead of JSON for inter-service communication?",
    questionTitle_fa: "مزیت استفاده از MessagePack یا Protobuf به جای JSON چیست؟",
    answerContent: `### MessagePack / Protobuf vs. JSON

Binary serialization formats (MessagePack / Protobuf) serialize data into raw bytes instead of text strings:
- **Up to 5x smaller payload size**, saving network bandwidth.
- **Up to 10x faster serialization/deserialization**, reducing CPU and memory overhead significantly.`,
    answerContent_fa: `### مزایای MessagePack و Protobuf

فرمت‌های باینری فشرده‌ای هستند که حجم داده‌ها را تا ۵ برابر کاهش داده و سرعت پردازش را تا ۱۰ برابر نسبت به JSON متنی افزایش می‌دهند.`,
  },
  {
    id: "dotnet-senior-q262",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "How do you manage Timeouts and CancellationToken propagation across microservice chains?",
    questionTitle_fa: "نحوه مدیریت Timeout و انتشار CancellationToken در سراسر زنجیره میکروسرویس‌ها؟",
    answerContent: `### CancellationToken Propagation

1. Pass \`HttpContext.RequestAborted\` from controller down through services and EF Core queries.
2. If a client cancels their browser request, downstream DB queries cancel immediately, freeing server threads.
3. Propagate timeout deadlines across HTTP calls using the **\`Request-Timeout\` / \`grpc-timeout\`** headers.`,
    answerContent_fa: `### انتشار CancellationToken در زنجیره فراخوانی‌ها

پاس دادن \`RequestAborted\` به تمام متدهای دیتابیس و سرویس‌ها تا در صورت لغو درخواست توسط کاربر، پردازش‌های سرور و دیتابیس بلافاصله متوقف شده و منابع آزاد شوند.`,
  },
  {
    id: "dotnet-senior-q263",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "How should your system behave when the RabbitMQ cluster is temporarily down (Resiliency)?",
    questionTitle_fa: "اگر کلاستر RabbitMQ موقتاً از کار بیفتد، سیستم شما چگونه رفتار می‌کند تا داده‌ای از بین نرود؟",
    answerContent: `### Broker Outage Resiliency

By utilizing the **Transactional Outbox Pattern**:
- When RabbitMQ goes down, API transactions continue saving entities and outbox events to the local database normally.
- Once RabbitMQ recovers, the outbox publisher resumes draining and publishing pending messages with zero data loss.`,
    answerContent_fa: `### رفتار سیستم در زمان قطعی موقت RabbitMQ

به کمک الگوی **Transactional Outbox**، درخواست‌های کاربران بدون قطعی در دیتابیس ثبت می‌شوند و به محض اتصال مجدد RabbitMQ، پیام‌های معلق بدون از دست رفتن اطلاعات به صف ارسال می‌گردند.`,
  },
  {
    id: "dotnet-senior-q264",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "senior",
    questionTitle: "What is your approach to Load Testing systems using k6 or JMeter?",
    questionTitle_fa: "رویکرد شما برای تست بار (Load Testing) سیستم با ابزارهایی مثل k6 چیست؟",
    answerContent: `### Load Testing with k6

1. **Smoke Testing:** Minimal load (1-2 VUs) to verify test scripts.
2. **Load Testing:** Simulate expected peak production traffic (e.g. 2,000 VUs).
3. **Stress Testing:** Push system past normal capacity to find breaking points.
4. **Spike Testing:** Sudden surge to verify auto-scaling and recovery.`,
    answerContent_fa: `### مراحل تست بار با ابزار k6

اجرای تست‌های پله‌ای شامل Load Test (شبیه‌سازی ترافیک پیک)، Stress Test (افزایش بار تا مرز شکست سیستم) و Spike Test برای بررسی عملکرد Auto-scaling و زمان ریکاوری سرورها.`,
  },
  {
    id: "dotnet-senior-q265",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What is Chaos Engineering and why is it used?",
    questionTitle_fa: "مفهوم Chaos Engineering چیست؟",
    answerContent: `### Chaos Engineering

The discipline of experimenting on a distributed system in production or staging to build confidence in the system's capability to withstand turbulent conditions (e.g. randomly killing pods, introducing artificial network latency).`,
    answerContent_fa: `### مفهوم Chaos Engineering

تزریق عمدی و کنترل‌شده خرابی به سیستم (مانند خاموش کردن ناگهانی یک سرور یا ایجاد تاخیر در شبکه) جهت سنجش و ارتقای تاب‌آوری سیستم در برابر حوادث پیش‌بینی‌نشده.`,
  },
  {
    id: "dotnet-senior-q266",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "What is a Bounded Context in DDD and how does it define microservice boundaries?",
    questionTitle_fa: "مفهوم Bounded Context در DDD چیست و چگونه مرزهای میکروسرویس‌ها را تعیین می‌کند؟",
    answerContent: `### Bounded Contexts in DDD

A **Bounded Context** defines the explicit boundary within which a specific domain model and its **Ubiquitous Language** apply.
- E.g. A \`Policy\` in the Sales Bounded Context has pricing and payment models; in the Claims Bounded Context, a \`Policy\` is an entitlement model with coverage limits.`,
    answerContent_fa: `### مرزهای Bounded Context در DDD

تعریف مرزهای زبانی و مفهومی مشخصی است که در آن هر مدل معنای دقیقی دارد. مرزهای Bounded Context بهترین راهنما برای تفکیک میکروسرویس‌های مستقل هستند.`,
  },
  {
    id: "dotnet-senior-q267",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "When should an enterprise architect choose a Modular Monolith over Microservices, and what are the trade-offs?",
    questionTitle_fa: "چه زمانی یک معمار نرم‌افزار باید به جای میکروسرویس از الگوی Modular Monolith استفاده کند و تریدآف‌های آن چیست؟",
    answerContent: `### Modular Monolith vs. Microservices Architecture Decision Guide

A **Modular Monolith** provides the architectural purity and domain encapsulation of Microservices without the staggering distributed systems overhead.

\`\`\`mermaid
flowchart TD
    Start[Starting a New Project or Enterprise Platform] --> Check1{Are domain boundaries fully mature & stable?}
    Check1 -- No --> ChooseMM[Choose Modular Monolith]
    Check1 -- Yes --> Check2{Do individual features have wildly differing scale/tech requirements?}
    Check2 -- No --> ChooseMM
    Check2 -- Yes --> Check3{Does team size exceed 30+ autonomous engineers?}
    Check3 -- No --> ChooseMM
    Check3 -- Yes --> ChooseMicroservices[Extract Microservices via Strangler Fig]
\`\`\`

#### 1. Why Microservices Often Fail (The Distributed Monolith Trap):
Jumping prematurely into microservices introduces:
- **Network Latency & Serializing Overhead:** Replacing fast in-process memory calls ($<1\\;\\mu s$) with HTTP/gRPC network hops ($10-50\\text{ ms}$).
- **Distributed Transaction Nightmares:** Inability to run ACID transactions across services (requiring Sagas, Outbox, 2PC, and compensating actions).
- **Deployment & Observability Toll:** Orchestrating 20+ CI/CD pipelines, Kubernetes deployments, service meshes (Istio), distributed tracing (OpenTelemetry), and centralized logging.

#### 2. The Core Advantages of a Modular Monolith:
- **Single Deployable Unit:** Zero network overhead between modules; one simple CI/CD pipeline and deployment artifact.
- **Strict Domain Encapsulation:** Modules own their own C# \`internal\` boundaries and database schemas (\`orders.\`, \`users.\`, \`billing.\`).
- **In-Process Performance:** Asynchronous events dispatch via memory queues (\`MediatR\` / in-process event bus) at nanosecond speeds.
- **Future Microservices Ready:** Because data and code boundaries are already strictly isolated, extracting a high-load module (e.g. \`PaymentModule\`) into an independent microservice takes hours instead of a painful multi-month rewrite.`,
    answerContent_fa: `### راهنمای تصمیم‌گیری معماری: Modular Monolith در برابر Microservices

الگوی **Modular Monolith** تمیزی معماری دامنه‌محور (DDD) و تفکیک ماژول‌ها را بدون تحمیل پیچیدگی‌های سنگین سیستم‌های توزیع‌شده فراهم می‌کند.

#### ۱. خطرات حرکت زودهنگام به سمت میکروسرویس (Distributed Monolith):
- **تأخیر شبکه و سریالایز داده‌ها:** تبدیل فراخوانی‌های سریع در حافظه رم (کمتر از ۱ میکروثانیه) به درخواست‌های شبکه HTTP/gRPC با تاخیر ۱۰ تا ۵۰ میلی‌ثانیه.
- **پیچیدگی تراکنش‌های توزیع‌شده:** از دست رفتن تراکنش‌های ACID دیتابیس و اجبار به پیاده‌سازی الگوهای پیچیده Saga، Outbox و تراکنش‌های جبران‌کننده.
- **سربار عملیاتی سنگین:** مدیریت ده‌ها پایپ‌لاین CI/CD، کلاسترهای کوبرنتیز، سرویس مش و پایشگری توزیع‌شده.

#### ۲. مزایای محوری Modular Monolith:
- **استقرار تک‌واحدی (Single Unit):** یک پایپ‌لاین ساده بیلد و دیپلوی بدون چالش‌های شبکه بین ماژول‌ها.
- **ایزولاسیون سخت‌گیرانه داده‌ها:** هر ماژول اسکیمای دیتابیس و مدل‌های دامین اختصاصی خود را دارد.
- **آمادگی کامل برای تبدیل به میکروسرویس:** به دلیل عدم وجود وابستگی مستقیم یا Foreign Key بین ماژول‌ها، در صورت نیاز به اسکیل مستقل در آینده، استخراج هر ماژول به یک میکروسرویس جداگانه در کمترین زمان ممکن انجام می‌شود.`,
  },
  {
    id: "dotnet-senior-q268",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "How do you coordinate two development teams working on the same codebase without frequent merge conflicts?",
    questionTitle_fa: "نحوه ادغام کدهای دو تیم توسعه مختلف روی یک پروژه بدون ایجاد Conflictهای مکرر؟",
    answerContent: `### Multi-Team Codebase Coordination

1. **Modular Architecture:** Isolate team code into separate vertical projects/folders.
2. **Short-lived Feature Branches:** Merge back to \`develop\` daily.
3. **Trunk-Based Development & Feature Flags** to separate code deployment from feature release.`,
    answerContent_fa: `### هماهنگی چند تیم روی یک مخزن کد

جداسازی معماری ماژولار در پروژه‌های مستقل، برنچ‌های کوتاه با ادغام روزانه (Trunk-Based) و استفاده از **Feature Flags** جهت جداسازی زمان دیپلوی از زمان انتشار فیچر.`,
  },
  {
    id: "dotnet-senior-q269",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "senior",
    questionTitle: "How do you implement Encryption at Rest for sensitive financial and banking data?",
    questionTitle_fa: "رمزنگاری داده‌ها در سطح دیتابیس (Encryption at Rest) برای اطلاعات حساس بانکی کاربران چگونه است؟",
    answerContent: `### Encryption at Rest

1. **Transparent Data Encryption (TDE):** Encrypts database files, logs, and backups at the storage layer.
2. **Column-level Encryption (Always Encrypted in SQL Server):** Sensitive fields (e.g. Credit Card numbers) are encrypted on the client side before reaching the database, so even DBAs cannot view plaintext values.`,
    answerContent_fa: `### رمزنگاری داده‌های حساس بانکی (Encryption at Rest)

استفاده از **TDE** در سطح فایل‌های دیتابیس و قابلیت **Always Encrypted** برای فیلدهای فوق‌حساس که داده قبل از خروج از برنامه دات‌نت رمزنگاری شده و حتی ادمین دیتابیس نیز متن ساده آن را نمی‌بیند.`,
  },
  {
    id: "dotnet-senior-q270",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "senior",
    questionTitle: "How do you manage and rotate Certificates and Security Keys in a distributed system?",
    questionTitle_fa: "نحوه مدیریت و چرخش (Rotation) Certificateها و کلیدهای امنیتی چیست؟",
    answerContent: `### Automated Certificate & Key Rotation

- Use **Let's Encrypt / Cert-Manager** in Kubernetes for automated TLS renewal.
- Store JWT signing keys in a Key Vault supporting multiple active keys with **Key ID (\`kid\`)** versioning, allowing seamless rotation without logging out active users.`,
    answerContent_fa: `### چرخش خودکار گواهی‌ها و کلیدهای امنیتی

استفاده از \`Cert-Manager\` در کوبرنتیز برای تمدید خودکار TLS و پشتیبانی از چند کلید فعال با شناسه \`kid\` در JWT تا چرخش کلید باعث خروج اجباری کاربران فعال نشود.`,
  },
  {
    id: "dotnet-senior-q271",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "senior",
    questionTitle: "What is the role of Penetration Testing in the Software Development Life Cycle?",
    questionTitle_fa: "چه جایگاهی برای Penetration Testing (تست نفوذ) در چرخه توسعه قائل هستید؟",
    answerContent: `### Penetration Testing in SDLC

Simulates real-world cyberattacks on staging/production environments to identify vulnerabilities (authorization bypasses, logic flaws, injection vulnerabilities) before attackers exploit them.`,
    answerContent_fa: `### اهمیت تست نفوذ (Penetration Testing)

شبیه‌سازی حملات واقعی هکرها روی سامانه‌ها قبل از انتشار برای شناسایی حفره‌های امنیتی پیچیده و خطاهای منطقی احراز هویت.`,
  },
  {
    id: "dotnet-senior-q272",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "How do you evaluate new technologies and convince management to adopt them?",
    questionTitle_fa: "چگونه تکنولوژی‌های جدید را ارزیابی کرده و مدیریت را برای پذیرش آنها متقاعد می‌کنی؟",
    answerContent: `### Technology Evaluation & Adoption

1. Build a timeboxed **Proof of Concept (PoC)** with concrete benchmarks.
2. Present a business case detailing the **Return on Investment (ROI)**, cost reduction, or developer productivity improvements.
3. Plan an incremental rollout strategy with a clear rollback plan.`,
    answerContent_fa: `### ارزیابی و پیشنهاد تکنولوژی جدید به مدیریت

ساخت نمونه اولیه (PoC) با بنچمارک‌های عددی، ارائه گزارش توجیهی اقتصادی و افزایش سرعت توسعه به مدیریت، و تدوین نقشه استقرار تدریجی با امکان بازگشت (Rollback).`,
  },
  {
    id: "dotnet-senior-q273",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "How do you cultivate a Clean Code and Unit Testing culture in a team not accustomed to it?",
    questionTitle_fa: "راهکار عملی شما برای جا انداختن فرهنگ Clean Code و Unit Test در تیم چیست؟",
    answerContent: `### Cultivating Clean Code & Testing Culture

1. **Lead by Example:** Write pristine tests on your own pull requests.
2. **Automate Quality Gates:** Integrate SonarQube and minimum coverage requirements in CI.
3. **Conduct Lunch-and-Learn workshops** showcasing how unit tests prevent regression bugs.`,
    answerContent_fa: `### نهادینه‌سازی فرهنگ تست‌نویسی و کد تمیز

پیشگام بودن در نوشتن تست‌های باکیفیت، اتوماتیک کردن بررسی کیفیت در پایپ‌لاین CI و برگزاری جلسات اشتراک دانش و آموزش نوشتن تست‌های ماژولار.`,
  },
  {
    id: "dotnet-senior-q274",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "What is your role as a Senior Engineer in mentoring Mid-Level developers?",
    questionTitle_fa: "نقش شما به عنوان یک Senior Engineer در ارتقاء سطح دولوپرهای Mid-level چیست؟",
    answerContent: `### Mentoring Mid-Level Engineers

- Help them transition from writing working code to **thinking architecturally about trade-offs, scalability, and maintainability**.
- Involve them in high-level system design sessions and RFC document drafting.`,
    answerContent_fa: `### ارتقای سطح دولوپرهای میدل‌ول

کمک به آنها برای عبور از صرفاً کدنویسی و رسیدن به تفکر معماری، بررسی Trade-offها، دید کلان به پرفورمنس و مشارکت دادن آنها در جلسات طراحی سیستم.`,
  },
  {
    id: "dotnet-senior-q275",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "How do you manage communication challenges between Backend and Product teams?",
    questionTitle_fa: "چگونه چالش‌های ارتباطی بین تیم Backend و تیم Product را مدیریت می‌کنی؟",
    answerContent: `### Bridging Backend & Product Teams

- Speak in terms of **business value and user impact** rather than low-level technical jargon.
- Adopt a shared **Ubiquitous Language (DDD)** so both product managers and developers use identical terms for business concepts.`,
    answerContent_fa: `### تعامل موثر بین تیم فنی و تیم محصول

صحبت بر مبنای ارزش‌های بیزینس و اثر روی کاربر به جای اصطلاحات پیچیده فنی، و ایجاد زبان مشترک (Ubiquitous Language) بین تیم محصول و دولوپرها.`,
  },
  {
    id: "dotnet-senior-q276",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "How do you handle transient network blips when a user clicks the final payment button?",
    questionTitle_fa: "نحوه هندل کردن خطاهای لحظه‌ای شبکه در ثانیه‌ای که کاربر روی دکمه پرداخت کلیک می‌کند؟",
    answerContent: `### Handling Payment Network Glitches

1. **Client-Side:** Disable button immediately and lock state with an \`Idempotency-Key\`.
2. **Re-query API:** If a network timeout occurs, the client queries transaction status using the idempotency key before attempting any retry.`,
    answerContent_fa: `### مدیریت قطعی لحظه‌ای در زمان پرداخت

غیرفعال کردن آنی دکمه پرداخت و ارسال کلید یکتای Idempotency، و در صورت بروز تایم‌اوت شبکه، استعلام وضعیت تراکنش با همان کلید قبل از هرگونه تلاش مجدد.`,
  },
  {
    id: "dotnet-senior-q277",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "How do you design a reliable multi-channel Notification service with priority queues and retries?",
    questionTitle_fa: "طراحی سیستم Notification با قابلیت اطمینان بالا، Retry Mechanism و صف‌بندی اولویت‌دار.",
    answerContent: `### High-Reliability Notification Engine

1. **Priority Queues:** Separate high-priority OTP/Payment SMS from low-priority marketing messages.
2. **Provider Failover:** If primary SMS provider fails, automatically switch to secondary fallback provider via Polly.`,
    answerContent_fa: `### طراحی سیستم اعلان‌های پیشرفته

تفکیک صف‌های با اولویت بالا (کدهای ورود OTP و پیامک تراکنش) از پیام‌های تبلیغاتی، و سوئیچ خودکار به ارائه‌دهنده دوم پیامک در صورت قطعی درگاه اول.`,
  },
  {
    id: "dotnet-senior-q278",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you use the Anti-Corruption Layer (ACL) pattern to integrate with legacy insurance APIs?",
    questionTitle_fa: "در پلتفرمی مثل ازکی، چگونه از الگوی Anti-Corruption Layer برای ادغام با APIهای Legacy استفاده می‌کنی؟",
    answerContent: `### Anti-Corruption Layer (ACL)

An ACL acts as an intermediary translation layer that converts messy, legacy third-party data models into clean, strongly-typed internal domain models, preventing external bad designs from polluting your core domain.`,
    answerContent_fa: `### الگوی لایه ضدفساد (Anti-Corruption Layer)

لایه‌ای واسط برای ترجمه و پاک‌سازی داده‌های ساختارنیافته و قدیمی وب‌سرویس‌های شرکت‌های بیمه به مدل‌های تمیز و استاندارد دامین سیستم شما، تا هسته بیزینس آلوده نشود.`,
  },
  {
    id: "dotnet-senior-q279",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "What is the Bulkhead Pattern and how does it prevent cascading failures in distributed systems?",
    questionTitle_fa: "الگوی Bulkhead در معماری توزیع‌شده چیست و چگونه از Cascade Failure جلوگیری می‌کند؟",
    answerContent: `### Bulkhead Pattern

Inspired by ship hull partitions: isolates elements of an application into pools so that if one fails, the others continue functioning (e.g. dedicated thread pools for payment vs reporting).`,
    answerContent_fa: `### الگوی Bulkhead

مشابه دیواره‌های ضدآب کشتی، منابع پردازشی بخش‌های مختلف سیستم (مانند استخر تردهای پرداخت در برابر استخر تردهای استعلام) را کاملاً ایزوله می‌کند تا خرابی یک بخش کل سرور را از کار نیندازد.`,
  },
  {
    id: "dotnet-senior-q280",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "How do you debug production Linux container crash dumps in .NET?",
    questionTitle_fa: "دیباگ کردن فایل‌های Memory Dump کانتینر دات‌نت روی لینوکس در زمان کرش کردن اپلیکیشن؟",
    answerContent: `### Debugging Linux Crash Dumps

Use \`dotnet-dump analyze\` or open core dumps in **Visual Studio / Rider / LLDB** with matching symbols (PDBs) and .NET SOS plugins to inspect call stacks and exception roots.`,
    answerContent_fa: `### دیباگ Crash Dumpهای لینوکس

بارگذاری فایل Dump در \`dotnet-dump\` یا Visual Studio به همراه فایل‌های PDB مربوطه جهت مشاهده دقیق وضعیت Call Stack و استخراج علت کرش ناگهانی پروسس.`,
  },
  {
    id: "dotnet-senior-q281",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What are Linux Namespaces and cgroups and how do they underpin Docker containers?",
    questionTitle_fa: "مفاهیم Linux Namespaces و cgroups (به عنوان پایه‌های داکر) چیست؟",
    answerContent: `### Namespaces & cgroups in Docker

- **Namespaces:** Provide **isolation** (Process IDs, Mount points, Network interfaces, User IDs).
- **cgroups (Control Groups):** Enforce **resource limits** (CPU quota, Memory limits, I/O bandwidth).`,
    answerContent_fa: `### پایه‌های تکنولوژی داکر در لینوکس

- **Namespaces:** ایزولاسیون پردازش‌ها، شبکه و فایل‌سیستم کانتینر از سیستم میزبان.
- **cgroups:** تعیین سقف و محدودسازی مصرف منابع سخت‌افزاری (مانند حداکثر ۲ گیگابایت رم و ۱ هسته CPU).`,
  },
  {
    id: "dotnet-senior-q282",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "How do you manage high-volume logs: Log Rotation and Archiving strategies in ELK?",
    questionTitle_fa: "مدیریت لاگ‌های با حجم بسیار بالا؛ استراتژی Log Rotation و Archiving در ELK.",
    answerContent: `### High-Volume Log Lifecycle (ILM)

Use Elasticsearch **Index Lifecycle Management (ILM)**:
- **Hot Phase:** High-performance SSDs for active ingestion and recent search (7 days).
- **Warm Phase:** Read-only storage for queries.
- **Cold / Delete Phase:** Roll over to cheap object storage (S3) after 30 days and delete older indexes.`,
    answerContent_fa: `### مدیریت چرخه حیات لاگ‌ها با ILM

تقسیم ایندکس‌ها به فازهای Hot (ذخیره روی SSD برای ۷ روز اول)، فاز Warm (فقط-خواندنی) و فاز Cold/Archive برای انتقال لاگ‌های قدیمی به استوریج ارزان‌قیمت و حذف لاگ‌های مازاد.`,
  },
  {
    id: "dotnet-senior-q283",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "How do you implement Retry policies with Exponential Backoff and Jitter?",
    questionTitle_fa: "الگوی Retry را چگونه با تکنیک‌های Exponential Backoff و Jitter پیاده‌سازی می‌کنی؟",
    answerContent: `### Exponential Backoff with Jitter

- **Exponential Backoff:** Progressively increases delay between retries ($2s, 4s, 8s, 16s$).
- **Jitter (Randomization):** Adds random noise to the delay to prevent all failing clients from retrying simultaneously and creating a **thundering herd spike**.`,
    answerContent_fa: `### اهمیت اضافه کردن Jitter به الگوی Retry

افزودن یک تاخیر تصادفی (Jitter) به زمان‌های تصاعدی تلاش مجدد، مانع از هجوم همزمان هزاران کلاینت به سرور در یک ثانیه خاص و دان شدن مجدد آن می‌شود.`,
  },
  {
    id: "dotnet-senior-q284",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "senior",
    questionTitle: "How do you manage distributed sessions across load-balanced application instances?",
    questionTitle_fa: "مدیریت Sessionها در یک کلاستر از سرویس‌های لودبالانس شده چگونه است؟",
    answerContent: `### Distributed Session Management

Store session state in an external high-speed store (**Redis**) using \`AddStackExchangeRedisCache\` so any instance in the cluster can access the session data seamlessly.`,
    answerContent_fa: `### مدیریت Session در کلاستر لودبالانس‌شده

ذخیره‌سازی اطلاعات نشست‌ها در پایگاه داده اشتراکی **Redis** تا با هدایت کاربر به هر سروری در کلاستر، اطلاعات جلسه در دسترس باشد.`,
  },
  {
    id: "dotnet-senior-q285",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    questionTitle: "What is a Distributed Lock and how is it implemented using Redis (Redlock)?",
    questionTitle_fa: "مفهوم Distributed Lock و نحوه پیاده‌سازی ایمن آن با استفاده از Redis (الگوی Redlock) چیست؟",
    answerContent: `### Distributed Locks with Redlock

Coordinates mutually exclusive access to shared resources across multiple microservice instances.
- Acquired via atomic \`SET resource_key random_token NX PX 5000\`.
- Released via Lua script ensuring only the token holder can release the lock.`,
    answerContent_fa: `### مفهوم Distributed Lock و الگوی Redlock

قفل‌گذاری توزیع‌شده بین چندین سرور مجزا با استفاده از دستور اتمیک \`SET NX PX\` در ردیس و آزادسازی با اسکریپت Lua برای اطمینان از دسترسی انحصاری به یک منبع مشترک.`,
  },
  {
    id: "dotnet-senior-q286",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "How do you implement Custom Business Metrics in OpenTelemetry?",
    questionTitle_fa: "در پیاده‌سازی مانیتورینگ بیزینسی، از چه Custom Metricهایی در OpenTelemetry استفاده می‌کنی؟",
    answerContent: `### Custom Business Telemetry

\`\`\`csharp
private static readonly Meter s_meter = new("Azki.InsuranceSales");
private static readonly Counter<int> s_salesCounter = 
    s_meter.CreateCounter<int>("insurance_policies_sold_total");

// In business service:
s_salesCounter.Add(1, new KeyValuePair<string, object?>("insurance_type", "ThirdPartyAuto"));
\`\`\``,
    answerContent_fa: `### تعریف متریک‌های اختصاصی بیزینس با OpenTelemetry

استفاده از کلاس \`Meter\` و \`Counter\` در دات‌نت برای ثبت متریک‌های لحظه‌ای بیزینس (مانند تعداد بیمه‌نامه‌های صادرشده در دقیقه به تفکیک نوع بیمه) و ارسال به داشبوردهای Prometheus/Grafana.`,
  },
  {
    id: "dotnet-senior-q287",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "senior",
    questionTitle: "How do you monitor and manage NuGet package security vulnerabilities?",
    questionTitle_fa: "نحوه رصد و مدیریت آسیب‌پذیری‌های امنیتی در پکیج‌های Nuget مورد استفاده پروژه.",
    answerContent: `### NuGet Security Governance

1. Enable \`dotnet list package --vulnerable\` checks in CI pipelines.
2. Use automated tools like **Dependabot** and **Snyk** to scan and submit automated security bump PRs.`,
    answerContent_fa: `### پایش آسیب‌پذیری‌های پکیج‌های NuGet

استفاده از دستور \`dotnet list package --vulnerable\` در پایپ‌لاین CI و ابزارهایی مانند Dependabot و Snyk برای شناسایی و به‌روزرسانی خودکار پکیج‌های دارای باگ امنیتی.`,
  },
  {
    id: "dotnet-senior-q288",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    questionTitle: "When is Serverless Architecture suitable in FinTech / InsurTech ecosystems?",
    questionTitle_fa: "مفهوم Serverless Architecture چیست و چه کاربردهایی در فین‌تک/اینشورتک دارد؟",
    answerContent: `### Serverless in FinTech

Ideal for event-driven, sporadic, and asynchronous workloads (e.g. PDF policy generation, nightly bank statement downloads, webhook delivery) while keeping high-throughput core transaction processing in dedicated containers.`,
    answerContent_fa: `### کاربرد معماری Serverless در فین‌تک

بسیار مناسب برای پردازش‌های مقطعی و رویدادمحور مانند تولید فایل‌های PDF بیمه‌نامه، ارسال وب‌هوک‌ها و پردازش فایل‌های مالی شبانه.`,
  },
  {
    id: "dotnet-senior-q289",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "senior",
    questionTitle: "How do you update dynamic business configurations (e.g. discount rates) without restarting services?",
    questionTitle_fa: "چگونه کانفیگ‌های داینامیک بیزینسی را بدون نیاز به Restart سرویس‌ها تغییر می‌دهید؟",
    answerContent: `### Dynamic Configuration Reloading

Use **\`IOptionsMonitor<T>\`** combined with externalized configuration providers (Redis Configuration Provider / Azure App Configuration) to propagate changes in real time without service restarts.`,
    answerContent_fa: `### تغییر زنده تنظیمات بدون ریستارت سرور

استفاده از اینترفیس **\`IOptionsMonitor<T>\`** در دات‌نت متصل به یک منبع مرکزی مانند Redis تا تغییرات تخفیف‌ها یا سقف تراکنش‌ها فوراً در حافظه برنامه اعمال شوند.`,
  },
  {
    id: "dotnet-senior-q290",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "What are Feature Flags and how do you use them safely in production?",
    questionTitle_fa: "تجربه استفاده از Feature Flags برای خاموش/روشن کردن فیچرها در پروداکشن؟",
    answerContent: `### Feature Flags in Production

Use Microsoft.FeatureManagement or LaunchDarkly:
- Enables **Trunk-Based Development** (merge incomplete code safely behind a flag).
- Enables instant rollback of problematic features without redeploying code.`,
    answerContent_fa: `### استفاده از Feature Flags

ابزاری برای فعال یا غیرفعال‌سازی آنی فیچرهای جدید در پروداکشن که امکان انتشار تدریجی و غیرفعال‌سازی سریع در صورت بروز باگ را بدون نیاز به دیپلوی مجدد فراهم می‌کند.`,
  },
  {
    id: "dotnet-senior-q291",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "How do you ensure your C# code is completely thread-safe in concurrent environments?",
    questionTitle_fa: "چگونه در محیط Concurrent اطمینان حاصل می‌کنی کدی که نوشتی کاملاً Thread-safe است؟",
    answerContent: `### Ensuring Thread Safety in C#

1. Favor **immutability** (readonly structs, records).
2. Use thread-safe collections from \`System.Collections.Concurrent\` (\`ConcurrentDictionary\`).
3. Avoid mutable static state.
4. Protect shared mutable state using \`SemaphoreSlim\` or \`Interlocked\` operations.`,
    answerContent_fa: `### تضمین Thread-Safety در کدهای همزمان

استفاده از اشیای تغییرناپذیر (Immutable)، استفاده از کالکشن‌های \`ConcurrentDictionary\`، پرهیز از متغیرهای استاتیک تغییرپذیر و استفاده از متدهای اتمیک کلاس \`Interlocked\`.`,
  },
  {
    id: "dotnet-senior-q292",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "senior",
    questionTitle: "What techniques do you use to minimize Docker image sizes (.NET Chiseled / Alpine)?",
    questionTitle_fa: "تکنیک‌های کاهش حجم ایمیج‌های داکر (مثل Alpine یا .NET Chiseled)؟",
    answerContent: `### Minimizing .NET Docker Images

- **.NET Chiseled Ubuntu Images:** Strips package managers, shells, and root users, yielding $<50\\text{MB}$ images with zero known CVE vulnerabilities.
- **Multi-stage builds & trimming** unused assemblies.`,
    answerContent_fa: `### بهینه‌سازی حجم Image با Chiseled

استفاده از ایمیج‌های فوق‌العاده سبک و امن **.NET Chiseled** که شل و پکیج منیجر لینوکس را حذف کرده و حجم ایمیج را به زیر ۵۰ مگابایت با امنیت فوق‌العاده بالا می‌رسانند.`,
  },
  {
    id: "dotnet-senior-q293",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "What is the difference between Channel<T> and BufferBlock<T> in TPL Dataflow?",
    questionTitle_fa: "تفاوت Channel<T> با BufferBlock<T> در TPL Dataflow چیست؟",
    answerContent: `### Channel<T> vs. TPL BufferBlock<T>

- **\`Channel<T>\`:** Modern, lightweight, zero-allocation async queue for pure producer-consumer scenarios.
- **\`BufferBlock<T>\` (TPL Dataflow):** Part of a larger complex pipeline framework supporting mesh-like network block linking, batching, and transformations.`,
    answerContent_fa: `### تفاوت Channel<T> و BufferBlock<T>

- **\`Channel<T>\`**: ساختاری مدرن و با کمترین Allocation مخصوص سناریوهای Producer-Consumer ساده و پرسرعت.
- **\`BufferBlock<T>\`**: بخشی از فریم‌ورک قدیمی‌تر و سنگین‌تر TPL Dataflow برای پایپ‌لاین‌های مشبک و پیچیده.`,
  },
  {
    id: "dotnet-senior-q294",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "senior",
    questionTitle: "How does Rate Limiting at the API Gateway differ from Application-level Rate Limiting?",
    questionTitle_fa: "مفهوم Rate Limiting در سطح API Gateway چه تفاوتی با سطح Application دارد؟",
    answerContent: `### Gateway vs. Application Rate Limiting

- **API Gateway Rate Limiting:** Protects network bandwidth and entire backend infrastructure from massive volume volumetric attacks at the edge.
- **Application-level Rate Limiting:** Enforces granular business logic limits (e.g. max 3 OTP requests per phone number per hour).`,
    answerContent_fa: `### تفاوت Rate Limiting در Gateway و Application

- **سطح Gateway:** محافظت از کل سرورها در برابر حملات DDoS در لبه شبکه.
- **سطح Application:** اعمال قوانین دقیق بیزینسی (مانند حداکثر ۳ بار درخواست ارسال کد پیامکی در ساعت برای یک شماره موبایل).`,
  },
  {
    id: "dotnet-senior-q295",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "How do you accelerate the onboarding process for a new developer joining your team?",
    questionTitle_fa: "چگونه فرآیند Onboarding را برای یک دولوپر جونیور که تازه به تیم می‌پیوندد تسریع می‌کنی؟",
    answerContent: `### Fast Developer Onboarding

1. **One-Command Setup:** Provide a \`docker-compose.yml\` spinning up databases, queues, and mocks instantly.
2. **Onboarding Documentation & ADRs:** Clear architecture sitemap.
3. **Buddy System & First-Week Small PR:** Pair with an onboarding buddy to ship a small bug fix on Day 2.`,
    answerContent_fa: `### تسریع آنبوردینگ نیروهای جدید

آماده‌سازی محیط با یک دستور \`docker-compose up\`، مستندات شفاف معماری، تعیین یک هم‌تیمی راهنما (Buddy) و انتشار اولین پول ریکوئست در روزهای ابتدایی برای افزایش اعتمادبه‌نفس.`,
  },
  {
    id: "dotnet-senior-q296",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "What is the role of a Senior Engineer in driving overall business success beyond writing code?",
    questionTitle_fa: "نقش یک Senior Engineer در موفقیت یک محصول فراتر از نوشتن کد چیست؟",
    answerContent: `### Senior Engineering Leadership

- Aligning technical architecture with company strategic goals.
- Unblocking teammates and multiplying team productivity.
- Anticipating technical bottlenecks and risks before they hit production.`,
    answerContent_fa: `### نقش مهندس ارشد فراتر از کدنویسی

هم‌راستاسازی تصمیمات فنی با اهداف تجاری شرکت، رفع موانع فنی هم‌تیمی‌ها، ارتقای بازدهی تیم و پیش‌بینی ریسک‌های معماری قبل از بروز بحران در پروداکشن.`,
  },
  {
    id: "dotnet-senior-q297",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "How do you balance focus between feature development, meetings, and production bugs during busy workdays?",
    questionTitle_fa: "چگونه در طول روز کاری، تمرکز خود را بین کدنویسی، جلسات و رفع باگ‌های پروداکشن مدیریت می‌کنی؟",
    answerContent: `### Engineering Time Management

- **Time-blocking "Deep Work" hours** for complex architecture and coding.
- Batching meetings into specific days/time windows.
- Triage bugs by severity: only true P0/P1 incidents interrupt deep work.`,
    answerContent_fa: `### مدیریت زمان و تمرکز کاری

بلوک‌بندی زمان‌های کاری عمیق (Deep Work) برای کدنویسی، تجمیع جلسات در ساعات مشخص و اولویت‌بندی باگ‌ها (صرفاً خطاهای بحرانی P0 اجازه قطع کار عمیق را دارند).`,
  },
  {
    id: "dotnet-senior-q298",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "What was your biggest architectural mistake and what lessons did you learn from it?",
    questionTitle_fa: "بزرگترین اشتباه معماری که تا به حال انجام داده‌اید چه بوده و از آن چه درسی گرفته‌اید؟",
    answerContent: `### Lessons from Architectural Mistakes

Example: Over-engineering microservices prematurely before understanding domain boundaries, leading to distributed transaction overhead.
**Lesson Learned:** Start with a clean Modular Monolith, understand domain invariants thoroughly, and extract microservices only when independent scaling or organizational boundaries demand it.`,
    answerContent_fa: `### درس‌آموخته‌های اشتباهات معماری

درس اصلی پرهیز از پیچیده‌سازی زودهنگام (Over-engineering) و عدم خرد کردن زودهنگام سرویس‌ها به میکروسرویس قبل از شناخت کامل دامین است؛ شروع با Modular Monolith تمیز و استخراج میکروسرویس در صورت نیاز واقعی.`,
  },
  {
    id: "dotnet-senior-q299",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    questionTitle: "What are the primary technical bottlenecks in high-volume Insurance Comparison platforms (like Azki)?",
    questionTitle_fa: "بزرگترین گلوگاه‌های فنی در پلتفرم‌های مقایسه‌ای مثل ازکی کجاست؟",
    answerContent: `### Bottlenecks in Insurance Aggregators

1. **Slow/Unreliable Third-party Insurer APIs:** Calling 20 insurance web services concurrently causes long wait times. Solved by aggressive caching, timeouts, and fallback pricing models.
2. **Dynamic Pricing Matrix Complexity:** Calculating discounts and coverages across hundreds of rules. Solved by in-memory Rule Engines.`,
    answerContent_fa: `### بزرگترین گلوگاه‌های فنی سامانه‌های مقایسه بیمه

کند بودن و ناپایداری وب‌سرویس‌های شرکت‌های بیمه و پیچیدگی بالای ماتریس فرمول‌های قیمت‌گذاری، که با کشینگ لایه‌ای، موتورهای ارزیابی قانون (Rule Engines) درون حافظه و تایم‌اوت‌های سخت‌گیرانه مدیریت می‌شود.`,
  },
  {
    id: "dotnet-senior-q300",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "senior",
    questionTitle: "What would be your focus during your first 30 days as a Senior Engineer at Azki?",
    questionTitle_fa: "در صورت استخدام در موقعیت Senior در ازکی، در ۳۰ روز اول کاری روی چه بخش‌هایی متمرکز خواهی شد؟",
    answerContent: `### First 30 Days Action Plan

- **Days 1-10 (Understand & Onboard):** Understand the domain, read codebase and ADRs, talk with Product Managers and engineers, deploy a small improvement to production.
- **Days 11-20 (Analyze & Observe):** Inspect telemetry (OpenTelemetry/SigNoz), identify slow queries and bottleneck hotspots.
- **Days 21-30 (Contribute & Propose):** Take ownership of core tasks, propose targeted architectural optimizations with clear benchmarks, and mentor junior teammates.`,
    answerContent_fa: `### برنامه کاری ۳۰ روز اول در موقعیت Senior

- **روزهای ۱ تا ۱۰:** درک عمیق ساختار بیزینس و دامین، خواندن داکیومنت‌های معماری و ارسال اولین تغییرات کوچک به پروداکشن.
- **روزهای ۱۱ تا ۲۰:** تحلیل لاگ‌ها و متریک‌های مانیتورینگ جهت شناسایی گلوگاه‌های پرفورمنس و کوئری‌های کند.
- **روزهای ۲۱ تا ۳۰:** پذیرش مالکیت تسک‌های کلیدی، ارائه پیشنهادات بهینه‌سازی با بنچمارک دقیق و کمک به ارتقای هم‌تیمی‌ها.`,
  },
  {
    id: "dotnet-senior-q301",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "How do LINQ Providers (IQueryable / IQueryProvider) parse Expression Trees into SQL queries, and why do translation failures occur?",
    questionTitle_fa: "موتورهای LINQ Provider (IQueryable و IQueryProvider) چگونه درخت عبارات را تجزیه و به کوئری‌های بومی SQL تبدیل می‌کنند و علت خطاهای ارزیابی سمت کلاینت چیست؟",
    answerContent: `### The LINQ Provider & Expression Translation Architecture

\`\`\`
IQueryable<T> -> Expression Tree (AST) -> IQueryProvider.Execute()
                      |
        RelationalQueryTranslationProcessor
                      |
    ExpressionVisitor (Method & Member Mapping)
                      |
         SQL Query AST -> SqlServerQuerySqlGenerator -> Native SQL
\`\`\`

#### Step-by-Step Translation Pipeline:
1. **Packaging:** \`IQueryable<T>\` captures the LINQ method calls as an in-memory Expression Tree without executing them.
2. **Provider Dispatch:** When materialization is requested (\`.ToList()\`, \`.FirstOrDefaultAsync()\`), the Expression Tree is passed to \`IQueryProvider.Execute<T>()\` (\`EntityQueryProvider\`).
3. **AST Walking via \`ExpressionVisitor\`:** EF Core's \`RelationalQueryableMethodTranslatingExpressionVisitor\` recursively traverses the AST nodes, translating:
   - \`BinaryExpression (AndAlso / OrElse)\` $\to$ \`AND / OR\`
   - \`MemberExpression (user.IsActive)\` $\to$ \`[u].[IsActive]\`
   - \`MethodCallExpression (string.Contains)\` $\to$ \`LIKE '%pattern%'\` (or \`CHARINDEX\` in SQL Server).
4. **Parameterization:** Constant values are extracted into ADO.NET \`DbParameter\` instances (\`@__p_0\`) to prevent SQL injection and enable SQL Server plan caching.

#### Why Translation Failures Occur (Client vs. Server Evaluation):
In EF Core 3.0+, if an Expression contains custom C# methods or unmapped .NET APIs (e.g. \`u => MyCustomHash(u.SSN) == "xyz"\`), EF Core **refuses silent client evaluation** and throws **\`InvalidOperationException\`** (The LINQ expression could not be translated). To map custom logic, use **\`EF.Functions\`**, user-defined DB functions (\`HasDbFunction\`), or execute in memory after \`.AsEnumerable()\`.`,
    answerContent_fa: `### ساختار موتور LINQ Provider و ترجمه Expression به SQL

#### فرآیند گام‌به‌گام ترجمه:
۱. عبارت‌های LINQ بدون اجرا در یک درخت عبارات انتزاعی (\`Expression Tree\`) درون شیء \`IQueryable\` کپسوله می‌شوند.
۲. با فراخوانی متدهای متریالایز (مانند \`ToListAsync\`)، درخت به \`IQueryProvider\` تحویل داده می‌شود.
۳. کلاس‌های \`ExpressionVisitor\` درون EF Core گره‌های درخت را پیمایش کرده و معادل‌های SQL برای نام ستون‌ها، مقادیر ثابت پارامتری (\`@__p_0\`) و عملگرهای شرطی تولید می‌کنند.
۴. دستور نهایی SQL توسط ژنراتور SQL ساخته و از طریق ADO.NET به دیتابیس ارسال می‌گردد.

#### چرایی خطای Translation Failure:
از نسخه EF Core 3.0 به بعد، اگر متدی در C# استفاده شود که معادل SQL نداشته باشد (مانند توابع کاستوم C# یا متدهای Regex بدون مپینگ)، EF Core ارزیابی خاموش سمت کلاینت را متوقف کرده و خطای **\`InvalidOperationException\`** می‌دهد تا از واکشی کل رکوردهای جدول به رم برنامه جلوگیری شود.`,
  },
  {
    id: "dotnet-senior-q302",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "How do you dynamically construct and compile Expression Trees at runtime for advanced multi-tenant filtering and dynamic sorting?",
    questionTitle_fa: "چگونه می‌توان با استفاده از کلاس‌های Expression در زمان اجرا کوئری‌ها و فیلترهای کامپایل‌شده پویا برای گریدها و سیستم‌های چندمستاجری (Multi-Tenancy) ساخت؟",
    answerContent: `### Dynamic Expression Tree Generation

Dynamic Expression Trees allow building type-safe, parameterized queries at runtime based on dynamic search filters, sort criteria, or multi-tenant rules without string concatenation or SQL injection vulnerabilities.

\`\`\`csharp
public static class DynamicQueryBuilder {
    // Builds: (T entity) => entity.PropertyName == propertyValue
    public static Expression<Func<T, bool>> BuildEqualsPredicate<T>(string propertyName, object propertyValue) {
        // 1. Parameter: 'entity'
        var parameter = Expression.Parameter(typeof(T), "entity");

        // 2. Member Access: 'entity.PropertyName'
        var property = Expression.PropertyOrField(parameter, propertyName);

        // 3. Constant: 'propertyValue' (type converted to match property)
        var constant = Expression.Constant(Convert.ChangeType(propertyValue, property.Type), property.Type);

        // 4. Binary Comparison: 'entity.PropertyName == propertyValue'
        var equality = Expression.Equal(property, constant);

        // 5. Lambda: (entity) => entity.PropertyName == propertyValue
        return Expression.Lambda<Func<T, bool>>(equality, parameter);
    }
}
\`\`\`

#### Production Optimization:
If dynamically generated expressions are executed frequently in memory via \`.Compile()\`, cache the compiled delegate in a \`ConcurrentDictionary\` using a composite cache key (Entity Type + Filter Signature) to avoid repeating the expensive IL compilation step.`,
    answerContent_fa: `### ساخت داینامیک درخت عبارات در زمان اجرا

برای ساخت فیلترهای پویا در زمان اجرا بر اساس ورودی‌های کاربر (مانند گریدهای پیشرفته یا فیلترهای Multi-Tenancy)، از متدهای کارخانه‌ای کلاس \`Expression\` استفاده می‌شود:

- ساخت پارامتر ورودی با \`Expression.Parameter\`
- دسترسی به فیلد/پراپرتی با \`Expression.PropertyOrField\`
- ساخت مقدار ثابت با \`Expression.Constant\`
- ایجاد عملگر تساوی یا مقایسه با \`Expression.Equal\` یا \`Expression.AndAlso\`
- بسته‌بندی در قالب لامبدا با \`Expression.Lambda\`

این رویکرد کاملاً Type-Safe و پارامتریزه بوده و هیچ ریسکی از نظر SQL Injection ندارد. در صورت نیاز به اجرای درون‌حافظه‌ای مکرر، دلیگیت‌های کامپایل‌شده کش می‌شوند.`,
  },
  {
    id: "dotnet-senior-q303",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-specification-pattern", "topic-dotnet-expression-trees", "topic-dotnet-gof-patterns"],
    questionTitle: "How do you design a reusable Specification Pattern in C# using Expression Trees and parameter replacement visitors?",
    questionTitle_fa: "چگونه الگوی طراحی Specification را با استفاده از Expression Trees در معماری تمیز پیاده‌سازی کرده و عبارات منطقی (AND, OR, NOT) را با جایگزینی پارامتر ترکیب کنیم؟",
    answerContent: `### Specification Pattern with Parameter-Replacer Visitor

#### The Challenge:
Combining two lambda expressions (\`u => u.Age > 18\` and \`x => x.IsActive\`) directly with \`Expression.AndAlso\` fails because they reference **two distinct parameter instances** (\`u\` vs \`x\`).

#### Solution: Custom \`ExpressionVisitor\` for Parameter Unification
\`\`\`csharp
public class ParameterReplacer : ExpressionVisitor {
    private readonly ParameterExpression _source;
    private readonly ParameterExpression _target;
    public ParameterReplacer(ParameterExpression source, ParameterExpression target) {
        _source = source;
        _target = target;
    }
    protected override Expression VisitParameter(ParameterExpression node) =>
        node == _source ? _target : base.VisitParameter(node);
}

public abstract class Specification<T> {
    public abstract Expression<Func<T, bool>> ToExpression();

    public Specification<T> And(Specification<T> other) {
        var left = ToExpression();
        var right = other.ToExpression();

        var parameter = Expression.Parameter(typeof(T), "entity");
        var leftBody = new ParameterReplacer(left.Parameters[0], parameter).Visit(left.Body);
        var rightBody = new ParameterReplacer(right.Parameters[0], parameter).Visit(right.Body);

        var combined = Expression.AndAlso(leftBody!, rightBody!);
        return new DirectSpecification<T>(Expression.Lambda<Func<T, bool>>(combined, parameter));
    }
}
\`\`\``,
    answerContent_fa: `### پیاده‌سازی الگوی Specification با Visitor جایگزینی پارامتر

#### چالش ترکیب Expressionها:
هنگام ترکیب دو عبارت شرطی مجزا (مانند \`u => u.Age > 18\` و \`x => x.IsActive\`)، نام و نمونه پارامترهای لامبدا با یکدیگر متفاوت است و ترکیب مستقیم آن‌ها خطای زمان اجرا می‌دهد.

#### راهکار: کلاس ExpressionVisitor برای یکسان‌سازی پارامترها
با پیاده‌سازی یک \`ParameterReplacer\`، پارامترهای هر دو عبارت با یک پارامتر واحد مشترک جایگزین شده و سپس عملگرهای \`AndAlso\` یا \`OrElse\` اعمال می‌شوند. این ساختار اجازه می‌دهد مشخصات بیزینسی به صورت کامپوننت‌های مستقل تعریف و در لایه Repository مستقیماً به کوئری‌های بهینه SQL ترجمه شوند.`,
  },
  {
    id: "dotnet-senior-q304",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-async-state-machine"],
    questionTitle: "How does the C# compiler transform async/await into an IAsyncStateMachine struct/class, and what is the role of AsyncMethodBuilder and SynchronizationContext?",
    questionTitle_fa: "کامپایلر C# چگونه async/await را به یک استراکت/کلاس IAsyncStateMachine تبدیل می‌کند و نقش AsyncMethodBuilder و SynchronizationContext چیست؟",
    answerContent: `### Deep Dive: Async/Await State Machine Mechanics

#### 1. Compiler Lowering Process:
Every \`async Task<T>\` method is decomposed into:
1. An internal struct implementing **\`IAsyncStateMachine\`**.
2. An **\`AsyncTaskMethodBuilder<T>\`** that orchestrates task completion, exceptions, and execution context flow.
3. Local variables and arguments become **fields** of the state machine struct.

#### 2. Execution Flow inside \`MoveNext()\`:
\`\`\`csharp
// Conceptual generated code:
public void MoveNext() {
    try {
        if (_state == -1) {
            _awaiter = _service.GetDataAsync().GetAwaiter();
            if (!_awaiter.IsCompleted) {
                _state = 0;
                // Hooks callback on completion without blocking thread
                _builder.AwaitUnsafeOnCompleted(ref _awaiter, ref this);
                return; // Thread released back to ThreadPool!
            }
        }
        var result = _awaiter.GetResult();
        _builder.SetResult(result);
    } catch (Exception ex) {
        _builder.SetException(ex);
    }
}
\`\`\`

#### 3. Role of SynchronizationContext & \`ConfigureAwait(false)\`:
- In UI/legacy ASP.NET contexts, the awaiter captures the current \`SynchronizationContext\` to marshal resumption back to the original UI thread.
- In modern ASP.NET Core, there is **no SynchronizationContext**. Continuations run on any available ThreadPool worker. Using \`ConfigureAwait(false)\` is still recommended in class libraries to avoid deadlocks when consumed by legacy applications.`,
    answerContent_fa: `### کالبدشکافی ماشین وضعیت Async/Await در کامپایلر دات‌نت

#### ۱. تبدیل کد توسط کامپایلر:
متدهای ناهمگام به یک ساختار داخلی با اینترفیس \`IAsyncStateMachine\` تبدیل می‌شوند. تمام متغیرهای محلی به فیلدهای این ساختار تبدیل شده و مدیریت تسک به \`AsyncTaskMethodBuilder\` سپرده می‌شود.

#### ۲. نحوه اجرای متد MoveNext():
کد تا رسیدن به اولین عبارت \`await\` به صورت سنکرون اجرا می‌شود. اگر عملیات I/O کامل نشده باشد، وضعیت ذخیره شده، متد \`AwaitUnsafeOnCompleted\` ثبت کال‌بک را انجام داده و نخ جاری بلافاصله به ThreadPool بازگردانده می‌شود. پس از اتمام I/O دیتابیس یا سوکت، متد \`MoveNext\` مجدداً فراخوانی و ادامه کد اجرا می‌شود.

#### ۳. نقش SynchronizationContext:
در ASP.NET Core کانتکست همگام‌سازی حذف شده و تمام ادامه‌ها روی نخی از ThreadPool اجرا می‌شوند.`,
  },
  {
    id: "dotnet-senior-q305",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "High-Performance I/O: How do Span<T>, ReadOnlySequence<T>, and System.IO.Pipelines (PipeReader) achieve zero-allocation network parsing?",
    questionTitle_fa: "پردازش فوق سریع ورودی/خروجی: چگونه Span<T>، ReadOnlySequence<T> و کتابخانه System.IO.Pipelines عملیات پارس بسته‌های شبکه بدون هیچ تخصیص حافظه (Zero-Allocation) را انجام می‌دهند؟",
    answerContent: `### High-Throughput I/O with System.IO.Pipelines

Traditional \`Stream\` reading requires allocating byte buffers, managing dynamic array resizing, and copying memory repeatedly. **\`System.IO.Pipelines\`** eliminates this overhead through memory-pooled buffer management.

\`\`\`csharp
public async Task ProcessSocketMessagesAsync(PipeReader reader) {
    while (true) {
        ReadResult result = await reader.ReadAsync();
        ReadOnlySequence<byte> buffer = result.Buffer;

        while (TryReadFrame(ref buffer, out MessageFrame frame)) {
            ProcessFrame(frame); // Uses Span<byte> slices without allocations
        }

        // Tell the pipe how much data was consumed vs examined
        reader.AdvanceTo(buffer.Start, buffer.End);

        if (result.IsCompleted) break;
    }
}
\`\`\`

#### Key Architectural Elements:
1. **Memory Pooling:** The Pipe manages internal memory pages pooled from \`MemoryPool<byte>\`.
2. **\`ReadOnlySequence<T>\`:** Represents a multi-segment linked buffer, allowing parsing across discontinuous memory blocks.
3. **Backpressure:** \`PipeOptions\` allows configuring pause/resume thresholds to prevent fast socket producers from exhausting memory when consumers are slow.`,
    answerContent_fa: `### معماری System.IO.Pipelines و پردازش بسته‌های داده با صفر آلیکیشن

روش سنتی خواندن با \`Stream\` نیازمند تخصیص مداوم آرایه‌های بایت و کپی مکرر حافظه است. معماری \`System.IO.Pipelines\` (پایپ‌لاین زیربنایی Kestrel در دات‌نت) این مشکل را کاملاً حل کرده است:

- **مدیریت استخر حافظه:** بافرها از \`MemoryPool\` تأمین می‌شوند.
- **ساختار \`ReadOnlySequence<byte>\`:** بسته‌های داده در چند تکه حافظه غیرپیوسته را بدون کپی کردن و الحاق به یکدیگر، در قالب اسلایس‌های \`Span\` پردازش می‌کند.
- **مدیریت پس‌فشار (Backpressure):** کنترل خودکار سرعت دریافت از سوکت در زمان کندی مصرف‌کننده.`,
  },
  {
    id: "dotnet-senior-q306",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    topicIds: ["topic-dotnet-rabbitmq-advanced"],
    questionTitle: "What are RabbitMQ Quorum Queues, how do they differ from Classic Mirrored Queues, and how do they utilize the Raft consensus algorithm?",
    questionTitle_fa: "صف‌های Quorum Queues در RabbitMQ چه تفاوتی با Classic Mirrored Queues دارند و چگونه از الگوریتم اجماع Raft برای تاب‌آوری و دسترسی‌پذیری بالا استفاده می‌کنند؟",
    answerContent: `### RabbitMQ Quorum Queues vs. Classic Mirrored Queues

Classic Mirrored Queues (deprecated in RabbitMQ 3.8+ / removed in 4.0) suffered from severe performance degradation during node synchronization and could lose messages during network partition split-brain events.

| Feature | Classic Mirrored Queues | Quorum Queues (Raft Consensus) |
| :--- | :--- | :--- |
| **Replication Protocol** | Custom proprietary sync protocol | **Raft Consensus Algorithm** (Majority Voting) |
| **Network Partition Safety**| Vulnerable to split-brain data loss | Strictly safe (CP model; prevents split-brain) |
| **Disk Storage** | In-memory with optional paging | **Always written to disk first (Append-Only Log)** |
| **Node Addition Overhead**| Re-synchronization blocks queue operations | Non-blocking Raft catch-up replication |
| **Target Scale** | Small queues | High-throughput, critical financial transactions |

#### The Raft Consensus Mechanism:
A Quorum Queue is distributed across an odd number of nodes (typically 3 or 5). A message is only acknowledged to the publisher once a **quorum (majority, $\\lfloor N/2 \\rfloor + 1$)** of replicas has safely committed the log entry to non-volatile disk storage.`,
    answerContent_fa: `### تفاوت Quorum Queues و Classic Mirrored Queues در RabbitMQ

صف‌های سنتی Mirrored Queues در زمان قطعی شبکه و همگام‌سازی نودها دچار افت شدید کارایی و پدیده Split-Brain می‌شدند. در مقابل، **Quorum Queues** بر پایه الگوریتم اجماع **Raft** عمل می‌کنند:

- **مدل اجماع Raft:** پیام تنها زمانی تایید (Ack) می‌شود که توسط اکثریت نودها ($\lfloor N/2 \rfloor + 1$) روی دیسک ثبت شده باشد.
- **امنیت در قطعی شبکه:** تضمین کامل سازگاری داده‌ها (مدل CP در قضیه CAP).
- **همگام‌سازی بدون وقفه:** اضافه شدن نود جدید هیچ توقفی در پذیرش پیام‌ها ایجاد نمی‌کند.`,
  },
  {
    id: "dotnet-senior-q307",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    topicIds: ["topic-dotnet-rabbitmq-advanced"],
    questionTitle: "How do you guarantee strict FIFO message ordering per entity while horizontally scaling consumers in RabbitMQ?",
    questionTitle_fa: "چگونه می‌توان ضمن اسکیل افقی مصرف‌کننده‌ها (Consumers)، ترتیب دقیق زمانی و ترتیبی (FIFO) پیام‌ها را برای هر کاربر یا حساب در RabbitMQ تضمین کرد؟",
    answerContent: `### Strict FIFO Ordering with Horizontal Consumer Scaling

#### The Competing Consumers Concurrency Problem:
If 10 consumer threads consume from a single shared queue, Message 2 may complete before Message 1 due to thread scheduling or transient retry delays, destroying chronological order for a given user account.

#### Architectural Solution: Partitioned Queues via Consistent Hash Exchange
\`\`\`
Producer -> Consistent Hash Exchange (Routing Key = AccountId)
                    /       |       \\
            Queue-0      Queue-1     Queue-2
               |            |           |
          Consumer-0   Consumer-1  Consumer-2
       (Single Active Consumer enabled on each queue)
\`\`\`

1. **Consistent Hash Exchange (\`x-consistent-hash\`):** Hashes the entity identifier (\`AccountId\` / \`UserId\`) and consistently routes all events for that specific entity to the exact same dedicated partition queue.
2. **Single Active Consumer (SAC):** Enable SAC (\`x-single-active-consumer: true\`) on each queue so only one consumer thread processes messages from that queue at any time. If that consumer dies, RabbitMQ seamlessly promotes the standby consumer without breaking message ordering.
3. **Idempotency & Monotonic Sequence IDs:** Consumers reject or ignore out-of-order events using domain sequence version checks.`,
    answerContent_fa: `### تضمین ترتیب دقیق پیام‌ها (FIFO) همراه با اسکیل افقی در RabbitMQ

#### مشکل رقابت مصرف‌کننده‌ها (Competing Consumers):
در صورت اتصال چند Consumer همزمان به یک صف، به دلیل تفاوت در سرعت پردازش یا Retryها، ممکن است پیام ۲ قبل از پیام ۱ ثبت شده و توالی تراکنش‌های یک حساب بانکی به هم بریزد.

#### راهکار معماری:
۱. **استفاده از Consistent Hash Exchange:** پیام‌ها بر اساس هش کلید دامین (مانند \`AccountId\`) به صف‌های پارتیشن‌بندی شده مشخص هدایت می‌شوند (تمام تراکنش‌های کاربر A همیشه به صف شماره ۱ می‌روند).
۲. **فعال‌سازی Single Active Consumer (SAC):** در هر صف پارتیشن فقط یک Consumer فعال اجازه پردازش دارد. در صورت قطعی نود، بروکر نود استندبای را بدون به هم ریختن ترتیب فعال می‌کند.
۳. **شماره سریال افزایشی در دامین:** اعتبارسنجی توالی رویدادها در لایه اپلیکیشن با مقایسه نسخه (Sequence Number).`,
  },
  {
    id: "dotnet-senior-q308",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    topicIds: ["topic-dotnet-redis-internals"],
    questionTitle: "Deep dive into Redis persistence: Compare RDB (Snapshots) and AOF (Append-Only File). What are the durability trade-offs in FinTech systems?",
    questionTitle_fa: "تحلیل عمیق ماندگاری داده در Redis: مقایسه RDB و AOF، تفاوت حالت‌های fsync و نحوه تنظیم ماندگاری در سیستم‌های حساس مالی چیست؟",
    answerContent: `### Redis Persistence: RDB vs. AOF

Redis provides two primary persistence engines that can be combined for maximum durability:

| Dimension | RDB (Redis Database Backup) | AOF (Append-Only File) |
| :--- | :--- | :--- |
| **Mechanism** | Point-in-time binary snapshot of entire memory space | Append-only text log of every write command |
| **Trigger** | Periodic interval (e.g. save after 60s if 1,000 keys changed) or \`BGSAVE\` | Continuous recording on each write command |
| **Data Loss Window** | Up to the last snapshot interval ($5-15\\text{ minutes}$) | Max 1 second (with \`appendfsync everysec\`) or $0\\text{s}$ (\`always\`) |
| **Restart Speed** | Extremely fast (binary memory dump restored directly) | Slower (re-executes all write commands) |
| **Disk I/O Overhead** | Low (only during snapshot fork) | Higher (continuous disk disk writes) |

#### Understanding \`fsync\` Modes in AOF:
- **\`appendfsync always\`:** Commits every write command to disk using \`fsync()\`. Maximum ACID safety (zero data loss), but throttles write throughput down to disk IOPS limits ($O(\\text{hundreds of writes/sec})$).
- **\`appendfsync everysec\` (Recommended Production Default):** Flushes the buffer to disk in a background thread every second. Excellent balance: provides $<1$ second data loss window with $>100,000\\text{ ops/sec}$.
- **\`appendfsync no\`:** Relies entirely on OS buffer flushing (higher risk of data loss on server crash).

#### Hybrid Persistence (Redis 4.0+ / 7.0+):
Combines an initial RDB snapshot preamble with an AOF delta log during AOF rewrite (\`BGREWRITEAOF\`), giving the best of both worlds: ultra-fast server boot times with near-zero data loss.`,
    answerContent_fa: `### مقایسه عمیق مکانیزم‌های ماندگاری داده در Redis (RDB در برابر AOF)

- **مکانیزم RDB (اسنپ‌شات باینری):**
  - از کل حافظه رم یک کپی لحظه‌ای باینری تهیه می‌کند.
  - فرآیند بازیابی پس از ریستارت سرور بسیار سریع است، اما در صورت کرش ناگهانی، داده‌های بین دو اسنپ‌شات از دست می‌روند.

- **مکانیزم AOF (لاگ افزایشی دستورات):**
  - تک‌تک دستورات تغییر داده (Write) را در یک فایل متنی لاگ می‌کند.
  - **حالت \`appendfsync always\`:** ایمن‌ترین حالت برای داده‌های حساس مالی (صفر داده از دست می‌رود) اما سرعت را کاهش می‌دهد.
  - **حالت \`appendfsync everysec\`:** بهترین تعادل؛ داده‌ها هر یک ثانیه یکبار روی دیسک فلاش می‌شوند (حداکثر یک ثانیه ریسک داده در ازای کارایی فوق‌العاده بالا).

- **ماندگاری ترکیبی (Hybrid Persistence):** ترکیب پایه RDB به همراه لاگ‌های تفاضلی AOF برای بوت فوق‌العاده سریع سرور.`,
  },
  {
    id: "dotnet-senior-q309",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    topicIds: ["topic-dotnet-redis-internals"],
    questionTitle: "Why does Redis MULTI/EXEC NOT support ACID rollbacks on runtime errors, and how does Lua Scripting provide true atomic check-and-set operations?",
    questionTitle_fa: "چرا دستورات MULTI/EXEC در Redis از Rollback در خطاهای منطقی پشتیبانی نمی‌کنند و چگونه اسکریپت‌های Lua اجرای کاملاً اتمیک و بدون Race Condition را فراهم می‌کنند؟",
    answerContent: `### Redis Transactions (MULTI/EXEC) vs. Lua Scripting Atomicity

#### 1. Why Redis Transactions Do Not Support Rollbacks:
In Redis, \`MULTI\` queues commands and \`EXEC\` executes them sequentially.
- If a command fails during queuing (syntax error), the transaction is aborted.
- **However, if a command fails during execution** (e.g. executing \`LPUSH\` on a string key), Redis continues executing all subsequent commands in the block **without rollback**.
- **Architectural Rationale:** Redis avoids rollback mechanics to keep its single-threaded execution engine simple and maximally performant.

#### 2. True Atomicity via Lua Scripting (\`EVALSHA\`):
Redis executes Lua scripts **atomically in its single-threaded core**. No other command or script can run until the current Lua script finishes, preventing race conditions completely without distributed locks!

\`\`\`lua
-- Atomic Rate Limiter / Sliding Window Script
local current = redis.call('INCR', KEYS[1])
if tonumber(current) == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1]) -- Set TTL 60 seconds
end
if tonumber(current) > tonumber(ARGV[2]) then
    return 0 -- Rejected (Exceeded Limit)
else
    return 1 -- Allowed
end
\`\`\`

\`\`\`csharp
// Executing via StackExchange.Redis
var prepared = LuaScript.Prepare(luaCode);
var result = await db.ScriptEvaluateAsync(prepared, new { key = (RedisKey)"ratelimit:user:101", ttl = 60, max = 10 });
\`\`\``,
    answerContent_fa: `### بررسی عدم وجود Rollback در MULTI/EXEC و حل اتمیک با Lua

#### ۱. چرا دستورات MULTI/EXEC رول‌بک ندارند؟
ردیس برای حفظ سادگی و کارایی حداکثری موتور تک‌نخی خود، سیستم ثبت لاگ Undo/Rollback ندارد. اگر یک دستور درون بلاک ترنزکشن به دلیل عدم تطابق تایپ با خطا مواجه شود، سایر دستورات اجرا شده و بازگشت داده‌ها انجام نمی‌شود.

#### ۲. اجرای کاملاً اتمیک با اسکریپت‌های Lua:
اسکریپت‌های Lua درون هسته تک‌نخی Redis اجرا می‌شوند؛ در طول زمان اجرای اسکریپت Lua، هیچ دستور یا کلاینت دیگری نمی‌تواند دیتابیس را تغییر دهد.
این قابلیت امکان بررسی و اعمال تغییرات شرطی (Check-and-Set) مانند **Rate Limiter، کسر موجودی انبار و احراز توکن** را به صورت ۱۰۰٪ اتمیک و بدون نیاز به قفل‌های توزیع‌شده فراهم می‌کند.`,
  },
  {
    id: "dotnet-senior-q310",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "senior",
    topicIds: ["topic-dotnet-redis-internals"],
    questionTitle: "What is Redis Streams (XADD, XREADGROUP, XACK) and how does it compare to Redis Pub/Sub, RabbitMQ, and Apache Kafka?",
    questionTitle_fa: "ساختار داده Redis Streams چیست و چه تفاوت‌هایی با Redis Pub/Sub، RabbitMQ و Apache Kafka از نظر پایداری داده، گروه مصرف‌کنندگان و کارایی دارد؟",
    answerContent: `### Redis Streams Deep Dive

Introduced in Redis 5.0, **Redis Streams** is an append-only, Radix-tree backed log data structure designed for real-time messaging, event streaming, and consumer group coordination.

| Feature | Redis Pub/Sub | Redis Streams | RabbitMQ | Apache Kafka |
| :--- | :--- | :--- | :--- | :--- |
| **Persistence** | ❌ Fire-and-forget (zero history) | ✅ Persistent on disk/memory | ✅ Persistent in Queues | ✅ Persistent Distributed Log |
| **Consumer Groups** | ❌ No | ✅ Yes (\`XREADGROUP\`) | ✅ Yes (Competing Consumers)| ✅ Yes (Consumer Groups) |
| **Message Replay** | ❌ Impossible | ✅ Supported via IDs/Offsets | ❌ Hard (DLQ only) | ✅ Native Offset Seeking |
| **Backpressure/PEL** | ❌ Buffers overflow | ✅ Pending Entries List (\`XPENDING\`)| ✅ Prefetch Count / QoS | ✅ Pull-based Polling |
| **Throughput Scale** | Millions/sec | Hundreds of thousands/sec | Tens of thousands/sec | Millions of events/sec |

#### Key Redis Streams Commands:
- \`XADD mystream * sensor_id 101 temp 36.5\`: Appends a new event with auto-generated timestamp ID.
- \`XGROUP CREATE mystream mygroup 0\`: Creates a consumer group starting from the beginning.
- \`XREADGROUP GROUP mygroup consumer1 COUNT 10 BLOCK 2000 STREAMS mystream >\`: Fetches unread messages for this specific consumer.
- \`XACK mystream mygroup <message-id>\`: Acknowledges message processing, removing it from the Pending Entries List (PEL).
- \`XAUTOCLAIM mystream mygroup consumer1 60000 0-0 COUNT 10\`: Automatically reclaims stalled/abandoned messages from dead consumers!`,
    answerContent_fa: `### ساختار داده Redis Streams و مقایسه با RabbitMQ و Kafka

ساختار **Redis Streams** یک گزارش افزایشی (Append-Only Log) پایدار در حافظه است که برای رقابت با کافکا و رفع محدودیت‌های Redis Pub/Sub طراحی شده است:

- **پایداری پیام:** پیام‌ها بر خلاف Pub/Sub در حافظه و دیسک باقی می‌مانند و امکان خواندن مجدد (Replay) تاریخچه رویدادها وجود دارد.
- **گروه مصرف‌کنندگان (Consumer Groups):** تقسیم بار هوشمندانه بین چند Worker مستقل با دستور \`XREADGROUP\`.
- **لیست پیام‌های معلق (PEL):** نگهداری پیام‌های تاییدنشده تا در صورت کرش کردن یک Worker، دستور \`XAUTOCLAIM\` پیام را به نود سالم دیگری منتقل کند.
- **تفاوت با RabbitMQ و Kafka:** سبک‌تر از RabbitMQ و کم‌هزینه‌تر از راه‌اندازی کلاستر کافکا برای سیستم‌های با حجم متوسط و مقیاس‌پذیر.`,
  },
  {
    id: "dotnet-senior-q311",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    topicIds: ["topic-dotnet-acid-isolation"],
    questionTitle: "Explain all Transaction Isolation Levels in relational databases and the exact concurrency anomalies they prevent (Dirty Reads, Non-Repeatable Reads, Phantom Reads, Write Skew).",
    questionTitle_fa: "سطوح مختلف ایزولاسیون تراکنش‌ها (Isolation Levels) در پایگاه‌های داده رابطه‌ای و ناهنجاری‌های همزمانی (Dirty Read، Non-Repeatable Read، Phantom Read و Write Skew) را با جزئیات تحلیل کن.",
    answerContent: `### Transaction Isolation Levels & Concurrency Anomalies

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Write Skew |
| :--- | :---: | :---: | :---: | :---: |
| **Read Uncommitted** | ❌ Allowed | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Read Committed** (Default) | ✅ Prevented | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Repeatable Read** | ✅ Prevented | ✅ Prevented | ❌ Allowed | ❌ Allowed |
| **Snapshot Isolation (MVCC)**| ✅ Prevented | ✅ Prevented | ✅ Prevented | ❌ Allowed |
| **Serializable** | ✅ Prevented | ✅ Prevented | ✅ Prevented | ✅ Prevented |

#### Definitions of Concurrency Anomalies:
1. **Dirty Read:** Transaction A reads data modified by Transaction B that has NOT yet committed. If B rolls back, A holds corrupted garbage data.
2. **Non-Repeatable Read:** Transaction A reads row $X$. Transaction B updates row $X$ and commits. Transaction A re-reads row $X$ and discovers the values have changed.
3. **Phantom Read:** Transaction A queries all rows with \`Status = 'Active'\` (receives 5 rows). Transaction B inserts a new active row and commits. Transaction A re-runs the range query and gets 6 rows.
4. **Write Skew (Snapshot Isolation Anomaly):** Occurs when two concurrent transactions read disjoint records that together satisfy a business invariant, but make concurrent updates that violate the global constraint (e.g. two doctors concurrently resign on-call duty because each sees 2 doctors available in their snapshot). Prevented by **Serializable** or explicit row locking (\`UPDLOCK\`).`,
    answerContent_fa: `### سطوح ایزولاسیون تراکنش‌ها و ناهنجاری‌های همزمانی

#### تحلیل پدیده‌های تداخل همزمانی:
۱. **Dirty Read:** خواندن داده‌های تراکنش دیگری که هنوز Commit نشده و ممکن است Rollback شود.
۲. **Non-Repeatable Read:** خواندن مجدد یک سطر خاص و مشاهده تغییر مقادیر آن توسط تراکنش دیگر در حین اجرای تراکنش جاری.
۳. **Phantom Read:** اجرای مجدد کوئری فیلتر بازه‌ای و اضافه/کم شدن تعداد رکوردهای نتیجه به دلیل درج رکوردهای جدید توسط تراکنش دیگر.
۴. **Write Skew:** ناهنجاری در سطح Snapshot Isolation؛ زمانی که دو تراکنش همزمان داده‌های متفاوتی را بر اساس اسنپ‌شات معتبر تغییر می‌دهند اما در مجموع قانون یکپارچگی سیستم را نقض می‌کنند (تنها با سطح **Serializable** یا قفل صریح \`UPDLOCK\` مهار می‌شود).`,
  },
  {
    id: "dotnet-senior-q312",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    topicIds: ["topic-dotnet-db-indexes"],
    questionTitle: "Explain the internal architecture of Database Indexes (B+ Tree structure, Clustered vs Non-Clustered, Covering Indexes with INCLUDE, and Index Fragmentation).",
    questionTitle_fa: "معماری داخلی ایندکس‌های دیتابیس (ساختار درخت B+ Tree، تفاوت ایندکس خوشه‌ای و غیرخوشه‌ای، ایندکس پوششی با INCLUDE و پدیده چندپارگی Fragmentation) چیست؟",
    answerContent: `### Database Index Internals: The B+ Tree

Relational databases (SQL Server, PostgreSQL, MySQL InnoDB) organize table indexes as balanced search trees (**B+ Trees**).

\`\`\`
                     [ Root Node Page ]
                     /                \\
          [ Intermediate Page ]    [ Intermediate Page ]
             /            \\             /            \\
      [ Leaf Page 1 ] <-> [ Leaf Page 2 ] <-> [ Leaf Page 3 ] (Doubly-Linked)
\`\`\`

#### Key Architectural Components:
1. **Root & Intermediate Nodes:** Store navigation index keys and 8KB page pointers.
2. **Leaf Level (Clustered Index):** The leaf level IS the actual physical table data rows. Only **1** clustered index can exist per table.
3. **Leaf Level (Non-Clustered Index):** Stores index key columns + a **Row Locator** (the clustered index key or Heap RID).
4. **Key Lookup / Bookmark Lookup:** When a non-clustered index satisfies the \`WHERE\` filter but the \`SELECT\` requires additional columns, the engine must jump to the clustered index page for each row ($O(N)$ random I/O).
5. **Covering Index Optimization:** Adding non-search columns into the index via **\`INCLUDE (Email, FullName)\`** places them directly in the leaf pages without bloating intermediate nodes, **completely eliminating Key Lookups**!

#### Index Fragmentation & Fill Factor:
- **Internal Fragmentation:** Sparse pages caused by row deletions or updates.
- **External Fragmentation (Page Splits):** Inserting records into the middle of full pages forces the engine to allocate a new page out of physical sequence.
- **Maintenance:** Set \`FILLFACTOR = 80-85%\` for high-insert tables. Run \`REORGANIZE\` ($>10\\%$ fragmentation) or \`REBUILD\` ($>30\\%$ fragmentation).`,
    answerContent_fa: `### معماری داخلی ایندکس‌های B+ Tree و ایندکس پوششی

- **ساختار درخت B+ Tree:** شامل صفحات ۸ کیلوبایتی ریشه، میانی و برگ است. صفحات برگ به صورت لیست پیوندی دوطرفه متصل هستند تا جستجوهای بازه‌ای (\`BETWEEN\`) با کارایی فوق‌العاده انجام شوند.
- **ایندکس خوشه‌ای (Clustered):** سطح برگ ایندکس، خود رکوردهای واقعی جدول است (مرتب بر اساس کلید اصلی).
- **ایندکس غیرخوشه‌ای (Non-Clustered):** سطح برگ فقط شامل فیلد ایندکس شده و یک اشاره‌گر به کلید اصلی است.
- **رفع هزینه Key Lookup با Covering Index:** با افزودن فیلدهای نمایشی در بخش \`INCLUDE\` ایندکس، دیتابیس بدون نیاز به پرش اضافه به جدول اصلی (Key Lookup)، تمام داده‌ها را از همان ایندکس واکشی می‌کند.
- **چندپارگی (Fragmentation):** به دلیل شکست صفحات (Page Split) هنگام درج‌های میانی رخ می‌دهد که با تنظیم \`FILLFACTOR\` و عملیات \`REORGANIZE\` یا \`REBUILD\` برطرف می‌شود.`,
  },
  {
    id: "dotnet-senior-q313",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "senior",
    topicIds: ["topic-dotnet-db-concurrency-locks"],
    questionTitle: "What causes Database Deadlocks in SQL Server / PostgreSQL, how do you analyze Deadlock Graphs, and what architectural strategies eliminate them?",
    questionTitle_fa: "عوامل اصلی ایجاد بن‌بست (Deadlock) در دیتابیس چیست، چگونه Deadlock Graph را تحلیل کنیم و چه راهکارهای معماری برای پیشگیری قطعی از آن وجود دارد؟",
    answerContent: `### Database Deadlocks: Root Causes & Resolution

A Deadlock is a concurrency condition where two or more database sessions hold locks on resources the other sessions require, forming a cyclic dependency where none can proceed.

\`\`\`
Transaction A: Locks Row 1 in Orders -> Waits for Lock on Row 2 in Payments
Transaction B: Locks Row 2 in Payments -> Waits for Lock on Row 1 in Orders
Result: Deadlock Cycle! DB Deadlock Monitor terminates Transaction with lowest rollback cost.
\`\`\`

#### Root Causes:
1. **Inconsistent Object Access Ordering:** Transaction 1 updates \`TableA\` then \`TableB\`; Transaction 2 updates \`TableB\` then \`TableA\`.
2. **Lock Escalation:** Fine-grained row/page locks escalating to table exclusive locks during bulk updates.
3. **Missing Indexes on Foreign Keys:** Forces table scans that acquire extensive shared/update locks.
4. **Long-Running Transactions:** Keeping transactions open while making external HTTP calls or file I/O.

#### Analysis via Extended Events & Deadlock Graphs:
Enable \`system_health\` session or capture the XML Deadlock Graph (\`xml_deadlock_report\`). Identify the **victim session**, the lock modes (\`Exclusive (X)\`, \`Update (U)\`, \`Shared (S)\`), and the exact SQL queries involved.

#### Prevention Architectural Strategies:
1. **Deterministic Lock Ordering:** Enforce that all application code updates related tables in the exact same deterministic sequence (e.g. always alphabetical or Parent $\to$ Child).
2. **Enable Read Committed Snapshot Isolation (RCSI):** In SQL Server (\`SET READ_COMMITTED_SNAPSHOT ON\`), readers do not block writers and writers do not block readers.
3. **Use Updatelocks Early:** \`SELECT ... WITH (UPDLOCK, ROWLOCK)\` prevents conversion deadlocks where two readers simultaneously attempt to upgrade shared locks to exclusive locks.`,
    answerContent_fa: `### علل وقوع Deadlock، تحلیل Deadlock Graph و راهکارهای پیشگیری

#### دلایل اصلی ایجاد بن‌بست:
۱. **عدم رعایت ترتیب یکنواخت دسترسی:** یک تراکنش ابتدا جدول الف و سپس ب را آپدیت می‌کند، در حالی که تراکنش دوم ابتدا جدول ب و سپس الف را تغییر می‌دهد.
۲. **طولانی بودن زمان تراکنش‌ها:** انجام درخواست‌های کند شبکه یا وب‌سرویس درون تراکنش دیتابیس.
۳. **فقدان ایندکس روی کلیدهای خارجی:** باعث اسکن کل جدول (Table Scan) و قفل شدن کل رکوردهای دیگر می‌شود.

#### روش‌های مانیتورینگ و رفع:
- استخراج فایل **XML Deadlock Graph** از رویدادهای پیش‌فرض \`system_health\` برای مشاهده کوئری‌ها و رکوردهای درگیر در بن‌بست.
- **راهکارها:** ترتیب قطعی و یکنواخت در آپدیت جداول در تمام کدهای برنامه، فعال‌سازی **RCSI** جهت حذف بلاک‌های خواندن و نوشتن، و استفاده به موقع از قفل \`UPDLOCK\`.`,
  },
  {
    id: "dotnet-senior-q314",
    stackId: "dotnet",
    categoryId: "system-design-fintech",
    levelId: "senior",
    topicIds: ["topic-dotnet-db-sharding-replicas"],
    questionTitle: "How do you scale the relational database tier using Table Partitioning, Horizontal Sharding, and Clustered Read Replicas?",
    questionTitle_fa: "چگونه لایه دیتابیس رابطه‌ای را با استفاده از پارتیشن‌بندی جداول (Table Partitioning)، شاردینگ افقی (Horizontal Sharding) و کلاسترهای Read Replica تا مقیاس ترابایتی توسعه می‌دهید؟",
    answerContent: `### Scaling the Database Tier to Terabytes

\`\`\`
                    [ API Gateway / Application ]
                       /                     \\
           (Writes: Master DB)        (Reads: Load Balancer)
                   |                          /           \\
           (Log Replication)           [ Read-Replica 1 ]  [ Read-Replica 2 ]
                   |
     [ Shard 0 ] [ Shard 1 ] [ Shard 2 ] (Horizontal Sharding by TenantId)
\`\`\`

#### 1. Table Partitioning (Single Instance Optimization):
- Divides giant tables (e.g. 500M order records) into separate physical filegroups on disk based on a **Partition Function** (e.g. \`YEAR(OrderDate)\`).
- **Partition Elimination:** Query engine scans only the relevant partition (e.g. 2026 data), skipping 90% of disk pages.
- Fast zero-downtime data archival via **Partition Switching** (\`ALTER TABLE ... SWITCH PARTITION\`).

#### 2. Clustered Read Replicas (Read/Write CQRS Splitting):
- All write operations (INSERT, UPDATE, DELETE) route to the **Primary Master DB**.
- Read queries route to clustered read replicas synced via asynchronous streaming replication.
- **Handling Replication Lag:** For immediate post-write reads (e.g. user viewing newly placed order), read from the Primary instance or use sticky replication tokens.

#### 3. Horizontal Sharding (Multi-Instance Scaling):
- Splits dataset across $N$ independent database servers based on a **Shard Key** (\`TenantId\` or \`UserId % N\`).
- Eliminates single-server RAM/CPU/Disk IOPS bottlenecks completely.`,
    answerContent_fa: `### استراتژی‌های مقیاس‌پذیری پایگاه‌های داده رابطه‌ای

۱. **پارتیشن‌بندی جداول (Table Partitioning):**
   - تقسیم فیزیکی داده‌های یک جدول عظیم به فایل‌گروه‌های مجزا روی دیسک بر اساس یک کلید (مانند تاریخ).
   - افزایش چشمگیر سرعت با **Partition Elimination** (موتور دیتابیس صرفاً پارتیشن بازه زمانی درخواست شده را اسکن می‌کند).

۲. **تفکیک با Read Replicaها (CQRS دیتابیس):**
   - ارسال تمام تراکنش‌های نوشتن به نود Primary و هدایت ترافیک سنگین گزارش‌ها و جستجوها به نودهای کپی (Read Replicas).
   - مدیریت تاخیر همگام‌سازی (Replication Lag) برای صفحات حساس بعد از ثبت تراکنش.

۳. **شاردینگ افقی (Horizontal Sharding):**
   - توزیع فیزیکی رکوردها روی چندین سرور مستقل بر اساس **Shard Key** (مانند شناسه کاربر یا سازمان).`,
  },
  {
    id: "dotnet-senior-q315",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-event-sourcing-cqrs"],
    questionTitle: "Explain the Event Sourcing Pattern and Event Store architecture vs traditional CRUD with Snapshots and Projections.",
    questionTitle_fa: "الگوی Event Sourcing و معماری پایگاه داده رویدادمحور (Event Store) چیست و تفاوت آن با دیتابیس‌های سنتی CRUD در مدیریت وضعیت، اسنپ‌شات‌ها و Read Modelها چیست؟",
    answerContent: `### Event Sourcing Pattern & Architecture

#### CRUD vs. Event Sourcing:
- **Traditional CRUD:** Overwrites current state in the database (\`UPDATE Accounts SET Balance = 800 WHERE Id = 1\`). Historical state mutations are permanently lost.
- **Event Sourcing:** Never updates or deletes data. Stores state changes as an immutable sequence of **Domain Events** in an append-only log (**Event Store**).

\`\`\`
Event Stream for Account #101:
1. AccountOpenedEvent { InitialDeposit: $1000 }
2. MoneyWithdrawnEvent { Amount: $200 }
3. FeeChargedEvent { Amount: $15 }
Current State calculated by replaying stream: $1000 - $200 - $15 = $785
\`\`\`

#### Key Architectural Components:
1. **Aggregate Reconstitution:** Load all past events for the Aggregate ID and apply them sequentially to reconstruct in-memory state.
2. **Snapshotting:** Replaying 10,000 events on every request is slow. Every $N$ events (e.g. 100 events), save a **Snapshot** of the aggregate state. Rehydration loads the latest snapshot and replays only the delta events.
3. **Projections (Read Models):** Asynchronous projection workers consume domain events to populate optimized denormalized read databases (Elasticsearch, PostgreSQL Read Models) for lightning-fast queries (CQRS).
4. **Audit Trail & Time Travel:** Guarantees 100% immutable financial compliance and temporal state reconstruction at any historical point in time.`,
    answerContent_fa: `### معماری و الگوی طراحی رویدادمحور (Event Sourcing)

در مدل‌های سنتی CRUD، وضعیت فعلی جایگزین وضعیت قبلی می‌شود و تاریخچه تغییرات از بین می‌رود. در الگوی **Event Sourcing**:
- هیچ داده‌ای آپدیت یا حذف نمی‌شود؛ بلکه تمام تغییرات در قالب رویدادهای تغییرناپذیر دامین (\`Domain Events\`) در یک دیتابیس افزایشی (Append-Only Event Store) ثبت می‌شوند.

#### اجزای کلیدی معماری:
۱. **بازسازی وضعیت (Reconstitution):** وضعیت فعلی موجودیت با بازپخش (Replay) رویدادهای گذشته از ابتدا محاسبه می‌شود.
۲. **اسنپ‌شات (Snapshotting):** جهت جلوگیری از کندی بازپخش در موجودیت‌های پررویداد، هر ۱۰۰ رویداد یک اسنپ‌شات ذخیره شده و فقط رویدادهای بعد از آن بازخوانی می‌شوند.
۳. **پروجکشن‌ها (Projections):** ساخت پایگاه‌های داده مخصوص خواندن (Read Models) به صورت غیرهمگام از روی رویدادها (الگوی CQRS).
۴. **حسابرسی کامل و سفر در زمان:** امکان بازسازی دقیق وضعیت سیستم در هر لحظه از تاریخ برای سناریوهای مالی و حقوقی.`,
  },
  {
    id: "dotnet-senior-q316",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-gof-patterns"],
    questionTitle: "Compare the Structural Design Patterns: Adapter, Facade, Proxy, and Decorator with concrete .NET enterprise architectural scenarios.",
    questionTitle_fa: "مقایسه جامع الگوهای ساختاری: Adapter، Facade، Proxy و Decorator با مثال‌های عملی در معماری سازمانی دات‌نت.",
    answerContent: `### Structural Design Patterns Comparison

| Pattern | Primary Intent | Interface Modification | Example in .NET Enterprise Architecture |
| :--- | :--- | :--- | :--- |
| **Adapter** | Converts incompatible interface to expected interface | **Changes Interface** | Wrapping a legacy SOAP bank API to match your internal \`IPaymentGateway\` interface. |
| **Facade** | Simplifies a complex multi-service subsystem | **Creates New Simplified Interface** | \`OrderCheckoutFacade\` coordinating Inventory, Payment, Invoice, and Email services. |
| **Proxy** | Controls access, lazy loading, or security permissions | **Keeps Same Interface** | \`VirtualProxy<T>\` for lazy-loading heavy remote resources, or Security Proxy verifying JWT claims. |
| **Decorator** | Adds dynamic responsibilities (caching, logging) | **Keeps Same Interface** | Wrapping \`IUserRepository\` with \`CachedUserRepository\` or telemetry tracking via Scrutor. |

#### Architectural Guideline:
- Use **Adapter** when integrating third-party SDKs without polluting your domain core.
- Use **Facade** when controllers or endpoints require orchestrating 5+ internal domain services.
- Use **Decorator** to apply Open/Closed Principle when adding Cross-Cutting Concerns to repositories or handlers.`,
    answerContent_fa: `### مقایسه الگوهای طراحی ساختاری (Adapter, Facade, Proxy, Decorator)

- **الگوی Adapter (مبدل):**
  - **هدف:** تغییر اینترفیس یک کلاس خارجی یا سنتی برای سازگاری با استانداردهای داخلی پروژه (مانند تبدیل وب‌سرویس بانک به \`IPaymentService\`).
- **الگوی Facade (نما):**
  - **هدف:** ایجاد یک اینترفیس ساده برای هماهنگی بین چندین زیرسیستم پیچیده (مانند فرآیند ثبت نهایی سفارش که انبار، مالی و پیامک را صدا می‌زند).
- **الگوی Proxy (واسط کنترل دسترسی):**
  - **هدف:** حفظ همان اینترفیس اما کنترل دسترسی، لود تنبل (Lazy Loading) یا بررسی سطوح دسترسی امنیتی.
- **الگوی Decorator (تزئین‌کننده):**
  - **هدف:** حفظ همان اینترفیس و افزودن قابلیت‌های جانبی به صورت پویا (مانند لایه کشینگ یا مانیتورینگ دور ریپازیتوری با پکیج Scrutor).`,
  },
  {
    id: "dotnet-senior-q317",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-span-memory", "topic-dotnet-gof-patterns"],
    questionTitle: "How are the Flyweight Pattern and Object Pooling implemented in high-performance .NET applications (ArrayPool<T>, ObjectPool<T>) to eliminate GC Gen 0/Gen 2 pressure?",
    questionTitle_fa: "الگوی طراحی Flyweight و مکانیزم‌های Object Pooling در دات‌نت پرسرعت (کلاس‌های ArrayPool و ObjectPool) چگونه پیاده‌سازی شده و فشار روی Garbage Collector را به صفر می‌رسانند؟",
    answerContent: `### Flyweight Pattern & Memory Pooling in High-Throughput C#

High-frequency memory allocations trigger frequent **Garbage Collection (Gen 0 / Gen 1)** pauses and **Large Object Heap (LOH)** fragmentation.

#### 1. Flyweight Pattern (Intrinsic vs. Extrinsic State):
- **Principle:** Shares immutable state across thousands of objects to minimize RAM footprint.
- **Example:** In-memory string interning (\`string.Intern()\`) or shared flyweight formatting metadata objects across insurance pricing calculators.

#### 2. High-Performance Object & Buffer Pooling:
Instead of allocating and discarding heavy byte arrays or complex objects:
\`\`\`csharp
// 1. ArrayPool for zero-allocation byte buffers
byte[] rented = ArrayPool<byte>.Shared.Rent(4096);
try {
    int bytesRead = await stream.ReadAsync(rented.AsMemory(0, 4096));
    ProcessData(rented.AsSpan(0, bytesRead));
} finally {
    ArrayPool<byte>.Shared.Return(rented, clearArray: true); // Return to pool!
}

// 2. Microsoft.Extensions.ObjectPool for heavy reusable instances
var pool = new DefaultObjectPool<StringBuilder>(new StringBuilderPooledObjectPolicy());
var sb = pool.Get();
try {
    sb.Append("High throughput string formatting...");
    return sb.ToString();
} finally {
    pool.Return(sb); // Clears and returns to pool
}
\`\`\``,
    answerContent_fa: `### الگوی Flyweight و استخرهای حافظه (ArrayPool و ObjectPool)

تخصیص مداوم حافظه در برنامه‌های پرترافیک باعث فشار شدید روی Garbage Collector و توقف موقت برنامه (GC Pauses) می‌شود:

- **الگوی Flyweight:** تفکیک وضعیت‌های مشترک و تغییرناپذیر برای جلوگیری از تکرار اشیا در رم (مانند String Interning).
- **کلاس \`ArrayPool<T>.Shared\`:** قرض گرفتن بافرهای بایت از استخر حافظه با متد \`Rent\` و بازگرداندن آن با \`Return\` در بلوک \`finally\` برای جلوگیری از ورود بافرها به Large Object Heap (LOH).
- **کلاس \`ObjectPool<T>\`:** استفاده مجدد از اشیای سنگین مانند \`StringBuilder\` یا اتصالات شبکه به جای ساخت و تخریب مداوم آنها.`,
  },
  {
    id: "dotnet-senior-q318",
    stackId: "dotnet",
    categoryId: "system-design",
    levelId: "senior",
    topicIds: ["topic-dotnet-cap-pacelc"],
    questionTitle: "Explain the CAP Theorem and the PACELC Theorem in modern distributed data stores (SQL vs NoSQL vs Distributed SQL).",
    questionTitle_fa: "قضیه CAP و قضیه جامع‌تر PACELC را در پایگاه‌های داده توزیع‌شده مدرن (SQL، NoSQL و Distributed SQL مانند CockroachDB/Spanner) تحلیل کن.",
    answerContent: `### CAP Theorem vs. PACELC Theorem

#### 1. CAP Theorem Breakdown:
In any asynchronous distributed network, network partitions (**P**) are physically inevitable. Therefore, a distributed system must choose between:
- **CP (Consistency & Partition Tolerance):** Rejects writes or returns errors if nodes cannot agree, prioritizing strict data accuracy (e.g. MongoDB, Redis Sentinel, Google Spanner, HBase).
- **AP (Availability & Partition Tolerance):** Accepts writes on any reachable node and achieves **Eventual Consistency**, prioritizing 100% uptime (e.g. Apache Cassandra, Amazon DynamoDB, CouchDB).

#### 2. The PACELC Theorem (A More Complete Distributed Taxonomy):
The CAP theorem only describes behavior **during network partitions**. PACELC extends this to describe trade-offs during **normal operation**:

$$\\textbf{If (P)artition:} \\; \\text{Trade-off between } \\textbf{(A)vailability} \\text{ and } \\textbf{(C)onsistency}$$
$$\\textbf{(E)lse (Normal State):} \\; \\text{Trade-off between } \\textbf{(L)atency} \\text{ and } \\textbf{(C)onsistency}$$

| Database | PACELC Classification | Explanation |
| :--- | :--- | :--- |
| **MongoDB** | **PC/EC** | Under partition chooses Consistency; during normal state chooses strong Consistency over lower Latency. |
| **Cassandra / DynamoDB** | **PA/EL** | Under partition chooses Availability; during normal state chooses ultra-low Latency (eventual consistency). |
| **Google Spanner / CockroachDB** | **PC/EC** | Uses atomic hardware clocks (TrueTime) and Raft consensus for globally consistent distributed SQL transactions. |`,
    answerContent_fa: `### قضیه CAP و قضیه جامع‌تر PACELC در سیستم‌های توزیع‌شده

#### ۱. قضیه CAP:
در شبکه‌های توزیع‌شده بروز قطعی شبکه (**Partition**) اجتناب‌ناپذیر است، بنابراین سیستم باید بین دو حالت انتخاب کند:
- **مدل CP (سازگاری قطعی):** رد کردن درخواست‌ها در زمان قطعی تا تضمین شود هیچ داده متناقضی ثبت نمی‌شود (مانند Spanner و MongoDB).
- **مدل AP (دسترسی‌پذیری همیشگی):** پاسخ به تمام درخواست‌ها و دستیابی به سازگاری تدریجی (Eventual Consistency مانند Cassandra).

#### ۲. قضیه PACELC:
قضیه PACELC وضعیت عادی سیستم بدون قطعی شبکه را نیز مدل‌سازی می‌کند:
- **در زمان قطعی (Partition):** انتخاب بین **A**vailability یا **C**onsistency
- **در حالت عادی (Else):** انتخاب بین **L**atency پایین یا **C**onsistency بالا
- سیستم‌هایی مانند DynamoDB از نوع **PA/EL** (اولویت سرعت و آپ‌تایم) و سیستم‌های مالی مانند Spanner و CockroachDB از نوع **PC/EC** (اولویت قطعی سازگاری داده‌ها) هستند.`,
  },
  {
    id: "dotnet-senior-channels-q1",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-concurrency-channels-memory"],
    questionTitle: "How does System.Threading.Channels achieve high-throughput producer-consumer pipelines, and what are the trade-offs between Bounded and Unbounded channels?",
    questionTitle_fa: "ساختار System.Threading.Channels چگونه در سناریوهای Producer-Consumer توان پردازشی بالا ایجاد می‌کند و تفاوت‌های کانال‌های Bounded و Unbounded چیست؟",
    answerContent: `### High-Throughput Producer-Consumer Architecture with System.Threading.Channels

\`System.Threading.Channels\` is an asynchronous, lock-free, zero-allocation producer-consumer queue designed for high-scale pipeline architectures.

\`\`\`mermaid
flowchart LR
    P1[Producers: Web Controllers / Sockets] -->|WriteAsync non-blocking| CW[ChannelWriter]
    subgraph ChannelBuffer["Bounded Channel Buffer (e.g. 10,000 slots)"]
        CW --> RingBuffer["[Ring Buffer / Lock-Free Concurrent Nodes]"]
        RingBuffer --> CR[ChannelReader]
    end
    CR -->|ReadAllAsync stream| Consumers[Consumers: BackgroundService Worker]
\`\`\`

#### 1. Why Channels Outperform Traditional Primitives:
- **Vs. \`BlockingCollection<T>\`:** \`BlockingCollection\` blocks the calling OS thread synchronously on \`Take()\`. Under heavy loads, this rapidly starves the .NET ThreadPool. Channels are **async-first**: \`await reader.ReadAsync()\` registers an asynchronous continuation without holding any OS thread.
- **Vs. \`ConcurrentQueue<T>\`:** \`ConcurrentQueue\` is thread-safe but lacks asynchronous signaling (requiring inefficient busy-spinning or polling timers) and has zero backpressure support.
- **Separation of Concerns:** It cleanly exposes \`ChannelWriter<T>\` (injected into producers) and \`ChannelReader<T>\` (injected into consumers).

#### 2. Bounded vs. Unbounded Channels:

| Dimension | Unbounded Channel | Bounded Channel |
| :--- | :--- | :--- |
| **Creation** | \`Channel.CreateUnbounded<T>()\` | \`Channel.CreateBounded<T>(capacity)\` |
| **Memory Risk** | ⚠️ High (\`OutOfMemoryException\` under traffic spikes) | 🛡️ Fixed memory footprint |
| **Backpressure** | ❌ None | ✅ Full control via \`BoundedChannelFullMode\` |
| **Use Case** | Low-traffic internal events with guaranteed fast consumers | Production-grade high-throughput ingestion pipelines |

#### 3. Backpressure Handling in Bounded Channels:
When producers write faster than consumers can drain, \`BoundedChannelFullMode\` determines behavior:
- **\`Wait\`:** The producer's \`await writer.WriteAsync(item)\` asynchronously pauses without consuming CPU or thread resources until the consumer frees buffer space.
- **\`DropOldest\`:** Discards the oldest queued item to accept the latest (ideal for real-time market tickers or GPS tracking).
- **\`DropNewest\` / \`DropWrite\`:** Rejects new incoming payloads under load.`,
    answerContent_fa: `### معماری پردازش با توان بالا با استفاده از System.Threading.Channels

کتابخانه \`System.Threading.Channels\` یک ساختار صفی کاملاً ناهمگام، بدون قفل (Lock-Free) و با حداقل مصرف حافظه برای سناریوهای تولیدکننده-مصرف‌کننده (Producer-Consumer) در دات‌نت مدرن است.

#### ۱. دلایل برتری Channels بر ساختارهای سنتی:
- **در مقایسه با \`BlockingCollection<T>\`:** متد \`Take()\` در کلاس BlockingCollection نخ سیستم‌عامل را به صورت سنکرون قفل می‌کند که در ترافیک‌های بالا به سرعت باعث بحران ThreadPool Starvation می‌شود. در مقابل، Channels کاملاً Async-First بوده و با متد \`await ReadAsync()\` نخ را فوراً به ThreadPool بازمی‌گرداند.
- **در مقایسه با \`ConcurrentQueue<T>\`:** صف‌های همروند قابلیت ارسال سیگنال ناهمگام به مصرف‌کننده را ندارند و هیچ امکانی برای کنترل فشار ترافیک (Backpressure) فراهم نمی‌کنند.
- **تفکیک مسئولیت:** جداسازی کامل \`ChannelWriter<T>\` (جهت تزریق به کنترلرها) از \`ChannelReader<T>\` (جهت تزریق به ورکر سرویس‌ها).

#### ۲. مقایسه کانال‌های Bounded و Unbounded:
- **کانال‌های نامحدود (Unbounded):** تا زمان اتمام حافظه رم به رشد خود ادامه می‌دهند و در ترافیک‌های جهشی خطر پرتاب خطای \`OutOfMemoryException\` را به همراه دارند.
- **کانال‌های محدود (Bounded):** ظرفیت ثابتی دارند و با اعمال فشار معکوس (Backpressure) از اشباع رم جلوگیری می‌کنند.

#### ۳. استراتژی‌های Backpressure:
- **حالت \`Wait\`:** توقف ناهمگام تولیدکننده تا زمان خالی شدن ظرفیت توسط مصرف‌کننده (بدون مصرف CPU یا اشغال نخ).
- **حالت \`DropOldest\`:** حذف قدیمی‌ترین داده برای ثبت جدیدترین رکورد (مناسب برای داده‌های IoT و قیمت‌های لحظه‌ای بازار).`,
  },
  {
    id: "dotnet-senior-channels-q2",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-concurrency-channels-memory"],
    questionTitle: "What is ThreadPool Starvation in .NET, what causes it, how does the Hill-Climbing algorithm behave under starvation, and how do you diagnose and resolve it?",
    questionTitle_fa: "پدیده ThreadPool Starvation در دات‌نت چیست، چه عواملی باعث آن می‌شوند، الگوریتم Hill-Climbing چگونه با آن برخورد می‌کند و راهکار شناسایی و رفع آن چیست؟",
    answerContent: `### ThreadPool Starvation & The Hill-Climbing Algorithm in .NET

**ThreadPool Starvation** is a critical state where all available worker threads in the .NET ThreadPool are synchronously blocked, leaving zero threads to process incoming requests, timer callbacks, or asynchronous I/O completion continuations.

\`\`\`
[Sync-Over-Async Trap]
Thread 1: var data = GetReportAsync().Result; // Thread 1 BLOCKED waiting on DB I/O
Thread 2: var user = FetchUserAsync().Wait();  // Thread 2 BLOCKED waiting on HTTP
...
Thread N: All N worker threads in the pool are synchronously stalled!

[Kernel Socket / DB Driver returns result]
-> Runtime needs a ThreadPool thread to execute continuation!
-> NO THREADS AVAILABLE IN POOL!
-> System freezes while CPU drops to ~5%!
\`\`\`

#### 1. Why Starvation Kills Latency (The 500ms Injection Penalty):
The .NET ThreadPool uses the **Hill-Climbing Algorithm** to dynamically adjust thread counts based on measured throughput and CPU core saturation.
- When threads are actively progressing, the pool adds threads smoothly.
- **When Starvation Occurs:** Because the blocked threads make zero progress, the Hill-Climbing algorithm detects no throughput gain from additional threads. To prevent context-switch thrashing, it throttles new thread injection to **~1 new thread every 500 milliseconds**.
- If 50 threads are blocked, resolving the starvation takes $50 \\times 500\\text{ms} = 25\\text{ seconds}$, causing massive HTTP 504 timeouts!

#### 2. Root Causes of ThreadPool Starvation:
1. **Sync-Over-Async:** Calling \`.Result\`, \`.Wait()\`, \`.GetAwaiter().GetResult()\`, or \`Task.WaitAll()\` on incomplete Tasks.
2. **Blocking Synchronous I/O in Async Pipelines:** Calling \`Thread.Sleep()\`, synchronous \`File.ReadAllText()\`, or synchronous ADO.NET calls on ThreadPool threads.
3. **Improper Task.Run for Long-Running Loops:** Running indefinite \`while(true)\` background loops via \`Task.Run()\` without \`TaskCreationOptions.LongRunning\`.

#### 3. Production Diagnostics:
\`\`\`bash
# Real-time CLR ThreadPool metrics
dotnet-counters monitor --process-id <PID> --counters System.Runtime
\`\`\`
- **Symptoms:** \`ThreadPool Worker Thread Count\` climbs continuously (e.g. 30 -> 100 -> 250), \`ThreadPool Queue Length\` spikes into thousands, while \`CPU Usage\` remains paradoxically low ($5-15\\%$).

#### 4. Resolution & Best Practices:
- **100% Async All the Way Down:** Ensure every method from ASP.NET Core Action to EF Core / HTTP Client uses \`async/await\`.
- **Use Dedicated Threads for Heavy Loops:** Use \`Task.Factory.StartNew(..., TaskCreationOptions.LongRunning)\` or \`BackgroundService\` with \`Channel<T>\`.
- **Tune MinThreads proactively if third-party synchronous dependencies exist:** \`ThreadPool.SetMinThreads(workerThreads, completionPortThreads)\`.`,
    answerContent_fa: `### پدیده قفل‌شدگی و گرسنگی نخ‌ها (ThreadPool Starvation) در دات‌نت

**ThreadPool Starvation** شرایط بحرانی است که در آن تمام نخ‌های فعال موجود در ThreadPool به صورت همگام (Synchronous) قفل شده و معطل مانده‌اند، به طوری که هیچ نخی برای پردازش ریکوئست‌های جدید یا پاسخ به فراخوانی‌های I/O ناهمگام در صف باقی نمی‌ماند.

#### ۱. نحوه رفتار الگوریتم Hill-Climbing و جریمه ۵۰۰ میلی‌ثانیه‌ای:
الگوریتم **Hill-Climbing** در دات‌نت وظیفه تنظیم پویا و هوشمند تعداد نخ‌های ThreadPool را بر اساس توان عملیاتی (Throughput) برنامه و میزان درگیری CPU بر عهده دارد.
- وقتی نخ‌ها مسدود می‌شوند و هیچ کاری پیش نمی‌رود، الگوریتم فرض می‌کند اضافه کردن سریع نخ‌ها تنها باعث هدررفت CPU به دلیل جابجایی کانتکست (Context Switch) می‌شود.
- در نتیجه، سرعت تزریق نخ‌های جدید به شدت کاهش یافته و **تنها هر ۵۰۰ میلی‌ثانیه ۱ نخ جدید به استخر اضافه می‌شود**.
- اگر ۵۰ نخ مسدود شده باشند، بازگشت سیستم به حالت عادی بیش از ۲۵ ثانیه طول کشیده و سرور عملاً از دسترس خارج می‌شود (تایم‌اوت ۵۰۴).

#### ۲. دلایل اصلی بروز Starvation:
۱. **مسدودسازی ناهمگام با الگوهای غلط (Sync-over-Async):** فراخوانی مستقیم \`.Result\`، \`.Wait()\` یا \`.GetAwaiter().GetResult()\` روی Taskها.
۲. **عملیات I/O سنکرون درون کدهای سرور:** استفاده از \`Thread.Sleep()\`، توابع همگام خواندن دیسک یا کوئری‌های بلاکینگ دیتابیس.
۳. **اجرای حلقه‌های طولانی با Task.Run:** مصرف دائمی نخ‌های ThreadPool برای جاب‌های پس‌زمینه بدون استفاده از فلگ \`LongRunning\`.

#### ۳. ابزار مانیتورینگ در پروداکشن:
با دستور \`dotnet-counters monitor --process-id <PID> --counters System.Runtime\` شاخص‌های \`ThreadPool Worker Thread Count\` و \`ThreadPool Queue Length\` را بررسی کنید. در زمان Starvation، طول صف تسک‌ها به چند هزار می‌رسد در حالی که مصرف CPU به دلیل قفل بودن نخ‌ها بسیار پایین است.`,
  },
  {
    id: "dotnet-senior-channels-q3",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-concurrency-channels-memory"],
    questionTitle: "What is the exact internal memory and runtime difference between Task<T> and ValueTask<T>, and what critical anti-patterns must be avoided when consuming ValueTask?",
    questionTitle_fa: "تفاوت دقیق ساختاری و مدیریت حافظه بین Task<T> و ValueTask<T> در دات‌نت چیست و چه ضدالگوهای مرگباری در استفاده از ValueTask وجود دارد؟",
    answerContent: `### Task<T> vs. ValueTask<T>: Internal Mechanics & Consumption Rules

\`Task<T>\` and \`ValueTask<T>\` serve fundamentally different allocation profiles in modern .NET high-performance architectures.

\`\`\`mermaid
flowchart TD
    subgraph TaskType["Task&lt;T&gt; (Reference Type)"]
        T1["Allocated on Managed Heap (~64-128 bytes)"]
        T2["Requires GC Tracking &amp; Gen 0 Collections"]
        T3["Safe for multiple awaits, Task.WhenAll, caching"]
    end

    subgraph ValueTaskType["ValueTask&lt;T&gt; (Value Type / Struct)"]
        V1["Allocated on Thread Stack (Zero Heap Allocations on Fast Path)"]
        V2["Wraps either 'TResult' OR 'Task&lt;T&gt;' OR 'IValueTaskSource&lt;T&gt;'"]
        V3["Reusable pooled backing sources (Zero-alloc state machines)"]
    end
\`\`\`

#### 1. Internal Memory Representation:
- **\`Task<T>\`:** A managed class instance on the Heap. Allocates memory even when the operation finishes synchronously (unless using pre-cached tasks like \`Task.FromResult\`).
- **\`ValueTask<T>\`:** A 2-field discriminated union \`struct\`:
  \`\`\`csharp
  public readonly struct ValueTask<TResult>
  {
      private readonly object? _obj;      // Null if completed synchronously, or Task<T> / IValueTaskSource<T>
      private readonly TResult _result;   // Direct result value if completed synchronously
  }
  \`\`\`
  When a method completes synchronously, \`_obj\` is \`null\` and \`_result\` holds the data directly on the stack—**generating zero GC heap allocations**.

#### 2. When to Use ValueTask<T>:
Use \`ValueTask<T>\` **only when $>90\\%$ of invocations complete synchronously**.
- **Ideal Example:** In-memory caching layer (\`IMemoryCache.TryGetValue\`).
- **Counter-Example:** Long-running database or external HTTP API calls that are always asynchronous. In purely asynchronous paths, \`ValueTask<T>\` is slightly larger (struct copy overhead) and provides zero allocation advantage over \`Task<T>\`.

#### 3. Fatal Anti-Patterns with ValueTask (The 3 Deadly Sins):
1. **Double Awaiting a \`ValueTask\`:**
   \`\`\`csharp
   // ❌ FATAL BUG: If backed by IValueTaskSource, the underlying object 
   // is returned to an internal pool upon the first await!
   var vt = service.GetCachedItemAsync();
   var res1 = await vt; 
   var res2 = await vt; // Memory corruption or InvalidOperationException!
   \`\`\`
2. **Concurrent Awaits with \`Task.WhenAll\`:**
   \`\`\`csharp
   // ❌ BAD: ValueTask does not support concurrent multi-consumer awaits
   await Task.WhenAll(vt1.AsTask(), vt2.AsTask()); // Must convert via .AsTask()!
   \`\`\`
3. **Storing a \`ValueTask\` in a class field or long-lived collection:**
   \`ValueTask\` is a transient stack struct and must be consumed immediately.`,
    answerContent_fa: `### کالبدشکافی تفاوت ساختاری Task<T> و ValueTask<T> در دات‌نت

کلاس \`Task<T>\` و استراکت \`ValueTask<T>\` دو رویکرد کاملاً متفاوت برای مدیریت تخصیص حافظه در برنامه‌نویسی ناهمگام هستند:

#### ۱. تفاوت ساختار داخلی در حافظه:
- **نوع \`Task<T>\`:** یک Reference Type روی Heap است. ساخت هر تسک جدید حدود ۶۴ تا ۱۲۸ بایت حافظه اشغال می‌کند که در حلقه‌های سنگین باعث فشار شدید به Garbage Collector در نسل Gen 0 می‌شود.
- **نوع \`ValueTask<T>\`:** یک استراکت (Value Type) است که شامل دو فیلد \`_obj\` (اشاره‌گر به تسک یا اینترفیس \`IValueTaskSource\`) و فیلد مستقیم \`_result\` است. اگر عملیات به صورت همگام کامل شود، مقدار نتیجه مستقیماً روی استک قرار گرفته و **صفر بایت حافظه Heap اشغال می‌شود**.

#### ۲. موارد کاربرد بهینه:
تنها در صورتی از \`ValueTask<T>\` استفاده کنید که متد در بیش از **۹۰٪ مواقع به صورت همگام** (مانند خواندن از کش محلی در رم) خروجی را برمی‌گرداند. در متدهایی که همیشه نیاز به I/O شبکه یا دیتابیس دارند، استفاده از Task معمولی ترجیح دارد چون کپی کردن استراکت بزرگتر هزینه اضافی دارد.

#### ۳. ضدالگوهای خطرناک در مصرف ValueTask:
۱. **چندین بار Await کردن یک ValueTask:** اگر این استراکت بر پایه \`IValueTaskSource\` استخری پیاده شده باشد، پس از اولین Await شیء مربوطه بازیافت شده و Await دوم منجر به خطای فساد حافظه می‌شود.
۲. **استفاده مستقیم در Task.WhenAll:** برای اجرای موازی باید ابتدا با متد \`.AsTask()\` آن را به تسک معمولی تبدیل کرد.
۳. **نگهداری در فیلدهای کلاس:** ساختار \`ValueTask\` باید بلافاصله مصرف شود و نباید به عنوان وضعیت در اشیای ماندگار ذخیره گردد.`,
  },
  {
    id: "dotnet-senior-channels-q4",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-concurrency-channels-memory"],
    questionTitle: "How do SingleWriter and SingleReader channel options optimize concurrency under the hood, and how does Backpressure work with BoundedChannelFullMode?",
    questionTitle_fa: "تنظیمات SingleWriter و SingleReader در کانال‌های سی‌شارپ چگونه در سطح سخت‌افزار بهینه‌سازی انجام می‌دهند و مکانیزم Backpressure با BoundedChannelFullMode چگونه کار می‌کند؟",
    answerContent: `### Hardware-Level Concurrency Optimizations in System.Threading.Channels

When constructing a channel using \`BoundedChannelOptions\`, configuring \`SingleWriter\` and \`SingleReader\` drastically affects the internal lock-free algorithms and CPU cache line behavior.

\`\`\`csharp
var options = new BoundedChannelOptions(capacity: 5_000)
{
    SingleWriter = false,                  // Multi-producer (Concurrent HTTP controllers)
    SingleReader = true,                   // Single-consumer (Dedicated BackgroundService)
    FullMode = BoundedChannelFullMode.Wait // Non-blocking backpressure
};
var channel = Channel.CreateBounded<EventMessage>(options);
\`\`\`

#### 1. Under the Hood: \`SingleReader = true\` Optimization
- **Without SingleReader (Multi-Reader):** Multiple consuming threads must compete for the head pointer of the queue. The runtime must use **Interlocked CAS (Compare-And-Swap) loops** and volatile memory barriers. Under heavy multi-core contention, CPU cache lines bounce between processor cores (False Sharing / Cache Coherence traffic), degrading throughput.
- **With \`SingleReader = true\`:** The runtime activates a specialized single-consumer queue. Because only one thread advances the read index, **all CAS synchronization on the reader pointer is completely eliminated**, achieving up to **$2.5\\times$ higher message throughput**.

#### 2. Under the Hood: \`SingleWriter = true\` Optimization
- Eliminates atomic CAS operations when advancing the queue's tail pointer, enabling linear instruction execution on the producer core.

#### 3. How Backpressure Operates with \`BoundedChannelFullMode\`:
Backpressure is the ability of a downstream system (consumer) to regulate the rate of data pushed by an upstream system (producer) to prevent memory exhaustion.

\`\`\`mermaid
flowchart TD
    Producer[Producer: HTTP Webhook Request] -->|1. WriteAsync| Queue{Channel Buffer Full?}
    Queue -- Yes: BoundedChannelFullMode.Wait --> Suspend[2. Writer Async Suspended via ValueTask]
    Queue -- No: Space Available --> Write[3. Enqueued Instantly]
    Consumer[Consumer Worker] -->|4. Reads Batch & Frees Space| Queue
    Queue -.->|5. Signals Suspended Writer to Resume| Suspend
\`\`\`

- **The Non-Blocking Wait Mechanism:** When capacity is reached, \`WriteAsync\` returns an incomplete \`ValueTask\` registered against an internal node awaiter. The producer's thread is released back to the ThreadPool. When the consumer calls \`ReadAsync\`, it atomically frees a slot and triggers the continuation of the waiting writer.`,
    answerContent_fa: `### بهینه‌سازی‌های سخت‌افزاری و مکانیزم Backpressure در کانال‌های دات‌نت

تنظیمات \`SingleWriter\` و \`SingleReader\` در زمان ایجاد کانال، الگوریتم‌های مدیریت همروندی در سطح ثبات‌ها و کش CPU را دگرگون می‌کنند:

#### ۱. سازوکار بهینه‌سازی \`SingleReader = true\`:
- **در حالت چند مصرف‌کننده (Multi-Reader):** چندین نخ به صورت همزمان برای خواندن اشاره‌گر ابتدای صف رقابت می‌کنند. ران‌تایم مجبور است از عملیات اتمیک CAS (Compare-And-Swap) و Memory Barrier استفاده کند که باعث ایجاد ترافیک سنگین همگام‌سازی بین هسته‌های پردازنده (Cache Line Bouncing) می‌شود.
- **در حالت تک مصرف‌کننده (\`SingleReader = true\`):** چون تنها یک نخ اشاره‌گر خواندن را جلو می‌برد، تمام قفل‌ها و عملیات رقابتی اتمیک حذف شده و سرعت خواندن تا **۲.۵ برابر** افزایش می‌یابد.

#### ۲. سازوکار \`SingleWriter = true\`:
- حذف کامل عملیات همگام‌سازی اتمیک در زمان اضافه کردن آیتم‌ها به انتهای بافر صف.

#### ۳. مدیریت فشار ترافیک (Backpressure) با \`BoundedChannelFullMode.Wait\`:
وقتی ظرفیت بافر پر می‌شود:
- متد \`await WriteAsync()\` بدون مسدودسازی فیزیکی نخ سیستم‌عامل، اجرای تسک تولیدکننده را معلق (Suspend) کرده و نخ را به ThreadPool بازمی‌گرداند.
- به محض اینکه مصرف‌کننده داده‌ای را پردازش کند، فضای خالی ایجاد شده سیگنال ادامه‌ کار را به تولیدکننده ارسال می‌کند تا جریان داده با سرعت متناسب با توان پردازشی مصرف‌کننده هدایت شود.`,
  },
  {
    id: "dotnet-senior-channels-q5",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-concurrency-channels-memory", "topic-dotnet-span-memory"],
    questionTitle: "What are ref struct, Span<T>, and Memory<T>, why is Span<T> forbidden across await points in async state machines, and how do you achieve zero-copy I/O?",
    questionTitle_fa: "انواع ref struct، Span<T> و Memory<T> چه تفاوت‌هایی دارند، چرا استفاده از Span در طول دستورات await ممنوع است و چگونه I/O با صفر تخصیص حافظه پیاده‌سازی می‌شود؟",
    answerContent: `### Memory Architecture: ref struct, Span<T>, and Memory<T> in C#

In modern C#, \`Span<T>\` and \`Memory<T>\` represent contiguous regions of arbitrary memory (Managed Heap arrays, Stack-allocated buffers via \`stackalloc\`, or Native unmanaged pointers) with type safety and bounds checking.

\`\`\`mermaid
flowchart TD
    subgraph SpanStruct["Span&lt;T&gt; (ref struct)"]
        S1["Pointer: ref byte _pointer"]
        S2["Length: int _length"]
        S3["Location: STRICTLY on Thread Stack"]
        S4["Usage: Synchronous zero-copy slicing"]
    end

    subgraph MemoryStruct["Memory&lt;T&gt; (Standard struct)"]
        M1["Object: object? _object (Array/String/Owner)"]
        M2["Index &amp; Length: int _index, int _length"]
        M3["Location: Stack OR Heap (Allowed in Fields/Async)"]
        M4["Usage: Asynchronous buffer across await boundaries"]
    end
\`\`\`

#### 1. Why \`Span<T>\` is a \`ref struct\`:
\`Span<T>\` is defined as \`readonly ref struct Span<T>\`. A \`ref struct\` has absolute memory safety guarantees enforced by the C# compiler:
- It **must always live on the Thread Stack**.
- It can **never be placed on the Managed Heap** (cannot be a field of a normal class, cannot be boxed, cannot be an element of an array \`Span<T>[]\`, cannot implement interfaces).

#### 2. Why \`Span<T>\` is Forbidden Across \`await\` Points:
When the Roslyn compiler compiles an \`async\` method, it transforms the method into an **asynchronous state machine** (\`IAsyncStateMachine\`).
- When execution hits an \`await\` that does not complete synchronously, the state machine instance is boxed/stored on the **Managed Heap** to preserve local variables until the asynchronous I/O completes.
- Because a \`Span<T>\` cannot legally reside on the Managed Heap, holding a \`Span<T>\` across an \`await\` generates a compile-time error (\`CS4007: An expression of type 'Span<T>' cannot be used in an async method across await boundaries\`).

#### 3. The Architecture Pattern for Zero-Copy Async I/O:
To achieve zero-copy streaming across asynchronous network/storage boundaries:
1. Use **\`Memory<T>\` / \`ReadOnlyMemory<T>\`** across \`await\` points.
2. Inside synchronous calculation blocks, convert \`memory.Span\` for maximum slicing speed.

\`\`\`csharp
public async Task ProcessSocketStreamAsync(Stream socketStream, int expectedBytes)
{
    // 1. Rent buffer to avoid LOH fragmentation
    byte[] rawBuffer = ArrayPool<byte>.Shared.Rent(expectedBytes);

    try
    {
        // 2. Read asynchronously using Memory<T> (safe across await)
        int bytesRead = await socketStream.ReadAsync(rawBuffer.AsMemory(0, expectedBytes));

        // 3. Process synchronously with Span<T> (zero heap allocations)
        ReadOnlySpan<byte> dataSpan = rawBuffer.AsSpan(0, bytesRead);
        ParseHeaderAndPayload(dataSpan);
    }
    finally
    {
        // 4. Return to pool
        ArrayPool<byte>.Shared.Return(rawBuffer);
    }
}

private void ParseHeaderAndPayload(ReadOnlySpan<byte> data)
{
    ReadOnlySpan<byte> header = data.Slice(0, 16);
    ReadOnlySpan<byte> body = data.Slice(16);
    // Direct zero-copy parsing
}
\`\`\``,
    answerContent_fa: `### معماری مدیریت حافظه: انواع ref struct، Span و Memory در دات‌نت

در زبان C#، ساختارهای \`Span<T>\` و \`Memory<T>\` برای دسترسی یکپارچه و امن به بخش‌های پیوسته حافظه (آرایه‌های Managed Heap، بافرهای سریع روی استک با \`stackalloc\` و بافرهای حافظه Unmanaged) بدون کپی داده‌ها استفاده می‌شوند.

#### ۱. مفهوم \`ref struct\` در \`Span<T>\`:
ساختار \`Span<T>\` به صورت \`ref struct\` تعریف شده است و قوانین سفت و سختی دارد:
- این نوع فقط و فقط مجاز است روی حافظه **Thread Stack** قرار بگیرد.
- هرگز اجازه ورود به **Managed Heap** را ندارد (نمی‌تواند فیلد یک کلاس معمولی باشد، نمی‌تواند Box شود و نمی‌تواند عضوی از یک آرایه شیء‌گرا باشد).

#### ۲. چرا استفاده از \`Span<T>\` در طول دستورات \`await\` ممنوع است؟
کامپایلر سی‌شارپ متدهای ناهمگام را به یک کلاس/استراکت State Machine تبدیل می‌کند. هنگامی که اجرای کد به یک دستور \`await\` معلق می‌رسد، وضعیت متد روی Managed Heap ذخیره می‌شود تا پس از اتمام I/O بازیابی گردد. چون \`Span<T>\` قانوناً حق قرارگیری روی Heap را ندارد، کامپایلر اجازه نگهداری آن در طول \`await\` را نداده و خطای کامپایل \`CS4007\` صادر می‌کند.

#### ۳. الگوی استاندارد I/O بدون تخصیص حافظه (Zero-Copy):
۱. برای انتقال بافرها از میان توابع ناهمگام و عبور از خطوط \`await\` از **\`Memory<T>\`** استفاده کنید.
۲. در داخل بلاک‌های محاسباتی و پردازش داده‌ها، با دستور \`memory.Span\` آن را به Span تبدیل کرده و بدون ۱ بایت کپی کردن حافظه عملیات را انجام دهید.
۳. از \`ArrayPool<byte>.Shared\` برای تامین بافرهای اشتراکی استفاده کرده و حتماً در بلوک \`finally\` آن را پس دهید.`,
  },
  {
    id: "dotnet-senior-modular-q1",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "How does Vertical Slice Architecture (VSA) differ from layered Clean Architecture in high-frequency feature development, and how do you organize requests, handlers, and validators with FastEndpoints or MediatR?",
    questionTitle_fa: "معماری برش عمودی (Vertical Slice) چه تفاوت‌های بنیادینی با Clean Architecture دارد و چگونه ساختار Request، Handler و Validatorها را با FastEndpoints یا MediatR سازماندهی می‌کنید؟",
    answerContent: `### Vertical Slice Architecture (VSA) vs. Clean Architecture

Vertical Slice Architecture organizes a codebase around **Business Features and Use Cases (Vertical Slices)** rather than technical layers (Horizontal Slices: Controllers, Services, Repositories).

\`\`\`
[Clean Architecture: Layer Hopping]          [Vertical Slice: High Cohesion Feature Folder]
src/                                         src/Features/Orders/
├── Domain/Entities/Order.cs                 └── CreateOrder/
├── Application/Orders/CreateOrder.cs            ├── CreateOrderEndpoint.cs (FastEndpoints / Controller)
├── Infrastructure/Data/OrderRepository.cs       ├── CreateOrderCommand.cs (Request DTO)
└── Presentation/Controllers/OrderCtrl.cs        ├── CreateOrderValidator.cs (FluentValidation)
                                                 └── CreateOrderHandler.cs (EF Core / Domain logic)
\`\`\`

#### 1. Why Vertical Slices Accelerate Velocity:
- **Zero Folder Hopping:** All code related to \`CreateOrder\` lives in one place. You can read, modify, and test the entire slice in a single mental context.
- **Tailored Persistence per Slice:**
  - Complex Write: \`CreateOrder\` uses rich Aggregate Roots and EF Core change tracking.
  - High-Speed Read: \`GetOrderHistory\` uses raw Dapper queries with zero entity mapping overhead.
- **Low Blast Radius:** Changing or deleting \`CreateOrder\` has zero risk of breaking \`GetOrderById\`.

#### 2. Native VSA Implementation with FastEndpoints:
\`\`\`csharp
// Single file encapsulating the entire HTTP feature slice
public record CreateUserRequest(string Email, string FullName);
public record CreateUserResponse(Guid Id, string Email);

public class CreateUserValidator : Validator<CreateUserRequest>
{
    public CreateUserValidator() => RuleFor(x => x.Email).NotEmpty().EmailAddress();
}

public class CreateUserEndpoint : Endpoint<CreateUserRequest, CreateUserResponse>
{
    private readonly AppDbContext _db;
    public CreateUserEndpoint(AppDbContext db) => _db = db;

    public override void Configure() => Post("/api/users");

    public override async Task HandleAsync(CreateUserRequest req, CancellationToken ct)
    {
        var user = new User(req.Email, req.FullName);
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        await SendOkAsync(new CreateUserResponse(user.Id, user.Email), ct);
    }
}
\`\`\``,
    answerContent_fa: `### مقایسه معماری برش عمودی (Vertical Slice) با Clean Architecture

معماری Vertical Slice کدها را بر اساس **قابلیت‌های بیزینسی (Features)** به جای لایه‌های فنی افقی (مانند Controllers، Services و Repositories) گروه‌بندی می‌کند.

#### ۱. مزایای معماری Vertical Slice:
- **حذف پرش مداوم بین فولدرها (No Folder Hopping):** تمام اجزای مربوط به یک قابلیت (درخواست، اعتبارسنجی FluentValidation، هندلر و خروجی) درون یک پوشه واحد قرار دارند.
- **آزادی در انتخاب شیوه دسترسی به داده:**
  - دستورات نوشتن پیچیده از انتیتی‌های غنی DDD و EF Core استفاده می‌کنند.
  - کوئری‌های خواندن پرترافیک مستقیماً با Dapper و بدون ساخت انتیتی یا مپینگ‌های سنگین اجرا می‌شوند.
- **کاهش شدید ریسک تغییرات:** دستکاری در یک قابلیت هیچ اثری روی قابلیت‌های دیگر سیستم نخواهد داشت.

#### ۲. پیاده‌سازی با فریم‌ورک مدرن FastEndpoints:
کتابخانه FastEndpoints بر بستر Minimal APIs دات‌نت ساخته شده و کنترلرهای حجیم MVC را با کلاس‌های مستقل \`Endpoint<TRequest, TResponse>\` جایگزین می‌کند تا هر قابلیت به صورت خودکفا پیاده‌سازی شود.`,
  },
  {
    id: "dotnet-senior-modular-q2",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "How do you enforce architectural boundaries and dependency rules in .NET CI/CD pipelines using NetArchTest or ArchUnitNET?",
    questionTitle_fa: "چگونه مرزهای معماری و قوانین وابستگی را با استفاده از NetArchTest یا ArchUnitNET در پایپ‌لاین‌های CI/CD دات‌نت اعتبارسنجی و محافظت می‌کنید؟",
    answerContent: `### Automated Architecture Testing with NetArchTest.Rules in .NET

Relying on code reviews to preserve architectural rules inevitably leads to architectural decay over time. **Architecture Testing as Code** executes automated unit tests in CI/CD pipelines to fail the build if dependency rules are violated.

\`\`\`mermaid
flowchart LR
    Dev[Developer Commits Code] --> PR[Pull Request / CI Pipeline]
    PR --> ArchTest{NetArchTest Suite}
    ArchTest -- Domain references Infra --> Fail[❌ Build FAILED: Boundary Violated]
    ArchTest -- All layers strictly clean --> Pass[✅ Build PASSED]
\`\`\`

#### 1. Core NetArchTest Scenarios:
\`\`\`csharp
using NetArchTest.Rules;
using Xunit;

public class ArchitectureRuleTests
{
    [Fact]
    public void Domain_Layer_Must_Not_Reference_Outer_Layers()
    {
        var domainAssembly = typeof(MyApp.Domain.AssemblyReference).Assembly;

        TestResult result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny("MyApp.Application", "MyApp.Infrastructure", "MyApp.Presentation")
            .GetResult();

        Assert.True(result.IsSuccessful, "Domain layer must have zero dependencies on outer layers!");
    }

    [Fact]
    public void Modular_Monolith_Modules_Must_Not_Access_Internal_Namespaces_Of_Other_Modules()
    {
        var ordersAssembly = typeof(MyApp.Modules.Orders.AssemblyReference).Assembly;

        // Orders module may ONLY reference MyApp.Modules.Users.Contracts
        TestResult result = Types.InAssembly(ordersAssembly)
            .ShouldNot()
            .HaveDependencyOn("MyApp.Modules.Users.Infrastructure")
            .And()
            .HaveDependencyOn("MyApp.Modules.Users.Domain")
            .GetResult();

        Assert.True(result.IsSuccessful, "Orders module illegally referenced Users module internal implementations!");
    }

    [Fact]
    public void CQRS_Handlers_Must_Be_Internal_And_Have_Handler_Suffix()
    {
        var applicationAssembly = typeof(MyApp.Application.AssemblyReference).Assembly;

        TestResult result = Types.InAssembly(applicationAssembly)
            .That()
            .ImplementInterface(typeof(MediatR.IRequestHandler<,>))
            .Should()
            .NotBePublic()
            .And()
            .HaveNameEndingWith("Handler")
            .GetResult();

        Assert.True(result.IsSuccessful, "All MediatR handlers must be internal and end with 'Handler'.");
    }
}
\`\`\``,
    answerContent_fa: `### اعتبارسنجی خودکار معماری با NetArchTest در پایپ‌لاین CI/CD دات‌نت

اتکا به فرآیند بازبینی کد (Code Review) دستی برای حفظ مرزهای معماری معمولاً به مرور زمان شکست می‌خورد. با استفاده از پکیج **\`NetArchTest.Rules\`** یا **\`ArchUnitNET\`**، قوانین معماری به عنوان تست‌های واحد استاندارد نوشته شده و در صورت نقض مرزها بیلد CI/CD بلافاصله متوقف می‌شود.

#### قوانین حیاتی که باید با تست محافظت شوند:
۱. **استقلال هسته Domain:** لایه Domain نباید به هیچ وجه به لایه‌های Application، Infrastructure یا Presentation وابستگی داشته باشد.
۲. **ایزولاسیون ماژول‌ها در Modular Monolith:** ماژول سفارشات حق دسترسی به کدهای داخلی (Domain یا Infrastructure) ماژول کاربران را ندارد و فقط می‌تواند پکیج \`Contracts\` آن را مصرف کند.
۳. **قوانین طراحی کلاس‌ها:** تمام هندلرهای CQRS باید با کلمه کلیدی \`internal\` تعریف شوند و پسوند نام آن‌ها حتماً \`Handler\` باشد.`,
  },
  {
    id: "dotnet-senior-modular-q3",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "How do you achieve database and transactional isolation between modules in a .NET Modular Monolith (DbContext per module, schema isolation, and cross-module queries)?",
    questionTitle_fa: "ایزولاسیون پایگاه داده و مرزهای تراکنشی بین ماژول‌ها در الگوی Modular Monolith (تفکیک اسکیماها، DbContext مجزا و کوئری‌های بین ماژولی) چگونه پیاده‌سازی می‌شود؟",
    answerContent: `### Database & Transactional Isolation in a .NET Modular Monolith

A true Modular Monolith requires strict data isolation at the storage layer to prevent modules from tightly coupling through database tables.

\`\`\`
[Shared Physical Database]
├── Schema: "users"   ──► UsersDbContext (Owned by Users Module)
│   ├── users.Users
│   └── users.Permissions
├── Schema: "orders"  ──► OrdersDbContext (Owned by Orders Module)
│   ├── orders.Orders
│   └── orders.OrderItems (NO Foreign Key to users.Users!)
└── Schema: "billing" ──► BillingDbContext (Owned by Billing Module)
    └── billing.Invoices
\`\`\`

#### 1. Schema-Based Isolation Rules:
- **Dedicated Database Schema per Module:** In PostgreSQL/SQL Server, each module maps to a separate schema (\`modelBuilder.HasDefaultSchema("orders")\`).
- **Dedicated \`DbContext\` per Module:** Each module registers its own isolated \`DbContext\`. This prevents DbContext bloat and ensures migrations are isolated.
- **Prohibition of Cross-Schema Foreign Keys:** Tables in \`orders\` must **NEVER** have Foreign Key constraints referencing tables in \`users\`. Only primitive IDs (\`Guid CustomerId\`) are stored.
- **Prohibition of Cross-Schema SQL Joins:** A query must never join \`orders.Orders\` with \`users.Users\`.

#### 2. Cross-Module Data Queries:
When the Orders module needs customer metadata for display:
1. **Synchronous Facade Call:** Call the public \`IUsersModuleApi\` contract which returns an immutable \`UserSummaryDto\`.
2. **Local Read Cache / Read Replica:** If high throughput is needed, the Orders module subscribes to \`UserUpdatedIntegrationEvent\` and maintains a lightweight local read projection (\`orders.CustomerCache\`).

#### 3. Transaction Boundaries & Eventual Consistency:
Do not share physical database transactions across modules. A business transaction spans module boundaries via **Integration Events** and eventual consistency (using the Transactional Outbox pattern).`,
    answerContent_fa: `### ایزولاسیون پایگاه داده و مرزهای تراکنشی در Modular Monolith

در یک مونوپروژه ماژولار اصولی، ایزولاسیون داده‌ها در لایه ذخیره‌سازی باید به طور کامل رعایت شود تا ماژول‌ها از طریق جداول دیتابیس به یکدیگر گره نخورند:

#### ۱. اصول ایزوله‌سازی بر اساس اسکیما (Schema Isolation):
- **اسکیمای مجزا برای هر ماژول:** در دیتابیس (SQL Server یا PostgreSQL)، هر ماژول اسکیمای اختصاصی خود را دارد (\`orders\`، \`users\` و \`billing\`).
- **کلاس \`DbContext\` مستقل برای هر ماژول:** هر ماژول کلاس DbContext و فایل‌های مایگریشن مجزای خود را مدیریت می‌کند.
- **ممنوعیت کلیدهای خارجی (Foreign Key) بین ماژول‌ها:** جداول ماژول سفارشات هرگز نباید ارتباط فیزیکی FK با جداول کاربران داشته باشند و تنها شناسه کاربر (\`Guid CustomerId\`) ذخیره می‌شود.
- **ممنوعیت دستورات Join بین‌ماژولی:** هیچ کوئری SQL حق اتصال جداول دو ماژول مختلف را ندارد.

#### ۲. نحوه خواندن داده‌های مشترک:
- استفاده از متدهای فاساد عمومی ماژول مقصد (\`IUsersModuleApi\`) که یک DTO تغییرناپذیر برمی‌گرداند.
- نگهداری کپی سبک از اطلاعات در جدول کش همان ماژول با گوش دادن به رویدادهای یکپارچگی (\`UserUpdatedIntegrationEvent\`).

#### ۳. مدیریت تراکنش‌ها:
ماژول‌ها نباید تراکنش دیتابیس یکدیگر را به اشتراک بگذارند. ارتباطات چندماژولی باید با استفاده از الگوی Transactional Outbox و رویدادهای ناهمگام (Eventual Consistency) مدیریت شوند.`,
  },
  {
    id: "dotnet-senior-modular-q4",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "How do modules communicate in a Modular Monolith without tight coupling (Synchronous Public Module Facades vs In-Process Event Bus vs Outbox Integration Events)?",
    questionTitle_fa: "روش‌های بهینه ارتباط بین ماژول‌ها در مونوپروژه‌های ماژولار (فاسادهای عمومی همگام، Event Bus درون‌پروسسی و رویدادهای یکپارچگی Outbox) چیست؟",
    answerContent: `### Inter-Module Communication Strategies in a Modular Monolith

Decoupling modules requires combining synchronous queries for instant data retrieval with asynchronous events for side effects.

\`\`\`mermaid
flowchart TD
    subgraph Synchronous["1. Synchronous Queries (Direct Contract Call)"]
        Orders1[Orders Module] -->|Calls Contract Interface| UserFacade["IUsersModuleApi.GetUser(id)"]
        UserFacade -->|Returns Immutable DTO| Orders1
    end

    subgraph Asynchronous["2. Asynchronous Side Effects (In-Process Event Bus)"]
        Orders2[Orders Module] -->|Emits OrderCreatedEvent| EventBus[In-Process Event Bus / MediatR]
        EventBus -->|Async Handler| Billing[Billing Module: Create Invoice]
        EventBus -->|Async Handler| Inventory[Inventory Module: Reserve Stock]
    end
\`\`\`

#### 1. Synchronous Public Module Facades (For Reads & Queries):
- When a module needs data immediately to validate its business logic:
- The target module exports a **Contracts project** (\`Modules.Users.Contracts\`) containing an interface (\`IUsersModuleApi\`) and lightweight DTOs.
- The consumer references **ONLY** the Contracts project, completely unaware of the target module's internal Domain, DbContext, or Repositories.

#### 2. Asynchronous In-Process Event Bus (For Decoupled Side Effects):
- When a domain state change in Module A triggers actions in Module B:
- Module A publishes an \`IntegrationEvent\` implementing \`MediatR.INotification\`.
- Module B implements \`INotificationHandler<T>\` to execute its side effects asynchronously.
- **Advantage:** Zero network serialization, nanosecond delivery, and complete decoupling.

#### 3. Transactional Outbox for Resilient In-Process Integration Events:
If Module B's operation must be guaranteed even if the server crashes right after Module A saves its state:
- Save the \`IntegrationEvent\` into Module A's Outbox table in the same local database transaction.
- An in-process background worker polls the Outbox table and dispatches events via the in-process event bus.`,
    answerContent_fa: `### الگوهای ارتباطات بین ماژول‌ها در Modular Monolith

برای برقراری ارتباط بدون ایجاد وابستگی شدید (Tight Coupling) بین ماژول‌ها از دو رویکرد مکمل استفاده می‌شود:

#### ۱. فاسادهای عمومی همگام (Public Module Facades) برای کوئری‌ها:
- ماژول مقصد یک پروژه سبک \`Contracts\` شامل اینترفیس پابلیک (\`IUsersModuleApi\`) و DTOهای خروجی منتشر می‌کند.
- ماژول‌های دیگر فقط این پروژه Contracts را رفرنس می‌دهند و از جزئیات داخلی (انتیتی‌ها، DbContext یا کدهای بیزینس) ماژول مقصد کاملاً بی‌خبر می‌مانند.

#### ۲. انتشار رویدادهای ناهمگام با Event Bus درون‌پروسسی:
- برای عوارض جانبی (مانند صدور فاکتور پس از ثبت سفارش)، ماژول مبدأ یک رویداد عمومی (\`OrderCreatedIntegrationEvent\`) را در صف درون‌حافظه‌ای MediatR منتشر می‌کند.
- ماژول‌های مقصد با پیاده‌سازی \`INotificationHandler\` به صورت کاملاً مستقل و ناهمگام به این رویداد واکنش نشان می‌دهند.

#### ۳. الگوی Transactional Outbox برای تضمین پایداری:
برای اطمینان از اینکه قطعی سرور بلافاصله بعد از ثبت سفارش باعث از دست رفتن رویداد فاکتور نشود، رویدادها در همان تراکنش دیتابیس درون جدول Outbox ماژول مبدأ ثبت شده و توسط ورکر پس‌زمینه پردازش می‌شوند.`,
  },
  {
    id: "dotnet-senior-modular-q5",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "senior",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "What are the common architectural pitfalls and anti-patterns of Clean Architecture in .NET (e.g. Generic Repository bloat, over-abstraction of simple CRUD, anemic domain models with MediatR), and when should you refactor to Vertical Slices?",
    questionTitle_fa: "ضدالگوها و تله‌های رایج در پیاده‌سازی Clean Architecture در دات‌نت (مانند Generic Repository، پیچیده‌سازی CRUD ساده و دامین مدل‌های کم‌خون) چیست و چه زمانی باید به سمت Vertical Slice مهاجرت کرد؟",
    answerContent: `### Clean Architecture Anti-Patterns & When to Transition to Vertical Slices

While Clean Architecture is conceptually elegant, rigid adherence to layer boundaries often introduces heavy friction in modern .NET applications.

\`\`\`mermaid
flowchart LR
    subgraph AntiPatterns["Clean Architecture Anti-Patterns"]
        A1["Generic Repository over EF Core"]
        A2["Anemic Entities + Smart MediatR Handlers"]
        A3["Mapping Fatigue (Entity -> Domain -> DTO -> VM)"]
        A4["Folder Hopping for Simple CRUD"]
    end
    AntiPatterns --> Solution["Solution: Pragmatic Vertical Slices (VSA)"]
\`\`\`

#### 1. The 4 Big Anti-Patterns in Clean Architecture:
1. **Generic Repository & Unit of Work Layer:**
   - Wrapping EF Core's \`DbSet<T>\` inside \`IRepository<T>\` disables advanced features like \`AsNoTracking()\`, projection via \`Select()\`, \`AsSplitQuery()\`, and bulk SQL operations (\`ExecuteUpdateAsync\`).
2. **Anemic Domain Models with Fat MediatR Handlers:**
   - Placing all business validation inside MediatR Command Handlers turns domain entities into dumb property bags (Anemic Domain Model), destroying DDD encapsulation.
3. **Mapping Fatigue & Excessive DTO Layers:**
   - Passing data through 4 layers of identical DTO mappings (\`DbEntity\` $\\rightarrow$ \`DomainModel\` $\\rightarrow$ \`ApplicationDto\` $\\rightarrow$ \`ApiResponse\`) adds zero security or architectural value for simple queries.
4. **Folder Hopping & Friction:**
   - Adding a simple column requires editing 5-6 projects across different solution folders.

#### 2. When to Refactor to Vertical Slice Architecture (VSA):
- **High Ratio of CRUD / Read Operations:** If $>70\\%$ of your application consists of straightforward data viewing and basic updates, VSA with FastEndpoints/Minimal APIs cuts codebase size in half.
- **Frequent Independent Feature Deployment:** When product teams need to ship features rapidly without touching shared layer abstractions.
- **Heterogeneous Workloads:** When some endpoints require raw SQL performance (Dapper) while others need rich DDD business rules.`,
    answerContent_fa: `### ضدالگوهای رایج Clean Architecture و زمان مهاجرت به Vertical Slice

گرچه Clean Architecture از نظر تئوری ساختار منظمی ارائه می‌دهد، اما تعصب روی لایه‌بندی‌های افقی در پروژه‌های روزمره دات‌نت مشکلات جدی ایجاد می‌کند:

#### ۱. ضدالگوهای اصلی Clean Architecture:
۱. **ضدالگوی Generic Repository روی EF Core:** ساخت اینترفیس‌های ژنریک \`IRepository<T>\` دست توسعه‌دهنده را در استفاده از قابلیت‌های پیشرفته EF Core (مانند کوئری‌های تفکیک‌شده \`AsSplitQuery\`، عدم ردیابی \`AsNoTracking\` و آپدیت مستقیم دیتابیس با \`ExecuteUpdate\`) می‌بندد.
۲. **موجودیت‌های کم‌خون (Anemic Domain Model) به همراه هندلرهای چاق:** انتقال تمام منطق بیزینس به هندلرهای MediatR و تبدیل موجودیت‌های دامین به کلاس‌های صرفاً حاوی Getter/Setter.
۳. **خستگی ناشی از مپینگ‌های مکرر (Mapping Fatigue):** تبدیل مداوم داده بین ۴ نوع شیء کاملاً یکسان در لایه‌های مختلف بدون هیچ دلیل فنی موجه.
۴. **پرش مداوم بین فولدرها (Folder Hopping):** نیاز به تغییر همزمان ۶ پروژه مجزا برای افزودن یک فیلد ساده به فرم.

#### ۲. چه زمانی باید به سمت Vertical Slice مهاجرت کرد؟
- هنگامی که بیش از ۷۰٪ سیستم شامل عملیات استاندارد CRUD و کوئری‌های گزارش‌گیری است.
- هنگامی که تیم نیاز دارد قابلیت‌ها را با سرعت بالا و بدون تداخل با سایر بخش‌ها توسعه داده و دیپلوی کند.
- هنگامی که سیستم دارای بارهای کاری ناهمگون است (برخی اندپوینت‌ها نیازمند Dapper با سرعت حداکثری و برخی نیازمند دامین مدل‌های غنی DDD هستند).`,
  },
  {
    id: "dotnet-senior-span-q1",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "How does the CLR implement ref struct and managed interior pointers (ByReference<T>) under the hood, and how does the JIT compiler eliminate bounds checking for Span<T> in hot loops?",
    questionTitle_fa: "موتور CLR چگونه انواع ref struct و اشاره‌گرهای مدیریت‌شده داخلی (ByReference<T>) را در لایه پایین پیاده‌سازی می‌کند و کامپایلر JIT چگونه بررسی مرزها (Bounds Checking) را در حلقه‌ها حذف می‌کند؟",
    answerContent: `### CLR Internals: \`ref struct\`, Interior Pointers (\`ByReference<T>\`), and JIT Bounds Check Elimination

\`Span<T>\` delivers native C-like speed while maintaining strict memory safety. Under the hood, this is made possible by two core CLR technologies: **Managed Interior Pointers** and **JIT Induction Variable Analysis**.

\`\`\`mermaid
flowchart TD
    subgraph ManagedMemory["Managed Heap / Stack Frame"]
        ObjHeader["Object Header + MethodTable (16B)"]
        ArrayLength["Array Length Field (4B)"]
        DataSlot0["Element [0]"]
        DataSlot1["Element [1]"]
        DataSlot2["Element [2]"]
    end

    subgraph SpanInternals["Span&lt;T&gt; (16 Bytes on Stack)"]
        Ptr["_reference (ByReference&lt;T&gt;)"]
        Len["_length = 3"]
    end

    Ptr -->|Points directly to DataSlot0 (Interior)| DataSlot0
\`\`\`

#### 1. The Anatomy of \`ByReference<T>\`:
In source code, \`Span<T>\` appears to hold \`ref T _reference\`. Internally within CoreCLR, this is represented by an intrinsic type:
\`\`\`csharp
internal readonly ref struct ByReference<T>
{
    private readonly IntPtr _value; // Raw machine pointer tracked by GC
}
\`\`\`
- **Interior Pointer Semantics:** A normal object reference points to the start of an object (its sync block/MethodTable pointer). An interior pointer points *inside* the object (e.g. element index 5 of a byte array).
- **GC Relocation Awareness:** When the Garbage Collector runs a compaction phase and moves the underlying array to another memory address, it automatically updates all active \`ByReference<T>\` pointers on thread stacks to point to the new physical memory location.

#### 2. How the JIT Eliminates Bounds Checking (BCE):
By default, indexing a Span (\`span[i]\`) generates bounds-checking machine instructions:
\`\`\`assembly
cmp edx, [rcx+8]    ; Compare index (edx) against length
jae ThrowIndexOutOfRange ; Branch if unsigned index >= length
\`\`\`

However, the .NET JIT compiler uses **Induction Variable Analysis** and **Range Assertion Elimination**:
\`\`\`csharp
// The JIT detects that 'i' is strictly bound from 0 to span.Length - 1
for (int i = 0; i < span.Length; i++)
{
    span[i] = 0; // JIT ELIMINATES the bounds check instruction completely!
}
\`\`\`
- The JIT emits a single loop comparison at the loop header and then executes direct raw pointer arithmetic in native assembly (\`mov [rax+rcx*4], 0\`), achieving performance identical to unmanaged C.`,
    answerContent_fa: `### معماری داخلی CLR: نحوه عملکرد \`ref struct\`، اشاره‌گرهای داخلی (\`ByReference<T>\`) و حذف بررسی مرزها توسط JIT

ساختار \`Span<T>\` سرعت زبان‌های سطح پایینی مثل C را با حفظ امنیت حافظه در سی‌شارپ فراهم می‌کند. این دستاورد به لطف دو تکنولوژی بنیادین در CLR محقق شده است: **اشاره‌گرهای مدیریت‌شده داخلی (Managed Interior Pointers)** و **آنالیز متغیرهای اندیس در کامپایلر JIT**.

#### ۱. کالبدشکافی ساختار \`ByReference<T>\`:
در لایه داخلی ران‌تایم دات‌نت (CoreCLR)، فیلد رفرنس درون Span با استراکت اینترینسیک \`ByReference<T>\` پیاده‌سازی شده است:
- **اشاره‌گر داخلی (Interior Pointer):** برخلاف رفرنس‌های معمولی که به هدر شیء اشاره می‌کنند، این اشاره‌گر مستقیماً به بایت‌های میانی شیء (مثلاً خانه شماره ۵ از یک آرایه) اشاره دارد.
- **هماهنگی با فازهای فشرده‌سازی GC:** اگر Garbage Collector در حین اجرای برنامه حافظه آرایه را جابجا کند، ران‌تایم تمام اشاره‌گرهای داخلی فعال روی استک را به آدرس فیزیکی جدید تغییر می‌دهد.

#### ۲. مکانیزم حذف بررسی محدوده (Bounds Check Elimination):
در حالت عادی، دسترسی به اندیس‌های Span با دستور اسمبلی \`cmp\` و \`jae\` بررسی می‌شود تا خارج از محدوده نباشد.
اما کامپایلر Tier-1 JIT دات‌نت در حلقه‌های استانداردی مانند \`for (int i = 0; i < span.Length; i++)\`:
- تشخیص می‌دهد که مقدار متغیر \`i\` همواره در بازه معتبر قرار دارد.
- **دستور مقایسه مرزها را در هر تکرار حلقه کاملاً حذف (Elide) می‌کند** و مستقیماً با آدرس‌دهی مستقیم رجیسترهای CPU کد ماشین را با حداکثر سرعت اجرا می‌نماید.`,
  },
  {
    id: "dotnet-senior-span-q2",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "How does the C# 13 'allows ref struct' anti-constraint work, why was it historically impossible to use Span<T> with generics or interfaces, and how does it enable zero-allocation generic abstractions?",
    questionTitle_fa: "قید منفی 'where T : allows ref struct' در C# 13 چگونه کار می‌کند، چرا در گذشته استفاده از Span<T> در ژنریک‌ها و اینترفیس‌ها ناممکن بود و چگونه انتزاع‌های ژنریک بدون آلیکیشن را ممکن می‌سازد؟",
    answerContent: `### The C# 13 \`allows ref struct\` Anti-Constraint & Generic Zero-Allocation Pipelines

Prior to C# 13 / .NET 9, \`Span<T>\` and all \`ref struct\` types were strictly excluded from generic programming.

\`\`\`mermaid
flowchart LR
    subgraph PreCSharp13["Pre-C# 13 (Implicit Heap-Safe Assumption)"]
        G["Generic Type T"] -->|Assumes T can be boxed or live on Heap| Reject["❌ Compile Error: Cannot use Span&lt;T&gt; as generic argument"]
    end

    subgraph CSharp13["C# 13 / .NET 9 (Anti-Constraint)"]
        G2["Generic Type T where T : allows ref struct"] -->|Relaxes heap assumption| Accept["✅ Allows Span&lt;T&gt;, ReadOnlySpan&lt;T&gt; as generic type parameter"]
    end
\`\`\`

#### 1. Why Generics Historically Forbade \`ref struct\`:
When the C# compiler processes a generic type \`T\`, it implicitly assumes that:
1. \`T\` can be stored inside a class or boxed into \`object\`.
2. \`T\` can be placed inside an array (\`T[]\`).
3. \`T\` can be captured inside closures and async methods.

Because \`ref struct\` types violate every single one of these invariants, allowing \`Span<T>\` as \`T\` would cause runtime crashes whenever a generic class attempted to store \`T\` in a field.

#### 2. The Solution: The \`allows ref struct\` Anti-Constraint:
C# 13 introduced the **anti-constraint** \`where T : allows ref struct\`. It does not *require* a capability; it *removes* the compiler's default assumption that \`T\` is heap-safe:

\`\`\`csharp
// Generic interface supporting both heap types and ref structs
public interface IDataConsumer<T> where T : allows ref struct
{
    void Consume(T data);
}

// Zero-allocation implementation taking a ReadOnlySpan directly!
public class HighSpeedHasher : IDataConsumer<ReadOnlySpan<byte>>
{
    public void Consume(ReadOnlySpan<byte> data)
    {
        // Compute SIMD hash without boxing or array allocations
    }
}
\`\`\`

#### 3. Real-World Architectural Impact:
- Enables standard generic algorithms (\`BinarySearch\`, \`Sort\`, parsers, formatters) to operate directly over \`ReadOnlySpan<T>\` without duplicating code into separate Span-specific overloads.
- Allows library authors (e.g. serialization engines, logging pipelines) to build unified generic pipelines with zero heap allocations.`,
    answerContent_fa: `### قید منفی \`allows ref struct\` در C# 13 و خطوط لوله ژنریک بدون تخصیص حافظه

قبل از نسخه C# 13 و دات‌نت ۹، استفاده از ساختارهای \`ref struct\` (مانند \`Span<T>\` و \`ReadOnlySpan<T>\`) به عنوان پارامتر تایپ‌های ژنریک یا در اینترفیس‌ها غیرممکن بود.

#### ۱. چرا ژنریک‌ها قبلاً از \`ref struct\` پشتیبانی نمی‌کردند؟
کامپایلر دات‌نت هنگام پردازش تایپ ژنریک \`T\` به صورت پیش‌فرض فرض می‌کرد که:
۱. نوع \`T\` می‌تواند درون یک کلاس ذخیره شود یا به \`object\` تبدیل (Box) شود.
۲. نوع \`T\` می‌تواند به شکل آرایه (\`T[]\`) روی Heap قرار گیرد.
۳. نوع \`T\` می‌تواند در متدهای ناهمگام (Async) استفاده شود.

چون \`ref struct\`ها طبق قوانین CLR حبس در Stack هستند، نقض هر یک از این فرضیات می‌توانست باعث خرابی فاجعه‌بار حافظه شود.

#### ۲. قید منفی \`where T : allows ref struct\`:
در C# 13 مفهوم قید منفی (Anti-Constraint) اضافه شد که به کامپایلر اعلام می‌کند: «این متد یا اینترفیس تضمین می‌کند که نوع T را روی Heap ذخیره نخواهد کرد؛ بنابراین اجازه بده انواع ref struct نیز به عنوان پارامتر ژنریک ارسال شوند»:

\`\`\`csharp
public interface IDataConsumer<T> where T : allows ref struct
{
    void Consume(T data);
}

public class FastSpanParser : IDataConsumer<ReadOnlySpan<char>>
{
    public void Consume(ReadOnlySpan<char> data)
    {
        // پردازش مستقیم بدون حتی یک بایت Boxing
    }
}
\`\`\`

#### ۳. اثر معمارانه در سیستم‌های پرترافیک:
این قابلیت اجازه می‌دهد فریم‌ورک‌های لاگینگ، سریالایزرها و پایپ‌لاین‌های با توان عملیاتی بالا، کدهای ژنریک مشترکی بنویسند که بدون نیاز به Overloadهای تکراری، مستقیماً روی Spans با صفر آلیکیشن کار کنند.`,
  },
  {
    id: "dotnet-senior-span-q3",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "Explain the internal architecture of ArrayPool<T>.Shared, how per-core locked stacks prevent lock contention across multiple CPU cores, and what are the critical safety rules when renting arrays in high-concurrency microservices?",
    questionTitle_fa: "معماری داخلی ArrayPool<T>.Shared و نحوه جلوگیری از قفل‌شدگی با استک‌های اختصاصی هر هسته CPU (Per-Core Stacks) را توضیح داده و قوانین حیاتی اجاره بافر در مایکروسرویس‌های پرترافیک را بیان کنید.",
    answerContent: `### Internal Architecture of \`ArrayPool<T>.Shared\` & High-Concurrency Safety Rules

In high-throughput .NET services, allocating and collecting large byte arrays causes severe Gen 2 / LOH fragmentation. \`ArrayPool<T>.Shared\` resolves this by maintaining a pool of pre-allocated arrays categorized by size.

\`\`\`mermaid
flowchart TD
    subgraph ArrayPoolArchitecture["ArrayPool&lt;T&gt;.Shared (TlsOverPerCoreLockedStacksArrayPool)"]
        subgraph CoreCaches["Layer 1: Per-Core Stacks (Lock-Free / Core-Affinity)"]
            C0["Core 0 Stack (Fast Local Cache)"]
            C1["Core 1 Stack (Fast Local Cache)"]
            C2["Core N Stack (Fast Local Cache)"]
        end

        subgraph GlobalBuckets["Layer 2: Global Power-of-Two Buckets"]
            B1["Bucket 16B"]
            B2["Bucket 32B"]
            B3["Bucket 64B"]
            B4["Bucket 128B ... 1MB+"]
        end

        CoreCaches -->|Cache Miss on Rent| GlobalBuckets
    end
\`\`\`

#### 1. The Two-Tier Architecture (\`TlsOverPerCoreLockedStacksArrayPool\`):
1. **Tier 1: Per-Core Locked Stacks:**
   - To avoid multi-threaded lock contention, \`ArrayPool.Shared\` allocates dedicated array caches per CPU core.
   - When a thread on Core 2 calls \`Rent()\`, it accesses Core 2's local stack. Multiple threads on different CPU cores execute \`Rent()\` and \`Return()\` concurrently without blocking one another.
2. **Tier 2: Global Bucketed Pools:**
   - If the local core stack is empty, it falls back to the global bucket system.
   - Arrays are sized in powers of two ($16, 32, 64, 128, \\dots, 1\\text{ MB}, \\dots, 2\\text{ MB}$).

#### 2. The 4 Critical Safety Invariants:
1. **The Size Invariant:** \`ArrayPool.Rent(minBufferSize)\` returns an array whose \`.Length\` is $\\ge \\text{minBufferSize}$. If you rent 100 bytes, you may receive a 128-byte or 256-byte array. **Never use \`buffer.Length\`! Always slice to exact count: \`buffer.AsSpan(0, requestedCount)\`**.
2. **Guaranteed Return via \`finally\`:** If an exception occurs, failing to return the buffer causes a pool drain, forcing the pool to allocate new arrays and defeating the purpose of the pool.
3. **Prevention of Double-Returning:** Returning an array twice corrupts the internal free-list pointer graph, leading to simultaneous data races across unrelated requests.
4. **Data Sanitization with \`clearArray: true\`:** When handling authentication tokens, credit card data, or cryptographic keys, always pass \`clearArray: true\` on return to zero out memory and prevent data leaks.`,
    answerContent_fa: `### معماری داخلی ArrayPool<T>.Shared و قوانین ایمنی در مایکروسرویس‌های پرترافیک

کلاس \`ArrayPool<T>.Shared\` برای حذف آلیکیشن‌های مکرر آرایه‌های بایت روی حافظه Heap و ناحیه LOH طراحی شده است.

#### ۱. معماری دو لایه‌ای (\`TlsOverPerCoreLockedStacksArrayPool\`):
۱. **لایه ۱: استک‌های اختصاصی هر هسته CPU (Per-Core Stacks):**
   - برای حذف قفل‌های سراسری و تداخل نخ‌ها در سرورهای چند‌هسته‌ای، به ازای هر هسته پردازنده یک کش محلی بافر اختصاص داده شده است.
   - نخ‌هایی که روی هسته‌های مختلف اجرا می‌شوند، عملیات \`Rent\` و \`Return\` را بدون مسدود کردن یکدیگر با سرعت حداکثری انجام می‌دهند.
۲. **لایه ۲: باکت‌های سراسری با مضارب توان‌های ۲:**
   - اگر کش محلی خالی باشد، درخواست به باکت‌های سراسری هدایت می‌شود که آرایه‌ها را در اندازه‌های توانی از ۲ (۱۶، ۳۲، ۶۴، ۱۲۸ تا چند مگابایت) دسته‌بندی کرده‌اند.

#### ۲. ۴ قانون حیاتی و شکست‌ناپذیر در استفاده از ArrayPool:
۱. **تفاوت طول واقعی با طول درخواستی:** متد \`Rent(100)\` آرایه‌ای با طول حداقل ۱۰۰ (مثلاً ۱۲۸ یا ۲۵۶) بازمی‌گرداند. هرگز نباید از \`buffer.Length\` استفاده کرد؛ همیشه باید طول دقیق را اسلایس کنید: \`buffer.AsSpan(0, count)\`.
۲. **استفاده اجباری از try/finally:** برای جلوگیری از نشت حافظه (Pool Exhaustion)، متد \`Return\` باید حتماً در بلوک \`finally\` قرار گیرد.
۳. **جلوگیری از Double-Return:** بازگرداندن دوباره یک بافر باعث خرابی کلاستر استخر و تداخل داده‌ای بین درخواست‌های مختلف سرور می‌شود.
۴. **پاکسازی داده‌های حساس با \`clearArray: true\`:** هنگام پردازش داده‌های هویتی یا پسوردها، باید \`clearArray: true\` تنظیم شود تا بایت‌های حافظه با مقدار صفر بازنویسی شوند.`,
  },
  {
    id: "dotnet-senior-span-q4",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "How does SearchValues<T> in .NET 8/9 achieve multi-fold performance improvements over IndexOfAny, how does the JIT compile it into AVX2/AVX-512 vector instructions, and what are the memory trade-offs?",
    questionTitle_fa: "کلاس SearchValues<T> در دات‌نت ۸ و ۹ چگونه سرعتی تا چندین برابر بیشتر از IndexOfAny فراهم می‌کند، کامپایلر JIT چگونه آن را به دستورات برداری AVX2/AVX-512 تبدیل می‌کند و چه تریدآف‌های حافظه‌ای دارد؟",
    answerContent: `### SIMD Vectorization Internals with \`SearchValues<T>\` in .NET 8/9

Searching for specific delimiters (e.g. \`,\`, \`;\`, \`\\r\`, \`\\n\`, \` \`) in text streams or network headers is a fundamental hot path in web servers. Traditional \`IndexOfAny(char[])\` incurs overhead by re-analyzing the character set on every invocation.

.NET 8 and .NET 9 introduced **\`SearchValues<T>\`**, which shifts set-analysis from execution time to **pre-computation startup time**, unlocking hardware vectorization.

\`\`\`mermaid
flowchart LR
    Init["SearchValues.Create(\",;\\t\\r\\n\")"] -->|Pre-compute at Startup| Strategy{Character Set Analysis}
    Strategy -->|Small ASCII Range| Bitmask["AVX2 / AVX-512 Vector Bitmask (vpshufb / vpternlogd)"]
    Strategy -->|Sparse Multi-Byte Set| Bitmap["Probabilistic Bloom Filter Vector"]
    
    Bitmask --> Runtime["input.IndexOfAny(Delimiters)"]
    Runtime --> Result["Processes 32/64 bytes per CPU cycle (5x-8x faster)"]
\`\`\`

#### 1. Internal Strategy Selection:
When you call \`SearchValues.Create(targets)\`, the CLR analyzes the distribution of target values and instantiates an optimal internal strategy:
1. **Single / Pair Strategy:** Compiles into hardware broadcast instructions (\`_mm256_set1_epi8\`) with direct comparison.
2. **ASCII Bitmap Table:** If target characters are within ASCII range (0-127), it builds a 128-bit / 256-bit SIMD lookup mask executed via the **\`vpshufb\`** (vector shuffle) instruction.
3. **Probabilistic Vector Filter:** For broader Unicode ranges, it uses vectorized bloom filters to quickly reject non-matching blocks.

#### 2. Benchmark Comparison (Parsing 100,000 HTTP Headers):
| Implementation | Mean Time | Allocations | CPU Instructions |
| :--- | :--- | :--- | :--- |
| Scalar \`foreach\` Loop | $12.4\\text{ ms}$ | $0\\text{ B}$ | $184,000,000$ |
| \`ReadOnlySpan.IndexOfAny(char[])\` | $4.2\\text{ ms}$ | $0\\text{ B}$ | $52,000,000$ |
| **\`ReadOnlySpan.IndexOfAny(SearchValues)\`** | **$0.8\\text{ ms}$** | **$0\\text{ B}$** | **$9,800,000$ (5.2x Faster)** |

#### 3. Production Best Practices:
- Always cache \`SearchValues<T>\` instances in \`static readonly\` fields to amortize initialization cost.
- Use \`SearchValues<byte>\` for raw network socket pipelines and \`SearchValues<char>\` for string/text parsers.`,
    answerContent_fa: `### کالبدشکافی پردازش وکتوری SIMD با \`SearchValues<T>\` در دات‌نت ۸ و ۹

جستجوی کاراکترهای جداکننده (مانند \`,\`، \`;\`، خط جدید یا اسپیس) در جریان‌های متنی، یکی از پرتکرارترین عملیات‌های موتورهای وب و پارسرها است. متد سنتی \`IndexOfAny\` در هر بار فراخوانی باید آرایه کاراکترها را بررسی و تحلیل کند.

در دات‌نت ۸ و ۹، کلاس **\`SearchValues<T>\`** فرآیند بهینه‌سازی را از زمان اجرای درخواست به **زمان راه‌اندازی برنامه (Startup Pre-computation)** منتقل کرده و مستقیماً از رجیسترهای وکتوری پردازنده (**AVX2، AVX-512 و ARM Neon**) استفاده می‌کند.

#### ۱. استراتژی‌های داخلی انتخاب الگوریتم:
هنگام فراخوانی \`SearchValues.Create()\`:
۱. **ماسک بیتی وکتوری (ASCII Vector Bitmask):** اگر کاراکترها در محدوده اسکی باشند، جدول ماسک ۲۵۶ بیتی در رجیسترهای CPU ساخته می‌شود و با دستور اسمبلی \`vpshufb\` (Vector Shuffle)، در هر سیکل کلاک پردازنده **۳۲ یا ۶۴ بایت به صورت همزمان** پردازش می‌شوند.
۲. **فیلترهای بیتی احتمالاتی:** برای کاراکترهای با گستره بزرگ یونیکد، از ساختارهای شبه بلوم‌فیلتر برداری استفاده می‌شود تا بلوک‌های نامرتبط در کسری از نانوثانیه رد شوند.

#### ۲. مقایسه کارایی در پردازش ۱۰۰,۰۰۰ هدر HTTP:
- متد معمولی \`IndexOfAny\`: زمان اجرا ۴.۲ میلی‌ثانیه.
- **استفاده از \`SearchValues\`:** **۰.۸ میلی‌ثانیه (بیش از ۵ برابر سریع‌تر)** با مصرف صفر بایت حافظه و کاهش ۹۰ درصدی تعداد دستورات CPU.

#### ۳. نکات طلایی استفاده:
- نمونه \`SearchValues\` باید حتماً در فیلدهای \`static readonly\` تعریف شود تا هزینه پیش‌محاسبه فقط یک‌بار در زمان لود کلاس پرداخت گردد.`,
  },
  {
    id: "dotnet-senior-span-q5",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "How do you implement a custom MemoryManager<T> to wrap unmanaged native memory (e.g. shared memory mapped files or native C library buffers) into a safe ReadOnlyMemory<T> and Span<T> pipeline?",
    questionTitle_fa: "چگونه با پیاده‌سازی یک MemoryManager<T> سفارشی، حافظه‌های Unmanaged و فایل‌های Memory-Mapped سیستم‌عامل را در قالب یک پایپ‌لاین امن ReadOnlyMemory<T> و Span<T> بدون کپی داده کپسوله می‌کنید؟",
    answerContent: `### Custom \`MemoryManager<T>\`: Bridging Native Unmanaged Memory to Safe Async .NET Pipelines

When integrating with native C/C++ libraries, GPU memory, or Operating System Shared Memory-Mapped Files, allocating managed \`byte[]\` copies introduces unacceptable latency overhead.

\`System.Buffers.MemoryManager<T>\` is the abstract bridge that enables wrapping **arbitrary native memory pointers** into first-class, heap-safe \`Memory<T>\` instances that support \`IMemoryOwner<T>\` deterministic disposal.

\`\`\`mermaid
flowchart TD
    subgraph NativeOS["Native OS Unmanaged Space"]
        NativeMem["Native Ptr / Shared Memory (mmap)"]
    end

    subgraph MemoryManagerBridge["Custom NativeMemoryManager : MemoryManager&lt;byte&gt;"]
        Owner["IMemoryOwner&lt;byte&gt; (.Memory)"]
        Pin["Pin(elementIndex) -> MemoryHandle"]
        GetSpan["GetSpan() -> Span&lt;byte&gt;"]
        Dispose["Dispose() -> NativeMemory.Free()"]
    end

    subgraph ManagedDotNet["Safe Managed C# Pipeline"]
        AsyncIO["await ProcessAsync(owner.Memory)"]
    end

    NativeMem <--> MemoryManagerBridge
    MemoryManagerBridge --> ManagedDotNet
\`\`\`

#### 1. Implementation of a Production-Ready \`NativeMemoryManager\`:

\`\`\`csharp
using System.Buffers;
using System.Runtime.InteropServices;

public sealed unsafe class NativeMemoryManager : MemoryManager<byte>
{
    private readonly byte* _ptr;
    private readonly int _length;
    private bool _disposed;

    public NativeMemoryManager(int length)
    {
        _length = length;
        _ptr = (byte*)NativeMemory.Alloc((nuint)length);
    }

    public override Span<byte> GetSpan()
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        return new Span<byte>(_ptr, _length);
    }

    public override MemoryHandle Pin(int elementIndex = 0)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        if ((uint)elementIndex > (uint)_length)
            throw new ArgumentOutOfRangeException(nameof(elementIndex));

        // Native memory is already unmovable, so handle GCHandle is not needed
        return new MemoryHandle(_ptr + elementIndex);
    }

    public override void Unpin() { /* No-op for unmanaged memory */ }

    protected override void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            _disposed = true;
            NativeMemory.Free(_ptr);
        }
    }
}
\`\`\`

#### 2. Usage in High-Performance Async Pipelines:

\`\`\`csharp
public async Task ProcessNativeSharedBufferAsync(CancellationToken ct)
{
    // 1. Allocate unmanaged native buffer wrapped as IMemoryOwner
    using (var memoryManager = new NativeMemoryManager(65536))
    {
        Memory<byte> memory = memoryManager.Memory;

        // 2. Safely pass across async methods without pinning GC objects
        await ReadFromSocketAsync(memory, ct);

        // 3. Process with zero-copy synchronous Span
        ReadOnlySpan<byte> span = memory.Span;
        ProcessTelemetry(span);
    } // Deterministically frees unmanaged memory via Dispose()
}
\`\`\`

#### 3. Why This Pattern is Superior:
- **Zero GC Tracking:** The memory lives entirely outside the CLR Managed Heap, producing zero Gen 0/1/2 or LOH GC pressure.
- **Full Async Compatibility:** Exposes \`Memory<T>\` which passes cleanly across \`await\` boundaries.
- **Deterministic Lifetime:** Conforms to \`IDisposable\`, guaranteeing that native OS handles and mapped files are freed immediately upon completion.`,
    answerContent_fa: `### پیاده‌سازی \`MemoryManager<T>\` سفارشی برای اتصال حافظه‌های Native به پایپ‌لاین‌های امن دات‌نت

هنگام کار با کتابخانه‌های C/C++، حافظه GPU یا فایل‌های اشتراکی در حافظه سیستم‌عامل (Memory-Mapped Files)، کپی کردن داده‌ها درون آرایه‌های دات‌نت (\`byte[]\`) باعث افت محسوس کارایی می‌شود.

کلاس انتزاعی \`MemoryManager<T>\` پلی معمارانه است که اجازه می‌دهد **اشاره‌گرهای حافظه خام Unmanaged** را درون اشیاء ایمن \`Memory<T>\` بسته‌بندی کرده و همراه با اینترفیس \`IMemoryOwner<T>\` در سراسر برنامه‌های دات‌نت استفاده کنید.

#### ۱. پیاده‌سازی کلاس \`NativeMemoryManager\`:
- متد **\`GetSpan()\`**: یک \`Span<byte>\` همگام از روی آدرس حافظه خام بازمی‌گرداند.
- متد **\`Pin()\`**: ساختار \`MemoryHandle\` را بدون نیاز به قفل کردن GC تولید می‌کند (چون حافظه Native در رم ثابت است و توسط ران‌تایم جابجا نمی‌شود).
- متد **\`Dispose()\`**: در زمان اتمام کار با بلوک \`using\`، حافظه خام را با متد \`NativeMemory.Free\` به سیستم‌عامل بازمی‌گرداند.

#### ۲. مزایای معمارانه این الگو:
۱. **فشار صفر به Garbage Collector:** حافظه کاملاً خارج از رم مدیریت‌شده دات‌نت قرار دارد و هیچ وقفه‌ای در GC ایجاد نمی‌کند.
۲. **سازگاری کامل با متدهای Async:** این ساختار یک \`Memory<T>\` ایمن تولید می‌کند که به راحتی از مرزهای \`await\` عبور می‌کند.
۳. **آزادسازی قطعی و آنی (Deterministic Lifetime):** با استفاده از الگوی \`IDisposable\`، حافظه Unmanaged دقیقاً در پایان پردازش آزاد شده و نشت حافظه رخ نمی‌دهد.`,
  },
  {
    id: "dotnet-senior-async-q1",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-async-state-machine"],
    questionTitle: "Explain the complete compiler lowering transformation of an async Task<T> method into an IAsyncStateMachine struct, how AsyncTaskMethodBuilder<T> manages the fast path vs suspension path, and what happens to the state machine during heap boxing.",
    questionTitle_fa: "فرآیند کامل بازنویسی کامپایلر (Compiler Lowering) یک متد async Task<T> به ساختار IAsyncStateMachine، نحوه مدیریت مسیر سریع (Fast Path) در برابر مسیر تعلیق (Suspension Path) توسط AsyncTaskMethodBuilder<T> و فرآیند Boxing به حافظه Heap را تشریح کنید.",
    answerContent: `### Deep Mechanics: C# Compiler Lowering & \`IAsyncStateMachine\` Execution Lifecycle

When the Roslyn C# compiler encounters an \`async Task<T>\` method, it rewrites the method into an explicit state machine struct that implements **\`IAsyncStateMachine\`**.

\`\`\`mermaid
flowchart TD
    Method["Caller invokes async Task&lt;int&gt; FetchAsync()"] --> Init["Allocate struct <FetchAsync>d__1 on Stack (State = -1)"]
    Init --> Start["builder.Start(ref stateMachine) -> Calls MoveNext()"]
    
    Start --> FastCheck{"awaiter.IsCompleted?"}
    FastCheck -- "true (Fast Path)" --> FastExec["Execute synchronously on current thread stack -> Zero Heap Allocations!"]
    
    FastCheck -- "false (Suspension)" --> Box["1. Box struct to Heap via builder.AwaitUnsafeOnCompleted()"]
    Box --> Free["2. Current thread returns immediately to ThreadPool"]
    Free --> Wait["3. OS Kernel / Hardware completes I/O via IOCP"]
    Wait --> Resume["4. ThreadPool thread picks up boxed state machine and calls MoveNext()"]
\`\`\`

#### 1. The Anatomy of the Generated \`struct\`:
\`\`\`csharp
[CompilerGenerated]
private struct <FetchAsync>d__1 : IAsyncStateMachine
{
    public int <>1__state;                          // Current state indicator (-1, 0, 1, ..., -2 completed)
    public AsyncTaskMethodBuilder<int> <>t__builder; // Bridges state machine to Task<T>
    public string url;                              // Method parameters
    private string <data>5__1;                      // Hoisted local variable
    private TaskAwaiter<string> <>u__1;             // Awaiter instance

    public void MoveNext() { /* state dispatch switch */ }
}
\`\`\`

#### 2. The Fast Path vs. The Suspension Path:
1. **The Fast Path (\`awaiter.IsCompleted == true\`):**
   - If the task is already completed (e.g. data returned from cache or synchronous completion), \`MoveNext()\` executes linearly.
   - The state machine struct **remains strictly on the stack** and is destroyed when the method exits. **Zero heap allocation occurs.**
2. **The Suspension Path (\`awaiter.IsCompleted == false\`):**
   - When hitting an incomplete asynchronous operation, \`<>t__builder.AwaitUnsafeOnCompleted(ref awaiter, ref this)\` is called.
   - The CLR boxes the entire \`struct\` from the thread stack onto the **Managed Heap** (creating an \`IAsyncStateMachineBox<T>\` object) to preserve local state across threads.
   - The executing thread immediately returns to the ThreadPool.
   - When the underlying I/O completes via I/O Completion Ports (IOCP), the CLR queues the boxed state machine's \`MoveNext()\` onto the ThreadPool queue to resume.`,
    answerContent_fa: `### کالبدشکافی فرآیند بازنویسی کامپایلر (Compiler Lowering) و موتور ماشین وضعیت \`IAsyncStateMachine\`

هنگامی که یک متد حاوی \`async Task<T>\` می‌نویسید، کامپایلر Roslyn آن را به یک ساختار ماشین وضعیت با اینترفیس **\`IAsyncStateMachine\`** تبدیل می‌کند تا اجرای کد بتواند بدون مسدودسازی نخ در زمان I/O متوقف و مجدداً از سر گرفته شود.

#### ۱. ساختار داخلی استراکت تولیدشده:
- **\`<>1__state\`**: وضعیت فعلی اجرا را نگه می‌دارد (مقدار ۱- شروع، ۰ و ۱ نشان‌دهنده توقف در دستورات مختلف \`await\`، و ۲- اتمام متد).
- **\`<>t__builder\`**: سازنده تسک از نوع \`AsyncTaskMethodBuilder<T>\` که پل ارتباطی میان ماشین وضعیت و شیء \`Task\` بازگشتی است.
- **متغیرهای Hoist شده**: تمام متغیرهای محلی متد به فیلدهای این استراکت تبدیل می‌شوند تا با اتمام تابع از بین نروند.

#### ۲. مقایسه مسیر سریع همگام با مسیر تعلیق ناهمگام:
۱. **مسیر سریع (Fast Path - \`awaiter.IsCompleted == true\`):**
   - اگر نتیجه عملیات از قبل آماده باشد (مثلاً داده درون کش باشد)، متد \`MoveNext\` بلافاصله تا انتها روی نخ جاری اجرا می‌شود.
   - استراکت ماشین وضعیت روی استک باقی می‌ماند و **هیچ شیئی روی Heap کپی (Box) نمی‌شود**.
۲. **مسیر تعلیق (Suspension Path - \`awaiter.IsCompleted == false\`):**
   - هنگامی که عملیات ناهمگام در حال انجام است، متد \`AwaitUnsafeOnCompleted\` فراخوانی می‌شود.
   - ران‌تایم دات‌نت کل استراکت را از روی استک به **حافظه Heap کپی (Box)** می‌کند تا با تعویض نخ‌ها، اطلاعات متغیرهای محلی حفظ شود.
   - نخ جاری فوراً به **ThreadPool** بازمی‌گردد تا درخواست‌های دیگر را پردازش کند.
   - پس از اتمام I/O سخت‌افزاری، یک نخ آزاد از ThreadPool نمونه موجود روی Heap را برداشته و متد \`MoveNext\` را برای ادامه مسیر فراخوانی می‌کند.`,
  },
  {
    id: "dotnet-senior-async-q2",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-async-state-machine"],
    questionTitle: "What is ExecutionContext, how does it differ from SynchronizationContext, how does AsyncLocal<T> flow across asynchronous boundaries, and when should you call ExecutionContext.SuppressFlow()?",
    questionTitle_fa: "مفهوم ExecutionContext چیست، چه تفاوتی با SynchronizationContext دارد، کلاس AsyncLocal<T> چگونه در طول مرزهای ناهمگام منتقل می‌شود و در چه سناریوهایی باید از ExecutionContext.SuppressFlow() استفاده کرد؟",
    answerContent: `### \`ExecutionContext\` vs \`SynchronizationContext\` & The Mechanics of \`AsyncLocal<T>\`

Understanding the distinction between \`ExecutionContext\` and \`SynchronizationContext\` is vital for architecting distributed context propagation and high-throughput background pipelines.

\`\`\`mermaid
flowchart TD
    subgraph ExecutionContextSection["ExecutionContext (The Ambient State)"]
        EC1["Flows ambient environmental data across threads"]
        EC2["Transfers: AsyncLocal&lt;T&gt;, ClaimsPrincipal, Activity.Current (TraceId)"]
        EC3["Captured by CLR at every 'await' and restored on resumption thread"]
    end

    subgraph SynchronizationContextSection["SynchronizationContext (The Execution Target)"]
        SC1["Controls WHICH specific thread executes the continuation"]
        SC2["Legacy ASP.NET / WPF Dispatcher: Marshals back to UI or Request thread"]
        SC3["ASP.NET Core: SynchronizationContext.Current == null (Runs on any ThreadPool thread)"]
    end
\`\`\`

#### 1. How \`AsyncLocal<T>\` Flows with \`ExecutionContext\`:
- \`AsyncLocal<T>\` provides ambient storage that is local to an asynchronous control flow.
- When an \`await\` yields, the CLR captures \`ExecutionContext.Capture()\`.
- When the continuation resumes on a completely different ThreadPool worker thread, the CLR restores that captured \`ExecutionContext\`, ensuring \`AsyncLocal<T>.Value\` retains its logical cascade value without thread contamination.

\`\`\`csharp
public static class RequestTelemetryContext
{
    private static readonly AsyncLocal<string> _traceCorrelationId = new();

    public static string TraceId
    {
        get => _traceCorrelationId.Value ?? string.Empty;
        set => _traceCorrelationId.Value = value;
    }
}
\`\`\`

#### 2. Performance Optimization: \`ExecutionContext.SuppressFlow()\`:
Capturing and restoring \`ExecutionContext\` on every asynchronous hop incurs memory allocation and CPU overhead.
- In ultra-high-throughput infrastructure services (e.g. custom threadpool workers, messaging dispatchers) where \`AsyncLocal\` or security claims are not needed:
\`\`\`csharp
// Suppress context flow to achieve maximum throughput:
using (ExecutionContext.SuppressFlow())
{
    ThreadPool.UnsafeQueueUserWorkItem(static state => {
        // Runs with ZERO ExecutionContext capture overhead
    }, null);
}
\`\`\``,
    answerContent_fa: `### تفاوت بنیادین \`ExecutionContext\` و \`SynchronizationContext\` و سازوکار \`AsyncLocal<T>\`

#### ۱. مفهوم \`ExecutionContext\` (کانتکست محیطی):
کانتکست اجرایی محیط منطقی و متادیتاهای درخواست را نمایندگی می‌کند.
- **جریان ناهمگام (Context Flow):** هنگامی که یک متد \`async\` روی یک نخ تعلیق شده و ادامه‌اش روی یک نخ دیگر از ThreadPool اجرا می‌شود، CLR به صورت خودکار \`ExecutionContext\` را کپچر کرده و روی نخ جدید بارگذاری می‌کند.
- **انتقال با \`AsyncLocal<T>\`:** این سازوکار اجازه می‌دهد متغیرهایی مانند **Correlation ID، شناسه کاربر لاگین‌شده و کانتکست چندمستأجری (Multi-Tenancy)** در تمام لایه‌ها و متدهای تودرتو بدون نیاز به ارسال به عنوان پارامتر متد، به صورت ایمن در دسترس باشند.

#### ۲. مفهوم \`SynchronizationContext\` (مقصد اجرا):
کانتکست همگام‌سازی مشخص می‌کند که ادامه‌ کد پس از دستور \`await\` روی **چه نخی** باید اجرا شود:
- در برنامه‌های قدیمی دسکتاپ (WPF)، ادامه کار را به نخ اصلی UI می‌فرستد تا کنترل‌های صفحه قابل ویرایش باشند.
- در **ASP.NET Core مدرن**، مقدار \`SynchronizationContext.Current\` برابر **\`null\`** است و ادامه کد به هر نخ آزادی از ThreadPool واگذار می‌شود.

#### ۳. بهینه‌سازی سرعت با \`ExecutionContext.SuppressFlow()\`:
کپچر و بازیابی مداوم کانتکست محیطی دارای اندکی سربار پردازشی است. در خطوط لوله بسیار پرترافیک داخلی (مانند موتورهای انتقال پیام یا سوکت‌های Kestrel) که نیازی به انتقال \`AsyncLocal\` ندارند، با فراخوانی \`ExecutionContext.SuppressFlow()\` می‌توان این فرآیند را غیرفعال کرد تا مصرف CPU و حافظه به صفر نزدیک شود.`,
  },
  {
    id: "dotnet-senior-async-q3",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-async-state-machine"],
    questionTitle: "How do ValueTask<T> and IValueTaskSource<T> (via ManualResetValueTaskSourceCore<T>) achieve zero-allocation asynchronous I/O in high-performance networking pipelines like Kestrel, and what are the fatal anti-patterns when consuming ValueTask?",
    questionTitle_fa: "ساختارهای ValueTask<T> و اینترفیس IValueTaskSource<T> (با کلاس ManualResetValueTaskSourceCore<T>) چگونه ارتباطات شبکه‌ای پرترافیک با تخصیص صفر حافظه را ممکن می‌سازند و خطاهای کشنده در مصرف ValueTask کدامند؟",
    answerContent: `### Zero-Allocation Async I/O with \`ValueTask<T>\` & \`IValueTaskSource<T>\` in High-Throughput Pipelines

In web servers processing $100,000+\\text{ requests/sec}$, allocating a standard \`Task<T>\` reference object for every network read generates severe Gen 0 Garbage Collection pressure.

\`\`\`mermaid
flowchart LR
    subgraph StandardTask["Standard Task&lt;T&gt; (Heap Object)"]
        T["Task&lt;T&gt; Instance (64+ Bytes)"] --> Heap["Allocates new object on Heap on EVERY async operation"]
    end

    subgraph ValueTaskEngine["ValueTask&lt;T&gt; + IValueTaskSource&lt;T&gt; (Zero-Allocation)"]
        VT["ValueTask&lt;T&gt; Struct (16 Bytes on Stack)"]
        VTS["Reusable Socket/Channel Buffer (IValueTaskSource)"]
        VT -->|Points to reusable pooled instance| VTS
        VTS -->|Reset via ManualResetValueTaskSourceCore| Reuse["0 Heap Allocations across millions of reads!"]
    end
\`\`\`

#### 1. The Discriminated Union Architecture of \`ValueTask<T>\`:
\`ValueTask<T>\` is a 16-byte stack struct that handles two distinct scenarios:
1. **Synchronous Fast Path (Cache Hits / Ready Buffers):** \`_obj\` is \`null\`, and the result is stored directly inside the struct's \`_result\` field on the stack (**$0\\text{ B}$ allocation**).
2. **Asynchronous Slow Path (Pending I/O):** \`_obj\` references an **\`IValueTaskSource<T>\`** reusable state object.

#### 2. Reusing State Objects with \`ManualResetValueTaskSourceCore<T>\`:
Used internally by **Kestrel socket transport** and **\`System.Threading.Channels\`**:
\`\`\`csharp
public sealed class PooledSocketReader : IValueTaskSource<int>
{
    private ManualResetValueTaskSourceCore<int> _sourceCore;

    public ValueTask<int> ReadAsync(Socket socket, Memory<byte> buffer)
    {
        _sourceCore.Reset(); // Reset version and state for reuse
        // Issue async OS socket receive...
        return new ValueTask<int>(this, _sourceCore.Version);
    }

    public int GetResult(short token) => _sourceCore.GetResult(token);
    public ValueTaskSourceStatus GetStatus(short token) => _sourceCore.GetStatus(token);
    public void OnCompleted(Action<object?> continuation, object? state, short token, ValueTaskSourceOnCompletedFlags flags)
        => _sourceCore.OnCompleted(continuation, state, token, flags);
}
\`\`\`

#### 3. Fatal Anti-Patterns When Consuming \`ValueTask\`:
1. **Never \`await\` a \`ValueTask\` more than once:** Because the underlying \`IValueTaskSource\` may be reset and reused for another operation, awaiting it twice causes data corruption or invalid state exceptions.
2. **Never call \`.GetAwaiter().GetResult()\` on an incomplete \`ValueTask\`:** Blocks the thread and corrupts the reset token.
3. **Never pass a \`ValueTask\` directly to \`Task.WhenAll\` / \`Task.WhenAny\`:** Always convert to a standard \`Task\` first using **\`.AsTask()\`**.`,
    answerContent_fa: `### معماری پردازش ناهمگام با صفر تخصیص حافظه توسط \`ValueTask<T>\` و \`IValueTaskSource<T>\`

در موتورهای وب پرترافیک (مانند Kestrel)، ساخت مکرر اشیاء \`Task<T>\` برای هر عملیات خواندن سوکت، حافظه Heap را اشباع می‌کند.

#### ۱. ساختار داخلی \`ValueTask<T>\`:
استراکت ۱۶ بایتی \`ValueTask<T>\` دو مسیر مجزا را پشتیبانی می‌کند:
۱. **مسیر سریع همگام (Fast Path):** اگر بایت‌های داده از قبل در بافر سوکت آماده باشند، نتیجه مستقیماً درون فیلد استراکت روی استک قرار می‌گیرد (**صفر بایت آلیکیشن روی Heap**).
۲. **مسیر ناهمگام کند (Slow Path):** به یک نمونه از اینترفیس بازیافتی \`IValueTaskSource<T>\` ارجاع می‌دهد.

#### ۲. استفاده مجدد از اشیاء با \`ManualResetValueTaskSourceCore<T>\`:
در کتابخانه Kestrel و \`System.Threading.Channels\`، به جای ساخت تسک جدید در هر بار خواندن از شبکه، از یک شیء استخرشده ثابت استفاده می‌شود. متد \`_sourceCore.Reset()\` وضعیت شیء را ریست کرده و توکن امنیتی نسخه را تغییر می‌دهد تا **میلیون‌ها درخواست بدون حتی یک بایت تخصیص جدید در Heap** پردازش شوند.

#### ۳. اشتباهات مهلک در استفاده از \`ValueTask\`:
۱. **اعمال چندباره \`await\` روی یک \`ValueTask\` ممنوع است:** زیرا ممکن است شیء داخلی آن ریست شده و برای درخواست دیگری در حال استفاده باشد.
۲. **فراخوانی همگام \`.GetAwaiter().GetResult()\` روی تسک تکمیل‌نشده ممنوع است.**
۳. **عدم ارسال مستقیم به \`Task.WhenAll\`:** ابتدا باید با متد \`.AsTask()\` به یک شیء Task استاندارد تبدیل شود.`,
  },
  {
    id: "dotnet-senior-async-q4",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-async-state-machine"],
    questionTitle: "Why is ConfigureAwait(false) not required in modern ASP.NET Core applications, under what specific scenarios can omitting it still trigger deadlocks in reusable .NET libraries, and how does the .NET runtime handle continuations when SynchronizationContext.Current == null?",
    questionTitle_fa: "چرا استفاده از ConfigureAwait(false) در کنترلرها و اندپوینت‌های ASP.NET Core الزامی نیست، در چه شرایطی عدم استفاده از آن در پکیج‌های عمومی NuGet باعث Deadlock می‌شود و ران‌تایم در غیاب SynchronizationContext چگونه ادامه‌ کار را زمان‌بندی می‌کند؟",
    answerContent: `### \`ConfigureAwait(false)\` in ASP.NET Core vs. Reusable Class Libraries

The advice to "always use \`ConfigureAwait(false)\`" originated in legacy .NET Framework. Understanding how ASP.NET Core transformed asynchronous dispatching is essential for clean architecture.

\`\`\`mermaid
flowchart TD
    subgraph LegacyDotNet["Legacy ASP.NET (System.Web) & UI Apps"]
        SC["SynchronizationContext.Current != null (Single Thread Lock)"]
        SyncCall["Client calls .Result / .Wait() on UI Thread"]
        Continuation["Continuation queued back to SynchronizationContext"]
        Deadlock["❌ DEADLOCK: UI Thread is blocked waiting for Task, while Task is waiting for UI Thread!"]
        SyncCall --> Deadlock
        Continuation --> Deadlock
    end

    subgraph ModernAspNetCore["ASP.NET Core (.NET 6 / 7 / 8 / 9)"]
        NoSC["SynchronizationContext.Current == null"]
        ThreadPoolDispatch["Continuation dispatched directly to ANY free ThreadPool worker"]
        NoDeadlock["✅ Zero context capturing -> No UI thread deadlock possible"]
        NoSC --> ThreadPoolDispatch --> NoDeadlock
    end
\`\`\`

#### 1. Why \`ConfigureAwait(false)\` is Not Needed in ASP.NET Core:
- In ASP.NET Core, **\`SynchronizationContext.Current\` is always \`null\`**.
- When an \`await\` completes, the CLR runtime inspects \`SynchronizationContext.Current\`. Finding it \`null\`, it immediately schedules the continuation onto any available worker thread in the **ThreadPool**.
- Setting \`ConfigureAwait(false)\` in ASP.NET Core controllers, Minimal API endpoints, or business services does nothing because there is no \`SynchronizationContext\` to bypass in the first place!

#### 2. Why \`ConfigureAwait(false)\` is STILL Mandatory in Reusable NuGet Libraries:
If you author a reusable NuGet package or domain library:
- A developer might consume your library inside a **WPF, Windows Forms, or .NET MAUI desktop app**.
- If that developer writes synchronous blocking code (e.g. \`var res = myLibrary.FetchAsync().Result;\`), and your library omitted \`ConfigureAwait(false)\`, the continuation will attempt to marshal back to the UI thread's \`DispatcherSynchronizationContext\`.
- Because the UI thread is already blocked waiting for \`.Result\`, a **Deadlock occurs and the desktop application freezes permanently**.
- Adding \`ConfigureAwait(false)\` tells the awaiter: *"Do not capture the current SynchronizationContext; execute continuation on any ThreadPool thread."*`,
    answerContent_fa: `### تحلیل کاربرد \`ConfigureAwait(false)\` در ASP.NET Core و کتابخانه‌های عمومی دات‌نت

#### ۱. چرا در اندپوینت‌ها و بیزینس لاجیک ASP.NET Core نیازی به \`ConfigureAwait(false)\` نیست؟
- در معماری مدرن ASP.NET Core، **\`SynchronizationContext.Current\` همواره مقدار \`null\` دارد**.
- هنگام اتمام دستور \`await\`، ران‌تایم کانتکست همگام‌سازی را بررسی می‌کند؛ وقتی با مقدار \`null\` روبرو می‌شود، ادامه‌ اجرای کد را مستقیماً به اولین نخ آزاد در **ThreadPool** واگذار می‌کند.
- بنابراین قرار دادن \`ConfigureAwait(false)\` در کنترلرها یا سرویس‌های وب اپلیکیشن هیچ تغییر رفتاری ایجاد نمی‌کند و صرفاً کد را شلوغ می‌سازد.

#### ۲. چرا در پکیج‌های عمومی NuGet استفاده از \`ConfigureAwait(false)\` حیاتی است؟
اگر کتابخانه‌ای می‌نویسید که قرار است در پروژه‌های مختلف استفاده شود:
- ممکن است یک توسعه‌دهنده متد شما را درون یک برنامه دسکتاپ (WPF، WinForms یا .NET MAUI) صدا بزند.
- اگر آن توسعه‌دهنده به صورت اشتباه از کد مسدودکننده (مانند \`myLib.GetDataAsync().Result\`) روی نخ اصلی UI استفاده کند و شما \`ConfigureAwait(false)\` نگذاشته باشید، ادامه کد تلاش می‌کند روی نخ UI اجرا شود.
- چون نخ UI مسدود شده و منتظر نتیجه تسک است و تسک هم منتظر آزاد شدن نخ UI است، **Deadlock قطعی رخ داده و برنامه هنگ می‌کند**.
- نوشتن \`ConfigureAwait(false)\` به ران‌تایم دستور می‌دهد که کانتکست UI را نادیده گرفته و ادامه را روی ThreadPool اجرا کند تا از بن‌بست جلوگیری شود.`,
  },
  {
    id: "dotnet-senior-async-q5",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-async-state-machine"],
    questionTitle: "How do you diagnose and resolve production ThreadPool Starvation in high-traffic .NET microservices using dotnet-counters, dotnet-dump, and thread dump callstack analysis?",
    questionTitle_fa: "چگونه معضل بحرانی قفل‌شدگی و گرسنگی نخ‌ها (ThreadPool Starvation) را در مایکروسرویس‌های پرترافیک با ابزارهای dotnet-counters و dotnet-dump و تحلیل لاگ Callstack نخ‌ها ریشه‌یابی و حل می‌کنید؟",
    answerContent: `### Production Diagnostics: Identifying & Resolving ThreadPool Starvation

ThreadPool Starvation occurs when worker threads in the ThreadPool are synchronously blocked (e.g. \`.Result\`, \`.Wait()\`, database connection pool timeouts), preventing the runtime from dispatching new requests or completing asynchronous I/O continuations.

\`\`\`mermaid
flowchart LR
    Symptom["Symptom: High Latency Spikes (P99 > 15s) + Low CPU Usage (< 10%)"] --> Tool1["1. dotnet-counters monitor"]
    Tool1 --> Check["ThreadPool Thread Count climbing steadily (1 per 500ms) + Queue Length exploding"]
    Check --> Tool2["2. dotnet-dump collect & analyze"]
    Tool2 --> Clrstack["Execute: clrstack -all"]
    Clrstack --> RootCause["Found: System.Threading.Tasks.Task.Wait or GetResult on multiple threads!"]
\`\`\`

#### 1. Real-Time Detection with \`dotnet-counters\`:
Run \`dotnet-counters\` against the live production PID:
\`\`\`bash
dotnet-counters monitor --process-id <PID> --counters System.Runtime
\`\`\`
- **The "Smoking Gun" Metric Signature:**
  1. **ThreadPool Queue Length:** Continuously increasing (e.g. thousands of queued work items waiting for an available thread).
  2. **ThreadPool Thread Count:** Slowly creeping upward by 1 thread every 500ms (Hill-Climbing throttle).
  3. **CPU Usage:** Very low (e.g. $5\\% - 15\\%$), proving that threads are not busy computing, but rather **synchronously blocked in sleep/wait states**.

#### 2. Root Cause Analysis with \`dotnet-dump\`:
Capture and inspect a live memory dump:
\`\`\`bash
dotnet-dump collect --process-id <PID> -o /tmp/crash_dump.dmp
dotnet-dump analyze /tmp/crash_dump.dmp
\`\`\`

Inside the analyzer, list all thread stack traces:
\`\`\`text
> clrstack -all
\`\`\`
- Look for repeating patterns across 50+ threads:
\`\`\`text
OS Thread 0x1A4F:
  System.Threading.Monitor.Wait
  System.Threading.ManualResetEventSlim.Wait
  System.Threading.Tasks.Task.GetResultCore
  System.Threading.Tasks.Task\`1.get_Result
  MyApp.Services.OrderService.GetCustomerDetails(int customerId)
\`\`\`

#### 3. Resolution Strategy:
1. **Eradicate Sync-over-Async:** Replace all \`.Result\`, \`.Wait()\`, and \`.GetAwaiter().GetResult()\` with pure \`await\`.
2. **Configure Minimum Threads (Temporary Emergency Hotfix):**
   \`\`\`csharp
   // Prevents hill-climbing delay during traffic spikes:
   ThreadPool.SetMinThreads(workerThreads: 200, completionPortThreads: 200);
   \`\`\`
3. **Audit Third-Party SDKs:** Ensure all database drivers and HTTP clients are using non-blocking asynchronous APIs.`,
    answerContent_fa: `### ریشه‌یابی و حل مشکل بحرانی ThreadPool Starvation در پروداکشن با ابزارهای دات‌نت

پدیده ThreadPool Starvation زمانی رخ می‌دهد که نخ‌های کارگر دات‌نت به دلیل کدهای همگام و مسدودکننده (مانند \`.Result\` یا \`.Wait()\`) قفل شده و هیچ نخی برای پردازش ادامه‌ درخواست‌ها باقی نماند.

#### ۱. پایش بلادرنگ با \`dotnet-counters\`:
با اجرای دستور زیر وضعیت ران‌تایم را مانیتور می‌کنیم:
\`\`\`bash
dotnet-counters monitor --process-id <PID> --counters System.Runtime
\`\`\`
- **نشانه‌های قطعی بروز Starvation:**
  ۱. **طول صف ThreadPool (Queue Length):** به سرعت در حال افزایش است و هزاران تسک معطل مانده‌اند.
  ۲. **تعداد نخ‌ها (Thread Count):** هر ۵۰۰ میلی‌ثانیه ۱ عدد افزایش می‌یابد.
  ۳. **میزان مصرف CPU:** بسیار پایین است (مثلاً کمتر از ۱۰٪) که نشان می‌دهد نخ‌ها کار پردازشی انجام نمی‌دهند بلکه **همگی در حالت انتظار مسدود شده‌اند**.

#### ۲. تحلیل دامپ حافظه با \`dotnet-dump\`:
یک دامپ از حافظه پروسس می‌گیریم و استک تمام نخ‌ها را بررسی می‌کنیم:
\`\`\`bash
dotnet-dump collect --process-id <PID>
dotnet-dump analyze <dump_file>
> clrstack -all
\`\`\`
با مشاهده استک‌تریس نخ‌ها، متدهای مسدودکننده (مانند \`Task.get_Result\` یا \`Monitor.Wait\`) و خط دقیق کدی که باعث قفل شدن شده است شناسایی می‌شود.

#### ۳. راهکارهای رفع مشکل:
۱. **حذف قطعی کدهای Sync-Over-Async:** جایگزینی تمام \`.Result\` و \`.Wait()\` با \`await\` ناهمگام در کل کدهای پروژه.
۲. **تنظیم کف تعداد نخ‌های اولیه (راهکار اورژانسی برای ترافیک‌های جهشی):**
\`\`\`csharp
ThreadPool.SetMinThreads(workerThreads: 200, completionPortThreads: 200);
\`\`\``,
  },
  {
    id: "dotnet-senior-gc-q1",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-clr-gc-internals"],
    questionTitle: "How does the CLR Generational Garbage Collector work under the hood (Gen 0, 1, 2), what triggers GC promotion, and why are Gen 2 Full GC collections the primary source of latency spikes?",
    questionTitle_fa: "موتور Garbage Collector نسل‌بندی‌شده CLR چگونه کار می‌کند، چه عواملی باعث ارتقای اشیاء به نسل‌های بالاتر می‌شوند و چرا پاکسازی‌های Full GC نسل ۲ عامل اصلی جهش‌های تاخیر (Latency Spikes) هستند؟",
    answerContent: `### CLR Generational Garbage Collector Internals & Generation Promotion

The .NET Garbage Collector operates on the **Generational Hypothesis**: *new objects have short lifespans ($>90\\%$ die in Gen 0), while surviving objects live for extended periods*.

\`\`\`mermaid
flowchart LR
    Alloc["new Object() (< 85KB)"] --> G0["Gen 0 (Ephemeral)"]
    G0 -->|Survives Gen 0 GC| G1["Gen 1 (Buffer Zone)"]
    G1 -->|Survives Gen 1 GC| G2["Gen 2 (Tenured Long-Lived)"]
    
    G0 -.->|Sub-millisecond Pause (< 1ms)| Collect0["Fast Gen 0 Sweep"]
    G2 -.->|Stop-The-World Pause (10ms - 200ms+)| Collect2["Expensive Full GC Sweep + Compact"]
\`\`\`

#### 1. The Generational Hierarchy:
- **Gen 0 (Ephemeral):** The entry point for all allocations $< 85\\text{ KB}$. It is sized to fit within CPU L2/L3 cache budgets so that allocating and sweeping objects is blazing fast ($< 1\\text{ ms}$).
- **Gen 1 (Buffer Zone):** Acts as a shock absorber. Objects that were in-flight during a Gen 0 collection get a second chance to die here before being tenured.
- **Gen 2 (Tenured):** Long-lived singletons, static references, configuration objects, and long-lived domain caches.

#### 2. What Triggers Object Promotion (Aging):
Promotion occurs when an object is still referenced by an active **GC Root** (e.g. CPU registers, stack slots of running threads, static fields, or pinned handles) at the moment a collection executes:
- $\\text{Gen 0} \\rightarrow \\text{Gen 1}$: Survives one GC cycle.
- $\\text{Gen 1} \\rightarrow \\text{Gen 2}$: Survives a second GC cycle.

#### 3. Why Gen 2 Full GC Collections Cause Latency Spikes:
1. **Heap Graph Traversal Volume:** Gen 2 collections must traverse the entire object graph of all generations (Gen 0 + 1 + 2 + LOH).
2. **Stop-The-World (STW) Pauses:** Execution threads must be suspended while references are patched during the Compact phase.
3. **Cache Line Eviction:** Full sweeps touch large regions of physical RAM, evicting cache-hot application memory from CPU L1/L2/L3 caches.`,
    answerContent_fa: `### کالبدشکافی عملکرد Garbage Collector نسل‌بندی‌شده و چرایی ایجاد Latency Spikes توسط نسل ۲

موتور مدیریت حافظه دات‌نت بر اساس **فرضیه نسل‌ها (Generational Hypothesis)** کار می‌کند که بیان می‌دارد بیش از ۹۰٪ از اشیاء طول عمر کوتاهی دارند.

#### ۱. ساختار نسل‌های سه‌گانه حافظه:
- **نسل ۰ (Gen 0):** محل تولد تمام اشیای زیر ۸۵ کیلوبایت است. اندازه این نسل طوری تنظیم شده که درون کش سریع L2/L3 پردازنده جا شود و پاکسازی آن کمتر از ۱ میلی‌ثانیه زمان ببرد.
- **نسل ۱ (Gen 1):** به عنوان لایه بافر و ضربه‌گیر عمل می‌کند تا اشیایی که در حین اجرای یک درخواست زنده بوده‌اند، شانس از بین رفتن داشته باشند و سریعاً وارد نسل ۲ نشوند.
- **نسل ۲ (Gen 2):** محل استقرار اشیای پایدار مانند سرویس‌های Singleton، کش‌های درون حافظه و جداول ثابت است.

#### ۲. چه عواملی باعث ارتقای نسل (Promotion) می‌شوند؟
اگر در زمان شروع فرآیند GC یک شیء هنوز از طریق **ریشه‌ها (GC Roots)** مانند استک نخ‌های فعال، رجیسترهای CPU یا فیلدهای Static در دسترس باشد، زنده در نظر گرفته شده و به نسل بعدی ارتقا می‌یابد.

#### ۳. چرا پاکسازی نسل ۲ (Full GC) باعث نوسان تاخیر می‌شود؟
۱. **حجم بالای اسکن گراف اشیاء:** در Full GC تمام فضای حافظه (نسل‌های ۰ و ۱ و ۲ و LOH) باید به صورت کامل اسکن شوند.
۲. **وقفه‌های Stop-The-World:** برای فشرده‌سازی و جابجایی آدرس اشاره‌گرها، تمام نخ‌های برنامه موقتاً متوقف می‌شوند.
۳. **تخریب کش پردازنده:** اسکن مگابایت‌ها و گیگابایت‌ها حافظه در رم، کش‌های سریع CPU را پاکسازی کرده و سرعت سیستم را پس از پایان GC کاهش می‌دهد.`,
  },
  {
    id: "dotnet-senior-gc-q2",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-clr-gc-internals"],
    questionTitle: "What is the Large Object Heap (LOH), why does it suffer from memory fragmentation, and what architectural strategies (e.g. POH, ArrayPool, LOH Compaction) prevent OutOfMemoryException crashes?",
    questionTitle_fa: "حافظه اشیای بزرگ (LOH) چیست، چرا دچار تکه‌تکه‌شدگی حافظه می‌شود و چه استراتژی‌های معمارانه‌ای (POH، ArrayPool و فشرده‌سازی LOH) مانع از خطای OutOfMemoryException می‌شوند؟",
    answerContent: `### The Large Object Heap (LOH) Mechanics, Fragmentation & Mitigation Strategies

In .NET, any object whose size exceeds **$85,000\\text{ bytes}$** is placed directly on the **Large Object Heap (LOH)**.

\`\`\`mermaid
flowchart TD
    Alloc["Allocation >= 85,000 Bytes"] --> LOH["Placed on Large Object Heap (LOH)"]
    LOH --> Collect["GC Collection on LOH"]
    Collect --> Sweep["Sweep Phase Only (NO Compaction by Default)"]
    Sweep --> SwissCheese["Memory Gaps Created ('Swiss Cheese' Fragmentation)"]
    SwissCheese --> OOM["New Large Allocation Fails -> OutOfMemoryException!"]
\`\`\`

#### 1. Why LOH Causes Memory Fragmentation:
- **Sweep-Only Policy:** The CLR does not compact LOH by default because moving multi-megabyte memory blocks requires expensive memory copies that freeze CPU execution.
- **The "Swiss Cheese" Effect:** When large objects are collected, they leave free holes. If a subsequent request needs a contiguous 1 MB block, but available free space consists of disjointed 256 KB holes, allocation fails with an \`OutOfMemoryException\` even though total free RAM is plentiful.

#### 2. Architectural Prevention Strategies:
1. **Buffer Pooling with \`ArrayPool<T>.Shared\`:**
   - Instead of allocating new \`byte[100_000]\` buffers per request, rent and return pooled buffers:
   \`\`\`csharp
   byte[] buffer = ArrayPool<byte>.Shared.Rent(100_000);
   try { Process(buffer); }
   finally { ArrayPool<byte>.Shared.Return(buffer); }
   \`\`\`
2. **Pinned Object Heap (POH) for Native Buffers:**
   - In .NET 5+, allocate pinned interop buffers directly on POH with \`GC.AllocateArray<byte>(length, pinned: true)\` to eliminate SOH pinning fragmentation.
3. **On-Demand LOH Compaction:**
   - Force compaction during off-peak scheduled maintenance:
   \`\`\`csharp
   GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
   GC.Collect(2, GCCollectionMode.Optimized);
   \`\`\``,
    answerContent_fa: `### کالبدشکافی حافظه اشیای بزرگ (LOH)، معضل فرگمنتیشن و راهکارهای جلوگیری از خطای OOM

اشیایی با حجم ۸۵,۰۰۰ بایت یا بیشتر مستقیماً وارد ناحیه **Large Object Heap (LOH)** می‌شوند.

#### ۱. چرا LOH دچار تکه‌تکه‌شدگی (Fragmentation) می‌شود؟
- **فقط جاروب کردن بدون فشرده‌سازی:** کپی کردن بلوک‌های بزرگ حافظه در فاز Compaction باعث فریز شدن طولانی CPU می‌شود؛ بنابراین LOH به صورت پیش‌فرض فشرده‌سازی نمی‌شود.
- **اثر سوراخ‌های پنیر سوئیسی:** با حذف اشیای بزرگ، حفره‌های خالی پراکنده در حافظه ایجاد می‌شود. اگر درخواست جدیدی نیازمند ۱ مگابایت حافظه پیوسته باشد ولی حافظه‌های خالی به شکل تکه‌های ۲۵۶ کیلوبایتی پراکنده باشند، سیستم با اینکه رم آزاد دارد با خطای \`OutOfMemoryException\` کرش می‌کند.

#### ۲. استراتژی‌های معمارانه برای حل مشکل:
۱. **استفاده از \`ArrayPool<T>.Shared\`:** بازیافت بافرهای بزرگ به جای ساخت مداوم آن‌ها روی LOH.
۲. **استفاده از Pinned Object Heap (POH):** ساخت بافرهای قفل‌شده Native مستقیماً روی POH تا SOH دچار فرگمنتیشن نشود.
۳. **فشرده‌سازی کنترل‌شده LOH در ساعات کم‌ترافیک:** با تنظیم \`GCLargeObjectHeapCompactionMode.CompactOnce\`.`,
  },
  {
    id: "dotnet-senior-gc-q3",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-clr-gc-internals"],
    questionTitle: "Explain the architectural differences between Server GC and Workstation GC in .NET, how Server GC achieves lock-free multi-core parallelism, and how does DATAP optimize high-density Kubernetes containers in .NET 8/9?",
    questionTitle_fa: "تفاوت‌های معمارانه Server GC و Workstation GC در دات‌نت چیست، Server GC چگونه موازی‌سازی بدون قفل روی پردازنده‌های چند‌هسته‌ای ایجاد می‌کند و قابلیت DATAP در دات‌نت ۸ و ۹ چگونه مصرف منابع در کانتینرهای کوبرنتیز را بهینه می‌سازد؟",
    answerContent: `### Server GC vs. Workstation GC Architecture & Container Tuning (DATAP)

The CLR runtime offers two distinct Garbage Collector implementations designed for opposite operational profiles.

\`\`\`mermaid
flowchart LR
    subgraph WorkstationGC["Workstation GC (Single Shared Heap)"]
        W_Heap["Single Managed Heap"]
        W_Thread["Runs GC on User Thread / 1 Background GC Thread"]
        W_Goal["Optimized for Low Latency & Responsive UI"]
    end

    subgraph ServerGC["Server GC (1 Heap + 1 GC Thread per CPU Core)"]
        S_Heaps["Heap 0 | Heap 1 | Heap 2 ... Heap N"]
        S_Threads["GC Thread 0 | Thread 1 | Thread 2 ... Thread N"]
        S_Goal["Optimized for Maximum Multi-Core Throughput"]
    end
\`\`\`

#### 1. Architectural Differences:
| Dimension | Workstation GC | Server GC |
| :--- | :--- | :--- |
| **Number of Managed Heaps** | Exactly 1 Shared Heap | **1 Dedicated Heap per Logical CPU Core** |
| **GC Execution Threads** | Requesting user thread or 1 background thread | **1 Dedicated High-Priority GC Thread per Core** |
| **Allocation Contention** | Threads contend on single allocation pointer | **Zero Contention:** Threads allocate on their local core heap |
| **Target Workload** | Desktop (WPF/WinForms), CLI tools, Mobile (MAUI) | High-throughput web servers (ASP.NET Core) |

#### 2. High-Density Container Tuning & DATAP in .NET 8/9:
- **The Kubernetes Problem:** Running Server GC on a 64-core host machine inside a pod with a $1\\text{ CPU}$ limit would create 64 heaps and 64 GC threads, consuming hundreds of megabytes of baseline memory and triggering OOMKills.
- **Dynamic Adaptation to Application Sizes (DATAP):** In .NET 8/9, the CLR auto-tunes heap counts dynamically based on container memory limits (\`cgroup\`), scaling from a single heap up to the container's CPU quota.`,
    answerContent_fa: `### مقایسه عمیق Server GC و Workstation GC و بهینه‌سازی کانتینرهای کوبرنتیز با DATAP

#### ۱. تفاوت‌های معمارانه:
- **مدل Workstation GC:** تنها یک Managed Heap واحد دارد و عملیات پاکسازی را روی همان نخ کاربر اجرا می‌کند تا حافظه کمتری مصرف کند و رابط کاربری دچار مکث نشود.
- **مدل Server GC:** به ازای **هر هسته CPU یک Heap مجزا و یک نخ اختصاصی GC** می‌سازد. نخ‌های پردازشی دات‌نت بدون هیچ رقابت یا قفل‌شدگی، روی هیپ هسته خود حافظه تخصیص می‌دهند و توان پردازشی سرور به حداکثر می‌رسد.

#### ۲. حل معضل کانتینرهای کوبرنتیز با قابلیت DATAP در دات‌نت ۸ و ۹:
در گذشته، اگر پادی با محدودیت ۱ گیگابایت رم روی یک سرور فیزیکی ۶۴ هسته‌ای دیپلوی می‌شد، Server GC تعداد ۶۴ هیپ مجزا می‌ساخت که رم پاد بلافاصله پر شده و توسط لینوکس با خطای OOMKill نابود می‌شد.
قابلیت **DATAP** در دات‌نت ۸ و ۹ به صورت خودکار محدودیت‌های cgroups کانتینر را خوانده و تعداد هیپ‌ها و بودجه حافظه را دقیقاً متناسب با سایز کانتینر تنظیم می‌کند.`,
  },
  {
    id: "dotnet-senior-gc-q4",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-clr-gc-internals"],
    questionTitle: "How do Tiered JIT Compilation and Dynamic Profile-Guided Optimization (Dynamic PGO) work in .NET 8/9, how does the JIT devirtualize interface calls, and how does it compare with Native AOT?",
    questionTitle_fa: "فرآیند کامپایل چند‌سطحی Tiered JIT و بهینه‌سازی مبتنی بر پروفایل پویا (Dynamic PGO) در دات‌نت ۸ و ۹ چگونه کار می‌کنند، کامپایلر چگونه فراخوانی اینترفیس‌ها را Devirtualize می‌کند و چه تفاوت‌هایی با Native AOT دارد؟",
    answerContent: `### Tiered JIT Compilation, Dynamic PGO & Devirtualization in .NET 8/9

The CoreCLR JIT compiler uses a multi-tier pipeline to balance fast application startup with maximum steady-state throughput.

\`\`\`mermaid
flowchart TD
    Call["Method Invocations (Tier 0 Quick JIT)"] --> Count{Calls > 30?}
    Count -- Yes --> PGO["Dynamic PGO: Inspects runtime types & branch frequencies"]
    PGO --> Tier1["Tier 1 JIT: Emits optimized machine code"]
    Tier1 --> Devirt["Interface Devirtualization & Direct Inlining"]
\`\`\`

#### 1. The Compilation Tiers:
1. **Tier 0 (Quick JIT):** Compiles methods into unoptimized native code in $< 1\\text{ ms}$ with instrumentation stubs to enable instant startup.
2. **Dynamic PGO (Profile-Guided Optimization - Default in .NET 8/9):** Collects runtime telemetry: Which branches are taken? What concrete types implement this interface?
3. **Tier 1 (Optimized JIT):** Re-compiles hot methods with aggressive vectorization (AVX-512), loop unrolling, and devirtualization.

#### 2. Interface Devirtualization in Action:
\`\`\`csharp
public interface IPaymentService { void Pay(); }

// If Dynamic PGO observes that 99.9% of calls pass CreditCardPayment:
public void Process(IPaymentService svc)
{
    // Tier 1 JIT generates an inline fast-path check:
    if (svc is CreditCardPayment cc)
    {
        // DIRECT INLINE: Zero vtable jump, raw native instructions!
        cc.ExecuteDirect();
    }
    else
    {
        svc.Pay(); // Fallback to slow virtual dispatch
    }
}
\`\`\`

#### 3. JIT vs. Native AOT:
- **Tiered JIT with Dynamic PGO:** Yields higher maximum peak throughput because it optimizes based on live runtime execution data.
- **Native AOT:** Pre-compiles everything ahead-of-time to native binaries with **instant startup ($< 10\\text{ ms}$)** and minimal RAM footprint, ideal for micro-VMs and AWS Lambda cold starts.`,
    answerContent_fa: `### نحوه عملکرد Tiered JIT، بهینه‌سازی Dynamic PGO و Devirtualization در دات‌نت ۸ و ۹

کامپایلر JIT دات‌نت برای دستیابی همزمان به استارت‌آپ سریع و حداکثر توان پردازشی، از معماری چند‌سطحی استفاده می‌کند:

#### ۱. سطوح کامپایل:
۱. **سطح Tier 0 (Quick JIT):** متدها را در کسری از میلی‌ثانیه و بدون بهینه‌سازی کامپایل می‌کند تا برنامه بلافاصله اجرا شود.
۲. **تحلیل پروفایل پویا (Dynamic PGO):** در حین اجرای برنامه، فرکانس اجرای شرط‌ها و کلاس‌های واقعی پشت اینترفیس‌ها را مانیتور می‌کند.
۳. **سطح Tier 1 (Optimized JIT):** متدهای پرتکرار را با دستورات برداری SIMD، باز کردن حلقه‌ها و اینلاین کردن کدهای تکراری بازنویسی می‌کند.

#### ۲. مکانیزم Devirtualization:
در برنامه‌نویسی شیءگرا، فراخوانی متدهای اینترفیس نیازمند جستجو در جدول متدها (vtable) است. اگر کامپایلر تشخیص دهد که ۹۹٪ فراخوانی‌های یک اینترفیس به کلاس \`CreditCardPayment\` ختم می‌شود، یک شرط مستقیم در اسمبلی تولید کرده و **کد متد مقصد را مستقیماً اینلاین می‌کند** تا پرش غیرمستقیم حذف شود.

#### ۳. مقایسه با Native AOT:
- **کامپایلر JIT + Dynamic PGO:** در کارهای طولانی‌مدت به دلیل بهینه‌سازی بر اساس رفتار زنده سرور، توان عملیاتی بالاتری نسبت به کامپایل ایستا دارد.
- **مدل Native AOT:** بدون JIT کل کد را به باینری خالص لینوکس/ویندوز کامپایل می‌کند و استارت‌آپ فوق‌سریع (زیر ۱۰ میلی‌ثانیه) با حداقل مصرف رم فراهم می‌سازد.`,
  },
  {
    id: "dotnet-senior-gc-q5",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-clr-gc-internals"],
    questionTitle: "How do you detect and investigate memory leaks, unmanaged handle leaks, and GC pressure in production .NET services using dotnet-dump, dotnet-gcdump, and PerfView?",
    questionTitle_fa: "چگونه نشت حافظه (Memory Leaks)، نشت هندل‌های مدیریت‌نشده و فشار به Garbage Collector را در سرویس‌های پروداکشن دات‌نت با ابزارهای dotnet-dump، dotnet-gcdump و PerfView تحلیل و رفع می‌کنید؟",
    answerContent: `### Production Diagnostics: Memory Leak Detection & GC Root Analysis

Managed memory leaks in .NET occur when unreachable objects remain referenced by **active GC Roots** (e.g. static event subscriptions, captive DI dependencies, or unreleased Timer handles).

\`\`\`mermaid
flowchart LR
    Symptom["Symptom: Memory steadily climbs upward -> Container OOMKills"] --> Step1["1. Capture fast heap snapshot with dotnet-gcdump"]
    Step1 --> Step2["2. Diff two snapshots in Visual Studio / PerfView"]
    Step2 --> Step3["3. Inspect GC Root Retention Path (gcroot)"]
    Step3 --> Fix["Fix: Unsubscribe events, fix singleton caching, or dispose unmanaged handles"]
\`\`\`

#### 1. Capturing Live Snapshots with \`dotnet-gcdump\`:
\`\`\`bash
# Capture lightweight heap snapshot without pausing process:
dotnet-gcdump collect --process-id <PID> -o /tmp/snapshot1.gcdump
# Wait 10 minutes under load...
dotnet-gcdump collect --process-id <PID> -o /tmp/snapshot2.gcdump
\`\`\`

#### 2. Investigating Retention Paths with \`dotnet-dump\`:
For deep inspection of raw memory and unmanaged handles:
\`\`\`bash
dotnet-dump collect --process-id <PID> -o /tmp/memdump.dmp
dotnet-dump analyze /tmp/memdump.dmp
\`\`\`

Inside the analyzer, find the top memory-consuming types:
\`\`\`text
> dumpheap -stat
# Output: Lists object count and total memory per type:
# MT               Count     TotalSize Class Name
# 00007ff8a123    450,000   36,000,000 MyApp.Models.CustomerSession

> dumpheap -type MyApp.Models.CustomerSession
# Grab an address: 0x000001dfa234b670

> gcroot 0x000001dfa234b670
# Output: Traces the exact root path keeping the object alive:
# -> static System.EventHandler MyApp.Events.Bus.OnOrderPlaced
#   -> MyApp.Services.NotificationService (Subscribed but never unsubscribed!)
\`\`\`

#### 3. The 3 Most Common .NET Memory Leak Culprits:
1. **Unsubscribed Static Events:** Static event handlers hold strong references to subscriber instances indefinitely.
2. **Captive DI Singletons:** Injecting a Scoped or Transient service into a Singleton keeps all related dependencies in Gen 2 forever.
3. **Unreleased Native / GCHandles:** Forgetting to free \`GCHandle.Alloc(pinned: true)\` or native \`NativeMemory.Alloc\` pointers.`,
    answerContent_fa: `### ریشه‌یابی نشت حافظه (Memory Leak) و فشار به GC در پروداکشن

نشت حافظه در دات‌نت زمانی رخ می‌دهد که اشیاء بی‌استفاده، ناخواسته از طریق ریشه‌های زنده (مانند ایونت‌های Static یا سرویس‌های Singleton) در حافظه نگه داشته شوند.

#### ۱. ثبت اسنپ‌شات با \`dotnet-gcdump\`:
\`\`\`bash
dotnet-gcdump collect --process-id <PID> -o /tmp/snap1.gcdump
# ۱۰ دقیقه بعد زیر بار ترافیکی:
dotnet-gcdump collect --process-id <PID> -o /tmp/snap2.gcdump
\`\`\`
با مقایسه دو فایل در ویژوال استودیو، کلاس‌هایی که تعداد نمونه‌های آن‌ها به طور غیرطبیعی در حال افزایش است مشخص می‌شوند.

#### ۲. ردیابی ریشه نگه‌دارنده با دستور \`gcroot\` در \`dotnet-dump\`:
\`\`\`bash
dotnet-dump analyze /tmp/memdump.dmp
> dumpheap -stat
# مشاهده اشیای با بیشترین حجم رم
> gcroot <Object_Address>
\`\`\`
دستور \`gcroot\` مسیر دقیق اتصال شیء را نشان می‌دهد؛ مثلاً مشخص می‌کند که یک ایونت \`static\` مانع از جمع‌آوری شیء توسط GC شده است.

#### ۳. سه دلیل اصلی نشت حافظه در دات‌نت:
۱. **ایونت‌های Static بدون Unsubscribe:** ایونت‌های استاتیک تا پایان عمر پروسس رفرنس تمام مشترکین خود را در رم نگه می‌دارند.
۲. **وابستگی‌های اسیر در DI (Captive Dependencies):** تزریق یک سرویس Scoped به یک کلاس Singleton که باعث ماندگاری دائم شیء در نسل ۲ می‌شود.
۳. **هندل‌های مدیریت‌نشده:** فراموش کردن آزادسازی بافرهای Unmanaged یا هندل‌های Pinned.`,
  },
  {
    id: "dotnet-senior-expr-q1",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "How do Expression Trees represent code as an Abstract Syntax Tree (AST) in C#, how does ExpressionVisitor recursively traverse and mutate expressions, and what is the difference between Func<T, bool> and Expression<Func<T, bool>>?",
    questionTitle_fa: "درخت عبارات (Expression Trees) چگونه کد را به صورت یک ساختار داده انتزاعی (AST) مدل‌سازی می‌کنند، الگوی ExpressionVisitor چگونه درخت را پیمایش و بازنویسی می‌کند و تفاوت بنیادین میان Func و Expression چیست؟",
    answerContent: `### Expression Trees as Abstract Syntax Trees (AST) & The \`ExpressionVisitor\` Pattern

An **Expression Tree** represents executable code not as compiled Intermediate Language (IL) instructions, but as an in-memory tree data structure composed of nodes inheriting from \`System.Linq.Expressions.Expression\`.

\`\`\`mermaid
flowchart TD
    Lambda["Lambda: p => p.Price > 100 && p.IsActive"] --> Root["BinaryExpression (AndAlso)"]
    Root --> Left["BinaryExpression (GreaterThan)"]
    Root --> Right["MemberExpression (p.IsActive)"]
    Left --> LeftProp["MemberExpression (p.Price)"]
    Left --> LeftConst["ConstantExpression (100)"]
\`\`\`

#### 1. Fundamental Difference: \`Func<T, bool>\` vs. \`Expression<Func<T, bool>>\`:
- **\`Func<T, bool>\` (Delegate):** Compiled IL bytecode pointer. It is executed directly by the CPU in application RAM against \`IEnumerable<T>\`. It is an opaque black box that cannot be inspected at runtime.
- **\`Expression<Func<T, bool>>\` (AST):** A transparent, inspectable tree of C# objects. It can be analyzed, rewritten, and translated into another language (such as SQL by EF Core's \`IQueryProvider\`).

#### 2. Traversing and Mutating Expressions with \`ExpressionVisitor\`:
The **Visitor Pattern** allows traversing and rewriting immutable expression nodes:

\`\`\`csharp
public class MultiplyByTwoVisitor : ExpressionVisitor
{
    protected override Expression VisitConstant(ConstantExpression node)
    {
        if (node.Value is int val)
        {
            // Replaces constant 100 with 200 in the tree:
            return Expression.Constant(val * 2);
        }
        return base.VisitConstant(node);
    }
}
\`\`\``,
    answerContent_fa: `### کالبدشکافی درخت عبارات (Expression Trees) به عنوان درخت گره‌های AST و الگوی \`ExpressionVisitor\`

#### ۱. تفاوت بنیادین میان \`Func\` و \`Expression\`:
- **دلیگیت \`Func<T, bool>\`:** مستقیماً به بایت‌کدهای اجرایی IL کامپایل شده و در حافظه RAM اپلیکیشن روی کالکشن‌های \`IEnumerable\` اجرا می‌شود؛ این ساختار برای برنامه یک جعبه سیاه غیرقابل تحلیل است.
- **درخت \`Expression<Func<T, bool>>\`:** کدهای لامبدا را به صورت یک ساختار درختی از اشیاء شیءگرا (**Abstract Syntax Tree**) در حافظه نگهداری می‌کند تا موتورهای ORM بتوانند گره‌های شرط را بخوانند و به دستورات SQL ترجمه نمایند.

#### ۲. پیمایش و بازنویسی درخت با کلاس \`ExpressionVisitor\`:
گره‌های درخت عبارات ذاتا **غیرقابل تغییر (Immutable)** هستند. برای دستکاری یا ترجمه درخت، از الگوی دیزاین پترن Visitor استفاده می‌شود:
متدهای کلاس \`ExpressionVisitor\` (مانند \`VisitBinary\`، \`VisitMember\` و \`VisitConstant\`) به صورت بازگشتی گره‌ها را بررسی کرده و در صورت نیاز گره‌های اصلاح‌شده جدیدی را جایگزین می‌کنند.`,
  },
  {
    id: "dotnet-senior-expr-q2",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "How does Entity Framework Core translate LINQ Expression Trees into parameterized SQL, how does parameter extraction prevent SQL injection, and why was Client Evaluation disabled in EF Core 3.0+?",
    questionTitle_fa: "موتور Entity Framework Core چگونه درخت عبارات LINQ را به کوئری‌های پارامتریزه SQL ترجمه می‌کند، فرآیند استخراج متغیرها چگونه مانع از SQL Injection می‌شود و چرا ارزیابی کلاینت (Client Evaluation) در نسخه‌های مدرن EF Core غیرفعال شد؟",
    answerContent: `### EF Core Query Translation Engine & Parameter Extraction Mechanics

When querying with LINQ-to-Entities (\`dbContext.Products.Where(p => p.Price > minPrice)\`), EF Core does not execute the filter in memory; it translates the AST into native SQL.

\`\`\`mermaid
flowchart LR
    Linq["IQueryable.Where(p => p.Price > minPrice)"] --> Visitor["RelationalQueryableMethodTranslatingExpressionVisitor"]
    Visitor --> ParamExtract["Parameter Extractor: minPrice -> @__minPrice_0"]
    Visitor --> SqlGen["SQL Generator"]
    SqlGen --> SqlOut["SELECT [p].[Id], [p].[Price] FROM [Products] AS [p] WHERE [p].[Price] > @__minPrice_0"]
\`\`\`

#### 1. The Translation Pipeline:
1. **Node Mapping:**
   - \`MemberExpression (p.Price)\` $\to$ Column \`[p].[Price]\`.
   - \`BinaryExpression (GreaterThan)\` $\to$ SQL \`>\`.
   - \`MemberExpression (minPrice)\` (captured local closure) $\to$ Extracted into parameterized SQL variable \`@__minPrice_0\`.
2. **Security & Performance (Parameter Extraction):**
   - Captured variables are **never inlined as raw string literals**. Parameterization prevents **SQL Injection** and allows SQL Server / PostgreSQL to cache and reuse the compiled query execution plan.

#### 2. Why Client Evaluation Was Disabled (EF Core 3.0+):
- In EF Core 2.x, if a LINQ query contained a C# method that could not be translated to SQL (e.g. \`Where(p => CustomEncrypt(p.Code) == "abc")\`), EF Core would silently fetch the **entire database table into RAM** and evaluate the filter in C#.
- In production, this caused massive memory exhaustion and network saturation.
- **EF Core 3.0+ Policy:** Throws an **\`InvalidOperationException\`** at runtime, requiring developers to either rewrite the expression into translatable SQL constructs or explicitly invoke \`.AsEnumerable()\` to opt into in-memory filtering.`,
    answerContent_fa: `### فرآیند ترجمه کوئری در EF Core و دلیل غیرفعال شدن Client Evaluation

#### ۱. مراحل ترجمه درخت به SQL:
۱. موتور \`ExpressionVisitor\` گره‌های شرط را اسکن می‌کند:
   - گره‌های دسترسی به فیلد (\`p.Price\`) به نام ستون‌های دیتابیس (\`[p].[Price]\`) نگاشت می‌شوند.
   - گره‌های متغیرهای خارجی (Closureها) به پارامترهای دیتابیسی (\`@__minPrice_0\`) تبدیل می‌شوند.
۲. **امنیت و کارایی (Parameter Extraction):** تبدیل متغیرها به پارامترهای SQL مانع از حملات **SQL Injection** شده و اجازه می‌دهد سرور دیتابیس پلن اجرای کوئری (Execution Plan) را کش کند.

#### ۲. چرا Client Evaluation در EF Core 3.0 به بعد غیرفعال شد؟
در نسخه‌های قدیمی، اگر شرطی حاوی متد سفارشی سی‌شارپ بود که دیتابیس آن را نمی‌فهمید (مانند یک تابع هش)، EF Core بدون هشدار **تمام میلیون‌ها رکورد جدول دیتابیس را به رم سرور دانلود می‌کرد** تا شرط را در C# بسنجد که باعث کرش حافظه سرورها می‌شد.
در نسخه‌های مدرن، در صورت عدم امکان ترجمه، ران‌تایم خطای صریح \`InvalidOperationException\` پرتاب می‌کند تا از فاجعه عملکردی در پروداکشن جلوگیری شود.`,
  },
  {
    id: "dotnet-senior-expr-q3",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "How do you build a dynamic, composable search filter (PredicateBuilder) at runtime using Expression Trees, and how do you resolve the ParameterRebinding issue when combining lambda expressions?",
    questionTitle_fa: "چگونه یک فیلتر جستجوی داینامیک و ترکیب‌پذیر (PredicateBuilder) با Expression Trees در زمان اجرا پیاده‌سازی می‌کنید و مشکل تطابق پارامترها (Parameter Rebinding) را در زمان ترکیب عبارات با چه الگویی حل می‌نمایید؟",
    answerContent: `### Dynamic Query Composition & The Parameter Rebinding Pattern

When building dynamic search filters (e.g. e-commerce search with multiple optional checkboxes), combining multiple \`Expression<Func<T, bool>>\` instances using \`Expression.AndAlso\` causes a runtime failure if parameters are not unified.

\`\`\`csharp
// Expression 1: (p1 => p1.Price > 100)  [Parameter: p1]
// Expression 2: (p2 => p2.IsActive)      [Parameter: p2]
// Naive BinaryExpression.AndAlso(expr1.Body, expr2.Body) -> Invalid! Two distinct parameters!
\`\`\`

#### 1. The \`ParameterReplacerVisitor\` Solution:
\`\`\`csharp
public static class PredicateBuilder
{
    public static Expression<Func<T, bool>> And<T>(
        this Expression<Func<T, bool>> left,
        Expression<Func<T, bool>> right)
    {
        // 1. Create a unified single parameter
        var unifiedParam = Expression.Parameter(typeof(T), "x");

        // 2. Rewrite both expression bodies to reference the unified parameter
        var leftBody = new ParameterReplacer(left.Parameters[0], unifiedParam).Visit(left.Body);
        var rightBody = new ParameterReplacer(right.Parameters[0], unifiedParam).Visit(right.Body);

        // 3. Combine with AndAlso
        var combinedBody = Expression.AndAlso(leftBody!, rightBody!);
        return Expression.Lambda<Func<T, bool>>(combinedBody, unifiedParam);
    }

    private sealed class ParameterReplacer : ExpressionVisitor
    {
        private readonly ParameterExpression _source;
        private readonly ParameterExpression _target;

        public ParameterReplacer(ParameterExpression source, ParameterExpression target)
        {
            _source = source;
            _target = target;
        }

        protected override Expression VisitParameter(ParameterExpression node)
            => node == _source ? _target : base.VisitParameter(node);
    }
}
\`\`\`

#### 2. Clean Business Usage in Repositories:
\`\`\`csharp
var filter = PredicateBuilder.True<Product>();

if (searchDto.MinPrice.HasValue)
    filter = filter.And(p => p.Price >= searchDto.MinPrice.Value);

if (!string.IsNullOrEmpty(searchDto.Category))
    filter = filter.And(p => p.Category == searchDto.Category);

var results = await dbContext.Products.Where(filter).ToListAsync();
\`\`\``,
    answerContent_fa: `### پیاده‌سازی PredicateBuilder داینامیک و حل معضل Parameter Rebinding

هنگام ترکیب دو عبارت لامبدا (مثلاً \`p1 => p1.Price > 10\` و \`p2 => p2.IsActive\`)، استفاده مستقیم از \`Expression.AndAlso\` به خطا می‌خورد چون بدنه اول با پارامتر \`p1\` و بدنه دوم با پارامتر \`p2\` تعریف شده است.

#### حل معضل با کلاس \`ParameterReplacer\`:
با پیاده‌سازی یک \`ExpressionVisitor\` سفارشی، پارامترهای هر دو عبارت با یک پارامتر مشترک و واحد (\`unifiedParam\`) جایگزین می‌شوند تا یک عبارت معتبر و قابل ترجمه به SQL برای Entity Framework Core تولید شود.

این الگو امکان ساخت فرم‌های جستجوی پیشرفته با چندین فیلتر اختیاری را بدون ساخت رشته‌های ناامن SQL فراهم می‌سازد.`,
  },
  {
    id: "dotnet-senior-expr-q4",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "How do micro-ORMs like Dapper use Reflection.Emit (DynamicMethod) to generate high-performance CIL row mappers, and why is this significantly faster than standard Reflection?",
    questionTitle_fa: "میکرواورم‌هایی مانند Dapper چگونه با کلاس Reflection.Emit.DynamicMethod کدهای بایت‌کد واسط (CIL) برای مپ کردن سریع رکوردهای دیتابیس تولید می‌کنند و چرا این روش به مراتب سریع‌تر از رفلکشن سنتی است؟",
    answerContent: `### Micro-ORM Dynamic Code Generation: \`Reflection.Emit\` & Dapper Architecture

Standard runtime reflection (\`PropertyInfo.SetValue\`) suffers from heavy overhead:
1. Method metadata lookup table searches.
2. Value type Boxing / Unboxing (converting integers to \`object\`).
3. Inability of the JIT compiler to inline property setters.

\`\`\`mermaid
flowchart TD
    DB["IDataRecord (ADO.NET Reader)"] --> Dapper["Dapper First Call for Type Customer"]
    Dapper --> Emit["Emit DynamicMethod with raw CIL Bytecode (Ldarg, Callvirt, SetProperty)"]
    Emit --> Cache["Cache compiled Func<IDataRecord, Customer> delegate in ConcurrentDictionary"]
    Cache --> Exec["Subsequent 100,000 DB Rows execute at raw C# speed with ZERO boxing!"]
\`\`\`

#### 1. How Dapper Generates Dynamic CIL Row Mappers:
\`\`\`csharp
public static Func<IDataRecord, Customer> CreateCustomerMapper()
{
    // Create an anonymous dynamic method in memory
    var dynamicMethod = new DynamicMethod(
        name: "MapCustomerRow",
        returnType: typeof(Customer),
        parameterTypes: new[] { typeof(IDataRecord) },
        restrictedSkipVisibility: true);

    ILGenerator il = dynamicMethod.GetILGenerator();

    // 1. var customer = new Customer();
    il.Emit(OpCodes.Newobj, typeof(Customer).GetConstructor(Type.EmptyTypes)!);
    
    // 2. customer.Id = reader.GetInt32(0);
    il.Emit(OpCodes.Dup); // Duplicate customer reference on stack
    il.Emit(OpCodes.Ldarg_0); // Load IDataRecord argument
    il.Emit(OpCodes.Ldc_I4_0); // Column index 0
    il.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("GetInt32")!);
    il.Emit(OpCodes.Callvirt, typeof(Customer).GetProperty("Id")!.GetSetMethod()!);

    // 3. return customer;
    il.Emit(OpCodes.Ret);

    return (Func<IDataRecord, Customer>)dynamicMethod.CreateDelegate(typeof(Func<IDataRecord, Customer>));
}
\`\`\`

#### 2. Why This is Ultra-Fast:
- **Zero Boxing:** Values like \`int\` and \`DateTime\` are read and assigned directly via typed CPU registers.
- **Cached Execution:** Once emitted, the delegate is cached in a \`ConcurrentDictionary\`, achieving the exact same speed as handwritten C# mapper code.`,
    answerContent_fa: `### معماری تولید بایت‌کد CIL در میکرواورم Dapper با \`Reflection.Emit\`

رفلکشن سنتی دات‌نت (\`PropertyInfo.SetValue\`) به دلیل جستجوی مداوم در متادیتاها و تبدیل نوع‌های مقداری به شیء (**Boxing**)، سرعت پایینی دارد.

#### نحوه کارکرد Dapper با تولید بایت‌کد در زمان اجرا:
۱. در اولین باری که کوئری اجرا می‌شود، Dapper با استفاده از کلاس \`DynamicMethod\` مستقیماً دستورات ماشین CIL تولید می‌کند که ستون‌های دیتابیس را بدون واسطه به فیلدهای کلاس مپ می‌کند.
۲. این دلیگیت تولیدشده در یک \`ConcurrentDictionary\` کش می‌شود.
۳. برای میلیون‌ها رکورد بعدی، انتساب مقادیر دقیقاً با **سرعت کدهای دستی C# و بدون حتی یک بایت تخصیص حافظه اضافه (Zero Boxing)** انجام می‌گیرد.`,
  },
  {
    id: "dotnet-senior-expr-q5",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "What are Roslyn Incremental Source Generators (IIncrementalGenerator), how do they differ from runtime reflection, and why are they mandatory for Native AOT and high-performance JSON serialization in .NET 8/9?",
    questionTitle_fa: "سورس جنریتورهای افزایشی Roslyn با اینترفیس IIncrementalGenerator چیستند، چه تفاوت بنیادینی با رفلکشن در زمان اجرا دارند و چرا در معماری‌های Native AOT و سریالایزرهای دات‌نت ۸ و ۹ اجباری هستند؟",
    answerContent: `### Roslyn Incremental Source Generators (\`IIncrementalGenerator\`) & Native AOT

Modern .NET 8 and 9 shift metaprogramming from *runtime memory reflection* to *compile-time source generation*.

\`\`\`mermaid
flowchart LR
    Source["C# Source Code with [JsonSerializable]"] --> Roslyn["Roslyn Compiler Engine"]
    Roslyn --> Gen["IIncrementalGenerator (SyntaxValueProvider)"]
    Gen --> Emit["Emits *.g.cs strongly-typed code files"]
    Emit --> Binary["Final Executable / Native AOT Binary (0 Runtime Overhead)"]
\`\`\`

#### 1. Why Runtime Reflection Fails in Modern Cloud-Native Environments:
- **Startup Latency:** Scanning assemblies for attributes and building metadata caches at startup causes slow container boot times.
- **Trimming & Native AOT Incompatibility:** In Native AOT, the compiler trims away unused code and strips metadata to produce a tiny binary. Runtime reflection cannot find stripped properties, causing crashes.

#### 2. The Mechanics of \`IIncrementalGenerator\`:
Incremental Source Generators run directly inside the IDE and compiler:
- **Pipeline Architecture:** Uses \`SyntaxValueProvider\` to filter only relevant syntax nodes (e.g. classes decorated with specific attributes).
- **Incremental Caching:** Only re-runs code generation for files that actually changed, keeping Visual Studio compilation instant.

#### 3. Real-World Production Applications in .NET 8/9:
1. **\`System.Text.Json\` Source Generator:**
   \`\`\`csharp
   [JsonSerializable(typeof(UserDto))]
   public partial class UserJsonContext : JsonSerializerContext { }
   
   // Serialization is 3x faster with 0 reflection and full Native AOT safety:
   string json = JsonSerializer.Serialize(user, UserJsonContext.Default.UserDto);
   \`\`\`
2. **Compile-Time Regular Expressions (\`[GeneratedRegex]\`):**
   \`\`\`csharp
   [GeneratedRegex(@"^\\d{4}-\\d{2}-\\d{2}$")]
   public static partial Regex DatePattern();
   \`\`\`
3. **High-Performance Logging with \`[LoggerMessage]\`:**
   - Emits optimized \`ILogger\` extension methods with zero string allocations and zero boxing.`,
    answerContent_fa: `### سورس جنریتورهای Roslyn و اهمیت معمارانه آن‌ها برای Native AOT در دات‌نت مدرن

در دات‌نت ۸ و ۹، متاپروگرمینگ از رفلکشن زمان اجرا به **تولید کد در زمان کامپایل (Compile-Time Generation)** تغییر مسیر داده است.

#### ۱. معایب رفلکشن سنتی در معماری‌های ابری:
- **افت زمان استارت‌آپ:** اسکن کردن صدها اسمبلی در رم در زمان بوت کانتینر، سرعت بالا آمدن سرویس را کاهش می‌دهد.
- **ناسازگاری با Native AOT و Trimming:** در کامپایل AOT کدهای استفاده‌نشده حذف می‌شوند؛ در نتیجه رفلکشن به متادیتا دسترسی نداشته و برنامه کرش می‌کند.

#### ۲. نحوه عملکرد \`IIncrementalGenerator\`:
سورس جنریتورها در حین تایپ و کامپایل کد، درخت سینتکس Roslyn را بررسی کرده و کدهای بهینه سی‌شارپ (\`*.g.cs\`) تولید می‌کنند. این فایل‌ها مانند کدهای دست‌نویس کامپایل می‌شوند:
- **سرعت اجرای فوق‌العاده با صفر سربار زمان اجرا.**
- **سازگاری ۱۰۰٪ با کامپایل Native AOT بدون نیاز به JIT.**

#### ۳. کاربردهای کلیدی در دات‌نت ۸ و ۹:
۱. **سریالایزر \`System.Text.Json\` با \`[JsonSerializable]\`:** سریالایز سریع‌تر با صفر بایت آلیکیشن.
۲. **عبارات منظم با \`[GeneratedRegex]\`:** تبدیل ریجکس به کدهای لوپ بهینه C#.
۳. **لاگینگ پرسرعت با \`[LoggerMessage]\`:** ثبت لاگ‌های ساختاریافته بدون نیاز به Boxing داده‌های عددی.`,
  },
];






