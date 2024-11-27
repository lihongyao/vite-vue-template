# 前言

在开发过程中，每次启动新项目时都需要花费大量时间进行项目配置和框架搭建。

为了提高效率，我在闲暇时间结合日常开发需求，搭建了一套基于 Vite5、Vue3、TypeScript 和 vant 的模板。以后启动新项目时，只需克隆一份并根据项目需求进行简单修改即可使用。这大大提高了前期搭建项目框架的效率。

之前，我单独封装了一套针对 H5 和 公众号 的模板。考虑到后续的维护性以及拆分成两个模板的必要性，我重新将它们整合成一套模板，方便维护和更新。

该模板主要是为了提高自己新项目开发时的效率，并非专业开发模板，因此其中可能会存在一些在高手看来不太理想的代码片段。希望各位朋友在使用后能够提出一些修改优化的建议，非常感谢！如果不喜欢，请多包涵。

# 说明

- 技术：Vite<sup>6</sup>、Vue<sup>3</sup> 、TypeScirpt、Vant、Pinia
- 模式：支持 **MP（微信公众号/支付宝生活号）**、**H5**、**混合开发（原生嵌套H5）** 模式
- 环境：
  - node：<mark>v22.11.0</mark>
  - pnpm：<mark>v9.14.2</mark>
  - vite：<mark>v6.0.0</mark>

**关于一些库的介绍：**

- [@likg/bus](https://www.npmjs.com/package/@likg/bus)：事件总线
- [@likg/cookie](https://www.npmjs.com/package/@likg/cookie)：Cookie相关操作
- [@likg/js-bridge](https://www.npmjs.com/package/@likg/js-bridge)：混合开发模式时和原生通过预埋方法通信
- [@likg/storage](https://www.npmjs.com/package/@likg/storage)：LocalStorage 操作
- [@likg/tools](https://www.npmjs.com/package/@likg/tools)：常用的工具库
- [@likg/validator](https://www.npmjs.com/package/@likg/validator)：正则验证库
- [@likg/big](https://www.npmjs.com/package/@likg/big)：数值相关操作(处理JavaScript计算精度问题)

> 提示：项目中以 `@likg/**` 开头的库都是我在平时开发中总结的一些方法，整理成库。

# 目录结构

```
Vite-vue-template
.
├── mock
│	└──	index.ts              # 数据mock，开发环境时可以模拟后端相应数据
├── public                    # 该文件下的目录打包时将直接拷贝至根目录
├── src                       # 源码文件
│   ├── api                   # 前后端交互
│   │   ├── apiConfig         # axios 封装，请求拦截、响应拦截，统一异常处理
│   │   └── apiServer         # 业务接口定义，命名格式：apiXXX，在index.ts中统一导出
│   │   │   ├── typings.d.ts  # 统一接口TS类型定义
│   │   │   └── ....
│   ├── assets                # 静态资源
│   ├── components            # 全局组件
│   │   ├── @lgs              # 自己封装的常用组件
│   │   ├── ....              # 项目内通用组件
│   ├── constants             # 全局常量定义
│   ├── directives            # 自定义指令
│   ├── filters               # 可以在模板中使用的过滤器
│   ├── hooks                 # 封装的常用hooks
│   ├── layouts               # 公共布局（Tab页） 
│   ├── pages                 # 页面组件（下面只列举主要文件）
│   │   ├── NotFound          # 路由未找到
│   │   ├── Auth              # 微信授权页（MP）
│   │   ├── ...				  # 其他页面
│   │   ├── Tabs              # Tab页
│   │   └── Download          # 下载页模板（如果是混合开发， 可能需要写一个APP下载页）
│   ├── router                # 路由配置文件
│   ├── stores                # Pinia
│   ├── typings               # 全局类型声明
│   ├── utils                 # 工具函数
│   │   ├── LibForAli.ts      # 支付宝生活号开发时使用
│   │   ├── LibForWeixin.ts   # 微信公众号开发时使用，封装了授权/JS-SDK方法
│   │   └── rem.ts            # 移动端适配（动态计算根节点像素）
│   ├── App.vue
│   ├── main.ts
│	  └──	vite-env.d.ts     # 全局变量类型定义
├── .env.dev                  # 开发环境配置文件       
├── .env.prod                 # 生产环境配置文件   
├── .env.qa                   # 测试环境配置文件  
├── .gitignore                # git跟踪忽略配置
├── env.d.ts                  # 环境变量类型定义
├── components.d.ts           # 自动导入声明
├── index.html                # 模板
├── postcss.config.js         # postcss 配置文件（自动添加前缀/移动端适配pxtorem)
├── tsconfig.json             # TS配置文件
└── vite.config.js            # vite 配置文件 
```

> 温馨提示：**以上目录中的文件，请根据项目需求修改或删除一些不必要的文件。**

# 使用

```shell
# 安装依赖
$ pnpm install
# 运行项目
$ pnpm dev
# 打包生成环境
$ pnpm build:prod
# 打包测试环境
$ pnpm build:qa
```

> 提示：由于模板 mock 数据，运行前，你需要在 `.env.dev` 文件中，将 `VITE_HOST` 字段的 `ip` 地址替换成你本机的 `ip` 才能正常请求mock数据。

# 特别说明

## 1. 标签页 TabBar

如果你的项目首页是一个标签，可自行在 `src/layouts` 组件中配置图标、路由和标题。

## 2. 部署二级目录

如果你的项目在发布时是部署在二级目录，需要做3件事情：

- 在配置文件（`.env.prod/qa`）中配置 `VITE_BASE` 字段。

  > 因为在公众号授权拼接回调域名时要做特殊拼接处理，如果你是开发H5，可忽略此配置。

- 在 `package.json` 文件脚本指令中，根据打包环境指定 `--base` 字段，如下所示：

  ```json
  "build": "vite build --mode production --base=/二级目录名/",
  ```

- 在 `router.ts` 文件中配置

  ```typescript
  const router = createRouter({
    // 部署二级目录：createWebHistory(base?: string)
    history: createWebHistory("/二级目录名/"),
    routes,
  });
  ```

## 3. 混合开发模式：原生嵌套H5

可能你现在开发的H5是用于嵌套在原生中使用的（这种模式特别常见），那你必然需要和原生交互，本模板中引入了我封装的两个H5和原生的交互库：

- [@likg/schemes](https://www.npmjs.com/package/@likg/schemes)：通过schemes和原生实现跳转；
- [@likg/js-bridge](https://www.npmjs.com/package/@likg/js-bridge)：通过methods和原生实现交互；

> 注意：如果你要使用这两种交互方式，一定要参照上述库里面的说明使用（需要原生配合）

通过方法进行交互，只需要原生开发人员根据 `@likg/js-bridge` 里面的预埋方法定义即可，H5这边在需要的时候可以直接调用。

如果你使用 `lg-schemes`，那就需要和原生开发约定一个 Scheme协议，并且在 `main.ts` 文件中配置，如下所示：

```typescript
import Schemes from '@likg/schemes';

Schemes.config('xxx://www.xxx.com');
```

## 4. 关于列表页

模板中给大家列举了几种列表页的兼容实现，App / 浏览器 / 公众号 环境中都能完美呈现，如果你有兴趣的话可以阅读源码，并根据实际的需求做更改，参考路径如下：

- pages/Examples/GoldCoinDetails
- pages/Examples/List
- pages/Examples/Tab

## 5. Set Token Key

封装模板时，后端返回的 `Token` 我存储在 `Cookie` 中，这样做的目的可以兼容混合开发模式（原生嵌套H5）时，原生登录后将 `Token` 注入到 `Cookie` 中，存储 Cookie时，默认的 key 是 `AUTHORIZATION_TOKEN`，你可以根据需要设置，比如你的项目名字是：`ddou`，那建议你在IDE中全局搜索  `AUTHORIZATION_TOKEN` 将其替换为 `DDOU_TOKEN`。

## 6. 微信公众号

如果你是开发微信公众号或者支付宝生活号，请到对应的环境变量配置文件中设置相应的 `AppID`，并且将 `VITE_SOURCE` 字段值置为 `mp`。在 mp 模式下，非微信环境 或 非支付宝环境下访问网页会提示 “请在微信或支付宝客户端” 发开。

## 7. Typings

> **`@/typings/index.d.ts`**

项目逻辑相关的类型定义

> **`@/api/apiServer/typings.d.ts`**

接口请求相关的类型定义

## 8. 全局挂载组件

你应该可以看到在 `App.vue` 中我调用了 `BindPhone` 组件，这个功能的出现是因为之前项目中有一个需要 check 绑定手机号的状态，如果没有绑定手机号需要显示该组件，我并没有将其写成一个页面，而是以一个挂载在全局的组件形式呈现。在授权 `Auth` 和 `App.vue` 中都有相关代码，你可以根据需要选择删除或保留或修改。





