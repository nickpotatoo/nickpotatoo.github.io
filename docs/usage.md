# 土豆博客 - 使用手册

## 本地预览

博客是纯静态 HTML，需要启动一个本地服务器才能正常加载 Markdown 文章（直接用 `file://` 协议打开会因为跨域限制无法 fetch）。

任选一种方式启动：

```bash
# Python 3
python -m http.server 8080

# Node.js (需要安装 http-server)
npx http-server -p 8080

# 然后浏览器打开
# http://localhost:8080
```

## 新增文章

1. 在 `source/_posts/` 目录下新建 Markdown 文件，文件名格式：`YYYY-MM-DD-标题.md`
2. 文件头部必须包含 Front-Matter：

```yaml
---
title: "文章标题"
date: "2026-05-09"
category: "分类名"
tags: ["标签1", "标签2"]
sticky: true
excerpt: "文章摘要，显示在首页卡片上"
---

## 正文从二级标题开始

正文内容...
```

3. 在 `blog-list.json` 中添加该文章的元数据条目：

```json
{
  "path": "source/_posts/2026-05-09-文章标题.md",
  "title": "文章标题",
  "date": "2026-05-09",
  "category": "分类名",
  "tags": ["标签1", "标签2"],
  "sticky": false,
  "excerpt": "文章摘要"
}
```

4. 推送至 GitHub，GitHub Pages 会自动部署。

## 文章规范

### 标题层级

- 正文从二级标题 `##` 开始（一级标题 `#` 用于页面主标题）
- 层级不超过四级（`##` → `###` → `####`）

### LaTeX 公式

- 行内公式：`$E = mc^2$` → $E = mc^2$
- 独立公式：`$$\int_a^b f(x)dx$$` → 自动居中渲染

### 代码块

使用三个反引号包裹，标注语言：

````markdown
```python
def hello():
    print("Hello World")
```
````

### 图片插入

```markdown
![图片描述](../images/202605/20260509_01_screenshot.png)
```

- 本地图片存放于 `source/images/年月/` 目录
- 图片命名：`YYYYMMDD_序号_描述.png`
- 网络图片直接使用 URL 即可
- 所有图片自动居中、自适应宽度

## 目录结构

```
blog/
├── index.html              # 首页
├── blog.html               # 文章阅读页
├── notes.html              # 随笔笔记页
├── about.html              # 关于页
├── blog-list.json          # 文章索引
├── source/
│   ├── _posts/             # Markdown 文章
│   ├── drafts/             # 草稿（不参与部署）
│   ├── images/             # 图片（按月份分文件夹）
│   └── assets/
│       ├── css/style.css   # 全局样式
│       └── js/
│           ├── main.js     # 公共逻辑
│           └── blog-loader.js  # 文章加载渲染
└── docs/
    └── usage.md            # 本文档
```

## 部署到 GitHub Pages

1. 创建 GitHub 仓库 `username.github.io`
2. 将博客文件推送到仓库的 `main` 分支
3. 在仓库 Settings → Pages 中启用 GitHub Pages，Source 选择 `main` 分支

推送后几分钟内生效，访问 `https://username.github.io` 即可。
