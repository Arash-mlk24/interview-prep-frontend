# AI Agent Maintenance & Extension Guide (DevPrep)

This document contains **mandatory operational rules** for any AI Agent working on this repository. Whenever the user requests adding or updating Questions, Concepts, Stacks, Categories, or Levels, follow the exact step-by-step procedures defined below.

---

## 1. Core Architecture & Bilinguality Principles

1. **Strictly Hardcoded & Read-Only**: There is no database or backend API. All data resides in typed TypeScript arrays inside `src/data/`.
2. **Decoupled Repositories**: The UI components (`src/components/` and `src/app/`) NEVER import raw question arrays directly. They read through `src/repositories/`.
3. **Bilinguality (English & Persian) & RTL**:
   - Every entity supports both English and Persian fields (`name` and `name_fa`, `description` and `description_fa`, `questionTitle` and `questionTitle_fa`, `answerContent` and `answerContent_fa`, `title` and `title_fa`, `content` and `content_fa`).
   - The UI supports dynamic switching between **English (LTR)** and **Persian (RTL)**.
   - In Persian mode, code blocks remain strictly LTR formatted.
4. **Immutability & Type Safety**: All data additions must conform to the TypeScript interfaces defined in `src/data/models.ts`.

---

## 2. Entity Models & Data File Mapping

| Entity | Interface | Data File | Aggregator / Registry |
| :--- | :--- | :--- | :--- |
| **Stack** | `Stack` | `src/data/stacks.ts` | `stacks` array |
| **Category** | `Category` | `src/data/categories.ts` | `categories` array |
| **Level** | `Level` | `src/data/levels.ts` | `levels` array |
| **Question** | `Question` | `src/data/questions/{stack-slug}-questions.ts` | `src/data/questions/index.ts` |
| **Concept** | `Concept` | `src/data/concepts/{stack-slug}-concepts.ts` | `src/data/concepts/index.ts` |

---

## 3. Workflow: "Add a new question about [Topic] to [Stack] stack"

When the user asks to add an interview question, execute this **exact 5-step procedure**:

### Step 1: Verify Stack Existence
1. Open `src/data/stacks.ts`.
2. Check if a stack matching the requested name/slug exists (e.g., `id: "dotnet"`, `id: "react"`, `id: "typescript"`).
3. If the stack **does not exist**:
   - Add the new `Stack` object to `src/data/stacks.ts` with:
     - `id`: lowercase kebab-case identifier (e.g., `"python"`, `"golang"`).
     - `name`: Human-readable English title.
     - `name_fa`: Persian title.
     - `slug`: URL slug (e.g., `"python"`).
     - `description`: 1-2 sentence overview in English.
     - `description_fa`: 1-2 sentence overview in Persian.
     - `icon`: Icon identifier.
   - Create new question file `src/data/questions/{slug}-questions.ts`.
   - Create new concept file `src/data/concepts/{slug}-concepts.ts`.
   - Register the new files in `src/data/questions/index.ts` and `src/data/concepts/index.ts`.

### Step 2: Verify & Ensure Category and Level Existence
1. **Level Verification** (`src/data/levels.ts`):
   - Check standard level IDs: `"junior"`, `"mid"`, `"senior"`, `"lead"`.
   - Default to `"senior"` or `"mid"` if unspecified.
   - If a new level is needed, append to `levels` array with `name` and `name_fa`.
2. **Category Verification** (`src/data/categories.ts`):
   - Check if a suitable category exists for the topic.
   - **If it does NOT exist**: Append a new `Category` object to `src/data/categories.ts`:
     ```typescript
     {
       id: "kebab-case-category-id",
       name: "English Category Name",
       name_fa: "نام دسته‌بندی به فارسی",
       slug: "kebab-case-category-id",
     }
     ```

### Step 3: Locate Question File
1. Open the specific stack question file:
   - .NET $\rightarrow$ `src/data/questions/dotnet-questions.ts`
   - React $\rightarrow$ `src/data/questions/react-questions.ts`
   - TypeScript $\rightarrow$ `src/data/questions/typescript-questions.ts`
   - Custom Stack $\rightarrow$ `src/data/questions/{slug}-questions.ts`

### Step 4: Append the Question Object
Append the new question to the exported array adhering strictly to `Question` interface with both English and Persian content:

```typescript
{
  id: "{stack-id}-q{next-index-or-unique-slug}",
  stackId: "{stack-id}",
  categoryId: "{category-id}",
  levelId: "{level-id}",
  questionTitle: "What is [Concise, direct interview question]?",
  questionTitle_fa: "عنوان سوال به زبان فارسی چیست؟",
  answerContent: `### Clear Heading

Detailed conceptual explanation in English explaining the "Why" and "How".

\`\`\`language
// Code example demonstrating the concept
\`\`\`

#### Key Takeaways / Trade-offs:
- Bullet point 1
- Bullet point 2`,
  answerContent_fa: `### عنوان بخش

توضیحات مفهومی دقیق به زبان فارسی.

\`\`\`language
// کد نمونه
\`\`\`

#### نکات کلیدی:
- نکته ۱
- نکته ۲`,
}
```

### Step 5: Verify Compilation & Type Safety
Run `npx tsc --noEmit` or `npm run build` to guarantee zero syntax or TypeScript errors.

---

## 4. Workflow: "Add a new concept to [Stack] stack"

When the user asks to add a review concept/note:
1. Verify the `Stack` in `src/data/stacks.ts`.
2. Locate `src/data/concepts/{slug}-concepts.ts`.
3. Append the new `Concept` object:
   ```typescript
   {
     id: "concept-{stack-id}-{unique-id}",
     stackId: "{stack-id}",
     title: "English concept title with key symbol/class name",
     title_fa: "عنوان مفهوم به زبان فارسی",
     content: `### Summary
     
Conceptual breakdown, architecture pattern, code sample, or gotcha in English.`,
     content_fa: `### خلاصه مفهوم
     
تحلیل معماری، نکات کاربردی و کدهای نمونه به زبان فارسی.`,
   }
   ```
4. Verify that the array is exported in `src/data/concepts/index.ts`.

---

## 5. Golden Rules for Answers & Formatting

1. **Markdown Formatting**: Use `###` headings, bullet lists, markdown tables, and fenced code blocks with language identifiers (\`\`\`csharp, \`\`\`tsx, \`\`\`typescript, \`\`\`sql).
2. **Bilingual Completeness**: Always supply both English and Persian versions (`questionTitle` + `questionTitle_fa`, `answerContent` + `answerContent_fa`).
3. **Architectural Depth**: When writing Senior/Lead answers, include:
   - Internal mechanics (memory, thread safety, asymptotic complexity).
   - Trade-offs & alternatives.
   - Real-world production pitfalls (e.g. N+1 queries, captive dependencies, re-render cascades).
4. **Never Mutate Existing IDs**: IDs must remain permanent and unique across the codebase.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
