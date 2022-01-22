<template>
  <view>
    <view>
      <div class="desc-content">
        有些动态图片倒放起来可能会很有趣，这个动态图片倒放工具能帮助你完成这个想法。
      </div>
      <swiper pagination-color="#426543" :interval="6000" :displayMultipleItems="2">
        <swiper-item>
          <img mode='widthFix' style="width: 100%" src="https://cdn.trumanwl.com/static/images/hotlink-ok/liubei.gif"/>
        </swiper-item>
        <swiper-item>
          <img mode='widthFix' style="width: 100%"
               src="https://cdn.trumanwl.com/static/images/hotlink-ok/liubei-revert.gif"/>
        </swiper-item>
      </swiper>
    </view>
    <view>
        <nut-cell icon="uploader" @click="upload" title="上传gif动图" desc="上传"></nut-cell>
    </view>
    <view>
      <div>
        <nut-noticebar v-if="list.length > 0" text="请别忘了下载您的文件（点击下载按钮），文件将在60分钟后自动删除"></nut-noticebar>
      </div>
      <view v-for="(item, index) in list" :style="{height: item.height}">
        <nut-tabs title-scroll direction="vertical" v-model="item.show_index">
          <nut-tabpane title="原图">
            <image mode='widthFix' v-show="item.show_index === 0" style="width: 100%" :src="item.path"/>
          </nut-tabpane>
          <nut-tabpane title="倒放图">
            <div v-show="item.show_index === 1">
              <image @load="bindload" mode='widthFix' style="width: 100%" :src="item.convert_path"/>
              <nut-cell>
                <template v-slot:link>
                  <nut-button type="info" plain icon="download" style="margin-right: 5px" @click="download(item)">下载</nut-button>
                  <nut-button type="primary" plain icon="del2" @click="deleteTask(item)">删除</nut-button>
                </template>
              </nut-cell>
            </div>
          </nut-tabpane>
        </nut-tabs>
        <nut-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
        </nut-divider>
      </view>
    </view>
    <nut-toast :msg="toastMsg" v-model:visible="toastShow" :type="toastType" />
  </view>
</template>

<script>
import {reactive, toRefs, ref} from 'vue';
import config from "../../config/config"
import request from "../../plugins/http/request";
import Helper from "../../plugins/helper/helper";

export default {
  props: {
  },
  setup(props) {
    const helper = new (Helper)
    const resData = reactive({
      list: [],
      toastMsg: '',
      toastShow: false,
      toastType: 'text',
    })

    const upload = () => {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
          let arr = res.tempFiles[0].tempFilePath.split('.')
          if (arr[arr.length - 1] !== 'gif') {
            wx.showToast({
              title: '请选择gif动图',
              icon: 'error',
            })
            return
          }

          wx.showLoading({
            title: 'Please wait...',
          })
          wx.uploadFile({
            url: `${config.apiUrl}/api/v2/task`,
            filePath: res.tempFiles[0].tempFilePath,
            name: 'file',
            header: {
              'Authorization': `Bearer ${wx.getStorageSync('token')}`,
            },
            dataType: 'json',
            success(res) {
              let interval = setInterval(function () {
                let data = JSON.parse(res.data)
                request('get', `/task/show?serial=${data.data.serial}`).then((resp) => {
                  if (resp.data.status !== 1) {
                    return
                  }
                  clearInterval(interval)
                  wx.hideLoading()
                  resData.toastMsg = '图片加载中'
                  resData.toastShow = true
                  resData.toastType = 'loading'
                  getList()
                })
              }, 2000)
            }
          })
        }
      })
    }

    const getList = () => {
      request('get', '/task').then(res => {
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].show_index = 1
          res.data.list[i].height = (i === res.data.list.length - 1) ? '375px' : ''
          res.data.list[i].path = `${config.url}/storage${res.data.list[i].path}`
          res.data.list[i].convert_path = `${config.url}/storage${res.data.list[i].convert_path}`
        }
        resData.list = res.data.list
      })
    }

    const download = (item) => {
      helper.saveFile(item.convert_path)
    }

    const deleteTask = (item) => {
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success(res) {
          if (res.confirm) {
            request('delete', `/task?serial=${item.serial}`).then((res) => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
              })
              getList()
            })
          }
        }
      })
    }

    const bindload = () => {
      resData.toastShow = false
    }

    return {
      ...toRefs(resData),
      upload,
      download,
      deleteTask,
      getList,
      bindload,
    }
  }
}
</script>

<style>
.desc-content {
  display: block;
  padding: 24 rpx 52 rpx;
  color: #666;
  font-size: 28 rpx;
  line-height: 1.5;
  background-color: #fff;
}
</style>
