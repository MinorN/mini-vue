import { track, trigger } from './effect'
export const mutableHandlers: ProxyHandler<object> = {
    // 核心是 get，set 方法
    get(target: object, key: string | symbol, receiver: object) {
        const res = Reflect.get(target, key, receiver)
        // 需要进行 依赖收集 当值更新的时候 可以触发当前的依赖 更新数据
        track(target, key)

        return res
    },
    set(target: object, key: string | symbol, value: unknown, receiver: object) {
        const res = Reflect.set(target, key, value, receiver)
        // 需要 触发依赖
        trigger(target, key, value)

        return res
    },
}
