# 🚀 服务器代理方案部署指南

## 📋 概述

本方案使用独立的服务器代理来调用 AI 识别 API，小程序通过 HTTP 请求访问服务器，实现图像识别功能。

**架构图**：
```
小程序 → 服务器 (Express.js) → 腾讯云 API
```

## 📁 项目结构

```
d:\code\paizhaoshibie/
├── server/                    # 服务器代码
│   ├── index.js              # 服务器主文件
│   ├── package.json          # 依赖配置
│   └── .env.example          # 环境变量示例
├── pages/index/index.js      # 小程序调用代码
├── app.json                  # 小程序配置
└── ...其他文件
```

## 🛠️ 部署步骤

### 第一步：部署服务器

#### 方式一：使用云服务器（推荐）

**1. 购买云服务器**
- 腾讯云轻量应用服务器（https://cloud.tencent.com/product/lighthouse）
- 阿里云 ECS（https://ecs-buy.aliyun.com/）
- 华为云 ECS（https://www.huaweicloud.com/product/ecs.html）

**最低配置**：
- CPU: 1核
- 内存: 1GB
- 硬盘: 20GB
- 带宽: 1Mbps
- 系统: Ubuntu 20.04 LTS

**2. 连接服务器**
```bash
# 使用 SSH 连接服务器
ssh root@your-server-ip

# 更新系统
apt update && apt upgrade -y
```

**3. 安装 Node.js**
```bash
# 安装 Node.js 16.x
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

**4. 安装依赖**
```bash
# 克隆项目到服务器
git clone https://github.com/your-repo/ai-recognition.git
cd ai-recognition/server

# 安装依赖
npm install
```

**5. 配置环境变量**
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
nano .env

# 添加你的腾讯云密钥
TENCENT_SECRET_ID=你的 SecretId
TENCENT_SECRET_KEY=你的 SecretKey
PORT=3000
```

**6. 启动服务器**
```bash
# 开发模式启动
npm run dev

# 生产模式启动（使用 PM2）
npm install -g pm2
npm run pm2

# 查看服务状态
pm2 status
pm2 logs ai-recognition
```

**7. 配置防火墙**
```bash
# 开放 3000 端口
ufw allow 3000

# 启用防火墙
ufw enable

# 查看防火墙规则
ufw status
```

#### 方式二：使用云函数（无服务器）

如果你不想管理服务器，可以使用腾讯云云函数：

**1. 安装 Serverless Framework**
```bash
npm install -g serverless
npm install -g serverless-tencent-scf
```

**2. 创建 serverless.yml**
```yaml
service: ai-recognition

provider:
  name: tencent
  runtime: Nodejs8.9
  region: ap-beijing
  stage: dev
  memorySize: 512MB
  timeout: 10

plugins:
  - serverless-tencent-scf

functions:
  api:
    handler: index.main_handler
    events:
      - http:
          path: /api/recognize
          method: post
      - http:
          path: /health
          method: get
```

**3. 部署**
```bash
# 配置密钥
serverless config credentials --provider tencent --key YOUR_SECRET_ID --secret YOUR_SECRET_KEY

# 部署
serverless deploy
```

#### 方式三：使用 Vercel/Netlify

**1. 打包服务器代码**
将 `server/index.js` 转换为 Vercel/Netlify Function

**2. 创建 `api/recognize.js`**
```javascript
const tencentcloud = require('tencentcloud-sdk-nodejs')

const { ImageRecognizerClient } = tencentcloud.im.v20190311

const client = new ImageRecognizerClient({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-guangzhou',
})

module.exports = async (req, res) => {
  const { image } = req.body

  try {
    const params = { ImageBase64: image, MaxResults: 5 }
    const request = new tencentcloud.im.v20190311.DetectLabelRequest(params)
    const response = await client.DetectLabel(request)

    const predictions = response.Labels.map(label => ({
      className: label.Name,
      probability: parseFloat(label.Confidence.toFixed(2))
    }))

    res.json({ code: 0, data: predictions })
  } catch (err) {
    res.status(500).json({ code: -1, message: err.message })
  }
}
```

**3. 部署**
```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod
```

### 第二步：配置小程序

**1. 修改服务器地址**
编辑 `pages/index/index.js`，将 `https://your-domain.com` 替换为你的实际服务器地址：

```javascript
wx.request({
  url: 'https://your-domain.com/api/recognize', // 修改这里
  // ...
})
```

**2. 配置域名白名单**

在小程序管理后台（https://mp.weixin.qq.com/）：
1. 进入你的小程序
2. 点击"开发" → "开发设置"
3. 找到"服务器域名"
4. 在"request 合法域名"中添加你的服务器域名：
   ```
   https://your-domain.com
   ```
5. 保存并提交审核

**注意**：本地测试时可以在开发者工具中勾选"不校验合法域名"，但正式发布时必须配置白名单。

### 第三步：测试部署

**1. 测试服务器**
```bash
# 检查服务是否启动
curl http://your-server-ip:3000/health

# 预期响应
{
  "status": "ok",
  "message": "AI 识别服务运行中"
}
```

**2. 测试 API**
```bash
# 使用 curl 测试
curl -X POST http://your-server-ip:3000/api/recognize \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_data"}'
```

**3. 测试小程序**
1. 在微信开发者工具中打开小程序
2. 点击"启动摄像头"
3. 点击"拍照识别"
4. 查看是否能正常获取识别结果

## 🔧 高级配置

### 使用 Nginx 反向代理

**1. 安装 Nginx**
```bash
apt install nginx -y
```

**2. 配置 Nginx**
创建 `/etc/nginx/sites-available/ai-recognition`：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60;
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
    }
}
```

**3. 启用站点**
```bash
ln -s /etc/nginx/sites-available/ai-recognition /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 配置 HTTPS（SSL）

**使用 Let's Encrypt 免费证书**：
```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx -y

# 获取证书
certbot --nginx -d your-domain.com

# 自动续期
crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 负载均衡

如果访问量较大，可以使用 Nginx 进行负载均衡：

```nginx
upstream ai_recognition {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://ai_recognition;
    }
}
```

## 📊 监控与日志

### PM2 监控

```bash
# 查看进程状态
pm2 status

# 查看实时日志
pm2 logs ai-recognition

# 重启服务
pm2 restart ai-recognition

# 停止服务
pm2 stop ai-recognition

# 删除服务
pm2 delete ai-recognition

# 监控面板
pm2 monit
```

### 日志分析

```bash
# 查看访问日志
tail -f /var/log/nginx/access.log

# 查看错误日志
tail -f /var/log/nginx/error.log

# 分析访问量
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -20
```

### 设置告警

**使用 UptimeRobot**：
1. 注册 https://uptimerobot.com/
2. 添加监控（Monitor Type: HTTPS）
3. 设置检查间隔（建议 5 分钟）
4. 配置邮箱/微信告警

**使用腾讯云监控**：
1. 进入腾讯云控制台
2. 搜索"云监控"
3. 创建告警策略
4. 设置阈值（如 CPU > 80%）
5. 配置通知渠道

## 💰 成本估算

### 云服务器成本（按月）

| 规格 | 腾讯云轻量 | 阿里云ECS | 华为云ECS |
|------|-----------|----------|----------|
| 1核1G | ¥24 | ¥24.5 | ¥23.8 |
| 1核2G | ¥40 | ¥42 | ¥39.6 |
| 2核4G | ¥104 | ¥108 | ¥102 |

### API 调用成本

| 服务商 | 1000次/月 | 10000次/月 | 100000次/月 |
|--------|----------|-----------|-----------|
| 腾讯云 | ¥10 | ¥100 | ¥1000 |
| 百度云 | ¥4 | ¥40 | ¥400 |
| 阿里云 | ¥8 | ¥80 | ¥800 |

### 总成本示例

**小型项目**（1000次/天）：
- 服务器：¥24/月
- API：¥300/月
- 总计：¥324/月

**中型项目**（10000次/天）：
- 服务器：¥40/月
- API：¥3000/月
- 总计：¥3040/月

## 🔐 安全加固

### 1. API 限流

**使用 express-rate-limit**：
```javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: 10, // 最多 10 次请求
  message: '请求过于频繁，请稍后再试'
})

app.use('/api/', limiter)
```

### 2. API 签名验证

**在小程序端生成签名**：
```javascript
// 生成签名
function generateSignature(data, secret) {
  const params = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&')

  const sign = crypto
    .createHmac('sha256', secret)
    .update(params)
    .digest('hex')

  return sign
}
```

**在服务器端验证签名**：
```javascript
// 验证签名
function verifySignature(data, signature, secret) {
  const expectedSignature = generateSignature(data, secret)
  return signature === expectedSignature
}
```

### 3. IP 白名单

```javascript
const ALLOWED_IPS = ['123.456.789.123', '456.789.123.456']

app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress

  if (!ALLOWED_IPS.includes(clientIP)) {
    return res.status(403).json({
      code: -1,
      message: 'IP 不在白名单中'
    })
  }

  next()
})
```

### 4. 输入验证

```javascript
const Joi = require('joi')

const schema = Joi.object({
  image: Joi.string()
    .base64()
    .max(5 * 1024 * 1024) // 5MB
    .required()
})

app.post('/api/recognize', async (req, res) => {
  try {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        code: -1,
        message: error.details[0].message
      })
    }

    // 处理请求
  } catch (err) {
    res.status(500).json({ code: -1, message: err.message })
  }
})
```

## 🐛 常见问题

### Q1：服务器启动失败

**错误**：`EADDRINUSE: address already in use :::3000`

**解决**：
```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 PID

# 或使用其他端口
PORT=3001 npm start
```

### Q2：小程序请求失败

**错误**：`request:fail url not in domain list`

**解决**：
1. 检查 app.json 是否配置了 networkTimeout
2. 在小程序后台配置域名白名单
3. 确保服务器域名正确且可访问

### Q3：API 调用超时

**解决**：
1. 增加请求超时时间
2. 优化图片大小（压缩后再上传）
3. 检查服务器性能

### Q4：识别准确率低

**优化建议**：
1. 确保图片清晰、光线充足
2. 图片大小适中（建议 1-2MB）
3. 避免反光或模糊
4. 尝试不同角度和距离

### Q5：服务器内存不足

**解决**：
1. 升级服务器配置
2. 重启服务释放内存
3. 使用 PM2 监控内存使用

## 📞 技术支持

- **腾讯云文档**：https://cloud.tencent.com/document
- **Express.js 文档**：https://expressjs.com/
- **PM2 文档**：https://pm2.keymetrics.io/

## 🎯 下一步

1. ✅ 部署服务器
2. ✅ 配置小程序
3. ✅ 测试功能
4. ✅ 配置监控
5. ✅ 性能优化
6. ✅ 安全加固
7. ✅ 正式上线

恭喜！你已成功使用服务器代理方案实现 AI 图像识别功能！🎉
