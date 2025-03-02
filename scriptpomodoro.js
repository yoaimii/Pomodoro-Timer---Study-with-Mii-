document.addEventListener("DOMContentLoaded", function () {
  let timer;
  let timeLeft = 25 * 60; // 25 minutes
  let isRunning = false;
  let isPaused = false; // Ensure it's inside

  const timerDisplay = document.getElementById("timer");
  const startButton = document.getElementById("start");
  const pauseButton = document.getElementById("pause");
  const resetButton = document.getElementById("reset");
  const skipBreakButton = document.getElementById("skipBreak");
  const character = document.getElementById("character");

  // Selecting the notes textarea
const notesArea = document.getElementById("notes");

// Load saved notes from local storage when the page loads
notesArea.value = localStorage.getItem("pomodoroNotes") || "";

// Save notes to local storage whenever the user types
notesArea.addEventListener("input", () => {
    localStorage.setItem("pomodoroNotes", notesArea.value);
});


  // Debugging: Check if elements exist
  if (!timerDisplay || !startButton || !pauseButton || !resetButton) {
      console.error("Error: Could not find one or more elements.");
      return;
  }

  function updateTimerDisplay() {
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function updateCharacter() {
    const characterText = document.getElementById("characterText");

    if (timeLeft === 25 * 60) { 
        character.src = "happy.png"; // Default character before starting
        characterText.textContent = "Let’s get started! 😊"; 
    } else if (timeLeft > 10 * 60) {
        character.src = "focused.png"; // Change to focused as soon as timer starts
        characterText.textContent = "Stay focused! You got this! 💪✨"; 
    } else if (timeLeft > 0) {
        character.src = "focused.png"; // Keep focused until last 10 minutes
        characterText.textContent = "Almost there! Keep going! 🔥"; 
    } else {
        character.src = "sleepy.png"; // Sleepy when time is up
        characterText.textContent = "Time’s up! Take a break! 😴☕"; 
    }
}


  function startTimer() {
      if (!isRunning) {
          isRunning = true;
          isPaused = false;
          timer = setInterval(() => {
              if (timeLeft > 0) {
                  timeLeft--;
                  updateTimerDisplay();
                  updateCharacter();
              } else {
                  clearInterval(timer);
                  isRunning = false;
                  playAlarm(); // Play sound when timer ends

                  // Move to Break session
                  startBreak(); //call break function instead of looping
              }
          }, 1000);
      }
  }

function startBreak() {
   // Switch to Short Break Mode
   timeLeft = 300; // 5 minutes (300 seconds)
   updateTimerDisplay();
   characterText.textContent = "Take a short break! ☕";
   character.src = "relaxed.png";

    // Enable "Skip Break" button
   skipBreakButton.style.display = "block"; //show the skip break button

   //start break timer 
   timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--,
          updateTimerDisplay();
        } else {
          clearInterval(timer);
          isRunning = false;
          playAlarm(),
          
          // Reset for next Pomodoro session
          timeLeft = 25 * 60;
          updateTimerDisplay();
          characterText.textContent = "Back to work! 💪";
          character.src = "focused.png";
          skipBreakButton.style.display = "none"; // Hide button again
        }
    }, 1000);
}



  function pauseTimer() {
      if (isRunning) {
          clearInterval(timer);
          isRunning = false;
          isPaused = true; // Mark the timer as paused
      }
  }

  function skipBreak() {
    clearInterval(timer); // Stop current break timer
    isRunning = false;
    timeLeft = 25 * 60; // Reset to 25 minutes (work session)
    characterText.textContent = "Back to work! 💪";
    character.src = "focused.png";
    skipBreakButton.style.display = "none"; // Hide button again

    updateTimerDisplay(); // Update the screen
    startTimer(); // ✅ Start the new Pomodoro session immediately
}

// Add event listener to the button
skipBreakButton.addEventListener("click", skipBreak);


  function resetTimer() {
      clearInterval(timer);
      isRunning = false;
      isPaused = false;
      timeLeft = 25 * 60;
      updateTimerDisplay();
      updateCharacter();
      
      let alarmSound = new Audio("cute_alarm.mp3");
      alarmSound.pause(); // Stop the sound if playing
      alarmSound.currentTime = 0; // Reset audio to start
  }

  function playAlarm() {
      let alarmSound = new Audio("cute_alarm.mp3");
      alarmSound.play();
  }

  // Add event listeners
  startButton.addEventListener("click", startTimer);
  pauseButton.addEventListener("click", pauseTimer);
  resetButton.addEventListener("click", resetTimer);
  

  // Initialize Display
  updateTimerDisplay();
});

