import { RoadmapTopic } from "../../../models";

export const mtlsSecretsManagementTopic: RoadmapTopic = {
  id: "topic-dotnet-mtls-secrets-management",
  stepId: "step-security-auth-zerotrust",
  slug: "zero-trust-mtls-secrets-management",
  order: 2,
  title: "Zero-Trust Security: Mutual TLS (mTLS) & HashiCorp Vault / Azure Key Vault",
  title_fa: "امنیت معماری Zero-Trust: رمزنگاری دوطرفه mTLS و مدیریت متمرکز اسرار با Vault و Azure Key Vault",
  summary: "Enforce zero-trust service-to-service communication with mTLS certificates, automatic certificate rotation, and externalized secrets management.",
  summary_fa: "پیاده‌سازی اصل عدم اعتماد پیش‌فرض (Zero Trust) با گواهی‌های رمزنگاری دوطرفه mTLS بین میکروسرویس‌ها، چرخش خودکار گواهی‌ها و مخازن امن کلید.",
  readingTimeMinutes: 22,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **Principles of Zero-Trust Architecture**:
  - "Never trust, always verify" across internal VPC networks.
- **Mutual TLS (mTLS) in .NET**:
  - Certificate validation in Kestrel and \`SocketsHttpHandler\`.
  - Service Mesh offloading (Istio / Linkerd) vs Application-level mTLS.
- **Dynamic Secrets Management**:
  - Dynamic database credentials and auto-rotating secrets via HashiCorp Vault / Azure Key Vault providers in .NET Configuration.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **اصول بنیادین معماری Zero-Trust**:
  - قاعده عدم اعتماد به شبکه داخلی و اعتبارسنجی مداوم تک‌تک درخواست‌های بین‌سرویسی.
- **ارتباطات دوطرفه رمزنگاری‌شده (mTLS)**:
  - اعتبارسنجی گواهی‌های دیجیتال سمت کلاینت و سرور در وب‌سرور Kestrel.
  - مقایسه پیاده‌سازی از طریق Service Mesh (مانند Istio) با پیاده‌سازی مستقیم در کد دات‌نت.
- **مدیریت داینامیک اسرار و کانفیگ‌ها**:
  - دریافت کلیدهای حساس و اعتبارسنجی‌های متغیر دیتابیس با اتصال دات‌نت به HashiCorp Vault و Azure Key Vault.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
