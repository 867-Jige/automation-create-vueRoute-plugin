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
// Import the plugin
import automationCreateVueroutePlugin from "automation-create-vue-route-plugin";

// Use the plugin
app.use(automationCreateVueroutePlugin, {
  /**
   * type: object
   * File modules for each page. Requirements:
   * 1. The key is the route name of the page, and the value is the file module of the page.
   * 2. The file module of the page must be an `index.vue` file.
   * 3. The key must start with `src/pages/`.
   */
  modules: {
    "src/pages/user/userList/index.vue": {
      default: () => import("src/pages/user/userList/index.vue"),
    },
  },
  /**
   * type: object
   * Configuration information for each page. Requirements:
   * 1. The key is the parent directory name of the `index.vue` file, and the value is the configuration information of the page.
   * 2. The configuration information must be an object.
   * 3. The configuration information must include a `title`.
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
   * Callback function for setting the navigation menu. Requirements:
   * 1. The parameter `meun` is the navigation menu object, containing `path` and `title` properties.
   * 2. The parameter `config` is the configuration information object of the page.
   * 3. The return value must be the navigation menu object. If `null` is returned, the menu will not be added to the navigation.
   */
  setMeun: (meun, config) => {
    // You can set the properties of the navigation menu based on the page configuration.
    meun.meta = {
      ...meun.meta,
      ...config,
      sort: 1, // You can also set the sorting of the navigation menu.
    };
    return meun;
  },
  /**
   * type: function
   *
   * Callback function for setting the route. Requirements:
   * 1. The parameter `route` is the route object, containing `path`, `name`, and `meta` properties.
   * 2. The parameter `config` is the configuration information object of the page.
   * 3. The return value must be the route object. If `null` is returned, the route will not be added to the router.
   */
  setRoute: (route, config) => {
    // You can set the properties of the route based on the page configuration.
    /**
     * The `config` includes breadcrumb configuration:
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
      ...route.meta,
    };
    return route;
  },
});
```
