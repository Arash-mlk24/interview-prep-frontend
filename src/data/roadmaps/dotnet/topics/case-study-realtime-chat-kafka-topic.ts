import { RoadmapTopic } from "../../../models";

export const caseStudyRealtimeChatKafkaTopic: RoadmapTopic = {
  id: "topic-dotnet-case-study-realtime-chat-kafka",
  stepId: "step-dotnet-case-studies",
  slug: "system-design-case-study-realtime-chat-kafka",
  order: 3,
  title: "Case Study: Real-Time Messaging & Notification Architecture (SignalR + Kafka)",
  title_fa: "کیس‌استادی: معماری سیستم چت میلیونی و اعلان بلادرنگ با SignalR، Kafka و دیتابیس توزیع‌شده",
  summary: "Design a WhatsApp/Slack-scale real-time chat: SignalR connection managers, Kafka fanout partitions, presence tracking, and message history storage.",
  summary_fa: "معماری کامل پیام‌رسان بلادرنگ: مدیریت میلیون‌ها اتصال وب‌سوکت در SignalR، پایپ‌لاین انتشار رویداد با Kafka، پایش وضعیت آنلاین کاربران و پایگاه‌های داده NoSQL.",
  readingTimeMinutes: 30,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **Connection Management & Gateway Layer**:
  - WebSocket connection pooling across distributed ASP.NET Core SignalR nodes.
  - Ephemeral user-to-server routing tables stored in Redis.
- **Message Fanout & Reliability Pipeline**:
  - Direct 1-to-1 messaging vs Group chat fan-out patterns.
  - Kafka message ordering guarantees per chat room using RoomId as Partition Key.
- **Persistence & Presence Detection**:
  - Storing massive message histories in Cassandra / ScyllaDB or partitioned PostgreSQL.
  - Heartbeat-based online/offline presence tracking with Redis TTL keys.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **مدیریت ارتباطات کلاینت و لایه گیت‌وی**:
  - کلاسترینگ گره‌های وب‌سوکت SignalR و نگهداری جدول آدرس سرور متصل به هر کاربر در حافظه Redis.
- **انتشار پیام‌ها (Message Fanout) و حفظ ترتیب**:
  - معماری پیام‌رسانی دونفره در برابر گروه‌های چت بزرگ با تعداد زیاد عضو.
  - تضمین ترتیب پیام‌ها در کافکا با کلید پارتیشن (RoomId).
- **ذخیره‌سازی تاریخچه و وضعیت آنلاین/آفلاین**:
  - ذخیره چت‌ها در دیتابیس‌های مناسب سناریوی Write-Heavy مانند Cassandra یا PostgreSQL پارتیشن‌شده.
  - سیستم هارت‌بیت (Heartbeat) پایش حضور کاربران با کلیدهای دارای زمان انقضا در ردیس.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
