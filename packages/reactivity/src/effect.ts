import { ComputedRefImpl } from "./computed"
import { Dep, createDep } from "./dep"

export function effect<T = any>(fn: () => T) {
    const _effect = new ReactiveEffect(fn)

    _effect.run()
}
// 当前激活的实例
export let activeEffect: ReactiveEffect | undefined

// reactive effect 实例
export class ReactiveEffect<T = any>{
    computed?: ComputedRefImpl<T>
    constructor(public fn: () => T) { }

    run() {
        // run 函数就是触发了传入的回调函数

        // 但是之前需要进行处理
        activeEffect = this

        return this.fn()
    }
}

type KeyToDepMap = Map<any, Dep>

const targetMap = new WeakMap<any, KeyToDepMap>()

export function track(target: object, key: unknown) {
    // 如果当前的 activeEffect 不存在，则直接返回
    if (!activeEffect) {
        return
    }

    // 先尝试读取是否存在对应关系
    let depsMap = targetMap.get(target)

    // 如果没有获取到，创建 target - map 关系
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, dep = createDep())
    }

    trackEffects(dep)
}

export function trackEffects(dep: Dep) {
    dep.add(activeEffect!)
}

export function trigger(target: object, key: unknown, value: unknown) {
    // 从 targetMap 找到对应的 effect 并执行
    const depsMap = targetMap.get(target)

    if (!depsMap) {
        return
    }

    // 找到了对应的 map
    const dep = depsMap.get(key)

    if (!dep) {
        return
    }
    triggerEffects(dep)
}

export function triggerEffects(dep: Dep) {
    const effects = Array.isArray(dep) ? dep : [...dep]
    // 触发依赖

    for (let effect of effects) {
        triggerEffect(effect)
    }
}

export function triggerEffect(effect: ReactiveEffect) {
    effect.run()
}