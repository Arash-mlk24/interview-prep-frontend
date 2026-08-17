import { RoadmapTopic } from "../../../models";

export const caseStudyVideoStreamingTopic: RoadmapTopic = {
  id: "topic-sys-case-video-streaming",
  stepId: "step-sys-case-studies-complex",
  slug: "designing-video-streaming-youtube-netflix",
  order: 1,
  title: "Case Study: Designing a Video Streaming Platform (YouTube / Netflix)",
  title_fa: "کیس‌استادی: طراحی پلتفرم استریم و پخش ویدیو در مقیاس جهانی (مشابه YouTube و Netflix)",
  summary: "End-to-end video pipeline: Chunked uploads, async transcoding DAGs, Adaptive Bitrate Streaming (HLS/DASH), multi-tier Edge CDNs, and recommendation pipelines.",
  summary_fa: "معماری کامل پردازش و استریم ویدیو: آپلود تکه‌ای، صف‌های تبدیل فرمت ویدیو (Transcoding)، استریم با بیت‌ریت تطبیقی (HLS/DASH) و شبکه‌های توزیع محتوای لبه (CDN).",
  readingTimeMinutes: 24,
  difficulty: "lead",
  content: `### 1. The Video Ingestion & Transcoding Pipeline

\`\`\`
Client (Creator) 
   | (Chunked Multipart Upload)
   v
[ API / Ingestion Gateway ] -> [ Blob Storage: Raw Video (AWS S3) ]
                                    | (Event: VideoUploaded)
                                    v
                             [ Kafka Queue ]
                                    |
                             [ Transcoding Worker Cluster ]
                               ├── Split into 5-10s .ts chunks (FFmpeg)
                               ├── Encode into multiple resolutions (1080p, 720p, 480p, 240p)
                               └── Generate Master Manifest (.m3u8 / .mpd)
                                    |
                                    v
                             [ Processed Video S3 Bucket ]
                                    |
                             [ Global Edge CDN Network ]
\`\`\`

---

### 2. Adaptive Bitrate Streaming (HLS & DASH)

Instead of downloading one giant monolithic MP4 file:
1. Videos are chopped into small **5-10 second chunks**.
2. A **Master Manifest (\`master.m3u8\`)** lists URLs for each resolution bitrate stream.
3. The video player measures the client's current network bandwidth continuously:
   - Strong WiFi $\\rightarrow$ Request chunk 10 in 1080p.
   - Sudden bandwidth drop $\\rightarrow$ Seamlessly request chunk 11 in 480p with zero buffering pause.

---

### 3. Multi-Tier Global CDN Architecture

- **Origin Shield:** Protects raw cloud storage from global cache stampedes.
- **Edge POPs (Points of Presence):** Located within ISPs worldwide to serve $98\\%+$ of popular video chunks directly from memory/NVMe drives with $< 15\\text{ms}$ time-to-first-frame.`,
  content_fa: `### ۱. پایپ‌لاین آپلود و تبدیل فرمت ویدیو (Transcoding)

۱. کلاینت ویدیو را به صورت چندتکه‌ای (Multipart Chunked) روی فضای ذخیره‌سازی S3 آپلود می‌کند.
۲. با انتشار رویداد در کافکا، سرورهای پردازشگر با ابزار FFmpeg ویدیو را به تکه‌های ۵ الی ۱۰ ثانیه‌ای خرد کرده و در رزولوشن‌های مختلف (1080p, 720p, 480p) انکود می‌کنند.
۳. فایل مانیفست (\`master.m3u8\`) تولید شده و فایل‌ها به شبکه CDN ارسال می‌شوند.

---

### ۲. استریم با بیت‌ریت تطبیقی (Adaptive Bitrate / HLS)

پلیر ویدیو در دستگاه کاربر سرعت لحظه‌ای اینترنت را اندازه می‌گیرد. در صورت افت سرعت اینترنت، تکه بعدی ویدیو را بدون هیچ توقف یا لگ در رزولوشن پایین‌تر دانلود می‌کند.

---

### ۳. شبکه توزیع محتوای چندسطحی (Edge CDN)

بیش از ۹۸٪ ترافیک ویدیوهای پربازدید مستقیماً از حافظه‌های پرسرعت NVMe در نزدیک‌ترین سرورهای لبه (Edge POPs) به کاربر تحویل داده می‌شود.`,
};
