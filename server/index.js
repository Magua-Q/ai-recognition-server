/**
 * AI 图像识别服务器
 * 使用 Express.js + 腾讯云 API
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// 正确导入腾讯云 SDK
const tencentcloud = require('tencentcloud-sdk-nodejs')
const DetectLabelRequest = require('tencentcloud-sdk-nodejs/im/v20190311/DetectLabelRequest')

const app = express()
const port = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' })) // 允许上传大图片
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

// 初始化腾讯云客户端
const ImClient = tencentcloud.im.v20190311.Client

const client = new ImClient({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID || 'YOUR_SECRET_ID',
    secretKey: process.env.TENCENT_SECRET_KEY || 'YOUR_SECRET_KEY',
  },
  region: 'ap-guangzhou',
  profile: {
    httpProfile: {
      endpoint: 'im.tencentcloudapi.com',
    },
  },
})

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI 识别服务运行中' })
})

/**
 * 图像识别接口
 * POST /api/recognize
 * body: { image: base64_string }
 */
app.post('/api/recognize', async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({
        code: -1,
        message: '缺少 image 参数'
      })
    }

    // 验证 base64 格式
    if (!image.startsWith('data:image/') && !image.match(/^[A-Za-z0-9+/=]+$/)) {
      return res.status(400).json({
        code: -1,
        message: '无效的图片格式'
      })
    }

    console.log('收到识别请求，图片大小:', image.length, '字符')

    // 调用腾讯云 API
    const params = {
      ImageBase64: image,
      MaxResults: 5
    }

    const request = new DetectLabelRequest(params)
    const response = await client.DetectLabel(request)

    // 格式化返回结果
    const predictions = response.Labels.map(label => ({
      className: label.Name,
      probability: parseFloat(label.Confidence.toFixed(2))
    }))

    console.log('识别成功，结果数量:', predictions.length)

    res.json({
      code: 0,
      message: 'success',
      data: predictions
    })

  } catch (err) {
    console.error('识别失败:', err)

    // 根据错误类型返回不同错误码
    let code = -1
    let message = err.message

    if (err.code === 'InvalidParameterValue.InvalidImageFormat') {
      code = 1001
      message = '图片格式不支持，请使用 JPG/PNG 格式'
    } else if (err.code === 'InvalidParameterValue.ImageSizeExceeded') {
      code = 1002
      message = '图片大小超过限制（最大 5MB）'
    } else if (err.code === 'UnauthorizedOperation') {
      code = 1003
      message = 'API 密钥无效或权限不足'
    }

    res.status(500).json({
      code,
      message: '识别失败: ' + message,
      data: []
    })
  }
})

/**
 * 批量识别接口
 * POST /api/recognize/batch
 * body: { images: [base64_string, ...] }
 */
app.post('/api/recognize/batch', async (req, res) => {
  try {
    const { images } = req.body

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        code: -1,
        message: 'images 参数必须是数组'
      })
    }

    if (images.length > 5) {
      return res.status(400).json({
        code: -1,
        message: '批量识别最多支持 5 张图片'
      })
    }

    const results = await Promise.all(
      images.map(async (image) => {
        try {
          const params = { ImageBase64: image, MaxResults: 3 }
          const request = new DetectLabelRequest(params)
          const response = await client.DetectLabel(request)

          return {
            code: 0,
            data: response.Labels.map(label => ({
              className: label.Name,
              probability: parseFloat(label.Confidence.toFixed(2))
            }))
          }
        } catch (err) {
          return {
            code: -1,
            message: err.message,
            data: []
          }
        }
      })
    )

    res.json({
      code: 0,
      message: 'success',
      data: results
    })

  } catch (err) {
    console.error('批量识别失败:', err)
    res.status(500).json({
      code: -1,
      message: '批量识别失败: ' + err.message,
      data: []
    })
  }
})

/**
 * 获取服务器信息
 * GET /api/info
 */
app.get('/api/info', (req, res) => {
  res.json({
    name: 'AI 图像识别服务器',
    version: '1.0.0',
    provider: '腾讯云',
    endpoint: '/api/recognize',
    supports: ['单张识别', '批量识别'],
    maxImageSize: '5MB',
    maxBatchSize: 5
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: -1,
    message: '接口不存在',
    data: []
  })
})

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    code: -1,
    message: '服务器内部错误',
    data: []
  })
})

// 启动服务器
app.listen(port, () => {
  console.log(`\n🚀 AI 识别服务器启动成功！`)
  console.log(`📍 服务地址: http://localhost:${port}`)
  console.log(`🔍 健康检查: http://localhost:${port}/health`)
  console.log(`ℹ️  服务信息: http://localhost:${port}/api/info`)
  console.log(`\n⚠️  请确保已设置环境变量：`)
  console.log(`   TENCENT_SECRET_ID`)
  console.log(`   TENCENT_SECRET_KEY`)
  console.log(`\n`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...')
  process.exit(0)
})
