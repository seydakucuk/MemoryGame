const deck = document.getElementById('deck');
const moveElement = document.getElementById('move');
let starsElement = document.getElementById('stars');

const starChecks = [12, 18];
let lastMoveCountDelta = 0;

const cardClassNames = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let deckCells = [];



let lastClickedCell = null;
let previouslyClickedCell = null;

let moveCounter = 0;

let isInCompareCells = false; // this flag is used to fix the bug that occurs when the user clicks the cards too fast

let c = 0;
let t;
let timer_is_on = 0;

let duration = 0;

const listItemParentClassName = 'card';
const cardOpenClassName = "card open show";
let isGameActive = true;


function createStars() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 3; i++) {
        const li = document.createElement("li");
        li.innerHTML = "<i class='fa fa-star'></i>";
        fragment.appendChild(li);
    }

    starsElement.appendChild(fragment);
}

function createListItem(className, id) {
    const listItem = document.createElement('li');
    listItem.id = id;
    listItem.className = listItemParentClassName;
    const listItemText = document.createElement('i');
    listItemText.className = 'fa ' + className;
    listItem.appendChild(listItemText);
    return listItem;
}

function createDeck() {
    const fragment = document.createDocumentFragment();

    let idCounter = 1;
    for (let className of cardClassNames) {
        for (let i = 0; i < 2; i++) {
            const listItem = this.createListItem(className, idCounter);
            idCounter++;
            deckCells.push(listItem);
        }
    }

    shuffle(deckCells);

    // first shuffle than add to the fragment
    for (let li of deckCells) {
        fragment.appendChild(li);
    }

    deck.appendChild(fragment);
    deck.addEventListener('click', deckClicked);
}

function deckClicked(event) {
    if (isGameActive) {
        if (!isInCompareCells) {
            const clickedElement = event.target;
            if (clickedElement.nodeName === 'LI') {
                if (!timer_is_on) {
                    startCount();
                }

                moveCounter++;
                moveElement.innerHTML = moveCounter;

                if (lastClickedCell != null && lastClickedCell.id != clickedElement.id) {
                    previouslyClickedCell = lastClickedCell;
                    lastClickedCell = clickedElement;
                    lastClickedCell.className = cardOpenClassName;
                    lastClickedCell.className = cardOpenClassName;
                    window.setTimeout(compareOpenCells.bind(lastClickedCell, previouslyClickedCell), 400);
                    isInCompareCells = true;
                }
                else {
                    lastClickedCell = clickedElement;
                    lastClickedCell.className = cardOpenClassName;
                }
            }
        }
    }
}

function compareOpenCells() {
    if (lastClickedCell.firstChild) {
        const lastClickedIcon = lastClickedCell.firstChild.className;
        if (previouslyClickedCell.firstChild) {
            const preClickedIcon = previouslyClickedCell.firstChild.className;
            if (lastClickedIcon != preClickedIcon) {
                lastClickedCell.className = listItemParentClassName;
                previouslyClickedCell.className = listItemParentClassName;
            }
            else {
                const isGameEnd = checkGameEnd();
                if (isGameEnd) {
                    stopCount();

                    let congratulationsMsg = `Congratulations!
You finished the game in ${duration} seconds. Would you like to play again?`;

                    if (confirm(congratulationsMsg)) {
                        reset();
                    } else {
                        isGameActive = false;
                    }
                }
            }

            lastClickedCell = null;
            previouslyClickedCell = null;
            processStars();
            isInCompareCells = false;

        }
    }
}

function processStars() {
    let openCardCount = 0;
    for (let card of deckCells) {
        if (card.className == cardOpenClassName) {
            openCardCount++;
        }
    }

    if (openCardCount % 2 == 1) {
        openCardCount--;
    }

    const delta = moveCounter - openCardCount;

    for (let checkPoint of starChecks) {
        if (delta == checkPoint && delta != lastMoveCountDelta) {
            const firstChildElement = starsElement.firstElementChild;
            lastMoveCountDelta = delta;
            if (firstChildElement != null) {
                firstChildElement.remove();
            }
            break;
        }
    }
}

createDeck();
createStars();

function checkGameEnd() {
    for (let cell of deckCells) {
        if (cell.className != cardOpenClassName) {
            return false;
        }
    }

    return true;
}


function reset() {
    isGameActive = true;
    stopCount();
    starsElement.innerHTML = "";
    createStars();
    deck.innerText = "";
    deckCells = [];
    document.getElementById("timer").innerHTML = "";
    createDeck();
    moveCounter = 0;
    lastClickedCell = null;
    previouslyClickedCell = null;
    moveElement.innerHTML = moveCounter;
}

function timedCount() {
    document.getElementById("timer").innerHTML = c + " sec";
    c = c + 1;
    t = setTimeout(timedCount, 1000);
}

function startCount() {
    if (!timer_is_on) {
        duration = 0;
        timer_is_on = 1;
        timedCount();
    }
}

function stopCount() {
    if (timer_is_on) {
        duration = c;
        c = 0;
        clearTimeout(t);
        timer_is_on = 0;
    }
}

