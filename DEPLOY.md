# 🚀 部署指南 - Pitch Perfect Test

本文档将指导你如何将音感测试网站部署到 GitHub Pages，使其成为一个公开可访问的网站。

## 📋 前提条件

- 拥有 GitHub 账号
- 已安装 Git
- 项目已在本地初始化（已完成 ✅）

## 🔧 部署步骤

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `pitch-perfect-test` （或你喜欢的名字）
   - **Description**: "音感测试网站 - Pitch Perfect Test"
   - **Public**: 选择 Public（公开仓库）
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 2. 连接本地仓库到 GitHub

在终端中执行以下命令（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
cd /Users/alisonji/Desktop/pitch-test

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/pitch-perfect-test.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings"（设置）
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分：
   - Branch: 选择 `main`
   - Folder: 选择 `/ (root)`
4. 点击 "Save"
5. 等待几分钟，页面会显示你的网站地址：
   ```
   https://YOUR_USERNAME.github.io/pitch-perfect-test/
   ```

### 4. 访问你的网站

部署完成后，你可以通过以下地址访问：

```
https://YOUR_USERNAME.github.io/pitch-perfect-test/
```

## 🔄 更新网站

当你修改代码后，使用以下命令更新网站：

```bash
cd /Users/alisonji/Desktop/pitch-test

# 添加修改的文件
git add .

# 提交更改
git commit -m "描述你的更改"

# 推送到 GitHub
git push
```

GitHub Pages 会自动更新你的网站（通常需要几分钟）。

## 🎨 自定义域名（可选）

如果你有自己的域名，可以：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为你的域名，例如：`pitch-test.yourdomain.com`
3. 在你的域名提供商处添加 DNS 记录：
   - Type: `CNAME`
   - Name: `pitch-test`（或你想要的子域名）
   - Value: `YOUR_USERNAME.github.io`

## 📱 分享你的网站

部署完成后，你可以：

- 分享链接给朋友测试
- 在社交媒体上推广
- 添加到你的个人简历或作品集

## 🐛 常见问题

### 网站显示 404

- 确保 GitHub Pages 已启用
- 检查仓库是否为 Public
- 等待几分钟让 GitHub Pages 完成部署

### 音频无法播放

- 确保使用 HTTPS 访问（GitHub Pages 默认使用 HTTPS）
- 检查浏览器控制台是否有错误信息
- 某些浏览器可能需要用户交互才能播放音频

### 样式或功能异常

- 清除浏览器缓存
- 检查浏览器控制台的错误信息
- 确保所有文件路径正确（相对路径）

## 📞 获取帮助

如果遇到问题：

1. 查看 [GitHub Pages 文档](https://docs.github.com/en/pages)
2. 检查浏览器控制台的错误信息
3. 在 GitHub Issues 中提问

---

**祝你部署顺利！** 🎉
