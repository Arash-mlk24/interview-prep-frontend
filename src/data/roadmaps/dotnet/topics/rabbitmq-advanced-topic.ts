import { RoadmapTopic } from "../../../models";

export const rabbitmqAdvancedTopic: RoadmapTopic = {
  id: "topic-dotnet-rabbitmq-advanced",
  stepId: "step-messaging-caching-events",
  slug: "rabbitmq-quorum-queues-ordering",
  order: 1,
  title: "RabbitMQ Internals: Publisher Confirms, Quorum Queues & Message Ordering",
  title_fa: "مباحث پیشرفته RabbitMQ: تاییدیه انتشار، صف‌های Quorum و تضمین ترتیب پیام‌ها",
  summary: "Master Raft-based Quorum Queues, Publisher Confirms, Manual Acks, and strict FIFO message ordering via Consistent Hash Exchanges.",
  summary_fa: "تسلط بر صف‌های بر پایه اجماع Raft، مکانیزم تاییدیه دوطرفه انتشار و دریافت، و تضمین ترتیب ترتیبی (FIFO) پیام‌ها با Consistent Hash Exchange.",
  readingTimeMinutes: 19,
  difficulty: "senior",
  content: `### 1. Publisher Confirms & Consumer Acknowledgements

\`\`\`
Producer ---[ Publish Message ]---> Exchange ---> Queue ---[ Deliver ]---> Consumer
   ^                                                                          |
   +--------[ Async Publisher Ack ]-------------------[ Manual BasicAck ]-----+
\`\`\`

- **Publisher Confirms (\`channel.ConfirmSelect()\`):** The broker sends an asynchronous ACK to the producer only after the message is safely fsynced to disk or replicated across a quorum of cluster nodes.
- **Consumer Manual Ack (\`autoAck: false\`):**
  - \`BasicAck(deliveryTag, false)\`: Confirms successful processing; message is permanently removed from the queue.
  - \`BasicNack(deliveryTag, false, requeue: false)\`: Rejects the message and routes it to a Dead Letter Exchange.

---

### 2. Quorum Queues vs. Classic Mirrored Queues

| Feature | Classic Mirrored Queues (Deprecated) | Quorum Queues (Raft Consensus) |
| :--- | :--- | :--- |
| **Replication** | Custom proprietary sync protocol | **Raft Consensus Algorithm** (Majority Voting) |
| **Partition Safety** | Vulnerable to Split-Brain message loss | Safe (CP model; prevents data loss) |
| **Storage Engine** | In-memory with optional disk paging | **Append-Only Disk Log** |
| **Node Recovery** | Synchronization blocks the whole queue | Non-blocking background log catch-up |

---

### 3. Strict FIFO Message Ordering with Horizontal Scaling

#### Problem:
Using competing consumer workers on a single queue breaks chronological ordering when messages take variable processing time or experience retries.

#### Solution: Consistent Hash Exchange + Single Active Consumer (SAC)
1. Route messages through a **Consistent Hash Exchange** (\`x-consistent-hash\`) using an entity ID (\`AccountId\`).
2. All messages for a given account consistently route to the **same dedicated partition queue**.
3. Enable **\`x-single-active-consumer: true\`** on each partition queue so only one worker thread processes it at any time, maintaining strict sequential order.`,
  content_fa: `### ۱. تاییدیه دوطرفه پیام (Confirms & Acks)

- **Publisher Confirms:** بروکر فقط پس از اطمینان از ذخیره قطعی پیام روی دیسک یا نودهای کلاستر سیگنال تایید به تولیدکننده ارسال می‌کند.
- **Manual Consumer Ack:** با غیرفعال کردن Auto-Ack، پیام تا زمان پردازش قطعی و ارسال متد \`BasicAck\` در صف باقی می‌ماند تا هیچ پیامی در صورت کرش ناگهانی مصرف‌کننده گم نشود.

---

### ۲. صف‌های Quorum بر پایه الگوریتم اجماع Raft

صف‌های مدرن **Quorum Queues** با الگوریتم اجماع Raft و رای‌گیری اکثریت نودها کار می‌کنند، داده‌ها را همیشه مستقیماً روی دیسک می‌نویسند و در زمان قطع موقت شبکه دچار مشکل Split-Brain نمی‌شوند.

---

### ۳. تضمین ترتیب دقیق پیام‌ها (FIFO)

با استفاده از **Consistent Hash Exchange** پیام‌های هر کاربر به یک صف اختصاصی هدایت شده و با قابلیت **Single Active Consumer (SAC)** فقط توسط یک پردازنده فعال خوانده می‌شوند تا ترتیب توالی تراکنش‌ها کاملاً حفظ گردد.`,
};
