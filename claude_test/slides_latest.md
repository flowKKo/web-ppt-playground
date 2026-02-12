<!-- Density: rich | Slides: 23 | Script: voiceover.md | Source: full.md | Lang: zh -->
<!-- Slide Plan:
| #  | Section | Type            | Core Message                          | Visual              | Animation        |
|----|---------|-----------------|---------------------------------------|----------------------|------------------|
| 1  | S1      | title           | 模型只是一半，脚手架是另一半           | —                    | appear           |
| 2  | S1      | placeholder     | Terminal-Bench 2.0 是什么              | 占位图+大数字         | appear+countUp   |
| 3  | S1      | data-comparison | Opus 4.6 同模型分差近 12 分            | 大数字+微型进度条     | countUp          |
| 4  | S1      | diagram         | 脚手架 = 包裹模型的工程层              | 架构图               | appear           |
| 5  | S1      | bar-chart       | 脚手架增益 5-10 分                     | 堆叠双色条形图        | growBar          |
| 6  | S2      | key-point       | 脚手架的六个维度                       | —                    | appear           |
| 7  | S2a     | comparison      | 上下文管理：搜索 vs 索引               | 对比图示              | revealGroup      |
| 8  | S2b     | data-comparison | 工具可靠性是乘法                       | 大数字               | countUp          |
| 9  | S2b     | comparison      | 极简工具 vs 全面工具                   | 对比图示              | revealGroup      |
| 10 | S2c     | diagram         | 三层提示结构与递近偏差                 | 层级架构图            | appear           |
| 11 | S2d     | comparison      | 强制 / 可选 / 隐式规划                 | 三列对比              | revealGroup      |
| 12 | S2e     | grid            | 跨会话记忆：Markdown 文件方案          | 网格                 | revealGroup      |
| 13 | S2f     | data-comparison | 验证反馈：3 方案选优 vs 自检陷阱       | 大数字               | countUp          |
| 14 | S3      | key-point       | 排行榜上的代表选手                     | —                    | appear           |
| 15 | S3      | bar-chart       | TB 2.0 排名总览                        | 横向条形图            | growBar          |
| 16 | S3a     | player-card     | Simple Codex #1, 75.1                  | 特性+排名             | countUp+reveal   |
| 17 | S3b     | player-card     | Factory Droid #3, 69.9                 | 特性+排名             | countUp+reveal   |
| 18 | S3c     | data-comparison | Junie CLI：便宜模型的逆袭 +13.3 分     | 大数字               | countUp          |
| 19 | S3d     | player-card     | Claude Code #22, 58.0（低于基线）      | 特性+排名             | countUp+reveal   |
| 20 | S3e     | card-grid       | Gemini CLI 架构亮点                    | 卡片                 | revealGroup      |
| 21 | S4      | bar-chart       | Token 效率差 3.3 倍                    | 横向条形图+面积对比    | growBar+countUp  |
| 22 | S5      | list            | 深入了解推荐路线                       | 图示                 | appear           |
| 23 | S5      | key-point       | 模型只是故事的一半                     | —                    | appear           |
-->

# 模型只是一半：脚手架如何优化 AI 的编程能力

---

## Slide 1: 标题页
- type: title
- 标题: 模型只是一半
- 副标题: 脚手架如何优化 AI 的编程能力？
- 标注: Terminal-Bench 2.0 数据 · 截止 2026 年 2 月 9 日
- 动画: appear（整体淡入，duration 0.6s，ease-out）

---

## Slide 2: Terminal-Bench 2.0 · benchmark 概览
- type: placeholder
- 标题: Terminal-Bench 2.0：101 个 AI 编程 Agent 的终端任务竞技场
- 正文: 覆盖 100+ 真实 GitHub CLI 任务（git 操作、脚本调试、配置修复），要求 agent 端到端完成，衡量模型与脚手架的组合效果
- 占位图:
  - 标题: "Terminal-Bench 2.0 排行榜截图"
  - 外观描述: >
      宽高比 16:9 的虚线矩形框，占幻灯片内容区域左侧 55% 宽度，垂直居中。
      边框: 2px dashed rgba(0,0,0,0.15)，圆角 rounded-xl (12px)。
      背景: rgba(0,0,0,0.02)。
      框内垂直水平居中显示标题文字 "Terminal-Bench 2.0 排行榜截图"，
      字号 text-lg，颜色 rgba(0,0,0,0.25)，斜体。
      左下角小字标注 "[截图占位]"，text-xs，rgba(0,0,0,0.15)。
  - 预期内容: >
      Terminal-Bench 2.0 官网 (tbench.ai) 排行榜页面截图。
      需要展示前 10 名 agent 的完整排名表格，
      包含 agent 名称、模型、分数列。
      需要用高亮框标注 Claude Opus 4.6 出现的多个条目:
      第 3 名 Droid (69.9%) 和第 22 名 Claude Code (58.0%)。
  - 动画描述: >
      F0 立即显示: 虚线框 opacity 0→1 + y:12→0 淡入上移，
      duration 0.5s，ease-out。框内标题文字在框出现后延迟 0.2s 淡入。
- 数据:
  - 条目数: 101（正向色）
  - 覆盖任务: 100+（中性色）
- 图表:
  - 类型: 大数字
  - 数据:
    - 101: Agent 条目（正向色）
  - 外观描述: >
      占位图右侧，右对齐区域（占 35% 宽度）。
      一个大数字指标块，垂直居中。
      大数字 "101" 字号 text-8xl，font-extrabold，accentPositive 色。
      下方标签 "AI 编程 Agent 参与评测"，text-lg，textSecondary 色。
      标签下方微型进度条 h-1.5 rounded-full w-32，accentPositive/30 底色，填充 100%。
  - 动画描述: >
      F1 触发: 大数字 countUp 0→101，duration 0.8s，ease-out。
      同步微型进度条 growBar 0%→100%，duration 0.8s。
      标签文字在 countUp 完成后 appear（opacity 0→1，0.3s）。
- 动画:
  - fragments: 2
  - 步骤:
    - F0: 标题 + 正文 + 占位图框（appear）
    - F1: 右侧大数字 101（countUp）+ 进度条（growBar）+ 标签（appear）
- 布局: 大数字面板
- 结论: 排行榜涵盖十几种脚手架与数十个模型的交叉组合

---

## Slide 3: 同模型分差近 12 分 · Opus 4.6
- type: data-comparison
- 标题: 同一个 Opus 4.6，分差 11.9 个百分点
- 正文: Claude Opus 4.6 在排行榜上出现多次，最低 58.0%（Claude Code），最高 69.9%（Droid），差距来自脚手架
- 数据:
  - 最低分: 58.0%（负向色，Claude Code #22）
  - 最高分: 69.9%（正向色，Droid #3）
  - 差值: 11.9pp
- 图表:
  - 类型: 大数字 + 微型进度条
  - 数据:
    - 最低分: 58.0（负向色，进度条 58/100）
    - 最高分: 69.9（正向色，进度条 70/100）
  - 进度条最大值: 100
  - 外观描述: >
      水平排列的 2 个指标块，间距 gap-12，整体水平居中。
      左侧指标块:
      - 上方小标签 "最低分 · Claude Code #22"，text-sm，textCaption 色
      - 大数字 "58.0"，text-8xl，font-extrabold，accentNegative 色（红）
      - 下方微型进度条 h-2 rounded-full，w-48 为满宽。
        底色 barTrack（浅灰），填充色 accentNegative，填充宽度 58%。
      - 进度条下方: "%"，text-lg，textCaption 色
      右侧指标块:
      - 上方小标签 "最高分 · Droid #3"，text-sm，textCaption 色
      - 大数字 "69.9"，text-8xl，font-extrabold，accentPositive 色（绿）
      - 下方微型进度条 h-2 rounded-full，w-48 为满宽。
        底色 barTrack，填充色 accentPositive，填充宽度 70%。
      - 进度条下方: "%"，text-lg，textCaption 色
      两个指标块中间有一个竖向分隔元素:
      - 细竖线 1px solid rgba(0,0,0,0.08)，高 80px
      - 竖线中间叠加一个圆角标签框: "Δ 11.9pp"，text-base，font-semibold，
        accentWarning 背景色（浅橙），padding px-3 py-1，rounded-full。
  - 动画描述: >
      F1 触发: 左侧数字 countUp 0→58.0（0.8s，ease-out），
      同时进度条 growBar 0%→58%（0.8s）。
      F2 触发: 右侧数字 countUp 0→69.9（0.8s），
      同时进度条 growBar 0%→70%（0.8s）。
      Δ 标签在 F2 完成后 0.2s 延迟 appear（opacity 0→1 + scale 0.8→1，0.3s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 最低分 58.0（countUp）+ 进度条（growBar）
    - F2: 最高分 69.9（countUp）+ 进度条（growBar）+ Δ 11.9pp 标签（appear）
- 布局: 大数字面板
- 结论: 同一个模型，脚手架不同，分差接近 12 个百分点

---

## Slide 4: 什么是脚手架 · 架构示意
- type: diagram
- 标题: 脚手架 = 包裹在模型外面的工程层
- 正文: 脚手架决定给模型看什么上下文、能调用哪些工具、怎么验证结果、怎么跨会话保持记忆，与模型共同决定 AI 编程性能
- 图示:
  - 类型: 同心层级架构图
  - 外观描述: >
      同心矩形嵌套结构，水平居中，max-w-[70%]。
      最内层（核心）: 深色矩形（accentPrimary/20 背景 + 2px solid accentPrimary 边框），
      圆角 rounded-lg，padding 16px，内部文字 "LLM 模型"（text-xl，font-bold，textPrimary）。
      尺寸约 w-40 h-16，居中。
      外层（脚手架层）: 更大的矩形（accentNeutral/10 背景 + 1px solid accentNeutral/30 边框），
      圆角 rounded-xl，与内层间距均匀 padding 32px。
      外层四个边各标注一个维度:
      - 上方: "上下文管理"（text-sm，textSecondary），带向内箭头指向核心
      - 右方: "工具设计"（text-sm，textSecondary），带向内箭头
      - 下方: "验证反馈"（text-sm，textSecondary），带向外箭头（表示输出）
      - 左方: "记忆持久化"（text-sm，textSecondary），带双向箭头
      外层矩形右上角标注 "提示工程"，左下角标注 "任务分解"。
      所有标注使用 text-sm，accentNeutral 色，加细线连接到对应边。
      最外层有虚线矩形框（1px dashed rgba(0,0,0,0.1)），
      右下角标注 "脚手架 (Scaffold)"，text-base，font-semibold，textCaption 色。
  - 动画描述: >
      F1 触发: 最内层 "LLM 模型" 矩形从 opacity 0 + scale 0.9 → opacity 1 + scale 1，
      duration 0.4s，ease [0.16,1,0.3,1]。
      F2 触发: 外层脚手架矩形从 opacity 0 + scale 0.95 → opacity 1 + scale 1（0.5s），
      随后六个维度标注逐一 appear，stagger 0.1s，从上方开始顺时针出现。
      每个标注: opacity 0→1 + 从对应方向位移 8px→0（上方从 y:-8 出发，右方从 x:8 出发等）。
      最后虚线外框 appear（opacity 0→0.5，0.3s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 核心 LLM 模型矩形（appear + scale）
    - F2: 外层脚手架框 + 六个维度标注逐一出现（revealGroup，stagger 0.1s）
- 布局: 无边框网格

---

## Slide 5: 脚手架增益 5-10 分
- type: bar-chart
- 标题: 5-10 分增益，从中游到前三
- 正文: 同一个模型搭配不同脚手架，分数差距可达 10 个百分点以上
- 图表:
  - 类型: 堆叠双色条形图
  - 数据:
    | 模型 | 基线 (Terminus 2) | 增益 | 总分 | 最佳脚手架 |
    |------|------------------|------|------|-----------|
    | GPT-5.3 | 64.7 | +10.4 | 75.1 | Simple Codex |
    | Opus 4.6 | 62.9 | +7.0 | 69.9 | Droid |
  - 基准线: 62.9（Terminus 2 + Opus 4.6 基线，虚线）
  - 排序: 按总分降序
  - 外观描述: >
      2 条水平堆叠条形，垂直排列，间距 gap-5，整体居中（max-w-[85%]）。
      每条结构: 左侧标签区（w-32）显示模型名，text-right，text-base，textSecondary。
      条形区由两段无间隙拼接:
      - 灰色段（barTrack 色 rgba(0,0,0,0.08)）: 代表基线分数。
      - 绿色段（accentPositive）: 代表增益分数，紧接灰段。
      条形总高度 h-10，仅最右端有圆角 rounded-r-lg。
      GPT-5.3 行: 灰段宽度 86.2%（64.7/75.1），绿段宽度 13.8%（10.4/75.1），总宽 100%（最长条）。
      Opus 4.6 行: 灰段宽度 84.0%（62.9/75.1 × 93.1%），绿段宽度 9.3%（7.0/75.1），总宽 93.1%（69.9/75.1）。
      右侧标注区: 总分数字（text-xl，font-bold，textPrimary）+ 空格 + 绿色小字 "(+10.4)"（text-sm，accentPositive，font-medium）。
      下方第二行: 脚手架名（text-sm，textCaption，italic）。
      在 62.9 分对应的 x 位置（83.8%），有一条竖向虚线（1px dashed rgba(0,0,0,0.15)），
      贯穿两条条形区域。虚线上方标注 "Terminus 2 基线 62.9"（text-xs，textCaption，italic）。
  - 动画描述: >
      F1: 2 条灰色基线段从 width:0 生长到目标宽度，duration 0.6s，ease [0.16,1,0.3,1]。
      两条之间 stagger 0.1s。基准虚线在灰段经过 62.9 位置时淡入（opacity 0→1，0.3s）。
      F2: 绿色增益段从灰段末端继续生长，duration 0.5s，ease [0.16,1,0.3,1]。
      同时右侧增益数字 countUp（0→+10.4 / 0→+7.0，0.5s，ease-out）。
      脚手架名标签 appear（0.3s，延迟 0.2s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 灰色基线段生长（growBar）+ 基准线出现
    - F2: 绿色增益段生长（growBar）+ 增益数字（countUp）+ 脚手架名（appear）
- 布局: 大数字面板
- 结论: 5-10 个百分点的增益，足以把排名从中游拉到前三

---

## Slide 6: 六个维度 · 过渡页
- type: key-point
- 标题: 脚手架做了什么？
- 副标题: 六个维度拆解脚手架的工程差异
- 动画: appear（整体淡入，duration 0.5s）

---

## Slide 7: 上下文管理 · 运行时搜索 vs 语义索引
- type: comparison
- 标题: 上下文管理：给模型看什么决定了它能做什么
- 正文: 代码库几十万行，context window 有限，三种主流路线已经分化
- 左列:
  - 名称: 运行时搜索
  - 代表: Claude Code / Codex CLI
  - 要点: 零初始化成本，按需搜索
  - 细节: agent 执行时通过 grep、find 按需查找代码，不做预处理
  - 结果: 搜索质量依赖模型构造查询能力，消耗更多 token
- 右列:
  - 名称: 语义索引
  - 代表: Augment Code
  - 要点: 自研 embedding，实时语义索引
  - 细节: 为整个代码库建立实时语义索引，从庞大代码库中精准定位
  - 结果: SWE-bench Pro 同模型对比 Auggie 51.80% vs Claude Code 49.75%
- 图示:
  - 类型: 双路径对比图
  - 外观描述: >
      左右对称布局，各占 45% 宽度，中间 10% 为分隔区域。
      左路径（运行时搜索）:
      - 顶部图标区: 放大镜图标（SVG，24x24，accentNeutral 色），旁边文字 "运行时搜索"（text-lg，font-semibold）
      - 流程: 3 个纵向连接的小节点，间距 gap-2
        1. "代码库"（矩形，accentNeutral/10 背景，text-sm）
        2. "grep / find"（矩形，accentNeutral/15 背景，text-sm，加向下箭头）
        3. "搜索结果 → 模型"（矩形，accentNeutral/20 背景，text-sm）
      - 底部标签: "✓ 零初始化" + "✗ 费 token"（text-xs，分别为 accentPositive 和 accentNegative）
      右路径（语义索引）:
      - 顶部图标区: 网络图标（SVG，24x24，accentPositive 色），旁边文字 "语义索引"（text-lg，font-semibold）
      - 流程: 3 个纵向连接的小节点
        1. "代码库"（矩形，accentPositive/10 背景）
        2. "Embedding 模型"（矩形，accentPositive/15 背景，加向下箭头）
        3. "语义索引 → 精准定位"（矩形，accentPositive/20 背景）
      - 底部标签: "✓ 精准" + "✗ 投入大"（text-xs）
      中间分隔: 竖向虚线（1px dashed rgba(0,0,0,0.1)），中间有 "VS" 字样（text-sm，textCaption，加圆形背景 rgba(0,0,0,0.05)）。
  - 动画描述: >
      F1: 左路径整体 appear（opacity 0→1 + x:-16→0），duration 0.5s，ease-out。
      节点从上到下 stagger 0.1s 出现。
      F2: 右路径整体 appear（opacity 0→1 + x:16→0），duration 0.5s，ease-out。
      节点从上到下 stagger 0.1s。中间 VS 标记在两侧都出现后 0.2s 淡入。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 左列「运行时搜索」路径（revealGroup）
    - F2: 右列「语义索引」路径（revealGroup）+ VS 标记（appear）
- 布局: 无边框网格
- 结论: Augment Code 未提交 Terminal-Bench 2.0，语义索引在终端任务上的优势尚不确定

---

## Slide 8: 工具可靠性是乘法
- type: data-comparison
- 标题: 每一步的可靠性都在做乘法
- 正文: 更少的工具意味着更短的调用链，更简单的 schema 意味着更低的单步出错率
- 数据:
  - 场景 A: 单步 80%，10 步 → 0.8¹⁰ = 10.7%（负向色）
  - 场景 B: 单步 90%，8 步 → 0.9⁸ = 43.0%（正向色）
- 图表:
  - 类型: 大数字 + 微型进度条
  - 数据:
    - 场景 A: 10.7%（负向色，进度条 10.7/100）
    - 场景 B: 43.0%（正向色，进度条 43/100）
  - 进度条最大值: 100
  - 外观描述: >
      水平排列的 2 个指标块，间距 gap-12，整体水平居中。
      左侧指标块（场景 A）:
      - 上方公式标签: "0.8¹⁰"（text-lg，font-mono，textSecondary）
      - 上方描述: "单步 80% × 10 步"（text-sm，textCaption）
      - 大数字 "10.7%"，text-7xl，font-extrabold，accentNegative 色
      - 下方微型进度条 h-2 rounded-full，w-48。
        底色 barTrack，填充色 accentNegative，填充宽度 10.7%。
      右侧指标块（场景 B）:
      - 上方公式标签: "0.9⁸"（text-lg，font-mono，textSecondary）
      - 上方描述: "单步 90% × 8 步"（text-sm，textCaption）
      - 大数字 "43.0%"，text-7xl，font-extrabold，accentPositive 色
      - 下方微型进度条 h-2 rounded-full，w-48。
        底色 barTrack，填充色 accentPositive，填充宽度 43%。
      中间分隔: 一个大号右箭头 "→"（text-4xl，textCaption），
      上方标注 "提升单步 +10%"（text-xs，accentPositive），
      下方标注 "减少步骤 −2"（text-xs，accentPositive）。
      底部居中一行结论文字区域（宽度 max-w-[80%]）。
  - 动画描述: >
      F1: 左侧公式 + 数字 countUp 0→10.7（0.8s，ease-out），
      同时进度条 growBar 0%→10.7%（0.8s）。
      F2: 箭头 appear（opacity 0→1 + x:-8→0，0.3s）。
      右侧公式 + 数字 countUp 0→43.0（0.8s），
      同时进度条 growBar 0%→43%（0.8s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 场景 A 大数字 10.7%（countUp）+ 进度条（growBar）
    - F2: 箭头 + 场景 B 大数字 43.0%（countUp）+ 进度条（growBar）
- 布局: 大数字面板
- 结论: 单步可靠性从 80% 提升到 90%、步骤从 10 减至 8，全程成功率从 10.7% 跃升至 43.0%

---

## Slide 9: 工具设计 · 极简 vs 全面
- type: comparison
- 标题: 工具越少越可靠 vs 工具越多越全面
- 正文: Factory Droid 极简工具四个模型全进前 15；Claude Code 24 个工具覆盖完整开发流程
- 左列:
  - 名称: 极简路线 · Factory Droid
  - 要点: 工具数量严格限制
  - 细节: 简化输入 schema，为不同模型创建定制工具变体（Claude 用 FIND_AND_REPLACE，GPT 用 unified diff）
  - 结果: 四个模型提交，全部进入前 15 名
- 右列:
  - 名称: 全面路线 · Claude Code
  - 要点: 24 个内建工具
  - 细节: 文件读写、regex 搜索、TodoWrite 状态追踪等，核心思路是防呆设计(poka-yoke)
  - 结果: 工具优化时间 > prompt 优化时间
- 图示:
  - 类型: 双栏对比图
  - 外观描述: >
      左右对称布局，各占 45% 宽度。
      左栏（极简路线）:
      - 标题区: "Factory Droid"（text-lg，font-semibold）+ 标签 "极简"（text-xs，accentPositive 背景，rounded-full，px-2）
      - 内容: 3 个小方块图标代表少量工具，排成一行（gap-3）。
        每个方块: 32x32，rounded-md，accentNeutral/15 背景，内有工具图标（SVG 16x16）。
      - 下方标签: "为每个模型定制工具变体"（text-sm，textSecondary）
      - 底部成果: 徽章样式 "4 模型 → 全部 Top 15"（text-sm，font-semibold，accentPositive 色，
        左侧有勾选图标）
      右栏（全面路线）:
      - 标题区: "Claude Code"（text-lg，font-semibold）+ 标签 "全面"（text-xs，accentPrimary 背景，rounded-full，px-2）
      - 内容: 4×6 的小方块网格代表 24 个工具（gap-1.5）。
        每个方块: 16x16，rounded-sm，accentPrimary/10 背景。
        其中部分高亮（accentPrimary/25）表示核心工具。
      - 下方标签: "防呆设计，参数降低出错率"（text-sm，textSecondary）
      - 底部成果: "花在工具优化上的时间 > prompt 优化"（text-sm，textCaption，italic）
      中间: 竖向虚线 + "VS" 标记（同 Slide 7 样式）。
  - 动画描述: >
      F1: 左栏整体 appear（opacity 0→1 + x:-12→0，0.5s），
      3 个工具方块 stagger 0.08s 出现，底部成果延迟 0.2s 淡入。
      F2: 右栏整体 appear（opacity 0→1 + x:12→0，0.5s），
      24 个小方块以波浪式 stagger（0.02s each）从左上到右下出现，底部引用延迟 0.3s。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 左列「极简路线」（revealGroup）
    - F2: 右列「全面路线」（revealGroup）
- 布局: 无边框网格

---

## Slide 10: 三层提示结构 · 递近偏差
- type: diagram
- 标题: 三层提示层级，利用递近偏差
- 正文: Factory Droid 把关键指令放在上下文窗口末端，利用模型对最新内容赋予更高优先级的特性
- 图示:
  - 类型: 三层堆叠架构图
  - 外观描述: >
      纵向排列的 3 个矩形层，从上到下分别是，整体居中，max-w-[65%]。
      第 1 层（顶部）: accentNeutral/8 背景，标题 "① 工具描述"（text-base，font-semibold），
      副文字 "定义每个工具的能力规格"（text-sm，textSecondary），
      高度约 64px，全宽，圆角 rounded-lg，padding px-5 py-3。
      第 2 层（中部）: accentNeutral/12 背景，标题 "② 系统提示"（text-base，font-semibold），
      副文字 "设定高层目标与大方向"（text-sm，textSecondary），
      同样高度和样式。
      第 3 层（底部）: accentNeutral/20 背景 + 左侧 3px solid accentPositive 边框高亮，
      标题 "③ 系统通知"（text-base，font-bold，accentPositive 色），
      副文字 "上下文窗口末端 · 关键指令注入"（text-sm，font-medium，accentPositive/80），
      右侧小徽章 "最后读到 = 印象最深"（text-xs，accentPositive/20 背景，rounded-full，px-2）。
      层与层之间 gap-2。
      右侧有一个竖向箭头（SVG，从第 1 层顶部到第 3 层底部），
      箭头线条 2px solid accentNeutral/30，箭头方向朝下。
      箭头旁边标注 "递近偏差 (Recency Bias)"（text-sm，italic，textCaption），
      加一个小提示: "↓ 优先级递增"（text-xs，textCaption）。
      左下方补充: "Claude Code: 28 组件 + 40+ 系统提醒"（text-xs，textCaption，accentNeutral/60 背景，rounded，px-2 py-1）。
  - 动画描述: >
      F1 触发: 3 层从上到下依次出现（appear），每层间隔 0.15s。
      每层入场动画: opacity 0→1 + y:12→0，duration 0.4s。
      第 3 层入场后，左侧绿色边框从高度 0 向下展开到全高（growBar 式，0.3s）。
      F2 触发: 右侧箭头 appear（opacity 0→1 + scaleY 0.5→1，0.4s，延迟 0.1s）。
      箭头标注文字 appear（0.3s，延迟 0.2s）。
      左下方 Claude Code 补充标签 appear（0.3s，延迟 0.3s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 三层结构逐层出现（appear，stagger 0.15s）+ 第 3 层绿色边框（growBar）
    - F2: 右侧箭头 + 递近偏差标注（appear）+ Claude Code 补充（appear）
- 布局: 无边框网格

---

## Slide 11: 任务分解 · 三种策略对比
- type: comparison
- 标题: 强制规划的框架排名普遍靠前
- 正文: 从排行榜数据看，强制显式规划的框架排名更高，但不能把差异单独归因于规划策略
- 左列:
  - 名称: 强制显式规划
  - 代表: Junie CLI / Droid
  - 要点: 必须先生成 plan.md 才能编码
  - 细节: Droid 把更新后的计划放在上下文窗口末端，配合递近偏差
  - 结果: Droid #3 / Junie #8
- 中列:
  - 名称: 可选显式规划
  - 代表: Claude Code
  - 要点: TodoWrite 检测到 3+ 步骤时自动激活
  - 细节: 非强制，模型自行决定是否使用
  - 结果: Claude Code #22
- 右列:
  - 名称: 隐式规划
  - 代表: Codex CLI / Gemini CLI
  - 要点: 靠推理 token / extended thinking
  - 细节: 不额外消耗规划工具调用，依赖模型自身能力
  - 结果: Gemini CLI 后半段
- 图示:
  - 类型: 三列对比 + 排名标注
  - 外观描述: >
      三列等宽布局，各占 30% 宽度，间距 gap-4，水平居中。
      每列结构:
      - 顶部圆形排名徽章: 直径 48px，居中。
        左列: accentPositive 背景，白色文字 "#3"。
        中列: accentWarning 背景，白色文字 "#22"。
        右列: accentNeutral 背景，白色文字 "后半段"（text-xs）。
      - 策略名称: text-lg，font-semibold，居中。
      - 代表工具: text-sm，textCaption，居中。
      - 分隔线: 1px solid rgba(0,0,0,0.06)，my-3。
      - 要点描述: text-sm，textSecondary，居中，1-2 行。
      - 底部关键词: 左列 "plan.md 必须生成"（text-xs，accentPositive/15 背景，rounded，px-2 py-1）。
        中列 "3+ 步骤自动激活"（text-xs，accentWarning/15 背景）。
        右列 "依赖推理 token"（text-xs，accentNeutral/15 背景）。
      列之间无分隔线，用间距区分。
      底部有一行总结注释: "趋势一致，但不能单独归因于规划策略"（text-xs，textCaption，italic，居中）。
  - 动画描述: >
      F1: 左列整体 appear（opacity 0→1 + y:16→0，0.5s），排名徽章先出现（scale 0.5→1），
      然后内容 stagger 0.08s 向下出现。
      F2: 中列 appear（同样动画，0.5s）。
      F3: 右列 appear（0.5s）。底部注释在所有列出现后 0.3s 淡入。
- 动画:
  - fragments: 4
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 左列「强制规划」（revealGroup）
    - F2: 中列「可选规划」（revealGroup）
    - F3: 右列「隐式规划」（revealGroup）+ 底部注释（appear）
- 布局: 无边框网格

---

## Slide 12: 记忆持久化 · Markdown 文件方案
- type: grid
- 标题: 跨会话记忆：项目根目录的 Markdown 文件
- 正文: 用自然语言告诉 agent 项目约定和禁忌，通过 git 共享给团队，差异在层级深度
- 网格 (2x3):
  1. CLAUDE.md — Claude Code，四级覆盖（组织级 → 目录级）
  2. AGENTS.md — Codex CLI，根目录到子目录逐级加载
  3. GEMINI.md — Gemini CLI，相对简单
  4. guidelines.md — Junie CLI，配合强制规划使用
- 图示:
  - 类型: 层级对比网格
  - 外观描述: >
      2×2 网格布局，gap-4，max-w-[85%]，水平居中。
      每个网格项:
      - 文件名标题: font-mono，text-base，font-semibold，textPrimary。
        文件名前有文件图标（SVG 16x16，textCaption 色）。
      - 工具名: text-sm，textCaption，括号内。
      - 层级指示条: 水平排列的彩色方块，代表支持的层级数。
        CLAUDE.md: 4 个方块（accentPrimary 色，从浅到深），标注 "组织→用户→项目→目录"。
        AGENTS.md: 3 个方块（accentNeutral 色），标注 "根目录→子目录 + 本地覆盖"。
        GEMINI.md: 1 个方块（accentNeutral/50 色），标注 "基础配置"。
        guidelines.md: 2 个方块（accentNeutral 色），标注 "项目级 + 规划配合"。
      - 每个方块: w-8 h-3 rounded-sm，间距 gap-1。
      网格项背景: 透明，仅底部有细线分隔（1px solid rgba(0,0,0,0.04)），padding py-4。
      底部注释: "多数框架的记忆是无状态的，每次会话重新读取"（text-xs，textCaption，italic）。
  - 动画描述: >
      F1 触发: 4 个网格项整体 revealGroup，stagger 0.12s，
      顺序: CLAUDE.md → AGENTS.md → GEMINI.md → guidelines.md。
      每项: opacity 0→1 + y:8→0，0.4s。
      层级指示条内的方块再以 stagger 0.06s 从左到右出现（scale 0→1）。
      底部注释在所有项出现后 0.3s 淡入。
- 动画:
  - fragments: 2
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 四个网格项 + 层级指示条（revealGroup，stagger 0.12s）+ 注释（appear）
- 布局: 无边框网格

---

## Slide 13: 验证反馈 · 多方案选优 vs 自检陷阱
- type: data-comparison
- 标题: 多方案选优有效但代价极高
- 正文: Factory Droid 每个任务最多 3 个补丁方案用测试选优；Anthropic 警告 agent 自写 unit test 验证容易误判
- 数据:
  - Droid 平均 token 消耗: <2M tokens/任务（中性色）
  - Droid 最高 token 消耗: 13M tokens/任务（负向色）
  - 补丁方案数: 3（中性色）
- 图表:
  - 类型: 大数字 + 微型进度条
  - 数据:
    - 补丁方案: 3（中性色，无进度条）
    - 平均消耗: <2M（中性色，进度条 15/100 表示相对比例）
    - 最高消耗: 13M（负向色，进度条 100/100）
  - 外观描述: >
      水平排列 3 个指标块，间距 gap-8，整体居中。
      第 1 个（补丁方案数）:
      - 上方标签 "补丁方案"（text-sm，textCaption）
      - 大数字 "3"，text-6xl，font-extrabold，accentNeutral 色
      - 下方: "个候选方案"（text-sm，textSecondary）
      第 2 个（平均消耗）:
      - 上方标签 "平均 Token 消耗"（text-sm，textCaption）
      - 大数字 "<2M"，text-6xl，font-extrabold，accentWarning 色
      - 下方微型进度条 h-2 w-40，barTrack 底色，accentWarning 填充 15%
      - "tokens/任务"（text-sm，textSecondary）
      第 3 个（最高消耗）:
      - 上方标签 "最高 Token 消耗"（text-sm，textCaption）
      - 大数字 "13M"，text-6xl，font-extrabold，accentNegative 色
      - 下方微型进度条 h-2 w-40，barTrack 底色，accentNegative 填充 100%
      - "tokens/任务"（text-sm，textSecondary）
      底部居中警告卡片（max-w-[80%]，accentWarning/5 背景，rounded-lg，p-3）:
      内容: "⚠ Agent 自写 unit test 验证容易自己考自己——测试过了但代码是错的"（text-sm，accentWarning 色）
      右侧小字: "—— Anthropic harness 博客"（text-xs，textCaption）。
  - 动画描述: >
      F1: 第 1 个数字 "3" countUp 0→3（0.5s）。
      F2: 第 2 个 "<2M" appear（0.4s）+ 进度条 growBar 0→15%（0.6s）。
      第 3 个 "13M" countUp 0→13（0.8s）+ 进度条 growBar 0→100%（0.8s），stagger 0.15s。
      F3: 底部警告卡片 appear（opacity 0→1 + y:8→0，0.4s）。
- 动画:
  - fragments: 4
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 补丁方案数 "3"（countUp）
    - F2: 平均消耗 <2M + 最高消耗 13M（countUp + growBar）
    - F3: 底部警告卡片（appear）
- 布局: 大数字面板
- 结论: 多轨迹验证效果好，但 token 成本极高；自检式验证存在误判风险

---

## Slide 14: 排行榜上的代表选手 · 过渡页
- type: key-point
- 标题: 排行榜上的代表选手
- 副标题: 了解完六个维度，看看谁把它们用得最好
- 动画: appear（整体淡入，duration 0.5s）

---

## Slide 15: Terminal-Bench 2.0 排名总览
- type: bar-chart
- 标题: Terminal-Bench 2.0 主要脚手架排名
- 正文: 101 个条目中的代表性脚手架，Terminus 2 基线（62.9）作为参照
- 图表:
  - 类型: 横向条形图
  - 数据:
    | 排名 | 脚手架 | 模型 | 分数 | 颜色提示 |
    |------|--------|------|------|---------|
    | #1 | Simple Codex | GPT-5.3 | 75.1 | 正向色（最高分） |
    | #3 | Droid | Opus 4.6 | 69.9 | 中性色 |
    | #8 | Junie CLI | Gemini 3 Flash | 64.3 | 中性色 |
    | #11 | Codex CLI | GPT-5.2 | 62.9 | 中性色 |
    | #14 | Warp | — | 61.2 | 中性色 |
    | #22 | Claude Code | Opus 4.6 | 58.0 | 负向色（低于基线） |
    | — | Gemini CLI | Flash | 51.0 | 中性色 |
  - 基准线: 62.9（Terminus 2 + Opus 4.6 基线，竖向虚线）
  - 排序: 降序
  - 外观描述: >
      7 条水平条形，从上到下按分数降序排列，间距 gap-3。
      每条结构:
      - 最左侧: 排名标签（text-sm，font-mono，textCaption，w-10），如 "#1"、"#3"。
      - 标签区（w-36，text-right，text-base，textSecondary）: "脚手架名 · 模型名"，
        脚手架名 font-semibold，模型名 text-xs textCaption。
      - 彩色条形（h-8，rounded-r-lg），宽度按比例（max = 75.1 = 100%）:
        Simple Codex: 100%（accentPositive 绿色）
        Droid: 93.1%（accentNeutral 蓝灰）
        Junie CLI: 85.6%（accentNeutral）
        Codex CLI: 83.8%（accentNeutral）
        Warp: 81.5%（accentNeutral）
        Claude Code: 77.2%（accentNegative 红色）
        Gemini CLI: 67.9%（accentNeutral/60 浅色）
      - 右侧数值（text-lg，font-semibold）。
      在 62.9 对应的 x 位置（83.8%），有竖向虚线（1px dashed rgba(0,0,0,0.2)），
      贯穿所有条形区域。虚线顶部标注 "Terminus 2 基线 62.9"（text-xs，textCaption，italic）。
      Claude Code 的条形末端低于虚线位置，视觉上凸显低于基线。
  - 动画描述: >
      F1 触发: 7 条条形从 width:0 同时开始生长到目标宽度，
      duration 0.8s，ease [0.16,1,0.3,1]。
      条形间 stagger 0.05s（从上到下依次启动）。
      右侧数值同步 countUp（0→目标值，0.8s）。
      基准虚线在条形生长经过 62.9 位置时淡入（opacity 0→1，0.3s）。
      排名标签 "#1" 等在对应条形开始生长时 appear（0.2s）。
- 动画:
  - fragments: 2
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 所有条形同时生长（growBar）+ 数值（countUp）+ 基准线 + 排名标签（appear）
- 布局: 表格

---

## Slide 16: Simple Codex · #1, 75.1%
- type: player-card
- 标题: Simple Codex：排行榜第一，75.1%
- 正文: OpenAI 提交的内部 scaffold，非公开产品。脚手架增益 +10.4pp（vs Terminus 2 基线 64.7%）
- 分数: 75.1%（正向色）
- 排名: #1
- 模型: GPT-5.3-Codex
- 脚手架增益: +10.4pp
- 特性:
  - 架构: OpenAI 内部 benchmark harness，架构细节未公开
  - Token 效率: ~72K tokens/任务（Codex CLI 数据），同任务 Claude Code 要 ~235K
  - 关联工具: Codex CLI（开源 Rust 实现，Apache-2.0，54 个 crate）
  - 关键能力: SQ/EQ 异步模式 · V4A diff + tree-sitter · 上下文压缩
- 图表:
  - 类型: 横向条形图（特性对比）
  - 数据:
    | 指标 | Simple Codex | Terminus 2 基线 |
    |------|-------------|----------------|
    | 分数 | 75.1 | 64.7 |
    | 增益 | +10.4pp | 0 |
  - 外观描述: >
      右侧面板内，一个小型对比条形图。
      2 条水平条形，间距 gap-2。
      第 1 条: 标签 "Simple Codex"（text-sm），绿色条（accentPositive，h-6，rounded-r），
      宽度 100%（75.1/75.1），右侧数值 "75.1"（text-sm，font-semibold）。
      第 2 条: 标签 "Terminus 2"（text-sm），灰色条（barTrack，h-6，rounded-r），
      宽度 86.1%（64.7/75.1），右侧数值 "64.7"（text-sm，textCaption）。
      两条之间的差距区域用浅绿色虚线标注 "+10.4pp"（text-xs，accentPositive）。
  - 动画描述: >
      F2 触发: 两条条形 stagger 0.1s 从 width:0 生长（0.6s，ease-out）。
      数值同步 countUp。差距标注在条形完成后 0.2s appear。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 左侧面板 — 排名 #1（appear）+ 分数 75.1（countUp）+ 模型名（appear）
    - F2: 右侧面板 — 特性列表（revealGroup，stagger 0.1s）+ 对比条形图（growBar）
- 布局: 卡片

---

## Slide 17: Factory Droid · #3, 69.9%
- type: player-card
- 标题: Factory Droid：四个模型全进前 15
- 正文: Factory AI 核心产品，排行榜上模型覆盖面最广的脚手架，但社区评价两极分化
- 分数: 69.9%（正向色）
- 排名: #3
- 模型: Opus 4.6
- 脚手架增益: +7.0pp
- 特性:
  - 三层提示层级: 工具描述 / 系统提示 / 系统通知，利用递近偏差
  - 工具极简主义: 严格限制工具数量，按模型定制变体
  - 多轨迹生成: 每任务最多 3 补丁，测试选优
  - 短超时策略: 快速失败而非长等待
  - 泛化能力: Opus 4.6 (#3) / GPT-5.2 (#5) / Opus 4.5 (#9) / Gemini 3 Pro (前15)
- 争议: benchmark 数据过硬，但实际使用体验有争议（代码质量、响应速度）
- 图表:
  - 类型: 横向条形图（多模型排名）
  - 数据:
    | 模型 | 分数 | 排名 |
    |------|------|------|
    | Opus 4.6 | 69.9 | #3 |
    | GPT-5.2 | 64.9 | #5 |
    | Opus 4.5 | 63.1 | #9 |
  - 外观描述: >
      右侧面板内，3 条水平条形，间距 gap-2。
      每条: 左侧标签为模型名 + 排名（text-sm），条形 h-6 rounded-r。
      Opus 4.6: accentPositive 色，宽度 100%（69.9/69.9），右侧 "69.9 #3"。
      GPT-5.2: accentNeutral 色，宽度 92.8%（64.9/69.9），右侧 "64.9 #5"。
      Opus 4.5: accentNeutral 色，宽度 90.3%（63.1/69.9），右侧 "63.1 #9"。
      条形下方标注: "全部进入 Top 15"（text-xs，accentPositive，font-medium）。
  - 动画描述: >
      F2 触发: 3 条条形 stagger 0.1s 从 width:0 生长（0.6s，ease-out）。
      数值同步 countUp。"全部 Top 15" 标注在条形完成后 0.2s appear。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 左侧面板 — 排名 #3 + 分数 69.9（countUp）+ 脚手架增益 +7.0（appear）
    - F2: 右侧面板 — 特性列表（revealGroup）+ 多模型条形图（growBar）+ 争议标注（appear）
- 布局: 卡片

---

## Slide 18: Junie CLI · 便宜模型的逆袭
- type: data-comparison
- 标题: Junie CLI：便宜模型逆袭，同模型增益 +13.3 分
- 正文: JetBrains 出品，用 Gemini 3 Flash（便宜模型）跑到第八名，比 Google 自家 Gemini CLI 同模型高出 13.3 分——排行榜上同模型脚手架增益最大的案例之一
- 数据:
  - Junie CLI (Flash): 64.3%（正向色，#8）
  - Gemini CLI (Flash): 51.0%（负向色）
  - 差值: 13.3pp（正向色）
- 关键数字: 13.3pp
- 图表:
  - 类型: 大数字 + 微型进度条
  - 数据:
    - Junie CLI: 64.3（正向色，进度条 64.3/100）
    - Gemini CLI: 51.0（负向色，进度条 51/100）
  - 外观描述: >
      水平排列 2 个指标块，间距 gap-10，整体水平居中。
      左侧指标块（Junie CLI）:
      - 上方: 工具名 "Junie CLI"（text-base，font-semibold）+ 排名 "#8"（text-sm，accentPositive 背景色，rounded-full，px-2，白色文字）
      - 下方小字: "Gemini 3 Flash"（text-sm，textCaption）
      - 大数字 "64.3"，text-7xl，font-extrabold，accentPositive 色
      - 微型进度条 h-2 w-44，barTrack 底色，accentPositive 填充 64.3%
      - "%"（text-lg，textCaption）
      右侧指标块（Gemini CLI）:
      - 上方: 工具名 "Gemini CLI"（text-base，font-semibold）
      - 下方小字: "Gemini 3 Flash"（text-sm，textCaption）
      - 大数字 "51.0"，text-7xl，font-extrabold，accentNegative 色
      - 微型进度条 h-2 w-44，barTrack 底色，accentNegative 填充 51%
      - "%"
      中间: 大号 Δ 标签 "13.3pp"（text-2xl，font-bold，accentPositive），
      上方小三角箭头 "▲" + 文字 "同模型增益"（text-xs，textCaption）。
      底部居中: 架构要点卡片（accentPositive/5 背景，rounded-lg，p-3，max-w-[80%]）:
      "强制规划 · IDE 原生 AST 解析 · 自动模型切换"（text-sm，textSecondary）。
  - 动画描述: >
      F1: 左侧 Junie 数字 countUp 0→64.3（0.8s），进度条 growBar 0→64.3%。
      F2: 右侧 Gemini CLI 数字 countUp 0→51.0（0.8s），进度条 growBar 0→51%。
      Δ 标签在 F2 完成后 0.2s appear（scale 0.8→1 + opacity 0→1，0.3s）。
      F3: 底部架构要点卡片 appear（y:8→0，0.4s）。
- 动画:
  - fragments: 4
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: Junie CLI 64.3（countUp）+ 进度条（growBar）
    - F2: Gemini CLI 51.0（countUp）+ 进度条（growBar）+ Δ 13.3pp（appear）
    - F3: 底部架构要点卡片（appear）
- 布局: 大数字面板
- 结论: 不需要最贵的模型，好的脚手架可以让便宜模型跑出接近顶尖的成绩

---

## Slide 19: Claude Code · #22, 58.0%
- type: player-card
- 标题: Claude Code #22, 58.0%：低于 Terminus 2 基线
- 正文: Claude Code 在 Opus 4.6 上 58.0%，比 Terminus 2 基线 62.9% 低 4.9pp。设计目标是通用编码场景，在纯终端操作中复杂度可能帮了倒忙
- 分数: 58.0%（负向色）
- 排名: #22
- 模型: Opus 4.6
- 差值: -4.9pp vs 基线
- 特性:
  - 24 个工具: 文件操作、regex 搜索、TodoWrite 状态追踪等
  - Sub-agent 系统: Plan / Explore / 通用 / Bash 四种子 agent
  - CLAUDE.md 四级记忆: 组织级 → 用户级 → 项目级 → 目录级
  - 93+ 版本系统提示: 社区追踪的完整 prompt 演进历史
  - 脚手架探索者: Hooks、Plugin、Skill 等功能率先探索
- 解释: 设计目标是覆盖完整软件开发流程，Terminal-Bench 衡量的仅是终端任务
- 图表:
  - 类型: 横向条形图（vs 基线）
  - 数据:
    | 脚手架 | 分数 |
    |--------|------|
    | Terminus 2 基线 | 62.9 |
    | Claude Code | 58.0 |
  - 外观描述: >
      右侧面板内，2 条水平条形，间距 gap-3。
      第 1 条（基线）: 标签 "Terminus 2 基线"（text-sm），灰色条（barTrack，h-6，rounded-r），
      宽度 100%（62.9/62.9），右侧 "62.9"（text-sm，textCaption）。
      第 2 条（Claude Code）: 标签 "Claude Code"（text-sm），红色条（accentNegative，h-6，rounded-r），
      宽度 92.2%（58.0/62.9），右侧 "58.0"（text-sm，font-semibold，accentNegative）。
      两条右端差距标注: "-4.9pp"（text-sm，accentNegative，font-medium）。
      条形下方注释: "终端任务中的复杂度可能帮了倒忙"（text-xs，textCaption，italic）。
  - 动画描述: >
      F2 触发: 基线条先生长到 100%（0.5s），Claude Code 条随后生长到 92.2%（0.5s，stagger 0.15s）。
      差距标注 "-4.9pp" 在两条都完成后 appear（0.3s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 左侧面板 — 排名 #22 + 分数 58.0（countUp）+ 差值 -4.9pp（appear）
    - F2: 右侧面板 — 特性列表（revealGroup）+ vs 基线条形图（growBar）+ 注释（appear）
- 布局: 卡片

---

## Slide 20: Gemini CLI · 架构亮点
- type: card-grid
- 标题: Gemini CLI：起步较晚，架构值得关注
- 正文: Google 的开源 CLI，在 Terminal-Bench 上三次提交分别为 51.0%、19.6%、15.4%，但架构设计有独到之处
- 卡片:
  - 双包分层:
    - 描述: CLI 负责终端交互，Core 作为独立包对外发布
    - 细节: 第三方可直接复用 Core 层自建产品，复用门槛低
  - 模型路由:
    - 描述: 按任务复杂度在 Flash 和 Pro 之间自动切换
    - 细节: 简单任务用便宜模型，复杂任务升级
  - 标准 Agent 循环:
    - 描述: Thought → Action → Observation 循环
    - 细节: 工具系统 + GEMINI.md 上下文注入
- 图示:
  - 类型: 双包架构图
  - 外观描述: >
      水平排列的 2 个矩形框，表示 CLI 和 Core 两个包，间距 gap-4，居中。
      左框（CLI 包）: accentNeutral/10 背景，rounded-lg，w-36 h-24。
      内部: 标题 "CLI"（text-base，font-semibold），副文字 "终端交互"（text-xs，textCaption）。
      右框（Core 包）: accentPrimary/10 背景 + 2px solid accentPrimary/30 边框，rounded-lg，w-36 h-24。
      内部: 标题 "Core"（text-base，font-semibold，accentPrimary），副文字 "可独立复用"（text-xs，textCaption）。
      两框之间有双向箭头（SVG）。
      右框下方有虚线延伸到一个小标签: "第三方产品"（text-xs，textCaption，虚线框 1px dashed rgba(0,0,0,0.15)，rounded，px-2 py-1）。
      整个架构图位于卡片网格上方，高度约占 30%。
  - 动画描述: >
      F1 触发: 左框 appear（opacity 0→1 + x:-12→0，0.4s）。
      右框 appear（opacity 0→1 + x:12→0，0.4s，stagger 0.15s）。
      双向箭头在两框出现后 0.2s 淡入。第三方标签再延迟 0.15s appear。
      F2 触发: 3 张卡片 revealGroup（stagger 0.12s，每张 opacity 0→1 + y:8→0，0.4s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 双包架构图（appear）
    - F2: 三张卡片（revealGroup，stagger 0.12s）
- 布局: 卡片
- 结论: 第三方基于 Gemini 模型做出了比 Google 自家 CLI 高 13+ 分的 agent

---

## Slide 21: Token 效率差 3.3 倍
- type: bar-chart
- 标题: Token 效率：Codex CLI 比 Claude Code 省 3.3 倍
- 正文: 完成同等任务，Codex CLI 约 72K tokens，Claude Code 约 235K tokens；Droid 多轨迹生成最高可达 13M
- 图表:
  - 类型: 横向条形图
  - 数据:
    | 框架 | Token 消耗 | 颜色提示 |
    |------|-----------|---------|
    | Codex CLI | 72K | 正向色（最少） |
    | Claude Code | 235K | 中性色 |
    | Droid (平均) | <2,000K | 负向色 |
  - 排序: 升序（token 少排前面）
  - 外观描述: >
      3 条水平条形，从上到下按 token 消耗升序排列，间距 gap-4。
      条形宽度用对数比例（线性比例会让 Codex 条几乎看不见）:
      - 为了可读性，使用分段比例: Codex CLI 和 Claude Code 用相对比例，Droid 用截断标记。
      每条结构:
      - 左侧标签（w-32，text-right，text-base，textSecondary）: 框架名。
      - 条形（h-9，rounded-r-lg）:
        Codex CLI: accentPositive 色，宽度 30.6%（72/235），右侧 "~72K"（text-lg，font-semibold）。
        Claude Code: accentNeutral 色，宽度 100%（235/235），右侧 "~235K"（text-lg，font-semibold）。
        Droid: accentNegative 色，宽度 100% + 右端锯齿截断标记（表示远超画面），
        右侧 "<2M~13M"（text-lg，font-semibold，accentNegative）。
      Codex CLI 条和 Claude Code 条之间有连接标注:
      "3.3×"（text-xl，font-bold，accentPositive），带双向箭头连接两条右端。
      底部注释: "数据来源: Adaline Labs 对比实验"（text-xs，textCaption，italic）。
  - 动画描述: >
      F1: 3 条条形从 width:0 同时生长，duration 0.8s，ease [0.16,1,0.3,1]。
      条形间 stagger 0.06s。右侧数值同步 countUp。
      Droid 条生长到右端时，锯齿截断标记 appear（0.2s）。
      F2: "3.3×" 倍率标注从 opacity 0 + scale 0.8 → opacity 1 + scale 1（0.4s，弹性缓动）。
      双向箭头同时 appear。底部注释淡入（0.3s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 三条条形生长（growBar）+ 数值（countUp）
    - F2: 3.3× 倍率标注（appear + scale）+ 底部注释（appear）
- 布局: 表格
- 结论: Token 效率差异直接意味着 API 费用差异，对个人开发者而言 token 效率越高越好

---

## Slide 22: 推荐阅读路线
- type: list
- 标题: 深入了解脚手架工程的三步路线
- 正文: 从 benchmark 理解到架构拆解再到设计原则，逐步深入
- 列表:
  1. Terminal-Bench 论文 + 排行榜 — 搞清楚 benchmark 到底测了什么、没测什么
  2. OpenAI《Unrolling the Codex Agent Loop》+ Gemini CLI Architecture — 理解主流脚手架怎么做 agent 循环、工具编排和模块分层
  3. Anthropic《Building effective agents》+《Effective harnesses for long-running agents》— 了解 agent 模式选择、长任务设计以及 AI 编程技巧
- 图示:
  - 类型: 三步时间线
  - 外观描述: >
      纵向排列的 3 个步骤节点，左侧有竖向时间线连接。
      时间线: 2px solid accentNeutral/20，距左边 24px，从第 1 步圆点到第 3 步圆点。
      每步结构:
      - 左侧圆形节点: 直径 32px，背景 accentPrimary/15，内有步骤号（text-sm，font-bold，accentPrimary）。
        圆形居中于时间线上。
      - 右侧内容区（margin-left 48px）:
        标题行: text-base，font-semibold，textPrimary。
        描述行: text-sm，textSecondary，max-w-[85%]。
        参考来源: text-xs，textCaption，font-mono。
      步骤间距 gap-6。
      步骤 1 节点: "1"，标题 "理解 Benchmark"。
      步骤 2 节点: "2"，标题 "拆解主流架构"。
      步骤 3 节点: "3"，标题 "学习设计原则"。
  - 动画描述: >
      F1: 时间线从上到下 growBar 式延伸（height 0→100%，0.6s）。
      同时步骤 1 appear（opacity 0→1 + x:12→0，0.4s）。
      F2: 步骤 2 appear（同样动画，stagger 0.15s 后触发）。
      F3: 步骤 3 appear（再 stagger 0.15s）。
- 动画:
  - fragments: 4
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 时间线延伸 + 步骤 1「理解 Benchmark」（appear）
    - F2: 步骤 2「拆解主流架构」（appear）
    - F3: 步骤 3「学习设计原则」（appear）
- 布局: 时间线

---

## Slide 23: 结束页
- type: key-point
- 标题: 模型只是故事的一半
- 副标题: 另一半在脚手架里
- 动画: appear（整体淡入，duration 0.6s，ease-out）
