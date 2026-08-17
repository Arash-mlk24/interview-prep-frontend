import { RoadmapTopic } from "../../../models";

export const securityJwtBearerClaimsIdentityTopic: RoadmapTopic = {
  id: "topic-dotnet-security-jwt-bearer-claims-identity",
  stepId: "step-mid-security-auth",
  slug: "security-jwt-bearer-claims-identity",
  order: 1,
  title: "JWT Authentication & Claims-Based Identity",
  title_fa: "احراز هویت با JWT Bearer و هویت مبتنی بر Claimها (ClaimsPrincipal)",
  summary:
    "Master stateless JWT token creation, symmetric/asymmetric validation parameters, token expiration, refresh token lifecycle, and ClaimsPrincipal.",
  summary_fa:
    "تسلط بر ساخت توکن‌های امضاشده JWT، اعتبارسنجی با کلید متقارن و نامتقارن، چرخه حیات Refresh Token و استخراج اطلاعات با ClaimsPrincipal.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. Anatomy of a JSON Web Token (JWT)

A JWT is composed of three Base64Url-encoded sections:
\`Header.Payload.Signature\`

- **Header**: Signing algorithm (e.g. \`HS256\` or \`RS256\`) and token type (\`JWT\`).
- **Payload**: Claims (e.g. \`sub\`, \`email\`, \`roles\`, \`exp\`, \`iss\`, \`aud\`).
- **Signature**: HMAC or RSA signature over \`Header + Payload\` with a secret key.

---

## 2. Configuring JWT Bearer in ASP.NET Core

\`\`\`csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30) // Reduce default 5-min clock skew
        };
    });
\`\`\`

---

## 3. Refresh Token Pattern for Secure Sessions

Because access tokens should be short-lived (e.g., 15 minutes), long-lived **Refresh Tokens** stored securely in database / HTTP-only cookies allow users to refresh expired tokens without re-entering credentials.`,
  content_fa: `## ۱. کالبدشکافی ساختار JSON Web Token (JWT)

یک توکن JWT از سه بخش مجزا تشکیل شده است:
\`Header.Payload.Signature\`

- **Header**: الگوریتم رمزنگاری و امضا (مانند HS256 یا RS256).
- **Payload**: کلیم‌ها و اطلاعات کاربر (مانند شناسه کاربر، ایمیل، نقش‌ها و زمان انقضا).
- **Signature**: امضای دیجیتال برای اثبات عدم دستکاری محتوا.

---

## ۲. پیکربندی JWT Bearer در ASP.NET Core

پیکربندی استانداردهای اعتبارسنجی توکن شامل بررسی صادرکننده (Issuer)، مخاطب (Audience)، کلید امضا و زمان انقضا.

---

## ۳. الگوی Refresh Token برای نشست‌های امن

توکن‌های دسترسی (Access Token) باید طول عمر کوتاهی (مثلاً ۱۵ دقیقه) داشته باشند. برای حفظ لاگین کاربر از توکن‌های یکبارمصرف Refresh Token ذخیره‌شده در دیتابیس یا کوکی‌های امن HttpOnly استفاده می‌شود.`,
};
