const categories = {
    fruits: ['images/apple.jpg', 'images/banana.jpg', 'images/grapes.jpg', 'images/watermelon.jpg'],
    emojis: ['images/confused.png', 'images/laughing.png', 'images/smiley.png', 'images/bigEyes.png'],
    animals: ['images/dog.jpg', 'images/elephant.jpg', 'images/lion.jpg', 'images/panda.png'],
    planets: ['images/earth.png', 'images/moon.png', 'images/planet.png', 'images/sunny.png']
};

let selectedCategory = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timeLeft = 20;
let timer;
let currentCategory;
let round = 1;

function startGame(category) {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('gameBoard').classList.remove('hidden');

    currentCategory = category;
    selectedCategory = [...categories[category], ...categories[category]];
    selectedCategory.sort(() => Math.random() - 0.5);

    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = ''; 

    selectedCategory.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.value = item;
        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
    });

    score = 0;
    matchedPairs = 0;
    round = 1;
    document.getElementById('score').innerText = score;
    document.getElementById('round').innerText = round;
    timeLeft = 20;
    document.getElementById('timer').innerText = timeLeft;
    startTimer();
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.innerHTML = `<img src="${this.dataset.value}" width="80" height="80">`;
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
        matchedPairs++;
        score += 10;
        document.getElementById('score').innerText = score;
        confirmMatch();
    } else {
        flippedCards.forEach(card => {
            setTimeout(() => {
                card.innerHTML = '';
                card.classList.remove('flipped');
            }, 500);
        });
        flippedCards = [];
    }
}

function confirmMatch() {
    if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
        matchedPairs++;
        score += 10;
        document.getElementById('score').innerText = score;

        flippedCards.forEach(card => {
            card.classList.add('matched'); 
        });

        flippedCards = []; 

        if (matchedPairs === categories[currentCategory].length) {
            clearInterval(timer);
            alert(`Round ${round} Complete!`);
            round++;
            document.getElementById('round').innerText = round;
            matchedPairs = 0;

            // *** The FIX is HERE ***
            setTimeout(() => {  
                const cardGrid = document.getElementById('cardGrid');
                cardGrid.innerHTML = ''; 
                startGame(currentCategory);    
            }, 500); 
        }
    }
}

function resetGame() {
    clearInterval(timer);
    timeLeft = 20;
    document.getElementById('timer').innerText = timeLeft;
    matchedPairs = 0;
    round = 1;
    document.getElementById('round').innerText = round;
    startGame(Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)]);
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            alert('Game Over! ⏳');
            resetGame();
        }
    }, 1000);
}

// Add event listeners for your category buttons
const categoryButtons = document.querySelectorAll('.categoryButton');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        startGame(category);
    });
});