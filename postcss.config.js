export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ["> 0.5%", "last 2 versions", "not dead"],
    },
    "postcss-pxtorem": {
      // -- Vant 官方根字体大小是 37.5
      rootValue: 37.5,
      propList: ["*"],
      // -- 过滤掉.norem-开头的class，不进行rem转换
      selectorBlackList: [".norem"],
    },
  },
};
