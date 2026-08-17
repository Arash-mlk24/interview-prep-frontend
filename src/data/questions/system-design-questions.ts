import { Question } from "../models";

export const systemDesignQuestions: Question[] = [
  // ── Step 1: Scalability, Load Balancing & Traffic Management ──
  {
    id: "sys-q1",
    stackId: "system-design",
    categoryId: "sys-scalability",
    levelId: "senior",
    topicIds: ["topic-sys-consistent-hashing"],
    questionTitle: "How does Consistent Hashing work and why is it superior to modulo hashing (hash(k) % N) in distributed systems?",
    questionTitle_fa: "الگوریتم هشینگ پایدار (Consistent Hashing) چگونه کار می‌کند و چرا بر هشینگ ساده ماژولو برتری دارد؟",
    answerContent: `### Consistent Hashing vs. Modulo Hashing

#### 1. The Flaw with Modulo Hashing
In a traditional cache ring with $N$ servers, data is mapped using \`server_index = hash(key) % N\`.
- If one server dies or is added, $N$ changes to $N-1$ or $N+1$.
- **Result:** Almost $100\\%$ of all existing keys are remapped to new servers, triggering a massive **Cache Stampede / Storm** that can bring down primary databases.

#### 2. How Consistent Hashing Operates
- Both servers and cache keys are mapped onto a uniform **$2^{32}-1$ circular hash ring**.
- To locate the server for a key, traverse **clockwise** along the ring until encountering the first server node.
- **Key Advantage:** Adding or removing a server only relocates an average of $K/N$ keys (where $K$ is total keys, $N$ is number of servers).

#### 3. The Virtual Nodes Technique
To prevent non-uniform distribution (Hotspots), each physical machine is assigned $100-300$ **Virtual Nodes (v-nodes)** scattered evenly across the hash ring.

\`\`\`
Ring (0 to 2^32 - 1):
  [ServerA#1 (pos 100)] -> [Key 1 (pos 250)] -> [ServerB#1 (pos 500)] -> [ServerA#2 (pos 900)]
\`\`\``,
    answerContent_fa: `### مقایسه هشینگ پایدار و هشینگ ماژولو

#### ۱. چالش هشینگ ساده ماژولو
در فرمول \`hash(key) % N\`، در صورت تغییر تعداد سرورها ($N$)، تقریباً ۱۰۰٪ کلیدها به سرورهای اشتباه هدایت می‌شوند که موجب تخلیه ناگهانی کش و کرش دیتابیس اصلی می‌شود (Cache Stampede).

#### ۲. مکانیزم هشینگ پایدار (Consistent Hashing)
- کلیدها و سرورها بر روی یک **حلقه دایره‌ای $2^{32}-1$** قرار می‌گیرند.
- برای یافتن سرور متناظر، در جهت عقربه‌های ساعت حرکت کرده تا به اولین سرور برسیم.
- در صورت حذف یا اضافه شدن سرور، تنها بخش کوچکی از کلیدها (به طور میانگین $K/N$) جابجا می‌شوند.

#### ۳. استفاده از نودهای مجازی (Virtual Nodes)
برای جلوگیری از انباشته شدن کلیدها روی یک سرور خاص (Hotspot)، هر سرور فیزیکی به ۱۰۰ الی ۳۰۰ نود مجازی تبدیل شده و در سرتاسر حلقه پخش می‌شود.`,
  },
  {
    id: "sys-q2",
    stackId: "system-design",
    categoryId: "sys-scalability",
    levelId: "mid",
    topicIds: ["topic-sys-consistent-hashing"],
    questionTitle: "What is the difference between Layer 4 (L4) and Layer 7 (L7) Load Balancers?",
    questionTitle_fa: "تفاوت لودبالانسر لایه ۴ (L4) و لایه ۷ (L7) چیست؟",
    answerContent: `### Layer 4 vs. Layer 7 Load Balancing

| Dimension | Layer 4 (Transport Layer) | Layer 7 (Application Layer) |
| :--- | :--- | :--- |
| **Inspection Level** | IP Address, TCP/UDP Ports | HTTP/HTTPS Headers, Cookies, URL Paths, Payload |
| **Performance** | Ultra-high throughput, minimal CPU & memory overhead | Higher CPU cost due to TLS termination & HTTP parsing |
| **Routing Intelligence** | Round Robin, Least Connections, IP Hash | Path-based routing (\`/api/v1/orders\`), Cookie stickiness, Header routing |
| **Examples** | AWS Network Load Balancer (NLB), HAProxy (TCP mode), IPVS | AWS Application Load Balancer (ALB), NGINX, Envoy, Traefik |`,
    answerContent_fa: `### مقایسه لودبالانسرهای L4 و L7

- **لایه ۴ (L4 - لایه انتقال):**
  - مسیریابی بر اساس IP مبدأ/مقصد و پورت TCP/UDP.
  - سرعت فوق‌العاده بالا و مصرف ناچیز پردازنده؛ عدم دسترسی به محتوای هدر یا بدنه HTTP.
- **لایه ۷ (L7 - لایه اپلیکیشن):**
  - باز کردن بسته‌های HTTP/gRPC، بررسی توکن‌های احراز هویت، کوکی‌ها و آدرس URL.
  - امکان مسیریابی هوشمند به میکروسرویس‌های مختلف بر اساس Path و اعمال فیلترهای امنیتی WAF.`,
  },
  {
    id: "sys-q3",
    stackId: "system-design",
    categoryId: "sys-scalability",
    levelId: "senior",
    topicIds: ["topic-sys-rate-limiting"],
    questionTitle: "Explain the Sliding Window Counter algorithm for Rate Limiting and how to implement it atomically in Redis.",
    questionTitle_fa: "الگوریتم شمارنده پنجره لغزان (Sliding Window Counter) را برای Rate Limiting توضیح داده و نحوه پیاده‌سازی اتمیک آن در ردیس را شرح دهید.",
    answerContent: `### Sliding Window Counter Algorithm

#### 1. Why Fixed Window Fails
A fixed window (e.g., 100 requests per minute) allows 100 requests at 00:59 and another 100 at 01:01, allowing **200 requests within a 2-second burst** (2x the intended limit).

#### 2. Sliding Window Counter Formula
$$\\text{Estimated Count} = \\text{Current Window Count} + \\left( \\text{Previous Window Count} \\times (1 - \\text{Overlap Ratio}) \\right)$$

#### 3. Atomic Redis Implementation using Sorted Sets (ZSET)
\`\`\`lua
-- KEYS[1]: User rate limit key (e.g. "rate:user_123")
-- ARGV[1]: Current Unix Timestamp in ms
-- ARGV[2]: Window duration in ms (60000)
-- ARGV[3]: Max allowed limit (100)

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window

-- 1. Remove timestamps outside the active sliding window
redis.call('ZREMRANGEBYSCORE', key, '-inf', clearBefore)

-- 2. Count requests in active window
local count = redis.call('ZCARD', key)

if count < limit then
    redis.call('ZADD', key, now, now)
    redis.call('PEXPIRE', key, window)
    return 1 -- Allowed
else
    return 0 -- Rejected (HTTP 429)
end
\`\`\``,
    answerContent_fa: `### الگوریتم پنجره لغزان (Sliding Window Counter)

#### ۱. ایراد پنجره ثابت (Fixed Window)
در بازه زمانی ثابت (مثلاً ۱ دقیقه)، کاربر می‌تواند ۱۰۰ درخواست در ثانیه ۵۹ و ۱۰۰ درخواست در ثانیه ۰۱ بفرستد و عملاً ۲۰۰ درخواست در ۲ ثانیه ارسال کند.

#### ۲. راه‌حل پنجره لغزان
ترکیبی از شمارنده بازه فعلی و نسبت زمانی باقی‌مانده از بازه قبلی محاسبه می‌شود تا نرخ درخواست همواره زیر حد مجاز باقی بماند.

#### ۳. پیاده‌سازی در ردیس
با استفاده از ساختار **Sorted Set (ZSET)** و ذخیره تایم‌استمپ هر درخواست به عنوان Score، در قالب یک اسکریپت Lua اتمیک، رکوردهای خارج از بازه حذف شده و تعداد درخواست‌های بازه لغزان در چند میکروثانیه چک می‌شود.`,
  },
  {
    id: "sys-q4",
    stackId: "system-design",
    categoryId: "sys-scalability",
    levelId: "senior",
    topicIds: ["topic-sys-caching-strategies"],
    questionTitle: "What are Cache Penetration, Cache Breakdown, and Cache Avalanche, and how do you prevent each?",
    questionTitle_fa: "مفاهیم نفوذ کش (Penetration)، شکست کلید داغ (Breakdown) و بهمن کش (Avalanche) چیستند و راهکار مقابله با هر یک چیست؟",
    answerContent: `### The 3 Classic Distributed Caching Failures

| Issue | Definition / Cause | Production Mitigation |
| :--- | :--- | :--- |
| **Cache Avalanche** | Massive numbers of keys expire at the exact same second, flooding the database. | Add **random jitter** to expiration times: \`TTL = baseTTL + rand(0, 300s)\`. |
| **Cache Breakdown** | A single ultra-popular hot key expires; thousands of concurrent threads query DB simultaneously. | Use **Distributed Mutex Locking (Singleflight)** or soft expiration with background pre-fetching. |
| **Cache Penetration** | Malicious queries request non-existent keys repeatedly, bypassing cache completely. | 1. Cache empty \`null\` values with short TTL.<br>2. Put a **Bloom Filter** in front of cache to reject non-existent keys in $O(1)$ time. |`,
    answerContent_fa: `### ۳ چالش مرگبار در سیستم‌های کشینگ

۱. **بهمن کش (Cache Avalanche):**
   - *علت:* منقضی شدن همزمان میلیون‌ها کلید در یک ثانیه مشخص و هجوم درخواست‌ها به پایگاه داده.
   - *راهکار:* افزودن انحراف تصادفی (Jitter) به زمان انقضای کلیدها (\`TTL + Random\`).

۲. **شکست کلید داغ (Cache Breakdown):**
   - *علت:* منقضی شدن یک کلید فوق‌العاده پربازدید و اجرای همزمان هزاران کوئری سنگین روی دیتابیس.
   - *راهکار:* استفاده از قفل توزیع‌شده موقت یا الگوی Singleflight جهت اجرای فقط یک کوئری در دیتابیس.

۳. **نفوذ به کش (Cache Penetration):**
   - *علت:* ارسال درخواست‌های مداوم برای شناسه‌های ناموجود جهت دور زدن کش و اعمال فشار به دیتابیس.
   - *راهکار:* کش کردن مقادیر \`null\` یا قرار دادن **Bloom Filter** در لایه جلویی کش.`,
  },

  // ── Step 2: Distributed Storage, Replication & Sharding ──
  {
    id: "sys-q5",
    stackId: "system-design",
    categoryId: "sys-databases",
    levelId: "senior",
    topicIds: ["topic-sys-db-replication"],
    questionTitle: "How does Quorum Consensus (W + R > N) guarantee strong consistency in leaderless distributed databases?",
    questionTitle_fa: "قانون حد نصاب کواوروم (W + R > N) چگونه در دیتابیس‌های بدون لیدر سازگاری قوی داده را تضمین می‌کند؟",
    answerContent: `### Quorum Consensus Mechanics (Cassandra / DynamoDB)

In leaderless distributed databases with $N$ total replicas for each partition:
- **$W$ (Write Quorum):** Number of replica nodes that must acknowledge a write before success is returned.
- **$R$ (Read Quorum):** Number of replica nodes that must respond to a read query.

#### The Pigeonhole Guarantee:
When $W + R > N$, the write set and the read set **must overlap by at least one node**:

\`\`\`
Replicas: [ Node 1 ] [ Node 2 ] [ Node 3 ]
Write (W=2): [ Written ] [ Written ] [ Not Written ]
Read  (R=2):             [ Read v2 ] [ Read v1 ]
Overlap: Node 2 has the latest write (v2)!
\`\`\`
The client compares timestamps/vector clocks from all $R$ nodes and selects the most recent version, triggering **Read Repair** on stale nodes.`,
    answerContent_fa: `### مکانیزم حد نصاب کواوروم (W + R > N)

در پایگاه‌های داده بدون لیدر (مانند Cassandra) به ازای $N$ نسخه تکثیرشده از داده:
- **$W$ (حد نصاب نوشتن):** تعداد سرورهایی که باید تاییدیه ذخیره موفق را برگردانند.
- **$R$ (حد نصاب خواندن):** تعداد سرورهایی که داده از آن‌ها همزمان خوانده می‌شود.

با برقراری شرط **$W + R > N$**، بر اساس اصل لانه‌کبوتری حداقل یک سرور مشترک میان سرورهای خوانده‌شده و نوشته‌شده وجود خواهد داشت که حاوی جدیدترین نسخه داده است. کلاینت با مقایسه تایم‌استمپ‌ها، آخرین داده معتبر را برمی‌دارد.`,
  },
  {
    id: "sys-q6",
    stackId: "system-design",
    categoryId: "sys-databases",
    levelId: "senior",
    topicIds: ["topic-sys-db-replication"],
    questionTitle: "What is Replication Lag and how do you prevent stale reads using Read-Your-Own-Writes consistency?",
    questionTitle_fa: "تاخیر رپلیکیشن (Replication Lag) چیست و چگونه می‌توان سازگاری Read-Your-Own-Writes را تضمین کرد؟",
    answerContent: `### Read-Your-Own-Writes (RYOW) Consistency

#### The Problem
In an asynchronous Primary-Replica architecture:
1. User updates their username (\`UPDATE users SET name = 'Ali'\`) on the Primary.
2. User refreshes the page immediately; read is routed to a Replica with $500\\text{ms}$ lag.
3. User sees old name and complains the update failed.

#### Production Solutions
1. **Time-based Primary Routing:** Route all reads for a user's *own profile* to the Primary database for $10\\text{ seconds}$ after any write.
2. **Replication Offset Cookies:** Track the Primary WAL LSN (Log Sequence Number) in the client's session cookie and only read from Replicas that have caught up to that LSN.`,
    answerContent_fa: `### تضمین سازگاری خواندن پس از نوشتن (Read-Your-Own-Writes)

#### صورت مسئله
در رپلیکیشن ناهمگام، پس از ویرایش اطلاعات توسط کاربر روی سرور Master، اگر رید بلافاصله به Replica دارای تاخیر ارسال شود، کاربر اطلاعات قدیمی خود را مشاهده می‌کند.

#### راهکارهای مهندسی
۱. هدایت کوئری‌های پروفایل شخصی خود کاربر به مدت چند ثانیه پس از نوشتن مستقیماً به سرور Primary.
۲. ذخیره شماره آخرین لاگ دیتابیس (LSN) در کوکی کاربر و ارسال درخواست فقط به رپلیکاهایی که تا آن شماره همگام شده‌اند.`,
  },
  {
    id: "sys-q7",
    stackId: "system-design",
    categoryId: "sys-databases",
    levelId: "lead",
    topicIds: ["topic-sys-db-sharding"],
    questionTitle: "How do you handle the 'Celebrity Problem' (Hotspot Sharding) when an account with millions of followers posts an update?",
    questionTitle_fa: "معضل سلبریتی (Hotspot Sharding) را هنگام ارسال پست توسط اکانتی با میلیون‌ها فالوور چگونه حل می‌کنید؟",
    answerContent: `### Mitigating Sharding Hotspots (The Celebrity Problem)

#### 1. The Bottleneck
If posts or likes are sharded by \`user_id\`, a celebrity account with 50M followers receives millions of writes/sec, overwhelming that single shard server while other shards sit idle.

#### 2. Architectural Solutions:
1. **Salting Shard Keys:** Append a random integer suffix ($0$ to $9$):
   \`\`\`
   shard_key = user_id + "_" + random(0, 9)
   \`\`\`
   Writes are distributed across 10 distinct shards. Read queries perform scatter-gather across all 10 salted buckets and aggregate results.
2. **Hybrid Fan-out Architecture (Push vs. Pull):**
   - Regular users ($< 5,000$ followers): **Fan-out on Write (Push)** into follower timeline mailboxes.
   - Celebrity users ($> 5,000$ followers): **Fan-out on Read (Pull)** merged dynamically on feed load.
3. **In-Memory Write Batching:** Aggregate likes/views in Redis in-memory counters before flushing in batches to persistent storage.`,
    answerContent_fa: `### حل معضل سلبریتی و نودهای داغ در شاردینگ

۱. **افزودن Salt به کلید شارد (Salting):**
   - برای اکانت‌های پربازدید، یک عدد تصادفی بین ۰ تا ۹ به شناسه کاربر اضافه می‌شود (\`user_101_3\`) تا داده‌ها روی ۱۰ سرور شارد مختلف پخش شوند.
۲. **معماری ترکیبی فید (Push vs. Pull):**
   - برای کاربران عادی: پست‌ها در زمان نوشتن (Push) به صندوق پیام فالوورها فرستاده می‌شود.
   - برای سلبریتی‌ها: پست‌ها در زمان خواندن فید توسط فالوورها (Pull) به صورت بلادرنگ ادغام می‌شوند.
۳. **تجمیع نوشتن‌ها در حافظه:** جمع‌آوری تعداد لایک‌ها و بازدیدها در ردیس و ریختن دسته‌ای (Batch) در دیتابیس.`,
  },
  {
    id: "sys-q8",
    stackId: "system-design",
    categoryId: "sys-databases",
    levelId: "senior",
    topicIds: ["topic-sys-polyglot-persistence"],
    questionTitle: "When should you choose Apache Cassandra over PostgreSQL or MongoDB?",
    questionTitle_fa: "در چه سناریوهایی باید Apache Cassandra را به جای PostgreSQL یا MongoDB انتخاب کرد؟",
    answerContent: `### When to Choose Cassandra / ScyllaDB

#### Choose Cassandra when:
1. **Massive Write Volumes:** Append-heavy workloads ($100,000+$ writes/second) like IoT sensor time-series, messaging history, or clickstream logs where LSM-Tree storage writes with zero in-place update overhead.
2. **Zero Downtime & Multi-Region Active-Active:** True masterless architecture with zero single point of failure across global datacenters.
3. **Known Query Patterns:** Queries are known in advance and can be served with simple partition-key lookups.

#### Do NOT choose Cassandra when:
- Complex relational queries, foreign keys, or multi-table ACID transactions are needed (use PostgreSQL).
- Dynamic schema exploration or complex nested sub-document queries are needed (use MongoDB).`,
    answerContent_fa: `### زمان انتخاب Cassandra در برابر PostgreSQL و MongoDB

- **انتخاب Cassandra زمانی درست است که:**
  ۱. حجم نوشتن فوق‌العاده بالا باشد (صدها هزار لاگ، چت یا سنسور در ثانیه) به دلیل ساختار بهینه‌شده نوشتن بر روی لاگ دیسک (LSM-Tree).
  ۲. سیستم نیازمند دسترسی‌پذیری ۱۰۰٪ و بدون حتی ۱ ثانیه قطعی در چند دیتاسنتر همزمان باشد.
- **انتخاب اشتباه است اگر:**
  - نیاز به تراکنش‌های چند جدولی ACID، جوین‌ها و روابط کلید خارجی داشته باشید (PostgreSQL مناسب است).`,
  },

  // ── Step 3: Distributed Consensus & Transactions ──
  {
    id: "sys-q9",
    stackId: "system-design",
    categoryId: "sys-distributed",
    levelId: "lead",
    topicIds: ["topic-sys-cap-pacelc"],
    questionTitle: "Explain the PACELC theorem and classify CockroachDB, Cassandra, and MongoDB according to it.",
    questionTitle_fa: "قضیه PACELC را توضیح داده و دیتابیس‌های CockroachDB، Cassandra و MongoDB را بر اساس آن دسته‌بندی کنید.",
    answerContent: `### PACELC Theorem Deep Dive

PACELC states that **If there is a Partition (P)**, trade **Availability (A)** vs. **Consistency (C)**; **Else (E)**, trade **Latency (L)** vs. **Consistency (C)**.

\`\`\`
+-------------------+--------------------+
| Database          | PACELC Class       | Rationale                                     |
+-------------------+--------------------+-----------------------------------------------+
| CockroachDB       | PC / EC            | Raft-backed; strict serializable consistency |
| Apache Cassandra  | PA / EL            | Masterless; async replication for low latency |
| MongoDB (Default) | PC / EL            | Primary election on split; fast local write   |
| Spanner (Google)  | PC / EC            | TrueTime atomic clocks; strong consistency    |
+-------------------+--------------------+-----------------------------------------------+
\`\`\``,
    answerContent_fa: `### دسته‌بندی دیتابیس‌ها در قضیه PACELC

- **CockroachDB (PC/EC):** در زمان قطعی شبکه سازگاری را حفظ می‌کند (PC) و در زمان عادی نیز هزینه تاخیر الگوریتم Raft را برای تضمین سازگاری کامل پرداخت می‌کند (EC).
- **Cassandra (PA/EL):** در زمان قطعی شبکه در دسترس باقی می‌ماند (PA) و در زمان عادی نیز برای رسیدن به حداقل تاخیر، رپلیکیشن را به صورت ناهمگام انجام می‌دهد (EL).
- **MongoDB (PC/EL):** در زمان قطعی تا انتخاب لیدر جدید صبر می‌کند (PC)، اما در زمان عادی نوشتن‌های سریع محلی را ترجیح می‌دهد (EL).`,
  },
  {
    id: "sys-q10",
    stackId: "system-design",
    categoryId: "sys-distributed",
    levelId: "lead",
    topicIds: ["topic-sys-raft-paxos"],
    questionTitle: "How does the Raft consensus algorithm prevent Split-Brain during a network partition?",
    questionTitle_fa: "الگوریتم اجماع Raft چگونه از معضل دوگانگی مغز (Split-Brain) در هنگام قطعی شبکه جلوگیری می‌کند؟",
    answerContent: `### Split-Brain Prevention in Raft

#### 1. The Quorum Majority Rule
In a cluster of $N$ nodes, any valid Leader election or Log commit requires agreement from a **strict majority**:
$$\\text{Quorum} = \\lfloor N / 2 \\rfloor + 1$$

#### 2. Partition Scenario (5-Node Cluster: A, B, C, D, E)
Suppose a network partition splits the cluster into two isolated subnets:
- **Subnet 1:** \`[A, B]\` (2 nodes - Minority)
- **Subnet 2:** \`[C, D, E]\` (3 nodes - Majority)

#### 3. What Happens:
1. **Subnet 1:** Nodes A and B cannot win a majority ($2 < 3$). Any candidate in Subnet 1 fails to elect a leader. If Node A was the old leader, it cannot commit any new writes because it receives at most 2 acknowledgments.
2. **Subnet 2:** Nodes C, D, and E can elect a new leader because $3 \\ge 3$. They continue committing writes safely.
3. **Healed Network:** When the partition resolves, Node A sees the higher \`currentTerm\` and uncommitted entries from the majority leader, automatically stepping down to Follower.`,
    answerContent_fa: `### جلوگیری از Split-Brain در الگوریتم Raft

- در کلاستر ۵ نودی، برای انتخاب لیدر یا تایید تراکنش نیاز به **اکثریت مطلق ($> 5/2$) یعنی حداقل ۳ رای** است.
- اگر شبکه به دو نیمه ۲ نودی و ۳ نودی تقسیم شود:
  - نیمه ۲ نودی هرگز نمی‌تواند اکثریت کسب کند و نوشتن‌ها مسدود می‌شود.
  - نیمه ۳ نودی لیدر جدید را انتخاب کرده و با امنیت کامل به کار ادامه می‌دهد.
- پس از رفع قطعی شبکه، نودهای نیمه کوچک‌تر با دیدن شماره دوره (Term) بالاتر، به عنوان Follower به لیدر اصلی ملحق می‌شوند.`,
  },
  {
    id: "sys-q11",
    stackId: "system-design",
    categoryId: "sys-distributed",
    levelId: "lead",
    topicIds: ["topic-sys-distributed-transactions"],
    questionTitle: "Explain the Saga Pattern and compare Choreography vs. Orchestration for distributed transactions.",
    questionTitle_fa: "الگوی ساگا (Saga Pattern) را توضیح داده و دو مدل Choreography و Orchestration را با هم مقایسه کنید.",
    answerContent: `### Saga Pattern: Distributed Transactions in Microservices

Instead of blocking 2PC locks, a Saga is a sequence of **local database transactions**. Each step updates a local database and emits an event. If a step fails, the Saga executes **Compensating Transactions** to undo preceding steps.

\`\`\`
Order Placed -> [Create Order] -> [Debit Wallet] -> [Reserve Stock (FAILED!)]
                                        |                   |
                                        v                   v
                             [Refund Wallet] <-------- Trigger Compensation
\`\`\`

#### Choreography vs. Orchestration

| Dimension | Choreography (Event-Driven) | Orchestration (State Machine) |
| :--- | :--- | :--- |
| **Coordination** | Decentralized; services react to domain events | Centralized orchestrator (MassTransit / Temporal.io) commands steps |
| **Visibility** | Low; difficult to track full execution state | High; central visual dashboard of every saga instance state |
| **Complexity** | Simple for 2-3 services; chaos for 10+ services | Additional infrastructure component to maintain |
| **Coupling** | Loose coupling | Participants depend on command contracts |`,
    answerContent_fa: `### الگوی Saga و مقایسه Choreography با Orchestration

ساگا به جای قفل کردن دیتابیس‌ها، از زنجیره‌ای از تراکنش‌های محلی استفاده می‌کند. در صورت شکست یک مرحله، **تراکنش‌های جبرانی (Compensating Transactions)** مانند بازگشت وجه به کیف پول اجرا می‌شوند.

- **کوریوگرافی (Choreography):** سرویس‌ها به صورت غیرمتمرکز به ایونت‌های یکدیگر گوش می‌دهند. برای سیستم‌های با ۲ الی ۳ سرویس مناسب است.
- **ارکستریشن (Orchestration):** یک ماشین وضعیت مرکزی (مانند MassTransit یا Temporal) مراحل را به ترتیب اجرا کرده و مدیریت جبران خسارت‌ها را بر عهده دارد. بهترین انتخاب برای فرآیندهای مالی و پیچیده سازمانی.`,
  },

  // ── Step 4: Messaging & Event-Driven Systems ──
  {
    id: "sys-q12",
    stackId: "system-design",
    categoryId: "sys-messaging",
    levelId: "senior",
    topicIds: ["topic-sys-kafka-rabbitmq"],
    questionTitle: "How does Apache Kafka achieve high write and read throughput (millions of messages/sec)?",
    questionTitle_fa: "آپاچی کافکا چگونه به توان پردازشی میلیون‌ها پیام در ثانیه دست می‌یابد؟",
    answerContent: `### Why Apache Kafka is Extremely Fast

1. **Sequential Append-Only Disk I/O:**
   - Sequential disk access is as fast as random memory access (up to $600\\text{ MB/s}$ on modern NVMe drives).
2. **Zero-Copy Network Transfer (\`sendfile\` Syscall):**
   - Bypasses user-space memory buffers. Data moves directly from OS Page Cache to Network Socket:
   \`\`\`
   Disk -> Page Cache -> [sendfile syscall] -> NIC Buffer -> Network
   \`\`\`
3. **Batching & Compression:**
   - Messages are batched at both Producer and Broker levels, amortizing network round-trip costs and compressing with Snappy/zstd.
4. **Partitioning:**
   - Topics are split into independent partitions, enabling horizontal write concurrency across broker disks.`,
    answerContent_fa: `### دلایل سرعت و توان پردازشی عظیم Apache Kafka

۱. **نوشتن ترتیبی روی دیسک (Sequential I/O):** نوشتن ترتیبی در انتهای فایل با سرعتی معادل دسترسی تصادفی به رم اجرا می‌شود.
۲. **فناوری انتقال بدون کپی (Zero-Copy):** با استفاده از دستور \`sendfile\` لینوکس، داده‌ها بدون کپی شدن در حافظه برنامه مستقیماً از Page Cache سیستم‌عامل به کارت شبکه فرستاده می‌شوند.
۳. **ارسال دسته‌ای (Batching) و فشرده‌سازی:** تجمیع هزاران پیام در یک پکت شبکه با الگوریتم‌های Snappy یا zstd.
۴. **پارتیشن‌بندی:** امکان موازی‌سازی نوشتن و خواندن بر روی چندین سرور و دیسک مستقل.`,
  },
  {
    id: "sys-q13",
    stackId: "system-design",
    categoryId: "sys-messaging",
    levelId: "senior",
    topicIds: ["topic-sys-idempotency"],
    questionTitle: "How do you design an Idempotent Payment Consumer to prevent double-charging in At-Least-Once delivery?",
    questionTitle_fa: "چگونه یک مصرف‌کننده پرداخت بدون تکرار (Idempotent Consumer) طراحی می‌کنید تا از کسر هزینه تکراری در تحویل At-Least-Once جلوگیری شود؟",
    answerContent: `### Idempotent Payment Consumer Design

\`\`\`
Message (with Idempotency-Key: "order_pay_998877")
       |
       v
1. Begin Local DB Transaction
2. INSERT INTO processed_idempotency_keys (idempotency_key, status, created_at)
   VALUES ('order_pay_998877', 'IN_PROGRESS', NOW())
   ON CONFLICT (idempotency_key) DO NOTHING;
3. If Insert Row Count == 0:
   - SELECT status FROM processed_idempotency_keys WHERE key = 'order_pay_998877';
   - If 'COMPLETED': ACK message and return cached success payload.
   - If 'IN_PROGRESS': Reject/NACK to retry later.
4. If Insert Succeeded:
   - Deduct wallet balance.
   - Update processed_idempotency_keys SET status = 'COMPLETED'.
   - Commit DB Transaction.
5. ACK Message to Broker.
\`\`\``,
    answerContent_fa: `### طراحی پردازش پرداخت بدون تکرار (Idempotent Consumer)

۱. کلاینت یک کلید یکتای \`Idempotency-Key\` همراه با پیام ارسال می‌کند.
۲. سرویس درون یک تراکنش دیتابیس، کلید را در جدول کلیدهای پردازش‌شده با ایندکس یکتا درج می‌کند.
۳. در صورت برخورد با خطای تکراری (Duplicate Key Error)، مشخص می‌شود که این پیام قبلاً پردازش شده؛ بنابراین نتیجه قبلی بدون کسر مجدد پول برگردانده می‌شود.
۴. در صورت جدید بودن کلید، تراکنش مالی اجرا شده و وضعیت به \`COMPLETED\` تغییر می‌یابد.`,
  },
  {
    id: "sys-q14",
    stackId: "system-design",
    categoryId: "sys-messaging",
    levelId: "lead",
    topicIds: ["topic-sys-event-sourcing-cqrs"],
    questionTitle: "How do you handle schema evolution and aggregate snapshotting in Event Sourcing architectures?",
    questionTitle_fa: "مدیریت تغییرات اسکیما (Schema Evolution) و اسنپ‌شات‌ها در معماری Event Sourcing چگونه انجام می‌شود؟",
    answerContent: `### Schema Evolution & Snapshots in Event Sourcing

#### 1. Schema Evolution Strategies for Immutable Events
Because past events in the Event Store can never be modified:
- **Upcasters (In-Flight Adapters):** When an old \`UserCreatedEvent_v1\` is deserialized, an Upcaster pipeline transforms it into \`UserCreatedEvent_v2\` before handing it to the Aggregate domain model.
- **Copy & Transform Migration:** Run an offline batch job to read Event Store v1, transform records, and write to a new Event Store v2.

#### 2. Snapshotting Strategy
- For high-volume aggregates, persisting a snapshot every $N$ events (e.g., every 100 events) limits aggregate state rehydration time to $< 5\\text{ms}$.`,
    answerContent_fa: `### تغییر اسکیما و اسنپ‌شات‌ها در Event Sourcing

- **رویکرد Upcasting:** از آنجا که رویدادهای گذشته غیرقابل تغییرند، هنگام خواندن رویداد نسخه قدیم از دیتابیس، یک کلاس آداپتور (Upcaster) در حافظه فیلدهای جدید را اضافه کرده و رویداد را به نسخه جدید تبدیل می‌کند.
- **اسنپ‌شات‌ها:** ذخیره دوره‌ای وضعیت نهایی موجودیت (مثلاً هر ۱۰۰ تراکنش) تا زمان بازسازی موجودیت همیشه زیر ۵ میلی‌ثانیه بماند.`,
  },

  // ── Step 5: Case Studies (Core Services) ──
  {
    id: "sys-q15",
    stackId: "system-design",
    categoryId: "sys-case-studies",
    levelId: "mid",
    topicIds: ["topic-sys-case-url-shortener"],
    questionTitle: "How would you design a URL Shortener like TinyURL capable of generating 100 million short links per month?",
    questionTitle_fa: "سیستم کوتاه‌کننده لینک (مشابه TinyURL) با توانایی تولید ۱۰۰ میلیون لینک در ماه را چگونه طراحی می‌کنید؟",
    answerContent: `### TinyURL System Design Summary

1. **Short URL Encoding:** Base62 (\`[a-zA-Z0-9]\`). With a 7-character string, we support $62^7 \\approx 3.5\\text{ Trillion}$ unique links.
2. **Distributed ID Generator:** Twitter Snowflake generating 64-bit chronological unique integers to avoid DB auto-increment bottlenecks.
3. **Database Schema:** PostgreSQL or DynamoDB storing \`{ id, short_code, original_url, user_id, created_at, expires_at }\`.
4. **Caching:** Redis Cache-Aside storing top $20\\%$ most popular URLs ($80-20$ rule) to serve $90\\%+$ of redirections directly from RAM with $< 5\\text{ms}$ latency.
5. **Redirect Code:** HTTP 302 (Found) to allow capturing click metrics and geolocation analytics.`,
    answerContent_fa: `### خلاصه طراحی سیستم کوتاه‌کننده لینک (TinyURL)

۱. **کدگذاری لینک:** تولید رشته ۷ کاراکتری در مبنای ۶۲ (Base62) جهت پشتیبانی از ۳.۵ تریلیون لینک یکتا.
۲. **شناسه یکتای توزیع‌شده:** الگوریتم Twitter Snowflake برای جلوگیری از قفل‌های سنگین Auto-Increment در دیتابیس.
۳. **کشینگ:** استفاده از ردیس برای نگهداری ۲۰٪ لینک‌های پربازدید که پاسخگوی بیش از ۹۰٪ ترافیک کلیک‌ها با تاخیر زیر ۵ میلی‌ثانیه است.
۴. **کد وضعیت ۳۰۲:** استفاده از HTTP 302 جهت ثبت دقیق آمار کلیک‌ها، ارجاع‌دهنده‌ها و تحلیل داده‌ها.`,
  },
  {
    id: "sys-q16",
    stackId: "system-design",
    categoryId: "sys-case-studies",
    levelId: "senior",
    topicIds: ["topic-sys-case-api-gateway"],
    questionTitle: "How do you architect an API Gateway for high throughput, security, and low latency?",
    questionTitle_fa: "معماری یک API Gateway را با هدف توان پردازشی بالا، امنیت و کمترین تاخیر چگونه طراحی می‌کنید؟",
    answerContent: `### High-Throughput API Gateway Architecture

\`\`\`
Clients -> [ L4 NLB ] -> [ API Gateway Cluster (Envoy / YARP / Kong) ]
                             ├── 1. In-Memory JWT Validation (Public Key Cache)
                             ├── 2. Distributed Rate Limiting (Redis Token Bucket)
                             ├── 3. Circuit Breaker & Resilient Retries
                             └── 4. gRPC / HTTP/2 Multiplexing to Microservices
\`\`\`

- **Key Tactic:** Verify JWT asymmetric signatures locally without calling Auth Service on every request.`,
    answerContent_fa: `### معماری درگاه API پرسرعت و امن

- قرارگیری کلاستر Gateway پشت یک لودبالانسر پرسرعت لایه ۴ (NLB).
- **اعتبارسنجی آفلاین JWT:** بررسی کلید عمومی توکن در حافظه محلی Gateway بدون نیاز به ارسال درخواست شبکه به سرور Auth.
- **کنترل نرخ درخواست و قطع‌کننده مدار:** اتصال به کلاستر ردیس و فریم‌ورک‌های تاب‌آوری جهت حفاظت از سرویس‌های بک‌اند.`,
  },
  {
    id: "sys-q17",
    stackId: "system-design",
    categoryId: "sys-case-studies",
    levelId: "senior",
    topicIds: ["topic-sys-case-realtime-chat"],
    questionTitle: "How do you design a scalable 1-on-1 and group chat system with online/offline presence?",
    questionTitle_fa: "سیستم چت بلادرنگ و پیام‌رسان دونفره و گروهی با مدیریت وضعیت آنلاین/آفلاین را چگونه طراحی می‌کنید؟",
    answerContent: `### Real-Time Chat Architecture

1. **Stateful Layer:** Stateful WebSocket servers maintain persistent client connections.
2. **Session / Presence Registry:** Redis stores \`user_id -> chat_server_id\` routing mappings.
3. **Message Routing:** Redis Pub/Sub or Kafka routes messages across chat servers.
4. **Message Storage:** Apache Cassandra partitioned by \`conversation_id\` and clustered by \`message_id DESC\`.
5. **Offline Delivery:** Push Notification Queue (FCM / APNs) when presence server reports offline.`,
    answerContent_fa: `### معماری پیام‌رسان بلادرنگ در مقیاس بالا

۱. برقراری کانکشن‌های پایدار WebSocket میان کاربران و سرورهای چت.
۲. نگهداری نگاشت سرورهای متصل به هر کاربر در رجیستری ردیس.
۳. ذخیره تاریخچه مکالمات در دیتابیس سریع Cassandra با دسته‌بندی بر اساس شناسه گفتگو.
۴. ارسال اعلان به سیستم Push Notification در صورت آفلاین بودن کاربر مقصد.`,
  },

  // ── Step 6: Case Studies (Complex Platforms) ──
  {
    id: "sys-q18",
    stackId: "system-design",
    categoryId: "sys-case-studies",
    levelId: "lead",
    topicIds: ["topic-sys-case-video-streaming"],
    questionTitle: "How does YouTube / Netflix deliver seamless video playback using Adaptive Bitrate Streaming (HLS/DASH)?",
    questionTitle_fa: "پلتفرم‌های یوتیوب و نتفلیکس چگونه با استفاده از استریم بیت‌ریت تطبیقی (HLS/DASH) پخش بدون وقفه ویدیو را فراهم می‌کنند؟",
    answerContent: `### Adaptive Bitrate Streaming Architecture (HLS & DASH)

1. **Video Ingestion & Chunking:** Uploaded videos are cut into **5-10 second segments** (e.g. \`chunk_001.ts\`).
2. **Transcoding DAG:** Concurrently encoded into multiple bitrates (1080p @ 5Mbps, 720p @ 2.5Mbps, 480p @ 1Mbps).
3. **Master Manifest:** An \`m3u8\` index lists URLs for each resolution bitrate stream.
4. **Client Player Adaptation:** The player measures client download speed and requests the next chunk in the highest bitrate that avoids buffering pauses.
5. **Edge CDN Caching:** Chunks are heavily cached in Edge POPs close to users.`,
    answerContent_fa: `### معماری استریم ویدیو با بیت‌ریت تطبیقی (HLS / DASH)

۱. تکه‌تکه کردن ویدیو به قطعات ۵ الی ۱۰ ثانیه‌ای.
۲. تبدیل موازی فرمت (Transcoding) به کیفیت‌های مختلف (1080p, 720p, 480p).
۳. ایجاد فایل مانیفست فهرست‌بندی (\`master.m3u8\`).
۴. انتخاب هوشمندانه کیفیت تکه بعدی ویدیو توسط پلیر دستگاه بر اساس نوسان سرعت اینترنت کاربر.
۵. کش کردن حداکثری قطعات در نزدیک‌ترین سرورهای CDN لبه شبکه.`,
  },
  {
    id: "sys-q19",
    stackId: "system-design",
    categoryId: "sys-case-studies",
    levelId: "lead",
    topicIds: ["topic-sys-case-payment-ledger"],
    questionTitle: "Why is Double-Entry Bookkeeping mandatory in financial systems and how do you achieve zero data loss?",
    questionTitle_fa: "چرا حسابداری دوبل (Double-Entry Bookkeeping) در سیستم‌های پرداخت الزامی است و چگونه صفر درصد خطای داده تضمین می‌شود؟",
    answerContent: `### Double-Entry Financial Systems & Zero Data Loss

1. **The Invariant:** Every financial transaction must write equal Debit and Credit rows:
   $$\\sum \\text{Debits} + \\sum \\text{Credits} = 0$$
   Money is never updated with simple mutable counters (\`balance += 100\`).
2. **Strict RDBMS ACID:** Use PostgreSQL with \`SERIALIZABLE\` isolation or row-level pessimistic locking (\`SELECT FOR UPDATE\`).
3. **Nightly Automated Reconciliation:** Compare internal ledger tables against bank settlement files to detect anomalies automatically.`,
    answerContent_fa: `### سیستم‌های مالی با حسابداری دوبل و تضمین صفر خطای داده

۱. **اصل موازنه لجر:** در هر تراکنش مجموع بدهکار و بستانکار باید برابر با صفر باشد. موجودی‌ها هرگز با فرمول \`balance += X\` آپدیت مستقیم نمی‌شوند.
۲. **انطباق با تراکنش‌های پایگاه داده رابطه‌ای (PostgreSQL ACID):** استفاده از ایزولیشن‌های سطح بالا و قفل‌های ردیفی بدبینانه.
۳. **موتور مغایرت‌گیری شبانه (Reconciliation):** تطبیق خودکار گزارشات بانکی با رکوردهای پایگاه داده داخلی جهت کشف کوچک‌ترین مغایرت مالی.`,
  },
  {
    id: "sys-q20",
    stackId: "system-design",
    categoryId: "sys-case-studies",
    levelId: "lead",
    topicIds: ["topic-sys-case-distributed-tracing"],
    questionTitle: "What is Tail-Based Sampling in Distributed Tracing and why is it superior to Head-Based Sampling?",
    questionTitle_fa: "نمونه‌برداری بر اساس خروجی (Tail-Based Sampling) در رهگیری توزیع‌شده چیست و چه مزیتی بر Head-Based Sampling دارد؟",
    answerContent: `### Tail-Based vs. Head-Based Telemetry Sampling

- **Head-Based Sampling:** Decides whether to record a trace at the API Gateway randomly (e.g. $1\\%$).
  - *Critical Flaw:* Completely misses rare $500$ Internal Server Errors occurring downstream.
- **Tail-Based Sampling:** Buffers all spans of a trace in memory until completion.
  - *Advantage:* Retains **$100\\%$ of error traces and high-latency traces**, while dropping $99.5\\%$ of uninteresting successful 200 OK traces, drastically reducing storage costs without losing vital debugging data.`,
    answerContent_fa: `### نمونه‌برداری هوشمند در مانیتورینگ توزیع‌شده (Tail-Based Sampling)

- **روش Head-Based:** در بدو ورود درخواست به Gateway به صورت تصادفی درصد کمی ذخیره می‌شود که باعث از دست رفتن خطاهای نادر ۵۰۰ در لایه‌های عمیق سیستم می‌گردد.
- **روش Tail-Based:** تمام مراحل درخواست را در حافظه موقت نگه داشته و در پایان، **۱۰۰٪ درخواست‌های با خطا یا کندی سرعت** را در دیتابیس تحلیلی ذخیره کرده و درخواست‌های عادی را دور می‌ریزد.`,
  },
];
