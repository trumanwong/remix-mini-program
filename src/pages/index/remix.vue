<template>
  <view>
    <view>
      <nut-tabs v-model="value" title-scroll title-gutter="5" @change="changeTab">
        <nut-tabpane v-for="(item, index) in options" :title="item.text" :key="index"></nut-tabpane>
      </nut-tabs>
      <!--      <nut-menu>-->
      <!--        <nut-menu-item v-model="value" :options="options"/>-->
      <!--      </nut-menu>-->
    </view>
    <view>
      <image @load="bindload" mode='widthFix' style="width: 100%;" :src="templatePaths[value]"/>
    </view>
    <view>
      <nut-input v-for="(item, index) in sentences" :key="index" :label="`第${index+1}句`"
                 :placeholder="sentenceTemplates[value][index]"
                 v-model="sentences[index]" maxlength="20"/>
    </view>
    <view style="margin-top: 5px; height: 90px">
      <nut-button color="linear-gradient(to right, #ff6034, #ee0a24)" style="margin-right: 5px" @click="generate"> 生成 </nut-button>
      <nut-button type="info" @click="saveFile"> 保存 </nut-button>
    </view>
    <nut-toast :msg="toastMsg" v-model:visible="toastShow" :type="toastType" />
  </view>
</template>

<script>
import {reactive, toRefs} from 'vue';
import request from "../../plugins/http/request"
import config from "../../config/config"
import Helper from "../../plugins/helper/helper";

export default {
  components: {},
  setup() {
    const helper = new(Helper)
    const resData = reactive({
      value: 0,
      options: [],
      templatePaths: [],
      sentenceTemplates: [],
      sentences: [],
      toastMsg: '',
      toastShow: false,
      toastType: 'text',
      isGenerated: false,
    });
    resData.toastMsg = '正在初始化'
    resData.toastShow = true
    resData.toastType = 'loading'

    request('get', '/config/1', {}).then((res) => {
      resData.options = res.data.content.options
      resData.templatePaths = res.data.content.template_paths
      resData.sentenceTemplates = res.data.content.sentence_templates

      for (let i = 0; i < resData.sentenceTemplates[resData.value].length; i++) {
        resData.sentences.push('')
      }
    })

    const changeTab = () => {
      resData.sentences = new Array(resData.sentenceTemplates[resData.value].length)
    }

    const generate = () => {
      let params = {
        texts: resData.sentences.join(','),
        remix_type: resData.value
      }
      resData.toastMsg = 'Please wait...'
      resData.toastShow = true
      resData.toastType = 'loading'
      request('post', '/task', params).then((res) => {
        let interval = setInterval(function () {
          request('get', `/task/show?serial=${res.data.serial}`).then((resp) => {
            if (resp.data.status !== 1) {
              return
            }
            resData.toastShow = false

            resData.toastMsg = '图片加载中...'
            resData.toastShow = true
            resData.toastType = 'loading'
            clearInterval(interval)
            resData.templatePaths[resData.value] = `${config.url}/storage${resp.data.convert_path}`
          })
        }, 2000)
      })
    }

    const bindload = () => {
      resData.toastShow = false
    }

    const saveFile = () => {
      helper.saveFile(resData.templatePaths[resData.value])
    }

    return {
      ...toRefs(resData),
      changeTab,
      generate,
      saveFile,
      bindload,
    }
  }
}
</script>

<style lang="scss">
.index {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.hidden {
  display: none !important;
}

.nut-tabpane {
  padding: 0 0 !important;
}
</style>
