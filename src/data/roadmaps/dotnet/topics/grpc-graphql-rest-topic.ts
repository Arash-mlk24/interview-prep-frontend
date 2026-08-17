import { RoadmapTopic } from "../../../models";

export const grpcGraphqlRestTopic: RoadmapTopic = {
  id: "topic-dotnet-grpc-protocols",
  stepId: "step-aspnet-internals-http",
  slug: "grpc-vs-graphql-vs-rest-dotnet",
  order: 2,
  title: "Modern API Protocols in .NET: gRPC, GraphQL (HotChocolate) & High-Performance REST",
  title_fa: "پروتکل‌های مدرن API در دات‌نت: مقایسه عمیق gRPC، گراف‌کیوال و REST پرسرعت",
  summary: "Protocol buffers binary serialization, HTTP/2 multiplexing, gRPC bi-directional streaming, HotChocolate GraphQL execution engines, and Minimal API benchmarks.",
  summary_fa: "سریالایز باینری با پروتوباف (Protobuf)، همزمانی HTTP/2، استریم دوطرفه در gRPC، موتور گراف‌کیوال HotChocolate و بهینه‌سازی Minimal APIs.",
  readingTimeMinutes: 19,
  difficulty: "senior",
  content: `### 1. Architectural Protocol Comparison

| Protocol | Transport | Serialization | Schema Contract | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **gRPC** | HTTP/2 / HTTP/3 | Protocol Buffers (Binary) | Strict (\`.proto\` file) | Inter-microservice internal communication |
| **GraphQL** | HTTP/1.1 or HTTP/2 | JSON | Strong GraphQL Schema (SDL) | Mobile BFFs, complex aggregations |
| **REST (JSON)** | HTTP/1.1 to HTTP/3 | JSON (\`System.Text.Json\`) | OpenAPI / Swagger | Public third-party APIs, browser clients |

---

### 2. Implementing High-Speed gRPC in .NET

\`\`\`csharp
// Server implementation in .NET 9
public class OrderGrpcService : OrderService.OrderServiceBase {
    public override async Task<OrderResponse> CreateOrder(
        CreateOrderRequest request, ServerCallContext context) {
        
        // Non-blocking asynchronous processing
        var result = await ProcessOrderInternalAsync(request.CustomerId, request.TotalAmount);
        
        return new OrderResponse {
            OrderId = result.Id.ToString(),
            Status = OrderStatus.Approved
        };
    }
}
\`\`\``,
  content_fa: `### ۱. مقایسه پروتکل‌های ارتباطی در دات‌نت

- **gRPC:** به دلیل استفاده از فرمت باینری Protobuf و مالتی‌پلکسینگ HTTP/2، تا ۸ الی ۱۰ برابر سریع‌تر از REST است و استاندارد طلایی ارتباط بین مایکروسرویس‌ها محسوب می‌شود.
- **GraphQL (با فریم‌ورک HotChocolate):** به کلاینت اجازه می‌دهد دقیقاً فیلدهای مورد نیاز خود را درخواست کند و از ارسال داده اضافه (Over-fetching) جلوگیری می‌کند.
- **REST مدرن با Minimal APIs:** سبک‌ترین مدل برای APIهای عمومی با سربار ناچیز در مقایسه با کنترلرهای سنتی.`,
};
