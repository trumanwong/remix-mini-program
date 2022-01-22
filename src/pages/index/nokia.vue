<template>
  <view>
    <image mode='widthFix' @load="bindload" style="width: 100%;" :src="imageSrc"/>
    <nut-textarea v-model="text" placeholder="输入您想生成的短信文字" limit-show max-length="30"/>
    <nut-divider/>
    <view style="margin-top: 5px; height: 75px">
      <nut-button color="linear-gradient(to right, #ff6034, #ee0a24)" style="margin-right: 5px" @click="generate"> 生成
      </nut-button>
      <nut-button type="info" @click="saveFile"> 保存</nut-button>
    </view>
    <nut-toast :msg="toastMsg" v-model:visible="toastShow" :type="toastType"/>
  </view>
</template>

<script>
import {reactive, toRefs} from "vue";
import request from "../../plugins/http/request";
import config from "../../config/config";
import Helper from "../../plugins/helper/helper";

export default {
  setup() {
    const helper = new (Helper)
    const resData = reactive({
      text: '',
      imageSrc: 'https://cdn.trumanwl.com/static/images/hotlink-ok/nokia.png',
      toastMsg: '',
      toastShow: false,
      toastType: '',
    })

    const generate = () => {
      if (resData.text.trim().length === 0) {
        wx.showToast({
          title: '请输入您想生成的短信文字',
          icon: 'error',
        })
        return
      }
      wx.showLoading({
        title: 'Please wait...',
      })
      request('post', `/task`, {text: resData.text.trim()}).then((res) => {
        let interval = setInterval(function () {
          request('get', `/task/show?serial=${res.data.serial}`).then((resp) => {
            if (resp.data.status !== 1) {
              return
            }
            wx.hideLoading()
            clearInterval(interval);
            resData.toastMsg = '图片加载中...'
            resData.toastShow = true
            resData.toastType = 'loading'
            resData.imageSrc = `${config.url}/storage${resp.data.convert_path}`
          })
        }, 2000)
      })
    }

    const saveFile = () => {
      helper.saveFile(resData.imageSrc)
    }

    const bindload = () => {
      resData.toastShow = false
    }

    return {
      ...toRefs(resData),
      generate,
      saveFile,
      bindload,
    }
  }
}
</script>
