🌐 **Language**: [English Version](README.md) | [中文版文档](README.zh-CN.md)

# automation-create-vueRoute-plugin

前言： 这是一个可根据特定文件目录结构自动创建导航菜单和页面路由的插件。使用这个插件，你只需在规定的目录下按照页面目录结构的规则创建页面文件，即可自动生成页面路由和导航菜单。

#### 那插件页面文件需要按照什么规则创建呢？

1. 页面文件必须放在项目中的 src/pages 目录下，且每个文件必须为 index.vue 文件，index.vue 文件的父目录名即为该页面的路由名。例如：你有一个用户管理页面，那么该页面的文件名必须为 src/pages/user/index.vue，该页面的路由为/user。
2. 如果导航菜单有二级或多级的，则你创建的页面目录结构可按照你想要的二级或多级目录结构来创建。  
   例如：你的导航菜单为用户管理/用户列表、用户管理/权限设置、用户管理/角色管理，那么你创建的页面目录结构分别为：

- 用户列表：src/pages/user/userList/index.vue；
- 权限设置：src/pages/user/permission/index.vue；
- 角色管理：src/pages/user/role/index.vue；
  > ⚠️ **注意**：在 user 目录下是不应该存在 index.vue 文件的，即不应该创建 src/pages/user/index.vue 文件。

3. 你应该创建一个文件来存放页面的配置信息，每个页面的配置信息以各自的目录名称为 key，且各页面配置信息都是平级，不能按照目录结构来嵌套。  
   例如：

```javascript
{
    user: {
        title: '用户管理',
        icon: 'el-icon-user',
    },
    userList: {
        title: '用户列表',
        icon: 'el-icon-user',
    },
    permission: {
        title: '权限设置',
        icon: 'el-icon-setting',
    },
    role: {
        title: '角色管理',
        icon: 'el-icon-s-custom',
    }
}
```

#### 了解完规则后，我们开始使用插件吧！

1. 安装插件：

```shell
npm install automation-create-vue-route-plugin --save-dev
```

2. 创建一个auto-router.ts（.js） 文件：

```javascript
import automationCreateVueroutePlugin from "automation-create-vue-route-plugin";
// 使用vite时可以使用import.meta.glob导入页面模块
const pageModles = import.meta.glob("@/pages/*/**/index.vue", { eager: true });
// 不支持import.meta.glob时
// const pageModles = {
//   "src/pages/user/userList/index.vue": {
//     default: () => import("src/pages/user/userList/index.vue"),
//   },
// }
// 使用vite时可以使用import.meta.glob导入页面配置信息
import pagesConfig from "@/pages/index";
export default {
  install(app: any) {
    app.use(automationCreateVueroutePlugin, {
      /**
       * type: object
       * 各个页面的文件模块，要求：
       * 1. key 为页面的路由名，value 为页面的文件模块
       * 2. 页面的文件模块必须为 index.vue 文件
       * 3. key以src/pages/开头
       */
      modules: pageModles,
      /**
       * type: object
       * 各个页面的配置信息，要求：
       * 1. key 为页面index.vue的父目录名称，value 为页面的配置信息
       * 2. 页面的配置信息必须为对象
       * 3. 页面的配置信息中必须包含 title
       */
      pagesConfig: {
        user: {
          title: "用户管理",
          icon: "el-icon-user",
        },
        userList: {
          title: "用户列表",
          icon: "el-icon-user",
        },
        permission: {
          title: "权限设置",
          icon: "el-icon-setting",
        },
        role: {
          title: "角色管理",
          icon: "el-icon-s-custom",
        },
      },
      /**
       * type: function
       *
       * 设置导航菜单的回调函数，要求：
       * 1. 参数 meun 为导航菜单对象，包含 path、title 属性
       * 2. 参数 config 为页面的配置信息对象
       * 3. 返回值必须为导航菜单对象，若返回值为 null，则该导航菜单不会被添加到导航菜单中
       */
      setMeun: (meun, config) => {
        // 你可以根据页面配置信息来设置导航菜单的属性
        meun.sort = 1; //你有可以以设置导航菜单的排序
        meun.meta = {
          ...meun.meta,
          ...config,
        };
        return meun;
      },
      /**
       *
       * type: function
       *
       * 设置面包屑的回调函数，要求：
       * 1. 参数 route 为路由对象，包含 path、title 属性
       * 2. 参数 config 为页面的配置信息对象
       * 3. 返回值必须为路由对象，若返回值为 null，则该路由不会被添加到面包屑中
       * */
      setBreadcrumb: (route, config) => {
        // 你可以根据页面配置信息来设置面包屑的属性
        route.meta = {
          ...config,
        };
        return route;
      },
      /**
       * type: function
       *
       * 设置路由的回调函数，要求：
       * 1. 参数 route 为路由对象，包含 path、name、meta 属性
       * 2. 参数 config 为页面的配置信息对象
       * 3. 返回值必须为路由对象，若返回值为 null，则该路由不会被添加到路由中
       */
      setRoute: (route, config) => {
        // 你可以根据页面配置信息来设置路由的属性
        /**
         * config中会有面包屑的配置信息
         * {
         *  component,
         *  path,
         *  name,
         *  meta: {
         *      breadcrumbList:[],
         *  },
         * }
         *
         * */
        route.meta = {
          ...config,
        };
        return route;
      },
    });
  },
};
```

3. 使用插件：

```javascript
// 在main.ts中引入auto-router.ts
import autoRouter from "./auto-router";

// 在vue2.x中
import Vue from "vue";
Vue.use(autoRouter);
// 在Vue.prototype.$autRouteInstance中获取实例
console.log(Vue.prototype.$autRouteInstance);


// 在vue3.x中
import { createApp } from "vue";
const app = createApp(App);
app.use(autoRouter);
// 在app.config.globalProperties.$autRouteInstance中获取实例
console.log(app.config.globalProperties.$autRouteInstance);
app.mount("#app");
```
