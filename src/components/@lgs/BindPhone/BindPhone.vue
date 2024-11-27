<script lang="ts">
import Bus from '@likg/bus';
import Validator from '@likg/validator';
import { Toast } from 'vant';
import {
  defineComponent,
  onUnmounted,
  reactive,
  toRefs,
  watch,
  watchEffect,
} from 'vue';
interface StateProps {
  phone: string;
  code: string;
  countdown: number;
  bounding: number;
  timer: any;
  canSendCode: boolean;
  canBind: boolean;
}
export default defineComponent({
  setup() {
    const state = reactive<StateProps>({
      phone: '',
      code: '',
      countdown: 60,
      bounding: 60,
      timer: null,
      canSendCode: false,
      canBind: false,
    });
    // events
    const onSendMsg = () => {
      if (!state.canSendCode) {
        return;
      }
      // --- 调用接口获取短信验证码
      Toast.loading({
        message: '正在发送...',
        duration: 20 * 1000,
      });
      setTimeout(() => {
        // 临时代码
        Toast.clear();
        state.timer = setInterval(() => {
          if (state.countdown === 1) {
            state.countdown = state.bounding;
            clearInterval(state.timer);
          } else {
            state.countdown -= 1;
          }
        }, 1000);
        // api.login
        //   .sendBindPhoneCaptcha<GD.BaseResponse<any>>(state.phone)
        //   .then((res) => {
        //     if (res && res.code === 0) {
        //       // --- 验证码发送成功之后开始倒计时
        //       state.timer = setInterval(() => {
        //         if (state.countdown === 1) {
        //           state.countdown = state.bounding;
        //           clearInterval(state.timer);
        //         } else {
        //           state.countdown -= 1;
        //         }
        //       }, 1000);
        //     }
        //   })
        //   .catch(() => {});
      }, 500);
    };
    const onBind = () => {
      if (!state.canBind) {
        return;
      }
      Toast.loading({
        message: '正在绑定...',
        duration: 20 * 1000,
      });
      setTimeout(() => {
        // 临时代码
        Toast.clear();
        Bus.$emit('BIND_PHONE_TO_INDEX');
        Bus.$emit('BINDED_PHONE');
        // api.login
        //   .bindPhone<GD.BaseResponse<{ token: string }>>({
        //     phone: state.phone,
        //     smsCode: state.code,
        //   })
        //   .then((res) => {
        //     if (res && res.code === 0) {
        //       Bus.$emit("BIND_PHONE_TO_INDEX");
        //       Bus.$emit("BINDED_PHONE");

        //       Cookie.set("AUTHORIZATION_TOKEN", res.data.token);
        //       Storage.set("HAS_BIND_PHONE", true);
        //     }
        //   })
        //   .catch(() => {});
      }, 500);
    };

    // watch
    watchEffect(() => {
      if (!Validator.isTel(state.phone) || state.code.length !== 6) {
        state.canBind = false;
      } else {
        state.canBind = true;
      }
    });
    watch(
      () => state.phone,
      (phone) => {
        state.canSendCode = Validator.isTel(phone);
      }
    );
    // life circles
    onUnmounted(() => {
      clearInterval(state.timer);
      state.timer = null;
    });

    return {
      ...toRefs(state),
      onSendMsg,
      onBind,
    };
  },
});
</script>

<template>
  <div class="bind-phone">
    <img class="logo" src="./images/logo.png" />
    <div class="mt-50">
      <van-field
        v-model="phone"
        type="tel"
        maxlength="11"
        clearable
        placeholder="请输入手机号码"
        :border="false"
      />
      <van-field
        v-model="code"
        type="digit"
        maxlength="6"
        clearable
        placeholder="请输入验证码"
        :border="false"
      >
        <template #button>
          <div
            v-if="countdown === bounding"
            @click="onSendMsg"
            :style="{ color: canSendCode ? '#FF8F00' : '#FBD3A1' }"
          >
            发送验证码
          </div>
          <div v-else style="color: #fbd3a1">{{ countdown }}S后重新获取</div>
        </template>
      </van-field>
    </div>
    <div class="bind-btn" :class="{ can: canBind }" @click="onBind">
      绑定手机号
    </div>
  </div>
</template>

<style lang="less" scoped>
.bind-phone {
  height: 100vh;
  border-radius: 30px;
  padding: 50px 30px 80px;
}
.logo {
  width: 100px;
  height: 100px;
  display: block;
  margin: 0 auto;
}
:deep(.van-field) {
  height: 47px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  color: red;
}
.code-button {
  font-size: 14px;
  font-weight: 400;
  color: #fbd3a1;
  line-height: 14px;
}
.bind-btn {
  margin-top: 50px;
  height: 44px;
  background: red;
  color: #fff;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
  font-weight: 500;
  opacity: 0.5;

  &.can {
    opacity: 1;
  }
}
</style>
