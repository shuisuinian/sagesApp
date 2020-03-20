//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.login();
    
    
  },
  
  login: function(){
    console.log('login start');
    // 登录
    wx.checkSession({
      success: (result) => {
        console.log('存在登录态');
        this.getUserInfo(this.globalData);
      },
      fail: () => {
        // 登录
        console.log('relogin');
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId oZ7iB4namu9ite1eeLdD9ZnkBtXM
            console.log(res.code);
            wx.request({
              url: this.globalData.URL + "/login",
              data: {
                code: res.code
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              success: (result) => {
                console.log("111" + JSON.stringify(result))
                var data = result.data;
                wx.setStorage({
                  key: 'token',
                  data: data.data,
                  success: (result) => {
                    console.log("存入token");
                    this.getUserInfo(this.globalData);
                  },
                  fail: () => { }
                });
              },
              fail: () => { },
              complete: () => { }
            });
          }
        })
      },
      complete: () => { }
    });

  },
  getUserInfo: function (globalData) {
    wx.getUserInfo({
      success: res => {
        if (res == null) {
          console.log("no can get userInfo");
          wx.switchTab({
            url: '/pages/user/index',
          })
        } else {
          var userInfo = res;
          // console.log(userInfo);
          wx.getStorage({
            key: 'token',
            success: function (res) {
              console.log("-----" + JSON.stringify(userInfo));
              wx.request({
                url: globalData.URL + "/updateUserInfo",
                data: {
                  token: res.data,
                  userInfo: JSON.stringify(userInfo)
                },
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: function (res) { 
                  console.log(res);
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            },
            fail: function (res) {
              console.log("fail");
            }
          })
        }
      }
    })
  },
  globalData: {
    URL: 'http://127.0.0.1:8081/api',
    userInfo: null,
    loginCode: null
  }
})