<div align="center"><a name="readme-top"></a>

[![Presenta](docs/images/banner.svg)](https://www.presenta.help/zh/)

在浏览器中创建精美演示文稿 — 图表、图解、AI 一站搞定。

[English](README.md) · **简体中文** · [Official Website](https://www.presenta.help/en/) · [官网](https://www.presenta.help/zh/)

</div>

## 特性

- **11 种 Slide 类型** — 标题页、关键点、图表 (柱/饼/折线/雷达)、网格卡片、序列流程、对比、漏斗/金字塔、同心环、辐射图、韦恩图、自由布局 Block
- **7 个图表引擎** — 每个引擎支持多种 variant 皮肤，组合出数十种不同的图表样式
- **Block 自由布局** — 在一张 slide 上放置多个可拖拽、可缩放的内容块，每个块可以是任意图表类型
- **所见即所得编辑** — 右侧属性面板、行内文本编辑、拖拽排序、Undo/Redo、叠加层 (文字/矩形/线段)
- **全屏演示** — 支持 Spotlight 逐块揭示动画
- **Deck 管理** — 创建、导入 (JSON)、导出、删除演示文稿；基于文件的持久化存储
- **AI 生成** — 通过 Claude Code 的 `/web-ppt` Skill 从文稿自动生成完整幻灯片

## 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:5173/`，进入 Deck 选择页。点击卡片进入某个演示文稿，或创建新的。

## 使用方法

### 导航
- **鼠标滚轮** / **方向键** / **PageUp/PageDown** — 切换 slide
- **左侧缩略图** — 点击跳转，拖拽排序，右键菜单 (复制 / 删除 / 插入)

### 编辑
- **点击 slide 内容** — 选中，右侧弹出属性面板
- **双击文本** — 行内编辑
- **属性面板** — 修改类型、variant、数据字段、间距等
- **工具栏** — 文本/矩形/线段叠加层、Undo/Redo
- **Ctrl+Z / Ctrl+Shift+Z** — 撤销 / 重做
- **Delete** — 删除选中元素

### 全屏演示
- 点击工具栏全屏按钮进入演示模式
- 支持 Spotlight 模式：逐个揭示 block 内容

## AI 生成

通过 Claude Code 的 `/web-ppt` Skill 从口播稿自动生成完整演示文稿：

```
/web-ppt --lang zh --style swiss --script slides.md --deck my-deck
```

## License

Private project.
