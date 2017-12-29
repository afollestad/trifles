import {Route} from '../base-route';
import {NextFunction} from 'express';

export class GameOverRoute extends Route {

  url(): string {
    return '/receiver/gameover';
  }

  activate(req, res, next: NextFunction): void {
    this.view('receiver/gameover');
  }
}