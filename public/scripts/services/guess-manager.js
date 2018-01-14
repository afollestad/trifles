class Guess {
  /**
   * @param {User} user
   * @param {string} guess
   * @param {number} timeLeft
   */
  constructor(user, guess, timeLeft) {
    this.user = user;
    this.guess = guess;
    this.timeLeft = timeLeft;
  }

  /**
   * @param {User} user
   * @param {string} guess
   * @param {number} timeLeft
   * @returns {Guess}
   */
  static create(user, guess, timeLeft) {
    return new Guess(user, guess, timeLeft);
  }
}

class GuessManager {
  /**
   * @param {UserManager} userManager
   */
  constructor(userManager) {
    this.userManager = userManager;
    this.guessesSubj = new Rx.Subject();
    this.guesses = [];
  }

  /**
   * @param {UserManager} userManager
   * @returns {GuessManager}
   */
  static create(userManager) {
    return new GuessManager(userManager);
  }

  /**
   * @param {Guess} guess
   */
  put(guess) {
    const userIndex = this.guesses.findIndex(it => it.user.senderId === guess.user.senderId);
    if (userIndex !== -1) {
      throw new Error(`User ${guess.user.senderId} already has a guess.`);
    }
    this.guesses.push(guess);
    this.guessesSubj.onNext(this.guesses);
    console.log(`Added guess from ${guess.user.nickname}: ${guess.guess}`);
  }

  /**
   * @param {string} correctAnswer
   * @returns {Array.<User>}
   */
  check(correctAnswer) {
    const correctUsers = [];
    for (let i = 0; i < this.guesses.length; i++) {
      const guess = this.guesses[i];
      if (guess.guess === correctAnswer) {
        correctUsers.push(guess.user);
        this.userManager.incrementScore(guess.user.senderId, guess.timeLeft);
        console.log(`User ${guess.user.nickname} WAS correct, with: ${guess.guess}!`);
      } else {
        console.log(`User ${guess.user.nickname} was not correct, with: ${guess.guess}...`);
      }
    }
    this.guesses = [];
    this.guessesSubj.onNext(this.guesses);
    return correctUsers;
  }

  /**
   * @returns Observable.<Guess[]>
   */
  onGuesses() {
    return this.guessesSubj.asObservable();
  }
}

window.Guess = Guess;
window.GuessManager = GuessManager;