import { RoadmapTopic } from "../../../models";

export const orleansDaprVirtualActorsTopic: RoadmapTopic = {
  id: "topic-dotnet-orleans-dapr-virtual-actors",
  stepId: "step-resilience-actors-workflows",
  slug: "distributed-state-microsoft-orleans-dapr-virtual-actors",
  order: 2,
  title: "Distributed Computing & State: Microsoft Orleans (Virtual Actors) & Dapr",
  title_fa: "محاسبات و وضعیت توزیع‌شده: فریم‌ورک Virtual Actor مایکروسافت Orleans و ران‌تایم Dapr",
  summary: "Build stateful distributed microservices with Microsoft Orleans Grains, single-threaded execution guarantees, and Dapr cloud-native building blocks.",
  summary_fa: "توسعه سیستم‌های مقیاس‌بزرگ با حفظ وضعیت در حافظه (Stateful) با گرین‌های Microsoft Orleans و معماری سایدکار Dapr برای سرویس‌های کلودنیتیو.",
  readingTimeMinutes: 28,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **The Virtual Actor Model (Microsoft Orleans)**:
  - Grains, Silos, and Client architecture.
  - Single-threaded turn-based execution (solving concurrency race conditions naturally).
  - Grain lifecycle: automatic activation, passivation, and state persistence.
- **Distributed Application Runtime (Dapr)**:
  - Sidecar pattern for cloud-native microservices.
  - Decoupling state stores, pub/sub brokers, and secret stores using declarative yaml bindings.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **مدل Virtual Actor در فریم‌ورک Microsoft Orleans**:
  - بررسی مفاهیم Grains، Siloها و کلاینت‌ها.
  - مدل اجرای تک‌نخی نوبتی (Turn-based Execution) که به‌طور ساختاری مشکل Race Condition را برطرف می‌کند.
  - چرخه حیات گرین‌ها: بارگذاری و تخلیه خودکار از حافظه رم و اتصال به پایگاه‌های داده پایدار.
- **ران‌تایم Dapr (Distributed Application Runtime)**:
  - معماری مبتنی بر Sidecar در دات‌نت.
  - انتزاع ذخیره‌سازهای وضعیت (State Stores)، بروکرهای Pub/Sub و اسرار امنیتی از کدهای سی‌شارپ.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
