const maxSeconds = 30;

class TimerManager {
  /**
   * @param {Element} countdownView
   * @param {function} onTimesUp
   */
  constructor(countdownView, onTimesUp) {
    this.countdownView = countdownView;
    this.onTimesUp = onTimesUp;
    this.countdownSeconds = 0;
  }

  /**
   * @param {Element} countdownView
   * @param {function} onTimesUp
   * @returns {TimerManager}
   */
  static create(countdownView, onTimesUp) {
    return new TimerManager(countdownView, onTimesUp);
  }

  start() {
    this.countdownSeconds = maxSeconds;
    this.updateCountdownSeconds();
    this.updateCountdownClass();
    this.tick();
  }

  updateCountdownSeconds() {
    let value = '-00:';
    if (this.countdownSeconds < 10) {
      value += '0';
    }
    value += this.countdownSeconds;
    this.countdownView.text(value);
  }

  updateCountdownClass() {
    this.countdownView.removeClass('red');
    this.countdownView.removeClass('orange');
    this.countdownView.removeClass('green');
    if (this.countdownSeconds <= maxSeconds / 3) {
      this.countdownView.addClass('red');
    } else if (this.countdownSeconds <= maxSeconds / 2) {
      this.countdownView.addClass('orange');
    } else {
      this.countdownView.addClass('green');
    }
  }

  tick() {
    let self = this;
    this.timeout = setTimeout(() => {
      if (self.countdownSeconds === 0) {
        self.onTimesUp();
        return;
      }
      self.countdownSeconds--;
      self.updateCountdownSeconds();
      self.updateCountdownClass();
      self.tick();
    }, 1000);
  }

  /**
   * @returns {number}
   */
  getTimeLeft() {
    return this.countdownSeconds;
  }

  stop() {
    this.countdownSeconds = 0;
    if(this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

window.TimerManager = TimerManager;