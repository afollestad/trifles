class User {
  /**
   * @param {string} senderId
   * @param {string} nickname
   * @param {boolean} host
   * @param {number} score
   * @constructor
   */
  constructor(senderId, nickname, host, score) {
    this.senderId = senderId;
    this.nickname = nickname;
    this.host = host;
    this.score = score;
  }

  /**
   * @param {string} senderId
   * @param {string} nickname
   * @param {boolean} host
   * @param {number} score
   * @returns {User}
   */
  static create(senderId, nickname, host, score) {
    return new User(senderId, nickname, host, score);
  }
}

class UserManager {
  constructor() {
    this.participantsSub = new Rx.BehaviorSubject();
    this.loadFromStorage();
  }

  /**
   * @returns {UserManager}
   */
  static create() {
    return new UserManager();
  }

  loadFromStorage() {
    if (!this.participants) {
      let restored = window.localStorage.getItem('participants');
      if (restored) {
        this.participants = JSON.parse(restored);
        console.log(`Restored ${this.participants.length} users from local storage.`);
      }
    }
    if (!this.participants) {
      this.participants = [];
      window.localStorage.setItem('participants', JSON.stringify(this.participants));
    }
    this.participantsSub.onNext(this.participants);
  }

  saveToStorage() {
    console.log(`Saving ${this.participants.length} users to local storage.`);
    window.localStorage.setItem('participants', JSON.stringify(this.participants));
    this.participantsSub.onNext(this.participants);
  }

  /**
   * @param {User} user
   */
  put(user) {
    const index = this.participants.findIndex(it => it.senderId === user.senderId);
    if (index === -1) {
      if (user.nickname === '') {
        user.nickname = `Unnamed ${this.participants.length + 1}`;
      }
      this.participants.push(user);
      this.saveToStorage();
      console.log(`New participant: ${JSON.stringify(user)}`);
    }
  }

  /**
   * @param {string} senderId
   * @returns {User}
   */
  getParticipant(senderId) {
    return this.participants.find(user => user.senderId === senderId);
  }

  /**
   * @returns {User}
   */
  getHost() {
    return this.participants.find(user => user.host === true);
  }

  /**
   * @returns {Array.<User>}
   */
  getParticipants() {
    return this.participants;
  }

  /**
   * @returns {boolean}
   */
  hasParticipants() {
    return this.participants.length > 0;
  }

  /**
   * @param {string} senderId
   * @param {string} nickname
   */
  updateNickname(senderId, nickname) {
    const index = this.participants.findIndex(it => it.senderId === senderId);
    if (index !== -1) {
      console.log(`Updated participant ${senderId} nickname to ${nickname}.`);
      this.participants[index].nickname = nickname;
      this.saveToStorage();
    } else {
      throw new Error(`No participant found by sender ID ${senderId}`);
    }
  }

  /**
   * @param {number} timeLeft
   * @returns {number}
   */
  scoreForTimeLeft(timeLeft) {
    if (timeLeft <= maxSeconds / 3) {
      return 1;
    } else if (timeLeft <= maxSeconds / 2) {
      return 2;
    } else {
      return 3;
    }
  }

  /**
   * @param {string} senderId
   * @param {number} timeLeft
   * @returns {number}
   */
  incrementScore(senderId, timeLeft) {
    const index = this.participants.findIndex(it => it.senderId === senderId);
    if (index !== -1) {
      let addScore = this.scoreForTimeLeft(timeLeft);
      this.participants[index].score += addScore;
      this.saveToStorage();
      console.log(`Incremented participant ${senderId} score to ${this.participants[index].score}.`);
      return addScore;
    } else {
      throw new Error(`No participant found by sender ID ${senderId}`);
    }
  }

  /**
   * @param {User|string} user
   */
  remove(user) {
    let index;
    if (typeof user === 'string') {
      index = this.participants.findIndex(it => it.senderId === user);
    } else {
      index = this.participants.indexOf(user);
    }
    if (index !== -1) {
      console.log(`Removed participant ${this.participants[index].senderId}`);
      this.participants.splice(index, 1);
      this.saveToStorage();
    }
  }

  resetScores() {
    for (let i = 0; i < this.participants.length; i++) {
      this.participants[i].score = 0;
    }
    this.saveToStorage();
    console.log('Scores reset.');
  }

  clear() {
    this.participants = [];
    this.saveToStorage();
    console.log('Participants reset.');
  }

  /**
   * @returns Observable.<User[]>
   */
  onParticipants() {
    return this.participantsSub.asObservable();
  }
}

window.User = User;
window.UserManager = UserManager;