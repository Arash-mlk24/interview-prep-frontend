import { Question } from "../../models";

export const dotnetJuniorQuestions: Question[] = [
  // ── C# Fundamentals & OOP (Q1 - Q15) ───────────────────────────
  {
    id: "dotnet-junior-q1",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "Explain the concept of Object-Oriented Programming (OOP) with examples.",
    questionTitle_fa: "مفهوم برنامه‌نویسی شیءگرا (OOP) را با مثال توضیح بده.",
    answerContent: `### Object-Oriented Programming (OOP) Core Pillars

OOP is a programming paradigm based on the concept of **objects**, which contain data (fields/properties) and code (methods).

#### The 4 Core Pillars:

1. **Encapsulation (کپسوله‌سازی):**
   - Bundling data with methods that operate on that data and restricting direct access to internal state.
   \`\`\`csharp
   public class BankAccount
   {
       private decimal _balance; // Hidden internal state
       public void Deposit(decimal amount)
       {
           if (amount > 0) _balance += amount;
       }
       public decimal GetBalance() => _balance;
   }
   \`\`\`

2. **Inheritance (وراثت):**
   - Mechanism where a class acquires fields and methods of another class, promoting code reuse.
   \`\`\`csharp
   public class Animal
   {
       public void Eat() => Console.WriteLine("Eating...");
   }
   public class Dog : Animal
   {
       public void Bark() => Console.WriteLine("Woof!");
   }
   \`\`\`

3. **Polymorphism (چندریختی):**
   - Ability of different classes to respond to the same method call in their own specific way (Method Overriding & Overloading).
   \`\`\`csharp
   public abstract class Shape
   {
       public abstract double CalculateArea();
   }
   public class Circle : Shape
   {
       public double Radius { get; set; }
       public override double CalculateArea() => Math.PI * Radius * Radius;
   }
   \`\`\`

4. **Abstraction (تجرید / انتزاع):**
   - Exposing only the relevant details to the outside world while hiding complex underlying implementation details (via interfaces and abstract classes).`,
    answerContent_fa: `### چهار اصل اساسی برنامه‌نویسی شیءگرا (OOP)

برنامه‌نویسی شیءگرا پارادایمی مبتنی بر **اشیاء (Objects)** است که شامل داده‌ها (فیلدها/پراپرتی‌ها) و رفتارها (متدها) هستند.

#### ۴ ستون اصلی OOP:

۱. **Encapsulation (کپسوله‌سازی):**
   - بسته‌بندی داده‌ها و متدها درون یک واحد و محدود کردن دسترسی مستقیم به وضعیت داخلی جهت تضمین صحت داده.
   \`\`\`csharp
   public class BankAccount
   {
       private decimal _balance; // Hidden internal state
       public void Deposit(decimal amount)
       {
           if (amount > 0) _balance += amount;
       }
       public decimal GetBalance() => _balance;
   }
   \`\`\`

۲. **Inheritance (وراثت):**
   - مکانیزمی که در آن یک کلاس (فرزند) ویژگی‌ها و متدهای کلاس دیگر (والد) را به ارث می‌برد تا از تکرار کد جلوگیری شود.

۳. **Polymorphism (چندریختی):**
   - توانایی اجرای رفتارهای متفاوت توسط اشیای مختلف در پاسخ به یک فراخوانی متد یکسان (مانند \`override\` کردن متد والد).

۴. **Abstraction (انتزاع / تجرید):**
   - پنهان‌سازی جزئیات پیچیده پیاده‌سازی و نمایش صرفاً واسط‌ها و عملکردهای ضروری به کلاینت (از طریق \`interface\` یا \`abstract class\`).`,
  },
  {
    id: "dotnet-junior-q2",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between Value Types and Reference Types in C#?",
    questionTitle_fa: "تفاوت Value Type و Reference Type در سی‌شارپ چیست؟",
    answerContent: `### Value Types vs. Reference Types in C#

| Feature | Value Types | Reference Types |
| :--- | :--- | :--- |
| **Storage** | Stack (or inline inside heap objects) | Heap (pointer on Stack, data on Heap) |
| **Assignment** | Value copy (independent duplicate) | Reference copy (both point to same heap memory) |
| **Default Value** | \`0\`, \`false\`, empty struct | \`null\` |
| **Examples** | \`int\`, \`double\`, \`bool\`, \`struct\`, \`enum\` | \`class\`, \`string\`, \`interface\`, \`delegate\`, \`record\` |
| **Inheritance** | Implicitly inherit from \`System.ValueType\` | Inherit from \`System.Object\` |

\`\`\`csharp
// Value Type behavior
int x = 10;
int y = x;
y = 20; // x remains 10

// Reference Type behavior
var u1 = new User { Name = "Ali" };
var u2 = u1;
u2.Name = "Reza"; // u1.Name is now "Reza"
\`\`\``,
    answerContent_fa: `### مقایسه Value Typeها و Reference Typeها

| ویژگی | Value Type | Reference Type |
| :--- | :--- | :--- |
| **محل ذخیره** | حافظه Stack (یا درجا درون شیء روی Heap) | داده اصلی روی Heap، آدرس روی Stack |
| **انتساب (Assignment)** | کپی کامل مقدار (دو متغیر مستقل) | کپی اشاره‌گر (هر دو به یک حافظه مشترک اشاره دارند) |
| **مقدار پیش‌فرض** | \`0\`, \`false\`, استراکت خالی | \`null\` |
| **نمونه‌ها** | \`int\`, \`bool\`, \`struct\`, \`enum\` | \`class\`, \`string\`, \`record\`, \`delegate\` |

\`\`\`csharp
// Value Type behavior
int x = 10;
int y = x;
y = 20; // x remains 10

// Reference Type behavior
var u1 = new User { Name = "Ali" };
var u2 = u1;
u2.Name = "Reza"; // u1.Name is now "Reza"
\`\`\``,
  },
  {
    id: "dotnet-junior-q3",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between Class and Struct, and when should you use a Struct?",
    questionTitle_fa: "تفاوت Class و Struct چیست و چه زمانی از Struct استفاده می‌کنیم؟",
    answerContent: `### Class vs Struct in C#

1. **Memory Allocation:**
   - \`class\` is a **Reference Type** allocated on the Managed Heap, tracked by Garbage Collector.
   - \`struct\` is a **Value Type** allocated on the Stack (unless embedded in a class).

2. **Inheritance:**
   - \`class\` supports full inheritance hierarchies.
   - \`struct\` cannot inherit from other classes or structs (can only implement interfaces).

#### When to Use a Struct?
Follow Microsoft's official guidelines:
- The instance size is small ($\le 16$ bytes).
- It represents a single value (e.g., \`Point(x, y)\`, \`GeoCoordinate\`, \`RgbColor\`).
- It is immutable (use \`readonly struct\`).
- It is short-lived to reduce GC heap allocations.`,
    answerContent_fa: `### تفاوت Class و Struct و زمان استفاده از Struct

۱. **تخصیص حافظه:**
   - \`class\` یک **Reference Type** است که روی Heap ساخته می‌شود و توسط GC پاک‌سازی می‌گردد.
   - \`struct\` یک **Value Type** است که معمولاً روی Stack ذخیره شده و با خروج از اسکوپ فوراً آزاد می‌شود.

۲. **وراثت:**
   - کلاس‌ها از وراثت کامل پشتیبانی می‌کنند، در حالی که استراکت‌ها نمی‌توانند از کلاس یا استراکت دیگر ارث‌بری کنند (تنها اینترفیس را پیاده‌سازی می‌کنند).

#### چه زمانی از Struct استفاده می‌کنیم؟
- حجم داده‌ها کوچک باشد (کمتر از ۱۶ بایت).
- نمایانگر یک مفهوم عددی یا مقداری واحد باشد (مانند \`Point\`، \`Color\`، \`Money\`).
- ترجیحاً تغییرناپذیر (Immutable) باشد (\`readonly struct\`).
- طول عمر کوتاهی داشته باشد تا بار کاری Garbage Collector کاهش یابد.`,
  },
  {
    id: "dotnet-junior-q4",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between an Interface and an Abstract Class?",
    questionTitle_fa: "تفاوت Interface و Abstract Class در چیست؟",
    answerContent: `### Interface vs. Abstract Class

| Criteria | Interface | Abstract Class |
| :--- | :--- | :--- |
| **Multiple Inheritance** | A class can implement **multiple** interfaces | A class can inherit from only **one** class |
| **State / Fields** | Cannot contain instance state or fields | Can have fields, constructors, and state |
| **Purpose** | Defines a **contract** ("Can-Do" relationship) | Defines an **is-a** relationship with shared base logic |
| **Access Modifiers** | Historically public only (C# 8 supports default methods) | Supports \`public\`, \`protected\`, \`private\`, \`internal\` |

\`\`\`csharp
public interface IPayable { void ProcessPayment(); }

public abstract class Vehicle
{
    public string Brand { get; set; } // Has state
    public abstract void Drive();     // Must be overridden
    public void StartEngine() => Console.WriteLine("Engine on"); // Concrete
}
\`\`\``,
    answerContent_fa: `### تفاوت اینترفیس و کلاس انتزاعی

| معیار | Interface | Abstract Class |
| :--- | :--- | :--- |
| **وراثت چندگانه** | یک کلاس می‌تواند **چندین** اینترفیس را پیاده‌سازی کند | هر کلاس فقط می‌تواند از **یک** کلاس ارث ببرد |
| **فیلد و وضعیت (State)** | نمی‌تواند فیلد یا فیلدهای نگه‌دارنده وضعیت داشته باشد | می‌تواند فیلد، سازنده (Constructor) و وضعیت داشته باشد |
| **هدف طراحی** | تعریف یک **قرارداد رفتاری** (قابلیت انجام یک کار) | تعریف رابطه **is-a** به همراه کدهای اشتراکی پایه |

\`\`\`csharp
public interface ILoggable { void Log(string message); }

public abstract class BaseRepository
{
    protected readonly DbContext _context; // Internal state
    public BaseRepository(DbContext ctx) => _context = ctx;
    public abstract Task SaveAsync();
}
\`\`\``,
  },
  {
    id: "dotnet-junior-q5",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "Explain the concepts of Boxing and Unboxing in C#.",
    questionTitle_fa: "مفاهیم Boxing و Unboxing را توضیح بده.",
    answerContent: `### Boxing & Unboxing

- **Boxing:** The implicit conversion of a **Value Type** to a **Reference Type** (such as \`object\` or an interface). A new object is allocated on the Heap, and the value is copied into it.
- **Unboxing:** The explicit conversion of an \`object\` back to its original **Value Type**. It extracts the value from the heap object.

\`\`\`csharp
int num = 42;
object boxed = num; // Boxing -> Allocates memory on Heap!

int unboxed = (int)boxed; // Unboxing -> Explicit cast required
\`\`\`

#### Performance Impact:
Boxing incurs CPU overhead and generates Heap allocations that put pressure on the Garbage Collector. Generics (\`List<int>\` instead of \`ArrayList\`) were introduced to eliminate boxing in collections.`,
    answerContent_fa: `### مفاهیم Boxing و Unboxing

- **Boxing:** تبدیل ضمنی (Implicit) یک **Value Type** به یک **Reference Type** (مانند \`object\` یا یک اینترفیس). در این فرآیند، یک شیء جدید روی Heap ساخته شده و مقدار در آن کپی می‌شود.
- **Unboxing:** تبدیل صریح (Explicit) یک شیء از نوع \`object\` به همان نوع اولیه **Value Type** که مقدار را از Heap استخراج می‌کند.

\`\`\`csharp
int num = 42;
object obj = num; // Boxing (تخصیص حافظه روی Heap)

int restored = (int)obj; // Unboxing (نیازمند Cast صریح)
\`\`\`

#### تأثیر روی کارایی:
Boxing باعث کندی و تحمیل بار اضافی به Garbage Collector می‌شود. استفاده از Generics (مثل \`List<int>\` به جای \`ArrayList\`) برای جلوگیری از پدیده Boxing ایجاد شد.`,
  },
  {
    id: "dotnet-junior-q6",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between 'ref' and 'out' parameter modifiers in C#?",
    questionTitle_fa: "تفاوت کلمات کلیدی ref و out در پاس دادن پارامترها چیست؟",
    answerContent: `### 'ref' vs 'out' in C#

Both keywords cause arguments to be passed by **reference** rather than by value.

1. **\`ref\`:**
   - The variable **must be initialized** before being passed into the method.
   - The method can read and optionally modify the variable.

2. **\`out\`:**
   - The variable does **not** need to be initialized before passing.
   - The method **must assign a value** before returning.

\`\`\`csharp
// ref example
int a = 10; // Must initialize
Modify(ref a);
void Modify(ref int x) => x += 5;

// out example (e.g., int.TryParse)
if (int.TryParse("123", out int result))
{
    Console.WriteLine(result); // 123
}
\`\`\``,
    answerContent_fa: `### تفاوت کلمات کلیدی ref و out

هر دو کلمه کلیدی باعث می‌شوند متغیرها به جای کپی مقدار، با **اشاره‌گر (Reference)** به متد ارسال شوند.

۱. **\`ref\`:**
   - متغیر **حتماً باید قبل از ارسال به متد مقداردهی اولیه** شده باشد.
   - متد می‌تواند مقدار آن را بخواند یا تغییر دهد.

2. **\`out\`:**
   - متغیر نیازی به مقداردهی اولیه قبل از ارسال ندارد.
   - متد دریافت‌کننده **حتماً باید قبل از اتمام، مقداری به آن اختصاص دهد**.

\`\`\`csharp
// Example using out with TryParse:
if (int.TryParse("450", out int price))
{
    Console.WriteLine(price * 2);
}
\`\`\``,
  },
  {
    id: "dotnet-junior-q7",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between 'virtual' and 'abstract' keywords in C#?",
    questionTitle_fa: "تفاوت کلمات کلیدی virtual و abstract چیست؟",
    answerContent: `### 'virtual' vs. 'abstract' in C#

- **\`virtual\`:**
  - Declares a method with a **default concrete implementation** in the base class.
  - Derived classes **can optionally override** it using \`override\`.
- **\`abstract\`:**
  - Declares a method **without any implementation** inside an \`abstract class\`.
  - Derived non-abstract classes **must implement** it using \`override\`.

\`\`\`csharp
public abstract class Notification
{
    public abstract void Send(string message); // Must override

    public virtual void Log() // Optional override
    {
        Console.WriteLine("Default logging...");
    }
}
\`\`\``,
    answerContent_fa: `### تفاوت virtual و abstract

- **\`virtual\`:**
  - متدی در کلاس پایه است که دارای **پیاده‌سازی پیش‌فرض** است.
  - کلاس‌های فرزند در صورت تمایل می‌توانند آن را با \`override\` بازنویسی کنند (اختیاری).
- **\`abstract\`:**
  - متدی درون یک \`abstract class\` است که **هیچ کدی برای بدنه ندارد**.
  - کلاس‌های فرزند غیرانتزاعی **الزاماً باید** آن را با \`override\` پیاده‌سازی کنند (اجباری).`,
  },
  {
    id: "dotnet-junior-q8",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the purpose of the 'override' keyword in C#?",
    questionTitle_fa: "کلمه کلیدی override چه کاربردی دارد؟",
    answerContent: `### The 'override' Keyword

The \`override\` modifier is required to extend or modify the abstract or virtual implementation of an inherited method, property, indexer, or event.

#### Key Rules:
- The overridden base method must be \`virtual\`, \`abstract\`, or \`override\`.
- Both the base and derived methods must have the exact same signature, return type, and accessibility.
- You can invoke the base implementation using \`base.MethodName()\`.

\`\`\`csharp
public class BaseLogger
{
    public virtual void Log(string msg) => Console.WriteLine($"Base: {msg}");
}

public class CustomLogger : BaseLogger
{
    public override void Log(string msg)
    {
        base.Log(msg);
        Console.WriteLine($"Custom extra: {msg}");
    }
}
\`\`\``,
    answerContent_fa: `### کاربرد کلمه کلیدی override

کلمه کلیدی \`override\` برای بازنویسی و تغییر رفتار متدها، پراپرتی‌ها یا رویدادهایی استفاده می‌شود که در کلاس والد به صورت \`virtual\` یا \`abstract\` تعریف شده‌اند.

#### نکات کلیدی:
- متد والد حتماً باید \`virtual\` یا \`abstract\` باشد.
- امضای متد و سطح دسترسی باید دقیقاً یکسان باشد.
- برای فراخوانی منطق کلاس پایه می‌توان از دستور \`base.MethodName()\` استفاده کرد.`,
  },
  {
    id: "dotnet-junior-q9",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is an Extension Method and how is it written in C#?",
    questionTitle_fa: "Extension Method چیست و چگونه نوشته می‌شود؟",
    answerContent: `### Extension Methods in C#

Extension methods enable you to "add" methods to existing types without modifying the original type's source code, creating a new derived type, or recompiling.

#### Rules for writing Extension Methods:
1. Must be defined in a **static class**.
2. Must be a **static method**.
3. The first parameter specifies the type being extended, preceded by the **\`this\`** keyword.

\`\`\`csharp
public static class StringExtensions
{
    public static bool IsValidEmail(this string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        return email.Contains("@") && email.Contains(".");
    }
}

// Usage:
string userEmail = "dev@example.com";
bool valid = userEmail.IsValidEmail(); // Called like an instance method!
\`\`\``,
    answerContent_fa: `### اکستنشن متد (Extension Method) در سی‌شارپ

اکستنشن متدها به شما اجازه می‌دهند بدون نیاز به ارث‌بری یا تغییر در سورس‌کد اصلی یک نوع داده (حتی انواع داخلی دات‌نت مثل \`string\` یا \`DateTime\`)، متدهای جدیدی به آن اضافه کنید.

#### قوانین تعریف:
۱. درون یک **کلاس استاتیک (\`static class\`)** تعریف شوند.
۲. متد باید **استاتیک (\`static\`)** باشد.
۳. اولین پارامتر مشخص‌کننده نوع داده هدف بوده و کلمه کلیدی **\`this\`** قبل از آن می‌آید.

\`\`\`csharp
public static class NumericExtensions
{
    public static string ToTomanFormat(this decimal amount)
    {
        return $"{amount:N0} تومان";
    }
}

// Usage:
decimal price = 150000;
string formatted = price.ToTomanFormat(); // "150,000 تومان"
\`\`\``,
  },
  {
    id: "dotnet-junior-q10",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between IEnumerable and IQueryable in C#?",
    questionTitle_fa: "تفاوت IQueryable و IEnumerable چیست و هر کدام کجا کاربرد دارند؟",
    answerContent: `### IEnumerable vs IQueryable

| Criteria | IEnumerable<T> | IQueryable<T> |
| :--- | :--- | :--- |
| **Namespace** | \`System.Collections.Generic\` | \`System.Linq\` |
| **Execution** | **In-Memory** (Client-side evaluation) | **Out-of-Memory** (Remote database evaluation) |
| **Expression Support** | Uses \`Func<T, bool>\` delegates | Uses \`Expression<Func<T, bool>>\` Expression Trees |
| **Filtering (WHERE)** | Fetches all data to memory first, then filters | Translates LINQ expressions directly to **SQL** |
| **Best For** | In-memory collections, Arrays, Lists | Querying databases via ORMs like **EF Core** |

\`\`\`csharp
// IEnumerable -> Filters in RAM
IEnumerable<User> list = _dbContext.Users;
var result1 = list.Where(u => u.IsActive).Take(10); // Downloads ALL users first!

// IQueryable -> Translates to SQL (SELECT TOP 10 ... WHERE IsActive = 1)
IQueryable<User> query = _dbContext.Users;
var result2 = query.Where(u => u.IsActive).Take(10).ToList(); // Executes optimized SQL
\`\`\``,
    answerContent_fa: `### مقایسه IEnumerable و IQueryable

| ویژگی | IEnumerable | IQueryable |
| :--- | :--- | :--- |
| **محل پردازش** | درون حافظه رم (Client-Side) | سمت دیتابیس با تولید SQL (Server-Side) |
| **نوع فیلتر** | بر پایه Delegate (\`Func<T, bool>\`) | بر پایه درخت عبارات (\`Expression Trees\`) |
| **رفتار فیلتر** | ابتدا کل داده‌ها را لود کرده سپس در رم فیلتر می‌کند | فیلتر را مستقیماً به کوئری SQL تبدیل می‌کند |
| **کاربرد اصلی** | کالکشن‌های درون حافظه (آرایه‌ها و لیست‌ها) | کوئری زدن به دیتابیس با EF Core |

\`\`\`csharp
// IQueryable: فقط ۱۰ رکورد با شرط مورد نظر از دیتابیس خوانده می‌شود
var activeUsers = _context.Users
    .Where(u => u.IsActive)
    .Take(10)
    .ToList();
\`\`\``,
  },
  {
    id: "dotnet-junior-q11",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the purpose of the 'yield' keyword in C#?",
    questionTitle_fa: "کلمه کلیدی yield در سی‌شارپ چه کاربردی دارد؟",
    answerContent: `### The 'yield' Keyword in C#

The \`yield\` keyword is used in an iterator block to provide a value to the enumerator object or signal the end of iteration, implementing **Lazy / Deferred Execution**.

- **\`yield return <expression>;\`**: Returns one element at a time on each \`MoveNext()\` call.
- **\`yield break;\`**: Terminates the iteration sequence immediately.

\`\`\`csharp
public IEnumerable<int> GenerateEvenNumbers(int max)
{
    for (int i = 0; i <= max; i += 2)
    {
        yield return i; // Emits item on-demand without buffering the full list in RAM
    }
}
\`\`\`

#### Benefits:
- **Memory Efficiency:** Avoids allocating temporary intermediate lists for large datasets.
- **Immediate streaming:** Processing begins as soon as the first item is yielded.`,
    answerContent_fa: `### کاربرد کلمه کلیدی yield در سی‌شارپ

کلمه کلیدی \`yield\` برای پیاده‌سازی شمارنده‌ها (Iterators) و **ارزیابی تنبل (Deferred Execution)** استفاده می‌شود. با این روش، عناصر کالکشن به صورت تک‌تک و بر اساس تقاضا تولید می‌شوند بدون آنکه کل لیست در حافظه RAM ذخیره شود.

- **\`yield return\`**: در هر مرحله یک آیتم را بازمی‌گرداند.
- **\`yield break\`**: پایان شمارش را اعلام می‌کند.

\`\`\`csharp
public IEnumerable<int> GetNumbers()
{
    yield return 1;
    yield return 2;
    yield return 3;
}
\`\`\``,
  },
  {
    id: "dotnet-junior-q12",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is a Delegate in C#?",
    questionTitle_fa: "مفهوم Delegate چیست؟",
    answerContent: `### Delegates in C#

A **delegate** is a type-safe function pointer in .NET. It holds a reference to one or more methods with a matching signature and return type.

#### Key Features:
1. **Type-Safety:** Enforces that parameters and return types match exactly.
2. **Multicast:** A single delegate instance can point to multiple methods using \`+=\` and \`-=\`.
3. **Foundation for Events & LINQ:** Forms the core mechanism for asynchronous callbacks and event handling.

\`\`\`csharp
// Declaration
public delegate int MathOperation(int a, int b);

// Method matching delegate signature
public int Add(int x, int y) => x + y;

// Usage
MathOperation op = Add;
int result = op(5, 3); // 8
\`\`\``,
    answerContent_fa: `### مفهوم Delegate در سی‌شارپ

دلیگیت (Delegate) در دات‌نت یک **اشاره‌گر نوع‌امن (Type-safe Function Pointer)** به متدها است. با استفاده از دلیگیت می‌توان متدها را به عنوان پارامتر به توابع دیگر پاس داد یا به عنوان Callback ذخیره کرد.

#### ویژگی‌ها:
- امنیت کامل در تطابق نوع ورودی‌ها و خروجی‌ها.
- قابلیت **Multicast** (اتصال همزمان چند متد به یک دلیگیت با \`+=\`).
- زیربنای اصلی رویدادها (Events) و توابع لامبدا در LINQ.`,
  },
  {
    id: "dotnet-junior-q13",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between Action and Func delegates in C#?",
    questionTitle_fa: "تفاوت Action و Func در سی‌شارپ چیست؟",
    answerContent: `### Action vs. Func in C#

Both are built-in generic delegates in the \`System\` namespace:

- **\`Action<T1, T2, ...>\`:** Represents a method that **does not return a value (\`void\`)**.
- **\`Func<T1, T2, ..., TResult>\`:** Represents a method that **returns a value of type \`TResult\`** (the last generic parameter is always the return type).
- **\`Predicate<T>\`:** Built-in delegate returning \`bool\` (equivalent to \`Func<T, bool>\`).

\`\`\`csharp
// Action: takes string, returns void
Action<string> printLog = msg => Console.WriteLine($"LOG: {msg}");
printLog("Server started");

// Func: takes int, int and returns int
Func<int, int, int> multiply = (x, y) => x * y;
int product = multiply(4, 5); // 20
\`\`\``,
    answerContent_fa: `### تفاوت دلیگیت‌های Action و Func

هر دو دلیگیت‌های جنریک آماده در فضای نام \`System\` هستند:

- **\`Action\`**: متدی را نمایندگی می‌کند که **هیچ خروجی ندارد (\`void\`)**. می‌تواند بین ۰ تا ۱۶ پارامتر ورودی بپذیرد.
- **\`Func\`**: متدی را نمایندگی می‌کند که **حتماً یک مقدار خروجی بازمی‌گرداند**. آخرین پارامتر جنریک آن همیشه نوع خروجی (\`TResult\`) است.

\`\`\`csharp
Action<string> logger = message => Console.WriteLine(message);
Func<int, int, bool> isSumEven = (a, b) => (a + b) % 2 == 0;
\`\`\``,
  },
  {
    id: "dotnet-junior-q14",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "Explain Async/Await in simple terms.",
    questionTitle_fa: "مفهوم Async/Await را به زبان ساده توضیح بده.",
    answerContent: `### Async/Await Explained Simply

\`async\` and \`await\` provide non-blocking asynchronous execution for I/O-bound operations (database queries, HTTP requests, file access).

- **Non-blocking:** When a thread reaches an \`await\`, it is released back to the **ThreadPool** to handle other incoming requests instead of sitting idle waiting for network/disk I/O.
- **State Machine:** The C# compiler transforms the async method into a state machine behind the scenes. When the awaited operation completes, a thread resumes execution from where it paused.

\`\`\`csharp
public async Task<string> FetchUserDataAsync(int userId)
{
    // Thread is NOT blocked during network wait
    var json = await _httpClient.GetStringAsync($"https://api.example.com/users/{userId}");
    return json;
}
\`\`\``,
    answerContent_fa: `### توضیح Async/Await به زبان ساده

کلمات کلیدی \`async\` و \`await\` برای اجرای غیرهمزمان و **غیرمسدودکننده (Non-blocking)** در عملیات‌های وابسته به I/O (مانند فراخوانی دیتابیس، خواندن فایل یا ریکوئست‌های شبکه) به کار می‌روند.

- **عدم مسدودسازی ترد:** وقتی اجرای کد به دستور \`await\` می‌رسد، ترد فعلی آزاد شده و به ThreadPool برمی‌گردد تا به سایر ریکوئست‌های وب پاسخ دهد.
- **ماشین وضعیت:** کامپایلر دات‌نت متد را به یک State Machine تبدیل کرده و پس از اتمام عملیات دیتابیس یا شبکه، اجرای کد را از همان نقطه ادامه می‌دهد.`,
  },
  {
    id: "dotnet-junior-q15",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between Task and Thread in C#?",
    questionTitle_fa: "تفاوت Task و Thread چیست؟",
    answerContent: `### Task vs. Thread in C#

| Feature | Thread | Task |
| :--- | :--- | :--- |
| **Abstraction Level** | Low-level OS kernel thread wrapper | Higher-level abstraction representing an asynchronous operation |
| **Creation Cost** | High memory allocation (~1MB stack per thread) and expensive context switching | Lightweight; leverages the managed **ThreadPool** |
| **Return Value** | Cannot easily return values without shared state | Directly returns values via \`Task<TResult>\` |
| **Cancellation & Continuations**| Difficult to coordinate | Native support via \`CancellationToken\`, \`async/await\`, \`ContinueWith\` |

\`\`\`csharp
// Prefer Tasks for modern .NET
await Task.Run(() => ComputeHeavyMath());
\`\`\``,
    answerContent_fa: `### تفاوت Task و Thread

| ویژگی | Thread | Task |
| :--- | :--- | :--- |
| **سطح انتزاع** | سطح پایین و متصل به ترد سیستم‌عامل | سطح بالا و نماینده یک عملیات غیرهمزمان |
| **هزینه ساخت** | سنگین (حدود ۱ مگابایت حافظه اختصاصی به ازای هر ترد) | بسیار سبک؛ استفاده از مکانیزم **ThreadPool** |
| **بازگرداندن مقدار** | دشوار (نیاز به متغیر مشترک و قفل‌گذاری) | بسیار ساده از طریق \`Task<T>\` |
| **پشتیبانی از Async/Await** | خیر | بله، سازگار کامل با سیستم \`async/await\` |`,
  },

  // ── ASP.NET Core & REST API (Q16 - Q30) ─────────────────────────
  {
    id: "dotnet-junior-q16",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is the Request Lifecycle in ASP.NET Core?",
    questionTitle_fa: "چرخه حیات (Lifecycle) یک ریکوئست در ASP.NET Core چگونه است؟",
    answerContent: `### ASP.NET Core Request Pipeline Lifecycle

1. **HTTP Request Arrives:** Web server (Kestrel / IIS) accepts the raw TCP socket and creates an \`HttpContext\`.
2. **Middleware Pipeline:** The request travels sequentially through registered middlewares in \`Program.cs\` (Authentication $\\to$ Routing $\\to$ CORS $\\to$ Authorization $\\to$ Custom Middlewares).
3. **Endpoint Routing:** Matches the request URL and HTTP method to a specific Controller Action or Minimal API endpoint.
4. **Action Filters & Model Binding:** Filters run, input parameters are deserialized and validated (\`ModelState\`).
5. **Action Execution:** Controller/Service business logic executes.
6. **Result Execution:** \`IActionResult\` formats the response (JSON serialization, status codes).
7. **Response Pipeline:** Response travels back through middlewares in reverse order to the client.`,
    answerContent_fa: `### چرخه حیات درخواست (Request Lifecycle) در ASP.NET Core

۱. **دریافت درخواست:** سرور وب (Kestrel) درخواست را دریافت کرده و شیء \`HttpContext\` را می‌سازد.
۲. **پایپ‌لاین میدل‌ویرها:** ریکوئست به ترتیب از میدل‌ویرهای تعریف شده عبور می‌کند (احراز هویت $\\to$ مسیریابی $\\to$ سطوح دسترسی).
۳. **Routing:** آدرس با کنترلر یا Endpoint مربوطه تطبیق داده می‌شود.
۴. **Model Binding & Filters:** داده‌های ورودی بایند و اعتبارسنجی می‌شوند.
۵. **Action Execution:** متد کنترلر و منطق بیزینس اجرا می‌شود.
۶. **Result Execution:** پاسخ خروجی (JSON و کدهای وضعیت) تولید می‌شود.
۷. **بازگشت پاسخ:** خروجی به صورت معکوس از میدل‌ویرها عبور کرده و به کاربر ارسال می‌گردد.`,
  },
  {
    id: "dotnet-junior-q17",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is Middleware in ASP.NET Core and how does it work?",
    questionTitle_fa: "مفهوم Middleware را در ASP.NET Core توضیح بده.",
    answerContent: `### Middleware in ASP.NET Core

Middleware is software assembled into the application pipeline to handle requests and responses. Each component:
- Chooses whether to pass the request to the next component in the pipeline (\`next()\`).
- Can perform work before and after the next component.

\`\`\`csharp
app.Use(async (context, next) =>
{
    // Logic BEFORE next middleware
    Console.WriteLine($"Request: {context.Request.Path}");
    
    await next(); // Call next middleware in pipeline
    
    // Logic AFTER response is generated
    Console.WriteLine($"Response Status: {context.Response.StatusCode}");
});
\`\`\``,
    answerContent_fa: `### مفهوم میدل‌ویر (Middleware)

میدل‌ویرها قطعه کدهایی هستند که به صورت زنجیره‌ای (Pipeline) قرار گرفته و مسئول پردازش درخواست‌های ورودی و پاسخ‌های خروجی می‌باشند. هر میدل‌ویر می‌تواند:
- ریکوئست را پردازش کرده و آن را به میدل‌ویر بعدی تحویل دهد (\`await next()\`).
- قبل و بعد از اجرای میدل‌ویرهای بعدی کد اجرا کند.
- مسیر درخواست را متوقف کرده (Short-circuit) و مستقیماً پاسخ دهد.`,
  },
  {
    id: "dotnet-junior-q18",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is Dependency Injection (DI) and why is it used?",
    questionTitle_fa: "مفهوم Dependency Injection (DI) چیست و چرا استفاده می‌شود؟",
    answerContent: `### Dependency Injection (DI)

Dependency Injection is a design pattern that implements **Inversion of Control (IoC)**, where an object receives its dependencies from an external IoC Container rather than instantiating them directly with \`new\`.

#### Benefits:
- **Decoupling:** Classes depend on interfaces rather than concrete implementations.
- **Testability:** Easy to swap real services with mocks in unit tests.
- **Maintainability:** Service configurations and lifecycles are managed in a single central place.

\`\`\`csharp
public class OrderService
{
    private readonly IPaymentProcessor _paymentProcessor;
    // Injected via Constructor
    public OrderService(IPaymentProcessor paymentProcessor)
    {
        _paymentProcessor = paymentProcessor;
    }
}
\`\`\``,
    answerContent_fa: `### مفهوم Dependency Injection (تزریق وابستگی)

تزریق وابستگی الگویی برای پیاده‌سازی اصل **معکوس‌سازی کنترل (IoC)** است که در آن اشیاء، وابستگی‌های خود را مستقیماً با کلمه کلیدی \`new\` نمی‌سازند، بلکه از طریق سازنده (Constructor) از یک کانتینر مرکزی دریافت می‌کنند.

#### مزایا:
- کاهش وابستگی مستقیم (Loose Coupling).
- تست‌پذیری بالا (امکان پاس دادن Mock در Unit Test).
- مدیریت متمرکز طول عمر اشیاء در کل برنامه.`,
  },
  {
    id: "dotnet-junior-q19",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "Explain the difference between AddTransient, AddScoped, and AddSingleton in ASP.NET Core DI.",
    questionTitle_fa: "تفاوت AddTransient، AddScoped و AddSingleton در تنظیمات DI چیست؟",
    answerContent: `### ASP.NET Core Service Lifetimes

1. **Transient (\`AddTransient\`):**
   - Created **every time** they are requested.
   - Ideal for lightweight, stateless services.

2. **Scoped (\`AddScoped\`):**
   - Created **once per HTTP request** (or per \`IServiceScope\`).
   - Standard for \`DbContext\`, Unit of Work, and per-request state.

3. **Singleton (\`AddSingleton\`):**
   - Created **once on first request** and reused throughout the application lifetime.
   - Ideal for in-memory caches and global configuration.

> **Warning:** Never inject a **Scoped** service into a **Singleton** service (Captive Dependency bug).`,
    answerContent_fa: `### طول عمر سرویس‌ها در تزریق وابستگی

۱. **AddTransient:** به ازای هر بار درخواست (حتی درون یک ریکوئست چند بار)، یک نمونه کاملاً جدید ایجاد می‌شود.
۲. **AddScoped:** به ازای هر درخواست HTTP یک نمونه واحد ساخته می‌شود و در سراسر آن درخواست به اشتراک گذاشته می‌شود (مانند \`DbContext\`).
۳. **AddSingleton:** تنها یک‌بار در کل چرخه حیات برنامه ساخته شده و در تمامی ریکوئست‌ها استفاده می‌گردد (مانند کش In-Memory).`,
  },
  {
    id: "dotnet-junior-q20",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "How does Routing work in ASP.NET Core Web API?",
    questionTitle_fa: "روتینگ (Routing) در Web API چگونه کار می‌کند؟",
    answerContent: `### Routing in ASP.NET Core Web API

Routing matches incoming HTTP request paths to controller action methods or minimal API endpoints.

#### Types of Routing:
1. **Attribute Routing (Recommended for APIs):**
   Uses attributes directly on controllers and actions:
   \`\`\`csharp
   [ApiController]
   [Route("api/[controller]")] // /api/products
   public class ProductsController : ControllerBase
   {
       [HttpGet("{id:int}")] // GET /api/products/42
       public IActionResult GetById(int id) => Ok();
   }
   \`\`\`
2. **Minimal API Routing (.NET 6+):**
   \`\`\`csharp
   app.MapGet("/api/products/{id:int}", (int id) => Results.Ok());
   \`\`\``,
    answerContent_fa: `### مسیریابی (Routing) در Web API

مسیریابی فرآیند تطبیق دادن آدرس URL و متد HTTP با متد کنترلر یا اندپوینت متناظر است.

- **Attribute Routing:** مسیرها با استفاده از اتریبیوت‌هایی مانند \`[Route]\` و \`[HttpGet]\` مستقیماً بالای کنترلرها و متدها تعریف می‌شوند.
- **Route Constraints:** می‌توان نوع داده پارامترها را محدود کرد (مانند \`{id:int}\` یا \`{slug:alpha}\`).`,
  },
  {
    id: "dotnet-junior-q21",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is Model Binding in ASP.NET Core and what are its sources?",
    questionTitle_fa: "مفهوم Model Binding چیست و چه منابعی دارد؟",
    answerContent: `### Model Binding in ASP.NET Core

Model Binding automatically maps data from HTTP requests (Query strings, Route data, Form data, JSON body) into Action method parameters and C# model objects.

#### Binding Source Attributes:
- **\`[FromRoute]\`**: Extracts value from route path (e.g. \`/api/users/{id}\`).
- **\`[FromQuery]\`**: Extracts value from query string parameters (e.g. \`?page=1&size=10\`).
- **\`[FromBody]\`**: Deserializes request body (JSON/XML) into a C# object.
- **\`[FromHeader]\`**: Reads HTTP request headers.
- **\`[FromForm]\`**: Extracts form-data (e.g., file uploads).`,
    answerContent_fa: `### مفهوم Model Binding و منابع آن

مدل بایندینگ مکانیزمی خودکار در ASP.NET Core است که داده‌های ارسالی کلاینت در ریکوئست را به پارامترها و کلاس‌های مدل در سی‌شارپ تبدیل می‌کند.

#### اتریبیوت‌های منبع داده:
- **\`[FromRoute]\`**: خواندن از مسیر URL.
- **\`[FromQuery]\`**: خواندن از Query String (مانند \`?search=dotnet\`).
- **\`[FromBody]\`**: خواندن و Deserialize کردن بدنه جیسون (JSON Body).
- **\`[FromHeader]\`**: خواندن از هدرهای HTTP.
- **\`[FromForm]\`**: خواندن داده‌های فرم و فایل‌های آپلودی.`,
  },
  {
    id: "dotnet-junior-q22",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is the purpose of Data Annotations in C# and ASP.NET Core?",
    questionTitle_fa: "کاربرد Data Annotations چیست؟",
    answerContent: `### Data Annotations

Data Annotations are attributes used in .NET for **model validation**, schema definition, and display formatting.

\`\`\`csharp
public class RegisterUserDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(50, MinimumLength = 3)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Range(18, 100)]
    public int Age { get; set; }
}
\`\`\`

When \`[ApiController]\` is used, invalid models automatically trigger a **400 Bad Request** with validation error details.`,
    answerContent_fa: `### کاربرد Data Annotations

دیتا انوتیشن‌ها اتریبیوت‌هایی هستند که برای **اعتبارسنجی داده‌های ورودی (Validation)**، تنظیمات پایگاه داده در EF Core و قالب‌بندی اطلاعات استفاده می‌شوند (مانند \`[Required]\`، \`[MaxLength]\`، \`[EmailAddress]\` و \`[Range]\`).`,
  },
  {
    id: "dotnet-junior-q23",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is the difference between IActionResult and ActionResult<T> in ASP.NET Core?",
    questionTitle_fa: "تفاوت ActionResult و IActionResult در کنترلرها چیست؟",
    answerContent: `### IActionResult vs ActionResult<T>

- **\`IActionResult\`**:
  - Defines a contract for the result of an action method.
  - Can return any HTTP status code helper (\`Ok()\`, \`NotFound()\`, \`BadRequest()\`).
  - Lacks strong typing for the return payload, limiting Swagger/OpenAPI documentation precision.
- **\`ActionResult<T>\` (.NET Core 2.1+)**:
  - Allows returning either a concrete object (\`T\`) or any \`ActionResult\` (\`NotFound()\`).
  - **Type-safe:** Generates accurate OpenAPI/Swagger documentation schema automatically.

\`\`\`csharp
[HttpGet("{id}")]
public ActionResult<ProductDto> GetProduct(int id)
{
    var product = _service.GetById(id);
    if (product == null) return NotFound();
    return Ok(product); // Strongly typed ProductDto!
}
\`\`\``,
    answerContent_fa: `### تفاوت IActionResult و ActionResult<T>

- **\`IActionResult\`**: اینترفیسی عمومی است که انواع پاسخ‌های HTTP (مانند \`Ok()\`، \`NotFound()\`، \`BadRequest()\`) را بازمی‌گرداند اما نوع دقیق مدل خروجی در امضای متد مشخص نیست.
- **\`ActionResult<T>\`**: هم امکان بازگرداندن کدهای وضعیت و هم نوع داده خروجی مشخص (\`T\`) را فراهم می‌کند. این رویکرد به ابزارهایی مانند Swagger اجازه می‌دهد مستندات دقیق‌تری تولید کنند.`,
  },
  {
    id: "dotnet-junior-q24",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "How do you handle Exceptions globally in ASP.NET Core?",
    questionTitle_fa: "نحوه مدیریت Exceptionها به صورت Global در ASP.NET Core چگونه است؟",
    answerContent: `### Global Exception Handling in ASP.NET Core

#### 1. Modern .NET 8 Approach: \`IExceptionHandler\`
\`\`\`csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context, Exception exception, CancellationToken ct)
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new
        {
            Status = 500,
            Title = "An error occurred",
            Detail = exception.Message
        }, ct);
        return true; // Handled
    }
}
\`\`\`

#### 2. Custom Exception Middleware:
Using a try-catch block wrapping \`await next(context)\` at the start of the pipeline.`,
    answerContent_fa: `### مدیریت سراسری خطاها (Global Exception Handling)

در دات‌نت ۸ روش استاندارد استفاده از اینترفیس **\`IExceptionHandler\`** است. همچنین می‌توان از **میدل‌ویر سفارشی** در ابتدای پایپ‌لاین استفاده کرد که بلوک \`try-catch\` را دور \`await next(context)\` قرار می‌دهد تا هر خطای کنترل‌نشده‌ای را ثبت (Log) کرده و پاسخی استاندارد با فرمت RFC 7807 (ProblemDetails) به کلاینت برگرداند.`,
  },
  {
    id: "dotnet-junior-q25",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What are Filters in ASP.NET Core and what types exist?",
    questionTitle_fa: "فیلترها (Filters) در ASP.NET Core چه هستند و چند نوع دارند؟",
    answerContent: `### Filters in ASP.NET Core

Filters run within the ASP.NET Core action invocation pipeline and allow cross-cutting concerns to be executed.

#### 5 Types of Filters (in execution order):
1. **Authorization Filters:** Determine if a user is authorized for the request.
2. **Resource Filters:** Run after authorization; ideal for caching and short-circuiting.
3. **Action Filters:** Run immediately before and after the action method executes.
4. **Exception Filters:** Apply global exception handling to unhandled exceptions.
5. **Result Filters:** Run before and after the execution of the action result.`,
    answerContent_fa: `### انواع فیلترها در ASP.NET Core

فیلترها کدهایی برای مدیریت دغدغه‌های مشترک (Cross-Cutting Concerns) هستند که در ۵ نوع اجرا می‌شوند:
۱. **Authorization Filters:** بررسی دسترسی کاربر.
۲. **Resource Filters:** مناسب برای کشینگ و متوقف کردن زودهنگام پایپ‌لاین.
۳. **Action Filters:** اجرا دقیقاً قبل و بعد از اجرای متد اکشن.
۴. **Exception Filters:** مدیریت خطاهای هندل‌نشده در سطح کنترلر.
۵. **Result Filters:** اجرا قبل و بعد از تولید خروجی اکشن.`,
  },
  {
    id: "dotnet-junior-q26",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is REST and what are its key architectural constraints?",
    questionTitle_fa: "مفهوم REST چیست و چه اصولی دارد؟",
    answerContent: `### REST (Representational State Transfer)

REST is an architectural style for distributed hypermedia systems based on 6 core constraints:

1. **Client-Server:** Separation of user interface concerns from data storage concerns.
2. **Stateless:** Each request from client to server must contain all information needed to understand the request; no session state on server.
3. **Cacheable:** Responses must implicitly or explicitly define themselves as cacheable or non-cacheable.
4. **Uniform Interface:** Standardized resource identification (URIs), representation manipulation, and self-descriptive messages.
5. **Layered System:** Client cannot ordinarily tell whether it is connected directly to the end server or an intermediary (proxy, gateway).
6. **Code on Demand (Optional):** Servers can temporarily extend client functionality.`,
    answerContent_fa: `### مفهوم معماری REST

معماری REST یک سبک معماری نرم‌افزار برای طراحی وب‌سرویس‌ها است که بر ۶ اصل کلیدی استوار است:
۱. **Client-Server:** تفکیک فرانت‌اند و بک‌اند.
۲. **Stateless (بدون وضعیت):** سرور هیچ اطلاعاتی از وضعیت نشست (Session) کلاینت نگه‌داری نمی‌کند؛ هر درخواست حاوی تمام داده‌های لازم است.
۳. **Cacheable:** قابلیت کش شدن پاسخ‌ها.
۴. **Uniform Interface:** استفاده از URIهای استاندارد و متدهای استاندارد HTTP.
۵. **Layered System:** معماری چندلایه و قابلیت استفاده از Reverse Proxy و Load Balancer.`,
  },
  {
    id: "dotnet-junior-q27",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is the difference between HTTP PUT and PATCH methods?",
    questionTitle_fa: "تفاوت متدهای HTTP به ویژه PUT و PATCH چیست؟",
    answerContent: `### HTTP PUT vs. PATCH

- **PUT (Full Replacement):**
  - Replaces the **entire resource** with the payload provided.
  - **Idempotent:** Making multiple identical PUT requests produces the exact same state.
  - If a field is omitted in the payload, it is typically reset to default/null.

- **PATCH (Partial Update):**
  - Applies a **partial modification** to the resource.
  - Sends only the fields that need to change (e.g. JSON Patch / JsonMergePatch).
  - Typically **not strictly idempotent** (though usually designed to be in practice).`,
    answerContent_fa: `### تفاوت متدهای PUT و PATCH

- **PUT:** برای **جایگزینی کامل** یک موجودیت استفاده می‌شود. تمام فیلدها باید ارسال شوند و متدی **Idempotent** است (تکرار آن نتیجه یکسان دارد).
- **PATCH:** برای **ویرایش جزئی (Partial Update)** استفاده می‌شود و فقط فیلدهایی که تغییر کرده‌اند ارسال می‌گردند.`,
  },
  {
    id: "dotnet-junior-q28",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is the difference between HTTP GET and POST methods?",
    questionTitle_fa: "تفاوت GET و POST چیست؟",
    answerContent: `### HTTP GET vs. POST

| Feature | GET | POST |
| :--- | :--- | :--- |
| **Purpose** | Retrieve data | Create new resource or submit data |
| **Request Body** | No standard payload body | Encapsulated in Request Body |
| **Idempotency** | Yes (safe and idempotent) | No (submitting twice creates two resources) |
| **Caching** | Cacheable by default | Non-cacheable by default |
| **Parameters** | Passed in URL query string | Passed in request body |`,
    answerContent_fa: `### مقایسه متدهای GET و POST

| ویژگی | GET | POST |
| :--- | :--- | :--- |
| **هدف** | دریافت اطلاعات از سرور | ایجاد منبع جدید یا ارسال داده |
| **بدنه درخواست** | ندارد (پارامترها در URL هستند) | داده‌ها در Request Body ارسال می‌شوند |
| **Idempotency** | بله (امن و تکرارپذیر) | خیر (تکرار آن رکورد تکراری ایجاد می‌کند) |
| **کشینگ** | قابل کش شدن | به صورت پیش‌فرض غیرقابل کش |`,
  },
  {
    id: "dotnet-junior-q29",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "Explain common HTTP Status Codes (200, 400, 401, 403, 404, 500).",
    questionTitle_fa: "کدهای وضعیت HTTP (مانند 200, 400, 401, 403, 404, 500) چه معنایی دارند؟",
    answerContent: `### Key HTTP Status Codes

- **200 OK:** Request succeeded.
- **201 Created:** Resource successfully created (typically returned on POST).
- **400 Bad Request:** Malformed syntax or invalid validation data sent by client.
- **401 Unauthorized:** Authentication is required and has failed or not been provided.
- **403 Forbidden:** Authenticated, but user lacks permissions for this resource.
- **404 Not Found:** Requested resource does not exist.
- **500 Internal Server Error:** Unhandled exception occurred on the server.`,
    answerContent_fa: `### کدهای وضعیت پرکاربرد HTTP

- **200 OK:** درخواست با موفقیت انجام شد.
- **201 Created:** منبع جدید با موفقیت ایجاد شد.
- **400 Bad Request:** خطای اعتبارسنجی یا فرمت نامعتبر از سمت کلاینت.
- **401 Unauthorized:** کاربر احراز هویت نشده است (نیاز به لاگین).
- **403 Forbidden:** کاربر لاگین کرده اما اجازه دسترسی به این منبع را ندارد.
- **404 Not Found:** منبع مورد نظر در سرور یافت نشد.
- **500 Internal Server Error:** خطای داخلی و کنترل‌نشده در سرور.`,
  },
  {
    id: "dotnet-junior-q30",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is Idempotency in Web APIs?",
    questionTitle_fa: "مفهوم Idempotency در APIها چیست؟",
    answerContent: `### API Idempotency

An HTTP method is **idempotent** if the side-effect of making $N > 0$ identical requests is the same as making a single request.

- **Idempotent Methods:** \`GET\`, \`PUT\`, \`DELETE\`, \`HEAD\`, \`OPTIONS\`.
- **Non-Idempotent Method:** \`POST\` (calling POST multiple times creates multiple orders/payments).

#### Handling POST Idempotency (e.g. Payments):
Use an **Idempotency Key** header sent by the client. The server caches the key and ignores duplicate payment requests with the same key.`,
    answerContent_fa: `### مفهوم Idempotency (تکرارپذیری بدون تغییر نتیجه)

یک عملیات زمانی **Idempotent** است که چندین بار فراخوانی پیاپی آن با پارامترهای یکسان، همان نتیجه و اثر وضعی یک‌بار اجرا را روی سرور داشته باشد. متدهای \`GET\`، \`PUT\` و \`DELETE\` ذاتاً Idempotent هستند، در حالی که متد \`POST\` چنین نیست.`,
  },

  // ── Database & EF Core (Q31 - Q45) ───────────────────────────────
  {
    id: "dotnet-junior-q31",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is an ORM and what role does Entity Framework Core play?",
    questionTitle_fa: "مفهوم ORM چیست و EF Core چه کاری انجام می‌دهد؟",
    answerContent: `### ORM (Object-Relational Mapping) & EF Core

An **ORM** bridges the gap between object-oriented domain models in code and relational database schemas (tables, columns, foreign keys).

**EF Core** is Microsoft's official, open-source cross-platform ORM for .NET:
- Automatically translates LINQ queries to optimized SQL.
- Tracks changes to entities and generates \`INSERT\`, \`UPDATE\`, and \`DELETE\` SQL statements on \`SaveChangesAsync()\`.
- Manages database schema migrations.`,
    answerContent_fa: `### مفهوم ORM و نقش EF Core

یک **ORM** ابزاری است که بین دنیای شیءگرای کد (کلاس‌ها و اشیاء) و دنیای رابطه‌ای دیتابیس (جداول و ستون‌ها) پلی ارتباطی می‌سازد. **EF Core** کوئری‌های LINQ را به زبان SQL تبدیل کرده و تغییرات اشیاء را ردیابی و در دیتابیس ذخیره می‌کند.`,
  },
  {
    id: "dotnet-junior-q32",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is the difference between Code-First and Database-First approaches in EF Core?",
    questionTitle_fa: "تفاوت Code-First و Database-First در چیست؟",
    answerContent: `### Code-First vs. Database-First in EF Core

- **Code-First (Standard in modern .NET):**
  - You define C# entity classes and \`DbContext\` first.
  - EF Core **Migrations** automatically generate and update the database schema.
  - Better for Agile development and domain modeling.

- **Database-First:**
  - Database schema is created directly in the database (SQL Server, PostgreSQL).
  - Use \`dotnet ef dbcontext scaffold\` to reverse-engineer C# classes from existing tables.
  - Preferred when working with legacy databases.`,
    answerContent_fa: `### مقایسه Code-First و Database-First

- **Code-First:** ابتدا کلاس‌های مدل و C# نوشته شده و دیتابیس از طریق مایگریشن‌های EF Core تولید می‌شود (رویکرد مدرن).
- **Database-First:** ابتدا جداول در دیتابیس ساخته شده و کلاس‌های C# با دستور Scaffold از روی دیتابیس مهندسی معکوس می‌شوند (مناسب سیستم‌های قدیمی).`,
  },
  {
    id: "dotnet-junior-q33",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is the role of DbContext in Entity Framework Core?",
    questionTitle_fa: "مفهوم DbContext چیست؟",
    answerContent: `### DbContext in EF Core

\`DbContext\` is the primary class responsible for interacting with the database. It combines two core patterns:
1. **Repository Pattern:** Exposes \`DbSet<TEntity>\` to query and save instances of entities.
2. **Unit of Work Pattern:** Tracks all entity modifications and commits them inside a single database transaction when \`SaveChangesAsync()\` is called.`,
    answerContent_fa: `### مفهوم DbContext در EF Core

کلاس \`DbContext\` قلب تپنده ارتباط با دیتابیس در EF Core است و ترکیبی از دو الگوی **Repository** (ارائه \`DbSet\` برای موجودیت‌ها) و **Unit of Work** (ردیابی تغییرات و ذخیره یکپارچه در قالب تراکنش با \`SaveChanges\`) می‌باشد.`,
  },
  {
    id: "dotnet-junior-q34",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is the difference between Lazy Loading and Eager Loading?",
    questionTitle_fa: "تفاوت Lazy Loading و Eager Loading چیست؟",
    answerContent: `### Lazy Loading vs. Eager Loading

- **Eager Loading (\`.Include()\`):**
  - Related data is loaded from the database as part of the **initial query** using a SQL \`JOIN\`.
  \`\`\`csharp
  var userWithOrders = await _context.Users.Include(u => u.Orders).ToListAsync();
  \`\`\`
- **Lazy Loading (\`virtual\` navigation properties):**
  - Related data is loaded automatically on-demand when the navigation property is accessed.
  - **Risk:** Leads to the **N+1 Query Problem** if accessed inside loops.`,
    answerContent_fa: `### تفاوت Lazy Loading و Eager Loading

- **Eager Loading:** داده‌های جدول وابسته همزمان با کوئری اصلی و با دستور \`JOIN\` واکشی می‌شوند (\`Include\`).
- **Lazy Loading:** داده‌های وابسته تنها زمانی که به پراپرتی مربوطه دسترسی پیدا کنید از دیتابیس خوانده می‌شوند که می‌تواند منجر به مشکل مخرب **N+1 Query** شود.`,
  },
  {
    id: "dotnet-junior-q35",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What are Migrations in EF Core and how are they used?",
    questionTitle_fa: "مایگریشن (Migration) در EF Core چیست و چه کاربردی دارد؟",
    answerContent: `### EF Core Migrations

Migrations provide a way to incrementally update the database schema to keep it in sync with the application's C# data model while preserving existing data.

#### Common CLI Commands:
\`\`\`bash
# Add a new migration
dotnet ef migrations add AddUserTable

# Apply pending migrations to the database
dotnet ef database update

# Generate idempotent SQL script for production deployment
dotnet ef migrations script
\`\`\``,
    answerContent_fa: `### مایگریشن در EF Core

مایگریشن‌ها روشی ساختاریافته برای اعمال تغییرات کلاس‌های C# روی ساختار دیتابیس هستند بدون آنکه داده‌های موجود در دیتابیس حذف شوند (مانند \`dotnet ef migrations add\` و \`dotnet ef database update\`).`,
  },
  {
    id: "dotnet-junior-q36",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is Change Tracking in EF Core and when should AsNoTracking be used?",
    questionTitle_fa: "مفهوم Tracking در EF Core چیست و چه زمانی از AsNoTracking استفاده می‌شود؟",
    answerContent: `### Change Tracking in EF Core

By default, queries returning entity types are **tracking queries**. \`DbContext\` keeps a snapshot of retrieved entities in memory to detect changes when \`SaveChanges()\` is executed.

#### \`AsNoTracking()\`:
- Tells EF Core **not** to create snapshot copies in memory.
- Significantly improves performance and reduces RAM overhead for **read-only queries**.

\`\`\`csharp
var users = await _context.Users.AsNoTracking().ToListAsync();
\`\`\``,
    answerContent_fa: `### مفهوم Change Tracking و کاربرد AsNoTracking

در EF Core به صورت پیش‌فرض تمام رکوردهای واکشی‌شده ردیابی می‌شوند تا در صورت تغییر پراپرتی‌ها، با دستور \`SaveChanges\` آپدیت شوند. در عملیات‌های فقط-خواندنی (Read-Only) باید از **\`AsNoTracking()\`** استفاده کرد تا از مصرف حافظه و بار اضافی پردازش جلوگیری شود.`,
  },
  {
    id: "dotnet-junior-q37",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is the difference between SQL (Relational) and NoSQL databases?",
    questionTitle_fa: "تفاوت دیتابیس‌های SQL و NoSQL چیست؟",
    answerContent: `### SQL vs. NoSQL Databases

| Feature | SQL (e.g., PostgreSQL, SQL Server) | NoSQL (e.g., MongoDB, Redis) |
| :--- | :--- | :--- |
| **Data Model** | Relational tables, rows, columns | Document, Key-Value, Graph, Columnar |
| **Schema** | Rigid, predefined schema | Flexible, dynamic schema |
| **Scaling** | Vertical scaling primarily (scale-up) | Horizontal scaling (scale-out across nodes) |
| **Transactions** | Strong ACID compliance | BASE / Eventual consistency (usually) |`,
    answerContent_fa: `### مقایسه دیتابیس‌های SQL و NoSQL

- **دیتابیس‌های SQL (رابطه‌ای):** داده‌ها در جداول با اسکیمای صلب ذخیره شده، روابط بین جداول با کلید خارجی تعریف می‌شوند و تضمین‌کننده اصول ACID هستند.
- **دیتابیس‌های NoSQL:** داده‌ها به شکل انعطاف‌پذیر (Document، Key-Value) بدون نیاز به اسکیما ذخیره شده و برای مقیاس‌پذیری افقی (Horizontal Scaling) در داده‌های کلان طراحی شده‌اند.`,
  },
  {
    id: "dotnet-junior-q38",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What are Primary Keys and Foreign Keys in relational databases?",
    questionTitle_fa: "کلید اصلی (Primary Key) و کلید خارجی (Foreign Key) چه نقشی دارند؟",
    answerContent: `### Primary Key vs. Foreign Key

- **Primary Key (PK):** A column (or set of columns) that **uniquely identifies** each row in a table. It cannot contain \`NULL\` values and has an automatic unique clustered index.
- **Foreign Key (FK):** A column in one table that references the **Primary Key** of another table, establishing a relationship and enforcing **referential integrity**.`,
    answerContent_fa: `### کلید اصلی و کلید خارجی در دیتابیس

- **Primary Key (کلید اصلی):** ستونی است که یکتایی هر سطر از جدول را تضمین می‌کند و نمی‌تواند مقدار \`NULL\` بپذیرد.
- **Foreign Key (کلید خارجی):** ستونی است که به کلید اصلی جدول دیگر اشاره دارد و یکپارچگی ارجاعی (Referential Integrity) را برقرار می‌سازد.`,
  },
  {
    id: "dotnet-junior-q39",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "Explain the different types of SQL JOINs (INNER, LEFT, RIGHT, FULL, CROSS).",
    questionTitle_fa: "انواع JOIN در SQL را نام ببر و تفاوتشان را بگو.",
    answerContent: `### SQL JOIN Types

1. **INNER JOIN:** Returns records that have matching values in **both** tables.
2. **LEFT (OUTER) JOIN:** Returns all records from the **left** table, and matching records from the right table (with \`NULL\`s where no match exists).
3. **RIGHT (OUTER) JOIN:** Returns all records from the **right** table, and matched records from the left table.
4. **FULL (OUTER) JOIN:** Returns all records when there is a match in either left or right table.
5. **CROSS JOIN:** Produces a Cartesian product (every row of Table A paired with every row of Table B).`,
    answerContent_fa: `### انواع JOIN در زبان SQL

۱. **INNER JOIN:** فقط رکوردهایی را می‌آورد که در هر دو جدول مقدار متناظر دارند.
۲. **LEFT JOIN:** تمام رکوردهای جدول سمت چپ به علاوه مقادیر متناظر جدول راست (در صورت عدم وجود، \`NULL\`).
۳. **RIGHT JOIN:** تمام رکوردهای جدول راست به همراه متناظرهای جدول چپ.
۴. **FULL JOIN:** تمامی رکوردهای هر دو جدول را با هم ادغام می‌کند.
۵. **CROSS JOIN:** حاصل‌ضرب دکارتی تمامی سطرهای دو جدول.`,
  },
  {
    id: "dotnet-junior-q40",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is a Database Index and why is it used?",
    questionTitle_fa: "Index در دیتابیس چیست و چرا استفاده می‌شود؟",
    answerContent: `### Database Indexing

An index is a data structure (typically a **B-Tree**) that improves the speed of data retrieval operations on a table at the cost of additional storage and slower write operations (\`INSERT\`, \`UPDATE\`, \`DELETE\`).

- **Clustered Index:** Defines the physical sorting order of data rows on disk (1 per table).
- **Non-Clustered Index:** A separate structure pointing back to physical rows (multiple per table).`,
    answerContent_fa: `### ایندکس (Index) در پایگاه داده

ایندکس یک ساختار داده‌ای (معمولاً درخت B-Tree) است که سرعت جستجو و واکشی داده‌ها در کوئری‌ها را به شدت افزایش می‌دهد. در مقابل، حجم دیتابیس را افزایش داده و سرعت عملیات درج و ویرایش (\`INSERT\` و \`UPDATE\`) را به دلیل نیاز به به‌روزرسانی ایندکس کاهش می‌دهد.`,
  },
  {
    id: "dotnet-junior-q41",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is the difference between WHERE and HAVING clauses in SQL?",
    questionTitle_fa: "تفاوت WHERE و HAVING در کوئری‌های SQL چیست؟",
    answerContent: `### WHERE vs. HAVING in SQL

- **\`WHERE\`:**
  - Filters individual rows **before** any aggregation/grouping occurs.
  - Cannot be used with aggregate functions (e.g. \`SUM()\`, \`COUNT()\`).
- **\`HAVING\`:**
  - Filters groups of rows **after** the \`GROUP BY\` aggregation is performed.
  - Used specifically with aggregate functions (\`HAVING COUNT(*) > 5\`).`,
    answerContent_fa: `### تفاوت WHERE و HAVING در SQL

- **\`WHERE\`:** شرط را **قبل از گروه‌بندی** روی تک‌تک سطرها اعمال می‌کند و نمی‌توان توابع تجمعی (مانند \`COUNT\` یا \`SUM\`) را در آن به کار برد.
- **\`HAVING\`:** شرط را **بعد از گروه‌بندی (\`GROUP BY\`)** و روی نتایج تجمعی اعمال می‌کند.`,
  },
  {
    id: "dotnet-junior-q42",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is a Database Transaction and why is it essential?",
    questionTitle_fa: "مفهوم Transaction در دیتابیس چیست؟",
    answerContent: `### Database Transactions

A transaction is a single logical unit of work consisting of one or more database operations. It ensures that either **all** operations succeed (**Commit**) or **none** of them take effect (**Rollback**).

\`\`\`csharp
using var transaction = await _context.Database.BeginTransactionAsync();
try
{
    _context.Accounts.Update(sender);
    _context.Accounts.Update(receiver);
    await _context.SaveChangesAsync();
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
}
\`\`\``,
    answerContent_fa: `### مفهوم تراکنش (Transaction) در دیتابیس

تراکنش یک واحد منطقی کار شامل یک یا چند دستور دیتابیس است که تضمین می‌کند یا **تمام دستورات با موفقیت ثبت شوند (Commit)** یا در صورت بروز کوچک‌ترین خطا، **تمام تغییرات به حالت قبل بازگردند (Rollback)**.`,
  },
  {
    id: "dotnet-junior-q43",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What are the ACID properties in relational databases?",
    questionTitle_fa: "خواص ACID در دیتابیس‌های رابطه‌ای چیست؟",
    answerContent: `### ACID Properties

1. **Atomicity (اتمیک بودن):** All or nothing. If one part of the transaction fails, the entire transaction is rolled back.
2. **Consistency (سازگاری):** The database moves from one valid state to another, maintaining all constraints and rules.
3. **Isolation (انزوا / تفکیک):** Concurrent transactions do not interfere with each other.
4. **Durability (ماندگاری):** Once committed, changes survive even in the event of a system crash or power outage.`,
    answerContent_fa: `### اصول چهارگانه ACID در پایگاه داده

۱. **Atomicity (همه‌یاهیچ):** یا تمام دستورات اجرا می‌شوند یا هیچ‌کدام.
۲. **Consistency (سازگاری):** داده‌ها همواره با تمام قوانین و محدودیت‌های دیتابیس سازگار می‌مانند.
۳. **Isolation (انزوا):** تراکنش‌های همزمان نباید روی کار یکدیگر اثر بگذارند.
۴. **Durability (ماندگاری):** داده‌های ثبت‌شده حتی با خاموش شدن ناگهانی سرور پاک نخواهند شد.`,
  },
  {
    id: "dotnet-junior-q44",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is the difference between DELETE and TRUNCATE in SQL?",
    questionTitle_fa: "تفاوت DELETE و TRUNCATE چیست؟",
    answerContent: `### DELETE vs. TRUNCATE

| Feature | DELETE | TRUNCATE |
| :--- | :--- | :--- |
| **Command Type** | DML (Data Manipulation Language) | DDL (Data Definition Language) |
| **WHERE Clause** | Supported (can delete specific rows) | Not supported (removes all rows) |
| **Speed** | Slower (logs each row deletion individually) | Very fast (deallocates data pages) |
| **Identity Reset** | Does **not** reset identity counter | Resets identity counter back to seed |
| **Triggers** | Fires \`ON DELETE\` triggers | Does **not** fire triggers |`,
    answerContent_fa: `### تفاوت DELETE و TRUNCATE

- **DELETE:** دستوری از نوع DML است، شرط \`WHERE\` می‌پذیرد، تریگرها را فعال می‌کند، سطرها را تک‌تک لاگ می‌کند و شمارنده Identity را ریست نمی‌کند.
- **TRUNCATE:** دستوری از نوع DDL است، کل سطرها را بسیار سریع با آزادسازی صفحات حافظه پاک کرده و شمارنده Identity را ریست می‌کند.`,
  },
  {
    id: "dotnet-junior-q45",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "junior",
    questionTitle: "What is a Stored Procedure and what are its advantages and disadvantages?",
    questionTitle_fa: "Stored Procedure چیست و چه مزیتی دارد؟",
    answerContent: `### Stored Procedures

A Stored Procedure is a prepared SQL code block saved directly inside the database that can be executed repeatedly.

#### Advantages:
- **Precompiled Execution Plan:** Reuses cached execution plans.
- **Network Traffic Reduction:** Sends only the procedure name and parameters instead of long SQL text.
- **Security:** Granular permission grants without granting direct table access.

#### Disadvantages:
- Harder to version control and unit test compared to C# code.
- Vendor lock-in (T-SQL vs PL/SQL).`,
    answerContent_fa: `### پروسیجر ذخیره‌شده (Stored Procedure)

استورد پروسیجر مجموعه‌ای از دستورات SQL ذخیره‌شده در دیتابیس است که یک‌بار کامپایل شده و بارها با ارسال پارامتر اجرا می‌شود.

#### مزایا:
- کاهش ترافیک شبکه، افزایش امنیت و استفاده از Execution Plan کش شده.
#### معایب:
- دشواری در تست واحد، ورژن‌کنترل و وابستگی شدید به نوع دیتابیس.`,
  },

  // ── Git, Linux & Docker (Q46 - Q60) ──────────────────────────────
  {
    id: "dotnet-junior-q46",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is the difference between 'git pull' and 'git fetch'?",
    questionTitle_fa: "تفاوت git pull و git fetch چیست؟",
    answerContent: `### git fetch vs. git pull

- **\`git fetch\`:**
  - Downloads new commits, branches, and tags from the remote repository to your local repository.
  - Does **not** merge changes into your current working branch (safe to run anytime).
- **\`git pull\`:**
  - Executes **\`git fetch\` followed immediately by \`git merge\`** (or \`git rebase\`).
  - Directly updates your local working branch with remote changes.`,
    answerContent_fa: `### تفاوت git pull و git fetch

- **\`git fetch\`**: آخرین کامیت‌ها و برنچ‌ها را از سرور ریموت دریافت می‌کند اما تغییری در کدهای لوکال شما ایجاد نمی‌کند (کاملاً امن).
- **\`git pull\`**: ترکیبی از دو دستور \`git fetch\` و \`git merge\` است که بلافاصله کدهای جدید ریموت را با برنچ جاری ادغام می‌کند.`,
  },
  {
    id: "dotnet-junior-q47",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is a Merge Conflict and how do you resolve it?",
    questionTitle_fa: "مفهوم Merge Conflict چیست و چگونه آن را حل می‌کنی؟",
    answerContent: `### Merge Conflicts in Git

A merge conflict happens when Git cannot automatically resolve differences between two branches (e.g., two developers edited the **same line** of a file differently).

#### Resolution Steps:
1. Open the conflicted file and locate conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`).
2. Choose the correct code version and delete the conflict markers.
3. Stage the resolved files: \`git add <file>\`.
4. Finalize the merge commit: \`git commit\`.`,
    answerContent_fa: `### کانفلیکت در گیت (Merge Conflict)

کانفلیکت زمانی رخ می‌دهد که دو دولوپر یک خط مشترک از یک فایل را تغییر داده باشند و گیت نتواند خودکار آن‌ها را ترکیب کند. برای حل آن، فایل را باز کرده، تغییرات مدنظر را نگه داشته، نشانگرهای \`<<<<<<<\` و \`>>>>>>>\` را پاک کرده و فایل را \`git add\` و سپس \`commit\` می‌کنیم.`,
  },
  {
    id: "dotnet-junior-q48",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is the difference between 'git merge' and 'git rebase'?",
    questionTitle_fa: "دستور git rebase چه تفاوتی با git merge دارد؟",
    answerContent: `### git merge vs. git rebase

- **\`git merge\`:**
  - Creates a new **merge commit** uniting two branch histories.
  - Preserves exact historical timeline and context.
- **\`git rebase\`:**
  - Replays your local commits on top of the target branch's latest commit.
  - Creates a clean, linear project history (rewrites commit hashes).
  - **Rule:** Never rebase public shared branches!`,
    answerContent_fa: `### تفاوت git merge و git rebase

- **\`git merge\`**: تاریخچه هر دو برنچ را بدون تغییر نگه داشته و یک کامیت ادغام (Merge Commit) ایجاد می‌کند.
- **\`git rebase\`**: کامیت‌های برنچ شما را برداشته و بعد از آخرین کامیت برنچ هدف مجدداً اعمال می‌کند تا تاریخچه‌ای کاملاً خطی و تمیز بسازد (هش کامیت‌ها تغییر می‌کند).`,
  },
  {
    id: "dotnet-junior-q49",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "Explain the GitFlow branching strategy.",
    questionTitle_fa: "ساختار GitFlow چیست؟",
    answerContent: `### GitFlow Branching Model

GitFlow is a structured branching model designed for scheduled release management:
- **\`main\` / \`master\`:** Production-ready code only.
- **\`develop\`:** Integration branch for features.
- **\`feature/*\`:** Short-lived branches created from \`develop\` for new tasks.
- **\`release/*\`:** Prepares new production releases (bug fixes and version bumps).
- **\`hotfix/*\`:** Emergency fixes branched directly from \`main\` and merged back to both \`main\` and \`develop\`.`,
    answerContent_fa: `### مدل شاخه‌بندی GitFlow

الگوی گیت‌فلو شامل شاخه‌های استاندارد زیر است:
- **\`main\`**: کدهای پایدار و در حال اجرا در محیط پروداکشن.
- **\`develop\`**: شاخه اصلی توسعه برای ترکیب فیچرهای جدید.
- **\`feature/*\`**: شاخه‌های موقت برای توسعه فیچرهای جدید.
- **\`hotfix/*\`**: شاخه‌های اضطراری برای رفع باگ‌های فوری پروداکشن که مستقیماً از \`main\` منشعب می‌شوند.`,
  },
  {
    id: "dotnet-junior-q50",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "How do you undo or revert a commit in Git?",
    questionTitle_fa: "برای لغو کردن یک کامیت در گیت از چه دستوری استفاده می‌کنی؟",
    answerContent: `### Undoing Commits in Git

1. **\`git revert <commit-hash>\` (Safe for shared/remote branches):**
   - Creates a **new commit** that inverts the changes made by the target commit.
2. **\`git reset --soft HEAD~1\` (Local branches only):**
   - Undoes the commit, keeping changes staged in the working directory.
3. **\`git reset --hard HEAD~1\` (Destructive):**
   - Completely discards the commit and all uncommitted file modifications.`,
    answerContent_fa: `### لغو کامیت در گیت

- **\`git revert <hash>\`**: یک کامیت جدید می‌سازد که تغییرات کامیت قبلی را خنثی می‌کند (ایمن برای برنچ‌های اشتراکی و سرور).
- **\`git reset --soft HEAD~1\`**: کامیت را لغو می‌کند اما تغییرات کد را در حالت Staged نگه می‌دارد.
- **\`git reset --hard HEAD~1\`**: کامیت و تمامی تغییرات فایل‌ها را کلاً حذف می‌کند.`,
  },
  {
    id: "dotnet-junior-q51",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What do 'ls', 'cd', and 'grep' commands do in Linux?",
    questionTitle_fa: "دستور ls و cd و grep در لینوکس چه کار می‌کنند؟",
    answerContent: `### Basic Linux Commands

- **\`ls\` (List):** Lists directory contents (\`ls -la\` shows hidden files and permissions).
- **\`cd\` (Change Directory):** Navigates filesystem directories (\`cd /var/log\`, \`cd ..\`).
- **\`grep\` (Global Regular Expression Print):** Searches text patterns inside files or command output (\`cat app.log | grep "ERROR"\`).`,
    answerContent_fa: `### دستورات پایه لینوکس

- **\`ls\`**: نمایش فایل‌ها و فولدرهای دایرکتوری جاری (\`ls -la\`).
- **\`cd\`**: جابجایی بین پوشه‌ها در لینوکس.
- **\`grep\`**: جستجوی الگوها و کلمات کلیدی در فایل‌ها یا خروجی دستورات (مانند جستجوی خطا در لاگ‌ها).`,
  },
  {
    id: "dotnet-junior-q52",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is the difference between Absolute and Relative Paths in Linux?",
    questionTitle_fa: "تفاوت مسیر Absolute و Relative در لینوکس چیست؟",
    answerContent: `### Absolute vs. Relative Paths

- **Absolute Path:** Starts from the **root directory (\`/\`)** and provides the complete path regardless of current location (e.g., \`/var/www/app/appsettings.json\`).
- **Relative Path:** Starts from the **current working directory** (e.g., \`./config/appsettings.json\` or \`../parent/file.txt\`).`,
    answerContent_fa: `### مسیر مطلق (Absolute) و نسبی (Relative)

- **مسیر مطلق (Absolute):** از ریشه سیستم‌عامل (\`/\`) شروع می‌شود و در هر جایی آدرس ثابتی دارد (مانند \`/etc/nginx/nginx.conf\`).
- **مسیر نسبی (Relative):** نسبت به پوشه‌ای که هم‌اکنون در آن قرار دارید آدرس‌دهی می‌شود (مانند \`./src/index.ts\`).`,
  },
  {
    id: "dotnet-junior-q53",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "How do Linux File Permissions work (e.g. chmod 777)?",
    questionTitle_fa: "سیستم Permissionها (مانند chmod 777) در لینوکس چگونه کار می‌کند؟",
    answerContent: `### Linux File Permissions (chmod)

Permissions are divided into 3 groups: **User (Owner)**, **Group**, and **Others**.

Each group has 3 permission bits:
- **Read (\`r\`):** Value 4
- **Write (\`w\`):** Value 2
- **Execute (\`x\`):** Value 1

\`chmod 755 app\` $\\to$ User: $4+2+1=7$ (rwx), Group: $4+0+1=5$ (r-x), Others: $4+0+1=5$ (r-x).
> **Security Warning:** \`chmod 777\` grants full read/write/execute rights to everyone and is a dangerous security vulnerability in production.`,
    answerContent_fa: `### سطوح دسترسی فایل‌ها در لینوکس (chmod)

دسترسی‌ها برای سه گروه تعیین می‌شوند: **Owner (مالک)**، **Group (گروه)** و **Others (دیگران)**.
- خواندن (\`r\`): مقدار ۴
- نوشتن (\`w\`): مقدار ۲
- اجرا (\`x\`): مقدار ۱
دستور \`chmod 755\` به مالک تمام دسترسی‌ها (۷) و به بقیه فقط خواندن و اجرا (۵) می‌دهد. دستور \`chmod 777\` به دلیل باز گذاشتن کامل دسترسی خطای امنیتی محسوب می‌شود.`,
  },
  {
    id: "dotnet-junior-q54",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is Docker and what problem does it solve?",
    questionTitle_fa: "داکر (Docker) چیست و چه مشکلی را حل می‌کند؟",
    answerContent: `### Docker & Containerization

Docker packages an application and all its runtime dependencies (OS libraries, .NET runtime, configurations) into a standardized, isolated unit called a **Container**.

#### Solves:
- **"It works on my machine" problem:** Ensures identical behavior across development, staging, and production environments.
- **Fast Startup & Low Overhead:** Shares the host OS kernel rather than virtualizing hardware.`,
    answerContent_fa: `### داکر (Docker) و کانتینرسازی

داکر پلتفرمی برای بسته‌بندی اپلیکیشن به همراه تمامی پیش‌نیازها و پکیج‌های اجرایی در قالب یک واحد ایزوله به نام **کانتینر (Container)** است تا برنامه در تمامی محیط‌های توسعه و سرور پروداکشن دقیقاً به شکلی یکسان اجرا شود.`,
  },
  {
    id: "dotnet-junior-q55",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is the difference between a Docker Image and a Docker Container?",
    questionTitle_fa: "تفاوت Image و Container در داکر چیست؟",
    answerContent: `### Docker Image vs. Container

- **Docker Image:** A read-only, immutable template/blueprint containing application binaries, libraries, and instructions.
- **Docker Container:** A running, runnable instance of an image with a writable container layer on top.`,
    answerContent_fa: `### تفاوت Docker Image و Docker Container

- **Docker Image:** یک قالب فقط-خواندنی (Read-Only) و تغییرناپذیر شامل کد برنامه، پکیج‌ها و تنظیمات است (مشابه کلاس در OOP).
- **Docker Container:** نمونه در حال اجرای یک Image است که دارای لایه خواندن/نوشتن موقت است (مشابه شیء یا Instance در OOP).`,
  },
  {
    id: "dotnet-junior-q56",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is the purpose of a Dockerfile and its common commands?",
    questionTitle_fa: "فایل Dockerfile چه کاربردی دارد؟",
    answerContent: `### Dockerfile Structure

A Dockerfile is a text recipe that defines the steps to assemble a Docker image.

#### Key Instructions:
- **\`FROM\`**: Specifies the base image (e.g. \`mcr.microsoft.com/dotnet/aspnet:8.0\`).
- **\`WORKDIR\`**: Sets working directory.
- **\`COPY\`**: Copies files from host into container.
- **\`RUN\`**: Executes shell commands during build time (e.g. \`dotnet restore\`).
- **\`ENTRYPOINT\` / \`CMD\`**: Configures the executable run when the container starts.`,
    answerContent_fa: `### کاربرد Dockerfile

فایل Dockerfile مجموعه‌ای از دستورات متنی مرحله‌به‌مرحله برای ساخت یک Image است (شامل مشخص کردن ایمیج پایه \`FROM\`، کپی فایل‌ها \`COPY\`، اجرای دستورات \`RUN\` و نقطه شروع اجرای برنامه \`ENTRYPOINT\`).`,
  },
  {
    id: "dotnet-junior-q57",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is docker-compose and why is it used?",
    questionTitle_fa: "دستور docker-compose برای چه کاری استفاده می‌شود؟",
    answerContent: `### Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications using a single YAML file (\`docker-compose.yml\`).

\`\`\`yaml
services:
  api:
    build: .
    ports:
      - "5000:8080"
    depends_on:
      - db
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "YourStrongPassword!"
\`\`\`
Command: \`docker compose up -d\``,
    answerContent_fa: `### کاربرد Docker Compose

داکر کامپوز ابزاری برای تعریف، مدیریت و اجرای همزمان چند کانتینر وابسته به هم (مانند API، دیتابیس PostgreSQL و Redis) از طریق یک فایل کانفیگ \`docker-compose.yml\` با دستور \`docker compose up\` است.`,
  },
  {
    id: "dotnet-junior-q58",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is the difference between Docker Containers and Virtual Machines (VMs)?",
    questionTitle_fa: "تفاوت Docker و Virtual Machine چیست؟",
    answerContent: `### Docker Containers vs. Virtual Machines

| Feature | Virtual Machine (VM) | Docker Container |
| :--- | :--- | :--- |
| **Architecture** | Hypervisor virtualizes full hardware | Container engine virtualizes the **OS kernel** |
| **Guest OS** | Full Guest OS per VM (GBs of storage) | Shares Host OS kernel (MBs of storage) |
| **Startup Time** | Minutes | Milliseconds to seconds |
| **Resource Efficiency**| High memory & CPU footprint | Extremely lightweight and dense |`,
    answerContent_fa: `### تفاوت داکر و ماشین مجازی (VM)

ماشین‌های مجازی سخت‌افزار را شبیه‌سازی کرده و هر کدام به یک سیستم‌عامل کامل (Guest OS) مجزا نیاز دارند که حجم و مصرف رم بالایی دارد. کانتینرهای داکر از هسته سیستم‌عامل میزبان (Host Kernel) استفاده مشترک می‌کنند و بسیار سبک‌تر و سریع‌تر اجرا می‌شوند.`,
  },
  {
    id: "dotnet-junior-q59",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What are Docker Volumes and why are they used?",
    questionTitle_fa: "مفهوم Volume در داکر چیست؟",
    answerContent: `### Docker Volumes

Container filesystems are ephemeral by default (destroyed when the container is deleted). **Volumes** provide persistent storage independent of the container lifecycle.

#### Use Cases:
- Persisting database files (SQL Server / PostgreSQL data).
- Sharing data across multiple containers.`,
    answerContent_fa: `### مفهوم Docker Volume

کانتینرها ذاتا ناپایدار (Ephemeral) هستند و با حذف کانتینر، داده‌های داخل آن از بین می‌روند. **والیوم‌ها (Volumes)** فضایی از دیسک سیستم میزبان را به کانتینر متصل می‌کنند تا داده‌ها (مانند اطلاعات دیتابیس) به صورت دائمی حفظ شوند.`,
  },
  {
    id: "dotnet-junior-q60",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "How does Port Mapping work in Docker?",
    questionTitle_fa: "نحوه مپ کردن پورت‌ها (Port Mapping) در داکر چگونه است؟",
    answerContent: `### Docker Port Mapping

By default, ports exposed inside a container are not accessible from the host machine. Port mapping forwards traffic from a host port to a container port:

\`\`\`bash
docker run -p 8080:80 my-web-app
\`\`\`
- \`8080\`: Port on the **Host machine**.
- \`80\`: Port inside the **Container**.`,
    answerContent_fa: `### مپ کردن پورت‌ها (Port Mapping) در داکر

کانتینرها در شبکه ایزوله خود اجرا می‌شوند. با سوئیچ \`-p host_port:container_port\` ترافیک پورت سیستم میزبان به پورت داخلی کانتینر هدایت می‌شود (مثلاً \`-p 5000:80\`).`,
  },

  // ── Clean Code, SOLID & Testing (Q61 - Q80) ──────────────────────
  {
    id: "dotnet-junior-q61",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the Single Responsibility Principle (SRP) in SOLID?",
    questionTitle_fa: "اصل Single Responsibility (SRP) از اصول SOLID چیست؟",
    answerContent: `### Single Responsibility Principle (SRP)

> *"A class should have one, and only one, reason to change."*

Every class should have a single, tightly-focused responsibility.

\`\`\`csharp
// BAD: Class handles both User business logic AND email sending
public class UserService
{
    public void RegisterUser(User user)
    {
        // save to database...
        // SMTP email sending code...
    }
}

// GOOD: Separate email responsibility into IEmailSender
public class UserService
{
    private readonly IEmailSender _emailSender;
    public UserService(IEmailSender emailSender) => _emailSender = emailSender;
}
\`\`\``,
    answerContent_fa: `### اصل مسئولیت واحد (Single Responsibility Principle)

این اصل بیان می‌کند که **هر کلاس باید فقط و فقط یک دلیل برای تغییر داشته باشد**. به این معنی که یک کلاس نباید همزمان کارهای متفرقه (مثل ثبت در دیتابیس، لاگینگ و ارسال ایمیل) را انجام دهد، بلکه هر وظیفه باید در کلاسی مجزا پیاده شود.`,
  },
  {
    id: "dotnet-junior-q62",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the Open/Closed Principle (OCP) in SOLID?",
    questionTitle_fa: "اصل Open/Closed (OCP) از اصول SOLID چیست؟",
    answerContent: `### Open/Closed Principle (OCP)

> *"Software entities should be open for extension, but closed for modification."*

You should be able to add new functionality without modifying existing, tested code.

\`\`\`csharp
// Using Strategy Pattern for OCP
public interface IDiscountStrategy { decimal ApplyDiscount(decimal total); }

public class VipDiscount : IDiscountStrategy
{
    public decimal ApplyDiscount(decimal total) => total * 0.8m;
}
\`\`\``,
    answerContent_fa: `### اصل باز/بسته (Open/Closed Principle)

کلاس‌ها و ماژول‌ها باید **برای توسعه باز (Open for extension)** و **برای تغییر بسته (Closed for modification)** باشند؛ یعنی برای افزودن یک فیچر جدید نیازی به دستکاری کدهای تست‌شده قبلی نباشد (مثلاً با استفاده از اینترفیس‌ها و پلی‌مورفیسم).`,
  },
  {
    id: "dotnet-junior-q63",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the Liskov Substitution Principle (LSP) in SOLID?",
    questionTitle_fa: "اصل Liskov Substitution (LSP) از اصول SOLID چیست؟",
    answerContent: `### Liskov Substitution Principle (LSP)

> *"Derived classes must be substitutable for their base classes without altering the correctness of the program."*

Classic Violation: A \`Square\` inheriting from \`Rectangle\` where changing \`Width\` unexpectedly changes \`Height\`.`,
    answerContent_fa: `### اصل جایگزینی لیسکوف (LSP)

کلاس‌های فرزند باید بتوانند بدون ایجاد خطا یا تغییر در رفتار مورد انتظار برنامه، جایگزین کلاس والد خود شوند.`,
  },
  {
    id: "dotnet-junior-q64",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the Interface Segregation Principle (ISP) in SOLID?",
    questionTitle_fa: "اصل Interface Segregation (ISP) از اصول SOLID چیست؟",
    answerContent: `### Interface Segregation Principle (ISP)

> *"Clients should not be forced to depend on methods they do not use."*

Prefer small, focused, role-based interfaces over large "fat" interfaces.

\`\`\`csharp
// BAD
public interface IWorker { void Work(); void Eat(); }

// GOOD
public interface IWorkable { void Work(); }
public interface IFeedable { void Eat(); }
\`\`\``,
    answerContent_fa: `### اصل تفکیک اینترفیس‌ها (ISP)

کلاینت‌ها نباید مجبور شوند متدهایی را پیاده‌سازی کنند که به آنها نیازی ندارند. اینترفیس‌های کوچک و تخصصی بسیار بهتر از اینترفیس‌های بزرگ و عمومی هستند.`,
  },
  {
    id: "dotnet-junior-q65",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the Dependency Inversion Principle (DIP) in SOLID?",
    questionTitle_fa: "اصل Dependency Inversion (DIP) از اصول SOLID چیست؟",
    answerContent: `### Dependency Inversion Principle (DIP)

1. High-level modules should not depend on low-level modules. Both should depend on **abstractions** (interfaces).
2. Abstractions should not depend on details. Details should depend on abstractions.`,
    answerContent_fa: `### اصل وارونگی وابستگی (DIP)

ماژول‌های سطح بالا نباید به ماژول‌های سطح پایین وابسته باشند؛ هر دو باید به **انتزاع (اینترفیس)** وابسته باشند و جزئیات نباید نحوه طراحی اینترفیس را تعیین کنند.`,
  },
  {
    id: "dotnet-junior-q66",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What are the core characteristics of 'Clean Code'?",
    questionTitle_fa: "به نظر شما 'Clean Code' چه ویژگی‌هایی دارد؟",
    answerContent: `### Core Characteristics of Clean Code

1. **Readability:** Reads like well-written prose with self-explanatory names.
2. **Simplicity:** Small functions doing one thing well.
3. **Testability:** High unit test coverage with decoupled architecture.
4. **Consistency:** Adheres to established team naming and architectural conventions.`,
    answerContent_fa: `### ویژگی‌های کد تمیز (Clean Code)

کد تمیز خوانا، ساده، دارای نام‌گذاری‌های معنادار، ماژولار و دارای تست واحد است به گونه‌ای که هر توسعه‌دهنده‌ای بتواند به راحتی آن را درک کرده و توسعه دهد.`,
  },
  {
    id: "dotnet-junior-q67",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What are good naming convention practices for variables and methods?",
    questionTitle_fa: "اصول نام‌گذاری مناسب متغیرها و متدها چیست؟",
    answerContent: `### C# Naming Conventions

- **PascalCase:** Classes, Records, Methods, Properties, Public Events (\`CalculateTotal\`, \`UserProfile\`).
- **camelCase:** Local variables, method arguments (\`userId\`, \`itemCount\`).
- **_camelCase:** Private fields (\`_repository\`, \`_logger\`).
- **I-Prefix:** Interfaces (\`IUserRepository\`).
- **Async Suffix:** Asynchronous methods (\`GetOrdersAsync\`).`,
    answerContent_fa: `### اصول نام‌گذاری استاندارد در سی‌شارپ

- متدها، کلاس‌ها و پراپرتی‌ها با **PascalCase** (مانند \`GetUserById\`).
- متغیرهای محلی و پارامترها با **camelCase** (مانند \`orderId\`).
- فیلدهای خصوصی با **_camelCase** (مانند \`_context\`).
- اینترفیس‌ها با پیشوند **I** و متدهای ناهمگام با پسوند **Async**.`,
  },
  {
    id: "dotnet-junior-q68",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "Why should code comments be minimized in clean code?",
    questionTitle_fa: "چرا باید کامنت‌گذاری در کد را به حداقل رساند؟",
    answerContent: `### Minimizing Comments in Clean Code

- **Comments Lie:** As code evolves, comments often become outdated and misleading.
- **Self-Documenting Code:** Express intent through clear method names and small functions instead of explanatory comments.
- **Good Comments:** Explain the **"Why"** (business rationale, external API workarounds), not the "What".`,
    answerContent_fa: `### چرا کامنت‌گذاری بیش از حد ضدالگو است؟

کد باید **خودمستند (Self-Documenting)** باشد. کامنت‌ها با گذر زمان آپدیت نمی‌شوند و گمراه‌کننده خواهند شد. کامنت باید صرفاً چرایی (Why) یک تصمیم بیزینسی را توضیح دهد نه عملکرد بدیهی کد را.`,
  },
  {
    id: "dotnet-junior-q69",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the DRY (Don't Repeat Yourself) principle?",
    questionTitle_fa: "مفهوم DRY (Don't Repeat Yourself) چیست؟",
    answerContent: `### DRY Principle

> *"Every piece of knowledge must have a single, unambiguous representation within a system."*

Avoid code duplication by extracting reusable logic into shared functions, services, or extension methods.`,
    answerContent_fa: `### اصل DRY

این اصل تأکید دارد که از تکرار منطق و کدهای مشابه در بخش‌های مختلف سیستم جلوگیری شده و کدهای مشترک در قالب متدها یا سرویس‌های مستقل تجمیع شوند.`,
  },
  {
    id: "dotnet-junior-q70",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the KISS (Keep It Simple, Stupid) principle?",
    questionTitle_fa: "مفهوم KISS (Keep It Simple, Stupid) چیست؟",
    answerContent: `### KISS Principle

Systems work best when kept simple rather than made complicated. Avoid premature optimization, over-engineering, and unnecessary design patterns where simple code suffices.`,
    answerContent_fa: `### اصل KISS

سادگی را فدای الگوهای پیچیده و پیش‌بینی‌های غیرضروری آینده نکنید. ساده‌ترین راهکاری که مسئله فعلی را حل می‌کند بهترین راهکار است.`,
  },
  {
    id: "dotnet-junior-q71",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is Unit Testing and why is it important?",
    questionTitle_fa: "تست واحد (Unit Testing) چیست؟",
    answerContent: `### Unit Testing

Unit testing is the practice of testing the smallest isolatable piece of code (a single method or class) in complete isolation from external dependencies (databases, network).

#### Benefits:
- Catches bugs early during development.
- Facilitates safe refactoring.
- Acts as living documentation for code behavior.`,
    answerContent_fa: `### تست واحد (Unit Testing)

تست واحد فرآیند اعتبارسنجی عملکرد کوچک‌ترین واحد کد (یک متد یا کلاس) در انزوای کامل از وابستگی‌های خارجی (مانند دیتابیس و وب‌سرویس) است تا صحت کارکرد منطق برنامه تضمین شود.`,
  },
  {
    id: "dotnet-junior-q72",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the difference between Unit Tests and Integration Tests?",
    questionTitle_fa: "تفاوت Unit Test و Integration Test چیست؟",
    answerContent: `### Unit Test vs. Integration Test

- **Unit Test:** Tests individual units in isolation; all dependencies are mocked. Extremely fast (milliseconds).
- **Integration Test:** Tests multiple integrated components working together with real dependencies (real database, real HTTP pipeline). Slower, but tests realistic behavior.`,
    answerContent_fa: `### تفاوت Unit Test و Integration Test

- **Unit Test:** تست یک قطعه کد با Mock کردن تمامی وابستگی‌ها (بسیار سریع).
- **Integration Test:** تست همکاری چندین ماژول با دیتابیس یا وب‌سرور واقعی جهت اطمینان از یکپارچگی سیستم.`,
  },
  {
    id: "dotnet-junior-q73",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the difference between xUnit and NUnit testing frameworks?",
    questionTitle_fa: "فریم‌ورک xUnit چه تفاوتی با NUnit دارد؟",
    answerContent: `### xUnit vs. NUnit

- **xUnit (Standard for modern .NET Core):**
  - Uses \`[Fact]\` (single test) and \`[Theory]\` (parameterized test).
  - Instantiates a new test class instance for **every test method** to guarantee test isolation.
  - Uses constructor and \`Dispose()\` instead of \`[SetUp]\` / \`[TearDown]\`.
- **NUnit:**
  - Uses \`[Test]\` and \`[TestCase]\` with \`[SetUp]\` attributes. Reuses the same class instance by default.`,
    answerContent_fa: `### مقایسه xUnit و NUnit

فریم‌ورک **xUnit** استاندارد پیش‌فرض دات‌نت مدرن است و به ازای هر متد تست یک نمونه جدید از کلاس می‌سازد تا ایزولاسیون کامل تضمین شود و از اتریبیوت‌های \`[Fact]\` و \`[Theory]\` استفاده می‌کند.`,
  },
  {
    id: "dotnet-junior-q74",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is Mocking in Unit Testing?",
    questionTitle_fa: "مفهوم Mocking در تست‌نویسی چیست؟",
    answerContent: `### Mocking in Unit Testing

Mocking is the creation of simulated objects that mimic the behavior of real dependencies (e.g. \`IRepository\`, \`IPaymentGateway\`) so the unit under test can be verified in isolation.`,
    answerContent_fa: `### مفهوم Mocking

ماک کردن به معنی شبیه‌سازی رفتار سرویس‌های خارجی (مانند درگاه پرداخت یا ریپازیتوری دیتابیس) است تا بتوان کلاس مورد نظر را بدون نیاز به زیرساخت واقعی تست کرد.`,
  },
  {
    id: "dotnet-junior-q75",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "How does the Moq library work in C#?",
    questionTitle_fa: "کتابخانه Moq چگونه کار می‌کند؟",
    answerContent: `### Moq Library Usage

\`\`\`csharp
var mockRepo = new Mock<IUserRepository>();

// Setup expected return value
mockRepo.Setup(repo => repo.GetByIdAsync(1))
        .ReturnsAsync(new User { Id = 1, Name = "Sina" });

var service = new UserService(mockRepo.Object);
var user = await service.GetUserAsync(1);

// Verify method was called exactly once
mockRepo.Verify(repo => repo.GetByIdAsync(1), Times.Once);
\`\`\``,
    answerContent_fa: `### نحوه کار با کتابخانه Moq

با استفاده از کلاس \`Mock<T>\` خروجی متدها شبیه‌سازی شده (\`Setup\`) و تعداد فراخوانی متدها بررسی می‌شود (\`Verify\`).`,
  },
  {
    id: "dotnet-junior-q76",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is Test-Driven Development (TDD)?",
    questionTitle_fa: "مفهوم TDD (Test-Driven Development) چیست؟",
    answerContent: `### Test-Driven Development (TDD) Cycle

TDD follows the **Red-Green-Refactor** cycle:
1. **Red:** Write a failing unit test for the desired feature before writing implementation code.
2. **Green:** Write the minimum code necessary to make the test pass.
3. **Refactor:** Clean up and optimize the code while keeping all tests passing.`,
    answerContent_fa: `### چرخه توسعه آزمون‌محور (TDD)

توسعه مبتنی بر چرخه **Red-Green-Refactor**:
۱. نوشتن تستی که در ابتدا شکست می‌خورد (Red).
۲. نوشتن حداقل کد لازم برای پاس شدن تست (Green).
۳. ریفکتور و تمیزکاری کد با اطمینان از سبز ماندن تست‌ها (Refactor).`,
  },
  {
    id: "dotnet-junior-q77",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the Arrange-Act-Assert (AAA) pattern in testing?",
    questionTitle_fa: "الگوی Arrange, Act, Assert در تست چیست؟",
    answerContent: `### AAA (Arrange, Act, Assert) Pattern

Standard structure for unit tests:
1. **Arrange:** Set up test inputs, mock dependencies, and initialize the object.
2. **Act:** Execute the method under test.
3. **Assert:** Verify that the output matches expectations.

\`\`\`csharp
[Fact]
public void Add_TwoPositiveNumbers_ReturnsSum()
{
    // Arrange
    var calc = new Calculator();
    // Act
    var result = calc.Add(2, 3);
    // Assert
    Assert.Equal(5, result);
}
\`\`\``,
    answerContent_fa: `### الگوی ساختاری AAA در تست‌نویسی

- **Arrange:** آماده‌سازی متغیرها، داده‌های تست و ماک‌ها.
- **Act:** اجرای متد مورد آزمایش.
- **Assert:** بررسی و اعتبارسنجی خروجی متد با نتیجه مورد انتظار.`,
  },
  {
    id: "dotnet-junior-q78",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is Code Coverage in testing?",
    questionTitle_fa: "مفهوم Code Coverage چیست؟",
    answerContent: `### Code Coverage

Code coverage is a metric that measures the percentage of source code executed while running automated test suites.
- High coverage ($>80\%$) indicates thorough test suites.
- **Caveat:** High coverage does not guarantee high test quality (assertions can be weak).`,
    answerContent_fa: `### مفهوم Code Coverage

درصدی از خطوط سورس‌کد برنامه است که در هنگام اجرای تست‌های خودکار اجرا می‌شوند و معیاری برای سنجش گستردگی تست‌ها است.`,
  },
  {
    id: "dotnet-junior-q79",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "What is the difference between a Stub and a Mock?",
    questionTitle_fa: "تفاوت Stub و Mock چیست؟",
    answerContent: `### Stub vs. Mock

- **Stub:** A dummy implementation that holds predetermined data to answer calls during tests (state verification).
- **Mock:** An object configured with expectations that verifies whether specific methods were called with specific arguments (behavior verification).`,
    answerContent_fa: `### تفاوت Stub و Mock

- **Stub:** داده‌های ثابتی را برای تست بازمی‌گرداند تا متد اجرا شود.
- **Mock:** علاوه بر بازگرداندن داده، فراخوانی شدن یا نشدن متدها با پارامترهای مشخص را اعتبارسنجی می‌کند.`,
  },
  {
    id: "dotnet-junior-q80",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "junior",
    questionTitle: "Should private methods be unit tested directly?",
    questionTitle_fa: "آیا متدهای Private را باید تست کرد؟",
    answerContent: `### Testing Private Methods

**No, not directly.**
- Private methods are internal implementation details and should be tested indirectly through the **public API** of the class.
- If a private method contains complex logic that feels difficult to test, it is a code smell indicating it should be extracted into its own separate service class.`,
    answerContent_fa: `### آیا متدهای Private مستقیماً تست می‌شوند؟

خیر، متدهای خصوصی جزئیات پیاده‌سازی هستند و باید به صورت غیرمستقیم از طریق متدهای عمومی (Public) تست شوند. اگر منطق متد خصوصی بسیار پیچیده است، باید در کلاسی مجزا استخراج شود.`,
  },

  // ── General Concepts & C# Tools (Q81 - Q100) ────────────────────
  {
    id: "dotnet-junior-q81",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "junior",
    questionTitle: "What is JSON format and how does it compare to XML?",
    questionTitle_fa: "فرمت JSON چیست و چه تفاوتی با XML دارد؟",
    answerContent: `### JSON vs. XML

- **JSON (JavaScript Object Notation):** Lightweight, human-readable data format based on key-value pairs and arrays. Dominant standard for REST APIs.
- **XML:** Verbose tag-based format supporting schemas (XSD) and namespaces (used in SOAP).`,
    answerContent_fa: `### مقایسه JSON و XML

فرمت **JSON** ساختاری سبک و خوانا بر پایه کلید/مقدار است که امروزه استاندارد اصلی وب APIها می‌باشد، در حالی که **XML** ساختاری تگ‌محور و سنگین‌تر دارد.`,
  },
  {
    id: "dotnet-junior-q82",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "What is Swagger / OpenAPI and why is it useful?",
    questionTitle_fa: "ابزار Swagger به چه دردی می‌خورد؟",
    answerContent: `### Swagger & OpenAPI

Swagger (OpenAPI) provides automated documentation and an interactive browser UI for Web APIs. It allows developers and frontend teams to explore endpoints, schemas, and test API calls directly in the browser.`,
    answerContent_fa: `### کاربرد Swagger (OpenAPI)

سواگر ابزاری برای تولید خودکار مستندات و رابط گرافیکی تعاملی جهت مشاهده و تست آنلاین اندپوینت‌های API در مرورگر است.`,
  },
  {
    id: "dotnet-junior-q83",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "junior",
    questionTitle: "How do you use Postman for API testing?",
    questionTitle_fa: "چگونه از Postman برای تست API استفاده می‌کنی؟",
    answerContent: `### Postman for API Testing

Postman allows developers to craft HTTP requests, inspect headers/payloads, manage environment variables (Dev/Staging URLs), and create automated test assertion scripts.`,
    answerContent_fa: `### تست API با ابزار Postman

پست‌من ابزاری برای ارسال درخواست‌های HTTP، ارسال هدر و توکن احراز هویت، مدیریت متغیرهای محیطی و نوشتن اسکریپت‌های تست خودکار است.`,
  },
  {
    id: "dotnet-junior-q84",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "junior",
    questionTitle: "What layers comprise an N-Tier / 3-Tier Architecture?",
    questionTitle_fa: "معماری سه‌لایه (N-Tier) شامل چه لایه‌هایی است؟",
    answerContent: `### 3-Tier Architecture Layers

1. **Presentation Layer (UI / API):** Handles user interactions and HTTP controllers.
2. **Business Logic Layer (BLL / Service):** Enforces domain validation and business workflows.
3. **Data Access Layer (DAL / Repository):** Manages database operations and queries.`,
    answerContent_fa: `### لایه‌های معماری سه‌لایه

۱. **Presentation Layer:** لایه نمایش و کنترلرها.
۲. **Business Logic Layer (BLL):** لایه منطق بیزینس و محاسبات.
۳. **Data Access Layer (DAL):** لایه دسترسی به دیتابیس و ریپازیتوری‌ها.`,
  },
  {
    id: "dotnet-junior-q85",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "junior",
    questionTitle: "What is a DTO (Data Transfer Object) and why do we use it?",
    questionTitle_fa: "مفهوم DTO (Data Transfer Object) چیست و چرا از آن استفاده می‌کنیم؟",
    answerContent: `### Data Transfer Object (DTO)

A DTO is an object designed solely to carry data between processes or API boundaries without containing business logic.

#### Why Use DTOs?
- Prevents **Over-Posting** security vulnerabilities.
- Hides internal database schema models from API consumers.
- Optimizes payload size by returning only necessary fields.`,
    answerContent_fa: `### مفهوم DTO و دلایل استفاده از آن

کلاس DTO شیئی صرفاً حامل داده است که برای انتقال اطلاعات بین لایه‌ها و API استفاده می‌شود تا از افشای ساختار جداول دیتابیس و حملات Over-Posting جلوگیری کند.`,
  },
  {
    id: "dotnet-junior-q86",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "junior",
    questionTitle: "What is AutoMapper and what is its role?",
    questionTitle_fa: "کتابخانه AutoMapper چیست و چه کاربردی دارد؟",
    answerContent: `### AutoMapper

AutoMapper is an object-to-object mapping library that automates transforming entities into DTOs based on convention-based matching. (Alternative: Manual mapping / Mapster).`,
    answerContent_fa: `### کاربرد AutoMapper

کتابخانه‌ای است که تبدیل خودکار موجودیت‌های دیتابیس به DTOها را بر اساس تشابه نام پراپرتی‌ها انجام می‌دهد تا از نوشتن کدهای تکراری جلوگیری شود.`,
  },
  {
    id: "dotnet-junior-q87",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "junior",
    questionTitle: "How do you implement Pagination in a Web API?",
    questionTitle_fa: "نحوه پیاده‌سازی Pagination (صفحه‌بندی) در یک API چگونه است؟",
    answerContent: `### Pagination in Web APIs

#### Offset-based Pagination:
\`\`\`csharp
public async Task<PagedResult<ProductDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10)
{
    var query = _context.Products.AsNoTracking();
    var totalCount = await query.CountAsync();
    var items = await query
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PagedResult<ProductDto>(items, totalCount, pageNumber, pageSize);
}
\`\`\``,
    answerContent_fa: `### نحوه پیاده‌سازی صفحه‌بندی (Pagination)

با دریافت پارامترهای شماره صفحه (\`pageNumber\`) و تعداد سطر (\`pageSize\`) و استفاده از متدهای \`Skip\` و \`Take\` در LINQ اطلاعات به صورت تکه‌ای واکشی می‌شوند.`,
  },
  {
    id: "dotnet-junior-q88",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "junior",
    questionTitle: "What is the Agile Methodology in software development?",
    questionTitle_fa: "متدولوژی Agile چیست؟",
    answerContent: `### Agile Methodology

Agile is an iterative, incremental approach to software development focused on collaboration, customer feedback, rapid delivery of working software, and adapting to change.`,
    answerContent_fa: `### متدولوژی چابک (Agile)

رویکردی تکرارپذیر و تدریجی در توسعه نرم‌افزار که بر تحویل سریع نرم‌افزار کاربردی، انعطاف در برابر تغییرات و تعامل مستمر با مشتری تمرکز دارد.`,
  },
  {
    id: "dotnet-junior-q89",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "junior",
    questionTitle: "How does the Scrum Framework operate?",
    questionTitle_fa: "چارچوب Scrum چگونه کار می‌کند؟",
    answerContent: `### Scrum Framework

Scrum organizes development into fixed time-boxes called **Sprints** (typically 2 weeks).
- **Roles:** Product Owner, Scrum Master, Developers.
- **Events:** Sprint Planning, Daily Standup, Sprint Review, Sprint Retrospective.`,
    answerContent_fa: `### چارچوب اسکرام (Scrum)

فریم‌ورکی از متدولوژی اجایل که کارها را در بازه‌های زمانی مشخص به نام **اسپرینت (Sprint)** تقسیم کرده و شامل جلسات برنامه‌ریزی، دیلی استندآپ و رترواسپکتیو است.`,
  },
  {
    id: "dotnet-junior-q90",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "junior",
    questionTitle: "What is the difference between Product Backlog and Sprint Backlog in Scrum?",
    questionTitle_fa: "تفاوت Sprint و Backlog در اسکرام چیست؟",
    answerContent: `### Product Backlog vs. Sprint Backlog

- **Product Backlog:** Prioritized master list of all features, requirements, and fixes managed by the Product Owner.
- **Sprint Backlog:** The subset of product backlog items selected by the team to complete during the current sprint.`,
    answerContent_fa: `### تفاوت Product Backlog و Sprint Backlog

- **Product Backlog:** لیست کلیه نیازمندی‌ها و فیچرهای محصول که توسط مالک محصول (PO) اولویت‌بندی می‌شود.
- **Sprint Backlog:** تسک‌های انتخاب‌شده برای انجام در طول یک اسپرینت جاری.`,
  },
  {
    id: "dotnet-junior-q91",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "junior",
    questionTitle: "What is the Software Development Life Cycle (SDLC)?",
    questionTitle_fa: "چرخه SDLC (Software Development Life Cycle) چیست؟",
    answerContent: `### SDLC Phases

1. Requirements Gathering & Analysis
2. System Design & Architecture
3. Implementation / Coding
4. Testing & Quality Assurance
5. Deployment & Release
6. Maintenance & Monitoring`,
    answerContent_fa: `### مراحل چرخه حیات توسعه نرم‌افزار (SDLC)

تحلیل نیازمندی‌ها $\\to$ طراحی معماری $\\to$ کدنویسی $\\to$ تست و تضمین کیفیت $\\to$ دیپلوی در سرور $\\to$ پشتیبانی و مانیتورینگ.`,
  },
  {
    id: "dotnet-junior-q92",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "junior",
    questionTitle: "What is CI/CD (Continuous Integration & Continuous Delivery)?",
    questionTitle_fa: "مفهوم CI/CD چیست؟",
    answerContent: `### CI/CD Pipeline

- **Continuous Integration (CI):** Automating code merging, building, and running unit tests on every commit.
- **Continuous Delivery / Deployment (CD):** Automating testing, artifact packaging, and automated deployment to staging and production environments.`,
    answerContent_fa: `### مفهوم CI/CD

- **CI (یکپارچه‌سازی مداوم):** بیلد خودکار و اجرای تست‌ها با هر کامیت در گیت.
- **CD (تحویل/دیپلوی مداوم):** انتشار و دیپلوی خودکار کدهای تاییدشده روی سرور.`,
  },
  {
    id: "dotnet-junior-q93",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "junior",
    questionTitle: "How do you troubleshoot and debug an unknown bug?",
    questionTitle_fa: "یک باگ ناشناخته را چگونه دیباگ می‌کنی؟",
    answerContent: `### Systematic Debugging Process

1. **Reproduce:** Create reliable reproduction steps locally.
2. **Examine Logs & Stack Traces:** Inspect structured logs and correlation IDs.
3. **Isolate:** Use breakpoints and binary search to isolate the offending method.
4. **Fix & Test:** Implement the fix and write a regression unit test.`,
    answerContent_fa: `### رویکرد سیستماتیک در رفع باگ

۱. بازتولید باگ در محیط لوکال.
۲. بررسی دقیق لاگ‌ها و Stack Trace خطا.
۳. پیدا کردن ریشه مشکل با Breakpoint.
۴. نوشتن تست واحد برای جلوگیری از تکرار باگ در آینده (Regression Test).`,
  },
  {
    id: "dotnet-junior-q94",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between string and StringBuilder in C#?",
    questionTitle_fa: "تفاوت string و StringBuilder در سی‌شارپ چیست؟",
    answerContent: `### string vs. StringBuilder

- **\`string\`:** **Immutable** (cannot be changed after creation). Modifying strings allocates a new object in memory each time.
- **\`StringBuilder\`:** **Mutable** buffer. Ideal for repeated string concatenations in loops to avoid GC memory pressure.`,
    answerContent_fa: `### تفاوت string و StringBuilder

- **\`string\`:** تغییرناپذیر (Immutable) است و هر الحاق رشته‌ای شیء جدیدی در حافظه می‌سازد.
- **\`StringBuilder\`:** بافری تغییرپذیر (Mutable) است و برای الحاق‌های متوالی در حلقه‌ها جهت کاهش مصرف رم به کار می‌رود.`,
  },
  {
    id: "dotnet-junior-q95",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is LINQ (Language Integrated Query) in C#?",
    questionTitle_fa: "مفهوم LINQ چیست؟",
    answerContent: `### LINQ (Language Integrated Query)

LINQ introduces native querying capabilities to C# for collections, XML, and databases with compile-time type safety and IntelliSense support.`,
    answerContent_fa: `### مفهوم LINQ در سی‌شارپ

مجموعه‌ای از قابلیت‌های یکپارچه در سی‌شارپ برای کوئری زدن به کالکشن‌ها، دیتابیس و داده‌ها با امنیت نوع داده در زمان کامپایل (Type Safety).`,
  },
  {
    id: "dotnet-junior-q96",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between First() and FirstOrDefault() in LINQ?",
    questionTitle_fa: "تفاوت First و FirstOrDefault در LINQ چیست؟",
    answerContent: `### First vs. FirstOrDefault

- **\`First()\`:** Returns the first element matching condition; throws \`InvalidOperationException\` if collection is empty.
- **\`FirstOrDefault()\`:** Returns the first element; returns default value (\`null\` or \`0\`) if no element is found.`,
    answerContent_fa: `### تفاوت First و FirstOrDefault

- **\`First\`:** اولین عنصر را برمی‌گرداند و در صورت خالی بودن خطا (\`Exception\`) پرتاب می‌کند.
- **\`FirstOrDefault\`:** در صورت پیدا نشدن عنصر، مقدار پیش‌فرض (\`null\` یا \`0\`) را برمی‌گرداند.`,
  },
  {
    id: "dotnet-junior-q97",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between Single() and SingleOrDefault() in LINQ?",
    questionTitle_fa: "تفاوت Single و SingleOrDefault چیست؟",
    answerContent: `### Single vs. SingleOrDefault

- **\`Single()\`:** Expects **exactly one** matching element; throws exception if 0 or $>1$ elements exist.
- **\`SingleOrDefault()\`:** Expects **0 or 1** element; throws exception if more than one matching element exists.`,
    answerContent_fa: `### تفاوت Single و SingleOrDefault

- **\`Single\`:** انتظار دقیقاً یک رکورد را دارد؛ اگر ۰ یا بیش از ۱ رکورد باشد خطا می‌دهد.
- **\`SingleOrDefault\`:** در صورت عدم وجود رکورد \`null\` می‌دهد اما اگر بیش از ۱ رکورد پیدا شود خطا پرتاب می‌کند.`,
  },
  {
    id: "dotnet-junior-q98",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the performance difference between Any() and Count() in collections?",
    questionTitle_fa: "تفاوت متدهای Any و Count در ارزیابی کالکشن‌ها چیست؟",
    answerContent: `### Any() vs. Count() > 0

- **\`Any()\`:** Stops as soon as the **first matching element** is found ($O(1)$ efficiency). In SQL, translates to fast \`EXISTS()\`.
- **\`Count() > 0\`:** Enumerates the **entire collection** or counts all rows in the table ($O(N)$ efficiency).`,
    answerContent_fa: `### تفاوت عملکرد Any() و Count()

- **\`Any()\`:** به محض پیدا کردن اولین رکورد متوقف می‌شود (ترجمه به \`EXISTS\` در SQL و کارایی $O(1)$).
- **\`Count() > 0\`:** کل کالکشن را تا انتها می‌شمارد که در جداول بزرگ بسیار کندتر است.`,
  },
  {
    id: "dotnet-junior-q99",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between 'var' and 'dynamic' in C#?",
    questionTitle_fa: "تفاوت var و dynamic چیست؟",
    answerContent: `### var vs. dynamic

- **\`var\`:** **Statically typed at compile time** by the compiler based on the assigned value. Has full IntelliSense and type checking.
- **\`dynamic\`:** **Resolved at runtime** via the Dynamic Language Runtime (DLR). Bypasses compile-time checking.`,
    answerContent_fa: `### تفاوت var و dynamic

- **\`var\`:** نوع داده در زمان کامپایل به صورت خودکار و دقیق مشخص می‌شود (Type-Safe).
- **\`dynamic\`:** نوع داده و بررسی متدها در زمان اجرا (Runtime) توسط DLR انجام شده و خطاهای تایپی در کامپایل مشخص نمی‌شوند.`,
  },
  {
    id: "dotnet-junior-q100",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "junior",
    questionTitle: "What is the difference between Array and List<T> in C#?",
    questionTitle_fa: "تفاوت Array و List در سی‌شارپ چیست؟",
    answerContent: `### Array vs. List<T>

- **Array (\`T[]\`):** Fixed-size, contiguous memory allocation. Fast direct indexed access, but cannot resize without reallocation.
- **\`List<T>\`:** Dynamic-size collection backed by an internal array that automatically doubles capacity when full.`,
    answerContent_fa: `### تفاوت Array و List<T>

- **آرایه (\`Array\`):** دارای طول ثابت است و تغییر اندازه ندارد.
- **\`List<T>\`:** داینامیک است و با پر شدن ظرفیت، خودکار آرایه داخلی خود را دو برابر می‌کند.`,
  },
];
