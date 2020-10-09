const images = [`1_pig.png`, `2_squirrel.png`, `3_rabbit.png`, `4_frog.png`, `5_fox.png`, `6_bear.png`, `7_monkey.png`, `8_panda.png`, `9_chick.png`, `10_tiger.png`, `11_penguin.png`, `12_racoon.png`]
let pairs = {}
const folder = `img/`
const cardContainer = QS(document, '.cardContainer')
const currentScoreElement = QS(document, '.currentscore')
let currentScore = 0
const scoreBoard = QS(document, '.scoreboard')
let highScores = JSON.parse(sessionStorage.getItem('highScores'))
function QS(element,target) {
    return element.querySelector(target)
}
function QSA(element,target) {
    return element.querySelectorAll(target)
}
function cloneTemplate(templateID, templateContent) {
    let template = QS(document,templateID)
    let clone = template.content.cloneNode(true)
    return QS(clone,templateContent)
}
function generateID(segments){
    let ID = ``
    ID += Math.random().toString(36).substr(2, 9)
    
    for (let i = 0; i < segments-1;i++){
        
        ID += `-${Math.random().toString(36).substr(2, 9)}`
    }
    return ID
}
function shuffle(array) {
    let j, x, i
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = array[i]
        array[i] = array[j]
        array[j] = x
    }
    return array
}
function sortAscending(array) {
    return array.sort((a,b) => a-b)
}
function getClassListAsArray(element) {
    let classList = []
    for (let i = 0; i < element.classList.length;i++) {
        classList.push(element.classList[i])
    }
    return classList
}
function generateCards() {
    let cards = []
    cardContainer.innerHTML = ""
    for (let i = 0; i<images.length; i++) {
        let card_1 = cloneTemplate('#cardTemplate', '.card')
                
        card_1.children[1].src = `${folder}${images[i]}`
        
        let card_2 = card_1.cloneNode(true)
        let ID_1 = generateID(3)
        let ID_2 = generateID(3)
        pairs[ID_1] = i+1
        pairs[ID_2] = i+1
        card_1.id = ID_1
        card_2.id = ID_2
        cards.push(card_2)
        cards.push(card_1)
        
    }
    cards = shuffle(cards)
        
    for (let card of cards) {
        
        card.addEventListener('click', flipCard)
        cardContainer.appendChild(card)
    }
    
}
function generateScoreBoard() {
    scoreBoard.innerHTML = ''
    if (highScores != null) {
        highScores.forEach(highScore => {
            
            let li = cloneTemplate('#leaderBoardTemplate', '.highScore')
            
            li.innerText = highScore
            
            scoreBoard.appendChild(li)
            
        })
        
    }
}
function found(oldCard, currentCard) {
    if (oldCard != currentCard && pairs[oldCard.id] == pairs[currentCard.id]) {
        correctGuess([currentCard, oldCard])
        incrementCurrentScore()
        updateCurrentScore()
    } else if (oldCard != currentCard) {
        setTimeout(incorrectGuess, 500, [currentCard, oldCard])
        incrementCurrentScore()
        updateCurrentScore()
        
    }
}
function correctGuess(array) {
    array.forEach(element => {
        
        turndown([element])
        element.classList.add('found')
        element.removeEventListener('click', flipCard)
    })
    setTimeout(hasWon, 500)
}
function incorrectGuess(array) {
    array.forEach(element => {
        
        animateFlipDown(element)
    })
    setTimeout(turndown, 250, array)
}
function turndown(array) {
    array.forEach(element => {
        removeflipped(element)
        
    })
}
function animateFlipUp(element) {
    element.animate([
        {transform: 'rotateY(180deg)'},
        {transform: 'rotateY(0deg)'}
    ],
    {
        duration: 500,
        iterations: 1
    })
}
function animateFlipDown(element) {
    element.animate([
        {transform: 'rotateY(0deg)'},
        {transform: 'rotateY(180deg)'}
    ],
    {
        duration: 500,
        iterations: 1
    })
    
}
function addflipped(element) {
    let classList = getClassListAsArray(element)
    if (!classList.includes('found')) {
        element.classList.add('flipped')
    }
}
function removeflipped(element) {
    element.classList.remove('flipped')
}
function incrementCurrentScore() {
    currentScore++
}
function updateCurrentScore() {
 
    currentScoreElement.innerText = currentScore
}
function updateHighScore() {
    if (highScores== null) {
        highScores = [currentScore]
        sessionStorage.setItem('highScores', JSON.stringify(highScores))
    } else {
        if (highScores.length >= 5) {
            highScores.push(currentScore)
            highScores = sortAscending(highScores)
            highScores.pop()
            sessionStorage.setItem('highScores', JSON.stringify(highScores))
        } else if (highScores.length < 5 && highScores.length > -1) {
            highScores.push(currentScore)
            highScores = sortAscending(highScores)
            sessionStorage.setItem('highScores', JSON.stringify(highScores))
        }
    }
}
function hasWon() {
    if (QSA(document, '.found').length == QSA(document, '.card').length) {
        if (window.confirm('Victory! Restart?')) {   
                        
            reset()
        }
    }
}
function reset() {
    updateHighScore()
    currentScore = 0
    pairs = {}
    updateCurrentScore()
    generateCards()
    generateScoreBoard()
    
}
function flipCard(e) {
    card = e.target.parentElement
    let flippedCards = QSA(document, '.flipped')
    
    if (flippedCards.length < 2) {
        
        let classList = getClassListAsArray(card)
        if (!classList.includes('flipped')) {
            setTimeout(addflipped, 250, card)
            animateFlipUp(card)
        
        }
        if (flippedCards.length == 1) {
            
            found(flippedCards[0], card)
            
        }
        
    }
}
window.onload=generateCards()
window.onload=generateScoreBoard()