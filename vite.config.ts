
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from '@vitejs/plugin-legacy'
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";
import { viteMockServe } from "vite-plugin-mock";
import { resolve } from "path";
// https://vite.dev/config/
// @ts-ignore
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        comps: resolve(__dirname, "src/components"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8888,
      strictPort: false,
      open: true,
      cors: true,
      proxy: {},
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      outDir: env.VITE_OUT_DIR,
      // -- chunk 大小警告的限制（以 kbs 为单位）
      chunkSizeWarningLimit: 2000,
      // -- 启用/禁用 gzip 压缩大小报告
      reportCompressedSize: false,
    },
    plugins: [
      vue(),
      // -- 浏览器兼容
      legacy({
        targets: ["defaults", "not IE 11"],
      }),
      // -- mockjs
      viteMockServe(),
      // -- 按需引入组件样式(Vant)
      Components({
        resolvers: [VantResolver()],
      }),
    ],
  };
});