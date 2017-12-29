class CastReceiverManager {
  /**
   * @param {UserManager} userManager
   */
  constructor(userManager) {
    this.onMessage = new Rx.Subject();
    this.userManager = userManager;

    let self = this;
    this.manager = cast.receiver.CastReceiverManager.getInstance();
    this.manager.onReady = (event) => {
      console.log(`Received ready event: ${JSON.stringify(event.data)}`);
      self.manager.setApplicationState('Ready to play!');
    };
    this.manager.onSenderConnected = (event) => {
      console.log(`Sender connected: ${event.senderId}, ${event.userAgent}`);
      this.userManager.put(User.create(event.senderId, '', !this.userManager.hasParticipants(), 0));
    };
    this.manager.onSenderDisconnected = (event) => {
      console.log(`Sender disconnected: ${event.senderId}, ${event.userAgent}, ${event.reason}`);
      this.userManager.remove(event.senderId);
      if (self.manager.getSenders().length === 0
        && event.reason === cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
        this.userManager.clear();
        window.close();
      }
    };
    // this.manager.onSystemVolumeChanged = (event) => {
    //   console.log(`Received System volume changed event: ${JSON.stringify(event)}`);
    // };

    this.messenger = this.manager.getCastMessageBus(Settings.namespace);
    this.messenger.onMessage = (event) => {
      console.log(`Received payload: ${event['data']}`);
      const payload = JSON.parse(event['data']);
      payload.senderId = event.senderId;
      self.onMessage.onNext(payload);
    };
  }

  /**
   * @param {UserManager} userManager
   * @returns {CastReceiverManager}
   */
  static create(userManager) {
    return new CastReceiverManager(userManager);
  }

  start() {
    this.manager.start({
      maxInactivity: Settings.maxInactivity,
      statusText: 'Ready to play'
    });
  }

  /**
   * @param {string|User} to
   * @param {object|string} message
   */
  sendMessage(to, message) {
    let senderId;
    if (typeof to === 'string') {
      senderId = to;
    } else {
      senderId = to.senderId;
    }
    if (typeof message === 'string') {
      message = {type: message};
    }
    const dataStr = JSON.stringify(message);
    console.log(`Sending to ${senderId}: ${dataStr}`);
    this.messenger.sendMessage(senderId, message);
  }

  /**
   * @param {string|User} to
   * @param {string} message
   */
  sendError(to, message) {
    const data = {
      type: 'error',
      error: message
    };
    this.sendMessage(to, data);
  }

  /**
   * @param {object|string} message
   */
  broadcast(message) {
    if (typeof message === 'string') {
      message = {type: message};
    }
    const dataStr = JSON.stringify(message);
    console.log(`Broadcasting: ${dataStr}`);
    this.messenger.broadcast(dataStr);
  }

  /**
   * @returns {Observable.<any>}
   */
  onMessages() {
    return this.onMessage.asObservable();
  }
}

window.CastReceiverManager = CastReceiverManager;