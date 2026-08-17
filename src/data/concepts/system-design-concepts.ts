import { Concept } from "../models";

export const systemDesignConcepts: Concept[] = [
  {
    id: "concept-sys-consistent-hashing",
    stackId: "system-design",
    title: "Consistent Hashing & Virtual Nodes",
    title_fa: "مفهوم هشینگ پایدار و نودهای مجازی",
    content: `### Summary
Consistent Hashing maps both keys and servers to a circular $2^{32}-1$ hash ring. Adding or removing a server relocates only $O(K/N)$ keys on average, avoiding widespread cache stampedes. Virtual nodes ensure uniform key distribution across physical servers.`,
    content_fa: `### خلاصه مفهوم
هشینگ پایدار کلیدها و سرورها را روی یک حلقه فرضی $2^{32}-1$ می‌نشاند. اضافه یا کم شدن سرور فقط $\\frac{K}{N}$ کلیدها را جابجا می‌کند. نودهای مجازی توزیع کاملاً یکنواخت داده‌ها و عدم تمرکز روی یک سرور را تضمین می‌کنند.`,
  },
  {
    id: "concept-sys-cap-pacelc",
    stackId: "system-design",
    title: "CAP vs. PACELC Theorems",
    title_fa: "تئوری‌های بنیادی CAP و PACELC",
    content: `### Summary
CAP forces a choice between Consistency (C) and Availability (A) during network Partitions (P). PACELC extends this: Else (E) during normal operation, trade Latency (L) vs. Consistency (C).`,
    content_fa: `### خلاصه مفهوم
تئوری CAP بیان می‌کند در زمان قطعی شبکه (P) باید بین سازگاری (C) و دسترسی‌پذیری (A) انتخاب کرد. تئوری جامع‌تر PACELC شرایط عادی (E) را نیز پوشش می‌دهد که در آن سیستم بین تاخیر کم (L) و سازگاری داده‌ها (C) مصالحه می‌کند.`,
  },
  {
    id: "concept-sys-saga-orchestration",
    stackId: "system-design",
    title: "Saga Pattern & Compensating Transactions",
    title_fa: "الگوی ساگا و تراکنش‌های جبرانی",
    content: `### Summary
Sagas replace heavy 2PC locks in microservices with a series of local database transactions and compensating actions (refunds, inventory release) upon failure.`,
    content_fa: `### خلاصه مفهوم
الگوی ساگا جایگزین قفل‌های مسدودکننده 2PC در مایکروسرویس‌هاست و با اجرای تراکنش‌های محلی مستقل و اقدامات جبرانی در زمان بروز خطا، پایداری سیستم را تضمین می‌کند.`,
  },
  {
    id: "concept-sys-event-sourcing",
    stackId: "system-design",
    title: "Event Sourcing & CQRS",
    title_fa: "مفاهیم Event Sourcing و تفکیک CQRS",
    content: `### Summary
Stores every change as an immutable domain event in an append-only log. CQRS decouples high-speed command writes from optimized read projection queries.`,
    content_fa: `### خلاصه مفهوم
هر تغییر به جای رونویسی، به عنوان رویداد غیرقابل‌تغییر در دیتابیس ثبت می‌شود. الگوی CQRS مسیر نوشتن فرامین را از پایپ‌لاین‌های بهینه‌شده برای خواندن کاملاً تفکیک می‌کند.`,
  },
];
