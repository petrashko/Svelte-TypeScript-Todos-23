//
export function isStringNotEmpty(x: any): x is string {
    if ((typeof x === 'string') && (x.trim().length > 0)) {
        return true;
    }
    return false;
}