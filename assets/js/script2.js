// variables for time, put questions on another script sheet to organize better
var currentQuestionIndex = 0;
var time = questions.length * 20;
var timerId;

// DOM variables
var timeEl = document.querySelector("#time");
var startBtn = document.querySelector("#startButton");
var submitBtn = document.querySelector("#submit-button");
var titleScreen = document.querySelector("#title-section");
var quizScreen = document.querySelector("#quiz-section");
var highScoreScreen = document.querySelector("#highscore-section");
var highScoreDisplay = document.querySelector("#highscore-display-section");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");

// DOM variables - these variables can be found on script1 sheet
var questionsEl = document.querySelector("#question");
var choicesEl = document.querySelector("#choices");

//function to start the game which will hide the start screen, reveal the questions, and start the timer
function startQuiz() {
    titleScreen.setAttribute("class", "hide");
    quizScreen.setAttribute("class", "show");
    timerId = setInterval(tick, 1000);
    timeEl.textContent = time;
    getQuestion();
}

//function to penalize player for incorrect answers and if player runs out of time
function tick() {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
        quizEnd();
    }
}

//function to get and display questions and choices. using loops to remove previous entries
function getQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    var titleEl = document.getElementById("question-title");
    titleEl.textContent = currentQuestion.title;
    choicesEl.innerHTML = "";
    currentQuestion.choices.forEach(function(choice, i) {
        var choiceNode = document.createElement("button");
        choiceNode.setAttribute("class", "choice");
        choiceNode.setAttribute("value", choice);
        choiceNode.textContent = i + 1 + ". " + choice;
        choiceNode.onclick = questionClick;
        choicesEl.appendChild(choiceNode);
    });
}

//function to tell if player is right or wrong.  If wrong player will be penalized and time will reduce.  Also determines if it is the end of the quiz
function questionClick() {
    if (this.value !== questions[currentQuestionIndex].answer) {
        time -= 15;
        if (time < 0) {
            time = 0;
        }
        timeEl.textContent = time;
        feedbackEl.textContent = "Wrong!";
    } else {
        feedbackEl.textContent = "Correct!";
    }
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
        feedbackEl.setAttribute("class", "feedback hide");
    }, 1000);
    currentQuestionIndex++;
    if (currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();
    }
}

//function for end of quiz, storing initials and high schore
function quizEnd() {
    clearInterval(timerId);
    var highscoreSectionEl = document.querySelector("#highscore-section");
    highscoreSectionEl.setAttribute("class", "show");
    var finalScoreEl = document.querySelector("#final-score");
    finalScoreEl.textContent = time;
    quizScreen.setAttribute("class", "hide");
}

//fucntion for saving the score and intitias in high scores
function saveHighscore() {
    var initials = initialsEl.value.trim();
    if (initials !== "") {
        var highscores =
            JSON.parse(window.localStorage.getItem("highscores")) || [];
        var newScore = {
            score: time,
            initials: initials
        };
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));
        window.location.href = "highscores.html";
    }
}

function checkForEnter(event) {
    if (event.key === "Enter") {
        saveHighscore();
    }
}

submitBtn.onclick = saveHighscore;

//start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;

//look up previous high scores
function printHighscores() {
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
    highscores.sort(function(a, b) {
        return b.score - a.score;
        console.log(highscores)
    });
    highscores.forEach(function(score) {
        var liTag = document.createElement("li");
        liTag.textContent = score.initials + " - " + score.score;
        var olEl = document.getElementById("highscores");
        olEl.appendChild(liTag);
    });
}

function clearHighscores() {
    window.localStorage.removeItem("highscores");
    window.location.reload();
}

document.getElementById("clear").onclick = clearHighscores;

printHighscores();