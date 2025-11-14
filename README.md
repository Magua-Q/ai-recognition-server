# AI 拍照识物微信小程序

## 📱 项目简介

这是一个基于微信小程序的 AI 拍照识物应用，能够实时调用摄像头进行拍照，并识别图片中的物体。

## ✨ 功能特性

- 📷 **实时摄像头预览** - 调用小程序的 camera 组件
- 🎯 **AI 图像识别** - 智能识别物体类别
- 📊 **置信度展示** - 显示识别结果的置信度百分比
- 🎨 **现代 UI 设计** - 渐变背景、卡片式布局
- ⚡ **流畅体验** - 优化的加载和交互状态

## 🏗️ 项目结构

```
.
├── app.js                  # 小程序主逻辑
├── app.json                # 全局配置
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置
├── pages/
│   └── index/
│       ├── index.js        # 首页逻辑
│       ├── index.wxml      # 首页模板
│       ├── index.wxss      # 首页样式
│       └── index.json      # 页面配置
└── README.md               # 项目说明
```

## 🚀 部署说明

### 方案一：使用云函数 + TensorFlow.js

1. **创建云函数**：
   ```bash
   # 在微信开发者工具中，右键 cloudfunctions 目录
   # 选择"新建 Node.js 云函数"
   ```

2. **安装依赖**：
   ```bash
   cd cloudfunctions/classify
   npm install @tensorflow/tfjs @tensorflow-models/mobilenet
   ```

3. **云函数代码示例**：
   ```javascript
   // cloudfunctions/classify/index.js
   const cloud = require('wx-server-sdk')
   const tf = require('@tensorflow/tfjs-node')
   const mobilenet = require('@tensorflow-models/mobilenet')

   cloud.init()
   let model = null

   exports.main = async (event) => {
     const { image } = event

     if (!model) {
       model = await mobilenet.load()
     }

     // 将 base64 转换为图像
     const imgBuffer = Buffer.from(image, 'base64')
     const imageTensor = tf.node.decodeImage(imgBuffer)

     // 进行识别
     const predictions = await model.classify(imageTensor)

     return predictions.map(pred => ({
       className: pred.className,
       probability: (pred.probability * 100).toFixed(2)
     }))
   }
   ```

4. **调用云函数**：
   ```javascript
   // pages/index/index.js
   async classifyImage(imagePath) {
     try {
       const res = await wx.cloud.callFunction({
         name: 'classify',
         data: {
           image: wx.getFileSystemManager().readFileSync(imagePath, 'base64')
         }
       })

       this.setData({ predictions: res.result })
     } catch (err) {
       this.setData({ error: err.message })
     }
   }
   ```

### 方案二：使用第三方 AI API

1. **腾讯云图像识别**：
   - 注册腾讯云账号
   - 开通图像识别服务
   - 获取 SecretId 和 SecretKey
   - 在云函数中调用 API

2. **阿里云图像识别**：
   - 类似腾讯云流程
   - 使用视觉智能开放平台的图像识别 API

3. **百度 AI**：
   - 使用百度智能云的图像识别 API
   - 支持物体检测、场景识别等功能

### 方案三：使用微信小程序插件

- **腾讯云 AI 视觉插件**
- **百度智能小程序插件**
- **阿里云小程序插件**

## 📋 使用说明

1. **导入项目**：
   - 使用微信开发者工具打开项目目录
   - 填写 AppID（测试可使用测试号）

2. **上传云函数**：
   ```bash
   # 在微信开发者工具中
   # 右键云函数目录 -> 上传并部署
   ```

3. **配置云开发**：
   - 在微信开发者工具中开通云开发
   - 选择按量付费或包年包月

4. **运行项目**：
   - 点击"编译"按钮
   - 在模拟器中测试功能
   - 预览体验

## 🔧 开发说明

### API 调用流程

1. 用户点击"拍照识别"
2. 调用 `wx.createCameraContext().takePhoto()`
3. 获取拍照图片路径
4. 将图片上传或转换为 base64
5. 调用 AI 识别接口
6. 返回识别结果并展示

### 权限配置

在小程序 `app.json` 中配置摄像头权限：

```json
{
  "permission": {
    "scope.camera": {
      "desc": "需要使用您的摄像头进行拍照识别"
    }
  }
}
```

## 🎨 UI 样式

项目使用 rpx 单位进行响应式设计，支持不同屏幕尺寸的自适应。

主要样式特点：
- 渐变背景（紫色到粉色）
- 卡片式布局
- 圆角按钮和容器
- 流畅的过渡动画

## 📝 注意事项

1. **域名配置**：
   - 需要在 `app.json` 中配置 `request` 合法域名
   - 上传图片的服务器域名也需要配置

2. **云函数限制**：
   - 单次执行超时时间 10s
   - 内存 512MB
   - 磁盘空间 1GB

3. **测试建议**：
   - 建议在真机上测试摄像头功能
   - 注意光线对识别效果的影响
   - 不同角度和距离会影响准确率

## 🔜 后续优化

- [ ] 添加相册选择功能
- [ ] 支持连续拍照和批量识别
- [ ] 添加历史识别记录
- [ ] 增加识别结果分享功能
- [ ] 支持自定义模型训练

## 📞 技术支持

如有问题，请查看微信小程序官方文档或提交 Issue。

## 📄 许可证

MIT License
