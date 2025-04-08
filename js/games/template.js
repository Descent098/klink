/**
 * The Current Game
 *
 * @type {Game?}
*/
 //@ts-ignore
 let currentGame = null;


class Game{
    constructor(){}
}


/**
 * The function to  start the game
 */
function startGame(){
    //@ts-ignore
    document.getElementById("setupGame").style.display = "None";
    //@ts-ignore
    document.getElementById("mainLogoContainer").style.paddingTop="5vh";
    currentGame = new Game()
}