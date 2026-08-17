import { RoadmapTopic } from "../../../models";

export const protocolsGrpcSignalrHttp3Topic: RoadmapTopic = {
  id: "topic-dotnet-protocols-grpc-signalr-http3",
  stepId: "step-traffic-gateways-protocols",
  slug: "modern-protocols-grpc-signalr-http3",
  order: 2,
  title: "Modern Communication Protocols: gRPC, HTTP/3 (QUIC) & Real-Time SignalR",
  title_fa: "پروتکل‌های ارتباطی مدرن در دات‌نت: gRPC باینری، HTTP/3 مبتنی بر QUIC و ارتباطات بلادرنگ با SignalR",
  summary: "Architect high-performance inter-service communication with Protobuf/gRPC, HTTP/3 transport multiplexing, and scale-out SignalR architectures.",
  summary_fa: "معماری ارتباطات پرسرعت باینری بین سرویس‌ها با gRPC، مزایای پروتکل HTTP/3 در Kestrel و اسکیل‌کردن هاب‌های SignalR با Redis Backplane.",
  readingTimeMinutes: 24,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **gRPC & Protocol Buffers in .NET**: Binary serialization efficiency, multiplexing, unary vs streaming (client, server, bi-directional) calls.
- **HTTP/3 & QUIC Protocol in Kestrel**: Solving Head-of-Line (HoL) blocking, 0-RTT handshakes, and Kestrel configuration.
- **Real-Time Communication with ASP.NET Core SignalR**:
  - WebSockets, Server-Sent Events (SSE), and Long Polling fallback.
  - Scale-Out architecture using Redis Backplane / Azure SignalR Service.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **فناوری gRPC و بافر پروتکل در دات‌نت**: کارایی سریال‌سازی باینری، استریم دوطرفه و تفاوت با REST در ارتباطات داخلی میکروسرویس‌ها.
- **پروتکل HTTP/3 و QUIC در وب‌سرور Kestrel**: رفع معضل Head-of-Line Blocking، کاهش زمان Handshake و فعال‌سازی در دات‌نت مدرن.
- **ارتباطات بلادرنگ با ASP.NET Core SignalR**:
  - مقایسه WebSockets با Server-Sent Events (SSE).
  - راه‌اندازی معماری Scale-Out با Redis Backplane و مدیریت اتصال هزاران کلاینت همزمان.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
