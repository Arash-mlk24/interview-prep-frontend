import { Stack } from "./models";

export const stacks: Stack[] = [
  {
    id: "dotnet",
    name: ".NET & C#",
    name_fa: "دات‌نت و سی‌شارپ",
    slug: "dotnet",
    description:
      "Modern .NET Core, C# language evolution, ASP.NET Core, EF Core, Microservices, and high-throughput backend architecture.",
    description_fa:
      "مفاهیم دات‌نت مدرن، زبان سی‌شارپ، ASP.NET Core، انتیتی فریم‌ورک کور، مایکروسرویس‌ها و معماری بک‌اند با توان پردازشی بالا.",
    icon: "dotnet",
  },
  {
    id: "react",
    name: "React & Next.js",
    name_fa: "ری‌اکت و نکست‌جی‌اس",
    slug: "react",
    description:
      "Core React mental models, concurrent rendering, modern hooks, Server Components, SSR/SSG, and web performance optimization.",
    description_fa:
      "مدل ذهنی ری‌اکت، رندرینگ همروند، هوک‌های مدرن، کامپوننت‌های سمت سرور (RSC)، رندر سرور/استاتیک و بهینه‌سازی سرعت فرانت‌اند.",
    icon: "react",
  },
  {
    id: "typescript",
    name: "TypeScript",
    name_fa: "تایپ‌اسکریپت",
    slug: "typescript",
    description:
      "Type gymnastics, conditional types, mapped types, template literals, compiler internals, and enterprise code safety patterns.",
    description_fa:
      "تایپ‌های شرطی و نگاشت‌شده، تمپلیت لیترال‌ها، سیستم استنتاج، ساختارهای ژنریک پیچیده و الگوهای ایمنی کد در مقیاس سازمانی.",
    icon: "typescript",
  },
  {
    id: "system-design",
    name: "System Design & Distributed Systems",
    name_fa: "طراحی سیستم و معماری سیستم‌های توزیع‌شده",
    slug: "system-design",
    description:
      "High-scale architecture, distributed consensus (Raft/Paxos), database sharding, CAP theorem, event-driven pipelines, and real-world platform case studies.",
    description_fa:
      "معماری سیستم‌های مقیاس‌بزرگ، الگوریتم‌های اجماع توزیع‌شده (Raft/Paxos)، شاردینگ دیتابیس، تئوری CAP، صف‌ها و پایپ‌لاین‌های رویدادمحور، و کیس‌استادی‌های پروداکشن.",
    icon: "system-design",
  },
];
