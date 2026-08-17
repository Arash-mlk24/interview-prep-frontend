import { RoadmapTopic } from "../../../models";

export const raftPaxosConsensusTopic: RoadmapTopic = {
  id: "topic-sys-raft-paxos",
  stepId: "step-sys-consensus-transactions",
  slug: "distributed-consensus-raft-paxos",
  order: 2,
  title: "Distributed Consensus: Raft vs. Multi-Paxos & Leader Election",
  title_fa: "الگوریتم‌های اجماع توزیع‌شده: مقایسه Raft و Paxos، و انتخاب لیدر",
  summary: "Master the mechanics of distributed consensus algorithms: Leader Election, Term numbers, AppendEntries RPCs, Log Replication, Safety Invariants, and Split-Brain prevention in etcd/Consul/Kafka.",
  summary_fa: "تسلط بر نحوه کارکرد الگوریتم‌های اجماع: فرآیند انتخاب لیدر، شماره دوره‌ها (Terms)، تکثیر لاگ، تضمین سازگاری و جلوگیری از فاجعه دوگانگی مغز (Split-Brain) در نرم‌افزارهای etcd، Consul و Kafka.",
  readingTimeMinutes: 22,
  difficulty: "lead",
  content: `### 1. Why Distributed Consensus is Hard

In an asynchronous network with unreliable nodes and variable message delays, reaching agreement on a shared state (e.g., who is the master node, or what is the transaction commit sequence) is theoretically vulnerable to the **FLM Impossibility Principle**.

Consensus algorithms like **Raft** and **Multi-Paxos** solve this by enforcing **Quorum Majority ($> N/2$)** and strict logical **Terms/Epochs**.

---

### 2. The Raft Consensus Algorithm Breakdown

Raft decomposes consensus into three independent subproblems:

#### A. Leader Election
1. Nodes transition among three states: **Follower $\\rightarrow$ Candidate $\\rightarrow$ Leader**.
2. If a Follower receives no heartbeats within a randomized timeout ($150\\text{ms} - 300\\text{ms}$), it increments its \`currentTerm\` and broadcasts \`RequestVote\` RPCs.
3. If it wins a strict majority of votes ($> N/2$), it becomes the Leader and immediately sends periodic \`AppendEntries\` heartbeats.

#### B. Log Replication
1. Client sends write request to Leader.
2. Leader appends entry to its local log and broadcasts \`AppendEntries\` RPC.
3. Once a majority of followers acknowledge writing the entry, the Leader **commits** the entry and replies to the client.
4. On the next heartbeat, followers are informed to commit the entry to their state machine.

#### C. Safety Invariant (Log Matching Property)
- A Candidate's log must be **at least as up-to-date** as any voter's log to receive their vote. This guarantees that uncommitted entries on crashed former leaders are safely overwritten, while committed entries are never lost.

---

### 3. Real-World Applications

- **etcd:** Kubernetes distributed key-value store for cluster state.
- **Consul:** Service discovery, health checking, and distributed configuration.
- **Kafka KRaft:** Replaced ZooKeeper with an internal Raft quorum controller for metadata management.`,
  content_fa: `### ۱. چرایی ضرورت الگوریتم‌های اجماع در سیستم‌های توزیع‌شده

در شبکه‌هایی که سرورها ممکن است کرش کنند یا پیام‌ها با تاخیر برسند، تصمیم‌گیری درباره اینکه «چه کسی لیدر است» یا «ترتیب قطعی تراکنش‌ها چیست» بدون ایجاد تضاد، از طریق الگوریتم‌های **اجماع کواوروم ($> N/2$)** حل می‌شود.

---

### ۲. مراحل الگوریتم اجماع Raft

۱. **انتخاب لیدر (Leader Election):**
   - نودها در ۳ وضعیت Follower، Candidate و Leader قرار دارند.
   - با گذشت زمان تصادفی و نرسیدن هارت‌بیت، نود کاندید شده و درخواست رای‌گیری می‌فرستد. دریافت اکثریت آرا ($> N/2$) آن را لیدر می‌کند.

۲. **تکثیر لاگ (Log Replication):**
   - لیدر رکورد را در لاگ خود نوشته و برای فالوورها می‌فرستد. به محض تایید بیش از ۵۰٪ نودها، رکورد Commit شده و پاسخ موفقیت به کلاینت داده می‌شود.

۳. **جلوگیری از Split-Brain:**
   - به دلیل نیاز به اکثریت مطلق، در صورت تقسیم شبکه به دو نیم، بخش کوچک‌تر هرگز نمی‌تواند لیدر انتخاب کند و سیستم با امنیت کامل کار می‌کند.`,
};
