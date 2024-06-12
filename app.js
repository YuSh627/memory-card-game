"use strict";
// Initial array of card objects
let cardsArray = [
  { name: "apple", img: "🍎" },
  { name: "coffee", img: "☕" },
  { name: "tomato", img: "🍅" },
  { name: "pizza", img: "🍕" },
  { name: "cheese", img: "🧀" },
  { name: "orange", img: "🍊" },
  { name: "watermelon", img: "🍉" },
  { name: "cherry", img: "🍒" },
];
// Selecting necessary DOM elements
const root = document.documentElement;
const parentDiv = document.querySelector("#card-section");
const resetBtn = document.getElementById("resetBtn");
let timerElement = document.getElementById("timer");
const newgame = document.getElementById("new-game");
const popupOverlay = document.getElementById("popup-overlay");
const messageText = document.getElementById("message-text");
const closeButton = document.getElementById("close-button");
let toggle = document.querySelector("#toggle-btn");
// Function to show the popup overlay with a message
const showPopup = (message) => {
  messageText.textContent = message;
  popupOverlay.style.display = "flex";

  popupOverlay.style.zIndex = "100";
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
  });
  confetti({
    particleCount: 100,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
  });
  confetti({
    particleCount: 500,
    spread: 70,
    origin: { y: 0.6 },
  });
};
// Event listener for closing the popup overlay
closeButton.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});
// Hide the popup overlay when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  popupOverlay.style.display = "none";
});
// Duplicate the cards for the game
const gamecard = cardsArray.concat(cardsArray);
// Fisher-Yates shuffle algorithm
const shuffleCards = (cards) => {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};
let darkTheme = false;
let timer;
let time = 0;
let matchedPairs = 0;
let isTimerRunning = false;
let clickCount = 0;
let firstCard = null;
let secondCard = null;
// Format time as 00:00:00
const formatTime = (time) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
// Format time as human-readable string for the popup message
const formatTimeForPopup = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  let timeString = "";
  if (hours > 0) {
    timeString += `${hours} hour `;
  }
  if (minutes > 0) {
    timeString += `${minutes} minute `;
  }
  if (seconds > 0 || timeString === "") {
    timeString += `${seconds} second`;
  }
  return timeString.trim();
};
// Start the game timer
const startTimer = () => {
  timer = setInterval(() => {
    time++;
    timerElement.textContent = formatTime(time);
  }, 1000);
};
// Stop the game timer
const stopTimer = () => {
  clearInterval(timer);
};
// Reset the game timer
const resetTimer = () => {
  clearInterval(timer);
  time = 0;
  timerElement.textContent = formatTime(time);
  isTimerRunning = false;
};
// Shuffle the cards initially
let shuffledCards = shuffleCards(gamecard);
// Flip all cards to show their backs
const flipAllCardsToBack = () => {
  let allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.classList.add("card_selected");
  });
};
// Handle card matches
const cardMatches = () => {
  let card_selected = document.querySelectorAll(".card_selected");
  card_selected.forEach((curElem) => {
    curElem.classList.add("card_matched");
    curElem.classList.remove("card_selected");
    curElem.classList.add("card_disabled");
  });
  matchedPairs++;
  if (matchedPairs === cardsArray.length) {
    stopTimer();
    setTimeout(() => {
      flipAllCardsToBack();
    }, 500);
    setTimeout(() => {
      showPopup(
        `Congratulations! \r\n \r\n You finished the game in ${formatTimeForPopup(
          time
        )}.`
      );
    }, 1750);
  }
};
// Reset the game state
const resetGame = () => {
  firstCard = null;
  secondCard = null;
  clickCount = 0;
  let card_selected = document.querySelectorAll(".card_selected");
  card_selected.forEach((curElem) => {
    curElem.classList.remove("card_selected");
  });
};
// Flip remaining cards when only two are left
const flipRemainingCards = () => {
  const unmatchedCards = document.querySelectorAll(".card:not(.card_matched)");
  if (unmatchedCards.length === 2) {
    unmatchedCards.forEach((card) => {
      card.classList.add("card_selected");
    });
    setTimeout(() => {
      cardMatches();
      resetGame();
    }, 1000);
  }
};
// Create and display the cards
const createCards = () => {
  parentDiv.innerHTML = "";
  shuffledCards = shuffleCards(gamecard);
  matchedPairs = 0;
  resetTimer();
  shuffledCards.forEach((card) => {
    const childDiv = document.createElement("div");
    childDiv.classList.add("card");
    childDiv.dataset.name = card.name;
    const frontDiv = document.createElement("div");
    frontDiv.classList.add("front-card");
    const backDiv = document.createElement("div");
    backDiv.classList.add("back-card");
    backDiv.innerHTML = card.img;
    parentDiv.appendChild(childDiv);
    childDiv.appendChild(frontDiv);
    childDiv.appendChild(backDiv);
  });
};
// Handle card clicks
parentDiv.addEventListener("click", (e) => {
  const currentCard = e.target.closest(".card");
  if (
    !currentCard ||
    currentCard.classList.contains("card_matched") ||
    currentCard.classList.contains("card_selected")
  ) {
    return;
  }
  clickCount++;
  if (!isTimerRunning) {
    startTimer();
    isTimerRunning = true;
  }
  if (clickCount === 1) {
    firstCard = currentCard;
    currentCard.classList.add("card_selected");
  } else if (clickCount === 2) {
    secondCard = currentCard;
    currentCard.classList.add("card_selected");
    if (
      firstCard &&
      secondCard &&
      firstCard.dataset.name === secondCard.dataset.name
    ) {
      setTimeout(() => {
        cardMatches();
        resetGame();
        flipRemainingCards();
      }, 500);
    } else {
      setTimeout(() => {
        resetGame();
      }, 500);
    }
  }
});
// Handle the reset button click
resetBtn.addEventListener("click", () => {
  createCards();
});
newgame.addEventListener("click", () => {
  popupOverlay.style.display = "none";
  createCards();
});
// Initial call to create cards
createCards();
toggle.addEventListener("click", () => {
  if (darkTheme) {
    // for light theme
    darkTheme = false;
    root.style.setProperty("--bg-main", "#F5F5F5");
    root.style.setProperty("--front-card", "#2f4f4f");
    root.style.setProperty("--back-card", "#599696");
    // root.style.setProperty("--border-color", "#47494b");
    // root.style.setProperty("--hover-color", "#f8f7febe");
    root.style.setProperty("--text-color", "#2f4f4f");
    toggle.classList.remove("fa-toggle-off");
    toggle.classList.add("fa-toggle-on");
  } else {
    // for dark theme
    root.style.setProperty("--bg-main", "#2f4f4f");
    root.style.setProperty("--front-card", "#F5F5F5");
    root.style.setProperty("--back-card", "#599696");
    // root.style.setProperty("--border-color", "#47494b");
    // root.style.setProperty("--hover-color", "#f8f7febe");
    root.style.setProperty("--text-color", "#F5F5F5");
    toggle.classList.remove("fa-toggle-on");
    toggle.classList.add("fa-toggle-off");
    darkTheme = true;
  }
});

// Get modal elements
const modalContainer = document.getElementById("modal-container");
const modalToggle = document.getElementById("modal-toggle");
const modalClose = document.getElementById("modal-close");

// Function to open modal
function openModal() {
  modalContainer.style.display = "flex";
  setTimeout(() => {
    modalContainer.classList.add("active");
  }, 10); // Small delay to allow transition effect
}

// Function to close modal
function closeModal() {
  modalContainer.classList.remove("active");
  modalContainer.addEventListener(
    "transitionend",
    () => {
      modalContainer.style.display = "none";
    },
    { once: true }
  );
}

// Event listeners
modalClose.addEventListener("click", closeModal);
document.addEventListener("click", closeModal);

modalToggle.addEventListener("click", function (event) {
  // Prevent the click event from bubbling up to the window
  event.stopPropagation();
  openModal();
});

// Prevent closing modal when clicking inside the modal content
modalContainer.addEventListener("click", function (event) {
  event.stopPropagation();
});
