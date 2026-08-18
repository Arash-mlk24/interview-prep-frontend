# AI Agent Maintenance & Extension Guide (DevPrep)

This document contains the **mandatory operational rules and workflow standards** for any AI Agent working on this repository. Follow these exact procedures when adding or updating Roadmaps, Steps, Topics, Tutorials, Questions, Concepts, Stacks, Categories, or Levels.

---

## 1. Core Architecture & Bilinguality Principles

1. **Strictly Hardcoded & Read-Only**: There is no database or backend API. All data resides in typed TypeScript arrays inside `src/data/`.
2. **Decoupled Repositories**: The UI components (`src/components/` and `src/app/`) NEVER import raw data arrays directly. They read through `src/repositories/` (e.g. `roadmapRepository.ts`, `questionRepository.ts`, `conceptRepository.ts`).
3. **Bilinguality (English & Persian) & RTL**:
   - Every entity supports both English and Persian fields (`name` and `name_fa`, `description` and `description_fa`, `questionTitle` and `questionTitle_fa`, `answerContent` and `answerContent_fa`, `title` and `title_fa`, `summary` and `summary_fa`, `content` and `content_fa`).
   - The UI supports dynamic switching between **English (LTR)** and **Persian (RTL)**.
4. **Persian Technical Terminology Rule (CRITICAL)**:
   - In Persian translations, **DO NOT overly translate specialized technical terms**.
   - Keep standard engineering terms in their canonical English/technical form (e.g., `ThreadPool`, `System.Threading.Channels`, `Backpressure`, `ValueTask`, `Span<T>`, `Memory<T>`, `ArrayPool<T>`, `Starvation`, `Lock-Free`, `CAS`, `Large Object Heap`, `Clean Architecture`, `Vertical Slice Architecture`, `Modular Monolith`, `FastEndpoints`, `MediatR`, `ArchUnitNET`, `NetArchTest`, `In-Process Event Bus`, `Transactional Outbox`, `DDD`, `Aggregate Root`, `Bounded Context`).
5. **Code Blocks Formatting (CRITICAL)**:
   - All code snippets (`pre`, `code`, syntax highlighted blocks) MUST be strictly **LTR formatted and left-aligned** in both Persian (RTL) and English (LTR) modes.
6. **Immutability & Type Safety**: All additions must conform to the TypeScript interfaces defined in `src/data/models.ts`.

---

## 2. Roadmap, Topic & Tutorial Creation Workflow

When developing or updating Roadmap Topics and Tutorials, execute this **exact 5-step procedure**:

### Step 1: Deep Research & Topic Discovery
- Conduct comprehensive technical research on the topic covering:
  - Theoretical foundations and architectural patterns.
  - Runtime internals (CLR/V8, memory layout, thread pools, scheduling).
  - Modern industry best practices (.NET 8/9, C# 12/13, FastEndpoints, Minimal APIs, NetArchTest).
  - Edge cases, anti-patterns, and high-scale production trade-offs ($50,000+$ req/sec).

### Step 2: Write Comprehensive Master Tutorial
- Location: `src/data/roadmaps/{stack}/topics/{slug}-topic.ts`.
- **Exhaustive Depth & Length**: Tutorials must be deep, rich, and exhaustive (multi-thousand lines if needed), explaining the "Why" and "How" from beginner fundamentals to principal architect level.
- Structure must include:
  1. Evolution & Problem Statement.
  2. Deep Architectural Breakdown & Mechanics.
  3. Real-world High-Performance C# Code Snippets.
  4. Common Anti-Patterns & Production Pitfalls.
  5. Automated Testing & Verification (e.g. NetArchTest).
  6. Master Decision & Comparison Matrix.

### Step 3: Technical Diagrams & Image Generation (CRITICAL)
- **NEVER leave raw Mermaid blocks or text ASCII art in final tutorial views**.
- For every architectural flowchart or diagram in the tutorial:
  1. Generate a high-resolution, dark mode (`#0B0E17` background, glowing indigo/cyan accents) technical diagram image with clear English typography using `generate_image`.
  2. Save/copy the image to `public/images/roadmaps/{descriptive-name}.jpg`.
  3. Embed the image in **BOTH** the English (`content`) and Persian (`content_fa`) markdown using standard markdown syntax:
     ```markdown
     ![Diagram Title Description](/images/roadmaps/channels-concurrency-flow.jpg)
     ```

### Step 4: Link Existing Questions & Create 5+ Deep Interview Questions
1. Search existing questions in `src/data/questions/{stack}/` for relevant questions and append the topic ID to `topicIds`:
   ```typescript
   topicIds: ["topic-dotnet-csharp-oop-records-pattern-matching"],
   ```
2. Author at least **5 new in-depth interview questions** appropriate for the target level of the topic and step (Junior, Mid, Senior, or Lead) adhering to:
   - Multi-paragraph, architectural depth answering all mechanics and edge cases.
   - C# code examples, mermaid diagrams (in questions where appropriate), and diagnostic commands.
   - Full English and Persian versions (`questionTitle` + `questionTitle_fa`, `answerContent` + `answerContent_fa`).
3. Append them to the corresponding level file in `src/data/questions/{stack}/{level}-questions.ts` (e.g. `mid-questions.ts`, `senior-questions.ts`, `junior-questions.ts`, etc.).

### Step 5: Verification & Compilation
- Run `npx tsc --noEmit` to ensure **Exit code 0** with zero TypeScript or syntax errors.

---

## 3. Entity Models & Data File Mapping

| Entity | Interface | Data File Location | Aggregator / Registry |
| :--- | :--- | :--- | :--- |
| **Stack** | `Stack` | `src/data/stacks.ts` | `stacks` array |
| **Category** | `Category` | `src/data/categories.ts` | `categories` array |
| **Level** | `Level` | `src/data/levels.ts` | `levels` array |
| **Roadmap** | `Roadmap` | `src/data/roadmaps/{stack}/{slug}-roadmap.ts` | `src/data/roadmaps/{stack}/index.ts` & `src/data/roadmaps/index.ts` |
| **Topic** | `RoadmapTopic`| `src/data/roadmaps/{stack}/topics/{slug}-topic.ts`| Embedded inside `RoadmapStep.topics` |
| **Question** | `Question` | `src/data/questions/{stack}/{level}-questions.ts` | `src/data/questions/index.ts` |
| **Concept** | `Concept` | `src/data/concepts/{stack}-concepts.ts` | `src/data/concepts/index.ts` |

---

## 4. UI Components & Design Standards

1. **Collapsible Roadmap Steps**: All roadmap steps in `RoadmapStepCard.tsx` must be collapsible with smooth transitions, interactive headers, and expand/collapse all controls.
2. **Metadata Badges (`MetaBadge`)**: Always use `<MetaBadge>` instead of plain MUI `Chip` for metadata (estimated hours, difficulty, step numbers) to prevent icon overflow in RTL mode.
3. **Markdown Rendering (`MarkdownRenderer.tsx`)**:
   - Code blocks (`pre`, `code`) must have `dir="ltr" !important`, `textAlign="left" !important`, `unicodeBidi="isolate !important"`.
   - Images (`img`) must be centered, responsive, with subtle dark borders and hover elevation.

---

## 5. Golden Rules for Interview Questions (All Levels)

1. **Markdown Formatting**: Use `###` headings, bullet lists, markdown tables, and fenced code blocks with language identifiers (```csharp, ```tsx, ```typescript, ```sql, ```bash).
2. **Bilingual Completeness**: Always supply both English and Persian versions (`questionTitle` + `questionTitle_fa`, `answerContent` + `answerContent_fa`).
3. **Architectural Depth**: Include internal mechanics (memory, thread safety, asymptotic complexity), trade-offs & alternatives, and real-world production pitfalls tailored to the level.
4. **Never Mutate Existing IDs**: IDs must remain permanent and unique across the codebase.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
