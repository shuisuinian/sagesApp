// request.js
const request = (options) => {
  return new Promise((resolve, reject) => {
    const { data, method } = options
    if (data && method !== 'get') {
      options.data = JSON.stringify(data)
    }
    wx.request({
      header: { 'Content-Type': 'application/json' },
      ...options,
      success: function (res) {
        if (res.data.code === 2000) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        reject(res.data)
      }
    })
  })
}
export default request