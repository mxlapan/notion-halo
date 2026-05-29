# 开发与发版指南

## 分支策略

- **`main`**:发布主干,始终保持「可发布」状态。**已发布(已 push / 已 tag)的提交不要 force push。**
- **功能 / 修复用短期分支**,完成后合并回 `main` 并删除分支:

```bash
git checkout main && git pull
git checkout -b feat/xxx        # 开发
git add -A && git commit -m "feat: ..."
git checkout main && git merge feat/xxx
git branch -d feat/xxx
git push
```

> 仅一两行的小改动可直接在 `main` 上提交,不必强行开分支。

## 分支 / 提交前缀约定

| 前缀 | 用途 |
| --- | --- |
| `feat/` | 新功能 |
| `fix/` | 修复 bug |
| `style/` | 样式 / CSS 调整 |
| `docs/` | 文档 |
| `chore/` | 杂项(版本号、发版等) |
| `refactor/` | 重构 |

## 本地开发

1. 将主题目录放入 Halo 的 `themes` 目录(默认 `~/.halo2/themes/`),或参考[官方主题开发文档](https://docs.halo.run/developer-guide/theme/prepare)使用开发模式加载。
2. 改模板(`.html`)刷新即可生效。
3. **改了 `assets/css` 或 `assets/js` 后**:同步修改 `templates/fragments/head.html` 中的 `?v=` 版本号以刷新缓存,本地用 `Ctrl+Shift+R` 强刷。

## 约定

- 静态资源路径中硬编码了主题名 `notion-halo`(`/themes/notion-halo/assets/...`),必须与 `theme.yaml` 的 `metadata.name` 及安装后的文件夹名一致;重命名主题需全局同步替换。
- 评论依赖官方「评论组件」插件,搜索依赖官方「搜索组件」插件,二者均做了「未安装则不显示」的优雅降级。

## 版本号(语义化)

| 类型 | 版本位 | 例 |
| --- | --- | --- |
| 修复 / 样式微调 | patch | `1.0.0 → 1.0.1` |
| 新功能(向后兼容) | minor | `1.0.1 → 1.1.0` |
| 破坏性改动 | major | `1.x → 2.0.0` |

发版时三处版本号保持一致:`theme.yaml` 的 `spec.version`、`head.html` 的 `?v=`、git tag。

## 发版流程

```powershell
# 1. bump 版本号：theme.yaml 的 version + head.html 的 ?v=
git commit -am "chore: release vX.Y.Z"
git push

# 2. 打包（不含开发文档，仅主题运行所需文件）
Compress-Archive theme.yaml,settings.yaml,templates,README.md,LICENSE `
  -DestinationPath notion-halo-X.Y.Z.zip -Force

# 3. 创建 Release 并上传安装包
gh release create vX.Y.Z notion-halo-X.Y.Z.zip --title "vX.Y.Z" --notes "..."
```

安装包解压后 `theme.yaml` 须位于根目录(当前打包方式已满足),供 Halo 后台「外观 → 主题 → 安装主题 → 上传」使用。
