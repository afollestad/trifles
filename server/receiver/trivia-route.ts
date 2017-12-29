import {Route} from '../base-route';
import {NextFunction} from 'express';

export class TriviaRoute extends Route {

  url(): string {
    return '/receiver/trivia';
  }

  activate(req, res, next: NextFunction): void {
    this.view('receiver/trivia');
  }
}