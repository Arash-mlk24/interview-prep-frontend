import { RoadmapTopic } from "../../../models";

export const hangfireTemporalWorkflowsTopic: RoadmapTopic = {
  id: "topic-dotnet-hangfire-temporal-workflows",
  stepId: "step-resilience-actors-workflows",
  slug: "distributed-background-jobs-hangfire-temporal-workflows",
  order: 3,
  title: "Distributed Background Processing: Hangfire, Quartz.NET & Temporal.io Workflows",
  title_fa: "پردازش‌های پس‌زمینه و موتورهای گردش‌کار توزیع‌شده: مقایسه Hangfire، Quartz و Temporal.io",
  summary: "Coordinate durable executions, resilient background schedulers, and code-as-workflow orchestration with Temporal .NET SDK.",
  summary_fa: "مدیریت پردازش‌های زمان‌بندی‌شده توزیع‌شده با Hangfire و Quartz.NET و معماری گردش‌کارهای ماندگار (Durable Execution) با موتور پیشرفته Temporal.",
  readingTimeMinutes: 26,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **Background Tasks in .NET**:
  - \`IHostedService\` & \`BackgroundService\` limits in multi-pod Kubernetes setups.
- **Distributed Schedulers (Hangfire & Quartz.NET)**:
  - Persistent job storage (SQL Server / Redis), re-entrancy protection, recurring cron triggers, and distributed queues.
- **Durable Workflow Execution (Temporal.io with C#)**:
  - Writing stateful, fault-tolerant business workflows as standard C# async code.
  - Automatic replay, activity compensation, and handling days-long human-in-the-loop workflows.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **پردازش‌های پس‌زمینه درون‌برنامه‌ای دات‌نت**:
  - بررسی محدودیت‌های \`BackgroundService\` در محیط‌های کلاسترشده و چندپادی کوبرنتیز.
- **زمان‌بندهای توزیع‌شده با Hangfire و Quartz.NET**:
  - ذخیره‌سازی جاب‌ها در پایگاه داده پایدار، جلوگیری از اجرای همزمان روی چند سرور و مدیریت صف‌های اولویت‌دار.
- **ارکستراسیون ورک‌فلوهای مقاوم با Temporal.io در C#**:
  - تعریف فرآیندهای کسب‌وکار پیچیده و طولانی‌مدت (چند روزه/ماهه) به‌صورت کدهای استاندارد ناهمگام سی‌شارپ.
  - بازیابی خودکار وضعیت ورک‌فلو در صورت قطعی سرور بدون از دست رفتن هیچ داده‌ای.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
