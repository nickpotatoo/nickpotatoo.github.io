// 土豆博客 - Markdown 文章加载与渲染

(function () {
  'use strict';

  // 简易 Front-Matter 解析器
  function parseFrontMatter(md) {
    var meta = {};
    var content = md;
    var fmMatch = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (fmMatch) {
      var fmText = fmMatch[1];
      var lines = fmText.split('\n');
      lines.forEach(function (line) {
        var colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
          var key = line.substring(0, colonIdx).trim();
          var value = line.substring(colonIdx + 1).trim();
          // 去掉引号
          value = value.replace(/^["']|["']$/g, '');
          // 解析数组 [tag1, tag2]
          if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(function (s) { return s.trim().replace(/^["']|["']$/g, ''); });
          }
          meta[key] = value;
        }
      });
      content = md.substring(fmMatch[0].length);
    }
    return { meta: meta, content: content };
  }

  // 加载并渲染文章
  function loadPost(postPath) {
    var articleEl = document.getElementById('article-content');
    var titleEl = document.getElementById('article-title');
    var dateEl = document.getElementById('article-date');
    var categoryEl = document.getElementById('article-category');
    var tagsEl = document.getElementById('article-tags');

    if (!articleEl) return;

    articleEl.innerHTML = '<p class="loading">加载中...</p>';

    fetch(postPath)
      .then(function (res) {
        if (!res.ok) throw new Error('文章加载失败 (' + res.status + ')');
        return res.text();
      })
      .then(function (md) {
        var parsed = parseFrontMatter(md);
        var meta = parsed.meta;

        // 填充元数据
        if (titleEl) titleEl.textContent = meta.title || '未命名文章';
        if (dateEl) dateEl.textContent = meta.date || '';
        if (categoryEl) categoryEl.textContent = meta.category || '';
        if (tagsEl && meta.tags) {
          tagsEl.innerHTML = meta.tags.map(function (t) {
            return '<span class="post-tag">' + escapeHtml(t) + '</span>';
          }).join('');
        }

        // 渲染 Markdown
        if (typeof marked !== 'undefined') {
          articleEl.innerHTML = marked.parse(parsed.content, { breaks: true, gfm: true });
        } else {
          articleEl.innerHTML = '<p class="error-msg">Markdown 渲染库未加载，请检查网络连接。</p>';
          return;
        }

        // KaTeX 后处理
        if (typeof renderMathInElement !== 'undefined') {
          try {
            renderMathInElement(articleEl, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
              ]
            });
          } catch (e) {
            console.warn('KaTeX render error:', e);
          }
        }

        // highlight.js 后处理
        if (typeof hljs !== 'undefined') {
          articleEl.querySelectorAll('pre code').forEach(function (block) {
            hljs.highlightElement(block);
          });
        }
      })
      .catch(function (err) {
        articleEl.innerHTML = '<p class="error-msg">' + escapeHtml(err.message) + '</p>';
      });
  }

  // HTML 转义
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 从 URL 参数获取文章路径
  function getPostPath() {
    var params = new URLSearchParams(window.location.search);
    return params.get('post');
  }

  // 初始化
  document.addEventListener('DOMContentLoaded', function () {
    var postPath = getPostPath();
    if (postPath) {
      loadPost(postPath);
    }
  });
})();
