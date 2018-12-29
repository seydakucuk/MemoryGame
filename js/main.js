const deck = document.getElementById('deck');
const moveElement = document.getElementById('move');
let starsElement = document.getElementById('stars');

const starChecks = [12, 18];
let lastMoveCount = 0;
let deletedStars = 0;

const cardClassNames = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let deckCells = [];



let lastClickedCell = null;
let previouslyClickedCell = null;

let moveCounter = 0;

let isInCompareCells = false; // this flag is used to fix the bug that occurs when the user clicks the cards too fast

let timeCounter = 0;
let timer;
let isTimerOn = 0;

let duration = 0;

const listItemParentClassName = 'card';
const cardOpenClassName = "card open show";

const modal = document.getElementById("myModal");
//const modalMessageElement = document.querySelector(".modal-content");
const modalMessageElement = document.getElementById("modal-message");
const modalStarsElement = document.getElementById("modal-stars");

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
    if (!isInCompareCells) {
        const clickedElement = event.target;
        if (clickedElement.nodeName === 'LI') {
            if (!isTimerOn) {
                startTimer();
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
                    stopTimer();
                    deck.removeEventListener("click", deckClicked);
                    let congratulationsMsg = `You finished the game in ${duration} seconds. Would you like to play again?`;
                    modalMessageElement.innerHTML = congratulationsMsg;
                    modalStarsElement.innerHTML = starsElement.innerHTML;
                    modal.style.display = "block";
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
    if (deletedStars < starChecks.length) {
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
            if (delta == checkPoint && moveCounter != lastMoveCount) {
                const firstChildElement = starsElement.firstElementChild;
                lastMoveCount = moveCounter;
                if (firstChildElement != null) {
                    firstChildElement.remove();
                }
                deletedStars++;
                break;
            }
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
    stopTimer();
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

function logTime() {
    document.getElementById("timer").innerHTML = timeCounter + " sec";
    timeCounter = timeCounter + 1;
    timer = setTimeout(logTime, 1000);
}

function startTimer() {
    if (!isTimerOn) {
        duration = 0;
        isTimerOn = 1;
        logTime();
    }
}

function stopTimer() {
    if (isTimerOn) {
        duration = timeCounter;
        timeCounter = 0;
        clearTimeout(timer);
        isTimerOn = 0;
    }
}

function playAgainClicked() {
    reset();
    closeModal();
}


function closeModal() {
    modal.style.display = "none";
}
