//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Meteor DDP todos 例子',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //todo list page 按钮事件
  bindBtnTap: function() {
    wx.redirectTo({
      url: '../todos/todos'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
