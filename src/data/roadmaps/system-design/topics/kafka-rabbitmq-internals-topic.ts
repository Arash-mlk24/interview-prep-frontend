import { RoadmapTopic } from "../../../models";

export const kafkaRabbitmqInternalsTopic: RoadmapTopic = {
  id: "topic-sys-kafka-rabbitmq",
  stepId: "step-sys-messaging-events",
  slug: "kafka-vs-rabbitmq-internals-scaling",
  order: 1,
  title: "Message Brokers vs. Event Streams: RabbitMQ vs. Apache Kafka Architecture",
  title_fa: "تفاوت صف‌های پیام‌رسانی و استریم‌های رویداد: تحلیل عمیق معماری RabbitMQ و Apache Kafka",
  summary: "Master the architectural dichotomy: Smart Broker / Dumb Consumer (RabbitMQ AMQP) vs Dumb Broker / Smart Consumer (Kafka Append-Only Commit Log, Partitions, Consumer Groups).",
  summary_fa: "تسلط بر دو پارادایم اصلی: بروکر هوشمند/کنسومر ساده در RabbitMQ در برابر بروکر ساده/کنسومر هوشمند در لاگ ترتیبی و پارتیشن‌بندی‌های Apache Kafka.",
  readingTimeMinutes: 21,
  difficulty: "senior",
  content: `### 1. RabbitMQ vs. Apache Kafka: Architectural Comparison

| Dimension | RabbitMQ (Message Broker) | Apache Kafka (Distributed Event Log) |
| :--- | :--- | :--- |
| **Storage Model** | Ephemeral queues; messages are deleted once acknowledged by consumer | Immutable, append-only disk commit log; messages retained by time/size (days/months) |
| **Consumer Tracking** | Broker tracks state (ACKs) per message for each consumer | Consumer tracks its own \`Offset\` in the partition |
| **Routing Flexibility** | Complex routing (Direct, Topic, Fanout, Headers Exchanges) | Simple topic/partition keys |
| **Replayability** | ❌ Cannot replay historical processed messages | ✅ Can rewind offset to replay messages from any timestamp |
| **Throughput & Latency** | Low latency ($< 1\\text{ms}$), tens of thousands msgs/sec | High throughput ($1\\text{M}+\\text{ msgs/sec}$) via zero-copy OS page cache |
| **Ordering Guarantees** | FIFO per queue, but disrupted by parallel workers | Strict FIFO ordering **guaranteed per partition** |

---

### 2. Kafka Partitioning & Consumer Groups

\`\`\`
Topic: "order-events" (3 Partitions)
Partition 0: [Msg 0] [Msg 1] [Msg 2] ---> Consumer A (Group 1)
Partition 1: [Msg 0] [Msg 1]         ---> Consumer B (Group 1)
Partition 2: [Msg 0] [Msg 1] [Msg 2] ---> Consumer C (Group 1)
\`\`\`

- **Key Rule:** At most one consumer instance within the same Consumer Group reads from any given partition at a time.
- **Scaling Limit:** Adding more consumers than partitions results in idle consumers.`,
  content_fa: `### ۱. مقایسه بنیادین معماری RabbitMQ و Apache Kafka

- **RabbitMQ (Message Broker سنتی):**
  - پیام‌ها پس از تایید (ACK) توسط مصرف‌کننده از صف پاک می‌شوند.
  - دارای سیستم روتینگ بسیار پیشرفته (Exchanges) برای ارسال پیام به صف‌های مختلف.
  - مناسب برای کارهای پس‌زمینه (Background Tasks) و هماهنگی میان وب‌سرویس‌ها.

- **Apache Kafka (Distributed Event Streaming):**
  - پیام‌ها در یک فایل لاگ غیرقابل‌تغییر (Append-Only Log) برای روزها یا ماه‌ها ذخیره می‌شوند.
  - قابلیت **بازپخش پیام‌ها (Message Replay)** از هر نقطه زمانی دلخواه.
  - توان پردازشی بسیار بالا (میلیون‌ها پیام در ثانیه با استفاده از Zero-Copy سیستم‌عامل).
  - تضمین ترتیب پیام‌ها در سطح هر **پارتیشن (Partition)**.`,
};
