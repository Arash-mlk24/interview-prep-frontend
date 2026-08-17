import { RoadmapTopic } from "../../../models";

export const efcoreDbContextFluentApiMappingsTopic: RoadmapTopic = {
  id: "topic-dotnet-efcore-dbcontext-fluent-api-mappings",
  stepId: "step-mid-efcore-data",
  slug: "efcore-dbcontext-fluent-api-mappings",
  order: 1,
  title: "DbContext, DbSet, Fluent API & Entity Mappings",
  title_fa: "معماری DbContext، پیکربندی موجودیت‌ها با Fluent API و Data Annotations",
  summary:
    "Master Entity Framework Core model configuration, IEntityTypeConfiguration<T>, value conversions, owned types, and shadow properties.",
  summary_fa:
    "تسلط بر ساختار DbContext و DbSet، تفکیک پیکربندی‌ها با IEntityTypeConfiguration، تبدیل مقادیر (Value Converters) و موجودیت‌های متعلق (Owned Entities).",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. DbContext & Entity Configuration Architecture

Separating entity mapping from domain classes using \`IEntityTypeConfiguration<T>\`:

\`\`\`csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(32);

        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        // Value Converter (Enum to String)
        builder.Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Owned Type (Value Object)
        builder.OwnsOne(o => o.ShippingAddress, a =>
        {
            a.Property(p => p.City).HasColumnName("ShippingCity").HasMaxLength(100);
            a.Property(p => p.PostalCode).HasColumnName("ShippingPostalCode").HasMaxLength(20);
        });
    }
}
\`\`\`

---

## 2. Registering Configurations Automatically

\`\`\`csharp
public class AppDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Product> Products => Set<Product>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Automatically discovers and applies all IEntityTypeConfiguration classes in assembly:
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
\`\`\``,
  content_fa: `## ۱. معماری DbContext و پیکربندی با Fluent API

جداسازی تعاریف دیتابیسی از کلاس‌های دامنه با استفاده از الگوی \`IEntityTypeConfiguration<T>\`:

\`\`\`csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(32);

        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        // تبدیل Enum به متن در دیتابیس
        builder.Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // تعریف Value Object به عنوان Owned Entity
        builder.OwnsOne(o => o.ShippingAddress, a =>
        {
            a.Property(p => p.City).HasColumnName("ShippingCity").HasMaxLength(100);
            a.Property(p => p.PostalCode).HasColumnName("ShippingPostalCode").HasMaxLength(20);
        });
    }
}
\`\`\`

---

## ۲. ثبت خودکار تمامی پیکربندی‌ها با Assembly Scanning

در متد \`OnModelCreating\` با فراخوانی \`ApplyConfigurationsFromAssembly\` تمام پیکربندی‌ها به صورت خودکار شناسایی و اعمال می‌شوند.`,
};
