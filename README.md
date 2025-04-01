🌐 **Language**: [中文版文档](README.zh-CN.md) | [English Version](README.md)

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
1. Now that you understand the rules, let's start using the plugin!
Install the plugin:  
```shell
npm install automation-create-vue-route-plugin --save-dev
```
2. Use the plugin:  
```javascript
import { createApp } from 'vue'
const app = createApp(App)
// Import the plugin
import automationCreateVueroutePlugin from "automation-create-vue-route-plugin";

// Use the plugin
app.use(automationCreateVueroutePlugin, {
  /**
   * type: object
   * File modules for each page. Requirements:
   * 1. key is the route name, value is the file module
   * 2. File module must be index.vue
   * 3. key must start with src/pages/
   */
  modules: {
    "src/pages/user/userList/index.vue": {
      default: () => import("src/pages/user/userList/index.vue"),
    },
  },
  /**
   * type: object
   * Configuration for each page. Requirements:
   * 1. key is the parent directory name of index.vue, value is page configuration
   * 2. Configuration must be an object
   * 3. Configuration must include title
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
   *
   * Callback for setting navigation menu. Requirements:
   * 1. Parameter 'menu' is menu object containing path, title
   * 2. Parameter 'config' is page configuration object
   * 3. Must return menu object, null will exclude from menu
   */
  setMeun: (meun, config) => {
    // You can set menu properties based on page config
    meun.sort = 1; // You can set menu sorting
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
   * Callback for setting breadcrumbs. Requirements:
   * 1. Parameter 'route' is route object containing path, title
   * 2. Parameter 'config' is page configuration object
   * 3. Must return route object, null will exclude from breadcrumbs
   * */
  setBreadcrumb: (route, config) => {
    // You can set breadcrumb properties based on page config
    route.meta = {
      ...config,
    };
    return route;
  },
  /**
   * type: function
   *
   * Callback for setting routes. Requirements:
   * 1. Parameter 'route' is route object containing path, name, meta
   * 2. Parameter 'config' is page configuration object
   * 3. Must return route object, null will exclude from routes
   */
  setRoute: (route, config) => {
    // You can set route properties based on page config
    /**
     * config contains breadcrumb configuration:
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

app.mount('#app')
```
