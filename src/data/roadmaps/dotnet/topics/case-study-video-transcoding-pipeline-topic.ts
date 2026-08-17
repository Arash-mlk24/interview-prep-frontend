import { RoadmapTopic } from "../../../models";

export const caseStudyVideoTranscodingPipelineTopic: RoadmapTopic = {
  id: "topic-dotnet-case-study-video-transcoding-pipeline",
  stepId: "step-dotnet-case-studies",
  slug: "system-design-case-study-video-transcoding-pipeline",
  order: 5,
  title: "Case Study: Large Video Streaming & Chunked Transcoding Pipeline in .NET",
  title_fa: "کیس‌استادی: طراحی پایپ‌لاین آپلود، تبدیل فرمت موازی ویدیو (Transcoding) و استریم HLS/DASH در دات‌نت",
  summary: "Architect a YouTube-lite pipeline: Chunked multipart uploads, Azure Blob / S3 storage, distributed FFmpeg transcoding workers, and CDN caching.",
  summary_fa: "معماری پلتفرم پردازش ویدیو در مقیاس بالا: آپلود چندبخشی مستقیم به مخزن ابری، تبدیل کیفیت موازی با ورکر سرویس‌های دات‌نت و توزیع از طریق CDN.",
  readingTimeMinutes: 30,
  difficulty: "lead",
  content: `### Architectural Overview & Outline

- **Resilient Chunked Multipart Uploads**:
  - Direct presigned URLs to Object Storage (S3 / Azure Blob Storage) bypassing backend servers.
  - Chunk hashing, resumable uploads, and upload completion events.
- **Distributed Transcoding Worker Architecture**:
  - Queue-driven background processing with .NET Worker Services and FFmpeg wrappers.
  - Generating adaptive bitrate streams (HLS / DASH with \`.m3u8\` playlists and TS segments).
- **CDN Edge Delivery**:
  - Edge caching of video segments and token-based media authentication.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **آپلود تکه‌ای و قابل ازسرگیری (Resumable Multipart Upload)**:
  - آپلود مستقیم به Object Storage با Presigned URL بدون درگیر شدن مستقیم سرورهای بک‌اند.
  - مدیریت هش تکه‌ها و ترکیب فایل پس از اتمام آپلود.
- **پایپ‌لاین پردازش و تبدیل فرمت موازی**:
  - صف‌بندی کارها در بروکر پیام و مصرف توسط Worker Serviceهای بهینه‌شده دات‌نت با ابزار FFmpeg.
  - تولید فایل‌های استریم با کیفیت متغیر (HLS و DASH برای رزولوشن‌های 1080p, 720p, 480p).
- **توزیع و تحویل محتوا با CDN**:
  - کش‌کردن سگمنت‌های ویدیو در سرورهای لبه شبکه (CDN) و ایمن‌سازی لینک‌ها با امضای دیجیتال مدت‌دار.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
