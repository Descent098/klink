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

/**
 * Clears the start screen and shows the game content
 */
function clearStartScreen(){
    //@ts-ignore
    document.getElementById("setupGame").style.display = "none";
    //@ts-ignore
    document.getElementById("gameContent").style.display = "block";
    //@ts-ignore
    document.getElementById("gameContent").style.opacity = "1";
    //@ts-ignore
    document.getElementById("mainLogoContainer").style.top = "15vh"; 
}