# Notion for Halo

一款简洁、克制、专注于阅读的 **Notion 风格** [Halo 2](https://halo.run) 主题。

**Notion 的视觉语言**（暖灰近黑文字 `rgb(55,53,47)`、极淡分隔线、低饱和标签底色、克制留白与圆角）+ **三栏自适应布局**（左侧固定导航栏 / 中间内容 / 右侧目录栏），完整支持 **浅色 / 深色 / 跟随系统** 三种配色模式。

## 特性

- 🧱 **三栏自适应布局**：左侧固定侧栏(头像/站点名/导航) + 中间内容 + 右侧目录栏，按断点动态显隐
  - `< 850px`：单栏 + 顶栏汉堡抽屉
  - `≥ 850px`：左侧栏常驻(双栏)
  - `≥ 1200px`：文章页显示右侧目录(三栏)
  - `≥ 1650px`：侧栏加宽至 300px
- 🎨 Notion 同款配色与排版，浅色 / 深色无缝切换（防止首屏闪烁）
- 📝 单列卡片式文章列表，整卡可点、封面缩略图、摘要、标签
- 📰 阅读优先的文章页：右侧目录(TOC)滚动高亮、阅读时间、代码块一键复制
- 🗂️ 完整的归档 / 分类 / 标签 页
- 💬 集成 Halo「评论组件」插件
- ⚙️ 丰富的主题设置：强调色、字体（无衬线 / 衬线）、内容宽度、侧栏头像、页脚、代码注入

## 目录结构

```
notion-halo/
├── theme.yaml              # 主题清单
├── settings.yaml           # 主题设置表单
├── README.md
└── templates/
    ├── index.html          # 首页 / 文章列表
    ├── post.html           # 文章详情
    ├── page.html           # 自定义页面
    ├── archives.html       # 归档
    ├── categories.html     # 分类列表
    ├── category.html       # 单个分类
    ├── tags.html           # 标签列表
    ├── tag.html            # 单个标签
    ├── error.html          # 错误页（404 等）
    ├── fragments/          # 可复用 Thymeleaf 片段
    │   ├── head.html        # <head>
    │   ├── sidebar.html     # 左侧导航栏
    │   ├── topbar.html      # 顶栏（移动端汉堡 + 配色切换）
    │   ├── footer.html      # 自定义 / 注入页脚
    │   ├── post-card.html   # 文章卡片
    │   └── pagination.html
    └── assets/             # 静态资源（/themes/notion-halo/assets/**）
        ├── css/style.css
        ├── js/theme.js
        └── images/logo.svg
```

> ⚠️ 静态资源路径中硬编码了主题名 `notion-halo`，它必须与 `theme.yaml` 中的 `metadata.name` 以及安装后的主题文件夹名保持一致。若重命名主题，请同步替换 `templates/` 下所有 `/themes/notion-halo/assets/...` 路径与 `theme.yaml`、`settings.yaml` 中的 `name`。

## 安装

### 方式一：打包上传

```bash
# 在主题根目录打包
zip -r notion-halo.zip theme.yaml settings.yaml templates README.md
```

进入 Halo 后台 → **外观 → 主题 → 安装主题 → 上传**，选择该 zip 包，安装后启用即可。

### 方式二：本地开发

将本目录放入 Halo 的主题目录（默认 `~/.halo2/themes/`），或参考官方[主题开发文档](https://docs.halo.run/developer-guide/theme/prepare)使用开发模式加载，修改模板后刷新即可生效。

## 配置

启用主题后，在 **外观 → 主题 → 设置** 中可调整：

| 分组 | 说明 |
| --- | --- |
| 外观 | 默认配色模式、配色切换按钮、正文字体、强调色、内容宽度 |
| 侧栏与导航 | 侧栏头像、站点 Emoji、额外导航链接 |
| 文章 | 列表封面、阅读时间、目录、元信息、评论开关 |
| 页脚 | 版权、备案号、自定义 HTML |
| 代码注入 | 自定义 CSS、全局 head / footer |

导航菜单取自 Halo 的「主菜单」（**外观 → 菜单**，标记一个菜单为主菜单）；未设置时回退为「首页 / 分类 / 标签 / 归档」。

侧栏头像优先使用主题设置中的「侧栏头像」，未设置时回退到站点 Logo，再回退到 Emoji 图标。

评论功能需安装并启用官方 **评论组件** 插件后才会显示。

## 环境要求

- Halo `>= 2.20.0`

## 许可

[GPL-3.0](./LICENSE)
