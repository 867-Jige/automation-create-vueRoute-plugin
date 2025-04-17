🌐 **Language**: [English Version](README.md) | [中文版文档](README.zh-CN.md)

# automation-create-vueRoute-plugin

Introduction: This is a plugin that automatically generates navigation menus and page routes based on a specific file directory structure. Using this plugin, you only need to create page files under the specified directory according to the rules of the page directory structure, and it will automatically generate page routes and navigation menus.

#### So, what rules should be followed when creating page files for this plugin?

1. Page files must be placed in the `src/pages` directory of the project, and each file must be an `index.vue` file. The parent directory name of the `index.vue` file will be the route name of that page. For example: If you have a user management page, the file must be named `src/pages/user/index.vue`, and the route for this page will be `/user`.
2. If the navigation menu has secondary or multi-level items, the page directory structure you create can follow the desired secondary or multi-level structure.  
   For example: If your navigation menu includes User Management/User List, User Management/Permission Settings, and User Management/Role Management, then the page directory structure should be as follows:
   - User List: `src/pages/user/userList/index.vue`;
   - Permission Settings: `src/pages/user/permission/index.vue`;
   - Role Management: `src/pages/user/role/index.vue`;
   > ⚠️ **Note**: There should be no `index.vue` file in the `user` directory, `src/pages/user/index.vue` should not be created.

3. You should create a file to store the configuration information for each page. The configuration for each page should use its directory name as the key, and all page configurations should be at the same level, not nested according to the directory structure.  
   For example:

```javascript
{
    user: {
        title: 'User Management',
        icon: 'el-icon-user',
    },
    userList: {
        title: 'User List',
        icon: 'el-icon-user',
    },
    permission: {
        title: 'Permission Settings',
        icon: 'el-icon-setting',
    },
    role: {
        title: 'Role Management',
        icon: 'el-icon-s-custom',
    }
}
```
#### Now that you understand the rules, let's start using the plugin!
1. Install the Plugin:
````shell
npm install automation-create-vue-route-plugin --save-dev
````
2. Create an auto-router.ts (or .js) File:
````javascript
import automationCreateVueroutePlugin from "automation-create-vue-route-plugin";

// For Vite projects: use import.meta.glob to import page modules
const pageModles = import.meta.glob("@/pages/*/**/index.vue", { eager: true });

// Fallback for environments without import.meta.glob:
// const pageModles = {
//   "src/pages/user/userList/index.vue": {
//     default: () => import("src/pages/user/userList/index.vue"),
//   },
// }

// Import page configurations (Vite)
import pagesConfig from "@/pages/index";

export default {
  install(app: any) {
    app.use(automationCreateVueroutePlugin, {
      /**
       * type: object
       * Page modules requirements:
       * 1. Key = route name, Value = page module
       * 2. Must use index.vue files
       * 3. Key must start with "src/pages/"
       */
      modules: pageModles,

      /**
       * type: object
       * Page configurations requirements:
       * 1. Key = parent directory name of index.vue, Value = config
       * 2. Config must be an object
       * 3. Must include "title" in config
       */
      pagesConfig: {
        user: {
          title: "User Management",
          icon: "el-icon-user",
        },
        userList: {
          title: "User List",
          icon: "el-icon-user",
        },
        permission: {
          title: "Permission Settings",
          icon: "el-icon-setting",
        },
        role: {
          title: "Role Management",
          icon: "el-icon-s-custom",
        },
      },

      /**
       * type: function
       * Navigation menu configuration callback:
       * 1. Param "meun": menu object (contains path/title)
       * 2. Param "config": page config object
       * 3. Return menu object (return null to exclude)
       */
      setMeun: (meun, config) => {
        meun.sort = 1; // Set menu sorting
        meun.meta = {
          ...meun.meta,
          ...config,
        };
        return meun;
      },

      /**
       * type: function
       * Breadcrumb configuration callback:
       * 1. Param "route": route object (path/title)
       * 2. Param "config": page config
       * 3. Return route object (return null to exclude)
       */
      setBreadcrumb: (route, config) => {
        route.meta = {
          ...config,
        };
        return route;
      },

      /**
       * type: function
       * Route configuration callback:
       * 1. Param "route": route object (path/name/meta)
       * 2. Param "config": page config
       * 3. Return route object (return null to exclude)
       */
      setRoute: (route, config) => {
        route.meta = {
          ...config,
        };
        return route;
      },
    });
  },
};
````
4. Use the Plugin:
````javascript
// In main.ts, import auto-router.ts
import autoRouter from "./auto-router";

// For Vue 2.x
import Vue from "vue";
Vue.use(autoRouter);
// Access instance via Vue.prototype.$autRouteInstance
console.log(Vue.prototype.$autRouteInstance);

// For Vue 3.x
import { createApp } from "vue";
const app = createApp(App);
app.use(autoRouter);
// Access instance via app.config.globalProperties.$autRouteInstance
console.log(app.config.globalProperties.$autRouteInstance);
app.mount("#app");
````