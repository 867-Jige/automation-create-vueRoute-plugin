// 读取页面模块
export function readPageModles(){
    return import.meta.glob('@/pages/*/**/index.vue', { eager: true })
}
// 读取页面配置模块
export function readPageConfigModles(){
    const modles = import.meta.glob('@/pages/index.{js,json,ts}', { eager: true })
    const config = Object.values(modles)[0]
    return config?.default || {}
}