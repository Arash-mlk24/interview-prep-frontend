import { RoadmapTopic } from "../../../models";

export const microFrontendsFederationTopic: RoadmapTopic = {
  id: "topic-react-micro-frontends",
  stepId: "step-react-enterprise-mfe",
  slug: "micro-frontends-module-federation",
  order: 1,
  title: "Micro-Frontends: Webpack Module Federation, Shared Dependencies & Isolation",
  title_fa: "میکروفرانت‌اندها: معماری Module Federation، مدیریت وابستگی‌های مشترک و ایزولاسیون",
  summary: "Architecting large-scale enterprise web platforms: Host vs Remote containers, dynamic remote loading, singletons (React/Router sharing), and cross-MFE communication buses.",
  summary_fa: "معماری پلتفرم‌های فرانت‌اند سازمانی در مقیاس بزرگ: کانتینرهای Host و Remote، لود داینامیک ماژول‌ها در زمان اجرا، اشتراک وابستگی‌های Singleton و ایزولاسیون خطاهای کلاینت.",
  readingTimeMinutes: 20,
  difficulty: "lead",
  content: `### 1. Webpack Module Federation Architecture

Module Federation enables independent frontend builds to dynamically share components and runtime libraries at runtime without monorepo recompilation:

\`\`\`
[ Host Application (Shell / Navigation) ]
           |
           +---> (Loads at runtime via HTTP) ---> [ Checkout MFE (Remote) ]
           +---> (Loads at runtime via HTTP) ---> [ Product Catalog MFE (Remote) ]
\`\`\`

---

### 2. Configuration & Shared Dependencies (Avoiding Duplicate React Runtimes)

\`\`\`javascript
// webpack.config.js for Remote Container:
new ModuleFederationPlugin({
  name: "checkoutApp",
  filename: "remoteEntry.js",
  exposes: {
    "./CheckoutWidget": "./src/components/CheckoutWidget",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^19.0.0", eager: false },
    "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
  },
});
\`\`\`

---

### 3. Cross-MFE Resilient Communication

1. **Custom Browser Event Bus:** \`window.dispatchEvent(new CustomEvent('cart:item-added', { detail: { id: 10 } }))\`
2. **Error Boundary Isolation:** Wrap every remote container in an independent \`<ErrorBoundary>\` so a crash in the Recommendations MFE never breaks the main checkout flow.`,
  content_fa: `### ۱. معماری Module Federation در میکروفرانت‌اند

به کمک Module Federation در وب‌پک، تیم‌های مختلف می‌توانند بخش‌های مختلف سایت را به صورت مستقل بیلد و دیپلوی کنند؛ در حالی که کانتینر اصلی (Shell) ماژول‌ها را در زمان اجرا به صورت ریموت لود می‌کند.

---

### ۲. اشتراک کتابخانه‌ها به صورت Singleton

برای جلوگیری از دانلود چندباره کتابخانه ری‌اکت و تداخل هوک‌ها، ری‌اکت به عنوان یک پکیج اشتراکی یکتا (\`singleton: true\`) در تنظیمات پیکربندی می‌شود.

---

### ۳. ایزولاسیون خطا با Error Boundaries

هر میکروفرانت‌اند درون یک \`ErrorBoundary\` مستقل قرار می‌گیرد تا خرابی احتمالی در بخش پیشنهادات یا نظرات، عملکرد اصلی سبد خرید کاربر را متوقف نکند.`,
};
