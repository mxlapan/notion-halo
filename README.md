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
- 📝 单列卡片式文章列表，整卡可点、封面缩略图、摘要、标签；首页置顶文章独立成「置顶推荐」区
- 📰 阅读优先的文章页：右侧目录(TOC)滚动高亮、精确阅读时间、相关文章推荐、文末版权声明
- 🔗 文章分享：标签行右侧内置「复制链接 / X」图标按钮（复制成功有反馈）
- 🧩 内容增强：代码块语言标签 + 一键复制、正文图片点击放大(lightbox)、返回顶部按钮
- 📜 侧栏题记：站点名下方可配置一段引文 / 站点格言（默认《庄子》"泛若不系之舟"）
- 🔍 完善的 SEO / 分享：Open Graph、Twitter Card、canonical、文章 JSON-LD 结构化数据
- 🗂️ 完整的归档 / 分类 / 标签 页
- 💬 集成 Halo「评论组件」插件
- ⚙️ 丰富的主题设置：强调色、字体（无衬线 / 衬线）、内容宽度、侧栏头像、侧栏题记、页脚、代码注入

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

### 方式一：下载 Release（推荐）

前往 [Releases](https://github.com/mxlapan/notion-halo/releases) 下载最新的 `notion-halo-*.zip`，进入 Halo 后台 → **外观 → 主题 → 安装主题 → 上传**，选择该 zip 包，安装后启用即可。

### 方式二：自行打包上传

```bash
# 在主题根目录打包
zip -r notion-halo.zip theme.yaml settings.yaml templates README.md LICENSE
```

随后同样在后台「上传」该 zip 安装。

### 方式三：本地开发

将本目录放入 Halo 的主题目录（默认 `~/.halo2/themes/`），或参考官方[主题开发文档](https://docs.halo.run/developer-guide/theme/prepare)使用开发模式加载，修改模板后刷新即可生效。

## 发布（维护者）

本仓库配置了 [`.github/workflows/release.yaml`](.github/workflows/release.yaml)：推送形如 `v1.0.1` 的 tag 时，会自动按 tag 写入版本号、打包主题并创建 GitHub Release 上传 zip。

```bash
git tag v1.0.1
git push origin v1.0.1
```

## 配置

启用主题后，在 **外观 → 主题 → 设置** 中可调整：

| 分组 | 说明 |
| --- | --- |
| 外观 | 默认配色模式、配色切换按钮、正文字体、强调色、内容宽度 |
| 侧栏与导航 | 侧栏头像、站点 Emoji、侧栏题记 + 出处、额外导航链接 |
| 文章 | 列表封面、阅读时间、目录、元信息、评论开关、相关文章、版权声明 + 文案 |
| 页脚 | 版权、备案号、自定义 HTML |
| 代码注入 | 自定义 CSS、全局 head / footer |

### 导航菜单

侧栏导航**始终显示**内置的「首页 / 分类 / 标签 / 归档」，并在其后**追加** Halo「主菜单」中配置的菜单项（**外观 → 菜单**，标记一个菜单为主菜单），支持二级菜单，二者共存。

> 菜单项图标约定：在菜单「显示名称」里以 `emoji + 空格 + 文字` 形式书写（如 `📄 关于我`），主题会把 emoji 放入图标列、与内置导航对齐；未写 emoji 则回退为 `›`。

### 其他说明

- **侧栏题记**：显示在侧栏站点名下方的引文 / 站点格言，可在「侧栏与导航」中编辑或留空，支持 `<br>` 换行。
- **SEO 绝对地址**：`og:image` / `canonical` 等需要 Halo 后台「设置 → 外部访问地址」已填写，否则退化为相对路径，社交平台可能无法抓取分享缩略图。
- **相关文章**：取当前文章首个分类下的其他文章，最多 3 篇。
- 侧栏头像优先使用主题设置中的「侧栏头像」，未设置时回退到站点 Logo，再回退到 Emoji 图标。
- 评论功能需安装并启用官方 **评论组件** 插件后才会显示。

## 环境要求

- Halo `>= 2.20.0`

## 许可

[GPL-3.0](./LICENSE)
