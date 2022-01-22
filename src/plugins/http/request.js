import config from '../../config/config'

const request = function (method, path, params, header = {}) {
  let token = ''
  try {
    token = wx.getStorageSync('token')
  } catch (ex) {

  }
  header['Authorization'] = `Bearer ${token}`
  header['Content-Type'] = 'application/x-www-form-urlencoded'
  return new Promise((resolve, reject) => {
    wx.request({//后台请求
      url: `${config.apiUrl}/api/v2${path}`,
      header: header,
      method: method,
      data: params,
      success: function (res) {
        if (res.data.code !== 200) {
          reject(res.data)
        } else {
          if (res.data && res.data.data && res.data.data.code === 20006) {
            login(3).then((res) => {
              resolve(res)
            }).catch((errMsg) => {
              reject(errMsg);
            })
          }
          resolve(res.data)
        }
      },
      fail: function (res) {
        reject("not data");
      }
    });
  });
}

export default request;
