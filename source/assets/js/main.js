// 土豆博客 - 公共逻辑

(function () {
  'use strict';

  // 导航栏激活状态标记
  function setActiveNav() {
    var path = window.location.pathname;
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && path.endsWith(href.split('/').pop())) {
        link.classList.add('active');
      }
    });
  }

  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
  });
})();
