# 🔑 API 密钥创建详细教程

## 📋 目录

1. [腾讯云密钥创建](#tencent-cloud)
2. [百度云密钥创建](#baidu-cloud)
3. [阿里云密钥创建](#ali-cloud)
4. [密钥安全使用](#security)
5. [常见问题](#faq)

---

## 腾讯云 {#tencent-cloud}

### 🎯 详细图文步骤

#### 步骤 1：注册/登录腾讯云

**访问官网**：[https://console.cloud.tencent.com/](https://console.cloud.tencent.com/)

**登录方式**（任选其一）：
- 微信扫码登录（推荐）
- QQ 扫码登录
- 手机号登录

**注册新账号**：
1. 点击"免费注册"
2. 填写手机号/邮箱
3. 验证手机号
4. 完成实名认证（必须）

#### 步骤 2：开通图像识别服务

**搜索服务**：
- 在控制台顶部搜索框输入：`图像识别`
- 从下拉列表中选择"图像识别"

**开通服务**：
1. 进入产品页：[图像识别](https://console.cloud.tencent.com/im)
2. 点击 **"立即使用"** 或 **"开通服务"**
3. 选择计费方式：
   - **推荐**：按量付费（适合测试）
   - 包年包月（适合长期使用）
4. 确认开通

**免费额度**：
- 新用户：1000 次/月免费
- 超额：¥0.01/次

#### 步骤 3：创建 API 密钥

**进入密钥管理**：
1. 点击右上角头像
2. 选择 **"访问管理"**
3. 点击左侧 **"API密钥管理"**

**新建密钥**：
1. 点击 **"新建密钥"**
2. 系统自动生成密钥对：
   - **SecretId**：`AKIDxxxxxxxxxxxxxxxxx`
   - **SecretKey**：`xxxxxxxxxxxxxxxxxxxxxxxxx`

**⚠️ 重要提醒**：
- SecretKey 只显示一次！
- 立即复制保存到安全位置
- 建议使用密码管理器

**示例密钥格式**：
```
SecretId: AKIDEXAMPLE1234567890123456789
SecretKey: XXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### 步骤 4：验证服务状态

**检查服务**：
1. 进入 [图像识别控制台](https://console.cloud.tencent.com/im)
2. 确认状态为 **"已开通"**
3. 查看免费额度使用情况

**充值（如需要）**：
- 点击"充值"按钮
- 至少充值 1 元（按量付费）
- 支持微信/支付宝

---

## 百度云 {#baidu-cloud}

### 🎯 详细图文步骤

#### 步骤 1：注册/登录百度云

**访问官网**：[https://cloud.baidu.com/](https://cloud.baidu.com/)

**登录方式**（任选其一）：
- 百度账号登录
- 手机号登录
- 邮箱登录

**注册新账号**：
1. 点击"免费注册"
2. 填写手机号/邮箱
3. 验证手机号
4. 完成实名认证（必须）

#### 步骤 2：开通图像识别服务

**搜索服务**：
- 在控制台顶部搜索框输入：`图像识别`
- 从搜索结果中选择

**开通服务**：
1. 进入产品页：[图像识别](https://console.bce.baidu.com/ai/)
2. 点击 **"立即使用"**
3. 选择版本：
   - **推荐**：免费试用（500次/月）
   - 正式开通
4. 点击 **"立即使用"** 确认开通

**免费额度**：
- 新用户：500 次/月免费
- 超额：¥0.004/次

#### 步骤 3：创建应用

**进入应用管理**：
1. 左侧菜单：**"产品服务"** → **"人工智能"** → **"图像识别"**
2. 点击 **"应用管理"**

**创建应用**：
1. 点击 **"创建应用"**
2. 填写表单：
   - 应用名称：`AI识别小程序`
   - 应用类型：`Web应用`
   - 应用描述：可选填写
3. 点击 **"立即创建"**

#### 步骤 4：获取 AK/SK

**查看密钥**：
1. 在应用列表中找到刚创建的应用
2. 点击应用名称进入详情页
3. 复制以下信息：
   - **API Key**
   - **Secret Key**

**示例密钥格式**：
```
API Key: 1234567890abcdef1234567890abcdef
Secret Key: 1234567890abcdef1234567890abcdef
```

#### 步骤 5：验证服务状态

**检查状态**：
1. 进入 [图像识别控制台](https://console.bce.baidu.com/ai/)
2. 确认服务状态：**"已开通"**
3. 查看免费额度剩余次数

---

## 阿里云 {#ali-cloud}

### 🎯 详细图文步骤

#### 步骤 1：注册/登录阿里云

**访问官网**：[https://www.aliyun.com/](https://www.aliyun.com/)

**登录方式**（任选其一）：
- 淘宝账号登录（推荐）
- 支付宝账号登录
- 钉钉账号登录

**注册新账号**：
1. 点击"免费注册"
2. 填写手机号/邮箱
3. 验证手机号
4. 完成实名认证（必须）

#### 步骤 2：开通图像识别服务

**搜索服务**：
- 在控制台顶部搜索框输入：`图像识别`
- 选择"图像识别（包年包月）"或"按量付费"

**开通服务**：
1. 进入产品页：[视觉智能开放平台](https://vision.aliyun.com/)
2. 点击 **"立即购买"**
3. 选择计费方式：
   - **推荐**：按量付费（适合测试）
   - 包年包月（适合长期使用）
4. 选择地域（推荐：华东2-上海）
5. 确认购买

**免费额度**：
- 新用户：1000 次/月免费
- 超额：¥0.008/次

#### 步骤 3：创建 AccessKey

**进入密钥管理**：
1. 将鼠标悬停在右上角头像上
2. 选择 **"AccessKey 管理"**

**创建密钥**：
1. 点击 **"创建 AccessKey"**
2. 验证手机号/邮箱
3. 系统生成密钥对：
   - **AccessKeyId**
   - **AccessKeySecret**

**⚠️ 重要提醒**：
- AccessKeySecret 只显示一次！
- 立即复制保存
- 建议使用子账号（更安全）

**示例密钥格式**：
```
AccessKeyId: LTAIxxxxxxxxxxxxxxxxxxxxxxxx
AccessKeySecret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 步骤 4：创建子账号（推荐，更安全）

**进入 RAM 控制台**：
1. 搜索框输入：`RAM 访问控制`
2. 进入控制台

**创建用户**：
1. 点击 **"用户"** → **"创建用户"**
2. 填写登录名称：`ai-recognition`
3. 选择编程访问（必须）
4. 点击 **"确定"**

**授权权限**：
1. 点击刚创建的用户
2. 点击 **"添加权限"**
3. 搜索：`视觉智能开放平台`
4. 勾选相关权限
5. 确认授权

**获取子账号密钥**：
- 使用子账号登录获取 AccessKey
- 或在用户详情页创建新的 AccessKey

#### 步骤 5：验证服务状态

**检查服务**：
1. 进入 [视觉智能开放平台](https://vision.aliyun.com/)
2. 确认状态为 **"已开通"**
3. 查看使用统计

---

## 密钥安全使用 {#security}

### ✅ 推荐流程

#### 1. 在云函数中设置环境变量

**步骤**：
1. 打开微信开发者工具
2. 点击 **"云开发"**
3. 进入 **"云函数"** 页面
4. 选择 `classify` 函数
5. 点击 **"设置"**
6. 选择 **"环境变量"** 标签
7. 添加密钥变量

**腾讯云示例**：
```
变量名：TENCENT_SECRET_ID
变量值：你的 SecretId
```

```
变量名：TENCENT_SECRET_KEY
变量值：你的 SecretKey
```

**百度云示例**：
```
变量名：BAIDU_API_KEY
变量值：你的 API Key
```

```
变量名：BAIDU_SECRET_KEY
变量值：你的 Secret Key
```

**阿里云示例**：
```
变量名：ALI_ACCESS_KEY_ID
变量值：你的 AccessKeyId
```

```
变量名：ALI_ACCESS_KEY_SECRET
变量值：你的 AccessKeySecret
```

#### 2. 在代码中使用环境变量

```javascript
// cloudfunctions/classify/index.js
const cloud = require('wx-server-sdk')
const tencentcloud = require('tencentcloud-sdk-nodejs')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const { ImageRecognizerClient, DetectLabelRequest } = tencentcloud.im.v20190311

exports.main = async (event, context) => {
  const { image } = event
  const wxContext = cloud.getWXContext()

  try {
    // ✅ 从环境变量读取密钥（安全）
    const client = new ImageRecognizerClient({
      credential: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
      },
      region: 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: 'im.tencentcloudapi.com',
        },
      },
    })

    // ... 识别逻辑

    return {
      code: 0,
      data: predictions
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message
    }
  }
}
```

### ❌ 禁止做法

```javascript
// ❌ 错误：写死在代码里
const client = new ImageRecognizerClient({
  credential: {
    secretId: 'AKIDEXAMPLE123456789',
    secretKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  },
})
```

**危害**：
- 密钥会打包到小程序代码中
- 任何人都能通过反编译获取
- 造成账号被盗刷

---

## 常见问题 {#faq}

### Q1：忘记保存 SecretKey 怎么办？

**A：** 只能删除并重新创建密钥对
1. 进入密钥管理页面
2. 删除旧的密钥
3. 创建新密钥
4. 更新云函数环境变量

### Q2：密钥泄露了怎么处理？

**A：** 立即执行以下操作
1. **删除密钥**：在控制台删除泄露的密钥
2. **创建新密钥**：生成新的密钥对
3. **更新代码**：修改云函数环境变量
4. **检查账单**：查看是否有异常调用
5. **修改密码**：修改云服务账号密码
6. **启用 MFA**：开启双重认证

### Q3：实名认证失败怎么办？

**A：** 检查以下几点
- 确保身份证信息真实有效
- 照片清晰，四角完整
- 姓名与身份证一致
- 手机号已验证
- 等待审核（通常1-3个工作日）

### Q4：免费额度用完了怎么办？

**A：** 三种方案
1. **充值**：按量付费，充值继续使用
2. **等待**：下月1号重新获得免费额度
3. **更换服务商**：使用其他云服务商的免费额度

### Q5：图像识别返回错误？

**A：** 常见错误及解决方案

**错误：InvalidParameterValue.InvalidImageFormat**
- 原因：图片格式不支持
- 解决：确保图片为 JPG/PNG 格式

**错误：InvalidParameterValue.ImageSizeExceeded**
- 原因：图片太大（超过 5MB）
- 解决：压缩图片后再上传

**错误：UnauthorizedOperation**
- 原因：密钥无效或权限不足
- 解决：检查密钥是否正确，权限是否已授权

**错误：NoPermission**
- 原因：服务未开通
- 解决：确认服务状态为"已开通"

### Q6：小程序调用云函数报错？

**A：** 检查步骤
1. **检查云函数部署**：确保云函数已上传
2. **检查环境变量**：确保密钥已正确设置
3. **检查网络权限**：确保小程序有网络权限
4. **检查控制台日志**：查看详细错误信息

### Q7：如何降低 API 调用成本？

**A：** 优化建议
1. **前端去重**：避免用户重复提交同一图片
2. **本地缓存**：缓存已识别过的结果
3. **压缩图片**：降低图片质量减少流量
4. **批量识别**：合并多次识别请求
5. **选择低价服务**：百度云最便宜（¥0.004/次）

### Q8：可以同时使用多个服务商吗？

**A：** 可以，但建议
- 主服务：选择一个作为主要服务
- 备用服务：其他作为容灾备用
- 在代码中实现降级策略
- 根据错误码切换服务

### Q9：如何监控 API 调用次数？

**A：** 各服务商都有监控
- **腾讯云**：控制台 → 费用中心 → 使用明细
- **百度云**：控制台 → 费用中心 → 使用统计
- **阿里云**：控制台 → 费用 → 使用记录

### Q10：小程序需要 ICP 备案吗？

**A：** 看情况
- **不需要**：如果服务器在境外或使用云开发
- **需要**：如果使用国内服务器部署
- 建议咨询微信官方客服确认

---

## 📞 技术支持

| 服务商 | 文档地址 | 客服电话 | 在线客服 |
|--------|----------|----------|----------|
| 腾讯云 | [官方文档](https://cloud.tencent.com/document) | 95716 | 工单系统 |
| 百度云 | [官方文档](https://cloud.baidu.com/doc) | 400-890-0000 | 在线咨询 |
| 阿里云 | [官方文档](https://help.aliyun.com) | 95187 | 工单系统 |

---

**⚠️ 注意事项**：
- 所有价格可能随时变动，请以官网为准
- 免费额度通常有有效期，过期清零
- 建议定期检查账单，避免意外扣费
- 密钥和密码请妥善保管，不要分享给他人

