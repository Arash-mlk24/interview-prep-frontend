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
  {
    id: "concept-dotnet-3",
    stackId: "dotnet",
    title: "Comprehensive Catalog of Design Patterns in .NET (Creational, Structural, Behavioral & Enterprise)",
    title_fa: "کاتالوگ جامع الگوهای طراحی در دات‌نت (سازنده، ساختاری، رفتاری و سازمانی)",
    content: `### 1. Creational Patterns (الگوهای آفرینش و سازنده)

#### A. Factory Method & Abstract Factory
- **Intent:** Encapsulates object creation logic without exposing instantiation details to the client.
- **Abstract Factory:** Creates families of related or dependent objects without specifying their concrete classes.
\`\`\`csharp
public interface IPaymentGatewayFactory {
    IPaymentGateway CreateGateway(PaymentProvider provider);
}

public class PaymentGatewayFactory : IPaymentGatewayFactory {
    private readonly IServiceProvider _serviceProvider;
    public PaymentGatewayFactory(IServiceProvider sp) => _serviceProvider = sp;

    public IPaymentGateway CreateGateway(PaymentProvider provider) => provider switch {
        PaymentProvider.Zarinpal => _serviceProvider.GetRequiredService<ZarinpalGateway>(),
        PaymentProvider.Saman => _serviceProvider.GetRequiredService<SamanGateway>(),
        _ => throw new NotSupportedException($"Provider {provider} not supported.")
    };
}
\`\`\`

#### B. Builder Pattern & Fluent API
- **Intent:** Separates complex object construction from its representation, allowing step-by-step assembly with invariant validation.
\`\`\`csharp
public class OrderBuilder {
    private readonly Order _order = new();
    public OrderBuilder ForCustomer(Guid customerId) {
        _order.CustomerId = customerId;
        return this;
    }
    public OrderBuilder AddLineItem(Guid productId, int quantity, decimal unitPrice) {
        _order.Items.Add(new OrderItem(productId, quantity, unitPrice));
        return this;
    }
    public Order Build() {
        if (_order.CustomerId == Guid.Empty) throw new InvalidOperationException("Customer is required");
        if (_order.Items.Count == 0) throw new InvalidOperationException("Order must have items");
        return _order;
    }
}
\`\`\`

#### C. Singleton Pattern (Thread-Safe with Lazy<T>)
\`\`\`csharp
public sealed class CacheManager {
    private static readonly Lazy<CacheManager> _instance = 
        new(() => new CacheManager(), LazyThreadSafetyMode.ExecutionAndPublication);

    private CacheManager() { }
    public static CacheManager Instance => _instance.Value;
}
\`\`\`

---

### 2. Structural Patterns (الگوهای ساختاری)

#### A. Adapter Pattern
- **Intent:** Converts the interface of a class into another interface clients expect.
\`\`\`csharp
// Adapting 3rd-party legacy XML SOAP service to modern internal IPaymentProvider interface
public class LegacySoapBankAdapter : IPaymentProvider {
    private readonly LegacySoapBankClient _legacyClient;
    public LegacySoapBankAdapter(LegacySoapBankClient legacyClient) => _legacyClient = legacyClient;

    public async Task<PaymentResult> ChargeAsync(decimal amount, string cardNumber) {
        var soapRequest = new SoapPayRequest { AmountInRials = (long)(amount * 10), Card = cardNumber };
        var soapResponse = await _legacyClient.ExecutePaymentAsync(soapRequest);
        return new PaymentResult(soapResponse.IsSuccess, soapResponse.TrackingCode);
    }
}
\`\`\`

#### B. Decorator Pattern
- **Intent:** Dynamically attaches additional responsibilities to an object (e.g. Caching, Logging, Telemetry) without modifying underlying classes.
\`\`\`csharp
public class CachedOrderRepository : IOrderRepository {
    private readonly IOrderRepository _inner;
    private readonly IDistributedCache _cache;

    public CachedOrderRepository(IOrderRepository inner, IDistributedCache cache) {
        _inner = inner;
        _cache = cache;
    }

    public async Task<Order?> GetByIdAsync(Guid id) {
        var cached = await _cache.GetStringAsync($"order:{id}");
        if (cached != null) return JsonSerializer.Deserialize<Order>(cached);

        var order = await _inner.GetByIdAsync(id);
        if (order != null) {
            await _cache.SetStringAsync($"order:{id}", JsonSerializer.Serialize(order), 
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
        }
        return order;
    }
}
// Registered cleanly in DI using Scrutor:
// services.Decorate<IOrderRepository, CachedOrderRepository>();
\`\`\`

#### C. Facade Pattern
- **Intent:** Provides a simplified, high-level interface to a complex set of classes/subsystems.
\`\`\`csharp
public class CheckoutFacade {
    private readonly IInventoryService _inventory;
    private readonly IPaymentService _payment;
    private readonly INotificationService _notifier;
    private readonly IOrderRepository _orders;

    public async Task<Guid> PlaceOrderAsync(CheckoutRequest req) {
        await _inventory.ReserveStockAsync(req.Items);
        var payment = await _payment.ProcessAsync(req.PaymentDetails);
        var orderId = await _orders.CreateOrderAsync(req, payment.TransactionId);
        await _notifier.SendReceiptAsync(req.CustomerEmail, orderId);
        return orderId;
    }
}
\`\`\`

#### D. Proxy Pattern
- **Intent:** Provides a surrogate or placeholder for another object to control access to it (Virtual Proxy for lazy loading, Protection Proxy for auth, Remote Proxy for RPC).

---

### 3. Behavioral Patterns (الگوهای رفتاری)

#### A. Strategy Pattern
- **Intent:** Defines a family of interchangeable algorithms, encapsulating each one and making them selectable at runtime.
\`\`\`csharp
public interface IDiscountStrategy {
    decimal CalculateDiscount(Order order);
}
public class BlackFridayDiscountStrategy : IDiscountStrategy {
    public decimal CalculateDiscount(Order order) => order.SubTotal * 0.30m;
}
public class VIPCustomerDiscountStrategy : IDiscountStrategy {
    public decimal CalculateDiscount(Order order) => order.SubTotal * 0.15m;
}
\`\`\`

#### B. Chain of Responsibility Pattern
- **Intent:** Passes requests along a chain of handlers. Each handler decides either to process the request or pass it to the next handler.
- **Primary .NET Realizations:** ASP.NET Core Middleware pipeline (\`RequestDelegate next\`) and MediatR Pipeline Behaviors (\`IPipelineBehavior<TRequest, TResponse>\`).

#### C. Observer vs. Mediator vs. Pub/Sub
| Characteristic | Observer Pattern | Mediator Pattern | Pub/Sub Pattern |
| :--- | :--- | :--- | :--- |
| **Communication** | Direct (Subject $\to$ Observer) | Centralized Hub (\`IMediator\`) | Brokered (Topic/Exchange) |
| **Coupling** | High (Subject holds references) | Loose (Sender \& Handler decoupled) | Completely decoupled |
| **Process Boundary** | In-Memory (Single Process) | In-Memory (Single Process) | Distributed across network |
| **.NET Examples** | C# \`event\`, \`IObservable<T>\` | MediatR (\`Send\`, \`Publish\`) | RabbitMQ, Azure Service Bus, Redis |

---

### 4. Enterprise & Architectural Patterns

#### A. Specification Pattern (with Expression Trees)
- **Intent:** Encapsulates business domain query rules into reusable objects that can be combined with Boolean logic (AND, OR, NOT) and compiled directly to SQL via EF Core.
\`\`\`csharp
public abstract class Specification<T> {
    public abstract Expression<Func<T, bool>> ToExpression();
    public bool IsSatisfiedBy(T entity) => ToExpression().Compile()(entity);

    public Specification<T> And(Specification<T> other) =>
        new AndSpecification<T>(this, other);
}
\`\`\`

#### B. Unit of Work & Repository
- **Intent:** Mediates between data source and domain layers, keeping track of modified domain entities and committing them as a single atomic transaction. (Note: EF Core \`DbContext\` is natively an implementation of Unit of Work + Repository).

#### C. Transactional Outbox & Saga Pattern
- **Outbox:** Ensures zero event loss across DB write and message broker publish operations without distributed 2PC transactions.
- **Saga:** Coordinates long-running distributed business transactions using sequences of local transactions and compensating actions (Choreography or Orchestration).`,
    content_fa: `### ۱. الگوهای آفرینش و سازنده (Creational Patterns)

#### الف) Factory Method و Abstract Factory
- **هدف:** کپسوله‌سازی منطق ایجاد اشیا بدون افشای جزئیات کلاس‌های پیاده‌ساز برای کلاینت.
- **Abstract Factory:** ایجاد خانواده‌ای از اشیای وابسته به یکدیگر بدون وابستگی مستقیم به کلاس‌های Concrete.
\`\`\`csharp
public interface IPaymentGatewayFactory {
    IPaymentGateway CreateGateway(PaymentProvider provider);
}

public class PaymentGatewayFactory : IPaymentGatewayFactory {
    private readonly IServiceProvider _serviceProvider;
    public PaymentGatewayFactory(IServiceProvider sp) => _serviceProvider = sp;

    public IPaymentGateway CreateGateway(PaymentProvider provider) => provider switch {
        PaymentProvider.Zarinpal => _serviceProvider.GetRequiredService<ZarinpalGateway>(),
        PaymentProvider.Saman => _serviceProvider.GetRequiredService<SamanGateway>(),
        _ => throw new NotSupportedException($"Provider {provider} not supported.")
    };
}
\`\`\`

#### ب) الگوی Builder و طراحی Fluent API
- **هدف:** تفکیک فرآیند ساخت یک شیء پیچیده از نمایش آن، به منظور ساخت گام‌به‌گام شیء و اعتبارسنجی قوانین پایدار دامین (Invariants) در پایان فرآیند ساخت.
\`\`\`csharp
public class OrderBuilder {
    private readonly Order _order = new();
    public OrderBuilder ForCustomer(Guid customerId) {
        _order.CustomerId = customerId;
        return this;
    }
    public OrderBuilder AddLineItem(Guid productId, int quantity, decimal unitPrice) {
        _order.Items.Add(new OrderItem(productId, quantity, unitPrice));
        return this;
    }
    public Order Build() {
        if (_order.CustomerId == Guid.Empty) throw new InvalidOperationException("Customer is required");
        if (_order.Items.Count == 0) throw new InvalidOperationException("Order must have items");
        return _order;
    }
}
\`\`\`

#### ج) الگوی Singleton ایمن در محیط‌های Multi-thread با Lazy<T>
\`\`\`csharp
public sealed class CacheManager {
    private static readonly Lazy<CacheManager> _instance = 
        new(() => new CacheManager(), LazyThreadSafetyMode.ExecutionAndPublication);

    private CacheManager() { }
    public static CacheManager Instance => _instance.Value;
}
\`\`\`

---

### ۲. الگوهای ساختاری (Structural Patterns)

#### الف) الگوی Adapter
- **هدف:** تبدیل اینترفیس ناسازگار یک کلاس قدیمی یا خارجی به اینترفیسی که سیستم ما انتظار دارد.
\`\`\`csharp
// تبدیل وب‌سرویس سنتی SOAP بانک به اینترفیس مدرن سیستم ما
public class LegacySoapBankAdapter : IPaymentProvider {
    private readonly LegacySoapBankClient _legacyClient;
    public LegacySoapBankAdapter(LegacySoapBankClient legacyClient) => _legacyClient = legacyClient;

    public async Task<PaymentResult> ChargeAsync(decimal amount, string cardNumber) {
        var soapRequest = new SoapPayRequest { AmountInRials = (long)(amount * 10), Card = cardNumber };
        var soapResponse = await _legacyClient.ExecutePaymentAsync(soapRequest);
        return new PaymentResult(soapResponse.IsSuccess, soapResponse.TrackingCode);
    }
}
\`\`\`

#### ب) الگوی Decorator
- **هدف:** افزودن قابلیت‌های جانبی (مانند Caching، Logging یا Metrics) به یک شیء به صورت پویا بدون تغییر در کدهای اصلی آن.
\`\`\`csharp
public class CachedOrderRepository : IOrderRepository {
    private readonly IOrderRepository _inner;
    private readonly IDistributedCache _cache;

    public CachedOrderRepository(IOrderRepository inner, IDistributedCache cache) {
        _inner = inner;
        _cache = cache;
    }

    public async Task<Order?> GetByIdAsync(Guid id) {
        var cached = await _cache.GetStringAsync($"order:{id}");
        if (cached != null) return JsonSerializer.Deserialize<Order>(cached);

        var order = await _inner.GetByIdAsync(id);
        if (order != null) {
            await _cache.SetStringAsync($"order:{id}", JsonSerializer.Serialize(order), 
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
        }
        return order;
    }
}
// ثبت تمیز در DI با پکیج Scrutor:
// services.Decorate<IOrderRepository, CachedOrderRepository>();
\`\`\`

#### ج) الگوی Facade
- **هدف:** ایجاد یک اینترفیس ساده و سطح بالا برای مدیریت تعاملات پیچیده بین چندین زیرسیستم (مانند انبار، درگاه پرداخت و نوتیفیکیشن).

---

### ۳. الگوهای رفتاری (Behavioral Patterns)

#### الف) الگوی Strategy
- **هدف:** تعریف خانواده‌ای از الگوریتم‌های قابل تعویض در زمان اجرا (مانند استراتژی‌های مختلف محاسبه تخفیف یا کارمزد بیمه).

#### ب) الگوی Chain of Responsibility
- **هدف:** ارسال درخواست از میان زنجیره‌ای از پردازنده‌ها؛ هر پردازنده تصمیم می‌گیرد درخواست را پردازش کند یا به حلقه بعدی زنجیره منتقل نماید (مانند پایپ‌لاین Middleware در ASP.NET Core و Behaviors در MediatR).

#### ج) مقایسه Observer، Mediator و Pub/Sub
| ویژگی | الگوی Observer | الگوی Mediator | الگوی Pub/Sub |
| :--- | :--- | :--- | :--- |
| **نوع ارتباط** | مستقیم (Subject $\to$ Observer) | هاب متمرکز (\`IMediator\`) | از طریق واسط بروکر (Broker) |
| **میزان وابستگی** | بالا (نگهداری رفرنس مستقیم) | کم (ارسال‌کننده و دریافت‌کننده مجزا) | کاملاً مستقل و نامتقارن |
| **محیط اجرا** | درون حافظه پروسس جاری | درون حافظه پروسس جاری | توزیع‌شده روی بستر شبکه |
| **نمونه در دات‌نت** | C# \`event\` و \`IObservable<T>\` | کتابخانه MediatR | RabbitMQ، Kafka و Redis |

---

### ۴. الگوهای سازمانی و معماری (Enterprise & Architectural Patterns)

#### الف) الگوی Specification با Expression Trees
- **هدف:** کپسوله‌سازی شروط بیزینسی درون کلاس‌های مستقل با قابلیت ترکیب با عملگرهای منطقی (AND, OR, NOT) و ترجمه خودکار به SQL از طریق EF Core.

#### ب) الگوهای Outbox و Saga
- **Outbox:** تضمین ارسال قطعی پیام‌ها بدون نیاز به تراکنش‌های توزیع‌شده 2PC.
- **Saga:** مدیریت تراکنش‌های توزیع‌شده بین میکروسرویس‌ها با تراکنش‌های محلی و عملیات جبران‌کننده (Compensating Transactions).`,
  },
  {
    id: "concept-dotnet-4",
    stackId: "dotnet",
    title: "`Span<T>`, `Memory<T>`, `ref struct`, and Async State Machine Internals",
    title_fa: "مفاهیم `Span<T>`، `Memory<T>`، `ref struct` و ساختار داخلی ماشین وضعیت Async",
    content: `### 1. The Anatomy of \`ref struct\` in .NET

A \`ref struct\` is a value type strictly constrained by the CLR to live **only on the execution stack**.

#### Enforced CLR Rules for \`ref struct\`:
1. **Cannot be boxed** to \`object\` or \`ValueType\`.
2. **Cannot be a field** of a normal \`class\` or regular \`struct\` (as it could escape to the managed Heap).
3. **Cannot be used in asynchronous methods** across \`await\` expressions.
4. **Cannot be captured in lambda expressions** or local closures.
5. **Cannot be used as a generic type argument** (prior to C# 13 \`allows ref struct\`).

\`\`\`csharp
// Span<T> is internally defined as a ref struct:
public readonly ref struct Span<T> {
    internal readonly ref T _reference; // Managed interior pointer (ByReference<T>)
    private readonly int _length;      // Element count
}
\`\`\`

---

### 2. Why Can't \`Span<T>\` Cross \`await\` Boundaries?

When you declare an \`async\` method, the C# compiler rewrites the method into a **State Machine** (\`IAsyncStateMachine\`).

\`\`\`
Async Method Compilation:
async Task ProcessDataAsync() {
    Span<byte> span = ...; // ❌ COMPILE ERROR CS4007
    await Task.Delay(100);
}
\`\`\`

#### The Root Cause:
1. When an \`await\` yields control (asynchronous pause), the current execution state (including local variables) must be stored in the state machine's fields so execution can resume later.
2. Because the asynchronous operation might complete on a different thread or at an arbitrary later time, the state machine instance **is boxed / allocated onto the Managed Heap**.
3. Storing a \`ref struct\` (\`Span<T>\`) on the heap violates the fundamental stack-only guarantee of the CLR and would cause GC tracking corruption.

#### The Solution: Use \`Memory<T>\` or \`ReadOnlyMemory<T>\`
\`Memory<T>\` is a normal, heap-safe \`struct\` containing an object reference, index offset, and length. When you are ready to perform synchronous zero-allocation slicing, call \`.Span\` on demand!

\`\`\`csharp
public async Task ProcessAsync(ReadOnlyMemory<byte> memory) {
    // Memory<T> safely survives across await points
    await Task.Delay(100);

    // Slice synchronously on the stack using Span
    ReadOnlySpan<byte> span = memory.Span;
    int magic = BitConverter.ToInt32(span[..4]);
}
\`\`\`

---

### 3. How the Async/Await State Machine Works Under the Hood

When compiling:
\`\`\`csharp
public async Task<int> CalculateAsync(string url) {
    var data = await _httpClient.GetStringAsync(url);
    return data.Length;
}
\`\`\`

The compiler generates an internal struct implementing \`IAsyncStateMachine\`:
1. **Fields:** Holds parameter values, local variables (\`data\`), task builder (\`AsyncTaskMethodBuilder<int>\`), state counter (\`_state\`), and task awaiters.
2. **\`MoveNext()\` method:** Contains a giant \`switch(_state)\` block.
   - Initial call executes synchronous code until the first incomplete awaiter.
   - If \`awaiter.IsCompleted\` is false, it hooks \`MoveNext\` as the callback via \`_builder.AwaitUnsafeOnCompleted(ref awaiter, ref this)\`, sets \`_state = 0\`, and **returns immediately to release the current thread**.
   - When the I/O completion port triggers, a ThreadPool worker invokes \`MoveNext()\`, jumps to case 0, retrieves \`awaiter.GetResult()\`, and completes the task result.`,
    content_fa: `### ۱. آناتومی و محدودیت‌های \`ref struct\` در دات‌نت

یک \`ref struct\` نوع داده مقداری (Value Type) است که توسط کامپایلر و CLR تضمین می‌شود **صرفاً روی Stack تخصیص یافته و به هیچ وجه به Heap منتقل نشود**.

#### قوانین سخت‌گیرانه CLR برای \`ref struct\`:
۱. **عدم امکان Boxing:** هرگز به \`object\` یا \`ValueType\` تبدیل (Box) نمی‌شود.
۲. **عدم امکان استفاده به عنوان فیلد کلاس:** نمی‌تواند عضوی از یک \`class\` یا \`struct\` معمولی باشد.
۳. **عدم استفاده در متدهای Async:** نمی‌تواند در محدوده عبارات \`await\` زنده بماند.
۴. **عدم استفاده در توابع لامبدا:** متغیرهای \`ref struct\` اجازه کپچر شدن در Closureها را ندارند.

\`\`\`csharp
// تعریف داخلی Span<T> به صورت ref struct:
public readonly ref struct Span<T> {
    internal readonly ref T _reference; // اشاره‌گر مستقیم به خانه حافظه
    private readonly int _length;      // تعداد المان‌ها
}
\`\`\`

---

### ۲. چرا \`Span<T>\` نمی‌تواند از مرز \`await\` عبور کند؟

هنگام نوشتن یک متد \`async\`، کامپایلر سی‌شارپ متد را به یک ماشین وضعیت (\`IAsyncStateMachine\`) تبدیل می‌کند.

#### علت فنی خطای کامپایل:
۱. هنگام رسیدن به \`await\` و معلق شدن اجرای متد، تمام متغیرهای محلی باید در فیلدهای کلاس ماشین وضعیت ذخیره شوند تا در آینده بازخوانی گردند.
۲. نمونه ماشین وضعیت برای نگهداری مقادیر پس از خروج از فریم استک متد، **روی Heap ذخیره (Box) می‌شود**.
۳. قرار گرفتن یک \`ref struct\` روی Heap نقض صریح تضمین‌های ایمنی حافظه در CLR بوده و توسط کامپایلر مسدود می‌شود.

#### راهکار: استفاده از \`Memory<T>\`
ساختار \`Memory<T>\` یک استراکت معمولی و ایمن برای ذخیره روی Heap است که می‌تواند به راحتی در طول زمان اجرای متدهای \`async\` باقی بماند و در زمان نیاز به پردازش فوق سریع، با متد \`.Span\` به \`Span<T>\` تبدیل شود.

\`\`\`csharp
public async Task ProcessAsync(ReadOnlyMemory<byte> memory) {
    // نگهداری امن در طول عملیات ناهمگام
    await Task.Delay(100);

    // تبدیل به Span روی استک برای پردازش بدون آلیکیشن
    ReadOnlySpan<byte> span = memory.Span;
    int magic = BitConverter.ToInt32(span[..4]);
}
\`\`\`

---

### ۳. نحوه کارکرد ماشین وضعیت (Async State Machine)

کامپایلر دات‌نت متدهای حاوی \`async\` را به یک ساختار داخلی با اینترفیس \`IAsyncStateMachine\` تبدیل می‌کند:
- **متد \`MoveNext\`:** دارای یک بلوک \`switch(_state)\` بزرگ است.
- تا قبل از رسیدن به \`await\`، کد به صورت همگام اجرا می‌شود.
- در صورت کامل نشدن تسک، متد \`AwaitUnsafeOnCompleted\` وضعیت را ذخیره کرده، نخ اجرایی جاری را آزاد می‌کند و سیستم را منتظر اعلام تکمیل I/O می‌گذارد.
- با پایان I/O دیتابیس یا شبکه، یک نخ از ThreadPool متد \`MoveNext\` را فراخوانی کرده و اجرای برنامه از حالت معلق ادامه می‌یابد.`,
  },
  {
    id: "concept-dotnet-5",
    stackId: "dotnet",
    title: "Expression Trees, `Func<T>`, and LINQ / EF Core Query Translation Pipeline",
    title_fa: "درخت عبارات (Expression Trees)، تفاوت با Func و نحوه ترجمه کوئری در EF Core",
    content: `### 1. Code as Data: What is an Expression Tree?

An **Expression Tree** represents C# code not as executable compiled bytecode, but as an in-memory **Abstract Syntax Tree (AST)** data structure composed of nodes inheriting from \`System.Linq.Expressions.Expression\`.

\`\`\`
Lambda: x => x.Age > 18

Expression Tree Structure:
      LambdaExpression (x => ...)
                |
        BinaryExpression (GreaterThan)
           /          \\
MemberExpression     ConstantExpression
    (x.Age)                (18)
\`\`\`

---

### 2. \`Expression<Func<T, bool>>\` vs. \`Func<T, bool>\`

| Feature | \`Func<T, bool>\` (Delegate) | \`Expression<Func<T, bool>>\` (Expression Tree) |
| :--- | :--- | :--- |
| **Representation** | Compiled Intermediate Language (IL) byte-code | In-memory Abstract Syntax Tree (AST) Data Structure |
| **Inspection** | Opaque black box (cannot inspect parameters or operations) | Fully transparent tree; inspectable at runtime |
| **Execution** | Directly executed by CPU/CLR ($O(1)$ invoke overhead) | Must be explicitly compiled via \`.Compile()\` before execution |
| **Target Interface** | \`IEnumerable<T>\` (LINQ to Objects) | \`IQueryable<T>\` (LINQ to SQL / EF Core Providers) |
| **Execution Location**| Application RAM (In-Memory) | Database Server (Translated to native SQL) |

---

### 3. The EF Core SQL Translation Pipeline

When you execute \`dbContext.Users.Where(u => u.Age > 18).ToList()\`:
1. \`Where()\` receives an \`Expression<Func<User, bool>>\`.
2. EF Core passes the entire combined Expression Tree to its internal \`IQueryProvider\` (\`EntityQueryProvider\`).
3. EF Core's **\`RelationalQueryableMethodTranslatingExpressionVisitor\`** walks the AST recursively:
   - Identifies \`MemberExpression (u.Age)\` $\to$ maps to column \`[Age]\`.
   - Identifies \`BinaryExpression (GreaterThan)\` $\to$ maps to SQL operator \`>\`.
   - Identifies \`ConstantExpression (18)\` $\to$ maps to parameterized query \`@__p_0\`.
4. The **SQL Generator** creates: \`SELECT [u].[Id], [u].[Age], [u].[Name] FROM [Users] AS [u] WHERE [u].[Age] > @__p_0\`.
5. ADO.NET executes the SQL against the database, materializing database rows into C# \`User\` objects.

#### Why Client-Side Evaluation Errors Occur:
If an Expression contains a custom C# method (e.g. \`u => MyCustomRegexHelper(u.Email)\`), EF Core's visitor cannot find a matching SQL function, throwing an **\`InvalidOperationException\`** (The LINQ expression could not be translated).`,
    content_fa: `### ۱. مفهوم کد به عنوان داده (Code as Data)

**درخت عبارات (Expression Tree)** ساختاری است که کدهای سی‌شارپ را نه به صورت بایت‌کد کامپایل‌شده، بلکه به عنوان یک درخت ساختار داده انتزاعی (**Abstract Syntax Tree**) در حافظه نگهداری می‌کند.

\`\`\`
عبارت لامبدا: x => x.Age > 18

ساختار درخت عبارات:
      LambdaExpression (x => ...)
                |
        BinaryExpression (GreaterThan)
           /          \\
MemberExpression     ConstantExpression
    (x.Age)                (18)
\`\`\`

---

### ۲. مقایسه تخصصی \`Expression<Func<T, bool>>\` و \`Func<T, bool>\`

| ویژگی | \`Func<T, bool>\` (Delegate) | \`Expression<Func<T, bool>>\` (Expression Tree) |
| :--- | :--- | :--- |
| **ماهیت** | کدهای کامپایل‌شده به زبان میانی IL | ساختار داده درختی انتزاعی در حافظه |
| **قابلیت بازرسی** | جعبه سیاه غیرقابل تحلیل در زمان اجرا | درختی شفاف و قابل پیمایش با \`ExpressionVisitor\` |
| **نحوه اجرا** | فراخوانی مستقیم و آنی توسط CPU | نیازمند کامپایل دستی با متد \`.Compile()\` |
| **اینترفیس هدف** | \`IEnumerable<T>\` (اجرا در رم برنامه) | \`IQueryable<T>\` (ارسال به دیتابیس با EF Core) |
| **محل پردازش** | درون حافظه RAM اپلیکیشن | درون سرور دیتابیس (تبدیل به SQL بومی) |

---

### ۳. خط لوله ترجمه کوئری در Entity Framework Core

هنگام اجرای دستور \`dbContext.Users.Where(u => u.Age > 18).ToList()\`:
۱. متد \`Where\` درخت عبارات را تحویل \`IQueryProvider\` داخلی EF Core می‌دهد.
۲. ویزیتور اختصاصی EF Core گره‌های درخت را پیمایش می‌کند:
   - گره \`u.Age\` به ستون \`[Age]\` در دیتابیس نگاشت می‌شود.
   - گره بزرگتر از (\`GreaterThan\`) به عملگر \`>\` در SQL ترجمه می‌شود.
   - مقدار ثابت \`18\` به پارامتر امن SQL (\`@__p_0\`) تبدیل می‌گردد.
۳. رشته نهایی SQL تولید شده و توسط درایور ADO.NET به سمت دیتابیس ارسال می‌گردد.`,
  },
  {
    id: "concept-dotnet-6",
    stackId: "dotnet",
    title: "Database Architecture: ACID Isolation Levels, B+ Tree Index Internals, Deadlocks & Sharding",
    title_fa: "معماری پایگاه داده: سطوح ایزولاسیون ACID، ساختار ایندکس B+ Tree، بن‌بست و شاردینگ",
    content: `### 1. Transaction Isolation Levels & Concurrency Anomalies

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Write Skew |
| :--- | :---: | :---: | :---: | :---: |
| **Read Uncommitted** | ❌ Allowed | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Read Committed** (Default) | ✅ Prevented | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Repeatable Read** | ✅ Prevented | ✅ Prevented | ❌ Allowed | ❌ Allowed |
| **Snapshot Isolation (MVCC)** | ✅ Prevented | ✅ Prevented | ✅ Prevented | ❌ Allowed |
| **Serializable** | ✅ Prevented | ✅ Prevented | ✅ Prevented | ✅ Prevented |

#### What is Write Skew?
Write Skew occurs under Snapshot Isolation when two concurrent transactions read overlapping data sets, satisfy business constraints based on their snapshot, but make disjoint updates that violate a global invariant (e.g. two doctors concurrently on-call both submit a request to take leave because each sees 2 active doctors). Prevented by **Serializable** locks or explicit row locking (\`UPDLOCK\`).

---

### 2. B+ Tree Index Architecture

Relational database indexes (SQL Server, PostgreSQL, MySQL) are organized as **balanced trees (B+ Trees)**:
- **Root & Intermediate Nodes:** Contain routing keys and child page pointers.
- **Leaf Nodes:** Doubly-linked pages allowing rapid sequential range scans ($O(\\log N)$ seek + $O(K)$ scan).
- **Clustered Index:** The leaf level IS the actual data table. Only **one** clustered index can exist per table.
- **Non-Clustered Index:** The leaf level contains index key columns + a **Row Locator** (Clustered Key or RID).
- **Covering Index:** Adding columns via \`INCLUDE (ColA, ColB)\` satisfies the entire query from the non-clustered index leaf page, **completely eliminating expensive Key/Bookmark Lookups**.

---

### 3. Database Deadlocks & Elimination Strategies

A Deadlock occurs when two or more transactions form a circular dependency waiting for locks held by each other.
\`\`\`
Transaction 1: Holds Lock on Table A, Requests Lock on Table B.
Transaction 2: Holds Lock on Table B, Requests Lock on Table A.
Result: Deadlock! DB engine kills the transaction with lowest rollback cost (Deadlock Victim).
\`\`\`

#### Deadlock Prevention Rules:
1. **Deterministic Lock Ordering:** Always access and update tables in the exact same alphabetical or topological sequence across all transactions.
2. **Keep Transactions Short:** Never perform HTTP calls, email sending, or heavy serialization inside DB transactions.
3. **Use Snapshot Isolation (RCSI):** Reduces shared read-lock contention by utilizing row versioning in \`tempdb\`.
4. **Use Explicit Locking Hints:** \`WITH (UPDLOCK, HOLDLOCK)\` when reading data intended for immediate update.

---

### 4. Database Partitioning vs. Horizontal Sharding

- **Table Partitioning:** Splitting a single large table on one server into multiple disk filegroups based on a partition key (e.g. \`OrderDate\`). Transparent to applications; optimizes queries via **Partition Elimination**.
- **Horizontal Sharding:** Distributing data rows across completely independent database servers/instances based on a **Shard Key** (e.g. \`TenantId\` or \`UserId % N\`). Solves physical compute, memory, and disk capacity limits at multi-terabyte scale.`,
    content_fa: `### ۱. سطوح ایزولاسیون تراکنش‌ها و ناهنجاری‌های همزمانی

| سطح ایزولاسیون | Dirty Read | Non-Repeatable Read | Phantom Read | Write Skew |
| :--- | :---: | :---: | :---: | :---: |
| **Read Uncommitted** | ❌ رخ می‌دهد | ❌ رخ می‌دهد | ❌ رخ می‌دهد | ❌ رخ می‌دهد |
| **Read Committed** (پیش‌فرض) | ✅ رفع شده | ❌ رخ می‌دهد | ❌ رخ می‌دهد | ❌ رخ می‌دهد |
| **Repeatable Read** | ✅ رفع شده | ✅ رفع شده | ❌ رخ می‌دهد | ❌ رخ می‌دهد |
| **Snapshot Isolation** | ✅ رفع شده | ✅ رفع شده | ✅ رفع شده | ❌ رخ می‌دهد |
| **Serializable** | ✅ رفع شده | ✅ رفع شده | ✅ رفع شده | ✅ رفع شده |

#### پدیده Write Skew چیست؟
ناهنجاری Write Skew در سطح Snapshot Isolation رخ می‌دهد؛ زمانی که دو تراکنش همزمان داده‌های مشترکی را خوانده و هر دو بر اساس اطلاعات اسنپ‌شات معتبر تشخیص می‌دهند که می‌توانند تغییرات را ثبت کنند، اما تجمیع تغییرات آن‌ها قانون یکپارچگی سیستم را نقض می‌کند (مانند انصراف همزمان دو پزشک آنکال به دلیل اینکه هر کدام حضور دیگری را در اسنپ‌شات خود می‌بیند). این مشکل با سطح **Serializable** یا قفل صریح \`UPDLOCK\` برطرف می‌شود.

---

### ۲. معماری داخلی ایندکس‌های دیتابیس (B+ Tree)

ایندکس‌های پایگاه داده بر پایه ساختار **درخت B+ Tree** پیاده‌سازی شده‌اند:
- **گره‌های ریشه و میانی:** حاوی کلیدهای راهنما و آدرس صفحات فرزند هستند.
- **گره‌های برگ (Leaf Nodes):** به صورت لیست پیوندی دوطرفه متصل هستند که جستجوی بازه‌ای ($O(\\log N)$) را فوق‌العاده سریع می‌سازد.
- **ایندکس خوشه‌ای (Clustered Index):** سطح برگ ایندکس، خود رکوردهای واقعی جدول است (هر جدول فقط یک ایندکس خوشه‌ای دارد).
- **ایندکس غیرخوشه‌ای (Non-Clustered):** سطح برگ شامل فیلدهای ایندکس و یک اشاره‌گر به کلید Clustered است.
- **ایندکس پوششی (Covering Index):** با اضافه کردن فیلدها در بخش \`INCLUDE\`، کوئری مستقیماً از سطح برگ ایندکس پاسخ داده شده و عملیات سنگین **Key Lookup** به کلی حذف می‌شود.

---

### ۳. علل بن‌بست (Deadlock) و راهکارهای پیشگیری

بن‌بست زمانی رخ می‌دهد که دو تراکنش در یک حلقه وابستگی متقابل منتظر آزادسازی قفل‌های یکدیگر بمانند.

#### راهکارهای قطعی پیشگیری از Deadlock:
۱. **ترتیب دسترسی یکنواخت به جداول:** در تمام کدهای برنامه، جداول همیشه با یک ترتیب مشخص (مثلاً همیشه اول جدول A و سپس جدول B) قفل و آپدیت شوند.
۲. **کوتاه نگه داشتن زمان تراکنش:** پرهیز از انجام فراخوانی‌های شبکه یا وب‌سرویس درون بلوک تراکنش دیتابیس.
۳. **فعال‌سازی Read Committed Snapshot Isolation (RCSI):** حذف قفل‌های خواندن با استفاده از نگهداری نسخه‌های رکورد در \`tempdb\`.`,
  },
];
