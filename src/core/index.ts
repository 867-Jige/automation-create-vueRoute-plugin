import { readPageModles, readPageConfigModles } from "../utils/file-operation";
import { getDirNameArray } from "../utils/index";
import {
  T_AutomationCreateVueroutePlugin_options,
  T_pagesConfig,
  T_breadcrumbList,
} from "../types";
export default class AutomationCreateVueroutePlugin {
  routes: Array<{ [key: string]: any }>;
  meuns: [];
  private _modles: { [key: string]: any };
  private _pagesConfig: T_pagesConfig;
  private _setRoute: Function | undefined;
  private _setBreadcrumb: Function | undefined;
  private _setMeun: Function | undefined;
  constructor(options: T_AutomationCreateVueroutePlugin_options) {
    this.routes = [];
    this.meuns = [];
    this._modles = readPageModles();
    this._pagesConfig = readPageConfigModles();
    this._setRoute = options.setRoute;
    this._setBreadcrumb = options.setBreadcrumb;
    this._setMeun = options.setMeun;
    this.ergodicModules();
  }
  private ergodicModules() {
    Object.keys(this._modles).forEach((key) => {
      const paths = getDirNameArray(key);
      const component = this._modles[key].default;
      let meuns = this.meuns;
      const leng = paths.length;
      const breadcrumbList: T_breadcrumbList = [];
      paths.forEach((dirName, index) => {
        const lastOne = index === leng - 1;
        let config = this._pagesConfig[dirName] || {};
        this.setBreadcrumb(breadcrumbList, dirName, config);
        meuns = this.setMeuns(meuns, dirName, config, lastOne);
        if (lastOne) {
          this.setRouter(dirName, component, { ...config, breadcrumbList });
        }
      });
    });
    console.log(this.routes);
    console.log(this.meuns);
  }
  //   生成路由菜单
  private setMeuns(
    meuns: Array<{ [key: string]: any }>,
    dirName: string,
    config: T_pagesConfig,
    lastOne: boolean
  ) {
    let meun = meuns.find((item) => item.path === `/${dirName}`);
    const { title = dirName } = config;
    if (!meun) {
      meun = {
        path: `/${dirName}`,
        title,
      };
      if (this._setMeun) {
        this._setMeun(meun, config);
      }
      meuns.push(meun);
      meuns.sort((a, b) => b.sort - a.sort);
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
    const breadcrumb = {
      path: `/${parentDirName}`,
      title: config.title || parentDirName,
    };
    if (this._setBreadcrumb) {
      this._setBreadcrumb(breadcrumb, config);
    }
    breadcrumbList.push(breadcrumb);
  }
  //  生成路由信息
  private setRouter(
    parentDirName: string,
    component: {
      default: object;
      [key: string]: any;
    },
    config: T_pagesConfig
  ) {
    const route = {
      component,
      path: `/${parentDirName}`,
      name: parentDirName,
      meta: {
        breadcrumbList: config.breadcrumbList,
      },
    };
    if (this._setRoute) {
      this._setRoute(route, config);
    }
    this.routes.push(route);
  }
}
