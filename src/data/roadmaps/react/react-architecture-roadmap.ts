import { Roadmap } from "../../models";
import { fiberReconciliationTopic } from "./topics/fiber-reconciliation-topic";
import { concurrentRenderingTopic } from "./topics/concurrent-rendering-topic";
import { rscServerComponentsTopic } from "./topics/rsc-server-components-topic";
import { stateArchitecturesOptimisticTopic } from "./topics/state-architectures-optimistic-topic";
import { microFrontendsFederationTopic } from "./topics/micro-frontends-federation-topic";

export const reactArchitectureRoadmap: Roadmap = {
  id: "roadmap-react-architecture",
  stackId: "react",
  slug: "senior-architecture",
  title: "React Architecture & Performance Engineering",
  title_fa: "معماری پیشرفته ری‌اکت و مهندسی پرفورمنس",
  description: "Master React Fiber internals, double-buffering reconciliation, Concurrent Mode priority lanes, Server Components, modern state architectures, and Micro-Frontends.",
  description_fa: "تسلط عمیق بر هسته React Fiber، دابل بافرینگ، مدهای همزمانی ری‌اکت ۱۸+، معماری RSC، مدیریت وضعیت اتمیک با useOptimistic و میکروفرانت‌اندها.",
  icon: "Web",
  order: 1,
  targetLevel: "Mid to Senior / Lead",
  targetLevel_fa: "سطح میدلول تا سینیور / لید",
  estimatedHours: 65,
  steps: [
    {
      id: "step-react-core-fiber",
      roadmapId: "roadmap-react-architecture",
      slug: "fiber-concurrent-mode",
      order: 1,
      title: "Fiber Reconciler & Concurrent Execution",
      title_fa: "هسته موتور Fiber و اجرای همزمان در ری‌اکت",
      description: "Fiber tree units of work, double-buffering, heuristic diffing, and priority lanes with useTransition.",
      description_fa: "واحدهای کاری فایبر، الگوی دابل بافرینگ، الگوریتم Diffing و خطوط اولویت با useTransition.",
      topics: [fiberReconciliationTopic, concurrentRenderingTopic],
    },
    {
      id: "step-react-state-ssr",
      roadmapId: "roadmap-react-architecture",
      slug: "rsc-streaming-ssr",
      order: 2,
      title: "Server Components & Streaming SSR",
      title_fa: "کامپوننت‌های سمت سرور و رندرینگ جریانی (Streaming SSR)",
      description: "React Server Components, the RSC flight payload, selective hydration, and out-of-order streaming with Suspense.",
      description_fa: "معماری RSC، پروتکل Flight Payload، هایدریشن انتخابی و استریمینگ تدریجی با Suspense.",
      topics: [rscServerComponentsTopic],
    },
    {
      id: "step-react-state-realtime",
      roadmapId: "roadmap-react-architecture",
      slug: "state-architectures-optimistic",
      order: 3,
      title: "State Architecture, Atomic Stores & Optimistic UI",
      title_fa: "معماری وضعیت، استورهای اتمیک و آپتیمیستیک UI",
      description: "Atomic state (Jotai) vs Proxy stores (Zustand), useSyncExternalStore, and instant optimistic mutations with useOptimistic.",
      description_fa: "مقایسه استورهای اتمیک و پراکسی، پیشگیری از Tearing با useSyncExternalStore و آپدیت‌های آنی رابط کاربری.",
      topics: [stateArchitecturesOptimisticTopic],
    },
    {
      id: "step-react-enterprise-mfe",
      roadmapId: "roadmap-react-architecture",
      slug: "micro-frontends-module-federation",
      order: 4,
      title: "Enterprise Micro-Frontends & Module Federation",
      title_fa: "میکروفرانت‌اند سازمانی و Webpack Module Federation",
      description: "Host/Remote containers, runtime dependency singletons, isolated error boundaries, and cross-MFE communication.",
      description_fa: "کانتینرهای Host و Remote، اشتراک کتابخانه‌ها، ایزولاسیون خطا و ارتباط میان میکروفرانت‌اندها.",
      topics: [microFrontendsFederationTopic],
    },
  ],
};
