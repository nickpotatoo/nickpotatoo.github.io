# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概要

土豆博客 — 个人技术笔记与学习归档静态博客，部署于 GitHub Pages。零构建工具，纯 HTML + CSS + JS，通过 CDN 引入 marked.js / KaTeX / highlight.js 实现客户端 Markdown 渲染。

## 常用命令

```bash
# 本地预览（必须用 HTTP 服务器，file:// 协议会导致 fetch 跨域失败）
python -m http.server 8080
# 然后访问 http://localhost:8080

# 新增文章后无需构建，刷新浏览器即可

# 编译自动提交工具（首次使用前执行一次）
gcc -Wall -Wextra -O2 -o autocommit.exe autocommit.c

# 运行自动提交工具（更新内容后执行，自动 add → commit → push）
./autocommit
```

## 架构与数据流

```
index.html              → 门户首页，导航入口
articles.html           → fetch blog-list.json → 渲染文章列表
blog.html?post=xxx      → fetch xxx.md → 解析 Front-Matter → marked.parse() → KaTeX 渲染公式 → hljs 高亮代码
notes.html              → 无参数：fetch notes-list.json → 渲染小记列表
notes.html?note=xxx     → fetch xxx.md → 解析 Front-Matter → marked.parse() → KaTeX 渲染公式
about.html              → 纯静态内容
```

小记比文章更轻量：只加载 marked.js + KaTeX，不引入 highlight.js。小记不含分类/标签/sticky，仅保留标题、日期。

**渲染管线**（`source/assets/js/blog-loader.js`）：
1. `fetch(postPath)` 获取 Markdown 原文
2. 正则 `/^---\s*\n([\s\S]*?)\n---\s*\n/` 提取 Front-Matter（title, date, category, tags, excerpt）
3. `marked.parse(content, { breaks: true, gfm: true })` 转 HTML
4. `renderMathInElement()` 渲染 `$...$` 和 `$$...$$` 公式
5. `hljs.highlightElement()` 对 `<pre><code>` 执行代码高亮

**CDN 依赖**（均在 `blog.html` 中加载）：

| 库 | 全局变量 | 用途 |
|---|---|---|
| marked.js | `marked` | Markdown → HTML |
| KaTeX + auto-render | `renderMathInElement` | LaTeX 公式渲染 |
| highlight.js | `hljs` | 代码块语法高亮 |

## 目录结构（不可随意改动）

- `source/_posts/` — Markdown 正式文章，文件名 `YYYY-MM-DD-标题.md`
- `source/_notes/` — Markdown 小记，文件名 `YYYY-MM-DD-标题.md`，比文章更轻量（无分类/标签/高亮）
- `source/drafts/` — 草稿，不参与部署
- `source/images/` — 图片，按月份子目录归档，命名 `YYYYMMDD_序号_描述.ext`
- `source/assets/css/style.css` — 全局样式，CSS 变量定义在 `:root`
- `source/assets/js/main.js` — 导航激活状态
- `source/assets/js/blog-loader.js` — 文章加载与渲染管线（blog.html 用）
- `docs/` — 使用文档与维护手册
- `index.html` — 门户首页，文章/小记入口
- `articles.html` — 文章列表页，加载 blog-list.json
- `blog-list.json` — 文章元数据索引，articles.html 加载
- `notes-list.json` — 小记元数据索引，notes.html 加载
- `autocommit.c` — 自动提交工具的 C 源码
- `autocommit.conf` — 自动提交配置文件，列出需要追踪的路径
- `autocommit.exe` — 编译后的可执行文件（已加入 .gitignore）

## 新增文章流程

1. 在 `source/_posts/` 创建 `YYYY-MM-DD-标题.md`
2. Front-Matter 必填字段：
   ```yaml
   ---
   title: "标题"
   date: "2026-05-09"
   category: "分类"
   tags: ["标签1", "标签2"]
   sticky: false
   excerpt: "摘要，显示在首页卡片上"
   ---
   ```
3. 在 `blog-list.json` 数组首部添加同一条目，`path` 指向 `source/_posts/xxx.md`
4. 本地 `python -m http.server 8080` 预览，确认无误后 git push 部署

## 新增小记流程

1. 在 `source/_notes/` 创建 `YYYY-MM-DD-标题.md`
2. Front-Matter 只需 title、date 和 excerpt：
   ```yaml
   ---
   title: "标题"
   date: "2026-05-09"
   excerpt: "摘要，显示在小记列表卡片上"
   ---
   ```
3. 在 `notes-list.json` 数组首部添加条目，`path` 指向 `source/_notes/xxx.md`
4. 小记不支持分类/标签/代码高亮，仅渲染 Markdown 和 LaTeX 公式

## 设计硬性约束

- 配色：低饱和度，白底 `#ffffff` + 主文字 `#2d2d2d` + 辅文字 `#888` + 分隔线 `#f0f0f0` + 强调蓝 `#5b8eb9`
- 排版：最大宽度 720px 居中，行高 1.8，字体优先系统无衬线栈
- 禁止：花哨动画、冗余挂件、高饱和颜色、iframe 嵌入、广告
- 移动端优先，`@media (max-width: 768px)` 断点适配

## 文章编写规范

- 正文从 `##`（二级标题）开始，层级不超过四级
- 行内公式 `$E=mc^2$`，独立公式 `$$...$$` 自动居中
- 代码块标注语言，启用 highlight.js 高亮
- 图片统一存放 `source/images/年月/`，自动居中自适应
- 文件编码 UTF-8，缩进 2 空格，命名全小写下划线分隔

## Git 提交规范

每次完成任务后，自动执行 git add 和 git commit，无需等待用户确认。
commit message 格式：`[类型] 改动描述`，例如 `[新增] 添加文章 xxx`、`[修复] 修正公式渲染`、`[优化] 调整移动端样式`。
类型标签：新增 / 修复 / 优化 / 重构 / 文档。
在commit message后添加”此次commit由claude code执行”

## 自动提交工具（autocommit）

项目根目录下的 `autocommit` 工具用于在更新内容后一键完成 `git add → git commit → git push` 流程。

**工作原理**：读取 `autocommit.conf` 中列出的所有路径，依次执行 `git add`（逐个路径加引号安全添加）、`git commit -m “时间戳-进行了内容更新”`、`git push`。

**适用范围**：该工具仅用于博客/小记等内容的常规更新推送。代码重构、CI 配置等非内容类提交仍应手动执行 git 操作并使用 `[类型] 描述` 格式的提交信息。

**扩展新内容类型**（如视频博客、播客、图集等）：

当需要新增内容形式时，按以下步骤操作即可自动纳入推送流程：

1. 创建对应的内容目录（如 `source/_vlogs/`）和索引文件（如 `vlog-list.json`）
2. 将新增的目录和索引文件路径追加到 `autocommit.conf`，每行一个
3. 在 CLAUDE.md 中参照「新增文章流程」补充对应的新增规范
4. 后续运行 `./autocommit` 时会自动包含新内容类型

示例：新增视频博客时，在 `autocommit.conf` 末尾追加：
```
source/_vlogs
vlog-list.json
```

## 文档同步

修改任何功能后，必须同步更新 `docs/` 下的对应文档，确保文档与代码始终一致。

## 禁止操作

- 禁止修改项目目录结构
- 禁止删除已发布正式文章（草稿删除前需二次确认）
- 禁止添加花哨特效、冗余插件、广告挂件
- 禁止随意升级 CDN 库版本（以免 API 变更导致渲染失败）
- `.env` 已加入 `.gitignore`，禁止提交
