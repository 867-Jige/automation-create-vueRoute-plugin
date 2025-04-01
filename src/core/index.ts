import { getDirNameArray } from "../utils/index";
import {
  T_AutomationCreateVueroutePlugin_options,
  T_pagesConfig,
  T_breadcrumbList,
  T_meun,
  T_setMeun,
  T_false,
  T_route,
  T_setRoute,
  T_setBreadcrumb,
  T_modules,
} from "../types";
export default class AutomationCreateVueroutePlugin {
  routes: Array<T_route>;
  meuns: Array<T_meun>;
  private modules: T_modules;
  private _pagesConfig: T_pagesConfig;
  private _setRoute: T_setRoute | undefined;
  private _setBreadcrumb: T_setBreadcrumb | undefined;
  private _setMeun: T_setMeun | undefined;
  constructor(
    options: T_AutomationCreateVueroutePlugin_options = {
      modules: {},
      pagesConfig: { title: "" },
    }
  ) {
    this.routes = [];
    this.meuns = [];
    this.modules = options.modules;
    this._pagesConfig = options.pagesConfig || { title: "" };
    this._setRoute = options.setRoute;
    this._setBreadcrumb = options.setBreadcrumb;
    this._setMeun = options.setMeun;
    this.ergodicModules();
  }
  private ergodicModules() {
    Object.keys(this.modules).forEach((key) => {
      const paths = getDirNameArray(key);
      const component = this.modules[key].default;
      let meuns = this.meuns;
      const leng = paths.length;
      const breadcrumbList: T_breadcrumbList = [];
      paths.forEach((dirName, index) => {
        const lastOne = index === leng - 1;
        let config = this._pagesConfig[dirName] || {};
        this.setBreadcrumb(breadcrumbList, dirName, config);
        if (Array.isArray(meuns)) {
          meuns = this.setMeuns(meuns, dirName, config, lastOne);
        }
        if (lastOne) {
          this.setRouter(dirName, component, { ...config, breadcrumbList });
        }
      });
    });
  }
  //   生成路由菜单
  private setMeuns(
    meuns: Array<T_meun>,
    dirName: string,
    config: T_pagesConfig,
    lastOne: boolean
  ) {
    let meun: T_meun | T_false = meuns.find(
      (item) => item.path === `/${dirName}`
    );
    const { title = dirName } = config;
    if (!meun) {
      meun = {
        path: `/${dirName}`,
        title,
      };
      if (this._setMeun) {
        meun = this._setMeun(meun, config);
      }
      if (meun) {
        meuns.push(meun);
        meuns.sort((a, b) => b.sort - a.sort);
      } else {
        return false;
      }
    }
    if (!lastOne && !meun.children) {
      meun.children = [];
    }
    return meun.children;
  }
  //  生成面包屑
  private setBreadcrumb(
    breadcrumbList: T_breadcrumbList,
    parentDirName: string,
    config: T_pagesConfig
  ) {
    let breadcrumb: T_meun | T_false = {
      path: `/${parentDirName}`,
      title: config.title || parentDirName,
    };
    if (this._setBreadcrumb) {
      breadcrumb = this._setBreadcrumb(breadcrumb, config);
    }
    if (breadcrumb) {
      breadcrumbList.push(breadcrumb);
    }
  }
  //  生成路由信息
  private setRouter(
    parentDirName: string,
    component: object,
    config: T_pagesConfig
  ) {
    let route: T_route | T_false = {
      component,
      path: `/${parentDirName}`,
      name: parentDirName,
      meta: {
        breadcrumbList: config.breadcrumbList,
      },
    };
    if (this._setRoute) {
      route = this._setRoute(route, config);
    }
    if (route) {
      this.routes.push(route);
    }
  }
}
