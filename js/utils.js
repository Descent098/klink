/**
 * Asserts an item is not null, and returns it. This is a hack for JSDoc to work nicely
 *
 * @template T
 * @param {T|null|undefined} item 
 * @returns {NonNullable<T>} 
 */
export function assertNotNull(item){
    if (item===null || item ===undefined) {
        throw new Error(`Item asserted to exist is actually ${item}`)
    }
    return item

}