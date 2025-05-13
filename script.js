let letters = [];
let letterIndex = 0;
let timeoutId;
//Starting time for scoring purposes
let startTime= Date.now();
//page elements
const typeElement = document.getElementById('blastletter');
const pointsElement = document.getElementById('points');
const modal = document.getElementById('myModal');
const restartButton = document.getElementById('restartbtn');
const endgameMessageElement = document.getElementById('endgamemsg');
const leaderboard = document.querySelectorAll('.highscores li');
const topScores = [0, 0, 0, 0, 0]; //Initializes leaderboard as all 0s
var scoresShown = 0; //Tracker for how many scores have been recorded
var delayBetweenLetters = 10; //TODO: Placeholder for now, max delay between letters if previous letter not typed, maybe add min delay too?
var pointsTotal = 0; //Tracker for points
const mapScores = new Map();
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
  return ((localStorage.getItem(scoreCheck) === null) || (localStorage.getItem(scoreCheck) === 'null') || (newScore > (localStorage.getItem(scoreCheck)))); 
}

function replaceScore(newScore) { //Checks if the new score is higher than the score in the ranking and increments scoresShown if less than 5
  console.log("replacing score");
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
  else if (compareScore(newScore, "Fourth")){
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
    // get a list of letters for typing
    const lettersToType = generateLetters(10); //TODO: Change # of letters based on difficulty(to be added)
    // Put the quote into an array of letters
    letters = lettersToType.split('');
    // reset the word index for tracking
    letterIndex = 0;
    // reset points
    pointsTotal = 0;
  
    // UI updates
    // Convert into string and set as innerHTML on quote display
    typeElement.innerHTML = letters[letterIndex]; //may require multiple elements for multiple letters at a time
    // Clear any prior messages
    pointsElement.innerText = 0;

    createTimeout(10000); // 10s timeout, change as needed
    // Attach window event listener
    window.addEventListener("keydown", handleKeyDown);
    // Start the timer
    startTime = new Date().getTime();
  });

    // Function for timeout if correct letter has not been inputed in time.
    const createTimeout = (delay) => {
      const myFunction = () => {
        letterIndex++;
        if (letterIndex === letters.length - 1) {
            const message = 'CONGRATULATIONS! You scored TODO points!'; //move to modal?
            endgameMessageElement.innerText = message;
            modal.style.display="block";
            window.removeEventListener('keydown', handleKeyDown);
            replaceScore(pointsTotal);
        }
        else {
          typeElement.innerHTML = letters[letterIndex];
          startTime = new Date().getTime();
        }
      };
      timeoutId = setTimeout(myFunction, delay);
    };

  function Addpoints (elapsedTime) {
    pointsTotal += Math.floor(100 * ((10 - elapsedTime) / 10));
    pointsElement.innerText = pointsTotal;
  }

  // Read keyboard down input and compare to letter
  function handleKeyDown(event) {
          // Get the current letter
      const currentletter = letters[letterIndex];
      // Get the current value
      const typedValue = event.key;
      console.log(typedValue);
      // If letter is correct and is the last letter
      if (typedValue === currentletter) {
        clearTimeout(timeoutId);
        const elapsedTime = ((new Date().getTime() - startTime) / 1000);
        Addpoints(elapsedTime);
        startTime = new Date().getTime();
        if (letterIndex === letters.length - 1) {
          const message = 'CONGRATULATIONS! You scored TODO points!'; //move to modal?
          typeElement.innerHTML = '';
          endgameMessageElement.innerText = message;
          modal.style.display="block";
          window.removeEventListener('keydown', handleKeyDown);
          replaceScore(pointsTotal);
        } else {
            letterIndex++;
            typeElement.innerHTML = letters[letterIndex];
            createTimeout(10000);
          //TODO: function to bypass delay and send next letter if multiple letters at a time are implemented
        }
      } else {
        // TODO: Screen effect for wrong letter, maybe screen shake?
        // TODO: function to disable input for x amount of time
      }
  }

  //Button for testing to instantly end the current quote
/*document.getElementById('quickend').addEventListener('click', () => {
  const elapsedTime = ((new Date().getTime() - startTime) / 1000);
  replaceTime(elapsedTime);
  const message = `CONGRATULATIONS! You finished in ${elapsedTime} seconds.`;
  endgameMessageElement.innerText = message;
  modal.style.display="block";
  removeEventListener('input', typedValueElement);
  typedValueElement.style.display="none";
});*/