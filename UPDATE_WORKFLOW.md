# 上游同步与分支更新流程

本文档记录了完整的上游同步、自定义分支变基、以及重建 `custom/main` 的操作流程，供后续重复使用。

## 前置条件

- `upstream` 远程已配置为 `aoe4world/data`
- 本地 Git 别名已配置：`sync-upstream`、`refresh-custom`

若未配置，请先执行：

```bash
git remote add upstream https://github.com/aoe4world/data.git
git config --local pull.ff only
git config --local rerere.enabled true
git config --local alias.sync-upstream "!git fetch upstream && git switch main && git merge --ff-only upstream/main && git push origin main"
git config --local alias.refresh-custom "!git switch custom/main && git merge main && git push origin custom/main"
```

## 完整操作流程

### 1. 确认当前所在分支

```bash
git branch
```

确保当前不在关键分支上，建议在 `feature/*` 分支上操作。

### 2. 同步上游到 main

```bash
git sync-upstream
```

等价于手动执行：

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```

### 3. 将 feature 分支变基到最新 main

```bash
git switch feature/zh-hans-localized-fields
git rebase main
```

#### 如果出现冲突

1. 查看冲突文件，手动解决（保留你的自定义改动）：
   ```bash
   # 示例：使用他们的版本来解决（保留 feature 分支的改动）
   git checkout --theirs -- <conflicted-file>
   ```
2. 标记已解决并继续：
   ```bash
   git add <resolved-file>
   git rebase --continue
   ```

由于已启用 `rerere`，同类冲突下次可能自动复用之前的解决方案。

### 4. 推送更新后的 feature 分支

```bash
git push --force-with-lease origin feature/zh-hans-localized-fields
```

### 5. 删除旧的 custom/main 并重建

```bash
git branch -D custom/main
git push origin --delete custom/main
git switch -c custom/main
git push origin custom/main
```

### 6. 回到 feature 分支

```bash
git switch feature/zh-hans-localized-fields
```

### 7. 手动执行 build 命令

```bash
# 切换到 custom/main
git switch custom/main

# 执行构建命令（请替换为实际的 build 命令）
# 例如：yarn parse
```

## 快速一键执行（无冲突时）

如果确信没有冲突，可以一键执行：

```bash
# 确保在 feature/zh-hans-localized-fields 分支
git sync-upstream && ^
git rebase main && ^
git push --force-with-lease origin feature/zh-hans-localized-fields && ^
git branch -D custom/main && ^
git push origin --delete custom/main && ^
git switch -c custom/main && ^
git push origin custom/main && ^
git switch feature/zh-hans-localized-fields
```

## 推荐流程（合并上游后）

根据 `FORK_WORKFLOW.md`，推荐顺序为：

```bash
git sync-upstream
git refresh-custom
git switch feature/zh-hans-localized-fields
git rebase custom/main
```

> **注意**：如果 `custom/main` 已包含 build 产物（与 `feature/zh-hans-localized-fields` 源码不同步），则 rebase 可能会引入冲突。此时建议直接 rebase 到 `main`，再重建 `custom/main`（即本文档描述的方式）。

## 分支结构说明

```
main  ─────────────────────── b2cd3822 (最新上游)
                              └── feature/zh-hans-localized-fields
                                   ├── 3fd07ea0 Add fork workflow guide
                                   ├── 8f26d13f Add zh-Hans localized item and civ fields
                                   ├── 2fcedbed Add zh-Hans update guide
                                   ├── 64265e1d 更新中文支持文档
                                   ├── 4722df1c 重构项目以支持中文字段
                                   ├── 8d5c5fdd 更新 unifyItems 函数
                                   └── d5395724 优化名称、描述处理
custom/main ──────────────── 与 feature/zh-hans-localized-fields 相同（含 build 产物）
```
