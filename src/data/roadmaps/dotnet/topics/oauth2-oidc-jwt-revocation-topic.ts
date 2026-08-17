import { RoadmapTopic } from "../../../models";

export const oauth2OidcJwtRevocationTopic: RoadmapTopic = {
  id: "topic-dotnet-oauth2-oidc-jwt-revocation",
  stepId: "step-security-auth-zerotrust",
  slug: "scalable-identity-oauth2-oidc-jwt-revocation",
  order: 1,
  title: "Scalable Identity: OAuth 2.0 / OIDC, JWT Revocation Strategies & Keycloak",
  title_fa: "مدیریت هویت در مقیاس بالا: پروتکل‌های OAuth 2.0 و OIDC، استراتژی‌های ابطال توکن JWT و یکپارچگی با Keycloak",
  summary: "Architect stateless yet revocable authentication using asymmetric JWT keys, sliding sessions, distributed token blacklists, and Keycloak/Duende.",
  summary_fa: "معماری احراز هویت توزیع‌شده با کلیدهای نامتقارن (RS256/ECDSA)، ترفندهای ابطال بلادرنگ توکن‌های بی‌حالت با بلک‌لیست در ردیس و سرورهای هویت مدرن.",
  readingTimeMinutes: 24,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **OAuth 2.0 & OpenID Connect Protocols**:
  - Authorization Code Flow with PKCE, Client Credentials for machine-to-machine.
- **Stateless JWT vs. Stateful Revocation**:
  - Why stateless JWTs cannot be revoked natively.
  - Revocation patterns: Short-lived access tokens + Refresh token rotation, Redis token blacklist bloom filters, user versioning/stamp verification.
- **Identity Provider Integration in ASP.NET Core**:
  - Configuring Keycloak / Duende IdentityServer / Microsoft Entra with \`JwtBearerHandler\`.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **پروتکل‌های استانداردی هویت (OAuth 2.0 و OIDC)**:
  - جریان Authorization Code با افزونه امنیتی PKCE و جریان کلاینت کریدنشالز در ارتباطات میکروسرویس‌ها.
- **معضل ابطال توکن‌های JWT (Token Revocation)**:
  - چالش بی‌حالت بودن JWT و روش‌های ابطال فوری (بلک‌لیست توزیع‌شده ردیس با فیلتر بلوم، Security Stamp و توکن‌های کوتاه‌مدت همراه با چرخش Refresh Token).
- **اتصال به سرورهای احراز هویت سازمانی**:
  - پیکربندی Keycloak، Duende IdentityServer و Microsoft Entra در خط لوله ASP.NET Core Authentication.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
