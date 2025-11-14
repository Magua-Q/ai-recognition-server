# 🚀 详细部署操作指南

## 📋 快速导航

选择最适合你的部署方式：

- **方式一：Vercel 部署（推荐新手）** ⭐⭐⭐⭐⭐
  - 5分钟快速上线
  - 无需服务器
  - 免费使用

- **方式二：云服务器部署（推荐企业）**
  - 完全自主可控
  - 性能更稳定
  - 需付费购买服务器

- **方式三：本地测试**
  - 快速验证功能
  - 方便调试
  - 仅用于测试

---

## 🎯 方式一：Vercel 部署（5分钟上线）

### 步骤 1：注册 Vercel 账号

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录（没有则先注册 GitHub）
3. 完成邮箱验证

### 步骤 2：上传代码到 GitHub

1. 在 GitHub 创建新仓库
   - 仓库名：`ai-recognition-server`
   - 设置为 Public
   - 不勾选 README（本地已有）

2. 上传代码：
```bash
# 在本地项目根目录执行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/ai-recognition-server.git
git push -u origin main
```

### 步骤 3：部署到 Vercel

1. 在 Vercel 控制台点击 "New Project"
2. 选择你刚创建的 `ai-recognition-server` 仓库
3. 配置设置：
   - **Framework Preset**: Other
   - **Root Directory**: server
   - **Build Command**: `npm install`（如果需要）
   - **Output Directory**: `.`（默认）
4. 点击 "Deploy"

### 步骤 4：配置环境变量

1. 部署完成后，进入项目设置
2. 点击 "Environment Variables"
3. 添加变量：
   - `TENCENT_SECRET_ID` = 你的 SecretId
   - `TENCENT_SECRET_KEY` = 你的 SecretKey
4. 保存并重新部署

### 步骤 5：获取 API 地址

部署成功后，Vercel 会提供一个 URL：
- 格式：`https://ai-recognition-server.vercel.app`
- API 地址：`https://ai-recognition-server.vercel.app/api/recognize`

### 步骤 6：测试 API

```bash
curl -X POST https://你的地址.vercel.app/api/recognize \
  -H "Content-Type: application/json" \
  -d '{"image": "base64图片数据"}'
```

### ✅ Vercel 部署完成！

**优点**：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动扩容
- ✅ 无需服务器管理

**缺点**：
- ❌ 冷启动（第一次访问较慢）
- ❌ 有请求数限制（免费版 100次/天）

---

## 🖥️ 方式二：云服务器部署

### 步骤 1：购买云服务器

#### 腾讯云轻量服务器（推荐）

1. 访问：https://cloud.tencent.com/product/lighthouse
2. 选择配置：
   - **地域**：就近选择（如：广州/上海）
   - **系统**：Ubuntu 20.04 LTS
   - **套餐**：1核1G，够用
3. 购买（首单有优惠，约 ¥24/月）
4. 设置密码（记住！）

#### 阿里云 ECS

1. 访问：https://ecs-buy.aliyun.com/
2. 选择配置类似腾讯云
3. 价格略高，但稳定性好

### 步骤 2：连接服务器

#### Windows 用户：

1. 下载 SSH 工具：
   - **推荐**：Xshell（免费）
   - 或：PuTTY

2. 连接服务器：
   - 主机：你的服务器公网 IP
   - 端口：22
   - 用户名：`root`
   - 密码：购买时设置的密码

#### Mac/Linux 用户：

```bash
ssh root@你的服务器IP
# 输入密码
```

### 步骤 3：安装必要软件

连接到服务器后，依次执行：

```bash
# 更新系统包
apt update && apt upgrade -y

# 安装 Node.js 16.x
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2（进程管理）
npm install -g pm2

# 安装 Git
apt install git -y

# 验证安装
node --version  # 应显示 v16.x.x
npm --version   # 应显示 8.x.x
pm2 --version   # 应显示 5.x.x
```

### 步骤 4：上传项目代码

#### 方法一：Git 克隆（推荐）

```bash
# 克隆你的 GitHub 仓库
cd /root
git clone https://github.com/你的用户名/ai-recognition-server.git
cd ai-recognition-server/server

# 安装依赖
npm install
```

#### 方法二：FTP 上传

1. 下载 FTP 工具：FileZilla
2. 连接服务器
3. 上传 `server/` 文件夹到 `/root/`

### 步骤 5：配置环境变量

```bash
# 进入项目目录
cd /root/ai-recognition-server/server

# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
nano .env

# 在打开的文件中，修改：
TENCENT_SECRET_ID=你的真实SecretId
TENCENT_SECRET_KEY=你的真实SecretKey
PORT=3000

# 保存退出：Ctrl + X，然后按 Y，再按 Enter
```

### 步骤 6：启动服务器

```bash
# 启动开发模式（测试）
npm run dev

# 如果测试通过，停止（Ctrl+C），然后启动生产模式：
npm run pm2

# 查看服务状态
pm2 status

# 查看日志
pm2 logs ai-recognition
```

### 步骤 7：配置防火墙

```bash
# 开放 3000 端口（HTTP）
ufw allow 3000

# 开放 22 端口（SSH）
ufw allow 22

# 启用防火墙
ufw enable

# 查看规则
ufw status
```

### 步骤 8：购买域名并解析（可选但推荐）

1. 购买域名（如：阿里云万网）
2. 在域名管理后台添加解析：
   - 记录类型：A
   - 主机记录：`api`（或其他）
   - 记录值：你的服务器 IP
   - TTL：600
3. 保存后等待生效（约10分钟）

### 步骤 9：安装 Nginx（反向代理）

```bash
# 安装 Nginx
apt install nginx -y

# 启动 Nginx
systemctl start nginx
systemctl enable nginx

# 创建配置文件
nano /etc/nginx/sites-available/ai-recognition

# 粘贴以下配置（修改你的域名）：
server {
    listen 80;
    server_name 你的域名.com;  # 如果没有域名，使用服务器IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 启用配置
ln -s /etc/nginx/sites-available/ai-recognition /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重新加载 Nginx
systemctl reload nginx
```

### 步骤 10：配置 HTTPS（SSL证书）

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx -y

# 获取证书（替换为你的域名）
certbot --nginx -d 你的域名.com

# 设置自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

# 访问测试
curl https://你的域名.com/api/health
```

### ✅ 云服务器部署完成！

**API 地址**：
- 如果有域名：`https://你的域名.com/api/recognize`
- 如果只有 IP：`http://你的服务器IP/api/recognize`

**管理命令**：
```bash
# 查看服务状态
pm2 status

# 重启服务
pm2 restart ai-recognition

# 查看日志
pm2 logs ai-recognition --lines 100

# 停止服务
pm2 stop ai-recognition
```

---

## 🧪 方式三：本地测试（快速验证）

### 步骤 1：安装 Node.js

**Windows/Mac**：
1. 访问 https://nodejs.org
2. 下载并安装 LTS 版本

**Linux**：
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 步骤 2：启动服务器

```bash
# 进入 server 目录
cd server

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的密钥

# 启动服务器
npm start
```

### 步骤 3：测试 API

新开一个终端窗口：

```bash
# 健康检查
curl http://localhost:3000/health

# 测试识别接口（需要 base64 图片）
curl -X POST http://localhost:3000/api/recognize \
  -H "Content-Type: application/json" \
  -d '{"image": "base64数据"}'
```

### ✅ 本地测试完成！

**API 地址**：`http://localhost:3000/api/recognize`

**⚠️ 注意**：本地测试仅能在开发者工具中调试，需勾选"不校验合法域名"。

---

## 🔧 配置小程序

无论使用哪种部署方式，都需要配置小程序：

### 步骤 1：修改 API 地址

编辑 `pages/index/index.js`：

```javascript
// 将这行
url: 'https://your-domain.com/api/recognize',

# 替换为你的实际地址
# Vercel: https://你的用户名.vercel.app/api/recognize
# 服务器: https://你的域名.com/api/recognize
# 本地: http://你的IP:3000/api/recognize
```

### 步骤 2：配置域名白名单

1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入你的小程序
3. 点击"开发" → "开发设置"
4. 找到"服务器域名"
5. 在"request 合法域名"中添加你的 API 域名
6. 点击"保存并提交"

### 步骤 3：测试小程序

1. 用微信开发者工具打开小程序
2. 点击"启动摄像头"
3. 点击"拍照识别"
4. 查看识别结果

---

## 📊 对比三种方式

| 方式 | 难度 | 成本 | 速度 | 稳定性 | 推荐度 |
|------|------|------|------|--------|--------|
| Vercel | ⭐ | 免费 | 中等 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 云服务器 | ⭐⭐⭐ | ¥24/月 | 快 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 本地测试 | ⭐⭐ | 免费 | 快 | ⭐ | ⭐⭐ |

---

## 💰 成本总结

| 部署方式 | 服务器 | 域名 | SSL证书 | 总计 |
|----------|--------|------|---------|------|
| Vercel | ¥0 | 可选 ¥50/年 | ¥0 | ¥0-50/年 |
| 云服务器 | ¥24/月 | 可选 ¥50/年 | ¥0 | ¥288-338/年 |
| 本地测试 | ¥0 | ¥0 | ¥0 | ¥0 |

---

## 🐛 常见问题

### Q1：Vercel 部署失败？

**解决**：
- 检查环境变量是否设置
- 查看部署日志定位错误
- 确保仓库是 Public

### Q2：服务器连接失败？

**解决**：
- 检查服务器 IP、用户名、密码
- 确认安全组已开放 22 端口
- 重置服务器密码

### Q3：API 调用超时？

**解决**：
- 增加小程序超时时间
- 优化图片大小（建议 < 2MB）
- 检查服务器性能

### Q4：小程序域名校验失败？

**解决**：
- 确保域名已备案
- 检查白名单配置
- 使用 HTTPS（SSL证书）

### Q5：如何查看详细日志？

**Vercel**：
- 控制台 → Functions → 查看日志

**服务器**：
```bash
pm2 logs ai-recognition
```

**本地**：
- 终端窗口查看输出

---

## 🎯 推荐流程

**新手** → 使用 Vercel（简单快速）
1. 注册 Vercel → 2分钟
2. 上传代码 → 3分钟
3. 配置环境变量 → 1分钟
4. 配置小程序 → 3分钟
**总计：约 10 分钟**

**企业** → 使用云服务器（稳定可控）
1. 购买服务器 → 5分钟
2. 部署代码 → 10分钟
3. 配置 Nginx → 5分钟
4. 配置 HTTPS → 5分钟
5. 配置小程序 → 3分钟
**总计：约 30 分钟**

---

## 📞 获取帮助

遇到问题？按以下方式排查：

1. **查看日志**
   - Vercel：控制台日志
   - 服务器：`pm2 logs ai-recognition`

2. **检查配置**
   - 环境变量是否正确
   - API 地址是否正确
   - 域名白名单是否配置

3. **测试 API**
   - 使用 curl 直接测试
   - 查看返回的错误信息

4. **查看文档**
   - 服务器部署：参考本指南
   - 小程序配置：参考 `AI_API_GUIDE.md`

---

## ✅ 完成检查清单

- [ ] 选择部署方式
- [ ] 准备 API 密钥
- [ ] 完成部署
- [ ] 测试 API 接口
- [ ] 修改小程序代码
- [ ] 配置域名白名单
- [ ] 真机测试
- [ ] 正式发布

**恭喜！你的 AI 识别小程序即将上线！** 🎉

---

## 📌 重要提醒

1. **安全第一**
   - 不要泄露 API 密钥
   - 定期轮换密钥
   - 启用监控告警

2. **成本控制**
   - 设置余额提醒
   - 监控 API 调用量
   - 优化代码减少调用

3. **稳定性**
   - 使用 PM2 管理进程
   - 配置 Nginx 反向代理
   - 开启自动重启

4. **用户体验**
   - 配置合理的超时时间
   - 添加 loading 状态
   - 优化错误提示

祝部署顺利！ 🚀
