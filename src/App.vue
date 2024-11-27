<script setup lang="ts">
// -- imports
import { onMounted, ref, provide } from "vue";
import Tools from "@likg/tools";
import NotWeixin from "comps/@lgs/NotWeixin/NotWeixin.vue";
import BindPhone from "comps/@lgs/BindPhone/BindPhone.vue";
import Bus from "@likg/bus";
import router from "@/router";

// -- constants
const env = Tools.getEnv();
const SOURCE_MP = import.meta.env.VITE_SOURCE === "mp";

// -- refs
const showBindPhone = ref(false);
const isTapCloseIcon = ref(false);
const isBindedPhone = ref(false);

// 监听到手机绑定之后刷新数据
provide("BINDED_PHONE", (cb: Function) => {
  Bus.$on("BINDED_PHONE", () => {
    cb();
  });
});

// -- life circles
onMounted(() => {
  // 记录首次进入时的url，用于iOS注册js-sdk
  window.CONFIG_URL_FOR_IOS = window.location.href;
  // 监听手机号绑定相关事件
  Bus.$on("SHOW_BIND_PHONE", () => {
    showBindPhone.value = true;
  });
  Bus.$on("BINDED_PHONE", () => {
    showBindPhone.value = false;
    isBindedPhone.value = true;
  });
  // 监听用户点击系统返回按钮事件 --
  window.addEventListener(
    "popstate",
    function (_) {
      if (showBindPhone.value) {
        showBindPhone.value = false;
      }
    },
    false
  );
});

// -- events
const onHideBindPhone = () => {
  Bus.$emit("BIND_PHONE_TO_INDEX");
  if (
    // 过滤路由/不跳转/当前页绑定
    !/(callback$)|(mine$)/.test(window.location.pathname) &&
    isTapCloseIcon.value &&
    !isBindedPhone.value
  ) {
    isTapCloseIcon.value = false;
    router.back();
  }
};
const onTapBindPhoneCloseIcon = () => {
  isTapCloseIcon.value = true;
};
</script>

<template>
  <template v-if="SOURCE_MP && !['weixin', 'alipay'].includes(env)">
    <not-weixin />
  </template>
  <template v-else>
    <router-view />
  </template>
  <!-- 全局组件：绑定手机号 -->
  <van-popup v-model:show="showBindPhone" position="bottom" closeable @close="onHideBindPhone" @click-close-icon="onTapBindPhoneCloseIcon">
    <BindPhone />
  </van-popup>
</template>
