import { RoadmapTopic } from "../../../models";

export const caseStudyRealtimeChatTopic: RoadmapTopic = {
  id: "topic-sys-case-realtime-chat",
  stepId: "step-sys-case-studies-core",
  slug: "designing-realtime-chat-system-whatsapp",
  order: 3,
  title: "Case Study: Designing a Real-Time Chat & Messaging System (Slack / WhatsApp / Discord)",
  title_fa: "کیس‌استادی: طراحی پیام‌رسان و چت بلادرنگ در مقیاس عظیم (مشابه Slack، واتساپ و دیسکورد)",
  summary: "Full system design: WebSocket stateful connections, Redis Pub/Sub / Kafka routing, Cassandra message history storage, online/offline presence servers, and push notifications.",
  summary_fa: "معماری کامل سیستم: مدیریت کانکشن‌های پایدار وب‌سوکت، هدایت پیام‌ها با Redis Pub/Sub، ذخیره‌سازی پیام‌ها در دیتابیس کاساندرا، سرورهای وضعیت آنلاین/آفلاین و پوش‌نوتیفیکیشن.",
  readingTimeMinutes: 23,
  difficulty: "senior",
  content: `### 1. High-Level Architecture for 1-on-1 and Group Chat

\`\`\`
[ User A ] <=== (WebSocket Connection) ===> [ Chat Server 1 ]
                                                    |
                                                    v (Publish to Redis / Kafka)
                                              [ Message Broker ]
                                                    |
                                                    v (Subscribed)
[ User B ] <=== (WebSocket Connection) ===> [ Chat Server 2 ]
\`\`\`

---

### 2. Message Flow & Delivery Steps

1. **User A sends message:** \`{ senderId: "A", receiverId: "B", text: "Hello", msgId: 101 }\`.
2. **Chat Server 1 receives packet:**
   - Appends message to **Apache Cassandra / ScyllaDB** (partitioned by \`conversation_id\`, clustered by \`created_at DESC\`).
   - Queries **Presence / Session Server (Redis)** to find which Chat Server currently holds User B's active WebSocket connection.
3. **If User B is Online (Chat Server 2):**
   - Publishes message to Redis Pub/Sub channel \`user:B\`.
   - Chat Server 2 pushes message down User B's WebSocket.
4. **If User B is Offline:**
   - Chat Server publishes event to Push Notification Queue (FCM / APNs) to alert the mobile device.

---

### 3. Database Schema for High-Throughput Chat

\`\`\`sql
-- Wide-Column Cassandra Table for Instant Slicing:
CREATE TABLE messages (
    conversation_id uuid,
    message_id bigint, -- Snowflake ID (chronological)
    sender_id uuid,
    content text,
    created_at timestamp,
    PRIMARY KEY ((conversation_id), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
\`\`\``,
  content_fa: `### ۱. معماری کلی سیستم چت و پیام‌رسانی

- **ارتباط بلادرنگ:** برقراری کانکشن دوطرفه پایدار **WebSocket** میان کلاینت و سرورهای چت.
- **مسیریابی پیام‌ها:** با استفاده از **Redis Pub/Sub** یا صف‌های کافکا، سروری که کلاینت مقصد به آن متصل است پیام را تحویل می‌گیرد.

---

### ۲. ذخیره‌سازی تاریخچه پیام‌ها در Cassandra

دیتابیس‌های ستون‌گسترده مانند **Cassandra** با پارتیشن‌بندی بر اساس \`conversation_id\` و مرتب‌سازی بر اساس شناسه زمانی پیام، امکان خواندن و نوشتن همزمان صدها هزار پیام در ثانیه را بدون افت کارایی فراهم می‌کنند.

---

### ۳. مدیریت وضعیت آنلاین / آفلاین (Presence Server)

با ارسال پیام‌های Heartbeat هر ۵ ثانیه در وب‌سوکت و ذخیره وضعیت در ردیس، در صورت قطع ارتباط تا ۱۵ ثانیه، وضعیت کاربر به صورت خودکار به آفلاین تغییر می‌کند.`,
};
