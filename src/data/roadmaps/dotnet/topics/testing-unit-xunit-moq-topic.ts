import { RoadmapTopic } from "../../../models";

export const testingUnitXunitMoqTopic: RoadmapTopic = {
  id: "topic-dotnet-testing-unit-xunit-moq",
  stepId: "step-mid-testing-quality",
  slug: "testing-unit-xunit-moq",
  order: 1,
  title: "Unit Testing with xUnit, FluentAssertions & Moq / NSubstitute",
  title_fa: "تست واحد (Unit Testing) با xUnit، FluentAssertions و Moq / NSubstitute",
  summary:
    "Master the AAA (Arrange-Act-Assert) pattern, test isolation, parameterized tests with [Theory], mocking dependencies, and writing readable assertions.",
  summary_fa:
    "تسلط بر الگوی AAA در تست‌نویسی، ایزوله‌سازی تست‌ها، تست‌های پارامتریک با Theory و InlineData، شبیه‌سازی وابستگی‌ها با Moq و اعتبارسنجی با FluentAssertions.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. The AAA Pattern & xUnit Fundamentals

Every unit test should follow the **Arrange, Act, Assert** structure:

\`\`\`csharp
public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _orderRepoMock;
    private readonly Mock<IPaymentGateway> _paymentGatewayMock;
    private readonly OrderService _sut; // System Under Test

    public OrderServiceTests()
    {
        _orderRepoMock = new Mock<IOrderRepository>();
        _paymentGatewayMock = new Mock<IPaymentGateway>();
        _sut = new OrderService(_orderRepoMock.Object, _paymentGatewayMock.Object);
    }

    [Fact]
    public async Task ProcessOrder_WhenPaymentSucceeds_ShouldCompleteOrder()
    {
        // Arrange
        var order = new Order { Id = Guid.NewGuid(), Total = 100m };
        _paymentGatewayMock
            .Setup(p => p.ChargeAsync(100m, It.IsAny<CancellationToken>()))
            .ReturnsAsync(PaymentResult.Success());

        // Act
        var result = await _sut.ProcessOrderAsync(order, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        order.Status.Should().Be(OrderStatus.Completed);
        _orderRepoMock.Verify(r => r.UpdateAsync(order, It.IsAny<CancellationToken>()), Times.Once);
    }
}
\`\`\`

---

## 2. Parameterized Tests with [Theory] & [InlineData]

\`\`\`csharp
[Theory]
[InlineData("", false)]
[InlineData("invalid-email", false)]
[InlineData("user@domain.com", true)]
public void IsValidEmail_ShouldValidateCorrectly(string email, bool expected)
{
    var validator = new EmailValidator();
    var result = validator.IsValid(email);
    result.Should().Be(expected);
}
\`\`\``,
  content_fa: `## ۱. الگوی استاندارد AAA و مبانی xUnit

هر تست واحد استاندارد از سه بخش تشکیل شده است:
- **Arrange**: آماده‌سازی داده‌ها و ماک کردن وابستگی‌ها.
- **Act**: فراخوانی متد مورد تست روی شیء تحت بررسی (SUT).
- **Assert**: راستی‌آزمایی خروجی و بررسی تغییرات وضعیت.

\`\`\`csharp
[Fact]
public async Task ProcessOrder_WhenPaymentSucceeds_ShouldCompleteOrder()
{
    // Arrange
    var order = new Order { Id = Guid.NewGuid(), Total = 100m };
    _paymentGatewayMock
        .Setup(p => p.ChargeAsync(100m, It.IsAny<CancellationToken>()))
        .ReturnsAsync(PaymentResult.Success());

    // Act
    var result = await _sut.ProcessOrderAsync(order, CancellationToken.None);

    // Assert
    result.IsSuccess.Should().BeTrue();
    order.Status.Should().Be(OrderStatus.Completed);
}
\`\`\`

---

## ۲. تست‌های پارامتریک با Theory و InlineData

اجرای یک تست واحد با چندین ورودی مختلف برای پوشش تمامی شاخه‌های شرطی.`,
};
