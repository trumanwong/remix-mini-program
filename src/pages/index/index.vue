<template>
  <view class="index">
    <remix v-show="showTabIndex === 0"></remix>
    <nokia v-show="showTabIndex === 1"></nokia>
    <reverse ref="reverseRef" v-show="showTabIndex === 2"></reverse>
    <nut-tabbar :bottom="true" @tab-switch="tabSwitch">
      <nut-tabbar-item tab-title="鬼畜动图生成器" icon="home"></nut-tabbar-item>
      <nut-tabbar-item tab-title="诺基亚短信生成器" icon="message"></nut-tabbar-item>
      <nut-tabbar-item tab-title="Gif倒放" icon="retweet"></nut-tabbar-item>
    </nut-tabbar>
  </view>
</template>

<script>
import {reactive, toRefs, ref} from 'vue';
import {miniProgramLogin} from "../../api/api";
import Remix from './remix'
import Nokia from './nokia'
import Reverse from './reverse'

export default {
  name: 'Index',
  components: {
    Reverse,
    Remix,
    Nokia
  },
  setup(props) {
    const reverseRef = ref(null)
    const resData = reactive({
      showTabIndex: 0,
    });
    miniProgramLogin(2)

    const tabSwitch = (item, index) => {
      resData.showTabIndex = index
      if (index === 1) {
        miniProgramLogin(1)
      } else if (index === 2) {
        miniProgramLogin(0).then((res) => {
          reverseRef.value.getList()
        })
      } else {
        miniProgramLogin(2)
      }
    }

    return {
      ...toRefs(resData),
      tabSwitch,
      reverseRef
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
