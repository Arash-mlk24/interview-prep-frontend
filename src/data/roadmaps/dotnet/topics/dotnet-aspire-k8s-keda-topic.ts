import { RoadmapTopic } from "../../../models";

export const dotnetAspireK8sKedaTopic: RoadmapTopic = {
  id: "topic-dotnet-aspire-k8s-keda",
  stepId: "step-observability-cloud-native",
  slug: "cloud-native-dotnet-aspire-k8s-keda",
  order: 2,
  title: "Cloud-Native .NET: .NET Aspire, Minimal Chiseled Docker & Kubernetes KEDA Autoscaling",
  title_fa: "دات‌نت کلودنیتیو: .NET Aspire، کانتینرهای ایمن Chiseled و مقیاس‌پذیری خودکار رویدادمحور با KEDA در کوبرنتیز",
  summary: "Deploy cloud-ready .NET applications with .NET Aspire orchestration, ultra-compact Chiseled containers, and queue-depth autoscaling with KEDA.",
  summary_fa: "توسعه و استقرار سرویس‌های مدرن ابری با پلتفرم ارکستراسیون .NET Aspire، ایمیج‌های امن و فوق‌کم‌حجم Chiseled و مقیاس‌پذیری هوشمند بر اساس طول صف‌ها با KEDA.",
  readingTimeMinutes: 26,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **.NET Aspire Distributed Application Stack**:
  - AppHost orchestration, service discovery, resilient client components, and integrated developer dashboard.
- **Ultra-Lean Containerization**:
  - Multi-stage Docker builds, Alpine vs. Ubuntu Chiseled (non-root, minimal attack surface, sub-100MB images).
- **Kubernetes Production Patterns**:
  - Liveness, Readiness, and Startup probes using ASP.NET Core Health Checks.
  - Autoscaling worker pods based on RabbitMQ/Kafka queue depth with **KEDA (Kubernetes Event-driven Autoscaling)**.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **پلتفرم جامع .NET Aspire**:
  - ارکستراسیون میکروسرویس‌ها با AppHost، کشف خودکار سرویس‌ها (Service Discovery) و داشبورد مانیتورینگ متمرکز.
- **کانتینرسازی بهینه و امن**:
  - بیلد چندمرحله‌ای (Multi-stage Dockerfile)، ایمیج‌های ایزوله و بدون روت Chiseled دات‌نت جهت به حداقل رساندن آسیب‌پذیری‌های امنیتی.
- **استقرار و مقیاس‌پذیری در Kubernetes**:
  - تنظیم پروب‌های سلامت دات‌نت (Liveness/Readiness/Startup).
  - مقیاس‌پذیری خودکار پادهای پردازشگر بر اساس عمق صف‌های پیام (Queue Depth) با استفاده از KEDA.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
