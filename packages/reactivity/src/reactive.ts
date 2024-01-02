import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'


export const reactiveMap = new WeakMap<object, any>()


export function reactive(target: object) {
    return createReactiveObject(target, mutableHandlers, reactiveMap)
}

function createReactiveObject(
    target: object,
    baseHandlers: ProxyHandler<any>,
    proxyMap: WeakMap<object, any>
) {

    // 这里是一个缓存，获取到了直接返回
    const existProxy = proxyMap.get(target)
    if (existProxy) {
        return existProxy
    }
    // 创建代理
    const proxy = new Proxy(target, baseHandlers)

    // 将该实例缓存
    proxyMap.set(target, proxy)

    return proxy
}

export const toReactive = <T extends unknown>(value: T): T => {
    return isObject(value) ? reactive(value as object) : value
}
