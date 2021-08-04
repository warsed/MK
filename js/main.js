const view = {
    displayHit(location) {
        const cell = document.getElementById(location)
        cell.classList.add('hit')
    },
    displayMiss(location) {
        const cell = document.getElementById(location)
        cell.classList.add('miss')
    },
    displayMessage(msg) {
        const message = document.getElementById('messageArea')
        message.innerHTML = msg
    }
};

const model = {
    boardSize: 7,
    numShips: 3,
    shipsLength: 3,
    shipsSunk: 0,
    generateShipLocations(){
        let locations;
        for(let i = 0; i<this.numShips; i++){
            do {
                locations = this.generateShip()
            } while (this.collision(locations))
            this.ships[i].locations = locations
        }
    },
    generateShip(){
    let direction = Math.floor(Math.random() * 2)
    let row, col
    if (direction === 1) {
        row = Math.floor(Math.random() * this.boardSize)
        col = Math.floor(Math.random() * (this.boardSize - this.shipsLength))
    } else {
        row = Math.floor(Math.random() * (this.boardSize - this.shipsLength))
        col = Math.floor(Math.random() * this.boardSize)
    }

    let newShipLocations = []
    
    for(let i = 0; i<this.shipsLength; i++){
        if(direction === 1) {
            newShipLocations.push(row + '' + (col + i))
        } else {
            newShipLocations.push((row + i) + '' + col)
        }
    } return newShipLocations
    },
    collision(locations){
        for(let i = 0; i<this.numShips; i++){
            let ship = this.ships[i]
            for(let j = 0; j<locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >=0) {
                    return true
                }
            }
        } return false
    },
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] }],
    fire(guess) {
        for (let i = 0; i < this.numShips; i++){
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)
            if (ship.hits[index] === 'hit') {
                view.displayMessage('повторяешься')
                return true
            }   else if (index >= 0) {
                ship.hits[index] = 'hit'
                view.displayHit(guess)
                view.displayMessage('HIT')
                if (this.isSunk(ship)) {
                    view.displayMessage('потоплен нах')
                    this.shipsSunk++
                } return true
            }
        } view.displayMiss(guess)
            view.displayMessage('MISS')
            return false
    },
    isSunk(ship) {
        for (let i = 0; i < this.numShips; i++) {
            if (ship.hits[i] !== 'hit')
                return false
        } return true
    }
};

const parseGuess = (guess) => {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G"]
    let row = guess.charAt(0)
    let col = guess.charAt(1)
    let rowNumber = alphabet.indexOf(row)
    if (guess === null || guess.length !== 2) {
        alert('нет таких координат')
    } else if (isNaN(col) || col >= model.boardSize || col < 0 || rowNumber >= model.boardSize || rowNumber < 0) {
        alert('нет таких координат алло')
    } else {
        return rowNumber + col;
    } return null;
};

const controller = {
    guesses: 0,
    processGuess(guess) {
        let location = parseGuess(guess)
        if (location) {
            this.guesses++
            let hit = model.fire(location)
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`ВСЁ потоплено за ${this.guesses} выстрелов`)
            }
        }
    }
}

function handleFireButton() {
    let guessInput = document.getElementById('guessInput')
    let guess = guessInput.value.toUpperCase()
    controller.processGuess(guess)
    guessInput.value = "";
}

function init() {
    var fireButton = document.getElementById("fireButton")
    fireButton.onclick = handleFireButton
    var guessInput = document.getElementById("guessInput")
    guessInput.onkeypress = handleKeyPress
    model.generateShipLocations()
}

   function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton")
    if (e.keyCode === 13) {
    fireButton.click()
    return false
    }
}

window.onload = init;