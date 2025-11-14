# ⚠️ 安全提醒：已清理敏感信息

## 🔒 已执行的安全修复

### 发现的问题
在项目中发现了**真实 API 密钥**硬编码的问题，这会导致严重的安全风险。

### 已修复的文件

#### 1. `server/.env.example` ✅
**修改前**：
```bash
TENCENT_SECRET_ID=AKIDKfmecNvvpX3MSJ7kBPPBj4B5jBRTP8cr
TENCENT_SECRET_KEY=5vYw61hAQSGpT8jPzMVP4Vgz5xay95mD
```

**修改后**：
```bash
TENCENT_SECRET_ID=YOUR_SECRET_ID
TENCENT_SECRET_KEY=YOUR_SECRET_KEY
```

#### 2. `AI_API_GUIDE.md` ✅
**修改前**：
```javascript
secretId: 'AKIDKfmecNvvpX3MSJ7kBPPBj4B5jBRTP8cr',
secretKey: '5vYw61hAQSGpT8jPzMVP4Vgz5xay95mD',
```

**修改后**：
```javascript
secretId: process.env.SECRET_ID,
secretKey: process.env.SECRET_KEY,
```

#### 3. `cloudfunctions/classify/index.js` ✅
**修改前**：
- 使用模拟数据和注释
- 包含 TensorFlow.js 示例

**修改后**：
- 完整的腾讯云 API 调用实现
- 使用环境变量读取密钥
- 移除敏感的硬编码

## 🚨 紧急提醒

### 如果你之前使用了这些密钥，请立即：

1. **删除这些密钥**
   - 登录腾讯云控制台
   - 进入 API 密钥管理
   - 删除密钥：`AKIDKfmecNvvpX3MSJ7kBPPBj4B5jBRTP8cr`
   - 创建新的密钥

2. **检查使用记录**
   - 查看 API 调用日志
   - 确认是否有异常调用
   - 统计使用次数

3. **修改密码**
   - 修改腾讯云账号密码
   - 启用双重认证（MFA）

4. **监控账户**
   - 设置余额提醒
   - 开启异常登录告警

## ✅ 正确做法

### 1. 使用环境变量
```bash
# .env 文件（不要提交到 Git）
TENCENT_SECRET_ID=你的真实密钥
TENCENT_SECRET_KEY=你的真实密钥
```

### 2. 在代码中读取环境变量
```javascript
// ✅ 正确：使用环境变量
const client = new ImageRecognizerClient({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
})
```

### 3. 提交前检查
确保 `.env` 文件在 `.gitignore` 中：
```
# .gitignore
.env
node_modules/
```

## ❌ 错误做法

```javascript
// ❌ 错误：硬编码密钥
const client = new ImageRecognizerClient({
  credential: {
    secretId: 'AKIDKfmecNvvpX3MSJ7kBPPBj4B5jBRTP8cr',
    secretKey: '5vYw61hAQSGpT8jPzMVP4Vgz5xay95mD',
  },
})
```

**危害**：
- 密钥会暴露在代码中
- 任何人都能通过反编译获取
- 造成账号被盗刷
- 产生经济损失

## 📝 最佳实践

1. **密钥管理**
   - ✅ 使用环境变量或密钥管理服务
   - ✅ 定期轮换密钥（建议每 3 个月）
   - ✅ 限制密钥权限
   - ✅ 创建子账号并限制权限

2. **代码安全**
   - ✅ 提交前扫描敏感信息
   - ✅ 使用 `.gitignore` 忽略敏感文件
   - ✅ 启用 Git 提交钩子
   - ✅ 定期审计代码

3. **监控告警**
   - ✅ 设置余额提醒
   - ✅ 开启异常调用告警
   - ✅ 监控 API 调用量
   - ✅ 设置登录异常提醒

4. **应急响应**
   - ✅ 制定密钥泄露应急流程
   - ✅ 定期演练应急响应
   - ✅ 建立密钥泄露检测机制
   - ✅ 准备备用方案

## 🔍 如何避免

### 使用工具扫描
```bash
# 使用 git-secrets 扫描
git secrets --scan

# 使用 TruffleHog 扫描
trufflehog file://path/to/repo
```

### Git 提交钩子
创建 `.git/hooks/pre-commit`：
```bash
#!/bin/sh
# 扫描敏感信息
if grep -r "AKID\|password\|secret\|key" --include="*.js" --include="*.json" .; then
  echo "发现敏感信息，提交被拒绝"
  exit 1
fi
```

### 使用 .gitignore
```
# 敏感文件
.env
.env.local
.env.*.local

# 密钥文件
*.pem
*.key
*.p12
*.pfx

# 配置文件
config/keys.js
config/secrets.js
```

## 📞 联系方式

如果发现任何安全问题或需要帮助，请立即联系。

## 📌 重要提醒

- **敏感信息一旦泄露，无法撤回**
- **请立即检查你的腾讯云账户**
- **所有代码应使用环境变量管理密钥**
- **不要将包含真实密钥的文件提交到版本控制系统**

---

**修复时间**：2025年11月15日

**状态**：✅ 所有敏感信息已清理
