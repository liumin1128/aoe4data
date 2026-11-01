# 中文数据说明

中文来自游戏自带的 `LocaleSimplifiedChinese.sga`，由 `Extract-AOE4Patch.ps1` **自动解包**到
`source/latest/locale/zh-hans/cardinal.zh-hans.ucs`，构建时与其他语言一起处理。

> 旧流程中「手动 `Copy-Item` + `sga-unpack` 中文语言包」的步骤已被上游多语言管线取代，
> 不再需要执行。

## 中文数据的两种消费方式

| 方式 | 位置 | 适用 |
|------|------|------|
| **语言包（推荐）** | `locales/zh-hans.json` → 按条目 ID 索引的 `{ name, description, displayClasses }`，另有 `civilizations` 等分组 | 新代码，按语言按需加载 |
| **内嵌字段（兼容）** | 条目 JSON 内的 `nameCN` / `descriptionCN` / `displayClassesCN`；`civilizations/*.json` 的 `nameCN` / `classesCN` / `descriptionCN` / `overviewCN` | 旧调用方，无需改动 |

两者内容一致：内嵌字段取自 `item.translations["zh-hans"]`，缺失时回退英文。

## 完整流程

见 [UPDATE_WORKFLOW.md](UPDATE_WORKFLOW.md)。中文相关只需要第 1 步（解包）与第 6 步（构建）：

```powershell
$GamePath = 'D:\SteamLibrary\steamapps\common\Age of Empires IV'
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# 只补语言包时可用 -SkipAttrib -SkipIcons
.\Extract-AOE4Patch.ps1 -GamePath $GamePath -SkipAttrib -SkipIcons

yarn parse
```

## 校验

```powershell
# 1. 语言目录（应包含 zh-hans 与 cardinal.zh-hans.ucs）
Get-ChildItem .\source\latest\locale\zh-hans

# 2. 语言包
python -c "import json;d=json.load(open('locales/zh-hans.json',encoding='utf-8'));print(len(d['units']), d['units']['archer-2']['name'])"

# 3. 内嵌字段
python -c "import json;u=json.load(open('units/abbasid/archer-2.json',encoding='utf-8'));print(u['name'],'/',u['nameCN'],'/',u['displayClassesCN'])"

# 4. 文明概览
python -c "import json;c=json.load(open('civilizations/english.json',encoding='utf-8'));print(c['nameCN'],c['classesCN'])"
```

预期输出：`步弓手`、`轻型远程步兵`、`英格兰人 / 防御、长弓、农耕`。

## 常见问题

| 现象 | 原因 / 处理 |
|------|-------------|
| `nameCN` 全为英文 | 缺少 `zh-hans` 语言包，或构建时使用了 `--no-translations` / `--locales` 未包含 `zh-hans` |
| `locales/zh-hans.json` 为空或无新增条目 | 该条目在游戏文本中确实没有中文翻译，`locales/en.json` 也保持空壳属正常 |
| 翻译文本需要人工补充 | 修改 `src/attrib/locale-overrides.json`，方法见 [scripts/TRANSLATIONS.md](scripts/TRANSLATIONS.md) |
| 中文显示为乱码（控制台） | Windows 控制台代码页问题，文件本身是 UTF-8；用编辑器或 `python` 读取确认 |
