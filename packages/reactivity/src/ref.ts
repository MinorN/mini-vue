import { hasChanged } from "@vue/shared"
import { Dep, createDep } from "./dep"
import { activeEffect, trackEffects, triggerEffects } from "./effect"
import { toReactive } from './reactive'

export interface Ref<T = any> {
    value: T
}

export function ref(value?: unknown) {
    return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
    if (isRef(rawValue)) {
        // 如果当前传入的是 ref 直接返回
        return rawValue
    }

    return new RefImpl(rawValue, shallow)
}

class RefImpl<T>{
    private _value: T
    private _rawValue: T // 原始值

    public dep?: Dep = undefined

    public readonly __v_isRef = true

    constructor(value: T, public readonly __v_isShallow: boolean) {
        this._rawValue = value
        this._value = __v_isShallow ? value : toReactive(value)
    }

    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newVal) {
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal
            this._value = toReactive(newVal)
            triggerRefValue(this)
        }
    }
}


export function isRef(r: any): r is Ref {
    // 判断当前是否是ref
    return !!(r && r.__v_isRef === true)
}

export function trackRefValue(ref) {
    if (activeEffect) {
        // 当前存在 activeEffect，把当前的副作用都放入岛 ref.dep 中
        trackEffects(ref.dep || (ref.dep = createDep()))
    }
}

// 触发依赖
export function triggerRefValue(ref) {
    const dep = ref.dep
    if (dep) {
        triggerEffects(dep)
    }
}