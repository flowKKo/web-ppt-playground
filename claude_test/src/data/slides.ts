import type { SlideData } from './types'

export const slides: SlideData[] = [
  // Slide 1: Title
  {
    type: 'title',
    title: '模型只是一半',
    subtitle: '脚手架如何优化 AI 的编程能力？',
    badge: 'Terminal-Bench 2.0 深度解析 · 2026.02',
  },

  // Slide 2: Leaderboard overview
  {
    type: 'placeholder',
    title: 'Terminal-Bench 2.0 排行榜',
    body: 'Laude Institute 维护的终端任务基准测试，覆盖 100+ 真实 GitHub CLI 任务（git 操作、脚本调试、配置修复）',
    placeholderLabel: '排行榜截图 tbench.ai/leaderboard',
    metric: { value: '101', label: '个 Agent 条目' },
    cards: [
      { label: '任务类型', value: '真实 GitHub CLI 任务' },
      { label: '基线参照', value: 'Terminus 2（最小化脚手架）' },
    ],
    caption: '数据截止 2026 年 2 月 9 日',
  },

  // Slide 3: Same model, different scores — the hook
  {
    type: 'data-comparison',
    title: '同一个模型，不同的分数',
    body: 'Claude Opus 4.6 在同一榜单上出现多次，搭配不同脚手架时分数差距悬殊',
    items: [
      { label: 'Claude Code', value: '58.0%', color: 'negative' },
      { label: 'Terminus 2 基线', value: '62.9%', color: 'neutral' },
      { label: 'Droid 脚手架', value: '69.9%', color: 'positive' },
    ],
    conclusion: '同一模型，最差到最好差 11.9 个百分点',
  },

  // Slide 4: What is scaffolding — definition
  {
    type: 'grid',
    title: '脚手架 = 模型的工程外壳',
    items: [
      { number: 1, title: '上下文管理', description: '决定给模型看什么代码——运行时搜索 or 语义索引' },
      { number: 2, title: '工具调用', description: '定义模型能用哪些工具——极简 vs 全面，每步可靠性是乘法' },
      { number: 3, title: '任务分解', description: '是否强制模型先规划再执行——强制 > 可选 > 隐式' },
      { number: 4, title: '验证反馈', description: '如何检查输出——多轨迹生成 + 测试选优 vs 单次提交' },
    ],
  },

  // Slide 5: CCA paper finding — weak model + good scaffold beats strong model
  {
    type: 'data-comparison',
    title: '弱模型 + 好脚手架 > 强模型 + 差脚手架',
    body: 'CCA 论文验证：Claude Sonnet 4.5 搭配强脚手架，跑赢了 Claude Opus 4.5 搭配弱脚手架',
    items: [
      { label: 'Sonnet 4.5 + 强脚手架', value: '52.7%', color: 'positive' },
      { label: 'Opus 4.5 + 弱脚手架', value: '52.0%', color: 'negative' },
    ],
    conclusion: '脚手架的增益可以弥补甚至超越模型代差',
  },

  // Slide 6: Scaffold gain chart — 4 models
  {
    type: 'chart',
    title: '脚手架增益：基线 vs 最佳表现',
    body: '以 Terminus 2 最小化脚手架为基线，各模型搭配最优脚手架后的增益',
    bars: [
      { category: 'GPT-5.3', values: [
        { name: '基线 Terminus 2', value: 64.7, color: 'neutral' },
        { name: '最佳 Simple Codex', value: 75.1, color: 'positive' },
      ] },
      { category: 'Opus 4.6', values: [
        { name: '基线 Terminus 2', value: 62.9, color: 'neutral' },
        { name: '最佳 Droid', value: 69.9, color: 'positive' },
      ] },
      { category: 'GPT-5.2', values: [
        { name: '基线 Terminus 2', value: 54.0, color: 'neutral' },
        { name: '最佳 Droid', value: 64.9, color: 'positive' },
      ] },
      { category: 'Opus 4.5', values: [
        { name: '基线 Terminus 2', value: 57.8, color: 'neutral' },
        { name: '最佳 Droid', value: 63.1, color: 'positive' },
      ] },
    ],
    highlight: '+5~11pp',
  },

  // Slide 7: Six dimensions grid
  {
    type: 'grid',
    title: '脚手架的六个维度',
    items: [
      { number: 1, title: '上下文管理', description: '运行时搜索 / 环境感知 / 语义索引三条路线' },
      { number: 2, title: '工具设计', description: '极简 schema vs 全面工具集，可靠性是乘法关系' },
      { number: 3, title: '提示工程', description: '三层分离 + 递近偏差，Claude Code 已迭代 93+ 版本' },
      { number: 4, title: '任务分解', description: '强制/可选/隐式三级，强制规划框架排名普遍靠前' },
      { number: 5, title: '记忆持久化', description: 'CLAUDE.md / AGENTS.md / GEMINI.md 事实标准' },
      { number: 6, title: '验证反馈', description: 'Droid 生成 3 个补丁方案用测试选优，峰值 13M tokens' },
    ],
  },

  // Slide 8: Context management — 3 approaches
  {
    type: 'comparison',
    title: '上下文管理：三条路线',
    body: '代码库几十万行、context window 有限，给模型看哪些代码？',
    columns: [
      { name: '运行时搜索', items: [
        { label: '代表', value: 'Claude Code / Codex CLI' },
        { label: '方式', value: 'grep、find 按需搜索' },
        { label: '优势', value: '零初始化成本' },
        { label: '劣势', value: '搜索质量依赖模型查询能力，消耗更多 token' },
      ] },
      { name: '环境感知', items: [
        { label: '代表', value: 'Warp' },
        { label: '方式', value: '直连 PTY 伪终端流，读取完整缓冲区' },
        { label: '优势', value: '上下文实时、零额外请求' },
        { label: '劣势', value: '覆盖范围受限于当前视野' },
      ] },
      { name: '语义索引', items: [
        { label: '代表', value: 'Augment Code' },
        { label: '方式', value: '自研 embedding 模型，全代码库实时语义索引' },
        { label: '数据', value: 'SWE-bench Pro 51.80% vs Claude Code 49.75%（~多解 15 题）' },
      ] },
    ],
  },

  // Slide 9: Tool reliability is multiplication
  {
    type: 'data-comparison',
    title: '工具可靠性是乘法，不是加法',
    body: '一个 10 步任务，每步工具调用可靠性从 90% 提到 99%',
    items: [
      { label: '0.9¹⁰ 全程成功率', value: '34.9%', color: 'negative' },
      { label: '0.99¹⁰ 全程成功率', value: '90.4%', color: 'positive' },
    ],
    conclusion: '每步 +9% 可靠性 → 全程成功率翻 2.6 倍。复杂 schema 导致错误率指数增长',
  },

  // Slide 10: Tool design philosophy
  {
    type: 'comparison',
    title: '两种工具哲学',
    body: 'Droid 用极简策略在 Terminal-Bench 上验证，Claude Code 用全面工具集服务通用场景',
    columns: [
      { name: 'Droid — 极简主义', items: [
        { label: '策略', value: '严格限制工具数量，简化输入 schema' },
        { label: '定制化', value: 'Claude 用 FIND_AND_REPLACE\nGPT 用 unified diff' },
        { label: '超时', value: '短超时快速失败，而非长等待' },
        { label: '结果', value: '4 个模型提交，全部进入前 15 名' },
      ] },
      { name: 'Claude Code — 全面工具集', items: [
        { label: '规模', value: '24 个内建工具（文件读写 / regex / TodoWrite 等）' },
        { label: '设计理念', value: '防呆设计 poka-yoke，用参数设计让错误更难发生' },
        { label: '投入', value: '工具优化时间 > prompt 优化时间' },
        { label: '瓶颈', value: '终端任务中工具复杂度反成负担（-4.9pp vs 基线）' },
      ] },
    ],
  },

  // Slide 11: Prompt engineering — 3 layers
  {
    type: 'diagram',
    title: '提示工程：三层分离 + 递近偏差',
    body: 'Factory Droid 和 Claude Code 都走分层路线，利用模型的 recency bias',
    steps: [
      { label: '工具描述', description: '定义能力规格' },
      { label: '系统提示', description: '设定高层目标' },
      { label: '系统通知', description: '末端注入关键指令' },
    ],
    sideNote: 'Claude Code：28 个核心提示组件 + 40+ 事件驱动系统提醒，93+ 版本持续迭代\nRecency Bias：模型对最后看到的内容赋予更高优先级，Droid 利用这个偏差而非对抗它',
  },

  // Slide 12: Task decomposition — with ranking proof
  {
    type: 'comparison',
    title: '任务分解：强制规划 > 隐式规划',
    body: '排行榜数据暗示趋势一致：强制显式规划的框架普遍排名靠前',
    columns: [
      { name: '强制显式规划', items: [
        { label: '代表', value: 'Droid #3 / Junie #8 / Warp #14' },
        { label: '方式', value: 'requirements.md → plan.md → 编码' },
        { label: '验证', value: 'Warp 试过条件式规划和 extended thinking 替代，都不如强制规划' },
      ] },
      { name: '可选显式规划', items: [
        { label: '代表', value: 'Claude Code #22' },
        { label: '触发', value: '检测到 3+ 独立步骤时自动激活 TodoWrite' },
        { label: '局限', value: '非强制，模型可能跳过规划' },
      ] },
      { name: '隐式规划', items: [
        { label: '代表', value: 'Codex CLI #11 / Gemini CLI #42+' },
        { label: '方式', value: '靠模型推理 token 或 extended thinking 自行规划' },
        { label: '问题', value: 'Gemini CLI 排在后半段' },
      ] },
    ],
  },

  // Slide 13: Memory persistence
  {
    type: 'comparison',
    title: '跨会话记忆：.md 文件已成事实标准',
    body: '项目根目录放 Markdown 文件，通过 git 共享给团队。多数框架每次会话重新读取配置',
    columns: [
      { name: 'Claude Code', items: [
        { label: '文件', value: 'CLAUDE.md' },
        { label: '层级', value: '4 级覆盖（组织→用户→项目→目录）' },
        { label: '特点', value: '最完整的层级体系，sub-agent 继承父级配置' },
      ] },
      { name: 'Codex CLI', items: [
        { label: '文件', value: 'AGENTS.md' },
        { label: '层级', value: 'root-to-leaf 逐级加载 + 本地 override' },
        { label: '特点', value: '支持目录级细粒度覆盖' },
      ] },
      { name: 'OpenHands', items: [
        { label: '架构', value: '事件溯源' },
        { label: '方式', value: '所有交互建模为不可变事件，完整重放' },
        { label: '特点', value: '唯一有状态的记忆系统，最适合脚手架研究' },
      ] },
    ],
  },

  // Slide 14: Verification feedback
  {
    type: 'diagram',
    title: '验证反馈：多轨迹 + 测试选优',
    body: 'Factory Droid 对每个任务最多生成 3 个补丁方案，用测试筛选最优',
    steps: [
      { label: '生成 Patch', description: '最多 3 个方案并行' },
      { label: '运行测试', description: '自动化测试筛选' },
      { label: '选出最优', description: '通过率最高的方案胜出' },
    ],
    sideNote: 'Token 代价：平均 <2M，峰值 13M tokens/patch\nAnthropic 警告：agent 用 unit test 验证容易「自己考自己」，端到端测试更可靠',
  },

  // Slide 15: #1 Simple Codex
  {
    type: 'player-card',
    rank: '#1 · 75.1%',
    name: 'Simple Codex',
    score: 75.1,
    model: 'GPT-5.3-Codex',
    highlight: '+10.4pp vs 基线 64.7%',
    features: [
      { label: '性质', value: 'OpenAI 内部 benchmark harness，非公开产品' },
      { label: '增益来源', value: '脚手架增益 +10.4pp，与 Codex CLI +8.9pp 相近' },
      { label: '分数领先', value: '主要来自模型升级 5.2→5.3，scaffold 优化非主因' },
    ],
    comparison: [
      { name: 'Simple Codex', value: 75.1 },
      { name: 'Terminus 2', value: 64.7 },
      { name: 'Codex CLI', value: 62.9 },
    ],
  },

  // Slide 16: #3 Factory Droid
  {
    type: 'player-card',
    rank: '#3 · 69.9%',
    name: 'Factory Droid',
    score: 69.9,
    model: 'Opus 4.6',
    highlight: '4 个模型全进前 15',
    features: [
      { label: '核心策略', value: '三层提示 + 工具极简 + 多轨迹测试选优' },
      { label: 'vs Claude Code', value: 'Opus 4.6：+11.9pp / Opus 4.5：+11.0pp，两代模型差距稳定' },
      { label: '争议', value: '社区反馈两极：benchmark 过硬，实际体验有问题（慢、需手动改）' },
      { label: 'Token 消耗', value: '平均 <2M，最高 13M tokens/patch' },
    ],
    comparison: [
      { name: 'Droid 4.6', value: 69.9 },
      { name: 'Droid 5.2', value: 64.9 },
      { name: 'Droid 4.5', value: 63.1 },
    ],
  },

  // Slide 17: #8 Junie CLI
  {
    type: 'player-card',
    rank: '#8 · 64.3%',
    name: 'Junie CLI',
    score: 64.3,
    model: 'Gemini 3 Flash',
    highlight: '+13.3pp vs Gemini CLI 51.0%',
    features: [
      { label: '核心策略', value: '强制规划：生成 requirements.md → plan.md → 才开始编码' },
      { label: 'IDE 集成', value: 'JetBrains IDE 原生 AST 解析引擎，比 grep 更精确' },
      { label: 'Gear-shift', value: '根据任务复杂度在不同模型间自动切换' },
      { label: '意义', value: '便宜模型 + 好脚手架 ≈ 顶尖成绩（比 Google 自家 CLI 高 13.3pp）' },
    ],
    comparison: [
      { name: 'Junie CLI', value: 64.3 },
      { name: 'Ante', value: 64.7 },
      { name: 'Gemini CLI', value: 51.0 },
    ],
  },

  // Slide 18: #22 Claude Code
  {
    type: 'player-card',
    rank: '#22 · 58.0%',
    name: 'Claude Code',
    score: 58.0,
    model: 'Opus 4.6',
    highlight: '-4.9pp vs Terminus 2 基线',
    features: [
      { label: '负增益', value: 'Opus 4.6：58.0% vs 基线 62.9%（-4.9pp）\nOpus 4.5：52.1% vs 基线 57.8%（-5.7pp）' },
      { label: '架构', value: '单线程主循环 + 4 种 sub-agent + 24 工具 + 4 级 CLAUDE.md' },
      { label: '原因', value: '24 工具 + 复杂提示体系为通用编码设计，终端任务中复杂度反成负担' },
      { label: '补充', value: '仍是使用最广泛的 CLI agent，设计目标远不止终端任务' },
    ],
    comparison: [
      { name: 'Droid', value: 69.9 },
      { name: '基线', value: 62.9 },
      { name: 'Claude Code', value: 58.0 },
    ],
  },

  // Slide 19: Gemini ecosystem — chart showing 3rd party > 1st party
  {
    type: 'chart',
    title: '开源生态：第三方脚手架 > 官方 CLI',
    body: 'Gemini 模型上，第三方脚手架表现全面优于 Google 自家 Gemini CLI',
    bars: [
      { category: 'Gemini 生态', values: [
        { name: 'Ante (Pro)', value: 64.7, color: 'positive' },
        { name: 'Junie (Flash)', value: 64.3, color: 'positive' },
        { name: 'II-Agent (Pro)', value: 61.8, color: 'neutral' },
        { name: 'Gemini CLI', value: 51.0, color: 'negative' },
      ] },
    ],
    highlight: '+13.7pp',
  },

  // Slide 20: Token efficiency + cost
  {
    type: 'chart',
    title: 'Token 效率与使用成本',
    body: 'Codex CLI 完成同等任务比 Claude Code 省 3.3 倍。Claude Code 重度 API 用户月费可超 $3,650',
    bars: [
      { category: '单任务消耗 (K)', values: [
        { name: 'Codex CLI', value: 72, color: 'positive' },
        { name: 'Claude Code', value: 235, color: 'negative' },
      ] },
    ],
    highlight: '3.3x',
  },

  // Slide 21: No-benchmark frameworks — the elephant in the room
  {
    type: 'comparison',
    title: '流行工具缺席：用户基数 ≠ 基准表现',
    body: '市面上最流行的几个工具都没有提交 Terminal-Bench 2.0',
    columns: [
      { name: 'Cursor', items: [
        { label: '公开分数', value: 'SWE-bench Pro 50.21%（来自竞品 Augment 的对比测试）' },
        { label: '自主提交', value: '无，从未提交任何公开 benchmark' },
        { label: '用户基数', value: '增长最快的 AI IDE' },
      ] },
      { name: 'Copilot', items: [
        { label: '公开分数', value: 'SWE-bench Verified 56.0%（用 Sonnet 3.7，已过时）' },
        { label: '核心优势', value: 'GitHub 平台绑定（Issues → Agent → PR → Review）' },
        { label: '用户基数', value: '最大的 AI 编程工具用户群' },
      ] },
      { name: 'Cline / Roo Code', items: [
        { label: '公开分数', value: '从未提交任何第三方 benchmark' },
        { label: '特点', value: '开源 VS Code 扩展，5M+ 安装，支持 20+ LLM' },
        { label: '验证', value: '无第三方性能数据' },
      ] },
    ],
  },

  // Slide 22: Recommended reading
  {
    type: 'list',
    title: '深入了解的三步路径',
    items: [
      '看数据 → Terminal-Bench 论文 + Leaderboard（tbench.ai）：搞清楚 101 个 agent 在测什么、基线是谁、增益怎么算',
      '读源码 → Codex CLI（54 crate，Apache-2.0）/ OpenHands（事件溯源）/ Gemini CLI（双包分层）：理解真实 agent 循环',
      '学方法论 → Anthropic: Building effective agents + Effective harnesses for long-running agents：agent 模式选择与长任务设计',
    ],
  },

  // Slide 23: Conclusion
  {
    type: 'key-point',
    title: '选工具的时候',
    subtitle: '模型名字只是故事的一半，另一半在脚手架里',
    body: '同模型最大差距 13.3pp · 弱模型+好脚手架可胜强模型 · 强制规划框架普遍靠前 · 工具越少越可靠',
  },
]
