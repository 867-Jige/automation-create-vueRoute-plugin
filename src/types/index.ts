export type T_AutomationCreateVueroutePlugin_options = {
  setRoute?: T_setRoute;
  setBreadcrumb?: T_setBreadcrumb;
  setMeun?: T_setMeun;
  pagesConfig?: T_pagesConfig;
  modules: T_modules;
};
export type T_modules = {
  [key: string]: T_component;
};
export type T_setBreadcrumb = (
  breadcrumb: T_meun,
  config: T_pagesConfig
) => T_meun | T_false;
export type T_false = "" | void | undefined | null | false;
export type T_setMeun = (
  meun: T_meun,
  config: T_pagesConfig
) => T_meun | T_false;
export type T_meun = {
  [key: string]: any;
  title: string;
  path: string;
};
export type T_component = {
  default: object;
  [key: string]: any;
};
export type T_setRoute = (
  route: T_route,
  config: T_pagesConfig
) => T_route | T_false;
export type T_route = {
  [key: string]: any;
  component: object;
  name: string;
  path: string;
};
export type T_pagesConfig = {
  [key: string]: any;
  title: string;
};
export type T_breadcrumbList = Array<{ [key: string]: any }>;
