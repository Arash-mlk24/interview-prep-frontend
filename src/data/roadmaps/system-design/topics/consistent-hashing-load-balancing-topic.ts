import { RoadmapTopic } from "../../../models";

export const consistentHashingLoadBalancingTopic: RoadmapTopic = {
  id: "topic-sys-consistent-hashing",
  stepId: "step-sys-scalability-traffic",
  slug: "consistent-hashing-load-balancing",
  order: 1,
  title: "Consistent Hashing & High-Availability Load Balancing (L4 vs. L7)",
  title_fa: "هشینگ پایدار (Consistent Hashing) و توزیع بار در لایه‌های L4 و L7",
  summary: "Master hash ring topologies, virtual nodes for uniform distribution, rebalancing with O(K/N) key movements, and L4 (TCP/UDP) vs L7 (HTTP/gRPC) routing architectures.",
  summary_fa: "تسلط بر توپولوژی حلقه هش، نودهای مجازی (Virtual Nodes) جهت توزیع یکنواخت، جابجایی بهینه کلیدها با پیچیدگی O(K/N) و تفاوت مسیریابی در لایه‌های انتقال L4 و اپلیکیشن L7.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. The Problem with Modulo Hashing (\`hash(key) % N\`)

In traditional distributed caching/storage, routing keys via simple modulo hashing (\`index = hash(key) % N\`) causes catastrophic **Cache Stampedes / Storms** whenever a node is added or removed, because almost $100\\%$ of keys are remapped to different servers.

---

### 2. The Consistent Hashing Algorithm & Hash Ring

Consistent hashing maps both **Servers** and **Keys** to a uniform $2^{32}-1$ integer ring:

\`\`\`
Hash Ring Topology (0 to 2^32 - 1):
      [Server A (pos: 100)]
           /         \\
[Key 1 (pos: 250)]     [Server C (pos: 800)]
          |          /
      [Server B (pos: 500)]
\`\`\`

#### Key Lookup Mechanics:
1. Hash the key: \`pos = hash(key)\`.
2. Move **clockwise** along the ring until the first server whose position $\\ge pos$ is encountered.
3. If no server has a position $\\ge pos$, wrap around to the first server at the start of the ring.

#### The Virtual Nodes Technique (V-Nodes):
- **Problem:** Random server hashing can produce non-uniform key clustering (Hotspots).
- **Solution:** Map each physical server to $M$ virtual nodes (e.g., \`ServerA#1\`, \`ServerA#2\`, \`ServerA#100\`) distributed evenly across the ring. This reduces key variance to $< 1\\%$.

---

### 3. Layer 4 vs. Layer 7 Load Balancing

| Metric | Layer 4 (Transport - IP/TCP/UDP) | Layer 7 (Application - HTTP/gRPC/WebSocket) |
| :--- | :--- | :--- |
| **Inspection Depth** | SYN/ACK packets, IP addresses, Ports | HTTP Headers, Cookies, JSON body, URL paths |
| **Throughput & CPU** | Extremely high throughput, minimal CPU | Higher CPU cost due to TLS termination & parsing |
| **Routing Features** | Simple Round Robin, Least Connections | Path-based routing, Auth tokens, Canary routing, Sticky sessions |
| **Examples** | AWS NLB, HAProxy (TCP mode), IPVS | AWS ALB, NGINX, Envoy, Traefik |`,
  content_fa: `### ۱. چالش هشینگ ساده با ماژولو (\`hash % N\`)

در سیستم‌های توزیع‌شده، استفاده از فرمول ساده \`hash(key) % N\` باعث می‌شود با قطع شدن یا اضافه شدن یک سرور جدید، تقریباً تمام کلیدها جابجا شده و کش سرورها خالی شود (Cache Stampede).

---

### ۲. الگوریتم هشینگ پایدار (Consistent Hashing)

در این روش، هم سرورها و هم کلیدها روی یک **حلقه مجازی (Hash Ring)** بین بازه $0$ تا $2^{32}-1$ نگاشت می‌شوند:
- برای پیدا کردن سرور مقصد، از موقعیت کلید در جهت عقربه‌های ساعت حرکت کرده تا به اولین سرور برسیم.
- با اضافه یا کم شدن یک سرور، صرفاً $\\frac{K}{N}$ از کلیدها جابجا می‌شوند و سایر کلیدها دست‌نخورده باقی می‌مانند.
- **نودهای مجازی (Virtual Nodes):** هر سرور فیزیکی به ۱۰۰ الی ۳۰۰ نود مجازی تبدیل می‌شود تا داده‌ها با توزیع کاملاً یکنواخت و بدون ایجاد Hotspot روی سرورها پخش شوند.

---

### ۳. تفاوت لودبالانسرهای L4 و L7

- **لایه ۴ (L4):** بر اساس IP و پورت TCP/UDP هدایت می‌کند. فوق‌العاده سریع و کم‌مصرف است اما محتوای پیام را بررسی نمی‌کند.
- **لایه ۷ (L7):** هدرهای HTTP، کوکی‌ها و توکن‌های JWT را می‌خواند و امکان روتینگ پیشرفته (مانند ارسال به سرویس‌های مختلف بر اساس Path) را فراهم می‌آورد.`,
};
