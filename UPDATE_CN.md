# 中文支持

### 从零开始的配置

安装 https://dotnet.microsoft.com/zh-cn/download/dotnet/thank-you/runtime-6.0.36-windows-x64-installer?cid=getdotnetcore

打开管理员终端

导出最新的原始数据，储存到source文件夹


进入aoe4data目录，切换到custom/main

设置权限
```
Set-ExecutionPolicy -ExecutionPolicy Bypass
```

Download and install the latest version of [AOEMods.Essence](https://github.com/aoemods/AOEMods.Essence/releases), extract into `./source/AOEMods.Essence`


```
.\Extract-AOE4Patch.ps1 -GamePath 'D:\SteamLibrary\steamapps\common\Age of Empires IV'
```

在D:\SteamLibrary\steamapps\common\Age of Empires IV、cardinal\archives\LocaleSimplifiedChinese.sga找到对应语言文件，移动到source文件夹，执行命令导出对应翻译

```
Copy-Item "D:\SteamLibrary\steamapps\common\Age of Empires IV\cardinal\archives\LocaleSimplifiedChinese.sga" -Destination ".\source\LocaleSimplifiedChinese.sga"
```

生成翻译
```
dotnet ./source/AOEMods.Essence/AOEMods.Essence.CLI.dll sga-unpack ./source/LocaleSimplifiedChinese.sga ../source/locale
```

移动到对应目录
```
Move-Item -Path "C:\Users\liumin\Documents\aoe4\source\locale\zh-hans" -Destination "C:\Users\liumin\Documents\aoe4\aoe4data\source\latest\locale\" -Force
```

执行yarn parse，会到处带有中文的最新数据
```
yarn parse
```