# Fork 自定义开发说明

这份说明用于维护当前 fork 仓库，同时尽量不影响后续继续同步上游 aoe4world/data。

## 当前分支约定

- `main`：只用于同步上游，不承载自定义开发。
- `custom/main`：长期自定义集成分支，用于汇总你自己的功能。
- `feature/*`：单个功能分支，所有自定义改动都从 `custom/main` 拉出。

当前已经存在的自定义功能分支：

- `feature/zh-hans-localized-fields`

该分支保存了为 `Item` 和 `CivInfo` 增加中文字段的改动，避免这些改动直接落在 `main` 上。

## 当前仓库已配置内容

当前仓库已经配置了以下 Git 远程：

- `origin` -> 你的 fork
- `upstream` -> `aoe4world/data`

当前仓库还配置了以下本地 Git 设置：

- `pull.ff=only`
- `rerere.enabled=true`

以及两个只作用于当前仓库的别名：

### 同步上游到 main

```bash
git sync-upstream
```

等价于：

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```

### 用最新 main 刷新 custom/main

```bash
git refresh-custom
```

等价于：

```bash
git switch custom/main
git merge main
git push origin custom/main
```

## 日常开发流程

### 1. 先同步上游

```bash
git sync-upstream
git refresh-custom
```

### 2. 从 custom/main 拉功能分支

```bash
git switch custom/main
git pull --ff-only
git switch -c feature/your-change
```

### 3. 在功能分支开发和提交

```bash
git add <files>
git commit -m "Your change"
git push -u origin feature/your-change
```

### 4. 功能完成后合回 custom/main

```bash
git switch custom/main
git merge --ff-only feature/your-change
git push origin custom/main
```

如果不是快进合并，也可以直接使用普通 merge：

```bash
git switch custom/main
git merge feature/your-change
git push origin custom/main
```

## 处理会导致大量产物变化的改动

如果某次源码改动会让重新生成的数据产物出现大规模字段膨胀，比如：

- 给现有主数据结构增加新字段
- 改变 unified 或 optimized 的公共结构
- 改变 civ 基础信息的输出结构

建议遵循下面原则：

1. 不要直接在 `main` 上做这类改动。
2. 改动只放在 `feature/*` 分支，必要时再合并到 `custom/main`。
3. 如果只是你自己的使用场景，不要急着把生成产物直接合入长期分支。
4. 如果未来想降低和 upstream 的冲突，优先把新增数据做成额外产物，而不是直接并入现有主 schema。

更具体地说，像这次中文字段改动，当前是直接加到了主数据模型里，因此重新生成后会让大量 JSON 一起变大。这种改动可以保留，但最好始终待在自定义分支里维护。

## 推荐的长期优化方向

如果后面准备长期维护中文数据，推荐把它改造成以下任一方式：

### 方案 A：独立语言产物

示例：

- `units/english/man-at-arms-2.json` 保持上游结构不变
- 额外输出 `locales/zh-hans/units/english/man-at-arms-2.json`

优点：

- 最不影响 upstream 同步
- 主产物结构保持兼容
- 冲突范围最小

### 方案 B：单独的 sidecar 字段文件

示例：

- 主文件继续保留英文结构
- 额外输出一个按 `id` 索引的中文映射文件

优点：

- 产物体积更可控
- 不需要让所有 item 文件整体膨胀

## 合并上游后的推荐顺序

当 upstream 更新后，推荐按照以下顺序操作：

```bash
git sync-upstream
git refresh-custom
git switch feature/your-change
git rebase custom/main
```

如果 rebase 过程中出现冲突：

1. 手动解决一次冲突。
2. `git add <resolved-files>`
3. `git rebase --continue`

由于当前仓库已经启用了 `rerere`，后续遇到同类冲突时，Git 可能会自动复用之前的解决方式。

## 不建议的做法

- 不要直接在 `main` 上开发自定义功能。
- 不要把只服务于个人需求的大改动直接混进上游同步分支。
- 不要在没有隔离分支的情况下批量提交大规模生成产物。

## 这份说明适用的当前上下文

- 仓库：`aoe4world/data` 的 fork
- 你的远程：`origin`
- 上游远程：`upstream`
- 长期自定义分支：`custom/main`

如果后续分支命名或目录结构发生变化，优先更新这份文件。