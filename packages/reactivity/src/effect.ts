



export function effect<T = any>(fn: () => T) {
    const _effect = new ReactiveEffect(fn)

    _effect.run()
}
// 当前激活的实例
export let activeEffect: ReactiveEffect | undefined

// reactive effect 实例
export class ReactiveEffect<T = any>{
    constructor(public fn: () => T) { }

    run() {
        // run 函数就是触发了传入的回调函数

        // 但是之前需要进行处理
        activeEffect = this

        return this.fn()
    }
}


export function track(target: object, key: unknown) {

}

export function trigger(target: object, key: unknown, value: unknown) {

}