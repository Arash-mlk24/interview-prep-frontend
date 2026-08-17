export type Language = "en" | "fa";
export type Direction = "ltr" | "rtl";

export type TranslationKeys =
  | "appTitle"
  | "appBadge"
  | "appSubtitle"
  | "curatedKnowledge"
  | "allStacks"
  | "homeHeroBadge"
  | "homeHeroTitle1"
  | "homeHeroTitle2"
  | "homeHeroSubtitle"
  | "availableStacks"
  | "totalQuestions"
  | "deepConcepts"
  | "filterPlaceholder"
  | "noStacksFound"
  | "trySearching"
  | "questions"
  | "concepts"
  | "categories"
  | "coveredCategories"
  | "exploreStack"
  | "preparationHub"
  | "interviewQuestionsTab"
  | "conceptsTab"
  | "roadmapsTab"
  | "roadmaps"
  | "steps"
  | "topics"
  | "estimatedHours"
  | "startRoadmap"
  | "viewTopic"
  | "completeTutorial"
  | "interviewQuestions"
  | "readingTime"
  | "previousTopic"
  | "nextTopic"
  | "backToRoadmap"
  | "noQuestionsForTopic"
  | "markCompleted"
  | "markIncomplete"
  | "completed"
  | "progress"
  | "roadmapProgress"
  | "searchTopicsPlaceholder"
  | "filterByDifficulty"
  | "allDifficulties"
  | "groupBy"
  | "levelFirst"
  | "categoryFirst"
  | "searchQuestionsPlaceholder"
  | "searchConceptsPlaceholder"
  | "expandAll"
  | "collapseAll"
  | "noQuestionsFound"
  | "tryAdjustingSearch"
  | "noConceptsFound"
  | "tryAnotherTopic"
  | "conceptNumber"
  | "levelBadgeSuffix"
  | "footerCopyright"
  | "footerNote"
  | "languageToggle";

export const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    appTitle: "DevPrep",
    appBadge: "PRO ARCHITECT",
    appSubtitle: "Interview Preparation & Concept Review",
    curatedKnowledge: "Curated Knowledge",
    allStacks: "All Stacks",
    homeHeroBadge: "Senior & Architect Interview Ready",
    homeHeroTitle1: "Master Engineering Interviews & ",
    homeHeroTitle2: "Architectural Concepts",
    homeHeroSubtitle:
      "A high-performance, structured knowledge hub for Junior, Mid-Level, Senior, and Lead engineers. Explore questions grouped by experience level or category with in-depth technical explanations.",
    availableStacks: "AVAILABLE STACKS",
    totalQuestions: "TOTAL QUESTIONS",
    deepConcepts: "DEEP CONCEPTS",
    filterPlaceholder: "Filter technology stacks, categories, or keywords...",
    noStacksFound: 'No stacks found matching "{term}"',
    trySearching: 'Try searching for ".NET", "React", or "TypeScript"',
    questions: "Questions",
    concepts: "Concepts",
    categories: "Categories",
    coveredCategories: "Covered Categories:",
    exploreStack: "Explore {name}",
    preparationHub: "Preparation Hub",
    interviewQuestionsTab: "Interview Questions ({count})",
    conceptsTab: "Concepts & Review ({count})",
    roadmapsTab: "Roadmaps ({count})",
    roadmaps: "Roadmaps",
    steps: "Steps",
    topics: "Modules",
    estimatedHours: "~{hours} Hours",
    startRoadmap: "Explore Roadmap",
    viewTopic: "Study Module",
    completeTutorial: "Comprehensive Guide",
    interviewQuestions: "Interview Questions",
    readingTime: "{minutes} min read",
    previousTopic: "Previous Module",
    nextTopic: "Next Module",
    backToRoadmap: "Back to Roadmap",
    noQuestionsForTopic: "No specific interview questions linked to this module yet.",
    markCompleted: "Mark Completed",
    markIncomplete: "Completed ✓",
    completed: "Completed",
    progress: "Progress",
    roadmapProgress: "{percentage}% Completed",
    searchTopicsPlaceholder: "Filter modules by name or concept...",
    filterByDifficulty: "All Difficulties",
    allDifficulties: "All Difficulties",
    groupBy: "Group By:",
    levelFirst: "Level First",
    categoryFirst: "Category First",
    searchQuestionsPlaceholder: "Search question title or answer...",
    searchConceptsPlaceholder: "Search {name} concepts...",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    noQuestionsFound: "No questions found matching your filter",
    tryAdjustingSearch: 'Try clearing or adjusting your search term: "{term}"',
    noConceptsFound: 'No concepts found matching "{term}"',
    tryAnotherTopic: "Try searching for another topic or clear the search query.",
    conceptNumber: "Concept #{number}",
    levelBadgeSuffix: "Level",
    footerCopyright: "Interview Preparation & Concept Review. Clean Architecture Edition.",
    footerNote: "Read-only Knowledge Base • AI Prompt Extensible",
    languageToggle: "فارسی",
  },
  fa: {
    appTitle: "دِو‌پِرِپ",
    appBadge: "معماری حرفه‌ای",
    appSubtitle: "آمادگی مصاحبه فنی و مرور مفاهیم عمیق",
    curatedKnowledge: "دانش منتخب مهندسی",
    allStacks: "همه فناوری‌ها",
    homeHeroBadge: "آمادگی مصاحبه‌های سنیور و لید/آرشیتکت",
    homeHeroTitle1: "تسلط کامل بر مصاحبه‌های مهندسی نرم‌افزار و ",
    homeHeroTitle2: "مفاهیم معماری",
    homeHeroSubtitle:
      "پایگاه جامع و تخصصی برای مهندسان جونیور، میدلول، سنیور و لید. بررسی سؤالات تخصصی با تفکیک بر اساس سطح تجربه یا سرفصل‌های فنی به همراه توضیحات معماری و کدهای نمونه.",
    availableStacks: "استک‌های موجود",
    totalQuestions: "مجموع سؤالات",
    deepConcepts: "مفاهیم عمیق",
    filterPlaceholder: "جستجو در استک‌ها، دسته‌بندی‌ها یا واژگان کلیدی...",
    noStacksFound: 'هیچ استکی مطابق با "{term}" یافت نشد',
    trySearching: 'می‌توانید عباراتی مانند «دات‌نت»، «ری‌اکت» یا «تایپ‌اسکریپت» را جستجو کنید',
    questions: "سؤالات",
    concepts: "مفاهیم",
    categories: "دسته‌بندی‌ها",
    coveredCategories: "سرفصل‌های تحت پوشش:",
    exploreStack: "مشاهده {name}",
    preparationHub: "مرکز یادگیری و آمادگی",
    interviewQuestionsTab: "سؤالات مصاحبه ({count})",
    conceptsTab: "مفاهیم و نکات کلیدی ({count})",
    roadmapsTab: "نقشه‌های راه ({count})",
    roadmaps: "نقشه‌های راه",
    steps: "مرحله",
    topics: "ماژول آموزشی",
    estimatedHours: "تقریباً {hours} ساعت",
    startRoadmap: "مشاهده نقشه راه",
    viewTopic: "مطالعه آموزش",
    completeTutorial: "آموزش جامع و تخصصی",
    interviewQuestions: "سؤالات مصاحبه مرتبط",
    readingTime: "زمان مطالعه: {minutes} دقیقه",
    previousTopic: "مبحث قبلی",
    nextTopic: "مبحث بعدی",
    backToRoadmap: "بازگشت به نقشه راه",
    noQuestionsForTopic: "هنوز سوال مصاحبه‌ای به این مبحث متصل نشده است.",
    markCompleted: "علامت‌گذاری به عنوان مطالعه‌شده",
    markIncomplete: "مطالعه شد ✓",
    completed: "تکمیل شده",
    progress: "میزان پیشرفت",
    roadmapProgress: "{percentage}٪ تکمیل‌شده",
    searchTopicsPlaceholder: "فیلتر مباحث با عنوان یا کلیدواژه...",
    filterByDifficulty: "همه سطوح دشواری",
    allDifficulties: "همه سطوح",
    groupBy: "دسته‌بندی بر اساس:",
    levelFirst: "ابتدا سطح تجربه",
    categoryFirst: "ابتدا موضوع فنی",
    searchQuestionsPlaceholder: "جستجو در عنوان یا متن پاسخ سؤالات...",
    searchConceptsPlaceholder: "جستجو در مفاهیم {name}...",
    expandAll: "باز کردن همه",
    collapseAll: "بستن همه",
    noQuestionsFound: "سؤالی مطابق با فیلتر شما پیدا نشد",
    tryAdjustingSearch: 'عبارت جستجو را تغییر دهید: "{term}"',
    noConceptsFound: 'مفهومی مطابق با "{term}" یافت نشد',
    tryAnotherTopic: "موضوع دیگری را جستجو کرده یا فیلتر را پاک کنید.",
    conceptNumber: "مفهوم شماره {number}",
    levelBadgeSuffix: "سطح",
    footerCopyright: "سامانه آمادگی مصاحبه و مرور مفاهیم. معماری تمیز و مقیاس‌پذیر.",
    footerNote: "پایگاه دانش فقط-خواندنی • قابلیت افزودن آسان با پرامپت هوش مصنوعی",
    languageToggle: "English",
  },
};
