class Guess {
  /**
   * @param {User} user
   * @param {string} guess
   */
  constructor(user, guess) {
    this.user = user;
    this.guess = guess;
  }

  /**
   * @param {User} user
   * @param {string} guess
   * @returns {Guess}
   */
  static create(user, guess) {
    return new Guess(user, guess);
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
        this.userManager.incrementScore(guess.user.senderId);
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