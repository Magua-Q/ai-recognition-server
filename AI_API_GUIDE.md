# AI 识别 API 集成指南

## 🎯 概述

微信小程序中集成 AI 图像识别功能有多种方案，本文档介绍三种主流方案。

## 📚 快速导航

**🔑 密钥创建详细教程** → 参见：[API_KEY_TUTORIAL.md](./API_KEY_TUTORIAL.md)

该文档包含：
- ✅ 详细的图文步骤（每个按钮位置都有说明）
- ✅ 密钥格式示例
- ✅ 常见问题解答
- ✅ 错误排查指南
- ✅ 安全最佳实践

**⚡ 需要快速查看？** - 继续阅读本文档即可！

## 方案一：腾讯云图像识别

### 1. 注册并开通服务

1. 访问 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 搜索"图像识别"服务
3. 开通服务（免费额度：新用户每月 1000 次免费调用）

### 2. 获取密钥

#### 详细步骤：

**步骤 1：登录控制台**
- 访问 [腾讯云控制台](https://console.cloud.tencent.com/)
- 使用微信/QQ 登录或注册新账号

**步骤 2：开通图像识别服务**
- 在控制台顶部搜索框输入"图像识别"
- 点击进入"图像识别"产品页
- 点击"立即使用"或"开通服务"
- 选择按量付费（推荐新手）
- 点击"立即使用"完成开通

**步骤 3：创建 API 密钥**
- 在控制台右上角，点击用户名
- 选择"访问管理" → "API密钥管理"
- 点击"新建密钥"
- 记录生成的密钥（SecretId 和 SecretKey）
- ⚠️ **重要**：SecretKey 只会显示一次，请妥善保存

**示例密钥格式**：
```
SecretId: AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SecretKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**步骤 4：开通接口权限**
- 返回"图像识别"产品页
- 在"接口文档"中确认已开通
- 检查账号余额（需要充值至少 1 元）

### 3. 云函数代码

```javascript
const cloud = require('wx-server-sdk')
const tencentcloud = require('tencentcloud-sdk-nodejs')

cloud.init()
const { ImageRecognizerClient, DetectLabelRequest } = tencentcloud.im.v20190311

exports.main = async (event) => {
  const { image } = event
  const wxContext = cloud.getWXContext()

  try {
    // 初始化客户端
    const client = new ImageRecognizerClient({
      credential: {
        secretId: process.env.SECRET_ID,
        secretKey: process.env.SECRET_KEY,
      },
      region: 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: 'im.tencentcloudapi.com',
        },
      },
    })

    // 请求参数
    const params = {
      ImageBase64: image,
      MaxResults: 5
    }

    const request = new DetectLabelRequest(params)
    const response = await client.DetectLabel(request)

    // 格式化返回结果
    const result = response.Labels.map(label => ({
      className: label.Name,
      probability: (label.Confidence * 100).toFixed(2)
    }))

    return {
      code: 0,
      data: result
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message,
      data: []
    }
  }
}
```

### 4. 安装依赖

```bash
cd cloudfunctions/classify
npm install tencentcloud-sdk-nodejs
```

## 方案二：百度智能云

### 1. 注册并开通

1. 访问 [百度智能云](https://cloud.baidu.com/)
2. 开通"图像识别"服务
3. 创建应用获取 AK、SK

### 2. 获取密钥

#### 详细步骤：

**步骤 1：登录控制台**
- 访问 [百度智能云](https://cloud.baidu.com/)
- 使用百度账号登录或注册新账号（需实名认证）

**步骤 2：开通图像识别服务**
- 在控制台顶部搜索框输入"图像识别"
- 点击进入"图像识别"产品页
- 点击"立即使用"
- 选择"免费试用"或"正式开通"
- 确认开通

**步骤 3：创建应用**
- 在左侧菜单选择"产品服务" → "人工智能" → "图像识别"
- 点击"创建应用"
- 填写应用名称（如：AI识别小程序）
- 选择应用类型：Web应用
- 点击"立即创建"

**步骤 4：获取 AK 和 SK**
- 在应用列表中找到刚创建的应用
- 点击应用名称查看详情
- 记录以下信息：
  - `API Key` (即 client_id)
  - `Secret Key` (即 client_secret)

**示例密钥格式**：
```
API Key: 1234567890abcdef1234567890abcdef
Secret Key: 1234567890abcdef1234567890abcdef
```

**步骤 5：检查服务状态**
- 确认"图像识别"服务状态为"已开通"
- 查看免费额度使用情况

### 3. 云函数代码

```javascript
const cloud = require('wx-server-sdk')
const axios = require('axios')
const crypto = require('crypto')

cloud.init()

exports.main = async (event) => {
  const { image } = event

  try {
    // 获取 access_token
    const tokenRes = await axios.post('https://aip.baidubce.com/oauth/2.0/token', null, {
      params: {
        grant_type: 'client_credentials',
        client_id: 'YOUR_API_KEY',
        client_secret: 'YOUR_SECRET_KEY'
      }
    })

    const access_token = tokenRes.data.access_token

    // 调用识别 API
    const recognizeRes = await axios.post(
      `https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=${access_token}`,
      { image: image },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    )

    // 格式化结果
    const result = recognizeRes.data.result.slice(0, 3).map(item => ({
      className: item.keyword,
      probability: (item.score * 100).toFixed(2)
    }))

    return {
      code: 0,
      data: result
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message,
      data: []
    }
  }
}
```

### 3. 安装依赖

```bash
npm install axios
```

## 方案三：阿里云视觉智能开放平台

### 1. 开通服务

1. 访问 [阿里云](https://www.aliyun.com/)
2. 搜索"图像识别"
3. 开通服务

### 2. 获取密钥

#### 详细步骤：

**步骤 1：登录控制台**
- 访问 [阿里云](https://www.aliyun.com/)
- 使用淘宝/支付宝账号登录或注册新账号（需实名认证）

**步骤 2：开通图像识别服务**
- 在控制台顶部搜索框输入"图像识别"
- 点击进入"图像识别"产品页
- 点击"立即购买"
- 选择"包年包月"或"按量付费"
- 确认购买并开通

**步骤 3：创建 AccessKey**
- 在控制台右上角，将鼠标悬停在头像上
- 选择"AccessKey 管理"
- 点击"创建 AccessKey"
- 验证手机号或邮箱
- 记录生成的密钥：
  - `AccessKeyId`
  - `AccessKeySecret`

**示例密钥格式**：
```
AccessKeyId: LTAIxxxxxxxxxxxxxxxxxxxxxxxx
AccessKeySecret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ 重要提醒**：
- AccessKeySecret 只会显示一次，请立即保存
- 建议创建子账号并限制权限（更安全）

**步骤 4：获取用户信息**
- 在"AccessKey 管理"页面，查看"用户信息"
- 记录 `User ID`（也称为主账号 ID）

**步骤 5：授权图像识别权限**
- 在 RAM 访问控制中，为子账号授权
- 搜索"图像识别"相关权限
- 勾选需要的权限并确认

### 3. 云函数代码

```javascript
const cloud = require('wx-server-sdk')
const { DefaultClient, CreateClient } = require('@alicloud/pop-core')
const crypto = require('crypto')

cloud.init()

exports.main = async (event) => {
  const { image } = event

  try {
    const client = new DefaultClient({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
      endpoint: 'https://image.cn-shanghai.aliyuncs.com',
      apiVersion: '2019-09-30'
    })

    const params = {
      'RegionId': 'cn-shanghai',
      'Image': image,
      'MinScore': 0.5,
      'TopN': 5
    }

    const requestOption = {
      method: 'POST'
    }

    const response = await client.request('RecognizeImage', params, requestOption)

    const result = response.Data.split('\n').slice(0, 3).map(line => {
      const [className, probability] = line.split('\t')
      return {
        className,
        probability: (parseFloat(probability) * 100).toFixed(2)
      }
    })

    return {
      code: 0,
      data: result
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message,
      data: []
    }
  }
}
```

### 3. 安装依赖

```bash
npm install @alicloud/pop-core
```

## 📱 方案二：服务器代理调用

### 1. 服务器端实现（Node.js）

**创建服务器** (`server/index.js`)：

```javascript
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const tencentcloud = require('tencentcloud-sdk-nodejs')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))

// 初始化腾讯云客户端
const { ImageRecognizerClient } = tencentcloud.im.v20190311
const client = new ImageRecognizerClient({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-guangzhou',
})

app.post('/api/recognize', async (req, res) => {
  try {
    const { image } = req.body

    const params = {
      ImageBase64: image,
      MaxResults: 5
    }

    const response = await client.DetectLabel(params)

    const predictions = response.Labels.map(label => ({
      className: label.Name,
      probability: parseFloat(label.Confidence.toFixed(2))
    }))

    res.json({ code: 0, data: predictions })
  } catch (err) {
    res.status(500).json({
      code: -1,
      message: err.message,
      data: []
    })
  }
})

app.listen(3000, () => {
  console.log('服务器启动成功！')
})
```

**安装依赖**：
```bash
cd server
npm init -y
npm install express cors body-parser tencentcloud-sdk-nodejs
```

### 2. 小程序端调用

**修改 pages/index/index.js**：

```javascript
// 调用服务器 API
async callRecognitionAPI(imageBase64) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://your-domain.com/api/recognize', // 你的服务器地址
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: { image: imageBase64 },
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error('服务器响应错误'))
        }
      },
      fail: reject
    })
  })
}

async classifyImage(imagePath) {
  try {
    const fileSystemManager = wx.getFileSystemManager()
    const imageBase64 = fileSystemManager.readFileSync(imagePath, 'base64')

    const res = await this.callRecognitionAPI(imageBase64)

    if (res.code === 0) {
      this.setData({
        predictions: res.data.map(item => ({
          className: item.className,
          probability: item.probability.toFixed(2)
        }))
      })
    } else {
      throw new Error(res.message)
    }
  } catch (err) {
    this.setData({
      error: '识别失败: ' + err.message
    })
  } finally {
    this.setData({ isLoading: false })
  }
}
```

### 3. 配置小程序

**修改 app.json**：

```json
{
  "networkTimeout": {
    "request": 10000
  }
}
```

### 4. 配置域名白名单

在小程序管理后台 → 开发设置 → 服务器域名：

- **request 合法域名**：`https://your-domain.com`

### 5. 部署服务器

**详细部署指南**：参见 [SERVER_DEPLOYMENT_GUIDE.md](./SERVER_DEPLOYMENT_GUIDE.md)

支持的部署方式：
- ✅ 云服务器（腾讯云、阿里云、华为云）
- ✅ 云函数（Serverless）
- ✅ Vercel/Netlify
- ✅ Docker 容器

## 📱 方案一：云函数调用（微信云开发）

### 1. 创建云函数

**cloudfunctions/classify/index.js**：

```javascript
const cloud = require('wx-server-sdk')
const tencentcloud = require('tencentcloud-sdk-nodejs')

cloud.init()

const { ImageRecognizerClient } = tencentcloud.im.v20190311

exports.main = async (event) => {
  const { image } = event

  try {
    const client = new ImageRecognizerClient({
      credential: {
        secretId: process.env.SECRET_ID,
        secretKey: process.env.SECRET_KEY,
      },
      region: 'ap-guangzhou',
    })

    const params = {
      ImageBase64: image,
      MaxResults: 5
    }

    const response = await client.DetectLabel(params)

    const predictions = response.Labels.map(label => ({
      className: label.Name,
      probability: parseFloat(label.Confidence.toFixed(2))
    }))

    return { code: 0, data: predictions }
  } catch (err) {
    return { code: -1, message: err.message, data: [] }
  }
}
```

### 2. 小程序端调用云函数

**pages/index/index.js**：

```javascript
async classifyImage(imagePath) {
  try {
    this.setData({ isLoading: true })

    const fileSystemManager = wx.getFileSystemManager()
    const imageBase64 = fileSystemManager.readFileSync(imagePath, 'base64')

    // 调用云函数
    const res = await wx.cloud.callFunction({
      name: 'classify',
      data: { image: imageBase64 }
    })

    if (res.result.code === 0) {
      this.setData({ predictions: res.result.data })
    } else {
      throw new Error(res.result.message)
    }
  } catch (err) {
    this.setData({
      error: '识别失败: ' + err.message
    })
  } finally {
    this.setData({ isLoading: false })
  }
}
```

## 🔐 隐私与安全注意事项

1. **密钥保护**：
   - 不要在小程序代码中暴露 API 密钥
   - 密钥应存储在云函数的环境变量中

2. **请求频率限制**：
   - 建议在前端增加请求间隔限制
   - 使用防抖技术防止重复提交

3. **数据安全**：
   - 上传的图片会经过云函数处理
   - 建议设置图片自动删除策略

## 💰 费用参考

| 服务商 | 免费额度 | 超出费用 | 推荐指数 |
|--------|----------|----------|----------|
| 腾讯云 | 1000 次/月 | ¥0.01/次 | ⭐⭐⭐⭐⭐ |
| 百度云 | 500 次/月 | ¥0.004/次 | ⭐⭐⭐⭐ |
| 阿里云 | 1000 次/月 | ¥0.008/次 | ⭐⭐⭐ |

### 详细对比

| 特性 | 腾讯云 | 百度云 | 阿里云 |
|------|--------|--------|--------|
| 注册难度 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 免费额度 | 1000次 | 500次 | 1000次 |
| API 简单度 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 文档质量 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 识别准确率 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 价格 | 中等 | 最便宜 | 中等 |
| 社区支持 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## 🎯 快速选择建议

**新手入门** → 选择 **百度云**
- 文档最详细
- API 最简单
- 错误信息清晰

**商业项目** → 选择 **腾讯云**
- 免费额度最高
- 服务稳定
- 售后支持好

**技术专家** → 选择 **阿里云**
- 功能最全面
- 识别类别最多
- 自定义能力强

## 🔐 密钥安全使用指南

### 在云函数中使用密钥（推荐）

#### 步骤 1：设置环境变量

在微信开发者工具中：
1. 点击"云开发" → "云函数"
2. 选择 "classify" 函数
3. 点击"设置" → "环境变量"
4. 添加以下变量：

**腾讯云**：
```
TENCENT_SECRET_ID = 你的 SecretId
TENCENT_SECRET_KEY = 你的 SecretKey
```

**百度云**：
```
BAIDU_API_KEY = 你的 API Key
BAIDU_SECRET_KEY = 你的 Secret Key
```

**阿里云**：
```
ALI_ACCESS_KEY_ID = 你的 AccessKeyId
ALI_ACCESS_KEY_SECRET = 你的 AccessKeySecret
```

#### 步骤 2：在代码中读取环境变量

```javascript
// cloudfunctions/classify/index.js
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  // 从环境变量读取密钥（更安全）
  const SECRET_ID = process.env.TENCENT_SECRET_ID
  const SECRET_KEY = process.env.TENCENT_SECRET_KEY

  // 初始化客户端
  const client = new ImageRecognizerClient({
    credential: {
      secretId: SECRET_ID,
      secretKey: SECRET_KEY,
    },
    // ... 其他配置
  })
}
```

### ❌ 错误做法（不要这样做）

```javascript
// ❌ 错误：直接写死在代码里
const client = new ImageRecognizerClient({
  credential: {
    secretId: 'AKIDxxxxxxxxxxxxxxxxxxxx',
    secretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
})
```

**为什么错误**：
- 密钥会暴露在小程序代码中
- 任何人都可以通过反编译获取密钥
- 造成账号被盗刷和经济损失

### ✅ 正确做法

```javascript
// ✅ 正确：使用环境变量
const client = new ImageRecognizerClient({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
})
```

### 密钥泄露应急处理

如果怀疑密钥泄露：

1. **立即删除密钥**
   - 在云服务商控制台删除泄露的密钥
   - 创建新的密钥

2. **检查使用记录**
   - 查看 API 调用日志
   - 确认是否有异常调用

3. **修改密码**
   - 修改云服务商账号密码
   - 启用双重认证

4. **监控账户**
   - 设置余额提醒
   - 开启异常登录告警

### 最佳实践总结

- ✅ 使用环境变量存储密钥
- ✅ 定期轮换密钥（建议每 3 个月）
- ✅ 启用 API 调用频率限制
- ✅ 设置账户余额告警
- ✅ 创建子账号并限制权限
- ✅ 不在前端代码中暴露密钥
- ✅ 定期检查 API 调用日志
