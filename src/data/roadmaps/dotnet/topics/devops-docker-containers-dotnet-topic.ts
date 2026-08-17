import { RoadmapTopic } from "../../../models";

export const devopsDockerContainersDotnetTopic: RoadmapTopic = {
  id: "topic-dotnet-devops-docker-containers-dotnet",
  stepId: "step-mid-diagnostics-docker",
  slug: "devops-docker-containers-dotnet",
  order: 3,
  title: "Dockerizing .NET Applications & Multi-Stage Builds",
  title_fa: "کانتینری‌سازی برنامه‌های دات‌نت با داکر و ساخت چندمرحله‌ای (Multi-Stage Builds)",
  summary:
    "Master production-grade Dockerfile authoring for .NET 8/9, multi-stage build optimization, non-root security users, and container layer caching.",
  summary_fa:
    "تسلط بر ساخت Dockerfileهای استاندارد و کم‌حجم برای دات‌نت ۸، بهینه‌سازی کش لایه‌ها، اجرای امن بدون روت (Non-Root User) و استقرار روی کانتینرها.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. Production Multi-Stage Dockerfile for .NET 8

Multi-stage builds separate the build SDK from the lightweight runtime image:

\`\`\`dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

# Cache restore dependencies layer
COPY ["src/WebApi/WebApi.csproj", "src/WebApi/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
RUN dotnet restore "src/WebApi/WebApi.csproj"

# Build & Publish
COPY . .
WORKDIR "/src/src/WebApi"
RUN dotnet publish "WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final Runtime Image (Small, Fast & Secure)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

# Run as non-root user for container security
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WebApi.dll"]
\`\`\`

---

## 2. Docker Best Practices for .NET

1. **Leverage Docker Layer Caching**: Copy \`.csproj\` files and run \`dotnet restore\` before copying the entire codebase.
2. **Use Alpine / Chiseled Images**: Reduces image size from 250MB+ to under 100MB, minimizing CVE attack surface.
3. **Never Run as Root**: Use \`USER $APP_UID\` built into .NET 8+ base images.`,
  content_fa: `## ۱. ساخت چندمرحله‌ای (Multi-Stage Build) در داکر

استفاده از Multi-Stage Builds به شما اجازه می‌دهد محیط سنگین SDK را فقط برای کامپایل استفاده کرده و در نهایت فقط فایل‌های خروجی DLL را داخل ایمیج سبک و سریع Runtime منتقل کنید:

\`\`\`dockerfile
# مرحله اول: بیلد با SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY ["src/WebApi/WebApi.csproj", "src/WebApi/"]
RUN dotnet restore "src/WebApi/WebApi.csproj"
COPY . .
RUN dotnet publish "src/WebApi/WebApi.csproj" -c Release -o /app/publish

# مرحله نهایی: ایمیج سبک زمان اجرا
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
USER $APP_UID
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WebApi.dll"]
\`\`\`

---

## ۲. استانداردهای امنیتی داکر در دات‌نت

- استفاده از ایمیج‌های Alpine یا Chiseled برای کاهش حجم به زیر ۱۰۰ مگابایت.
- عدم اجرای کانتینر با دسترسی Root و استفاده از کاربر امن \`$APP_UID\` در دات‌نت ۸.`,
};
