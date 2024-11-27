<template>
  <div :class="`picker-address ${visible ? 'visible' : ''}`">
    <div class="picker-address__contents" @click.stop="">
      <!-- 标题 -->
      <h3 class="picker-address__title">已选择</h3>
      <!-- 选择结果 -->
      <div class="picker-address__res">
        <!-- 省 -->
        <section
          class="picker-address__res__item"
          :class="innerData.province.code && 'selected'"
          @click.stop="onTap('province')"
        >
          {{ innerData.province.fullName || "选择省份" }}
        </section>
        <!-- 市 -->
        <section
          v-if="innerData.province.code"
          class="picker-address__res__item"
          :class="innerData.city.code && 'selected'"
          @click.stop="onTap('city')"
        >
          {{ innerData.city.fullName || "选择城市" }}
        </section>
        <!-- 区 -->
        <section
          v-if="innerData.province.code && innerData.city.code"
          class="picker-address__res__item"
          :class="innerData.area.code && 'selected'"
          @click.stop="onTap('area')"
        >
          {{ innerData.area.fullName || "选择区县" }}
        </section>
      </div>
      <!-- 选择项 -->
      <div class="picker-address__list">
        <li
          class="picker-address__list__item"
          v-for="(item, index) in items"
          :key="index"
          @click.stop="onItemTap(item)"
        >
          {{ item.fullName }}
        </li>
        <loading v-if="loading" />
      </div>
      <!-- 确认按钮 -->
      <div
        class="picker-address__button"
        :class="disabled && 'disabled'"
        @click="onSure"
      >
        确认
      </div>
      <!-- 关闭按钮 -->
      <div className="picker-address__close_btn" @click="$emit('close')" />
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, PropType, reactive, onMounted, toRefs } from "vue";
import Loading from "../Loading/Loading.vue";

export interface PickerAddressModal {
  code: string;
  fullName: string;
}
export interface PickerAddressData {
  province: PickerAddressModal;
  city: PickerAddressModal;
  area: PickerAddressModal;
}
type KeyType = keyof PickerAddressData;

interface StateProps {
  innerData: PickerAddressData;
  items: PickerAddressModal[];
  k: KeyType;
  loading: boolean;
  disabled: boolean;
}

export default defineComponent({
  props: {
    visible: { type: Boolean, defaule: false },
    data: { type: Object as PropType<PickerAddressData> },
  },
  emits: ["sure", "close", "fetch"],
  components: {
    Loading,
  },
  setup(props, { emit }) {
    // 处理数据
    let obj: PickerAddressData;
    if (props.data) {
      obj = props.data;
    } else {
      obj = {
        province: { code: "", fullName: "" },
        city: { code: "", fullName: "" },
        area: { code: "", fullName: "" },
      };
    }
    // state
    const state = reactive<StateProps>({
      innerData: obj,
      items: [],
      k: "province",
      loading: false,
      disabled: !props.data,
    });

    // methods
    const fetch = (code: string) => {
      state.loading = true;
      emit("fetch", code, (v: PickerAddressModal[]) => {
        state.items = v;
        state.loading = false;
      });
    };
    // events
    const onTap = (k: KeyType) => {
      state.disabled = true;
      state.k = k;
      state.items = [];
      let code = "";
      switch (k) {
        case "province":
          state.innerData = {
            province: { code: "", fullName: "" },
            city: { code: "", fullName: "" },
            area: { code: "", fullName: "" },
          };
          break;
        case "city":
          code = state.innerData.province.code;
          state.innerData = {
            ...state.innerData,
            city: { code: "", fullName: "" },
            area: { code: "", fullName: "" },
          };
          break;
        case "area":
          code = state.innerData.city.code;
          state.innerData = {
            ...state.innerData,
            area: { code: "", fullName: "" },
          };
          break;
      }
      fetch(code);
    };
    const onItemTap = (item: PickerAddressModal) => {
      state.disabled = true;
      state.innerData = {
        ...state.innerData,
        [state.k]: { ...item },
      };
      // 处理key值
      switch (state.k) {
        case "province":
          state.k = "city";
          fetch(item.code);
          break;
        case "city":
          state.k = "area";
          fetch(item.code);
          break;
        case "area":
          state.disabled = false;
          break;
      }
      state.items = [];
    };

    const onSure = () => {
      if (!state.disabled) {
        emit("sure", {
          province: { ...state.innerData.province },
          city: { ...state.innerData.city },
          area: { ...state.innerData.area },
        });
        emit("close");
      }
    };
    // onmounted
    onMounted(() => {
      if (!props.data) {
        fetch("");
      }
    });

    return {
      ...toRefs(state),
      onTap,
      onItemTap,
      onSure,
    };
  },
});
</script>


<style lang="less" scoped>
.picker-address {
  width: 100vw;
  height: 100vh;

  position: fixed;
  top: 0;
  left: 0;

  z-index: -1;
  opacity: 0;
  transition: all 0.25s linear;
  background-color: rgba(0, 0, 0, 0.65);
  &.visible {
    z-index: 999;
    opacity: 1;
  }
  &__contents {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 28px 15px;
    background-color: #ffffff;
    border-radius: 22px 22px 0 0;
  }
  &__title {
    margin-bottom: 17px;
    color: #b5b5b5;
    font-size: 14px;
    line-height: 20px;
  }
  &__res {
    padding-bottom: 15px;
    border-bottom: 1px solid #ececec;
    &__item {
      color: #b1b1b1;
      font-size: 14px;
      line-height: 30px;
      padding-left: 10px;
      position: relative;
      &:not(:last-child) {
        margin-right: 30px;
      }
      &::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        background-image: url("./images/icon_select.png");
        background-position: center center;
        background-size: cover;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -5px;
      }
      &.selected::before {
        background-image: url("./images/icon_selected.png");
      }
    }
  }
  &__list {
    height: 300px;
    overflow-y: scroll;
    margin: 10px 0 20px;
    &__item {
      height: 34px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #444444;
    }
  }
  &__button {
    width: 205px;
    height: 36px;
    margin: 0 auto;

    display: flex;
    justify-content: center;
    align-items: center;

    background: linear-gradient(to right, #ff7e26, #ff4002);
    border-radius: 18px;
    color: #ffffff;
    font-size: 14px;

    &.disabled {
      opacity: 0.5;
    }
  }
  &__close_btn {
    width: 30px;
    height: 30px;
    background: url("./images/icon_close.png") no-repeat center center;
    background-size: 24px;
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
</style>