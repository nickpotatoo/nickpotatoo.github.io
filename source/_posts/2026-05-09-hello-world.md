---
title: "Hello World - 第一篇博客"
date: "2026-05-09"
category: "随笔"
tags: ["博客", "建站"]
sticky: true
excerpt: "土豆博客正式上线！记录从零搭建个人静态博客的过程，聊聊为什么选择纯静态方案。"
---

## 博客上线了

折腾了一阵子，终于把这个小站搭起来了。

初衷很简单：需要一个干净、可控的地方来存放自己的学习笔记和零碎想法。试过不少笔记工具和博客平台，总觉得差点意思——要么太重，要么太花，要么数据不在自己手里。

所以干脆自己来。

## 为什么选纯静态

选型的时候考虑了几个方向：

- **动态博客（WordPress 等）**：功能全但太重，需要服务器和数据库，维护成本高
- **静态生成器（Hexo / Hugo / Jekyll）**：成熟好用，但有构建步骤，依赖 Node 或 Ruby 环境
- **纯手写 HTML + Markdown 渲染**：最轻量，零依赖，完全掌控

最终选了第三种。理由很简单：

1. **零构建**：写完 Markdown 直接推上 GitHub，即时生效
2. **完全掌控**：每个字节都知道在干什么
3. **永久可维护**：纯文本 Markdown 不受任何框架限制，十年后照样能读
4. **足够快**：静态文件 + CDN，访问速度拉满

## 技术选型

博客本身只有三个 HTML 页面 + 一个 CSS 文件 + 几个 JS 脚本，外加三个 CDN 库：

| 组件 | 方案 | 说明 |
|------|------|------|
| Markdown 渲染 | marked.js | 轻量、快速、兼容好 |
| 数学公式 | KaTeX | 比 MathJax 快得多 |
| 代码高亮 | highlight.js | 语言支持全，主题干净 |

## 代码示例

写个 Python 的快速排序试试效果：

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
```

再试试 JavaScript：

```javascript
const greet = (name) => {
  console.log(`你好，${name}！欢迎来到土豆博客。`);
};

greet('世界');
```

## 公式示例

行内公式：$E = mc^2$，质能方程。

独立公式，居中显示：

$$
\int_{a}^{b} f(x) \,dx = F(b) - F(a)
$$

贝叶斯公式：

$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$

矩阵表示：

$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

## 图片示例

博客支持本地图片和网络图片，自动居中适配屏幕宽度。

![示例图片](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800)

## 接下来

博客框架搭好了，接下来就是慢慢填充内容。计划写的方向：

- 编程学习笔记
- 算法与数据结构
- 读书摘录
- 工具使用心得
- 偶尔的生活碎碎念

慢慢记录，稳步成长。
