class Dice{
    /**
     * A class representing a die
     * 
     * Notes
     * -----
     * - Beyond the range 1-6 Dice.character and Dice.html is not valid
     * @param {Number} number The number of the dice (for traditional dice this is between 1-6)
     * @param {Number} minValue The minimum value of the dice
     * @param {Number} maxValue The Maximum value of the dice
     */
    constructor(number,minValue=1, maxValue = 6){
        if ((number > maxValue)|| (number<minValue)){
            throw new Error(`Number ${number} is not in range ${minValue}-${maxValue}`)
        }
        this.number = number
        if (number > 6){
            // UTF-8 Dice only goes up to 6, so these are just placeholders for larger numbers
            this.character = `${number}`
            this.html = `<span class="dice">${number}</span>`
        } else{
            this.character = `&#x268${number-1};` // The HTML unicode encoded string
            this.html = `<span class="dice">${this.character}</span>`
        }
    }

    static getRandomDice(minValue=1, maxValue = 6){
        const diceNumber = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue)
        return new Dice(diceNumber, minValue, maxValue)
    }
}