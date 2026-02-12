# 模型只是一半：脚手架如何优化 AI 的编程能力？

## 一、同一个模型，不同的分数

Terminal-Bench2.0是一个面向终端任务的 AI Agent benchmark，由 Laude Institute 维护 [1][23]。测试集来自 100+ 真实 GitHub CLI 任务，覆盖 git 操作、脚本调试、配置修复等场景。这个榜单反映模型与脚手架的组合效果。

Terminal-Bench 2.0 排行榜上有 101 个条目 [1]。Claude Opus 4.6 出现了好几次，分数从 58% 到 69.9%。Gemini 3 Flash 也是，从 51% 到 64.3%。

这些分数差异就来源于脚手架。

脚手架（scaffolding）是包裹在模型外面的工程层，决定给模型看什么上下文、能调用哪些工具、怎么验证结果、怎么跨会话保持记忆。Anthropic 把这层叫 harness，有的人叫 agent framework。

排行榜上有一个特殊条目：Terminus 2 [23]。它是 Terminal-Bench 团队自己做的最小化脚手架，只有一个工具（headless bash），不做任何提示优化或规划策略。它的目的是作为基线，量化其他脚手架到底贡献了多少分。

用 Terminus 2 做参照，脚手架增益一目了然 [1]：

| 模型 | 基线 (Terminus 2) | 最佳脚手架 | 脚手架增益 |
|------|------------------|-----------|-----------|
| GPT-5.3-Codex | 64.7% (#7) | Simple Codex 75.1% (#1) | +10.4pp |
| Claude Opus 4.6 | 62.9% (#10) | Droid 69.9% (#3) | +7.0pp |
| GPT-5.2 | 54.0% (#28) | Droid 64.9% (#5) | +10.9pp |
| Claude Opus 4.5 | 57.8% (#23) | Droid 63.1% (#9) | +5.3pp |

另一个角度：同模型两个脚手架之间的直接差距。Opus 4.6 上 Droid 69.9% vs Claude Code 58.0%，差 11.9pp。Gemini 3 Flash 上 Junie CLI 64.3% vs Gemini CLI 51.0%，差 13.3pp。

更值得注意的是，Claude Code 在 Opus 4.6 上拿到 58.0%（#22），比最小化基线 Terminus 2 的 62.9% 还低了 4.9pp。这意味着 Claude Code 的脚手架在终端任务上反而拖了后腿。

CCA 论文 [2] 走得更远：Claude Sonnet 4.5 搭配强脚手架（52.7%）跑赢了 Claude Opus 4.5 搭配弱脚手架（52.0%）。弱模型加好脚手架，赢了强模型加差脚手架。

5 到 10 个百分点的脚手架增益，足以把排名从中游拉到前三。那这些框架到底在做什么不一样的事？

## 二、脚手架的六个维度

把排行榜上的主要框架的脚手架技术摊开，可以归为六个维度。

### 上下文管理：给模型看什么

代码库几十万行，context window 有限，给模型看哪些代码？三种主流路线已经分化。

**运行时搜索**是最常见的做法。Claude Code 和 Codex CLI 都走这条路 [3][4]：不做预处理，agent 执行时通过 grep、find 按需搜索。零初始化成本，但搜索质量完全依赖模型构造查询的能力，且消耗更多 token。

**环境感知**是终端原生工具的路线。Warp 直接连接 PTY 伪终端流，能读取终端缓冲区完整内容 [5]。上下文实时且零额外请求，但覆盖范围受限于当前视野。

**语义索引**投入最重但效果最好。Augment Code 自研 embedding 模型，为整个代码库建立实时语义索引 [6]。SWE-bench Pro 同模型对比中（均用 Opus 4.5），Auggie 拿到 51.80%，比 Claude Code 的 49.75% 多解了约 15 道题 [7]。不过 Augment Code 没有提交 Terminal-Bench 2.0，这个优势在终端任务上是否成立还不确定。

### 工具设计：模型能做什么

Agent 完成一个任务需要调用多次工具，每一步的成功率不是加法，而是乘法——步骤越多、单步越不可靠，最终成功率就越低。工具设计的核心问题是：给模型更多工具来覆盖更多场景，还是更少工具来降低出错概率？

Factory Droid 走极简路线 [8]：严格限制工具数量，简化输入 schema，为不同模型创建定制的工具变体。复杂的 schema会 导致错误率增加，且错误会在多步任务中级联放大。

假设单步成功率为 80%，连续 10 步全部成功的概率只有 0.8¹⁰ = 10.7%。但如果将单步成功率提升至 90%，同时将任务步骤从 10 步减少到 8 步，全程成功率就变为 0.9⁸ = 43.0%
更少的工具意味着更短的调用链，更简单的 schema 意味着更低的单步出错率

Droid的目的是让每一次任务更可靠，并且让任务步骤更少. 这个策略在 Terminal-Bench 上得到了验证：Droid 用四个不同模型提交，全部进入前 15 名。

Claude Code 走功能全面路线：24 个内建工具 [9]，从文件读写、regex 搜索到 TodoWrite 状态追踪。Anthropic 说他们花在工具优化上的时间多于 prompt 优化 [10]，关键是做好防呆设计(poka-yoke)，用参数设计让错误更难发生。

### 提示工程：怎么告诉模型

两种对立的哲学，都有 benchmark 数据支撑。

**精细分层**。Factory Droid 用三层提示层级 [8]：工具描述定义能力规格，系统提示设定高层目标，系统通知在上下文窗口末端注入关键指令。为什么放末端？因为模型存在递近偏差(recency bias)，对最新内容赋予更高优先级。Droid 利用这个偏差而非对抗它。Claude Code 也走分层路线：28 个核心系统提示组件加 40 多个事件驱动的系统提醒 [9]，在 93 个以上版本中持续迭代。

### 任务分解：怎么拆问题

三个层次，Terminal-Bench 数据暗示强制规划有效。

**强制显式规划**。Junie CLI 采用强制规划，生成 plan.md 后才开始编码 [12]。Droid 的规划工具把更新后的计划放在上下文窗口最末端，配合递近偏差保持方向感 [8]。

**可选显式规划**。Claude Code 的 TodoWrite 工具在检测到 3 个以上独立步骤时自动激活 [9]。

**隐式规划**。Codex CLI 和 Gemini CLI 靠模型的推理 token 或 extended thinking 自行规划 [4][13]。

排行榜上的位置：Droid（显式规划）#3，Junie CLI（强制规划）#8，Warp（强制 Todo）#14。Gemini CLI（隐式规划）排在后半段 [1]。不能把差异单独归因于规划策略，但趋势一致。

### 记忆持久化：跨会话怎么记住项目

项目根目录放一个 Markdown 文件已经成了事实标准：CLAUDE.md [3]、AGENTS.md [4]、GEMINI.md [13]、guidelines.md [12]，用自然语言告诉 agent 项目的约定和禁忌，通过 git 共享给团队。差异在层级深度上：Claude Code 支持四级覆盖（组织级到目录级）[3]，Codex CLI 支持 root-to-leaf 逐级加载加本地 override [4]，Gemini CLI 相对简单 [13]。多数框架的记忆是无状态的，每次会话重新读取配置文件。[14]。

### 验证反馈

策略差异显著且直接影响成绩。Factory Droid 对每个任务最多生成 3 个补丁方案，用测试选优 [8]，代价是 token 消耗极高（平均不到 2M，最高 13M tokens/patch）。Anthropic 的 harness 博客 [15] 指出一个常见失败模式：agent 用 unit test 验证时误判成功，用浏览器自动化做端到端测试才可靠。

## 三、排行榜上的脚手架

Terminal-Bench 2.0 有 101 个条目，覆盖十几种脚手架和数十个模型组合 [1]。Terminus 2 是 Terminal-Bench 团队（Laude Institute）做的最小化参考脚手架 [23]，只有一个 headless bash 工具，不含提示优化、规划策略或验证循环。它在排行榜上出现了十多次，每次搭配不同模型，提供了衡量其他脚手架增益的基线。

以下按排名介绍排行榜上的主要脚手架，对于没有公开信息及技术细节的脚手架暂且略过。

### Simple Codex — #1, 75.1%（GPT-5.3-Codex）

OpenAI 提交的内部 scaffold，不是公开产品 [1]。和 Codex CLI 是两个东西：Codex CLI 是 OpenAI 开源的终端 agent（Rust 实现，Apache-2.0）[4]，用户可以安装使用；Simple Codex 是 OpenAI 内部的 benchmark harness，架构细节未公开，这里就不细聊了。

两者的关系可以从基线数据推断。同用 GPT-5.3-Codex，Simple Codex 75.1% vs Terminus 2 64.7%，scaffold 增益 +10.4pp。Codex CLI 用 GPT-5.2 跑到 62.9%，同模型 Terminus 2 只有 54.0%，scaffold 增益 +8.9pp [1]。两者的脚手架增益相近（10.4 vs 8.9），Simple Codex 的分数领先主要来自模型升级（5.2→5.3），scaffold 优化也有贡献但不是主因。

### Factory Droid — #3, 69.9%（Opus 4.6）

Factory AI 的核心产品 [8]。四个模型（Opus 4.6、GPT-5.2、Opus 4.5、Gemini 3 Pro）全部提交，全部进入前 15 名。这是排行榜上模型覆盖面最广的脚手架，也是证明脚手架泛化能力最有力的数据。

核心架构：

- **三层提示层级**：工具描述、系统提示、系统通知分离，利用递近偏差把关键指令放在上下文窗口末端
- **工具极简主义**：严格限制工具数量和 schema 复杂度，为每个模型创建定制的工具变体（比如 Claude 用 FIND_AND_REPLACE，GPT 用 unified diff）
- **多轨迹生成**：每个任务最多生成 3 个补丁方案，用测试选优
- **短超时策略**：工具调用设短超时，快速失败而非长时间等待

同模型对比：Opus 4.6 上 Droid 69.9% vs Claude Code 58.0%，差距 +11.9pp。Opus 4.5 上 63.1% vs 52.1%，差距 +11.0pp。这个差距在两代模型上保持稳定，说明脚手架优势具有持续性。

社区评价两极 [16]：benchmark 数据过硬，但实际使用体验有问题（响应慢、代码质量需要手动修改、有虚假测试报告的案例）。token 消耗最高可达 13M/patch [17]。

### Junie CLI — #8, 64.3%（Gemini 3 Flash）

JetBrains 出品 [12]。用 Gemini 3 Flash（一个相对便宜的模型）跑到第八名，比 Google 自家的 Gemini CLI 用同一个 Flash 模型高出 13.3 个百分点 [1]。这是排行榜上同模型脚手架增益最大的案例之一。

核心架构：

- **强制显式规划**：生成 requirements.md 和 plan.md 后才开始编码
- **IDE 原生 AST 解析**：直接利用 JetBrains IDE 的代码检查引擎，理论上比 grep 搜索更精确
- **gear-shift 自动模型切换**：根据任务复杂度在不同模型间切换
- **TeamCity 评估 pipeline**：每次评估至少 100 个任务，工程化的评估基础设施

Junie CLI 证明了一件事：不需要最贵的模型，好的脚手架可以让便宜模型跑出接近顶尖的成绩。

### Codex CLI — #11, 62.9%（GPT-5.2）

OpenAI 的开源 CLI 工具，Rust 实现，54 个 crate，Apache-2.0 协议 [4]。七个模型版本提交，从 GPT-5.2 的 62.9% 到 GPT-5-Nano 的 11.5%，覆盖了完整的模型能力谱系。

核心架构：

- **SQ/EQ 异步模式**：用户界面（SQ）与 agent 执行（EQ）解耦，支持同时运行多个 agent
- **V4A diff 格式**：配合 tree-sitter 做 patch 解析，比纯文本 diff 更可靠
- **上下文压缩**：encrypted_content 有损压缩，支持有效无限长对话
- **完全开源**：唯一一个 CLI 代码完全可审查的厂商工具

Token 效率是 Claude Code 的 3.3 倍：完成同等任务约 72K tokens，Claude Code 约 235K tokens [18]。

### Warp — #14, 61.2%

终端原生应用 [5]。三次提交（61.2%、59.1%、50.1%），v1 版本曾拿过排行榜第一。

核心架构：

- **双模型策略**：Opus 做规划生成 Todo 列表，Sonnet 做执行。他们发现直接用 Opus 做执行反而不如这种分工组合
- **PTY 深度集成**：直接连接伪终端流，能向 PTY 写入任意字节（Ctrl+C、方向键），支持 REPL 和交互式 shell。这是其他 CLI 工具做不到的
- **强制 Todo 规划**：试过条件式规划和 extended thinking 替代，都不如强制规划

### Claude Code — #22, 58.0%（Opus 4.6）

Anthropic 出品 [3]。七个模型提交，从 Opus 4.6 的 58.0% 到 Haiku 4.5 的 27.5%。

一个值得注意的数据：Claude Code 在 Opus 4.6 上的 58.0% 比 Terminus 2 基线的 62.9% 低了 4.9pp [1]。Opus 4.5 上同样如此：Claude Code 52.1% vs Terminus 2 57.8%，低了 5.7pp。这说明 Claude Code 的脚手架在终端任务上产生了负增益。可能的原因是 Claude Code 的 24 个工具和复杂提示体系是为通用编码任务设计的，在纯终端操作场景中引入了不必要的复杂度。

核心架构：

- **单线程主循环 + 实时转向**：用户可在 agent 工作中注入新指令
- **Sub-agent 系统**：Plan/Explore/通用 Agent/Bash Agent 四种子 agent，用于隔离执行
- **24 个工具**：功能全面，从文件操作到 TodoWrite 状态追踪
- **CLAUDE.md 多级记忆**：项目级、目录级、用户级、组织级四层配置
- **93+ 版本系统提示迭代**：社区通过逆向工程追踪了完整的提示演进历史 [9]

Claude Code 被 Droid 超了 11.9pp，被 Terminus 2 基线超了 4.9pp，但它仍然是使用最广泛的 CLI agent 之一，也是 Anthropic 内部 agent 研究的载体。Terminal-Bench 衡量的是终端任务，Claude Code 的设计目标远不止于此。

### Gemini CLI 与 OpenHands

**Gemini CLI** 是 Google 的开源 CLI [13]，起步相对较晚，还在持续优化中。架构上的亮点是双包分层（CLI + Core），第三方可以只复用 Core 层自建产品，以及复杂度驱动的模型路由（Flash/Pro 自动切换）。其余能力（ReAct 循环、工具系统、GEMINI.md 上下文注入）和前文介绍的框架类似。

Terminal-Bench 2.0 上三次提交分数分别是 51.0%、19.6%、15.4% [1]。同一模型家族在第三方脚手架上表现更好：Ante（Gemini 3 Pro）64.7%（#6）、Junie CLI（Gemini 3 Flash）64.3%（#8）[1]。

**OpenHands** 是开源学术项目 [14]，十个模型提交，60K+ stars，400+ 贡献者。Opus 4.5 下 51.9%。事件溯源架构（所有交互建模为不可变事件）让它成为最适合做脚手架研究的平台，但 Terminal-Bench 成绩一般。OpenHands 在 SWE-bench Verified 上达到 72.8%（Sonnet 4.5 + extended thinking），擅长代码修改类任务而非终端操作。

### 其他值得注意的条目

**Ante** 用 Gemini 3 Pro 拿到 64.7%（#6），是 Gemini 生态中表现最好的第三方脚手架 [1]。

**II-Agent**（Intelligent Internet）用 Gemini 3 Pro 拿到 61.8%（#13），又一个跑在 Gemini 模型上的第三方 scaffold [1]。

**Letta Code** 在 Opus 4.5 下 59.1%（#19），比 Claude Code 同模型的 52.1% 高出 7pp [1]。

**Goose**（Block）在 Opus 4.5 下 54.3%（#27），开源 [1]。

## 四、没上 Terminal-Bench 的框架

不是所有框架都有 Terminal-Bench 2.0 成绩。有些提交了其他 benchmark，有些什么都没交。这部分直接略过，有兴趣的朋友可以自己看看，就不详谈了。

**Augment Code** 提交了 SWE-bench Pro，同模型（Opus 4.5）对比中拿到 51.80%，排名第一 [7]。它的核心资产是 Context Engine（语义代码索引），脚手架本身极简。这条路线和 Terminal-Bench 上的框架都不同：复杂性不在 agent 循环里，而在上下文基础设施层。不过没有 Terminal-Bench 成绩，终端任务上的表现未知。

**Cursor** 自己没有提交过任何公开 benchmark。唯一的公开分数（SWE-bench Pro 50.21%）来自竞品 Augment Code 的对比测试 [7]。增长最快的 AI IDE，但缺乏第三方验证的性能数据。

**Copilot** 自报 SWE-bench Verified 56.0%，但使用的是 Sonnet 3.7 [19]，数据已过时。最大的用户基数，平台生态绑定（GitHub Issues → Agent → PR → Review）是核心竞争力。

**Cline / Roo Code** 是开源 VS Code 扩展，5M+ 安装，支持 20+ LLM provider，但没有提交任何第三方 benchmark [20]。

## 五、Token 效率

Benchmark 排名之外，token 效率直接决定使用成本。

| 框架 | 单次任务 token 消耗 | 来源 |
|------|-------------------|------|
| Codex CLI | ~72K | Adaline Labs [18] |
| Claude Code | ~235K | Adaline Labs [18] |
| Factory Droid | <2M（平均），13M（最大） | Code Droid Technical Report [17] |

Codex CLI 完成同等任务比 Claude Code 省 3.3 倍。Droid 的多轨迹生成策略消耗最高，一个复杂任务可能用掉 13M tokens。

通过 API 使用 Claude Code（Sonnet：$3/M input, $15/M output），重度用户月费可能超过 $3,650。Max 20x 订阅（$200/月）比直接 API 使用便宜约 18 倍 [21]。Codex CLI 开源免费，用户只付 API 费用，且 token 效率更高，总成本优势明显。

开源工具（Codex CLI、Gemini CLI、OpenHands）的结构性优势是成本完全透明：没有中间层加价，token 消耗可审计。

## 六、结论

回到开头的数据。同一个 Claude Opus 4.6，Droid 脚手架下 69.9%，Terminus 2 基线 62.9%，Claude Code 脚手架下 58.0%。从最差到最好，差距 11.9 个百分点。Gemini 3 Flash 上，Junie CLI 64.3% vs Gemini CLI 51.0%，差距 13.3 个百分点。CCA 论文甚至证明了弱模型加好脚手架可以赢强模型加差脚手架。

从排行榜上能看到几个有数据支撑的规律。强制显式规划的框架（Droid、Junie、Warp）普遍排在前列。工具越少越可靠，Droid 的极简工具策略在四个模型上都进了前 15。开源平台策略有效，第三方基于 Gemini 模型做出了比 Google 自家 CLI 高 13.7 个百分点的 agent。Terminus 2 基线的数据还说明一点：有些脚手架的复杂度在特定任务上反而产生负增益。

同时也能看到一个现象：市面上最流行的几个工具（Cursor、Copilot、Cline）都没有提交 Terminal-Bench 2.0。Cursor 唯一的公开分数来自竞品的对比测试，Copilot 的 SWE-bench Verified 成绩用的是已经过时的模型，Cline 从未提交过任何第三方 benchmark。用户基数和 benchmark 表现之间存在明显的错位。

对于想深入理解脚手架工程的开发者，几个开源项目值得直接阅读源码：Codex CLI 的 Rust 实现（54 个 crate，Apache-2.0 协议）[4]、OpenHands 的事件溯源架构 [14]、Gemini CLI 的双包模块化设计 [13]。Anthropic 的两篇博客也值得读：Building effective agents [10] 讲 agent 模式的选择，Effective harnesses for long-running agents [15] 讲长任务的 harness 设计。

选工具的时候，模型名字只是故事的一半。另一半在脚手架里。

## 附录：参考来源

[1] Terminal-Bench 2.0 Leaderboard — https://www.tbench.ai/leaderboard/terminal-bench/2.0
[2] Confucius Code Agent: Why Scaffolding Matters More Than Model Size — https://arxiv.org/html/2512.10398v4
[3] How Claude Code Works (Anthropic Docs) — https://code.claude.com/docs/en/how-claude-code-works
[4] Unrolling the Codex Agent Loop (OpenAI Blog) — https://openai.com/index/unrolling-the-codex-agent-loop/
[5] How Warp Built a Top Scoring Terminal-Bench Agent (Warp Blog) — https://www.warp.dev/blog/terminal-bench
[6] A Real-Time Index for Your Codebase (Augment Code Blog) — https://www.augmentcode.com/blog/a-real-time-index-for-your-codebase-secure-personal-scalable
[7] Auggie Tops SWE-Bench Pro (Augment Code Blog) — https://www.augmentcode.com/blog/auggie-tops-swe-bench-pro
[8] How Droid Reached #1 on Terminal-Bench (Factory AI Blog) — https://factory.ai/news/terminal-bench
[9] Claude Code System Prompts (Piebald-AI, GitHub) — https://github.com/Piebald-AI/claude-code-system-prompts
[10] Building Effective Agents (Anthropic Blog) — https://www.anthropic.com/research/building-effective-agents
[12] The Agentic AI Era at JetBrains Is Here (JetBrains Blog) — https://blog.jetbrains.com/junie/2025/07/the-agentic-ai-era-at-jetbrains-is-here/
[13] Gemini CLI Architecture (Gemini CLI Docs) — https://geminicli.com/docs/architecture/
[14] OpenHands: An Open Platform for AI Software Developers as Generalist Agents — https://arxiv.org/html/2511.03690v1
[15] Effective Harnesses for Long-Running Agents (Anthropic Blog) — https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
[16] Factory AI CodeDroid: Promising Concept, Premature Execution (HyperDev Review) — https://hyperdev.matsuoka.com/p/factory-ai-codedroid-promising-concept
[17] Code Droid Technical Report (Factory AI) — https://factory.ai/news/code-droid-technical-report
[18] Claude Code vs OpenAI Codex (Adaline Labs) — https://labs.adaline.ai/p/claude-code-vs-openai-codex
[19] GitHub Copilot: Meet the New Coding Agent (GitHub Blog) — https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/
[20] Cline Architecture (DeepWiki) — https://deepwiki.com/cline/cline
[21] Claude Code Pricing (ClaudeLog) — https://claudelog.com/claude-code-pricing/
[23] Terminal-Bench: A Terminal-Centric Benchmark for AI Agents — https://arxiv.org/abs/2601.11868
