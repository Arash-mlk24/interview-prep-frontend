import { RoadmapTopic } from "../../../models";

export const kafkaEventStreamingTopic: RoadmapTopic = {
  id: "topic-dotnet-kafka-event-streaming",
  stepId: "step-messaging-caching-events",
  slug: "apache-kafka-event-streaming-dotnet",
  order: 2,
  title: "Apache Kafka in .NET: Partitions, Consumer Groups, Schema Registry & High-Throughput Streaming",
  title_fa: "استریم توزیع‌شده با Apache Kafka در دات‌نت: پارتیشن‌ها، Consumer Groupها، Schema Registry و پردازش بلادرنگ",
  summary:
    "Master Kafka in .NET with Confluent.Kafka: Distributed commit log architecture, partition assignment strategies, consumer rebalancing, Avro/Protobuf Schema Registry serialization, and exactly-once processing semantics.",
  summary_fa:
    "تسلط بر پلتفرم Apache Kafka در دات‌نت: ساختار لاگ متوالی توزیع‌شده، استراتژی‌های تخصیص پارتیشن، مدیریت بازتعادل مصرف‌کنندگان (Rebalancing)، سریالایز داده‌ها با Schema Registry و تضمین پردازش بدون تکرار.",
  readingTimeMinutes: 30,
  difficulty: "senior",
  content: `## Apache Kafka Event Streaming in .NET

*(Comprehensive master tutorial will be authored here following the 5-step deep research process.)*`,
  content_fa: `## استریم داده‌های بلادرنگ با Apache Kafka در دات‌نت

*(آموزش جامع و تخصصی این بخش طبق فرآیند ۵ مرحله‌ای پژوهش عمیق تدوین خواهد شد.)*`,
};
