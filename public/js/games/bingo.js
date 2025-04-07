/**
 * The Current Game
 *
 * @type {Bingo?}
*/
 //@ts-ignore
let currentGame = null;

/**
 * Gets a random integer
 * @param {Number} min - The minimum value
 * @param {Number} max - The maximum value
 * @returns {Number} The random number
 */
function getRandomInt(min, max) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

class Challenge{
    /**
     * A challenge to complete
     * @param {String} title A title for the challenge, games can choose to display this or not
     * @param {String} text The text to display to user, use <DRINK_AMOUNT> as placeholder for amount of drinks
     * @param {Number} drinks The baseline number of drinks (will be modified by provided modifier)
     * @param {"creamy"|"blue"|"red"|"shot"} type The type of challenge
     */
    constructor(title, text, drinks, type){
        this.title = title
        this.text = text
        this.drinks = drinks
        this.type = type
    }

    /**
     * 
     * @returns {String}
     */
    getText(){
        return `${this.title}: ` +this.text.replaceAll("<DRINK_AMOUNT>", this.drinks.toString())
    }

    /**
     * Generate a random Challenge
     * @param {Number} modifier The players modifier (1 for players with "normal" amount of drinks set)
     * @returns {Challenge}
     */
    static randomChallenge(modifier=1){
        // Generate Challenge
        let challenges = [
            ["Creamy","Take <DRINK_AMOUNT> drink(s) of something creamy" , Math.floor(1* modifier), "creamy"],
            ["Blue Baddie","Take <DRINK_AMOUNT> drink(s) of something blue" , Math.floor(2* modifier), "blue"],
            ["Radical Red","Take <DRINK_AMOUNT> drink(s) of something red" , Math.floor(2* modifier), "red"],
            ["SHOTS, SHOTS, SHOTS, SHOTS, SHOTS, SHOTS","Take <DRINK_AMOUNT> shot(s)" , Math.floor(1* modifier), "shot"],
        ]

        const randomIndex = Math.floor(Math.random() * challenges.length);
        //@ts-ignore
        const randomChallenge = new Challenge(...challenges[randomIndex])
        return randomChallenge
    }
}

/**
 * A class to represent a single bingo ball
 *
 * @class Ball
 */
class Ball {
    /**
     * The letter the ball is in
     * @type {"B" | "I" | "N" | "G" | "O" | "Free"}
     */
    letter;

    /**
     * The number of the ball
     * @type {number}
     */
    number;

    /**
     * The challenge needed to get the next ball
     * @type {Challenge}
     */
    challenge;

    /**
     * Whether the ball has been chosen or not yet
     * @type {boolean}
     */
    chosen;


    /**
     * The method to instantiate a new Ball
     * 
     * @param {"B"|"I"|"N"|"G"|"O"} letter - The letter to use
     * @param {Number} number - The number of the ball
     * @param {Challenge} challenge - The challenge to get the next ball
     */
    constructor(letter, number, challenge) {
        this.letter = letter;
        this.number = number;
        this.challenge = challenge || Challenge.randomChallenge();
        this.chosen = false;
    }

    /**
     * Get an HTMl representation of the ball
     * @returns {String}
     */
    html(){
        return `${this.letter}<br>${this.number}`
    }

    /**
     * Runs the animation for a ball being picked
     */
    runAnimation(){
        // Cancel any existing timeouts to ensure no animations are currently playing
        var id = self.setTimeout(function() {}, 0);
        while (id--) {
            self.clearTimeout(id);
        }

        
        /** @type {HTMLElement}*/
        //@ts-ignore
        const animationBox = document.getElementById("animationBox"); 
        if (!animationBox){

        }
        // Show the animation box so animation is visible
        animationBox.style.display = "flex"
        animationBox.style.opacity = "1"

        // Setup the bingo ball
        /** @type {HTMLElement}*/
        //@ts-ignore
        const ball = document.getElementById("bingoBall");
        ball.innerHTML = this.html()

        // Run the animation of the ball
        //@ts-ignore
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        let start = -300;
        let end = 300;
        tl.fromTo(ball, 
            { y: start, scaleY: 1.2, scaleX: 0.8, opacity: 1 }, 
            { y: end, scaleY: 0.8, scaleX: 1.2, duration: 0.6, ease: "power1.in" }
        )
        .to(ball, { y: ((end/2) +0.1*end), scaleY: 1.2, scaleX: 0.8, duration: 0.3, ease: "power2.out" })
        .to(ball, { y: end, scaleY: 0.8, scaleX: 1.2, duration: 0.3, ease: "power1.in" })
        .to(ball, { y: end - (end*.25), scaleY: 1.1, scaleX: 0.9, duration: 0.2, ease: "power2.out" })
        .to(ball, { y: end, scaleY: 0.9, scaleX: 1.1, duration: 0.2, ease: "power1.in" })
        .to(ball, { y: (end-(0.1*end)), scaleY: 1.05, scaleX: 0.95, duration: 0.15, ease: "power2.out" })
        .to(ball, { y: end, scaleY: 1, scaleX: 1, duration: 0.15, ease: "power1.in" })
        .to(ball, { opacity: 1, duration: 0.8 })
        .to(ball, { opacity: 1, duration: 3 });

        // Cleanup by hiding the animation box after running animation
        // NOTE: gsap is async, so hiding needs to be done with timeouts since these fire instantly
        setTimeout(()=>{
            animationBox.style.opacity = "0"
        }, 2000)
        setTimeout(()=>{
            animationBox.style.display = "none"
        }, 3000)
        
    }

}

class Bingo{
    constructor(BOARD_HEIGHT = 5){
        this.BOARD_HEIGHT = BOARD_HEIGHT
        /** @type {{ B: Ball[], I: Ball[], N:Ball[], G:Ball[], O:Ball[]}} */
        let unusedBalls = {"B":[],"I":[],"N":[],"G":[],"O":[]}
        let currentNum = 1
        /** @type {{ B: Ball[], I: Ball[], N:Ball[], G:Ball[], O:Ball[]}} */
        let board = {"B":[],"I":[],"N":[],"G":[],"O":[]}
        let remainingBalls = []
        let FREE_SPACE_POSITION = Math.ceil(BOARD_HEIGHT/2) - 1
        
        // Generate all possible balls
        for (const letter of ["B","I","N","G","O"]){
            for (let i=0; i < 15; i++){
                // @ts-ignore
                unusedBalls[letter].push(new Ball(letter, currentNum))
                currentNum++
            }
        }
        
        // Pick balls to be used for the game
        for (const letter of ["B","I","N","G","O"]){
            for (let i=0; i < BOARD_HEIGHT; i++){
                
                if (letter == "N" && i == FREE_SPACE_POSITION){
                    // @ts-ignore
                    let temp = new Ball("Free", "FREE", undefined)
                    temp.chosen = true
                    board[letter].push(temp)
                    continue
                }
                // @ts-ignore
                let randomIndex = getRandomInt(0,unusedBalls[letter].length)
                // @ts-ignore
                const randomBall = unusedBalls[letter].splice(randomIndex, 1)[0];
                // @ts-ignore
                board[letter].push(randomBall)
                remainingBalls.push(randomBall)
            }
        }

        // Assign balls to member variables
        this.unusedBalls = [
            ...unusedBalls["B"], 
            ...unusedBalls["I"], 
            ...unusedBalls["N"],
            ...unusedBalls["G"],
            ...unusedBalls["O"],
        ]
        /** @type {{ B: Ball[], I: Ball[], N:Ball[], G:Ball[], O:Ball[]}} */
        this.board = board

        /** @type {Ball[]} */
        this.remainingBalls = remainingBalls

        // Build out game board HTML
        /** @type {HTMLElement} */
        //@ts-ignore
        const boardElement = document.getElementById("bingoBoard")
        boardElement.innerHTML = `
        <div class="bingoCell taken">B</div>
        <div class="bingoCell taken">I</div>
        <div class="bingoCell taken">N</div>
        <div class="bingoCell taken">G</div>
        <div class="bingoCell taken">O</div>`
        
        for (let i =0; i < BOARD_HEIGHT; i++){
            if (i == FREE_SPACE_POSITION){
                boardElement.innerHTML +=`
            <div id="B${this.board["B"][i].number}" class="bingoCell available">${this.board["B"][i].number}</div>
            <div id="I${this.board["I"][i].number}" class="bingoCell available">${this.board["I"][i].number}</div>
            <div id="N${this.board["N"][i].number}" class="bingoCell taken">${this.board["N"][i].number}</div>
            <div id="G${this.board["G"][i].number}" class="bingoCell available">${this.board["G"][i].number}</div>
            <div id="O${this.board["O"][i].number}" class="bingoCell available">${this.board["O"][i].number}</div>
            `
            continue
            }
            
            boardElement.innerHTML +=`
            <div id="B${this.board["B"][i].number}" class="bingoCell available">${this.board["B"][i].number}</div>
            <div id="I${this.board["I"][i].number}" class="bingoCell available">${this.board["I"][i].number}</div>
            <div id="N${this.board["N"][i].number}" class="bingoCell available">${this.board["N"][i].number}</div>
            <div id="G${this.board["G"][i].number}" class="bingoCell available">${this.board["G"][i].number}</div>
            <div id="O${this.board["O"][i].number}" class="bingoCell available">${this.board["O"][i].number}</div>
            `
            
        }
        boardElement.style.opacity = "1"
    }

    /**
     * Gets a random ball, can be on the board or not
     * @returns {[Ball, Boolean]}
     */
    getRandomBall(){            
        //TODO: Handle empty arrays

        let randomNum = Math.random()
        if (randomNum <0.75){
            const randomIndex = Math.floor(Math.random() * this.remainingBalls.length);
            const randomBall = this.remainingBalls.splice(randomIndex, 1)[0]; 
            return [randomBall, true]
        } else{ 
            // Womp womp
            const randomIndex = Math.floor(Math.random() * this.unusedBalls.length);
            const randomBall = this.unusedBalls.splice(randomIndex, 1)[0]; 
            return [randomBall, false]
        }
    }

    /**
     * Pretty Prints the game state
     */
    print(){
        let rows = []
        for (let i=0;i<this.BOARD_HEIGHT;i++){
            rows.push(
                {
                    "B":this.board["B"][i].number, 
                    "I":this.board["I"][i].number, 
                    "N":this.board["N"][i].number, 
                    "G":this.board["G"][i].number, 
                    "O":this.board["O"][i].number
            })
        }
        console.table(rows)
    }

    /**
     * Function to get the next ball
     */
    nextBall(){
        let [ball, onBoard] = this.getRandomBall()
        ball.runAnimation()
        ball.chosen= true
        
        if (onBoard){
            // @ts-ignore
            document.getElementById(`${ball.letter}${ball.number}`).classList.add("taken")
            // @ts-ignore
            document.getElementById(`${ball.letter}${ball.number}`).classList.remove("available") 
        }
        // @ts-ignore
        document.getElementById("currentChallenge").innerHTML = ball.challenge.getText()
        // @ts-ignore
        document.getElementById("challengeList").innerHTML += `<li><span class="ball">${ball.letter}${ball.number}</span>${ball.challenge.getText()}</li>`
        
    }

    
}

/**
 * The function to  start the game
 */
function startGame(){
    //@ts-ignore
    document.getElementById("setupGame").style.display = "None";
    //@ts-ignore
    document.getElementById("mainLogoContainer").style.paddingTop="5vh";
    currentGame = new Bingo()
    //@ts-ignore
    document.getElementById("gameButtons").style.opacity = "1";
}

