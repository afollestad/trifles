class CastSenderManager {
  constructor() {
    this.onMessage = new Rx.Subject();
    let self = this;
    window['__onGCastApiAvailable'] = (loaded, errorInfo) => {
      if (loaded) {
        self.initializeCastApi();
      } else {
        console.log(errorInfo);
      }
    };
  }

  /**
   * @returns {CastSenderManager}
   */
  static create() {
    return new CastSenderManager();
  }

  initializeCastApi() {
    console.log('initializeCastApi()');
    const sessionRequest = new chrome.cast.SessionRequest(Settings.appId);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, this.sessionListener, this.receiverListener);
    chrome.cast.initialize(apiConfig, this.onInitSuccess, this.onError);
  }

  // noinspection JSMethodCanBeStatic
  onInitSuccess() {
    console.log('onInitSuccess()');
  }

  // noinspection JSMethodCanBeStatic
  onError(message) {
    console.log(`onError(): ${message}`);
  }

  // noinspection JSMethodCanBeStatic
  onSuccess(message) {
    console.log(`onSuccess(): ${message}`);
  }

  // noinspection JSMethodCanBeStatic
  onStopSuccess() {
    console.log('onStopSuccess()');
  }

  sessionListener(e) {
    console.log('New session: ' + e.sessionId);
    this.session = e;
    let self = this;

    this.session.addUpdateListener((isAlive) => {
      console.log((isAlive ? 'Session updated' : 'Session removed') + ': ' + self.session.sessionId);
      if (!isAlive) {
        self.session = null;
        window.location.href = '/';
      }
    });
    this.session.addMessageListener(Settings.namespace, (namespace, message) => {
      console.log(`Got message (${namespace}): ${message}`);
      const messageObj = JSON.parse(message);
      if (messageObj.type === 'error') {
        alert(messageObj.error);
      } else {
        this.onMessage.onNext(messageObj);
      }
    });
  }

  // noinspection JSMethodCanBeStatic
  receiverListener(availability) {
    console.log(`Receiver availability: ${availability}`);
  }

  /**
   * @param {object|string} message
   */
  sendMessage(message) {
    if (typeof message === 'string') {
      message = {type: message};
    }
    if (this.session !== null) {
      console.log(`Sending message: ${message}`);
      this.session.sendMessage(Settings.namespace, message,
        this.onSuccess.bind(this, `Message sent: ${JSON.stringify(message)}`),
        this.onError);
    } else {
      console.log('Requesting a session...');
      let self = this;
      chrome.cast.requestSession((newSession) => {
        self.sessionListener(newSession);
        self.sendMessage(message);
      }, this.onError);
    }
  }

  stopApp() {
    console.log('Stopping the session...');
    this.session.stop(this.onStopSuccess, this.onError);
  }

  /**
   * @returns Observable.<any>
   */
  onMessages() {
    return this.onMessage.asObservable();
  }
}

window.CastSenderManager = CastSenderManager;
