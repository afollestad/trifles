import {Route} from '../base-route';
import {NextFunction} from 'express';

export class ClientTriviaRoute extends Route {

  url(): string {
    return '/client/trivia';
  }

  activate(req, res, next: NextFunction): void {
    this.view('client/trivia');
  }
}