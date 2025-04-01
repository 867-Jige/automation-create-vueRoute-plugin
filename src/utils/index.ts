//  判断是不是vue3
export function isVue3(app: any) {
  const version = app.version || app.Vue.version;
  return version.startsWith("3.");
}
//  挂载全局变量
export function mountGlobalVariables(app: any, instance: any) {
  if (isVue3(app)) {
    app.config.globalProperties.$autRouteInstance = instance;
  }else {
    app.prototype.$autRouteInstance = instance;
  }
}
//  获取路径目录名称数组
export function getDirNameArray(path: string) {
    return path.replace(/^\/src\/pages\/(.*?)\/index\.vue$/, '$1').split('/')
}