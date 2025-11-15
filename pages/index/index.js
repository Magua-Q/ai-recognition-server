Page({
  data: {
    isLoading: false,
    isModelLoading: true,
    predictions: [],
    error: null,
    isCameraActive: false
  },

  onLoad() {
    this.init()
  },

  onUnload() {
    this.stopCamera()
  },

  async init() {
    try {
      this.setData({ isModelLoading: true })

      // 等待 1 秒初始化
      await this.sleep(1000)

      console.log('AI 识别服务初始化完成')
    } catch (err) {
      this.setData({ error: '初始化失败: ' + err.message })
    } finally {
      this.setData({ isModelLoading: false })
    }
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  startCamera() {
    try {
      this.setData({ error: null })
      this.setData({ isCameraActive: true })
      console.log('摄像头已启动')
    } catch (err) {
      this.setData({ error: '无法访问摄像头: ' + err.message })
    }
  },

  stopCamera() {
    this.setData({ isCameraActive: false })
    console.log('摄像头已停止')
  },

  async captureAndClassify() {
    try {
      this.setData({
        isLoading: true,
        error: null
      })

      const context = wx.createCameraContext()

      // 拍照
      context.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log('拍照成功:', res.tempImagePath)
          this.classifyImage(res.tempImagePath)
        },
        fail: (err) => {
          console.error('拍照失败:', err)
          this.setData({
            isLoading: false,
            error: '拍照失败: ' + err.errMsg
          })
        }
      })
    } catch (err) {
      this.setData({
        isLoading: false,
        error: '识别失败: ' + err.message
      })
    }
  },

  async classifyImage(imagePath) {
    try {
      // 读取图片文件并转换为 base64
      const fileSystemManager = wx.getFileSystemManager()
      const imageBase64 = fileSystemManager.readFileSync(imagePath, 'base64')

      console.log('图片转换完成，大小:', imageBase64.length)

      // 调用服务器 API
      const res = await this.callRecognitionAPI(imageBase64)

      if (res.code === 0) {
        this.setData({
          predictions: res.data.map(item => ({
            className: item.className,
            probability: item.probability.toFixed(2)
          }))
        })
      } else {
        throw new Error(res.message || '识别失败')
      }

      console.log('识别完成:', res.data)
    } catch (err) {
      this.setData({
        error: '识别失败: ' + err.message
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 调用服务器 API
  async callRecognitionAPI(imageBase64) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://ai-recognition-server-vercel-7bfh.vercel.app/api/recognize', // 替换为你的服务器地址
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          image: imageBase64
        },
        timeout: 10000, // 10 秒超时
        success: (res) => {
          console.log('API 响应:', res.data)
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error('服务器响应错误: ' + res.statusCode))
          }
        },
        fail: (err) => {
          console.error('API 调用失败:', err)
          reject(new Error('网络请求失败: ' + err.errMsg))
        }
      })
    })
  }
})
