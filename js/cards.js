class Card{
    /** A representaiton of a card
    * @param suit {"♠"|"♥"|"♦"|"♣"} - The suit of the card
    * @param value {Number} - The value of the card between 1-13 (ace is 1 and becomes 14 if acesHigh)
    * @param acesHigh {Boolean} - If ace should be worth 11 or 1
    */
    constructor (suit, value, acesHigh = false){
        let color = "black"
        if (suit ==="♥" || suit ==="♦"){
            color = "red"
        }
        let letter = "A"
        switch (suit){
            case "♠": letter = "A"; break;
            case "♥": letter = "B"; break;
            case "♦": letter = "C"; break;
            case "♣": letter = "D"; break;
            default: throw new Error(`Provided suit is invalid ${suit}`);break;
        }
        /**@type {String|Number} */
        let characterNumber = value
        if (value>9){ // Need to start with hex values A-E
            if (value >11){ 
                characterNumber = (value+1).toString(16).toUpperCase()
            } else{
                characterNumber = value.toString(16).toUpperCase()
            }
        }
        this.suit = suit
        this.character = `&#x1F0${letter}${characterNumber};` // UTF-8 Character 
        this.html = `<span class="playingCard" style="color:${color}">&#x1F0${letter}${characterNumber};</span>`    

        if(value == 1  && acesHigh){
            this.value = 14
        }
        
        this.value = value // The raw value (i.e. queen > jack since queen is higher value)

        if (value == 14){ // Aces high, and it's an ace
            this.number = 11
        } else if (value > 10){ // The base value (i.e. queen == jack since both are 10)
            this.number = 10 
        } else{
            this.number = value
        }
    }
}

class Deck{
    /**
     * Represents a full deck of cards
     * @param acesHigh {Boolean} Whether aces should be worth 11 (true) or 1 (false)
     */
    constructor (acesHigh = true){
        /**@type {Card[]} */
        let cards = []
        /**  @type {{ "♠": Card[], "♥": Card[], "♦": Card[], "♣": Card[] }}*/
        let deck = {
            "♠":[],
            "♥":[],
            "♦":[],
            "♣":[]
        }
        
        /**@type {Array<"♠" | "♥" | "♦" | "♣">} */
        let suits = ["♠","♥","♦","♣"]
        for (const suit of suits){
            suit 
            for (let i=1;i<=13; i++){
                let newCard = new Card(suit, i,acesHigh)
                cards.push(newCard)
                deck[newCard.suit].push(newCard)
            }
        }
        this.cards = cards            // The cards in the deck in an unordered array
        this.deck = deck              // The cards in the deck, by suit
        this.remaining = cards.length // Number of cards remaining
    }

    /** Gets a random card, if remove is True will remove it from this.remaining*/
    getRandomCard(remove=false){
        if (this.cards.length){
            const cardIndex = Math.floor(Math.random()*this.cards.length)
            const card = this.cards[cardIndex]
            if (remove){
                this.deck[card.suit].splice(this.deck[card.suit].indexOf(card), 1)
                this.cards.splice(cardIndex, 1)
            }
            this.remaining = this.cards.length
            return card
        } else {
            throw new Error("No Cards remaining")
        }
    }
}