import { RoadmapTopic } from "../../../models";

export const compilerAstTransformsTopic: RoadmapTopic = {
  id: "topic-ts-compiler-ast",
  stepId: "step-ts-compiler-transforms",
  slug: "typescript-compiler-api-ast-transforms",
  order: 1,
  title: "TypeScript Compiler API, AST Traversal & Custom Code Transformers",
  title_fa: "معماری کامپایلر تایپ‌اسکریپت: پیمایش درخت AST و ساخت ترنسفورمرهای سفارشی کد",
  summary: "Master the 5 phases of the TypeScript compiler: Scanner, Parser, Binder, Checker, and Emitter; writing custom AST visitors and AST transform plugins.",
  summary_fa: "تسلط بر ۵ مرحله کامپایلر تایپ‌اسکریپت (Scanner، Parser، Binder، Checker و Emitter)، پیمایش درخت نحو انتزاعی (AST) و تولید خودکار کد در زمان بیلد.",
  readingTimeMinutes: 20,
  difficulty: "lead",
  content: `### 1. The 5 Architecture Phases of the TypeScript Compiler

\`\`\`
Source Code (.ts)
       |
       v
1. [ Scanner / Lexer ]     --> Stream of Syntax Tokens
       |
       v
2. [ Parser ]              --> Abstract Syntax Tree (AST: SourceFile)
       |
       v
3. [ Binder ]              --> Symbols and Scopes
       |
       v
4. [ Type Checker ]        --> Validates type rules (TypeChecker API)
       |
       v
5. [ Emitter / Generator ] --> Output JavaScript (.js) + Type Declarations (.d.ts)
\`\`\`

---

### 2. Creating a Custom AST Visitor Transformer

\`\`\`typescript
import ts from "typescript";

// Custom transformer that replaces console.log with void 0 in production:
export function removeConsoleLogsTransformer(context: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    function visitor(node: ts.Node): ts.Node {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === "console" &&
        node.expression.name.text === "log"
      ) {
        // Replace with void 0 node
        return context.factory.createVoidZero();
      }
      return ts.visitEachChild(node, visitor, context);
    }
    return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
  };
}
\`\`\``,
  content_fa: `### ۱. مراحل پنج‌گانه کامپایلر تایپ‌اسکریپت

۱. **Scanner:** تبدیل کدهای متنی به توکن‌های نشانه‌گذاری.
۲. **Parser:** تولید درخت نحو انتزاعی (**AST**).
۳. **Binder:** ساخت نمادها (Symbols) و دامنه‌های متغیرها.
۴. **TypeChecker:** مهم‌ترین موتور جهت اعتبارسنجی قوانین تایپ‌سیفتی.
۵. **Emitter:** تولید فایل‌های نهایی خروجی جاوااسکریپت و تعاریف \`.d.ts\`.

---

### ۲. ساخت ترنسفورمرهای سفارشی روی AST

با استفاده از \`ts.TransformationContext\` و الگوی Visitor، می‌توان درخت کدهای برنامه‌نویس را در زمان بیلد بازرسی، دستکاری یا بهینه‌سازی کرد (مانند حذف خودکار لاگ‌ها یا تزریق خودکار متادیتا).`,
};
