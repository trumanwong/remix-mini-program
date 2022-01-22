import config from '../../config/config'

const login = function (type) {
  return new Promise((resolve, reject) => {
    try {
      wx.removeStorageSync('token')
      let expire = wx.getStorageSync(`token_${type}_expire`)
      let token = wx.getStorageSync(`token_${type}`)
      if (expire && token && expire > new Date().getTime()) {
        wx.setStorageSync('token', token)
        return resolve({})
      }
    } catch (e) {}
    wx.login({
      success: res => {
        let code = res.code
        wx.request({//后台请求
          url: `${config.apiUrl}/api/v2/mini-program-login`,
          method: 'post',
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            code: code,
            type: type,
          },
          dataType: 'json',
          success: function (res) {
            if (res.data.code === 200) {
              wx.setStorageSync('token', res.data.data)
              wx.setStorageSync(`token_${type}`, res.data.data)
              wx.setStorageSync(`token_${type}_expire`, (new Date().getTime()) + 2400000)
              return resolve({})
            }
          },
          fail: function (res) {
            console.log(res)
          }
        });
      }
    })
  })
}

export default login;
