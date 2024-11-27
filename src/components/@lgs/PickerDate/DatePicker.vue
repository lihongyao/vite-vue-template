<template>
  <div class="lg-picker-res" @click="visible = true">
    {{ value || "请选择" }}
    <img class="icon" :src="icon" />
  </div>
  <!-- 拾取器 -->
  <div v-show="visible" class="lg-picker-wrapper">
    <van-datetime-picker
      class="date-picker"
      :type="type"
      :title="title"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="onPickerConfirm"
      @cancel="visible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    value: String,
    icon: {
      type: String,
      default:
        "https://img.meituan.net/csc/0aaa3f21468c18e5199a0c362c77cad21001.png",
    },
    title: String,
    type: {
      type: String,
      default: "date",
    },
    format: {
      type: String,
      default: "YYYY/MM/DD",
    },
    minDate: {
      type: Date,
      default: new Date(1970, 0, 1),
    },
    maxDate: {
      type: Date,
      default: new Date(new Date()),
    },
  },
  emits: ["confirm"],
  setup(props, ctx) {
    // state
    const visible = ref(false);
    // methods
    const formatter = (type: string, val: string) => {
      if (type === "year") {
        return `${val}年`;
      }
      if (type === "month") {
        return `${val}月`;
      }
      if (type === "day") {
        return `${val}日`;
      }
      return val;
    };
    const numformat = (val: number) => (val < 10 ? `0${val}` : val.toString());
    // events
    const onPickerConfirm = (date: Date) => {
      const year = date.getFullYear().toString();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const res = props.format
        .replace(/YYYY/gi, year)
        .replace(/MM/gi, numformat(month))
        .replace(/DD/gi, numformat(day));
      visible.value = false;
      ctx.emit("confirm", res);
    };

    // responsive data
    return {
      visible,
      formatter,
      onPickerConfirm,
    };
  },
});
</script>


<style lang="less" scoped>
.lg-picker-res {
  display: flex;
  align-items: center;
  padding: 0 6px;
  background: #ffffff;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  color: #1946bb;
  .icon {
    width: 7px;
    height: 5px;
    margin-left: 5px;
  }
}

// 拾取器
.lg-picker-wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  .date-picker {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>