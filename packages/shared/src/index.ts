export const isObject = (value: unknown): boolean => {
    return value !== null && typeof value === 'object'
}

export const hasChanged = (value: any, oldVal: any): boolean => {
    return !Object.is(value, oldVal)
}


export const isFunction = (val: unknown): val is Function => {
    return typeof val === 'function'
}