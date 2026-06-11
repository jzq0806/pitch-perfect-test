# 🔥 Firebase 设置指南

## 步骤 1：创建 Firebase 项目

### 1.1 访问 Firebase Console
1. 打开浏览器，访问：https://console.firebase.google.com/
2. 使用你的 Google 账号登录

### 1.2 创建新项目
1. 点击 **"添加项目"** 或 **"Create a project"**
2. 输入项目名称：`pitch-perfect-test`（或你喜欢的名字）
3. 点击 **"继续"**
4. **Google Analytics**：可以选择启用或禁用（建议启用以追踪用户）
5. 如果启用了 Analytics，选择或创建一个 Analytics 账号
6. 点击 **"创建项目"**
7. 等待项目创建完成（约 30 秒）

## 步骤 2：注册 Web 应用

### 2.1 添加 Web 应用
1. 在项目概览页面，点击 **Web 图标** `</>`（在 iOS 和 Android 图标旁边）
2. 输入应用昵称：`Pitch Perfect Web`
3. ✅ **勾选** "同时为此应用设置 Firebase Hosting"
4. 点击 **"注册应用"**

### 2.2 获取配置信息
Firebase 会显示类似这样的配置代码：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "pitch-perfect-test.firebaseapp.com",
  projectId: "pitch-perfect-test",
  storageBucket: "pitch-perfect-test.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

**⚠️ 重要：复制这段配置代码，稍后需要用到！**

## 步骤 3：启用 Authentication

### 3.1 进入 Authentication
1. 在左侧菜单中，点击 **"Build"** → **"Authentication"**
2. 点击 **"Get started"** 或 **"开始使用"**

### 3.2 启用登录方式
1. 点击 **"Sign-in method"** 标签页
2. 点击 **"Email/Password"**
3. ✅ 启用 **"Email/Password"**
4. ❌ 不需要启用 "Email link (passwordless sign-in)"
5. 点击 **"保存"**

### 3.3 （可选）启用 Google 登录
1. 点击 **"Google"**
2. ✅ 启用
3. 选择项目支持电子邮件
4. 点击 **"保存"**

## 步骤 4：设置 Firestore Database

### 4.1 创建数据库
1. 在左侧菜单中，点击 **"Build"** → **"Firestore Database"**
2. 点击 **"创建数据库"**

### 4.2 选择安全规则
选择 **"以测试模式启动"**（稍后我们会更新安全规则）
- 这允许在开发期间读写数据
- ⚠️ 30 天后会自动禁用写入权限

### 4.3 选择位置
选择离你最近的位置：
- **亚洲**：`asia-east1` (台湾) 或 `asia-northeast1` (东京)
- **美国**：`us-central1` (爱荷华)
- **欧洲**：`europe-west1` (比利时)

⚠️ **注意：位置一旦选择无法更改！**

点击 **"启用"**

## 步骤 5：更新 Firestore 安全规则

### 5.1 进入规则编辑器
1. 在 Firestore Database 页面
2. 点击 **"规则"** 标签页

### 5.2 替换规则
将默认规则替换为以下内容：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户数据：只有登录用户可以读写自己的数据
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 测试结果：只有登录用户可以读写自己的测试结果
    match /testResults/{userId}/results/{resultId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 全局统计：所有人可读，只有服务器可写
    match /globalStats/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

点击 **"发布"**

## 步骤 6：准备配置信息

### 6.1 创建配置文件
在你的项目中，我需要你提供以下信息：

1. **apiKey**: `AIzaSy...`
2. **authDomain**: `your-project.firebaseapp.com`
3. **projectId**: `your-project-id`
4. **storageBucket**: `your-project.appspot.com`
5. **messagingSenderId**: `123456789012`
6. **appId**: `1:123456789012:web:...`
7. **measurementId**: `G-XXXXXXXXXX`（如果启用了 Analytics）

### 6.2 发送给我
完成上述步骤后，请将 Firebase 配置信息发送给我，格式如下：

```
apiKey: AIzaSy...
authDomain: pitch-perfect-test.firebaseapp.com
projectId: pitch-perfect-test
storageBucket: pitch-perfect-test.appspot.com
messagingSenderId: 123456789012
appId: 1:123456789012:web:...
measurementId: G-XXXXXXXXXX
```

## ✅ 完成检查清单

在继续之前，请确认：

- [ ] Firebase 项目已创建
- [ ] Web 应用已注册
- [ ] 已获取 Firebase 配置信息
- [ ] Authentication 已启用（Email/Password）
- [ ] Firestore Database 已创建
- [ ] 安全规则已更新
- [ ] 已准备好配置信息发送给我

## 🚀 下一步

完成这些步骤后，告诉我你已经准备好了，并提供配置信息。我会：

1. 创建 Firebase 集成代码
2. 实现用户登录/注册功能
3. 实现数据同步
4. 添加关卡详细统计
5. 实现大众数据对比

## ❓ 遇到问题？

如果在设置过程中遇到任何问题，请告诉我具体在哪一步卡住了，我会帮你解决！
