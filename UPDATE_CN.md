# 中文支持

### 从零开始的配置

安装 https://dotnet.microsoft.com/zh-cn/download/dotnet/thank-you/runtime-6.0.36-windows-x64-installer?cid=getdotnetcore

打开管理员终端

导出最新的原始数据，储存到source文件夹

```
cd C:\Users\liumin\Downloads\data-main\data-main

Set-ExecutionPolicy -ExecutionPolicy Bypass

.\Extract-AOE4Patch.ps1 -GamePath 'D:\SteamLibrary\steamapps\common\Age of Empires IV'
```

在D:\SteamLibrary\steamapps\common\Age of Empires IV、cardinal\archives\LocaleSimplifiedChinese.sga找到对应语言文件，移动到source文件夹，执行命令导出对应翻译

```
dotnet ./source/AOEMods.Essence/AOEMods.Essence.CLI.dll sga-unpack ./source/LocaleSimplifiedChinese.sga ../source/locale
```

执行yarn parse，会到处带有中文的最新数据