import { Concept } from "../models";

export const dotnetConcepts: Concept[] = [
  {
    id: "concept-dotnet-1",
    stackId: "dotnet",
    title: "Channels (`System.Threading.Channels`) for High-Throughput In-Memory Queuing",
    title_fa: "کانال‌ها (System.Threading.Channels) برای صف‌های پرسرعت درون‌حافظه‌ای",
    content: `### Why \`System.Threading.Channels\`?

Traditional \`BlockingCollection<T>\` is synchronous and blocks worker threads. \`Channel<T>\` is an asynchronous, lock-free, zero-allocation producer-consumer queue introduced in .NET Core 3.0.

\`\`\`csharp
// Creating a bounded channel with backpressure
var channel = Channel.CreateBounded<LogMessage>(new BoundedChannelOptions(1000)
{
    FullMode = BoundedChannelFullMode.Wait,
    SingleWriter = false,
    SingleReader = true
});

// Producer
await channel.Writer.WriteAsync(new LogMessage("Order Created"));

// Consumer
await foreach (var item in channel.Reader.ReadAllAsync())
{
    await ProcessLogAsync(item);
}
\`\`\`

#### Key Benefits:
- Fully \`async\`/\`await\` native without thread blocking.
- Supports **Backpressure** through \`BoundedChannelFullMode\` (\`Wait\`, \`DropOldest\`, \`DropWrite\`).
- High performance for background ingestion, logging, or pipeline workflows.`,
    content_fa: `### چرا \`System.Threading.Channels\`؟

ساختار سنتی \`BlockingCollection<T>\` به صورت همگام بوده و Threadهای پردازشی را مسدود (Block) می‌کرد. در مقابل، \`Channel<T>\` یک صف تولیدکننده-مصرف‌کننده (Producer-Consumer) کاملاً ناهمگام، بدون قفل (Lock-Free) و با حداقل مصرف حافظه در دات‌نت است.

\`\`\`csharp
// ساخت یک کانال محدود با قابلیت مدیریت فشار ورودی (Backpressure)
var channel = Channel.CreateBounded<LogMessage>(new BoundedChannelOptions(1000)
{
    FullMode = BoundedChannelFullMode.Wait,
    SingleWriter = false,
    SingleReader = true
});

// تولیدکننده (Producer)
await channel.Writer.WriteAsync(new LogMessage("Order Created"));

// مصرف‌کننده (Consumer)
await foreach (var item in channel.Reader.ReadAllAsync())
{
    await ProcessLogAsync(item);
}
\`\`\`

#### مزایای کلیدی:
- سازگاری کامل با الگوی \`async\`/\`await\` بدون هدررفت نخ‌های پردازشی.
- مدیریت هوشمندانه اشباع صف و پس‌فشار (Backpressure).
- ایده‌آل برای سرویس‌های لاگینگ، پردازش پس‌زمینه (Background Workers) و پایپ‌لاین‌های داده با توان عملیاتی بسیار بالا.`,
  },
  {
    id: "concept-dotnet-2",
    stackId: "dotnet",
    title: "Outbox Pattern with MassTransit for Reliable Event Publishing",
    title_fa: "الگوی Transactional Outbox در MassTransit برای ارسال تضمین‌شده پیام‌ها",
    content: `### The Dual-Write Problem

When saving state to the database and sending a message to a broker (RabbitMQ/Kafka), one operation may fail after the other succeeds, causing data inconsistency.

\`\`\`
1. Save Order to Database -> (SUCCESS)
2. Publish OrderCreated to RabbitMQ -> (NETWORK TIMEOUT / BROKER DOWN)
Result: Database updated, but downstream services never notified!
\`\`\`

### Transactional Outbox Pattern Solution
1. Save the entity state AND the message to an **Outbox Table** within the same ACID database transaction.
2. An asynchronous background process / CDC (Change Data Capture) polls the Outbox table and publishes events to the broker.
3. Once acknowledged by the broker, the outbox record is marked as processed.`,
    content_fa: `### مشکل نوشتن دوگانه (Dual-Write Problem)

هنگامی که وضعیت یک انتیتی را در دیتابیس ذخیره کرده و همزمان پیامی به Message Broker (مانند RabbitMQ یا Kafka) ارسال می‌کنید، احتمال دارد یکی از عملیات‌ها با شکست مواجه شده و داده‌ها ناسازگار شوند.

\`\`\`
۱. ذخیره سفارش در دیتابیس -> (موفق)
۲. ارسال رویداد OrderCreated به بروکر -> (قطع شبکه / شکست)
نتیجه: سفارش در دیتابیس ثبت شده اما سایر سرویس‌ها هرگز باخبر نمی‌شوند!
\`\`\`

### راهکار الگوی Transactional Outbox
۱. وضعیت انتیتی و پیام ارسالی درون **یک تراکنش مشترک ACID** در جدول Outbox دیتابیس ذخیره می‌شوند.
۲. یک پردازش پس‌زمینه پیام‌های تاییدنشده را از جدول Outbox خوانده و به سمت Message Broker هدایت می‌کند.
۳. پس از دریافت تایدیه (ACK)، وضعیت پیام به عنوان ارسال‌شده نشانه‌گذاری می‌شود.`,
  },
];
