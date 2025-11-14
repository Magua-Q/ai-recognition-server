const cloud = require('wx-server-sdk')
const tencentcloud = require('tencentcloud-sdk-nodejs')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 初始化腾讯云客户端
const { ImageRecognizerClient, DetectLabelRequest } = tencentcloud.im.v20190311

exports.main = async (event, context) => {
  const { image } = event
  const wxContext = cloud.getWXContext()

  try {
    // 从环境变量读取密钥（安全方式）
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
      probability: parseFloat(label.Confidence.toFixed(2))
    }))

    return {
      code: 0,
      message: 'success',
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
