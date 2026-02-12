# 模型只是一半：脚手架如何优化 AI 的编程能力？

---

## Slide 1: 标题页
- type: title
- 标题: 模型只是一半
- 副标题: 脚手架如何优化 AI 的编程能力？
- 标注: 2026.02

---

## Slide 2: 排行榜总览
- type: placeholder + metric
- 标题: Terminal-Bench 2.0
- 正文: 面向终端任务的 AI Agent 基准测试，覆盖 100+ CLI 任务
- 占位图: 排行榜截图
- 关键数字: 101 个 Agent
- 标注: 截止 2026 年 2 月 9 日

---

## Slide 3: 同模型分差
- type: data-comparison
- 标题: 同一个模型，不同的分数
- 正文: Claude Opus 4.6 在同一榜单上出现多次
- 数据:
  - 最低: 58.0（负向色）
  - 最高: 69.9（正向色）
- 结论: 差了近 12 分——为什么？

---

## Slide 4: 什么是脚手架？
- type: key-point + list
- 标题: 脚手架 = 模型的外挂装备
- 正文: 包裹在模型外面的工程层，与模型共同决定 AI 编程性能
- 定义列表:
  - 信息输入: 给模型看什么上下文
  - 工具调用: 模型能用哪些工具
  - 结果验证: 怎么检查输出对不对
  - 记忆存储: 怎么跨会话保持记忆

---

## Slide 5: Terminus 2 基线
- type: placeholder + card
- 标题: Terminus 2 = 最小化基线
- 占位图: Terminus 2 界面截图
- 卡片:
  - 工具: 仅 1 个（headless bash）
  - 提示优化: 无
  - 规划策略: 无
- 正文: 衡量其他脚手架到底贡献了多少分

---

## Slide 6: 脚手架增益数据
- type: bar-chart
- 标题: 脚手架增益
- 正文: 5-10 个百分点的增益，足以把排名从中游拉到前三
- 图表数据:
  | 模型 | 基线 (Terminus 2) | 最佳脚手架 | 增益 |
  |------|------------------|-----------|------|
  | GPT-5.3 | 64.7 | 75.1 (Simple Codex) | +10.4 |
  | Opus 4.6 | 62.9 | 69.9 (Droid) | +7.0 |

---

## Slide 7: 六维度总览
- type: grid
- 标题: 脚手架六维度
- 网格 (3x2):
  1. 信息输入 — 给模型看什么
  2. 工具设计 — 模型能做什么
  3. 提示工程 — 怎么告诉模型
  4. 任务分解 — 怎么拆问题
  5. 记忆持久化 — 怎么记住项目
  6. 验证反馈 — 怎么检查结果

---

## Slide 8: 维度一 · 信息输入
- type: comparison
- 标题: 给模型看什么信息
- 左列:
  - 名称: 运行时搜索
  - 代表: Claude Code / Codex CLI
  - 优势: 零初始化成本
  - 劣势: 费 token，依赖模型查询能力
- 右列:
  - 名称: 语义索引
  - 代表: Augment Code
  - 优势: 精准定位相关代码
  - 劣势: 未提交 Terminal-Bench 2.0

---

## Slide 9: 维度二 · 工具可靠性
- type: data-comparison
- 标题: 工具成功率是乘法
- 数据:
  - 0.9^10 = 34.9%（负向色）
  - 0.99^10 = 90.4%（正向色）
- 结论: 每步 +9% → 最终 +55%

---

## Slide 10: 维度二 · 工具设计策略
- type: comparison
- 标题: 两种工具哲学
- 左列:
  - 名称: Droid — 极简工具
  - 要点: 严格限制数量，简化 schema
  - 细节: Claude 用 FIND_AND_REPLACE，GPT 用 unified diff
  - 结果: 4 个模型全进前 15
- 右列:
  - 名称: Claude Code — 24 工具 + 防呆设计
  - 要点: 功能全面，poka-yoke 防错
  - 细节: 工具优化时间 > prompt 优化时间

---

## Slide 11: 维度三 · 提示工程
- type: diagram
- 标题: 三层提示结构
- 图示 (从上到下三层堆叠):
  1. 工具描述 — 定义能力规格
  2. 系统提示 — 设定高层目标
  3. 系统通知 — 末端注入关键指令
- 侧注: Recency Bias — 模型对最后看到的内容赋予更高优先级

---

## Slide 12: 维度四 · 任务分解
- type: comparison
- 标题: 怎么拆任务？
- 左列:
  - 名称: 强制规划
  - 代表: Junie CLI / Droid
  - 流程: requirements → plan → code
  - 效果: 排名普遍靠前
- 中列:
  - 名称: 可选规划
  - 代表: Claude Code
  - 触发: 检测到 3+ 独立步骤时自动激活 TodoWrite
- 右列:
  - 名称: 隐式规划
  - 代表: Codex CLI / Gemini CLI
  - 方式: 靠模型推理 token / extended thinking

---

## Slide 13: 维度五 · 记忆持久化
- type: comparison
- 标题: 跨会话怎么记住项目？
- 正文: 项目根目录放 .md 文件，通过 git 共享
- 三列:
  | 框架 | 记忆文件 | 层级深度 |
  |------|---------|---------|
  | Claude Code | CLAUDE.md | 4 级覆盖（组织→目录） |
  | Codex CLI | AGENTS.md | 逐级加载 + 本地覆盖 |
  | Gemini CLI | GEMINI.md | 单层 |

---

## Slide 14: 维度六 · 验证反馈
- type: diagram + metric
- 标题: 怎么检查结果？
- 图示: Patch A / Patch B / Patch C → 测试筛选 → 选出最优
- 数据:
  - 平均 token: <2M
  - 峰值 token: 13M
- 警告: Agent 自写 unit test 容易「自己考自己」，端到端测试更可靠

---

## Slide 15: #1 Simple Codex
- type: player-card
- 标题: #1 Simple Codex
- 分数: 75.1
- 模型: GPT-5.3
- 增益: +10.4（vs Terminus 2 基线 64.7）
- 特性:
  - 异步模式: UI 与 agent 执行解耦
  - V4A diff: 配合 tree-sitter 做 patch 解析
  - 上下文压缩: 支持有效无限长对话
- Token 效率: 72K / 任务（Claude Code: 235K，差 3.3x）

---

## Slide 16: #3 Factory Droid
- type: player-card
- 标题: #3 Factory Droid
- 分数: 69.9
- 模型: Opus 4.6
- 亮点: 4 个模型全进前 15 — 泛化能力最强
- 架构:
  - 三层提示 + recency bias
  - 工具极简 + 按模型定制
  - 多轨迹生成 + 测试选优
- 争议: Benchmark 数据过硬，但社区反馈代码质量两极分化

---

## Slide 17: #8 Junie CLI
- type: player-card + bar-chart
- 标题: #8 Junie CLI
- 分数: 64.3
- 模型: Gemini 3 Flash
- 对比图表:
  | 脚手架 | 分数 |
  |--------|------|
  | Junie CLI | 64.3 |
  | Gemini CLI | 51.0 |
- 增益: +13.3（同模型脚手架增益最大案例之一）
- 特性:
  - 强制规划: requirements.md → plan.md → code
  - JetBrains IDE 原生 AST 解析
  - 按复杂度自动切换模型

---

## Slide 18: #22 Claude Code
- type: player-card + bar-chart
- 标题: #22 Claude Code
- 分数: 58.0
- 模型: Opus 4.6
- 对比图表:
  | 条目 | 分数 |
  |------|------|
  | Terminus 2 基线 | 62.9 |
  | Claude Code | 58.0 |
- 差值: -4.9（低于基线，负向色标注）
- 解释: 设计目标是通用编码场景，24 工具 + sub-agent + 四级记忆在终端任务中复杂度反而成为负担

---

## Slide 19: Gemini CLI
- type: diagram
- 标题: Gemini CLI
- 正文: Google 开源 CLI，起步较晚，持续优化中
- 架构图示 (双包分层):
  - CLI 层: 终端交互
  - Core 层: 独立包，第三方可直接复用
- 侧注: 按任务复杂度在 Flash / Pro 之间自动路由模型

---

## Slide 20: Token 效率
- type: bar-chart
- 标题: Token 效率对比
- 正文: Token 效率差异 = API 费用差异
- 图表数据:
  | 框架 | 单任务 Token 消耗 |
  |------|-----------------|
  | Codex CLI | 72K |
  | Claude Code | 235K |
  | Factory Droid | <2M（峰值 13M） |
- 关键数字: 3.3x（Codex vs Claude Code）

---

## Slide 21: 个人经验
- type: card-grid
- 标题: 三套日常工具组合
- 卡片:
  - Claude Code + Opus 4.6
  - Codex CLI + GPT-5.3
  - Droid + Opus 4.6
- 结论: 没有哪个工具在所有场景下碾压另一个。Benchmark 排名靠后 ≠ 日常不好用。

---

## Slide 22: 推荐阅读
- type: list
- 标题: 深入了解的三步路径
- 列表:
  1. Terminal-Bench 论文 + Leaderboard — 搞清楚测了什么、没测什么
  2. Codex Agent Loop + Gemini CLI Architecture — 理解 agent 循环与模块分层
  3. Anthropic: Building effective agents + Effective harnesses — agent 模式选择与长任务设计

---

## Slide 23: 结尾
- type: key-point
- 标题: 模型只是一半
- 副标题: 另一半在脚手架里
