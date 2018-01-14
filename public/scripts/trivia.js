const questionAmount = 100;
const showAnswerTime = 5000;

let allQuestions = [];
let questionIndex = -1;
let timerManager;
let acceptingGuesses = false;

let currentQuestionFrame;
let correctAnswerFrame;
let progressFrame;

let categoryText;
let questionText;
let countdownText;
let answersList;
let correctAnswerText;
let correctUsersList;
let guessesList;

let timeout;

function fetchQuestions() {
  currentQuestionFrame.hide();
  correctAnswerFrame.hide();
  progressFrame.show();

  window.triviaManager.getQuestions(questionAmount, document.cookie)
    .subscribe(questions => {
      allQuestions = questions;
      questionIndex = -1;
      nextQuestion();
    });
}

function nextQuestion() {
  if (questionIndex + 1 >= allQuestions.length) {
    window.location.hash = '#gameover';
    return;
  }

  guessesList.empty();
  currentQuestionFrame.show();
  correctAnswerFrame.hide();
  progressFrame.hide();
  questionIndex++;

  let currentQuestion = allQuestions[questionIndex];
  categoryText.html(currentQuestion.category);
  questionText.html(currentQuestion.question);

  let answers = currentQuestion.all_answers;
  answersList.empty();
  let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  for (let i = 0; i < answers.length; i++) {
    answersList.append('<p class="answer-option card">' + letters[i] + '. ' + unescape(answers[i]) + '</p>');
  }

  window.castReceiverManager.broadcast({
    type: 'answers',
    answers: answers
  });

  timerManager.start();
  acceptingGuesses = true;
}

function showAnswer() {
  window.castReceiverManager.broadcast('times-up');
  acceptingGuesses = false;

  currentQuestionFrame.hide();
  correctAnswerFrame.show();
  const correctAnswer = allQuestions[questionIndex].correct_answer;
  correctAnswerText.text(correctAnswer);

  correctUsersList.empty();
  let correctGuesses = window.guessManager.check(correctAnswer);
  if (correctGuesses.length > 0) {
    for (let i = 0; i < correctGuesses.length; i++) {
      let guessPair = correctGuesses[i];
      let guess = guessPair.guess;
      let addedScore = guessPair.addedScore;
      correctUsersList.append('<li class="green">+' + addedScore + ' ' + guess.user.nickname + '</li>');
    }
  } else {
    correctUsersList.append('<li class="red">No correct guesses!</li>');
  }

  timeout = setTimeout(function () {
    nextQuestion();
  }, showAnswerTime);
}

function listenForMessages() {
  window.guessManager = window.GuessManager.create(window.userManager);

  addSubscription(
    window.castReceiverManager.onMessages()
      .subscribe(function (message) {
        const senderId = message.senderId;
        const type = message.type;
        const user = window.userManager.getParticipant(senderId);
        switch (type) {
          case 'guess':
            if (!user) {
              window.castReceiverManager.sendError(senderId, 'You are not in this game.');
              return;
            } else if (acceptingGuesses !== true) {
              window.castReceiverManager.sendError(senderId, 'Guesses are not being accepted.');
              return;
            }
            console.log(`Got a guess from user ${senderId}!`);
            window.guessManager.put(window.Guess.create(user, message.guess, timerManager.getTimeLeft()));
            break;
          case 'end-game':
            if (user.host !== true) {
              window.castReceiverManager.sendError(senderId, 'You cannot end the game.');
              return;
            }
            if (timeout) {
              clearTimeout(timeout);
            }
            window.location.hash = '#gameover';
            break;
        }
      }));

  window.guessManager.onGuesses().subscribe(function (guesses) {
    guessesList.empty();
    for (let i = 0; i < guesses.length; i++) {
      guessesList.append('<li>' + guesses[i].user.nickname + "</li>");
    }
    if (guesses.length === window.userManager.getParticipants().length) {
      if (timerManager) {
        timerManager.stop();
      }
      showAnswer();
    }
  });
}

$(document).ready(function () {
  currentQuestionFrame = $('#currentQuestionFrame');
  correctAnswerFrame = $('#correctAnswerFrame');
  progressFrame = $('#progressFrame');

  categoryText = $('#questionCategory');
  questionText = $('#questionText');
  countdownText = $('#countdownText');
  answersList = $('#answers');
  correctAnswerText = $('#correct-answer-text');
  correctUsersList = $('#correctUsers');
  guessesList = $('#guesses');

  timerManager = window.TimerManager.create(countdownText, () => {
    showAnswer();
  });

  listenForMessages();
  fetchQuestions();

  window.castReceiverManager.broadcast('game-started');
});


window.addEventListener("beforeunload", function () {
  console.log('Unload');
  if (timeout) {
    clearTimeout(timeout);
  }
  if (timerManager) {
    timerManager.stop();
  }
});
