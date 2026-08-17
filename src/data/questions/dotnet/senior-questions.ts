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
    questionTitle: "What techniques do you use to reduce GC Memory Allocations in high-traffic .NET services?",
    questionTitle_fa: "برای کاهش Memory Allocation در اپلیکیشن‌های High-traffic دات‌نت چه تکنیک‌هایی به کار می‌برید؟",
    answerContent: `### High-Performance Memory Optimization in .NET

1. **Use \`Span<T>\` and \`ReadOnlySpan<T>\`** for zero-allocation string slicing and parsing.
2. **Leverage \`ArrayPool<T>.Shared\`** for byte buffers instead of allocating new byte arrays per request.
3. **Use \`ValueTask<T>\`** for async methods that frequently complete synchronously (e.g. cache hits).
4. **Prefer \`readonly struct\`** for small short-lived data containers.`,
    answerContent_fa: `### تکنیک‌های کاهش مصرف حافظه در دات‌نت

استفاده از **\`Span<T>\`** برای برش رشته‌ها بدون Allocation، استفاده از **\`ArrayPool<T>\`** برای استفاده مجدد از بافرهای بایت، استفاده از **\`ValueTask<T>\`** در توابع با خروجی‌های کش‌شده و استفاده از استراکت‌های تغییرناپذیر.`,
  },
  {
    id: "dotnet-senior-q220",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "senior",
    questionTitle: "How do you use ArrayPool, MemoryPool, and Span<T> in C# for high-performance data processing?",
    questionTitle_fa: "نحوه استفاده از ArrayPool، MemoryPool و Span<T> برای پردازش داده‌های بزرگ در C#؟",
    answerContent: `### Zero-Allocation Buffer Pooling & Span<T>

\`\`\`csharp
// Renting buffer from ArrayPool to avoid Heap allocations
byte[] buffer = ArrayPool<byte>.Shared.Rent(4096);
try
{
    int bytesRead = await stream.ReadAsync(buffer, 0, 4096);
    // Zero-allocation slice using Span
    ReadOnlySpan<byte> slice = buffer.AsSpan(0, bytesRead);
    ProcessPayload(slice);
}
finally
{
    ArrayPool<byte>.Shared.Return(buffer); // Must return to pool!
}
\`\`\``,
    answerContent_fa: `### استفاده از ArrayPool و Span<T>

قرض گرفتن آرایه‌ها از استخر حافظه (\`ArrayPool<T>.Shared.Rent\`) برای جلوگیری از تخصیص مداوم حافظه روی Heap و بازگرداندن آن در بلوک \`finally\`، به همراه پردازش سریع تکه‌های بایت با استفاده از ساختار بدون تخصیص حافظه \`Span<T>\`.`,
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
    questionTitle: "When should you prefer a Modular Monolith over Microservices?",
    questionTitle_fa: "چه زمانی ترجیح می‌دهید به جای میکروسرویس از الگوی Modular Monolith استفاده کنید؟",
    answerContent: `### Modular Monolith vs. Microservices

Prefer a **Modular Monolith** when:
- Domain boundaries are still evolving (early-stage products).
- Team size is small ($\le 10$ engineers).
- You want the architectural purity and encapsulation of DDD without the operational overhead, network latency, and distributed transaction complexity of microservices.`,
    answerContent_fa: `### چه زمانی Modular Monolith بهتر از میکروسرویس است؟

زمانی که مرزهای بیزینس هنوز تثبیت نشده‌اند یا تیم توسعه کوچک است، الگوی Modular Monolith تمیزی معماری DDD را بدون پیچیدگی‌های سنگین شبکه و دیپلوی میکروسرویس‌ها فراهم می‌کند.`,
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
];

