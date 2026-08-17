import { RoadmapTopic } from "../../../models";

export const rabbitmqKafkaMessagingTopic: RoadmapTopic = {
  id: "topic-dotnet-rabbitmq-kafka-messaging",
  stepId: "step-event-driven-sagas",
  slug: "asynchronous-messaging-rabbitmq-kafka-internals",
  order: 1,
  title: "Asynchronous Messaging: RabbitMQ vs Apache Kafka Internals & Patterns",
  title_fa: "پیام‌رسانی ناهمگام: مقایسه عمیق ساختار داخلی و الگوهای RabbitMQ و Apache Kafka در دات‌نت",
  summary: "Differentiate between traditional smart-broker queues (RabbitMQ AMQP) and distributed partitioned append-only commit logs (Kafka) with MassTransit.",
  summary_fa: "مقایسه معماری بروکرهای هوشمند (صف‌های RabbitMQ) با استریم‌های مبتنی بر لاگ توزیع‌شده (Apache Kafka)، پارتیشن‌بندی، گروه‌های مصرف‌کننده و یکپارچگی با MassTransit.",
  readingTimeMinutes: 28,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **Architectural Paradigms**:
  - Message Queues (RabbitMQ): Smart broker, dumb consumer, message deletion on ACK, exchange routing types.
  - Event Streams (Kafka): Dumb broker, smart consumer, distributed commit log, retention policies, partition key ordering.
- **Consumer Groups & Scaling**:
  - Partition assignment strategies, consumer rebalancing, and ordering guarantees.
- **Integration with MassTransit & Confluent.Kafka**:
  - Configuring consumer concurrency, backpressure, and Poison Message handling.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **مدل‌های معماری پیام‌رسانی**:
  - صف‌های پیام (RabbitMQ): بروکر هوشمند، مصرف‌کننده سبک، حذف پیام پس از دریافت ACK و روتینگ‌های پیچیده اکسچنج‌ها.
  - استریم‌های رویداد (Kafka): لاگ‌های ترتیبی پارتیشن‌بندی‌شده، ذخیره دائمی رخدادها و مدیریت آفست توسط مصرف‌کننده.
- **گروه‌های مصرف‌کننده (Consumer Groups) و تضمین ترتیب**:
  - نحوه تخصیص پارتیشن‌ها به مصرف‌کننده‌ها، معضل Rebalancing و حفظ ترتیب بر اساس Partition Key.
- **یکپارچگی با MassTransit و Confluent.Kafka در C#**:
  - تنظیم همروندی پردازشگرها و مکانیزم‌های خطایابی پیام‌های سمی (Poison Messages).

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
