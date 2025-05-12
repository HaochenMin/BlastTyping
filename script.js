//Starting time for scoring purposes
let startTime= Date.now();
//page elements
const typeElemend = document.getElementById('blastletter');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const modal = document.getElementById('myModal');
const restartButton = document.getElementById('restartbtn');
const endgameMessageElement = document.getElementById('endgamemsg');
const leaderboard = document.querySelectorAll('.highscores li');
const topScores = [0, 0, 0, 0, 0]; //Initializes leaderboard as all 0s
var scoresShown = 0; //Tracker for how many scores have been recorded
const mapScores = new Map();
typedValueElement.style.display="none";
updateLeaderboard();

//Closes the modal that appears after a quote is completed
restartButton.onclick =function () {
  modal.style.display = "none";
}

//Updates the leaderboard with new values
function updateLeaderboard() {
  if (scoresShown == 0){ //When there are no scores to be shown, do not update topscores with localstorage or it will replace to null
    topScores.forEach((score, j) => {
    leaderboard[j].textContent = score;
    });
  }
  else {
    for (let i=1; i <= scoresShown; i++){ //When there is at least 1 score to be shown, replaces topScore elements with localstorage only if they are not null
      mapScores.set(1, localStorage.getItem("First"));
      mapScores.set(2, localStorage.getItem("Second"));
      mapScores.set(3, localStorage.getItem("Third"));
      mapScores.set(4, localStorage.getItem("Fourth"));
      mapScores.set(5, localStorage.getItem("Fifth"));
      topScores[i - 1] = mapScores.get(i);
    }
    topScores.forEach((score, j) => {
    leaderboard[j].textContent = score;
  });
  }
}

function compareScore(newScore, scoreCheck) {//Returns true if there is no value in that slot or it is higher than the score in that ranking
  return ((localStorage.getItem(scoreCheck) === null) || (localStorage.getItem(scoreCheck) === 'null') || (newScore < (localStorage.getItem(scoreCheck)))); 
  //TODO: replace last check with score instead of time
}

function replaceScore(newScore) { //Checks if the new score is higher than the score in the ranking and increments scoresShown if less than 5
  if (compareScore(newScore, "First")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", localStorage.getItem("Third"));
      localStorage.setItem("Third", localStorage.getItem("Second"));
      localStorage.setItem("Second", localStorage.getItem("First"));
      localStorage.setItem("First", newScore);
      if (scoresShown < 5) {
        scoresShown += 1;
      }
      updateLeaderboard();
  }
  else if (compareScore(newScore, "Second")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", localStorage.getItem("Third"));
      localStorage.setItem("Third", localStorage.getItem("Second"));
      localStorage.setItem("Second", newScore);
      if (scoresShown < 5) {
        scoresShown += 1;
      }
      updateLeaderboard();
  }
  else if (compareScore(newScore, "Third")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", localStorage.getItem("Third"));
      localStorage.setItem("Third", newScore);
      if (scoresShown < 5) {
        scoresShown += 1;
      }
      updateLeaderboard();
  }
  else if (compareScore(newTime, "Fourth")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", newScore);
      if (scoresShown < 5) {
        scoresShown += 1;
      }
      updateLeaderboard();
  }
  else if (compareScore(newScore, "Fifth")){
      localStorage.setItem("Fifth", newScore);
      if (scoresShown < 5) {
        scoresShown += 1;
      }
      updateLeaderboard();
  }
}

function generateLetters(number) { //generates number amount of letters to type randomly
    var result = '';
    var char = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < number; i++) {
        result += char.charAt(Math.floor(Math.random() * char.length));
    }
    return result;
}

//TODO: Update start and end functionality
document.getElementById('start').addEventListener('click', () => {
    // get a quote
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    // Put the quote into an array of words
    words = quote.split(' ');
    // reset the word index for tracking
    wordIndex = 0;
  
    // UI updates
    // Create an array of span elements so we can set a class
    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    // Convert into string and set as innerHTML on quote display
    quoteElement.innerHTML = spanWords.join('');
    // Highlight the first word
    quoteElement.childNodes[0].className = 'highlight';
    // Clear any prior messages
    messageElement.innerText = '';
  
    // Setup the textbox
    typedValueElement.style.display="inline-block";
    // Clear the textbox
    typedValueElement.value = '';
    // set focus
    typedValueElement.focus();
    // set the event handler
    typedValueElement.addEventListener('input', () => {
      // Get the current word
      const currentWord = words[wordIndex];
      // get the current value
      const typedValue = typedValueElement.value;
    
      if (typedValue === currentWord && wordIndex === words.length - 1) {
        // end of sentence
        // Display success
        const elapsedTime = ((new Date().getTime() - startTime) / 1000);
        replaceTime(elapsedTime);
        const message = `CONGRATULATIONS! You finished in ${elapsedTime} seconds.`;
        endgameMessageElement.innerText = message;
        modal.style.display="block";
        removeEventListener('input', typedValueElement);
        typedValueElement.style.display="none";
      } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // end of word
        // clear the typedValueElement for the new word
        typedValueElement.value = '';
        // move to the next word
        wordIndex++;
        // reset the class name for all elements in quote
        for (const wordElement of quoteElement.childNodes) {
          wordElement.className = '';
        }
        // highlight the new word
        quoteElement.childNodes[wordIndex].className = 'highlight';
      } else if (currentWord.startsWith(typedValue)) {
        // currently correct
        // highlight the next word
        typedValueElement.className = '';
      } else {
        // error state
        typedValueElement.className = 'error';
      }
    });
    // Start the timer
    startTime = new Date().getTime();
  });

  //Button for testing to instantly end the current quote
document.getElementById('quickend').addEventListener('click', () => {
  const elapsedTime = ((new Date().getTime() - startTime) / 1000);
  replaceTime(elapsedTime);
  const message = `CONGRATULATIONS! You finished in ${elapsedTime} seconds.`;
  endgameMessageElement.innerText = message;
  modal.style.display="block";
  removeEventListener('input', typedValueElement);
  typedValueElement.style.display="none";
});