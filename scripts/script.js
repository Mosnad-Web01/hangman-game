document.addEventListener('DOMContentLoaded', () => {
    const alphabetContainer = document.getElementById('alphabet');
    const wordContainer = document.getElementById('word');
    const hintContainer = document.getElementById('hint');
    const livesContainer = document.getElementById('lives');
    const playAgainButton = document.getElementById('newGame');
    const hintButton = document.getElementById('hintBtn');
    const stickFigureSec = document.getElementById('stick-figure');

    
    let randomWord = '';
    let lives = 7;
    let hint;
    async function fetchRandomWord() {
        try {
            const response = await fetch('word.json'); // Update this to the actual JSON file path
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.length);
            randomWord = data[randomIndex].word.toUpperCase();
             hint = data[randomIndex].hint;
            // Initialize the word display with underscores
            wordContainer.textContent = '_ '.repeat(randomWord.length).trim();
        } catch (error) {
            console.error('Error fetching the JSON:', error);
        }
    }
// Function to create alphabet buttons
 function createAlphabetButtons() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const row = document.createElement('div');
        row.classList.add('no-gutters');

        for (let i = 0; i < letters.length; i ++) {
                const button = document.createElement('button');
                button.textContent = letters[i];
                button.classList.add('btn', 'btn-primary', 'letter-button');
                button.id = letters[i];
                button.addEventListener('click', handleLetterClick);
                row.appendChild(button);
            }

            alphabetContainer.appendChild(row);
        
    }
 // Call the function to create the alphabet buttons
 createAlphabetButtons();
// Display the hint
hintButton.addEventListener('click', () => {
        hintContainer.style.opacity = 1;
        hintContainer.textContent = `Hint: ${hint}`
});        
 // Fetch and display a random word on page load
 fetchRandomWord();
    function handleLetterClick(event) {
        const clickedLetter = event.target.textContent;
        let isLetterInWord = false;

        // Disable the button
        event.target.disabled = true;

        // Update the word display if the letter is in the word
        const displayedWord = wordContainer.textContent.split(' ');
        for (let i = 0; i < randomWord.length; i++) {
            if (randomWord[i] === clickedLetter) {
                displayedWord[i] = clickedLetter;
                isLetterInWord = true;
            }
        }

        wordContainer.textContent = displayedWord.join(' ');

        // If the letter was not in the word, decrease lives
        if (!isLetterInWord) {
            lives--;
            livesContainer.textContent = `Lives: ${lives}`;
            showNextHangmanPart();
            
            // Check if the game is over
            if (lives === 0) {
                alert('Game Over! The hangman is hanged! 👨‍🦱🔪');
                disableAllButtons();
            }
        }

        // Check if the player has won
        if (!displayedWord.includes('_') && !theManIsHanged) {
            alert('Congratulations! You guessed the word!');
            disableAllButtons();
        }else if(theManIsHanged){
            alert('Game Over! The hangman is hanged! 👨‍🦱🔪');
            disableAllButtons();          
        }
    }

    function disableAllButtons() {
        const buttons = document.querySelectorAll('.letter-button');
        buttons.forEach(button => button.disabled = true);
    }

    function resetGame() {
        livesContainer.textContent = `Lives: ${lives}`;
        alphabetContainer.innerHTML = '';
        // Display the hangman figure
        //stickFigureSec.style.opacity = 0;
        createAlphabetButtons();
        fetchRandomWord();
    }
let incorrectGuesses = 0;
let theManIsHanged = false;

function showNextHangmanPart() {
    const parts = [
        //'stick-figure',
        'hangman-head',
        'hangman-body',
        'hangman-leftArm',
        'hangman-rightArm',
        'hangman-leftLeg',
        'hangman-rightLeg'
    ];

    if (incorrectGuesses <= parts.length) {
        const hangmanPart = document.getElementById(parts[incorrectGuesses]);
        hangmanPart.classList.remove('hidden');
        incorrectGuesses++;
    }
    if (incorrectGuesses === parts.length) {
        theManIsHanged = true;
    }
        
}

    // Initialize the game
    resetGame();

    // Play again button event listener
    playAgainButton.addEventListener('click', resetGame);
});


